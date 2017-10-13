import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import Cookie from 'js-cookie';
import PropTypes from 'prop-types';
import {set, get, equals, pick} from 'lodash/fp';
import Radium from 'radium';
import {file, misc, restaurant, account} from 'walless-graphql';

import Input from 'components/Input.component';
import Form from 'components/Form.component';
import Select from 'components/Select.component';
import config from 'config';
import SelectItems from 'components/SelectItems.component';
import Tabbed from 'components/Tabbed.component';
import LocationInput from 'components/LocationInput.component';
import ItemsWithLabels from 'components/ItemsWithLabels.component';

const TextArea = props => <textarea {...props} />;

const mapStateToProps = state => ({
  languages: state.util.translation.languages,
  t: state.util.translation.t
});

@Radium
class RestaurantForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    onError: PropTypes.func,
    onCancel: PropTypes.func,
    createRestaurant: PropTypes.func.isRequired,
    updateRestaurant: PropTypes.func.isRequired,
    restaurant: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ])
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
      } = typeof props.restaurant === 'object' && props.restaurant ? props.restaurant : {}
    } = props;
    updateState({
      address,
      i18n,
      activeLanguage: 'en',
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
  handleSubmit = () => async () => {
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
            'authorization': Cookie.get('Authorization')
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
      t,
      languages = [],
      images,
      restaurant,
      onCancel,
      currencies = [],
      style
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
            tabs={languages.reduce((prev, value) => Object.assign({}, prev, {
              [value.locale]: {
                label: value.name,
                content: (
                  <div>
                    <Input
                        label={this.props.t('restaurant.name')}
                        onChange={this.handleInputChange(['i18n', value.locale, 'name'])}
                        value={get(['i18n', value.locale, 'name'])(this.state) || ''}
                    />
                    <Input
                        Input={TextArea}
                        label={this.props.t('restaurant.description')}
                        onChange={this.handleInputChange(['i18n', value.locale, 'description'])}
                        rows={3}
                        value={get(['i18n', value.locale, 'description'])(this.state) || ''}
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
  connect(mapStateToProps, {}),
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
  misc.createAddress
)(RestaurantForm);

