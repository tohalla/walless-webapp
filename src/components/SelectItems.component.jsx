import React from 'react';
import Dropzone from 'react-dropzone';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {get} from 'lodash/fp';

import Button from 'components/Button.component';
import Deletable from 'components/Deletable.component';

const mapStateToProps = state => ({t: state.util.translation.t});

class SelectImages extends React.Component {
  static propTypes = {
    select: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object),
      selected: PropTypes.instanceOf(Set),
      onToggleSelect: PropTypes.func
    }),
    dropzone: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.object),
      onDelete: PropTypes.func.isRequired,
      onDrop: PropTypes.func.isRequired
    })
  };
  state = {
    action: null
  };
  setAction = action => event => {
    event.preventDefault();
    this.setState({action});
  };
  handleResetAction = () => {
    this.setState({action: null});
  };
  handleToggleSelect = item => () => {
    if (typeof get(['select', 'onToggleSelect'])(this.props) === 'function') {
      this.props.select.onToggleSelect(item);
    }
  }
  render() {
    const {
      t,
      dropzone: {items: dropzoneItems = [], onDrop, onDelete},
      select: {items: selectItems = [], selected}
    } = this.props;
    const {action} = this.state;
    const items = selectItems.map((item, index) => (
      <div className="image-preview" key={index}>
        <img
            onClick={this.handleToggleSelect(item)}
            src={item.src || item.uri}
            style={{opacity: selected.has(item.id) ? 1 : .6}}
        />
      </div>
    ));
    return (action === 'selectImages' ? (
        <div className="container">
          <div className="container container--padded">
            <Button onClick={this.handleResetAction} raised type="button">
              {'placeholder'}
            </Button>
          </div>
          <div className="container">
            <div className="container container--padded ">
              <Dropzone
                  accept="image/*"
                  className="dropzone"
                  onDrop={onDrop}
              >
                <div className="container container--row container--padded">
                  {dropzoneItems.length ?
                    dropzoneItems.map((item, index) => (
                    <Deletable
                        key={index}
                        onDelete={onDelete(item)}
                    >
                      <div className="image-preview">
                        <img className="image-preview" src={item.preview}/>
                      </div>
                    </Deletable>
                  )) : <div>{t('dropImages')}</div>}
                </div>
              </Dropzone>
            </div>
            <div className="container container--row">
              {items}
            </div>
          </div>
        </div>
      ) : (
        <div className="container">
          <div className="container container--row">
            {selectItems.filter(item => selected.has(item.id)).map((item, index) => (
              <Deletable
                  key={index}
                  onDelete={this.handleToggleSelect(item)}
              >
                <div className="image-preview">
                  <img src={item.src || item.uri} />
                </div>
              </Deletable>
            ))}
          </div>
          <div className="container container--padded">
            <Button onClick={this.setAction('selectImages')} type="button">
              {t('selectImages')}
            </Button>
          </div>
        </div>
      )
    );
  }
}

export default connect(mapStateToProps, {})(SelectImages);
