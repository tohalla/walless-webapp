import colors from 'styles/colors';

@Radium
export default class Loading extends React.PureComponent {
  static propTypes = {
    color: PropTypes.oneOf(Object.values(colors)),
    small: PropTypes.bool,
    loading: PropTypes.bool
  };
  static defaultProps = {
    color: colors.foregroundDark,
    loading: true
  };
  render() {
    const {color, small, loading, style, ...props} = this.props;
    const size = small ? {width: '1rem', height: '1rem'} : {width: 60, height: 60};
    return loading ? (
      <div
          style={[
            {
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }
          ]}
      >
        <svg
            fill="white"
            style={{fill: color, opacity: .6, ...style, ...size}}
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
          <circle cx="0" cy="16" r="0" transform="translate(8 0)">
            <animate
                attributeName="r"
                begin="0"
                calcMode="spline"
                dur="1.2s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
                keyTimes="0;0.2;0.7;1"
                repeatCount="indefinite"
                values="0; 4; 0; 0"
            />
          </circle>
          <circle cx="0" cy="16" r="0" transform="translate(16 0)">
            <animate
                attributeName="r"
                begin="0.3"
                calcMode="spline"
                dur="1.2s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
                keyTimes="0;0.2;0.7;1"
                repeatCount="indefinite"
                values="0; 4; 0; 0"
            />
          </circle>
          <circle cx="0" cy="16" r="0" transform="translate(24 0)">
            <animate
                attributeName="r"
                begin="0.6"
                calcMode="spline"
                dur="1.2s"
                keySplines="0.2 0.2 0.4 0.8;0.2 0.6 0.4 0.8;0.2 0.6 0.4 0.8"
                keyTimes="0;0.2;0.7;1"
                repeatCount="indefinite"
                values="0; 4; 0; 0"
            />
          </circle>
        </svg>
      </div>
    ) : null;
  }
};
