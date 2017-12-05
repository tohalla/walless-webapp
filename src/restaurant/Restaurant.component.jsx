import {compose} from 'react-apollo';
import {pick, get} from 'lodash/fp';
import {restaurant, account} from 'walless-graphql';

import PopOverMenu from 'components/PopOverMenu.component';
import RestaurantForm from 'restaurant/RestaurantForm.component';
import WithActions from 'components/WithActions.component';
import ItemsWithLabels from 'components/ItemsWithLabels.component';
import ManageOpeningHours from 'restaurant/ManageOpeningHours.component';
import loadable from 'decorators/loadable';

@loadable()
@translate()
@Radium
class Restaurant extends Component {
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
    const {
      restaurant,
      t,
      i18n: {languages: [language]}
    } = this.props;
    const {action} = this.state;
    const {name, description} = pick([
      'name',
      'description'
    ])(get(['i18n', language])(restaurant));
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
      },
      manageOpeningHours: {
        hide: true,
        hideReturn: true,
        hideItems: true,
        item: (
          <ManageOpeningHours
              onCancel={this.handleActionChange}
              onSubmit={this.handleRestaurantSubmit}
              restaurant={action ? action.restaurant : restaurant}
          />
        )
      }
    };
    return typeof restaurant === 'object' && (
      <WithActions
          action={action ? action.key : null}
          actions={actions}
          hideActions
          onActionChange={this.handleActionChange}
      >
        <div style={styles.titleContainer}>
          <h2>{name}</h2>
          <PopOverMenu
              items={Object.keys(actions).map(key => ({
                label: t(`restaurant.action.${key}`),
                onClick: this.handleActionSelect({key, restaurant})
              }))}
              label={<i className="material-icons">{'more_vert'}</i>}
          />
        </div>
        <ItemsWithLabels
            items={[
              {label: t('restaurant.description'), item: description}
            ]}
        />
      </WithActions>
    );
  }
}

export default compose(
  account.getActiveAccount,
  restaurant.getRestaurant,
  account.getRestaurantsByAccount
)(Restaurant);

const styles = {
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};
