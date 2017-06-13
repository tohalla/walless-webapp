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
    actions: PropTypes.shape({action: PropTypes.shape({
      label: PropTypes.string,
      hide: PropTypes.bool,
      hideItems: PropTypes.bool,
      hideReturn: PropTypes.bool,
      render: PropTypes.bool.isRequired
    })}),
    containerClass: PropTypes.string,
    defaultAction: PropTypes.string,
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
  constructor(props) {
    super(props),
    this.state = {
      action: props.actions && props.actions.hasOwnProperty(props.defaultAction) ?
        props.defaultAction : null
    };
  }
  state = {
    action: null
  };
  handleActionChange = action => e => {
    e.preventDefault();
    this.setState({action});
  };
  resetAction = () => {
    this.setState({action: null});
  };
  render() {
    const {
      containerClass,
      renderItem,
      items,
      actions,
      filterItems,
      t
    } = this.props;
    const {action} = this.state;
    return (
      <div>
        {
          actions && Object.keys(actions).length && !action ?
            <div className={containerClass}>
              <div>
                {Object.keys(actions)
                  .filter(action => !actions[action].hide)
                  .map((action, key) => (
                    <Button
                        colored
                        key={key}
                        onClick={this.handleActionChange(action)}
                        type="button"
                    >
                      {actions[action].label}
                    </Button>
                  ))
                }
              </div>

            </div>
          : action ? (
            <div className={containerClass}>
              <Button
                  className="block"
                  colored
                  onClick={this.resetAction}
                  type="button"
              >
                {t('return')}
              </Button>
              {actions[action].render()}
            </div>
          ) : null
        }
        {get([action, 'hideItems'])(actions) ? null :
          <div className={containerClass}>
            {
              (typeof filterItems === 'function'
                ? items.filter(filterItems) : items
              ).map((item, key) => (
                <div key={key}>
                  {renderItem(item)}
                </div>
              ))
            }
          </div>
        }
      </div>
    );
  }
}

export default connect(mapStateToProps, {})(ListItems);
