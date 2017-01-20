import React from 'react';
import {reduxForm, Field} from 'redux-form';

import Input from 'mdl/Input.component';

const filterByName = ({input, label, meta, ...rest}) => (
  <Input
      label={label}
      {...input}
      {...rest}
  />
);

class FilterMenuItems extends React.Component {
  render() {
    // const {handleSubmit} = this.props;
    return (
      <div>
        <Field
            autoComplete="off"
            component={filterByName}
            id="filter-by-name"
            label="Type text to filter"
            name="name"
            type="text"
        />
      </div>
    );
  }
}

export default reduxForm({
  form: 'menuItemFilter'
})(FilterMenuItems);
