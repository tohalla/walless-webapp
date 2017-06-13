import React from 'react';
import Dropzone from 'react-dropzone';
import {equals, omit} from 'lodash/fp';
import Modal from 'react-modal';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Button from 'mdl/Button.component';
import Deletable from 'util/Deletable.component';

const mapStateToProps = state => ({t: state.util.translation.t});

class SelectImages extends React.Component {
  static propTypes = {
    select: PropTypes.shape({
      images: PropTypes.arrayOf(PropTypes.object).isRequired,
      selected: PropTypes.arrayOf(PropTypes.object),
      onImagesSelected: PropTypes.func.isRequired
    }),
    dropzone: PropTypes.shape({
      onSubmit: PropTypes.func.isRequired
    })
  };
  constructor(props) {
    super(props);
    this.state = {
      action: null,
      images: props.select ? props.select.images.map(image =>
        Object.assign(
          {},
          image,
          {_selected: Boolean(
            props.select.selected && props.select.selected.find(i => equals(i)(image))
          )}
        )
      ) : [],
      dropzoneImages: []
    };
  }
  componentWillReceiveProps(props) {
    this.setState({
      images: props.select ? props.select.images.map(image =>
        Object.assign(
          {},
          image,
          {_selected: Boolean(
            props.select.selected && props.select.selected.find(i => equals(i)(image))
          )}
        )
      ) : []
    });
  }
  handleDrop = accepted => {
    this.setState({dropzoneImages: this.state.dropzoneImages.concat(accepted)});
  };
  handleButtonClick = event => {
    this.setState({action: event.target.value});
  };
  handleImagesSelected = () => {
    const {select: {onImagesSelected} = {}} = this.props;
    onImagesSelected(
      this.state.images
        .filter(image => image._selected)
        .map(image => omit('_selected', image))
    );
    this.setState({action: null});
  };
  handleDropzoneSubmit = event => {
    const {dropzone: {onSubmit} = {}} = this.props;
    onSubmit(this.state.dropzoneImages);
    this.setState({action: null});
  };
  deleteImage = image => () => {
    this.setState({
      dropzoneImages:
        this.state.dropzoneImages.filter(i => i.preview !== image.preview)
    });
  };
  handleResetAction = () => {
    this.setState({action: null});
  };
  toggleSelection = image => event => {
    event.stopPropagation();
    this.setState({
      images: this.state.images.map(i =>
        equals(image)(i) ?
          Object.assign({}, i, {_selected: !i._selected}) : i
      )
    });
  };
  render() {
    const {dropzone, t} = this.props;
    const {action, dropzoneImages} = this.state;
    const images = this.state.images.map((image, index) => (
      <img
          className="image-preview"
          key={index}
          onClick={this.toggleSelection(image)}
          src={image.src || image.uri}
          style={{opacity: image._selected ? 1 : .6}}
      />
    ));
    const dropzoneButton = (
      <Button
          onClick={this.handleButtonClick}
          type="button"
          value="dropzone"
      >
        {t('uploadImages')}
      </Button>
    );
    const selectImagesButton = (
      <Button
          onClick={this.handleButtonClick}
          type="button"
          value="selectImages"
      >
        {t('selectImages')}
      </Button>
    );
    const selectImagesModal = (
      <Modal
          contentLabel={'Select images'}
          isOpen={action === 'selectImages'}
          onRequestClose={this.handleResetAction}
          overlayClassName="modal__overlay"
      >
        <div className="modal__content">
          {images}
        </div>
        <div className="modal__spacer" />
        <div className="modal__actions">
          <div>
            <Button
                colored
                onClick={this.handleImagesSelected}
                raised
                type="button"
            >
              {t('select')}
            </Button>
            <Button
                accent
                onClick={this.handleResetAction}
                raised
                type="button"
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </Modal>
    );
    if (dropzone) {
      const addImagesModal = (
        <Modal
            contentLabel={'Dropzone'}
            isOpen={action === 'dropzone'}
            onRequestClose={this.handleResetAction}
            overlayClassName="modal__overlay"
            style={{
              overlay: {
                height: '300px'
              }
            }}
        >
          <div className="modal__content">
            <Dropzone
                accept="image/*"
                className="dropzone"
                onDrop={this.handleDrop}
            >
              {dropzoneImages.map((image, index) => (
                <Deletable
                    key={index}
                    onDelete={this.deleteImage(image)}
                >
                  <img className="image-preview" src={image.preview}/>
                </Deletable>
              ))}
            </Dropzone>
          </div>
          <div className="modal__spacer" />
          <div className="modal__actions">
            <div>
              <Button
                  colored
                  onClick={this.handleDropzoneSubmit}
                  raised
                  type="button"
              >
                {t('select')}
              </Button>
              <Button
                  accent
                  onClick={this.handleResetAction}
                  raised
                  type="button"
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </Modal>
      );
      return (
        <div>
          <div>{images.length ? selectImagesButton : 'placeholder translation'}</div>
          <div>{dropzoneButton}</div>
          {addImagesModal}
          {selectImagesModal}
        </div>
      );
    }
    return (
      <div>
        {images}
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(SelectImages);
