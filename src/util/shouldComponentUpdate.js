import {find} from 'lodash/fp';

export const isLoading = props => {
  return props && typeof props === 'object' ?
    Boolean(find(prop =>
      prop && prop.data && prop.data.loading
    )(props))
    : false;
};
