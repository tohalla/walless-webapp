import {compose} from 'react-apollo';
import {connect} from 'react-redux';
import {pick, get} from 'lodash/fp';
import {restaurant, account} from 'walless-graphql';

import PopOverMenu from 'components/PopOverMenu.component';
import RestaurantForm from 'restaurant/RestaurantForm.component';
import WithActions from 'components/WithActions.component';
import ItemsWithLabels from 'components/ItemsWithLabels.component';
import OpeningHours from 'restaurant/OpeningHours.component';
import loadable from 'decorators/loadable';

const mapStateToProps = state => ({
  language: state.util.translation.language,
  t: state.util.translation.t
});

@loadable()
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
    console.log(this.props);
    const {restaurant, t, language} = this.props;
    const {action} = this.state;
    const {name, description} = pick([
      'name',
      'description'
    ])(get(['i18n', language])(restaurant));
    return typeof restaurant === 'object' && (
      <WithActions
          action={action ? action.key : null}
          actions={{
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
          }}
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
            items={[
              {label: t('restaurant.description'), item: description},
              <OpeningHours key="hours" restaurant={restaurant} />
            ]}
        />
      </WithActions>
    );
  }
}

export default compose(
  connect(mapStateToProps),
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
