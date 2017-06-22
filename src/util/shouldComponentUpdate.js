import {find} from 'lodash/fp';

export const isLoading = props => {
  return props && typeof props === 'object' ?
    Boolean(find(prop =>
      prop && prop.loading
    )(props))
    : false;
};
