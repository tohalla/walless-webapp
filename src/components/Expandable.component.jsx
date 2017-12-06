import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {translate} from 'react-i18next';

import Button from 'components/Button.component';
import Header from 'components/Header.component';
import colors from 'styles/colors';
import {normal} from 'styles/spacing';

@translate()
@Radium
export default class Expandable extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onExpand: PropTypes.func,
    onContract: PropTypes.func,
    expandDefault: PropTypes.bool,
    title: PropTypes.string.isRequired
  };
  static defaultProps = {
    expandDefault: false
  };
  constructor(props) {
    super(props);
    this.state = {
      expand: props.expandDefault
    };
  }
  toggleExpand = () => {
    const {onContract, onExpand} = this.props;
    const {expand} = this.state;
    return (expand && typeof onContract === 'function' && onContract() === false)
      || (!expand && typeof onExpand === 'function' && onExpand() === false)
      || this.setState({expand: !this.state.expand});
  };
  render() {
    const {expand} = this.state;
    const {title, children} = this.props;
    return (
      <div style={[styles.container, expand ? styles.expanded : {}]}>
        {expand ? (
          <Fragment>
            <Header actions={[{
              onClick: this.toggleExpand,
              label: <i className='material-icons'>{'close'}</i>
            }]}>
              {title}
            </Header>
            <div style={styles.content}>{children}</div>
          </Fragment>
        ) : (
          <div><Button onClick={this.toggleExpand}>{title}</Button></div>
        )}
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  expanded: {
    border: `1px solid ${colors.border}`
  },
  content: {
    padding: normal
  }
};
