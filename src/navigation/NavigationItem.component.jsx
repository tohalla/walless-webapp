import {Link as RouterLink} from 'react-router-dom';

const Link = new Radium(RouterLink);

@Radium
export default class NavigationItem extends Component {
  static propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node.isRequired,
    chevron: PropTypes.bool,
    path: PropTypes.string,
    activeStyle: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ]),
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ])
  };
  render() {
    const {
      active,
      chevron,
      path,
      children,
      style,
      activeStyle,
      ...props
    } = this.props;
    return (
      <Link
        style={[].concat(styles.container, style)}
        to={path}
        {...props}
      >
        <span style={active ? activeStyle : {}}>{children}</span>
        {chevron ?
          <i className='material-icons' style={[].concat(styles.chevron, active ? styles.chevronActive : [])}>
            {'chevron_right'}
          </i>
          : null}
      </Link>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  chevron: {
    textDecoration: 'none',
    opacity: 0.4
  },
  chevronActive: {
    opacity: 0.7
  }
};
