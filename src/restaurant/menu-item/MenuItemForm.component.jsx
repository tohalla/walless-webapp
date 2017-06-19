import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import {reduce, set, get, equals} from 'lodash/fp';
import PropTypes from 'prop-types';

import config from 'config';
import Input from 'components/Input.component';
import Button from 'components/Button.component';
import SelectItems from 'components/SelectItems.component';
import {
  createMenuItem,
  updateMenuItem,
  updateMenuItemFiles,
  createMenuItemInformation,
  updateMenuItemInformation
} from 'graphql/restaurant/menuItem.mutations';
import {getMenuItem} from 'graphql/restaurant/menuItem.queries';
import {getFilesForRestaurant} from 'graphql/restaurant/restaurant.queries';
import {getActiveAccount} from 'graphql/account/account.queries';
import Tabbed from 'components/Tabbed.component';
import ItemsWithLabels from 'components/ItemsWithLabels.component';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  languages: state.util.translation.languages
});

class MenuItemForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    createMenuItem: PropTypes.func.isRequired,
    updateMenuItem: PropTypes.func.isRequired,
    restaurant: PropTypes.object.isRequired,
    menuItem: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ])
  };
  constructor(props) {
    super(props);
    this.resetForm(props, state => this.state = state);
  }
  componentWillReceiveProps(newProps) {
    if (
      typeof this.props.menuItem !== typeof newProps.menuItem ||
      !equals(this.props.getMenuItem)(newProps.getMenuItem)
    ) {
      this.resetForm(newProps);
    }
  }
  resetForm = (props, updateState = this.setState) => {
    const {
      getMenuItem: {
        menuItem: {
          information,
          type,
          category,
          price = '',
          files = []
        }
      } = {menuItem: typeof props.menuItem === 'object' && props.menuItem ? props.menuItem : {}}
    } = props;
    updateState({
      activeLanguage: 'en',
      price,
      information,
      type,
      newImages: [],
      files: files ? new Set(
        files.map(item => item.id)
      ) : new Set(),
      category
    });
  }
  handleInputChange = path => event => {
    const {value} = event.target;
    this.setState(set(path)(value)(this.state));
  };
  handleSubmit = async e => {
    e.preventDefault();
    const {
      createMenuItem,
      updateMenuItem,
      updateMenuItemFiles,
      createMenuItemInformation,
      updateMenuItemInformation,
      getFilesForRestaurant: {data: {refetch}},
      restaurant: {id: restaurant, currency: {code: currency}},
      onSubmit,
      onError,
      getActiveAccount: {account} = {},
      getMenuItem: {
        menuItem: originalMenuItem
      } = {menuItem: typeof this.props.menuItem === 'object' ? this.props.menuItem : {}}
    } = this.props;
    const {
      newImages,
      files: filesSet,
      information,
      activeLanguage, // eslint-disable-line
      ...menuItemOptions
    } = this.state;
    const files = Array.from(filesSet);
    try {
      const formData = new FormData();
      formData.append('restaurant', restaurant);
      const allFiles = newImages.length ? files.concat(await (await fetch(
        `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.upload.endpoint}`,
        {
          method: 'POST',
          body: newImages.reduce(
            (prev, curr, index) => {
              prev.append(index, curr);
              return prev;
            },
            formData
          ),
          headers: {
            'authorization': Cookie.get('Authorization')
          }
        }
      )).json()) : files;
      const finalMenuItem = Object.assign({}, menuItemOptions,
        originalMenuItem ? {id: originalMenuItem.id} : null,
        {
          restaurant,
          currency,
          createdBy: account.id
        }
      );
      const {data} = await (originalMenuItem && originalMenuItem.id ?
        updateMenuItem(finalMenuItem) : createMenuItem(finalMenuItem)
      );
      const [mutation] = Object.keys(data);
      const {[mutation]: {menuItem: {id: menuItemId}}} = data;
      await Promise.all([updateMenuItemFiles(menuItemId, allFiles)].concat(
        Object.keys(information).map(key =>
          mutation !== 'createMenuItem' && get(['information', key])(originalMenuItem) ?
            updateMenuItemInformation(Object.assign({language: key, menuItem: menuItemId}, information[key]))
          : createMenuItemInformation(Object.assign({language: key, menuItem: menuItemId}, information[key]))
        )
      ));
      onSubmit();
      refetch();
    } catch (error) {
      if (typeof onError === 'function') {
       return onError(error);
      }
      throw new Error(error);
    };
  };
  handleDropzoneDelete = image => () => {
    this.setState({
      newImages: this.state.newImages.filter(i => !equals(i)(image))
    });
  };
  toggleImageSelect = image => {
    const files = this.state.files;
    if (!files.delete(image.id)) {
      files.add(image.id);
    }
    this.setState({files});
  };
  handleDrop = accepted => {
    this.setState({newImages: this.state.newImages.concat(accepted)});
  };
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  };
  handleTabChange = tab => this.setState({activeLanguage: tab});
  render() {
    const {
      t,
      getFilesForRestaurant = {},
      restaurant,
      languages
    } = this.props;
    const {
      files = [],
      newImages = [],
      activeLanguage,
      price
    } = this.state;
    const tabs = reduce((prev, value) => Object.assign({}, prev, {
      [value.locale]: {
        label: value.name,
        render: () => (
          <div>
            <Input
                className="block"
                label={t('restaurant.menuItems.name')}
                onChange={this.handleInputChange(['information', value.locale, 'name'])}
                value={get(['information', value.locale, 'name'])(this.state) || ''}
            />
            <Input
                className="block"
                label={t('restaurant.menuItems.description')}
                onChange={this.handleInputChange(['information', value.locale, 'description'])}
                rows={3}
                value={get(['information', value.locale, 'description'])(this.state) || ''}
            />
          </div>
        )
      }
    }), {})(languages);
    return (
      <form onSubmit={this.handleSubmit}>
        <Tabbed
            onTabChange={this.handleTabChange}
            tab={activeLanguage}
            tabs={tabs}
        />
        <div className="container container--padded">
          <ItemsWithLabels
              items={[
                {
                  label: t('restaurant.menuItems.price'),
                  item: (
                    <div>
                      <Input
                          className="input--small"
                          label={t('restaurant.menuItems.price')}
                          onChange={this.handleInputChange('price')}
                          pattern="^\d+(\.\d{0,2})?$|^$"
                          required
                          value={price}
                      />
                      {get(['currency', 'symbol'])(restaurant)}
                    </div>
                  )
                }, {
                  label: t('restaurant.menuItems.images'),
                  item: (
                    <SelectItems
                        dropzone={{
                          items: newImages,
                          onDelete: this.handleDropzoneDelete,
                          onDrop: this.handleDrop
                        }}
                        select={{
                          items: getFilesForRestaurant.files,
                          selected: files,
                          onToggleSelect: this.toggleImageSelect
                        }}
                    />
                  )
                }
            ]}
          />
        </div>
        <div className="container--row">
          <Button colored onClick={this.handleSubmit} raised type="submit">
            {t('submit')}
          </Button>
          <Button accent onClick={this.handleCancel} raised type="reset">
            {t('cancel')}
          </Button>
        </div>
      </form>
    );
  }
}

export default compose(
  createMenuItem,
  updateMenuItem,
  updateMenuItemFiles,
  getMenuItem,
  getActiveAccount,
  getFilesForRestaurant,
  createMenuItemInformation,
  updateMenuItemInformation
)(connect(mapStateToProps, {})(MenuItemForm));
