import React from 'react';
import {compose} from 'react-apollo';

import NewMenu from 'restaurant/NewMenu.container';
import Button from 'mdl/Button.component';
import {getMenus} from 'graphql/restaurant/menu.queries';
import Menu from 'restaurant/Menu.component';

class RestaurantMenus extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func
  };
  static PropTypes = {
    menus: React.PropTypes.arrayOf(React.PropTypes.object)
  }
  state = {
    action: null
  };
  handleActionChange = e => {
    this.setState({action: e.target.id});
  }
  resetAction = e => {
    this.setState({action: null});
  }
  handleMenuCreated = () => {
    this.setState({action: null});
    this.props.data.refetch();
  }
  render() {
    const {menus} = this.props;
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
            action === 'newMenu' ?
              <div>
                {returnButton}
                <NewMenu
                    onCancel={this.resetAction}
                    onMenuCreated={this.handleMenuCreated}
                />
              </div>
            : action === 'filterMenus' ?
              <div>
                {returnButton}
              </div>
            :
              <div>
                <Button
                    colored
                    id="newMenu"
                    onClick={this.handleActionChange}
                    type="button"
                >
                  {'Create new menu'}
                </Button>
                <Button
                    colored
                    id="filterMenus"
                    onClick={this.handleActionChange}
                    type="button"
                >
                  {'Filter menus'}
                </Button>
              </div>
          }
        </div>
        <div className="container">
          {menus && menus.length ?
            menus.map((menu, index) =>
              <Menu key={index} menu={menu} />
            ) : 'no menus'
          }
        </div>
      </div>
    );
  }
}

export default compose(
  getMenus
)(RestaurantMenus);
