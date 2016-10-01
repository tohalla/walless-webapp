import React from 'react';
import {Link} from 'react-router';

import Account from '../account/Login.component';

export default class UserNavigation extends React.Component {
  render = () => (
    <nav className="mdl-navigation">
      <Link className="mdl-navigation__link" to="/account">
        <i className="mdi mdi-account mdi-32px" />
      </Link>
      <Account />
    </nav>
  );
}
