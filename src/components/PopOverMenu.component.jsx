import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import PopOver from 'containers/PopOver.component';
import Button from 'components/Button.component';
import {minor} from 'styles/spacing';
import colors from 'styles/colors';

@Radium
export default class PopOverMenu extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired
    })).isRequired,
    label: PropTypes.node.isRequired,
    onItemClick: PropTypes.func
  };
  state = {open: false};
  close = () =>
    this.setState({open: false});
  toggle = () =>
    this.setState({open: !this.state.open});
  handleItemClick = item => event => {
    event.stopPropagation();
    if (typeof this.props.onItemClick === 'function') {
      this.props.onItemClick(item);
    }
    if (typeof item.onClick === 'function') {
      item.onClick();
    }
  }
  render() {
    const {label, items} = this.props;
    return (
      <div style={styles.container}>
        <Button onClick={this.toggle} plain>{label}</Button>
        {this.state.open ?
          <PopOver onClickOutside={this.close} style={styles.popOver}>
            <div style={styles.menuItems}>
              {items.map((item, index) => (
                <div
                    key={index}
                    onClick={this.handleItemClick(item)}
                    style={styles.menuItem}
                >
                  {item.label}
                </div>
              ))}
            </div>
          </PopOver> : null
        }
      </div>
    );
  }
};

const styles = {
  container: {flex: 0},
  popOver: {padding: 0},
  menuItems: {
    minWidth: '8rem',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column'
  },
  menuItem: {
    padding: minor,
    [':hover']: {
      cursor: 'pointer',
      backgroundColor: colors.carrara
    }
  }
};
