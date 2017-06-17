import React from 'react';
import PropTypes from 'prop-types';

export default class ItemsWithLabels extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.shape({
        label: PropTypes.string,
        item: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.number])
      }),
      PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.number])
    ]))
  };
  render() {
    const {items} = this.props;
    return (
      <table>
        <tbody>
          {items.map((item, index) =>
            item.label ? (
              <tr key={index}>
                <th>{item.label}</th>
                <td>{item.item}</td>
              </tr>
              ) : <tr key={index}><td colSpan={2}>{item}</td></tr>
          )}
        </tbody>
      </table>
    );
  }
}
