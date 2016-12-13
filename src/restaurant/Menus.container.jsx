import React from 'react';
import {compose} from 'react-apollo';

import NewMenu from 'restaurant/NewMenu.container';
import Button from 'mdl/Button.component';
import {getMenus} from 'graphql/restaurant/menu.queries';
import Menu from 'restaurant/Menu.component';

class Menus extends React.Component {
  static PropTypes = {
    menus: React.PropTypes.arrayOf(React.PropTypes.object),
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
  handleMenuCreated = () => {
    this.setState({action: null});
    this.props.data.refetch();
  }
  render() {
    const {menus, restaurant} = this.props;
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
                <NewMenu
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
                  {'Create new menu'}
                </Button>
                <Button
                    colored
                    id="filter"
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
)(Menus);
