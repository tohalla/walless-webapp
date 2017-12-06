import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {content, normal} from 'styles/spacing';
import {equals} from 'lodash/fp';

const getLabelsWidth = items => 0.6 * items.reduce((length, item) =>
  item && item.label && item.label.length > length ?
    item.label.length : length,
  0
  ) + 'rem';

@Radium
export default class ItemsWithLabels extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        item: PropTypes.node
      }),
      PropTypes.node
    ])),
    hideEmpty: PropTypes.bool
  };
  static defaultProps = {
    hideEmpty: true
  };
  constructor(props) {
    super(props);
    this.state = {labelWidth: getLabelsWidth(props.items)};
  };
  componentWillReceiveProps = ({items}) => equals(items === this.props.items) &&
    this.setState({labelWidth: getLabelsWidth(items)});
  render() {
    const {items, hideEmpty} = this.props;
    return (
      <div style={styles.container}>
        {items.reduce((prev, curr) =>
          !curr ? prev
            : !curr.item && hideEmpty && curr.label ?
              prev
              : prev.concat(
                <div
                  key={prev.length}
                  style={[].concat(styles.row, prev.length ? {paddingTop: content} : [])}
                >
                  {curr.label &&
                  <div style={[styles.header, {flexBasis: this.state.labelWidth}]}>
                    {curr.label}
                  </div>
                  }
                  {curr.label || curr.item ? curr.item : curr}
                </div>
              ),
        []
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
