import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash/fp';
import {connect} from 'react-redux';

import Button from 'components/Button.component';

const mapStateToProps = state => ({
  t: state.util.translation.t
});

class WithActions extends React.Component {
  static propTypes = {
    action: PropTypes.string,
    actions: PropTypes.shape({action: PropTypes.shape({
      label: PropTypes.string,
      hide: PropTypes.bool,
      hideItems: PropTypes.bool,
      hideReturn: PropTypes.bool,
      render: PropTypes.bool.isRequired
    })}),
    containerClass: PropTypes.string,
    defaultAction: PropTypes.string,
    hideActions: PropTypes.bool,
    forceDefaultAction: PropTypes.bool,
    onActionChange: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  };
  static defaultProps = {
    containerClass: 'container container--padded container--distinct'
  };
  render() {
    const {
      containerClass,
      actions,
      forceDefaultAction,
      t,
      action,
      onActionChange,
      hideActions
    } = this.props;
    return (
      <div>
      {action ? (
          <div className={containerClass}>
            {forceDefaultAction || actions[action].hideReturn ? null : (
              <Button
                  className="block"
                  colored
                  onClick={onActionChange()}
                  type="button"
              >
                {t('return')}
              </Button>
            )}
            {actions[action].render()}
          </div>
        ) : !hideActions && typeof onActionChange === 'function' && actions && Object.keys(actions).length && !action ?
            <div className={containerClass}>
              <div>
                {Object.keys(actions)
                  .filter(key => !actions[key].hide)
                  .map(key => (
                    <Button
                        colored
                        key={key}
                        onClick={onActionChange({name: key})}
                        type="button"
                    >
                      {actions[key].label}
                    </Button>
                  ))
                }
              </div>
            </div>
          : null
        }
        {get([action, 'hideItems'])(actions) ? null :
          <div className={containerClass}>{this.props.children}</div>
        }
      </div>
    );
  }
};

export default connect(mapStateToProps)(WithActions);
