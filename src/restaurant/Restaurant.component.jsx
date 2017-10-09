import React from 'react';
import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Radium from 'radium';

import {getRestaurant} from 'graphql/restaurant/restaurant.queries';
import {
  getActiveAccount,
  getRestaurantsByAccount
} from 'graphql/account/account.queries';
import PopOverMenu from 'components/PopOverMenu.component';
import RestaurantForm from 'restaurant/RestaurantForm.component';
import WithActions from 'components/WithActions.component';
import ItemsWithLabels from 'components/ItemsWithLabels.component';
import loadable from 'decorators/loadable';

const mapStateToProps = state => ({
  language: state.util.translation.language,
  t: state.util.translation.t
});

@loadable()
@Radium
class Restaurant extends React.Component {
  static propTypes = {
    restaurant: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object
    ])
  };
  state = {
    action: null
  };
  componentWillMount = () => this._mounted = true;
  componentWillUnmount = () => this._mounted = false;
  handleRestaurantSubmit = () =>
    this._mounted && this.setState({action: null});
  handleActionChange = action => this.setState({action});
  handleActionSelect = action => () => this.handleActionChange(action);
  render() {
    if (this.props.restaurant && typeof this.props.restaurant === 'object') {
      const {
        restaurant,
        restaurant: {
          i18n: {
            [this.props.language]: {
              name, description
            } = {}
          }
        },
        t
      } = this.props;
      const actions = {
        edit: {
          hide: true,
          hideReturn: true,
          hideItems: true,
          item: (
            <RestaurantForm
                onCancel={this.handleActionChange}
                onSubmit={this.handleRestaurantSubmit}
                restaurant={action ? action.restaurant : restaurant}
            />
          )
        }
      };
      const {action} = this.state;
      return (
        <WithActions
            action={action ? action.key : null}
            actions={actions}
            hideActions
            onActionChange={this.handleActionChange}
        >
          <div style={styles.titleContainer}>
            <h2>{name}</h2>
            <PopOverMenu
                items={[
                  {
                    label: t('restaurant.action.edit'),
                    onClick: this.handleActionSelect({key: 'edit', restaurant})
                  }
                ]}
                label={<i className="material-icons">{'more_vert'}</i>}
            />
          </div>
          <ItemsWithLabels
              items={[{label: t('restaurant.description'), item: description}]}
          />
        </WithActions>
      );
    }
    return null;
  }
}

export default compose(
  connect(mapStateToProps),
  getActiveAccount,
  getRestaurant,
  getRestaurantsByAccount
)(Restaurant);

const styles = {
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};
