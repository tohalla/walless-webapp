import React from 'react';
import {compose} from 'react-apollo';

import NewMenuItem from 'restaurant/NewMenuItem.container';
import Button from 'mdl/Button.component';
import {getMenuItems} from 'graphql/restaurant/menuItem.queries';

class MenuItems extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func
  };
  static PropTypes = {
    menuItems: React.PropTypes.arrayOf(React.PropTypes.object),
    restaurant: React.PropTypes.object.isRequired
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
    const {menuItems, restaurant} = this.props;
    const {action} = this.state;
    const returnButton = (
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
                    onCreated={this.handleMenuCreated}
                    restaurant={restaurant}
                />
              </div>
            : action === 'filter' ?
              <div>
                {returnButton}
              </div>
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
            menuItems.map((menuItem, index) =>
              // <menuItem key={index} menuItem={menuItem} />
              'item'
            ) : 'no menu items'
          }
        </div>
      </div>
    );
  }
}

export default compose(
  getMenuItems
)(MenuItems);
