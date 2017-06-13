import React from 'react';
import PropTypes from 'prop-types';
import {get} from 'lodash/fp';
import {connect} from 'react-redux';

import Button from 'mdl/Button.component';

const mapStateToProps = state => ({
  t: state.util.translation.t
});

class ListItems extends React.Component {
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
    renderItem: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.object),
    filterItems: PropTypes.func,
    selectedItems: PropTypes.instanceOf(Set)
  };
  static defaultProps = {
    renderItem: () =>
      null,
    items: [],
    containerClass: 'container container--distinct',
    selectedItems: new Set()
  };
  render() {
    const {
      containerClass,
      renderItem,
      items,
      actions,
      forceDefaultAction,
      filterItems,
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
        )
          : typeof onActionChange === 'function' && actions && Object.keys(actions).length && !action ?
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
        {get([action, 'hideItems'])(actions) ? null :
          <div className={containerClass}>
            {
              (typeof filterItems === 'function'
                ? items.filter(filterItems) : items
              ).map((item, key) => renderItem(item, {key}))
            }
          </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(ListItems);
