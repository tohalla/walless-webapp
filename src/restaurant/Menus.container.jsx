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
    return (
      <div>
        <div className="container container--distinct">
          {
            action === 'new' ?
              <div>
                <NewMenu
                    onCancel={this.resetAction}
                    onCreated={this.handleMenuCreated}
                    restaurant={restaurant}
                />
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
              </div>
          }
        </div>
        {action !== 'new' ? (
          <div className="container container--distinct">
            {menus && menus.length ?
              menus.map((menu, index) =>
                <Menu key={index} menu={menu} />
              ) : 'no menus'
            }
          </div>
        ) : null}
      </div>
    );
  }
}

export default compose(
  getMenus
)(Menus);
