// @flow
import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';

import config from 'config';
import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';
import {
  createMenuItem,
  updateMenuItem,
  updateMenuItemFiles
} from 'graphql/restaurant/menuItem.mutations';
import {getMenuItem} from 'graphql/restaurant/menuItem.queries';
import {getActiveAccount} from 'graphql/account/account.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class MenuItemForm extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    createMenuItem: React.PropTypes.func.isRequired,
    updateMenuItem: React.PropTypes.func.isRequired,
    restaurant: React.PropTypes.object.isRequired,
    menuItem: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.number
    ])
  };
  constructor(props) {
    super(props);
    const {
      getMenuItem: {
        menuItem = typeof props.menuItem === 'object' ? props.menuItem : {}
      } = {}
    } = props;
    this.state = {
      name: menuItem.name || '',
      description: menuItem.description || '',
      type: menuItem.type || null,
      images: [],
      category: menuItem.category || null
    };
  }
  state: Object = {};
  componentWillReceiveProps(newProps) {
    if (typeof this.props.menuItem !== typeof newProps.menuItem) {
      // should reset inputs when menu information fetched with given id
      const {
        getMenuItem: {
          menuItem: {
            name,
            description,
            type,
            category
          } = typeof newProps.menuItem === 'object' ? newProps.menuItem : {}
        } = {}
      } = newProps;
      this.setState({
        name,
        description,
        type,
        category
      });
    }
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  };
  handleSubmit = e => {
    e.preventDefault();
    const {
      createMenuItem,
      updateMenuItem,
      updateMenuItemFiles,
      restaurant,
      onSubmit,
      onFailure,
      getActiveAccount: {account} = {},
      getMenuItem: {
        menuItem = typeof this.props.menuItem === 'object' ?
          this.props.menuItem : {}
      } = {}
    } = this.props;
    const {images, ...menuItemOptions} = this.state;
    let files = [];
    (async () => {
      if (images && images.length) {
        const formData = new FormData();
        formData.append('restaurant', restaurant.id);
        files = await (await fetch(
          `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.upload.endpoint}`,
          {
            method: 'POST',
            body: images.reduce(
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
        )).json();
      }
      const menuItemPayload = Object.assign({}, menuItemOptions,
        menuItem ? {id: menuItem.id} : null,
        {
          restaurant: restaurant.id,
          createdBy: account.id
        }
      );
      try {
        const finalMenuItem = menuItem && menuItem.id ?
          (await updateMenuItem(menuItemPayload)).data.updateMenuItemById.menuItem :
          (await createMenuItem(menuItemPayload)).data.createMenuItem.menuItem;
        await updateMenuItemFiles(finalMenuItem.id, files);
        if(onSubmit) {
          onSubmit();
        }
        onSubmit();
      } catch (err) {
        if (onFailure) {
          onFailure();
        }
      }
    })();
  };
  handleDrop = accepted => {
    this.setState({images: accepted});
  };
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  };
  render() {
    const {t} = this.props;
    const {description, name} = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <Input
              className="block"
              id="name"
              label={t('restaurant.menus.name')}
              onChange={this.handleInputChange}
              type="text"
              value={name}
          />
          <Input
              className="block"
              id="description"
              label={t('restaurant.menus.description')}
              onChange={this.handleInputChange}
              rows={3}
              type="text"
              value={description}
          />
          <div className="container">
            <Dropzone
                accept="image/*"
                className="dropzone"
                onDrop={this.handleDrop}
            >
              {this.state.images && this.state.images.length ?
                this.state.images.map((image, index) =>
                  <img
                      className="dropzone__image-preview"
                      key={index}
                      src={image.preview}
                  />
                ) : 'placeholder'
              }
            </Dropzone>
          </div>
        </div>
        <div>
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
  getActiveAccount
)(connect(mapStateToProps, {})(MenuItemForm));
