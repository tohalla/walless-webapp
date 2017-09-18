import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import {
  reduce,
  set,
  get,
  pick,
  equals,
  findIndex
} from 'lodash/fp';

import Checkbox from 'components/Checkbox.component';
import Select from 'components/Select.component';
import config from 'config';
import OptionForm from 'restaurant/menu-item/OptionForm.component';
import Option from 'restaurant/menu-item/Option.component';
import Input from 'components/Input.component';
import Form from 'components/Form.component';
import SelectItems from 'components/SelectItems.component';
import {
  createMenuItem,
  updateMenuItem,
  updateMenuItemImages,
  createMenuItemI18n,
  updateMenuItemDiets,
  updateMenuItemI18n,
  updateMenuItemOptions
} from 'graphql/restaurant/menuItem.mutations';
import {
  getMenuItem,
  getMenuItemTypes
} from 'graphql/restaurant/menuItem.queries';
import {getDiets} from 'graphql/misc.queries';
import {getImagesForRestaurant} from 'graphql/file.queries';
import {getActiveAccount} from 'graphql/account/account.queries';
import Tabbed from 'components/Tabbed.component';
import ItemsWithLabels from 'components/ItemsWithLabels.component';
import loadable from 'decorators/loadable';

const TextArea = props => <textarea {...props} />;

const mapStateToProps = state => ({
  t: state.util.translation.t,
  languages: state.util.translation.languages,
  language: state.util.translation.language
});

