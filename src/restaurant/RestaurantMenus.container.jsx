import React from 'react';

export default class RestaurantMenus extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func
  };
  render() {
    return (
      <div>
        <div className="container">
          <button className="mdl-button mdl-button--colored">
            {'Create new menu'}
          </button>
          <button className="mdl-button mdl-button--colored">
            {'Filter menus'}
          </button>
        </div>
      </div>
    );
  }
}
