import React from 'react';
import {find} from 'lodash/fp';

import Loading from 'components/Loading';

const isLoading = props => {
  return props && typeof props === 'object' ?
    Boolean(find(prop =>
      prop && prop.loading
    )(props))
    : false;
};

export default ({hideIndicator} = {}) => Component => class Loadable extends React.Component {
  render() {
    return isLoading(this.props) ?
      hideIndicator ?
        null
        : <Loading />
      : <Component {...this.props} />;
  }
};
