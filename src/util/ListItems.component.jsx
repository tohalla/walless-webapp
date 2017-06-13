import React from 'react';
import PropTypes from 'prop-types';

import WithActions from 'util/WithActions.component'

export default class ListItems extends React.Component {
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
      action,
      onActionChange
    } = this.props;
    return (
      <WithActions
          action={action}
          actions={actions}
          containerClass={containerClass}
          forceDefaultAction={forceDefaultAction}
          onActionChange={onActionChange}
      >
        <div className={containerClass}>
          {
            (typeof filterItems === 'function'
              ? items.filter(filterItems) : items
            ).map((item, key) => renderItem(item, {key}))
          }
        </div>
      </WithActions>
    );
  }
}
