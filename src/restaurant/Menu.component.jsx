import React from 'react';

export default class Menu extends React.Component {
  static PropTypes = {
    menu: React.PropTypes.object.isRequired
  }
  render() {
    const {name, description} = this.props.menu;

    return (
      <div className="container__item">
        <div className="container__item__content">
          <div>
            {name}
          </div>
          <div>
            {description}
          </div>
        </div>
        <div className="container__item__actions">
          {'actions'}
        </div>
      </div>
    );
  }
}
