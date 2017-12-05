@translate()
export default class ManageOpeningHours extends Component {
  static propTypes = {
    restaurant: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object
    ]).isRequired,
    openingHours: PropTypes.arrayOf(PropTypes.object),
    t: PropTypes.func.isRequired
  };
  state = {
    edit: false
  };
  render() {
    const {t, restaurant, openingHours} = this.props;
    return restaurant && (
      Array.isArray(openingHours) && openingHours.length ? (
        <div />
      ) : (
        <div>
          {t('restaurant.openingHours.notSet')}
        </div>
      )
    );
  }
}
