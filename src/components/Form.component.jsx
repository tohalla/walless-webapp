import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {connect} from 'react-redux';

import Button from 'components/Button.component';

const mapStateToProps = state => ({
  t: state.util.translation.t
});

@Radium
class Form extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    submitText: PropTypes.string,
    cancelText: PropTypes.string,
    isValid: PropTypes.bool
  };
  static defaultProps = {
    isValid: true
  };
  handleSubmit = event => {
    event.preventDefault();
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(event);
    }
  };
  handleCancel = event => {
    event.preventDefault();
    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel(event);
    }
  };
  render() {
    const {
      children,
      t,
      onCancel,
      style,
      submitText,
      cancelText,
      isValid
    } = this.props;
    return (
      <form onSubmit={this.handleSubmit} style={[styles.container, style]}>
        {children}
        <div style={styles.actions}>
          {typeof onCancel === 'function' ?
            <Button accent onClick={this.handleCancel} type="reset">
              {cancelText || t('cancel')}
            </Button>
            : null
          }
          <Button
              disabled={!isValid}
              onClick={this.handleSubmit}
              type="submit"
          >
            {submitText || t('submit')}
          </Button>
        </div>
      </form>
    );
  }
};

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  actions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
};

export default connect(mapStateToProps, {})(Form);
