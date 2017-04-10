import React from 'react';

import {isEqual} from 'lodash/fp';

export default class SelectObjects extends React.Component {
  static propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
    objects: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
    selectedObjects: React.PropTypes.arrayOf(React.PropTypes.object),
    renderObject: React.PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.state = {
      objects: props.objects.map(object =>
        Object.assign(
          {},
          object,
          {_selected: Boolean(props.selectedItems.find(o => isEqual(o)(object)))}
        )
      )
    };
  }
  toggleSelection = item => event => {
    event.stopPropagation();
    item._selected = !item._selected;
  };
  render() {
    const {objects} = this.state;
    const {renderObject, onSubmit} = this.props;
    return (
      <div>
        {
          objects.map((object, index) =>
            React.cloneElement(
              renderObject(object),
              {key: index, onClick: this.toggleSelection(object), style: {opacity: object._selected ? 1 : .8}}
            )
          )
        }
      </div>
    );
  }
}
