import {connect} from 'react-redux';

class OpeningHours extends Component {
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
      <div>{''}</div>
    );
  }
}

export default connect(state => ({t: state.util.translation.t}))(OpeningHours);
