import walless from 'images/walless.svg';
import wallessPng from 'images/walless.svg';

@Radium
export default class Logo extends PureComponent {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
  };
  static defaultProps = {
    width: 30,
    height: 30
  };
  render() {
    return (
      <svg {...this.props}>
        <image
          src={walless}
          xlinkHref={wallessPng}
          {...this.props}
        />
      </svg>
    );
  }
};
