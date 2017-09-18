import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import {content, normal} from 'styles/spacing';

@Radium
export default class ItemsWithLabels extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        item: PropTypes.node
      }),
      PropTypes.node
    ]))
  };
  constructor(props) {
    super(props);
    this.state = {
      headerWidth: .6 * props.items.reduce((length, item) =>
        item && item.label && item.label.length > length ?
          item.label.length : length,
        0
      ) + 'rem'
    };
  }
  render() {
    const {items} = this.props;
    return (
      <div style={styles.container}>
        {items.map((item, index) =>
          item && (item.item || item.label) ? (
            <div key={index} style={[].concat(styles.row, index === items.length - 1 ? [] : {paddingBottom: content})}>
              {item.label ?
                <div style={[].concat(styles.header, {flexBasis: this.state.headerWidth})}>
                  {item.label}
                </div> : null
              }
              {item.item}
            </div>
          ) : (
            <div key={index} style={[].concat(styles.row, index === items.length - 1 ? [] : {paddingBottom: content})}>
              {item}
            </div>
          )
        )}
      </div>
    );
  }
}

const styles = {
  container: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column'
  },
  header: {
    marginRight: normal
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  }
};
