import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import Select from 'react-select';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import {reduce, set, get, equals} from 'lodash/fp';

import config from 'config';
import SelectItems from 'components/SelectItems.component';
import {getActiveAccount} from 'graphql/account/account.queries';
import Input from 'components/Input.component';
import Button from 'components/Button.component';
import {
  createRestaurant,
  updateRestaurant,
  createRestaurantInformation,
  updateRestaurantInformation,
  updateRestaurantImages
  } from 'graphql/restaurant/restaurant.mutations';
import {getCurrencies} from 'graphql/misc.queries';
import {
  getRestaurant,
  getImagesForRestaurant
} from 'graphql/restaurant/restaurant.queries';
import Tabbed from 'components/Tabbed.component';
import ItemsWithLabels from 'components/ItemsWithLabels.component';

const mapStateToProps = state => ({
  languages: state.util.translation.languages,
  t: state.util.translation.t
});

class RestaurantForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onCancel: PropTypes.func,
    createRestaurant: PropTypes.func.isRequired,
    updateRestaurant: PropTypes.func.isRequired,
    restaurant: PropTypes.oneOfType([
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
      typeof this.props.restaurant !== typeof newProps.restaurant ||
      !equals(this.props.getRestaurant)(newProps.getRestaurant)
    ) {
      this.resetForm(newProps);
    }
  }
  resetForm = (props, updateState = this.setState) => {
    const {
      restaurant: {
        information,
        images: selectedFiles
      } = typeof props.restaurant === 'object' && props.restaurant ? props.restaurant : {}
    } = props;
    updateState({
      information,
      activeLanguage: 'en',
      currency: 'EUR',
      newImages: [],
      selectedFiles: selectedFiles ? new Set(
        selectedFiles.map(item => item.id)
      ) : new Set()
    });
  };
  handleInputChange = path => event => {
    const {value} = event.target;
    this.setState(set(path)(value)(this.state));
  };
  handleSubmit = async(e) => {
    e.preventDefault();
    const {
      createRestaurant,
      updateRestaurant,
      getImagesForRestaurant,
      createRestaurantInformation,
      updateRestaurantInformation,
      updateRestaurantImages,
      onSubmit,
      onError,
      account,
      restaurant: originalRestaurant = typeof this.props.restaurant === 'object' ? this.props.restaurant : {}
    } = this.props;
    const {
      newImages = [],
      selectedFiles,
      activeLanguage, // eslint-disable-line
      information,
      ...restaurantOptions
    } = this.state;
    const finalRestaurant = Object.assign({}, restaurantOptions,
      originalRestaurant.id ? {id: originalRestaurant.id} : null,
      {createdBy: account.id}
    );
    const files = Array.from(selectedFiles);
    try {
      const {data} = await (originalRestaurant && originalRestaurant.id ?
        updateRestaurant(finalRestaurant) : createRestaurant(finalRestaurant)
      );
      const [mutation] = Object.keys(data);
      const {[mutation]: {restaurant: {id: restaurantId}}} = data;
      const formData = new FormData();
      formData.append('restaurant', restaurantId);
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
      await Promise.all(
        [updateRestaurantImages(restaurantId, allFiles)].concat(
          Object.keys(information).map(key =>
            mutation !== 'createRestaurant' && get(['information', key])(originalRestaurant) ?
              updateRestaurantInformation(Object.assign({language: key, restaurant: restaurantId}, information[key]))
            : createRestaurantInformation(Object.assign({language: key, restaurant: restaurantId}, information[key]))
          )
        )
      );
      onSubmit();
      getImagesForRestaurant.refetch();
    } catch (error) {
      if (typeof onError === 'function') {
       return onError(error);
      }
      throw new Error(error);
    };
  };
  handleTabChange = tab => this.setState({activeLanguage: tab});
  handleCurrencyChange = ({value: currency}) => this.setState({currency});
  handleDropzoneDelete = image => () => {
    this.setState({
      newImages: this.state.newImages.filter(i => !equals(i)(image))
    });
  };
  toggleImageSelect = image => {
    const selectedFiles = this.state.selectedFiles;
    if (!selectedFiles.delete(image.id)) {
      selectedFiles.add(image.id);
    }
    this.setState({selectedFiles});
  };
  handleDrop = accepted => {
    this.setState({newImages: this.state.newImages.concat(accepted)});
  };
  handleCancel = event => {
    event.preventDefault();
    this.props.onCancel();
  }
  render() {
    const {
      t,
      onCancel,
      languages,
      images,
      currencies = []
    } = this.props;
    const {
      activeLanguage,
      information,
      selectedFiles = new Set(),
      newImages = []
    } = this.state;
    const tabs = reduce((prev, value) => Object.assign({}, prev, {
      [value.locale]: {
        label: value.name,
        render: () => (
          <div>
            <Input
                className="block"
                label={t('restaurant.name')}
                onChange={this.handleInputChange(['information', value.locale, 'name'])}
                type="text"
                value={get([value.locale, 'name'])(information) || ''}
            />
            <Input
                className="block"
                label={t('restaurant.description')}
                onChange={this.handleInputChange(['information', value.locale, 'description'])}
                rows={3}
                type="text"
                value={get([value.locale, 'description'])(information) || ''}
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
          <div className="container__row">
            <ItemsWithLabels
                items={[
                  {
                    label: t('currency'),
                    item: (
                      <Select
                          autoBlur
                          className="Select input--medium"
                          clearable={false}
                          id="currency"
                          onChange={this.handleCurrencyChange}
                          options={
                            currencies.map(value => ({
                              value: value.code,
                              label: `${value.code} (${value.symbol}) - ${value.name}`
                            }))
                          }
                          value={this.state.currency}
                      />
                    )
                  }, {
                    label: t('restaurant.images'),
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
                            onToggleSelect: this.toggleImageSelect
                          }}
                      />
                    )
                  }
                ]}
            />
          </div>
        </div>
        <div>
          <Button colored onClick={this.handleSubmit} raised type="submit">
            {t('submit')}
          </Button>
          {typeof onCancel === 'function' ?
            <Button accent onClick={this.handleCancel} raised type="reset">
              {t('cancel')}
            </Button>
            : null
          }
        </div>
      </form>
    );
  }
}

export default compose(
  connect(mapStateToProps, {}),
  createRestaurant,
  updateRestaurant,
  getActiveAccount,
  getRestaurant,
  createRestaurantInformation,
  updateRestaurantInformation,
  getCurrencies,
  getImagesForRestaurant,
  updateRestaurantImages
)(RestaurantForm);
