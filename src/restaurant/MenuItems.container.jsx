import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {hasIn} from 'lodash/fp';

import NewMenuItem from 'restaurant/NewMenuItem.container';
import Button from 'mdl/Button.component';
import {getMenuItems} from 'graphql/restaurant/menuItem.queries';
import MenuItem from 'restaurant/MenuItem.component';
import FilterMenuItems from 'restaurant/FilterMenuItems.component';

const mapStateToProps = state => ({
  t: state.util.translation.t,
  filter: hasIn(['form', 'menuItemFilter', 'values'])(state) ?
    state.form.menuItemFilter.values : {}
});

class MenuItems extends React.Component {
  static PropTypes = {
    menuItems: React.PropTypes.arrayOf(React.PropTypes.object),
    restaurant: React.PropTypes.object.isRequired,
    action: React.PropTypes.string
  }
  state = {
    action: null
  };
  handleActionChange = e => {
    this.setState({action: e.target.id});
  }
  resetAction = () => {
    this.setState({action: null});
  }
  handleMenuItemCreated = () => {
    this.setState({action: null});
    this.props.data.refetch();
  }
  render() {
    const {
      menuItems,
      restaurant,
      action: forceAction,
      filter
    } = this.props;
    const {action} = this.state;
    const returnButton = forceAction ? null : (
      <Button
          className="block"
          colored
          onClick={this.resetAction}
          type="button"
      >
        {'Return'}
      </Button>
    );
    return (
      <div>
        <div className="container">
          {
            action === 'new' ?
              <div>
                {returnButton}
                <NewMenuItem
                    onCancel={this.resetAction}
                    onCreated={this.handleMenuItemCreated}
                    restaurant={restaurant}
                />
              </div>
            : action === 'filter' ?
              <div>
                {returnButton}
                <FilterMenuItems />
              </div>
            : forceAction ?
              null
            :
              <div>
                <Button
                    colored
                    id="new"
                    onClick={this.handleActionChange}
                    type="button"
                >
                  {'Create new item'}
                </Button>
                <Button
                    colored
                    id="filter"
                    onClick={this.handleActionChange}
                    type="button"
                >
                  {'Filter items'}
                </Button>
              </div>
          }
        </div>
        <div className="container">
          {menuItems && menuItems.length ?
            menuItems
              .filter(menuItem =>
                !filter.name || menuItem.name.indexOf(filter.name) > -1
              )
              .map((menuItem, index) =>
                <MenuItem key={index} menuItem={menuItem} />
              ) : 'no menu items'
          }
        </div>
      </div>
    );
  }
}

export default compose(
  getMenuItems
)(connect(mapStateToProps, {})(MenuItems));
