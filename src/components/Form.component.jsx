import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {connect} from 'react-redux';

import Loading from 'components/Loading.component';
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
    onClose: PropTypes.func,
    fieldStyle: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    contentStyle: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    submitText: PropTypes.string,
    cancelText: PropTypes.string,
    isValid: PropTypes.bool,
    FormComponent: PropTypes.func
  };
  static defaultProps = {
    isValid: true,
    FormComponent: new Radium(props => <form {...props} />)
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
  handleClose = event => {
    event.preventDefault();
    if (typeof this.props.onClose === 'function') {
      this.props.onClose(event);
    }
  };
  render() {
    const {
      children,
      t,
      onCancel,
      onClose,
      style,
      submitText,
      cancelText,
      isValid,
      FormComponent,
      contentStyle,
      fieldStyle,
      loading
    } = this.props;
    return loading ?
      <div style={[styles.container, style]}><Loading /></div>
    : (
      <FormComponent onSubmit={this.handleSubmit} style={[styles.container, style]}>
        <div style={[].concat(styles.container, style, contentStyle)}>
          {fieldStyle ?
            children.map((child, index) =>
              <div key={index} style={fieldStyle}>{child}</div>
            ) :
            children
          }
        </div>
        <div style={styles.actions}>
          {typeof onCancel === 'function' ?
            <Button onClick={this.handleCancel} simple type="reset">
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
        {typeof onClose === 'function' ?
          <Button onClick={this.handleClose} plain>
            <i className="material-icons">{'close'}</i>
          </Button>
          : null
        }
      </FormComponent>
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
