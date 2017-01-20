import React from 'react';
import {connect} from 'react-redux';
import {compose} from 'react-apollo';

import MenuForm from 'restaurant/menu/MenuForm.container';
import Button from 'mdl/Button.component';
import {getMenus} from 'graphql/restaurant/menu.queries';
import Menu from 'restaurant/menu/Menu.component';

const mapStateToProps = state => ({t: state.util.translation.t});

class Menus extends React.Component {
  static PropTypes = {
    menus: React.PropTypes.arrayOf(React.PropTypes.object),
    restaurant: React.PropTypes.object.isRequired
  }
  state = {
    action: null
  };
  handleActionChange = action => e => {
    e.preventDefault();
    this.setState({action});
  }
  resetAction = () => {
    this.setState({action: null});
  }
  handleMenuSubmit = () => {
    this.setState({action: null});
    this.props.data.refetch();
  }
  render() {
    const {menus, restaurant, t} = this.props;
    const action = this.state.action ? this.state.action : {};
    return (
      <div>
        {
          action.hideSelection ? null :
            <div className="container container--distinct">
              <Button
                  colored
                  onClick={this.handleActionChange({
                    name: 'new',
                    hideSelection: true
                  })}
                  type="button"
              >
                {t('restaurant.menus.create')}
              </Button>
            </div>
        }
        <div className="container container--distinct">
          {
            action.name === 'new' || action.name === 'edit' ?
              <MenuForm
                  menu={action.name === 'edit' ? action.menu : null}
                  onCancel={this.resetAction}
                  onSubmit={this.handleMenuSubmit}
                  restaurant={restaurant}
              />
            : menus && menus.length ?
              menus.map((menu, index) =>
                <Menu
                    actions={[
                      {
                        text: t('edit'),
                        onClick: this.handleActionChange({
                          name: 'edit',
                          hideSelection: true,
                          menu
                        })
                      }
                    ]}
                    key={index}
                    menu={menu}
                />
              )
            : 'no menus'
          }
        </div>
      </div>
    );
  }
}

export default compose(
  getMenus
)(connect(mapStateToProps)(Menus));
