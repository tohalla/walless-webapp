import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {get} from 'lodash/fp';

import Loading from 'components/Loading';
import Button from 'components/Button';

const findInvalidInputs = components => components ?
  [].concat(components).reduce((prev, curr) =>
    curr ?
      get(['props', 'required'])(curr) && (
        curr.props.value === ''
        || typeof curr.props.value === 'undefined'
        || (
          typeof curr.props.isValid === 'function'
          && !curr.props.isValid(curr.props.value)
        )
      ) ? prev.concat(curr)
        : curr.props ?
          curr.props.children ? prev.concat(findInvalidInputs(curr.props.children))
            : curr.props.items ? prev.concat(findInvalidInputs(curr.props.items))
              : prev
          : curr.item ? prev.concat(findInvalidInputs(curr.item))
            : prev
      : prev,
  []
  )
  : [];

@translate()
@Radium
export default class Form extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onClose: PropTypes.func,
    fieldStyle: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    buttonStyle: PropTypes.oneOfType([
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
    FormComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    t: PropTypes.func.isRequired,
    loading: PropTypes.bool
  };
  static defaultProps = {
    isValid: true,
    loading: false,
    FormComponent: 'form'
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
      buttonStyle,
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
    const invalid = findInvalidInputs(children);
    return loading ?
      <div style={[styles.container, style]}><Loading /></div>
      : (
        <FormComponent onSubmit={this.handleSubmit} style={[styles.container, style]}>
          <div style={[].concat(styles.container, contentStyle)}>
            {fieldStyle ?
              children.map((child, index) =>
                <div key={index} style={fieldStyle}>{child}</div>
              ) : children
            }
          </div>
          <div style={styles.actions}>
            {typeof onCancel === 'function' ?
              <Button
                onClick={this.handleCancel}
                simple
                style={buttonStyle}
                type='reset'
              >
                {cancelText || t('cancel')}
              </Button>
              : null
            }
            <Button
              disabled={!!invalid.length || !isValid}
              onClick={this.handleSubmit}
              type='submit'
              style={buttonStyle}
            >
              {submitText || t('submit')}
            </Button>
          </div>
          {typeof onClose === 'function' ?
            <Button onClick={this.handleClose} plain style={buttonStyle}>
              <i className='material-icons'>{'close'}</i>
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
