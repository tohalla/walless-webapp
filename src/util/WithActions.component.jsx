import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash/fp';
import {connect} from 'react-redux';

import Button from 'mdl/Button.component';

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
    forceDefaultAction: PropTypes.bool,
    onActionChange: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  };
  static defaultProps = {
    containerClass: 'container container--distinct'
  };
  render() {
    const {
      containerClass,
      actions,
      forceDefaultAction,
      t,
      action,
      onActionChange
    } = this.props;
    return (
      <div>
      {action ? (
          <div className={containerClass}>
            {forceDefaultAction ? null : (
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
        ) : typeof onActionChange === 'function' && actions && Object.keys(actions).length && !action ?
            <div className={containerClass}>
              <div>
                {Object.keys(actions)
                  .filter(action => !actions[action].hide)
                  .map((action, key) => (
                    <Button
                        colored
                        key={key}
                        onClick={onActionChange({name: action})}
                        type="button"
                    >
                      {actions[action].label}
                    </Button>
                  ))
                }
              </div>

            </div>
          : null
        }
        {get([action, 'hideItems'])(actions) ? null : this.props.children}
      </div>
    );
  }
};

export default connect(mapStateToProps)(WithActions);
