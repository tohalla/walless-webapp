import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import Cookie from 'js-cookie';
import {set, get, equals, pick} from 'lodash/fp';
import {file, misc, restaurant, account} from 'walless-graphql';

import Input from 'components/Input';
import Form from 'components/Form';
import Select from 'components/Select';
import config from 'config';
import SelectItems from 'components/SelectItems';
import Tabbed from 'components/Tabbed';
import LocationInput from 'components/LocationInput';
import ItemsWithLabels from 'components/ItemsWithLabels';
import loadable from 'decorators/loadable';

@loadable()
@translate()
@Radium
class RestaurantForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    onCancel: PropTypes.func,
    createRestaurant: PropTypes.func.isRequired,
    updateRestaurant: PropTypes.func.isRequired,
    getRestaurant: PropTypes.object,
    languages: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      locale: PropTypes.string
    })),
    currencies: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      code: PropTypes.string
    })),
    i18n: PropTypes.shape({languages: PropTypes.arrayOf(PropTypes.string)}),
    images: PropTypes.arrayOf(PropTypes.object),
    restaurant: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    t: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.resetForm(props, state => this.state = state); // eslint-disable-line
  }
  componentWillReceiveProps(newProps) {
    if (
      typeof this.props.restaurant !== typeof newProps.restaurant ||
      !equals(this.props.getRestaurant)(newProps.getRestaurant)
    ) {
      this.resetForm(newProps);
    }
  }
  resetForm = (props, updateState = state => this.setState(state)) => {
    const {
      restaurant: {
        address = {},
        i18n,
        images: selectedFiles
      } = typeof props.restaurant === 'object' && props.restaurant ? props.restaurant : {},
      i18n: {languages: [language]}
    } = props;
    updateState({
      address,
      i18n,
      activeLanguage: language,
      currency: 'EUR',
      newImages: [],
      loading: false,
      selectedFiles: selectedFiles ? new Set(
        selectedFiles.map(item => item.id)
      ) : new Set()
    });
  };
  handleInputChange = path => event => {
    const {value} = event.target;
    this.setState(set(path)(value)(this.state));
  };
  handleSubmit = () => async() => {
    this.setState({loading: true});
    const {
      createRestaurant,
      updateRestaurant,
      getImagesForRestaurant,
      createRestaurantI18n,
      updateRestaurantI18n,
      updateRestaurantImages,
      createAddress,
      onSubmit,
      onError,
      account,
      restaurant: originalRestaurant = typeof this.props.restaurant === 'object' ? this.props.restaurant : {}
    } = this.props;
    const {
      newImages = [],
      selectedFiles,
      i18n,
      address = {}
    } = this.state;
    try {
      const addressId = !get('placeId')(address) ? null
        : get(['address', 'placeId'])(originalRestaurant) === address.placeId ?
          get(['address', 'id'])(originalRestaurant)
          : get(['data', 'createAddress', 'address', 'id'])(await createAddress(address));
      const finalRestaurant = Object.assign({},
        pick([
          'currency'
        ])(this.state),
        originalRestaurant.id ? {id: originalRestaurant.id} : null,
        {createdBy: account.id, address: addressId}
      );
      const files = Array.from(selectedFiles);
      const {data} = await (originalRestaurant && originalRestaurant.id ?
        updateRestaurant(finalRestaurant) : createRestaurant(finalRestaurant)
      );
      const [mutation] = Object.keys(data);
      const {[mutation]: {restaurant: {id: restaurantId}}} = data;
      const formData = new FormData();
      formData.append('restaurant', restaurantId);
      const allFiles = newImages.length ? files.concat(await (await fetch(
        `${config.api.protocol}://${config.api.url}${config.api.port === 80 ? '' : `:${config.api.port}`}/${config.api.upload.endpoint}/image`,
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
            authorization: Cookie.get('authorization')
          }
        }
      )).json()) : files;
      await Promise.all(
        [updateRestaurantImages(restaurantId, allFiles)].concat(
          Object.keys(i18n).map(key =>
            mutation !== 'createRestaurant' && get(['i18n', key])(originalRestaurant) ?
              updateRestaurantI18n(Object.assign({language: key, restaurant: restaurantId}, i18n[key]))
              : createRestaurantI18n(Object.assign({language: key, restaurant: restaurantId}, i18n[key]))
          )
        )
      );
      if (typeof onSubmit === 'function') {
        await onSubmit({shouldRefresh: mutation === 'createRestaurant'});
      }
      if (mutation !== 'createRestaurant' && getImagesForRestaurant) {
        getImagesForRestaurant.refetch();
      }
    } catch (error) {
      if (typeof onError === 'function') {
        return onError(error);
      }
      throw new Error(error);
    };
  };
  handleLocationChange = ({address}) => this.setState({address});
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
  render() {
    const {
      images,
      restaurant,
      onCancel,
      currencies = [],
      t,
      style,
      languages
    } = this.props;
    const {
      activeLanguage,
      selectedFiles = new Set(),
      newImages = [],
      loading
    } = this.state;
    return (
      <Form
        loading={loading}
        onCancel={onCancel}
        onSubmit={this.handleSubmit()}
        style={style}
      >
        <Tabbed
          onTabChange={this.handleTabChange}
          tab={activeLanguage}
          tabs={languages.reduce((prev, curr) => Object.assign({}, prev, {
            [curr.locale]: {
              label: curr.name,
              content: (
                <div>
                  <Input
                    label={this.props.t('restaurant.name')}
                    onChange={this.handleInputChange(['i18n', curr.locale, 'name'])}
                    value={get(['i18n', curr.locale, 'name'])(this.state) || ''}
                  />
                  <Input
                    Input={'textarea'}
                    label={this.props.t('restaurant.description')}
                    onChange={this.handleInputChange(['i18n', curr.locale, 'description'])}
                    rows={3}
                    value={get(['i18n', curr.locale, 'description'])(this.state) || ''}
                  />
                </div>
              )
            }
          }), {})}
        />
        <ItemsWithLabels
          items={[
            {
              label: t('currency'),
              item: (
                <Select
                  autoBlur
                  clearable={false}
                  id='currency'
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
            }, {
              label: t('restaurant.address'),
              item: (
                <LocationInput
                  onChange={this.handleLocationChange}
                  placeholder={t('restaurant.placeholder.address')}
                  value={get(['address', 'placeId'])(restaurant)}
                />
              )
            }
          ]}
        />
      </Form>
    );
  }
}

export default compose(
  restaurant.createRestaurant,
  restaurant.updateRestaurant,
  account.getActiveAccount,
  account.getRestaurantsByAccount,
  restaurant.getRestaurant,
  restaurant.createRestaurantI18n,
  restaurant.updateRestaurantI18n,
  misc.getCurrencies,
  file.getImagesForRestaurant,
  restaurant.updateRestaurantImages,
  misc.createAddress,
  misc.getLanguages
)(RestaurantForm);
