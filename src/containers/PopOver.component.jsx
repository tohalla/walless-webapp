import ReactClickOutside from 'react-click-outside';

const ClickOutside = new Radium(ReactClickOutside);

import {popOverZIndex} from 'styles/zIndex';
import {normal} from 'styles/spacing';
import colors from 'styles/colors';
import shadow from 'styles/shadow';

const fontSize = Number(getComputedStyle(document.getElementById('app')).fontSize.replace('px', ''));

const toPx = value => !value ? 0
  : value.endsWith('rem') ?
    Number(value.replace('rem', '')) * fontSize
  : value.endsWith('px') ? Number(value.replace('px', ''))
  : value;

@Radium
export default class PopOver extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onClickOutside: PropTypes.func.isRequired
  };
  state = {
    position: null
  }
  componentDidMount = () => {
    const {container: {
      offsetWidth,
      offsetHeight,
      offsetTop,
      offsetLeft,
      style: {
        marginLeft,
        marginTop,
        marginRight,
        marginBottom
      }
    }} = this.popOver;
    const left = toPx(marginLeft);
    const right = toPx(marginRight);
    const top = toPx(marginTop);
    const bottom = toPx(marginBottom);
    this.setState({
      position: Object.assign(
        offsetLeft + offsetWidth > window.innerWidth ?
          {left: window.innerWidth - offsetWidth - right, marginLeft: 0, marginRight: 0}
        : offsetLeft < 0 ?
          {left, marginLeft: 0, marginRight: 0}
        : {marginLeft, marginRight},
        offsetTop + offsetHeight > window.innerHeight ?
          {top: window.innerHeight - offsetHeight - bottom, marginBottom: 0, marginTop: 0}
        : offsetTop < 0 ?
          {top, marginTop: 0, marginBottom: 0}
        : {marginTop, marginBottom}
      )
    });
  };
  handleClickOutside = event => {
    event.stopPropagation();
    this.props.onClickOutside(event);
  };
  render() {
    const {children, style, ...props} = this.props;
    return (
      <div style={{position: 'relative', flex: 0}}>
        <ClickOutside
            {...props}
            onClickOutside={this.handleClickOutside}
            ref={c => this.popOver = c}
            style={[styles.container, style, this.state.position]}
        >
          {children}
        </ClickOutside>
      </div>
    );
  }
};

const styles = {
  container: Object.assign({
    zIndex: popOverZIndex,
    padding: normal,
    position: 'fixed',
    backgroundColor: colors.backgroundLight,
    border: `1px solid ${colors.border}`,
    marginTop: '-.3rem',
    marginLeft: '.8rem',
    marginRight: normal
  }, shadow.small)
};
