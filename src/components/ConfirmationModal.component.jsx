import React from 'react';
import Radium from 'radium';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ReactClickOutside from 'react-click-outside';

import {modalZIndex} from 'styles/zIndex';
import colors from 'styles/colors';
import Button from 'components/Button.component';
import shadow from 'styles/shadow';
import {normal} from 'styles/spacing';

const ClickOutside = new Radium(ReactClickOutside);

const mapStateToProps = state => ({
  t: state.util.translation.t
});

@Radium
class ConfirmationModal extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    message: PropTypes.string.isRequired,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string
  };
  static defaultProps = {
    isOpen: false
  };
  render() {
    const {
      onCancel,
      onConfirm,
      message,
      t,
      confirmText,
      cancelText
    } = this.props;
    return (
      <div style={styles.overlay}>
        <ClickOutside onClickOutside={onCancel}>
          <div style={[styles.container, shadow.small]}>
            <div style={styles.message}>
              {message}
            </div>
            <div style={styles.actions}>
              <Button accent onClick={onCancel} type="reset">
                {cancelText || t('cancel')}
              </Button>
              <Button onClick={onConfirm} type="submit">
                {confirmText || t('confirm')}
              </Button>
            </div>
          </div>
        </ClickOutside>
      </div>
    );
  }
};

export default connect(mapStateToProps)(ConfirmationModal);

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: modalZIndex
  },
  container: {
    position: 'absolute',
    top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: colors.backgroundLight
  },
  message: {
    padding: normal
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
};
