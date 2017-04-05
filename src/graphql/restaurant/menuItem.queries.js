import {graphql} from 'react-apollo';
import {hasIn} from 'lodash/fp';
import gql from 'graphql-tag';

import {fileFragment} from 'graphql/file.queries';

const menuItemFragment = gql`
  fragment menuItemInfo on MenuItem {
    id
    name
    description
    restaurant
    createdAt
    createdBy
    category
    type
    menuItemFilesByMenuItem {
      edges {
        node {
          fileByFile {
            ...fileInfo
          }
        }
      }
    }
  }
  ${fileFragment}
`;

const formatMenuItem = (menuItem = {}) => {
  const {menuItemFilesByMenuItem, ...rest} = menuItem;
  let files = [];
  if (hasIn(['menuItemFilesByMenuItem', 'edges'])(menuItem)) {
    files = menuItemFilesByMenuItem.edges
      .map(edge => edge.node.fileByFile);
  }
  return Object.assign({}, rest, {files});
};

const getMenuItem = graphql(
  gql`
    query menuItemById($id: Int!) {
      menuItemById(id: $id) {
        ...menuItemInfo
      }
    }
    ${menuItemFragment}
  `, {
    skip: ownProps => typeof ownProps.menuItem !== 'number',
    options: ownProps => ({
      variables: {
        id: typeof ownProps.menuItem === 'number' ? ownProps.menuItem : null
      }
    }),
    props: ({ownProps, data}) => {
      const {menuItemById, ...rest} = data;
      return {getMenuItem: {
        menuItem: formatMenuItem(menuItemById),
        data: rest
      }};
    }
  }
);

export {
  menuItemFragment,
  getMenuItem,
  formatMenuItem
};
