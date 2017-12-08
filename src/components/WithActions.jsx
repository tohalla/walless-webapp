import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';
import {get, isEmpty} from 'lodash/fp';

import {major} from 'styles/spacing';
import containers from 'styles/containers';
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
    forceDefaultAction: PropTypes.bool,
    onActionChange: PropTypes.func,
    children: PropTypes.node,
    hideContent: PropTypes.bool,
    t: PropTypes.func.isRequired,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ])
  };
  static defaultProps = {
    hideContent: false,
    forceDefaultAction: false,
    hideActions: false
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
  renderActions = ({action, actions, hideActions}, style) =>
    !(hideActions || isEmpty(actions)) &&
    <div style={style} data-test-id={'actions-container'}>
      {Object.keys(actions)
        .filter(key => !actions[key].hide)
        .map(key => (
          <Button
            disabled={actions[key].disabled}
            key={key}
            loading={actions[key].loading}
            onClick={this.handleActionChange({key, action: actions[key]})}
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
      hideActions,
      style,
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
          ) : this.renderActions(
            {actions, hideActions},
            [containers.contentContainer, styles.actionContainer]
          )
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
  }
};
