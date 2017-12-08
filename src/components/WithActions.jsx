import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {get, isEmpty} from 'lodash/fp';

import {major, normal} from 'styles/spacing';
import containers from 'styles/containers';
import colors from 'styles/colors';
import Button from 'components/Button';

@translate()
@Radium
export default class WithActions extends React.Component {
  static propTypes = {
    action: PropTypes.string,
    actions: PropTypes.shape({action: PropTypes.shape({
      label: PropTypes.string,
      hideContent: PropTypes.bool,
      hideReturn: PropTypes.bool,
      item: PropTypes.node,
      onClick: PropTypes.func
    })}),
    hideActions: PropTypes.bool,
    simpleActions: PropTypes.bool,
    forceDefaultAction: PropTypes.bool,
    onActionChange: PropTypes.func,
    children: PropTypes.node,
    hideContent: PropTypes.bool,
    t: PropTypes.func.isRequired,
    title: PropTypes.string,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ])
  };
  static defaultProps = {
    hideContent: false,
    forceDefaultAction: false,
    hideActions: false,
    simpleActions: false
  };
  handleActionChange = action => event => {
    if (event && typeof event.preventDefault === 'function') {
      event.preventDefault();
      event.stopPropagation();
    }
    return typeof get(['action', 'onClick'])(action) === 'function' ?
      action.action.onClick() :
        typeof this.props.onActionChange === 'function'
        && this.props.onActionChange(action);
  };
  renderActions = ({action, actions, hideActions, buttonProps = {}, style}) =>
    !(
      hideActions ||
      isEmpty(actions) ||
      (action && actions[action].hideItems)
    ) &&
    <div style={style} data-test-id={'actions-container'}>
      {Object.keys(actions)
        .filter(key => !actions[key].hide)
        .map(key => (
          <Button
            disabled={actions[key].disabled}
            key={key}
            loading={actions[key].loading}
            onClick={this.handleActionChange({key, action: actions[key]})}
            {...buttonProps}
            style={[
              action === key ? {fontWeight: 'bold'} : [],
              buttonProps.style
            ]}
          >
            {actions[key].label}
          </Button>
        ))
      }
    </div>;
  render() {
    const {
      actions,
      forceDefaultAction,
      action,
      hideContent,
      style,
      simpleActions,
      title,
      t,
      children
    } = this.props;
    return (
      <div style={[styles.container, style]}>
        {
          action ? (
            <div
              data-test-id={'action-container'}
              style={[
                containers.contentContainer,
                styles.actionContainer
              ]}
            >
              {!(forceDefaultAction || actions[action].hideReturn) && (
                <Button
                  data-test-id={'action-return'}
                  onClick={this.handleActionChange()}
                >
                  {t('return')}
                </Button>
              )}
              {actions[action].item}
            </div>
          ) : !simpleActions && this.renderActions({
            ...this.props,
            style: [containers.contentContainer, styles.actionContainer]
          })
        }
        {
          !(
            get([action, 'hideContent'])(actions)
            || !children
            || hideContent
            || (Array.isArray(children) && !children.length)
          ) &&
            <div
              data-test-id={'content-container'}
              style={containers.contentContainer}
            >
              {((simpleActions && actions) || title) &&
                <div style={styles.header}>
                  {title && <h2>{title}</h2>}
                  {simpleActions && this.renderActions({
                    ...this.props,
                    buttonProps: {plain: true, style: {color: colors.gray}},
                    style: styles.simpleActions
                  })}
                </div>
              }
              {children}
            </div>
        }
      </div>
    );
  }
};

const styles = {
  actionContainer: {
    marginBottom: major,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  container: {
    flex: 1,
    display: 'flex',
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'stretch'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  simpleActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'stretch',
    marginBottom: normal
  }
};
