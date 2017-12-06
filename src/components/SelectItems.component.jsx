import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import ReactDropzone from 'react-dropzone';
import {get} from 'lodash/fp';

const Dropzone = new Radium(ReactDropzone);

import {normal, content} from 'styles/spacing';
import colors from 'styles/colors';
import Button from 'components/Button.component';
import Deletable from 'components/Deletable.component';

@translate()
@Radium
export default class SelectImages extends React.Component {
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
    }),
    t: PropTypes.func.isRequired
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
  };
  render() {
    const {
      dropzone: {items: dropzoneItems = [], onDrop, onDelete},
      select: {items: selectItems = [], selected},
      t
    } = this.props;
    const {action} = this.state;
    const items = selectItems.map((item, index) => (
      <img
        key={index}
        onClick={this.handleToggleSelect(item)}
        src={item.src || item.uri}
        style={[styles.preview, {opacity: selected.has(item.id) ? 1 : 0.6}]}
      />
    ));
    return (action === 'selectImages' ? (
      <div style={styles.container}>
        <Dropzone
          accept='image/*'
          onDrop={onDrop}
          style={styles.dropzone}
        >
          {dropzoneItems.length ?
            dropzoneItems.map((item, index) => (
              <Deletable
                key={index}
                onDelete={onDelete(item)}
              >
                <img src={item.preview} style={styles.preview} />
              </Deletable>
            )) : <div>{t('dropImages')}</div>}
        </Dropzone>
        <div style={styles.items}>
          {items}
        </div>
        <div style={styles.actions}>
          <Button onClick={this.handleResetAction} simple>
            {t('cancel')}
          </Button>
        </div>
      </div>
    ) : (
      <div style={styles.container}>
        <div style={styles.items}>
          {selectItems.filter(item => selected.has(item.id)).map((item, index) => (
            <Deletable
              key={index}
              onDelete={this.handleToggleSelect(item)}
            >
              <img src={item.src || item.uri} style={styles.preview} />
            </Deletable>
          ))}
        </div>
        <div style={styles.actions}>
          <Button onClick={this.setAction('selectImages')}>
            {t('selectImages')}
          </Button>
        </div>
      </div>
    )
    );
  }
}

const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  preview: {
    maxWidth: '150px',
    maxHeight: '150px',
    width: 'auto',
    height: 'auto'
  },
  dropzone: {
    display: 'flex',
    color: colors.lightGray,
    border: `1px solid ${colors.border}`,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: normal,
    marginBottom: content
  },
  items: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  actions: {
    display: 'flex',
    flexDirection: 'row'
  }
};
