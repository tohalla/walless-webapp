import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {compose} from 'react-apollo';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import {
  reduce,
  set,
  get,
  pick,
  pullAt,
  equals,
  findIndex
} from 'lodash/fp';
import {account, menuItem, misc, file} from 'walless-graphql';

import Checkbox from 'components/Checkbox';
import Select from 'components/Select';
import config from 'config';
import OptionForm from 'restaurant/menu-item/OptionForm';
import Editable from 'components/Editable';
import Input from 'components/Input';
import Form from 'components/Form';
import SelectItems from 'components/SelectItems';
import Tabbed from 'components/Tabbed';
import ItemsWithLabels from 'components/ItemsWithLabels';
import loadable from 'decorators/loadable';

@loadable()
@translate()
@Radium
class MenuItemForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onError: PropTypes.func,
    onCancel: PropTypes.func.isRequired,
    getMenuItem: PropTypes.object,
    createMenuItem: PropTypes.func.isRequired,
    updateMenuItem: PropTypes.func.isRequired,
    restaurant: PropTypes.object.isRequired,
    images: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.number})),
    menuItemTypes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })),
    diets: PropTypes.arrayOf(PropTypes.shape({id: PropTypes.number})),
    languages: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      locale: PropTypes.string
    })),
    menuItem: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number
    ]),
    i18n: PropTypes.shape({languages: PropTypes.arrayOf(PropTypes.string)}),
    t: PropTypes.func.isRequired
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
      } = typeof props.menuItem === 'object' && props.menuItem ? props.menuItem : {},
      i18n: {languages: [language]}
    } = props;
    updateState({
      activeLanguage: language,
      price,
      i18n,
      loading: false,
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
  handleSubmit = () => async(event) => {
    this.setState({loading: true});
    event.preventDefault();
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
  handleEditOption = ({value: option, oldValue}) => {
    const index = findIndex(o => oldValue.id === o.id)(this.state.options);
    if (index !== -1) {
      this.setState({options: set(index)(option)(this.state.options)});
    }
  };
  handleDeleteOption = option => this.setState({
    options: pullAt(
      findIndex(o => option.id === o.id)(this.state.options)
    )(this.state.options)
  });
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
      i18n: {languages: [language]},
      menuItemTypes,
      diets
    } = this.props;
    const {
      selectedFiles,
      newImages = [],
      options = [],
      activeLanguage,
      price,
      type,
      category,
      diets: selectedDiets,
      loading
    } = this.state;
    const categories = type && menuItemTypes.length ?
      (menuItemTypes.find(i => i.id === type).menuItemCategories || []) : [];
    const tabs = reduce((prev, value) => Object.assign({}, prev, {
      [value.locale]: {
        label: value.name,
        content: (
          <div>
            <Input
              label={t('restaurant.item.name')}
              onChange={this.handleInputChange(['i18n', value.locale, 'name'])}
              value={get(['i18n', value.locale, 'name'])(this.state) || ''}
            />
            <Input
              Input={'textarea'}
              label={t('restaurant.item.description')}
              onChange={this.handleInputChange(['i18n', value.locale, 'description'])}
              rows={3}
              value={get(['i18n', value.locale, 'description'])(this.state) || ''}
            />
          </div>
        )
      }
    }), {})(languages);
    return (
      <Form
        loading={loading}
        onCancel={this.handleCancel}
        onSubmit={this.handleSubmit()}
      >
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
                  label={t('restaurant.item.price')}
                  onChange={this.handleInputChange('price')}
                  pattern='^\d+(\.\d{0,2})?$|^$'
                  required
                  value={price}
                />
              )
            },
            {
              label: t('restaurant.item.type'),
              item: (
                <Select
                  autoBlur
                  clearable={false}
                  id='cateogry'
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
              label: t('restaurant.item.category'),
              item: (
                <Select
                  autoBlur
                  clearable={false}
                  id='cateogry'
                  onChange={this.handleInputChange('category', item => item.value)}
                  options={categories.map(category => ({
                    value: category.id,
                    label: category.name
                  }))}
                  value={category}
                />
              )
            } : null, {
              label: t('restaurant.item.images'),
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
              label: t('restaurant.item.diets'),
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
              label: t('restaurant.item.options'),
              item: (
                <div>
                  {options.map((option, index) => (
                    <Editable
                      Form={OptionForm}
                      disabledOptions={options}
                      key={index}
                      onDelete={this.handleDeleteOption}
                      onEdit={this.handleEditOption}
                      value={option}
                    >
                      {get(['i18n', language, 'name'])(option)}
                    </Editable>
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
  menuItem.createMenuItem,
  menuItem.updateMenuItem,
  menuItem.updateMenuItemImages,
  menuItem.getMenuItem,
  account.getActiveAccount,
  file.getImagesForRestaurant,
  menuItem.createMenuItemI18n,
  menuItem.updateMenuItemI18n,
  menuItem.updateMenuItemDiets,
  menuItem.getMenuItemTypes,
  misc.getDiets,
  menuItem.updateMenuItemOptions,
  misc.getLanguages
)(MenuItemForm);