@loadable()
@Radium
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
    this.resetForm(props, state => this.state = state); // eslint-disable-line
  }
  componentWillReceiveProps(newProps) {
    if (
      typeof this.props.menuItem !== typeof newProps.menuItem ||
      !equals(this.props.getMenuItem)(newProps.getMenuItem)
    ) {
      this.resetForm(newProps);
    }
  }
  resetForm = (props, updateState = state => this.setState(state)) => {
    const {
      menuItem: {
        i18n,
        menuItemCategory,
        menuItemType,
        diets = [],
        price = '',
        images = [],
        options = []
      } = typeof props.menuItem === 'object' && props.menuItem ? props.menuItem : {}
    } = props;
    updateState({
      activeLanguage: 'en',
      price,
      i18n,
      newImages: [],
      selectedFiles: images ? new Set(
        images.map(item => item.id)
      ) : new Set(),
      diets: diets ? new Set(
        diets.map(item => item.id)
      ) : new Set(),
      type: get(['id'])(menuItemType),
      category: get(['id'])(menuItemCategory),
      options
    });
  };
  handleInputChange = (path, getValue = item => item.target.value) => item =>
    this.setState(set(path)(getValue(item))(this.state));
  handleSubmit = async(e) => {
    e.preventDefault();
    const {
      createMenuItem,
      updateMenuItem,
      updateMenuItemImages,
      updateMenuItemDiets,
      createMenuItemI18n,
      updateMenuItemI18n,
      updateMenuItemOptions,
      getImagesForRestaurant,
      restaurant: {id: restaurant, currency: {code: currency}},
      onSubmit,
      onError,
      menuItem: originalMenuItem = typeof this.props.menuItem === 'object' ? this.props.menuItem : {}
    } = this.props;
    const {newImages, options, i18n} = this.state;
    const diets = Array.from(this.state.diets);
    const files = Array.from(this.state.selectedFiles);
    try {
      const formData = new FormData();
      formData.append('restaurant', restaurant);
      const allFiles = newImages.length ? files.concat(await (await fetch(
        `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.upload.endpoint}/image`,
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
      const finalMenuItem = Object.assign(
        pick(['price', 'type', 'category'])(this.state),
        originalMenuItem ? {id: originalMenuItem.id} : null,
        {restaurant, currency}
      );
      const {data} = await (originalMenuItem && originalMenuItem.id ?
        updateMenuItem(finalMenuItem) : createMenuItem(finalMenuItem)
      );
      const [mutation] = Object.keys(data);
      const {[mutation]: {menuItem: {id: menuItemId}}} = data;
      await Promise.all([].concat(
        equals(allFiles)(originalMenuItem.images && originalMenuItem.images.map(i => i.id)) ?
          [] : updateMenuItemImages(menuItemId, allFiles),
        equals(diets)(originalMenuItem.diets && originalMenuItem.diets.map(i => i.id)) ?
          [] : updateMenuItemDiets(menuItemId, diets),
        equals(options.map(i => i.id))(originalMenuItem.options && originalMenuItem.options.map(i => i.id)) ?
          [] : updateMenuItemOptions(menuItemId, options.map(option =>
            set('menuItem')(menuItemId)(option)
          )),
        Object.keys(i18n).map(key =>
          mutation !== 'createMenuItem' && get(['i18n', key])(originalMenuItem) ?
            updateMenuItemI18n(Object.assign({language: key, menuItem: menuItemId}, i18n[key]))
          : createMenuItemI18n(Object.assign({language: key, menuItem: menuItemId}, i18n[key]))
        )
      ));
      onSubmit();
      getImagesForRestaurant.refetch();
    } catch (error) {
      if (typeof onError === 'function') {
       return onError(error);
      }
      throw new Error(error);
    };
  };
  handleAddOption = option =>
    this.setState({options: [].concat(this.state.options, option)});
  handleEditOption = (option, oldOption) => {
    const index = findIndex(o => oldOption.id === o.id)(this.state.options);
    if (index !== -1) {
      const options = this.state.options.slice();
      options[index] = option;
      this.setState({options});
    }
  };
  handleDropzoneDelete = image => () => this.setState({
    newImages: this.state.newImages.filter(i => !equals(i)(image))
  });
  toggleImage = image => {
    const selectedFiles = this.state.selectedFiles;
    if (!selectedFiles.delete(image.id)) {
      selectedFiles.add(image.id);
    }
    this.setState({selectedFiles});
  };
  toggleDiet = diet => () => {
    const diets = this.state.diets;
    if (!diets.delete(diet.id)) {
      diets.add(diet.id);
    }
    this.setState({diets});
  };
  handleDrop = accepted =>
    this.setState({newImages: this.state.newImages.concat(accepted)});
  handleCancel = event => this.props.onCancel();
  handleTabChange = tab => this.setState({activeLanguage: tab});
  render() {
    const {
      t,
      images,
      restaurant,
      languages,
      menuItemTypes,
      diets,
      language
    } = this.props;
    const {
      selectedFiles,
      newImages = [],
      options = [],
      activeLanguage,
      price,
      type,
      category,
      diets: selectedDiets
    } = this.state;
    const categories = type && menuItemTypes.length ?
      (menuItemTypes.find(i => i.id === type).menuItemCategories || []) : [];
    const tabs = reduce((prev, value) => Object.assign({}, prev, {
      [value.locale]: {
        label: value.name,
        content: (
          <div>
            <Input
                label={t('restaurant.menuItem.name')}
                onChange={this.handleInputChange(['i18n', value.locale, 'name'])}
                value={get(['i18n', value.locale, 'name'])(this.state) || ''}
            />
            <Input
                Input={TextArea}
                label={t('restaurant.menuItem.description')}
                onChange={this.handleInputChange(['i18n', value.locale, 'description'])}
                rows={3}
                value={get(['i18n', value.locale, 'description'])(this.state) || ''}
            />
          </div>
        )
      }
    }), {})(languages);
    return (
      <Form onCancel={this.handleCancel} onSubmit={this.handleSubmit}>
        <Tabbed
            onTabChange={this.handleTabChange}
            tab={activeLanguage}
            tabs={tabs}
        />
        <ItemsWithLabels
            items={[
              {
                item: (
                  <Input
                      afterInput={get(['currency', 'symbol'])(restaurant)}
                      label={t('restaurant.menuItem.price')}
                      onChange={this.handleInputChange('price')}
                      pattern="^\d+(\.\d{0,2})?$|^$"
                      required
                      value={price}
                  />
                )
              },
              {
                label: t('restaurant.menuItem.type'),
                item: (
                  <Select
                      autoBlur
                      clearable={false}
                      id="cateogry"
                      onChange={this.handleInputChange('type', item => item.value)}
                      options={
                        menuItemTypes.map(type => ({
                          value: type.id,
                          label: type.name
                        }))
                      }
                      value={type}
                  />
                )
              },
              categories.length ? {
                label: t('restaurant.menuItem.category'),
                item: (
                  <Select
                      autoBlur
                      clearable={false}
                      id="cateogry"
                      onChange={this.handleInputChange('category', item => item.value)}
                      options={categories.map(category => ({
                        value: category.id,
                        label: category.name
                      }))}
                      value={category}
                  />
                )
              } : null, {
                label: t('restaurant.menuItem.images'),
                item: (
                  <SelectItems
                      dropzone={{
                        items: newImages,
                        onDelete: this.handleDropzoneDelete,
                        onDrop: this.handleDrop
                      }}
                      select={{
                        items: images,
                        selected: selectedFiles,
                        onToggleSelect: this.toggleImage
                      }}
                  />
                )
              },
              diets.length ? {
                label: t('restaurant.menuItem.diets'),
                item: diets.map((diet, index) => (
                  <Checkbox
                      checked={selectedDiets.has(diet.id)}
                      key={index}
                      label={get(['i18n', language, 'name'])(diet)}
                      onClick={this.toggleDiet(diet)}
                  />
                ))
              } : null,
              {
                label: t('restaurant.menuItem.options'),
                item: (
                  <div>
                    {options.map((option, index) => (
                      <Option
                          disabledOptions={options}
                          key={index}
                          onEdit={this.handleEditOption}
                          option={option}
                      />
                    ))}
                    <OptionForm
                        disabledOptions={options}
                        onSubmit={this.handleAddOption}
                    />
                  </div>
                )
              }
          ]}
        />
      </Form>
    );
  }
}

export default compose(
  connect(mapStateToProps, {}),
  createMenuItem,
  updateMenuItem,
  updateMenuItemImages,
  getMenuItem,
  getActiveAccount,
  getImagesForRestaurant,
  createMenuItemI18n,
  updateMenuItemI18n,
  updateMenuItemDiets,
  getMenuItemTypes,
  getDiets,
  updateMenuItemOptions
)(MenuItemForm);
