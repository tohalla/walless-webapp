import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import {equals} from 'lodash/fp';
import PropTypes from 'prop-types';

import config from 'config';
import Deletable from 'util/Deletable.component';
import Input from 'mdl/Input.component';
import Button from 'mdl/Button.component';
import SelectImages from 'util/SelectImages.component';
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
    onSubmit: PropTypes.func.isRequired,
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
          name = '',
          description = '',
          type,
          category,
          files = []
        }
      } = {menuItem: typeof props.menuItem === 'object' && props.menuItem ? props.menuItem : {}}
    } = props;
    updateState({
      name,
      description,
      type,
      newImages: [],
      files,
      category
    });
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
        menuItem
      } = {menuItem: typeof this.props.menuItem === 'object' ? this.props.menuItem : {}}
    } = this.props;
    const {newImages, files: menuItemFiles, ...menuItemOptions} = this.state;
    let files = menuItemFiles
      .reduce(
        (prev, curr) => curr._delete ?
          prev :
          prev.concat(typeof curr === 'object' ? curr.id : curr),
        []
      );
    (async() => {
      if (newImages && newImages.length) {
        const formData = new FormData();
        formData.append('restaurant', restaurant.id);
        files = files
          .concat(await (await fetch(
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
        if (onSubmit) {
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
      newImages: this.state.newImages.filter(i => i.preview !== image.preview)
    });
  };
  toggleDeleteFile = file => () => {
    this.setState({
      files: this.state.files.map(f => f.id === file.id ?
        Object.assign({}, f, {_delete: !f._delete}) : f
      )
    });
  };
  handleDrop = accepted => {
    this.setState({newImages: this.state.newImages.concat(accepted)});
  };
  handleCancel = e => {
    e.preventDefault();
    this.props.onCancel();
  };
  handleImagesSelected = images => {
    this.setState({files: images});
  };
  render() {
    const {
      t,
      getFilesForRestaurant = {}
    } = this.props;
    const {description, name, files = [], newImages = []} = this.state;
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
                newImages.map(image => ({
                  src: image.preview,
                  delete: false,
                  handleDelete: this.deleteImage(image)
                })),
                files.map(file => ({
                  src: file.uri,
                  delete: file._delete,
                  handleDelete: this.toggleDeleteFile(file)
                }))
              )
                .map((image, index) => (
                  <Deletable
                      deleteText={image.delete ?
                        t('cancel') :
                        <i className="material-icons">{'delete'}</i>
                      }
                      key={index}
                      onDelete={image.handleDelete}
                  >
                    <img className="image-preview" src={image.src}/>
                  </Deletable>
                ))
            }
            <SelectImages
                dropzone={{onSubmit: this.handleDrop}}
                select={{
                  images: getFilesForRestaurant.files,
                  selected: files,
                  onImagesSelected: this.handleImagesSelected
                }}
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
