import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

import MdlMenu from 'mdl/MdlMenu.component';
import Button from 'mdl/Button.component';
import {getMenu} from 'graphql/restaurant/menu.queries';

const mapStateToProps = state => ({t: state.util.translation.t});

class Menu extends React.Component {
  static PropTypes = {
    menu: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.number
    ]).isRequired,
    actions: React.PropTypes.arrayOf(React.PropTypes.shape({
      text: React.PropTypes.object.isRequired,
      onClick: React.PropTypes.func.isRequired
    })),
    expand: React.PropTypes.bool
  };
  static defaultProps = {
    expand: false
  };
  constructor(props) {
    super(props);
    const {expand} = props;
    this.state = {
      expand
    };
  }
  toggleExpand = () => {
    this.setState({expand: !this.state.expand});
  };
  render() {
    const {
      getMenu: {
        menu: {
          name,
          description,
          id
        } = typeof this.props.menu === 'object' ? this.props.menu : {}
      } = {},
      actions
    } = this.props;
    const {expand} = this.state;
    return (
      <div
          className="container__item container__item--trigger"
          onClick={this.toggleExpand}
      >
        <div className="container__item__content">
          <div>
            {name}
          </div>
          <div>
            {description}
          </div>
        </div>
        {
          actions && actions.length ?
            <div className="container__item__actions">
              <Button
                  className="mdl-button mdl-js-button mdl-button--icon"
                  id={`menu-actions-${id}`}
                  type="button"
              >
                <i className="material-icons">{'more_vert'}</i>
              </Button>
              <MdlMenu htmlFor={`menu-actions-${id}`}>
                {actions.map((action, index) =>
                  <li
                      className="mdl-menu__item"
                      key={index}
                      onClick={action.onClick}
                  >
                    {action.text}
                  </li>
                )}
              </MdlMenu>
            </div>
          : null
        } {
          expand ?
            <div className="container__item__content container__item__content--full-width">
              {'preview'}
            </div>
          : null
        }
      </div>
    );
  }
}

export default compose(
  getMenu
)(connect(mapStateToProps)(Menu));
