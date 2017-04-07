// @flow
import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import Dropzone from 'react-dropzone';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';

import config from 'config';
import Deletable from 'util/Deletable.component';
import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';
import {
  createMenuItem,
  updateMenuItem,
  updateMenuItemFiles
} from 'graphql/restaurant/menuItem.mutations';
import {getMenuItem} from 'graphql/restaurant/menuItem.queries';
import {getFilesForRestaurant} from 'graphql/restaurant/restaurant.queries';
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
      files: menuItem.files || [],
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
            category,
            files = []
          } = typeof newProps.menuItem === 'object' ? newProps.menuItem : {}
        } = {}
      } = newProps;
      this.setState({
        name,
        description,
        type,
        category,
        files
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
    const {images, files: menuItemFiles, ...menuItemOptions} = this.state;
    let files = menuItemFiles
      .map(file => typeof file === 'object' ? file.id : file);
    (async () => {
      if (images && images.length) {
        const formData = new FormData();
        formData.append('restaurant', restaurant.id);
        files = files
          .concat(await (await fetch(
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
          )).json());
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
  deleteImage = image => () => {
    this.setState({
      images: this.state.images.filter(i => i.preview !== image.preview)
    });
  };
  deleteFile = file => () => {
    this.setState({
      files: this.state.files.filter(f => f.id !== file.id)
    });
  };
  handleDrop = accepted => {
    this.setState({images: this.state.images.concat(accepted)});
  };
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  };
  render() {
    const {t} = this.props;
    const {description, name, files = [], images = []} = this.state;
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
            {
              [].concat(
                images.map(image => ({src: image.preview, handleDelete: this.deleteImage(image)})),
                files.map(file => ({src: file.uri, handleDelete: this.deleteFile(file)}))
              )
                .map((image, index) =>
                  <Deletable key={index} onDelete={image.handleDelete}>
                    <img className="dropzone__image-preview" src={image.src}/>
                  </Deletable>
                )
            }
            <Dropzone
                accept="image/*"
                className="dropzone"
                onDrop={this.handleDrop}
            />
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
  getActiveAccount,
  getFilesForRestaurant
)(connect(mapStateToProps, {})(MenuItemForm));
