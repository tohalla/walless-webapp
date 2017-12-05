@translate()
export default class ManageOpeningHours extends Component {
  static propTypes = {
    restaurant: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object
    ]),
    openingHours: PropTypes.arrayOf(PropTypes.object)
  };
  state = {
    edit: false
  };
  render() {
    const {t, openingHours} = this.props;
    return Array.isArray(openingHours) && openingHours.length ? (
      <div />
    ) : (
      <div>
        {t('restaurant.openingHours.notSet')}
      </div>
    );
  }
}
