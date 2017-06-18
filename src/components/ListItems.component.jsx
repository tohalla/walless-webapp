import React from 'react';
import PropTypes from 'prop-types';

import WithActions from 'components/WithActions.component';

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
    renderItems: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.object),
    filterItems: PropTypes.func,
    selectedItems: PropTypes.instanceOf(Set)
  };
  static defaultProps = {
    renderItem: () => null,
    renderItems: ({items, renderItem}) =>
      items.map((item, key) => renderItem(item, {key})),
    items: [],
    containerClass: 'container container--padded container--distinct',
    selectedItems: new Set()
  };
  render() {
    const {
      containerClass,
      renderItems,
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
        {
          renderItems({
            items: (typeof filterItems === 'function'
              ? items.filter(filterItems) : items
            ),
            renderItem
          })
        }
      </WithActions>
    );
  }
}
