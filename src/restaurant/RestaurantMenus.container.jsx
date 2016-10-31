import React from 'react';

import NewMenu from 'restaurant/NewMenu.container';
import Button from 'mdl/Button.component';

export default class RestaurantMenus extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func
  };
  state = {
    action: null
  };
  handleActionChange = e => {
    this.setState({action: e.target.id});
  }
  render() {
    const {action} = this.state;
    const returnButton = (
      <Button
          className="block"
          colored
          onClick={this.handleActionChange}
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
                <NewMenu />
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
          {'no menus'}
        </div>
      </div>
    );
  }
}
