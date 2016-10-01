import React from 'react';
import {Link} from 'react-router';
import ClickOutside from 'react-click-outside';

import Input from '../mdl/Input.component';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false
    };
  }
  openDialog = () =>
    this.setState({showLogin: true});
  closeDialog = () =>
    this.setState({showLogin: false});
  handleLogin = e => {
    e.preventDefault();
    this.setState({showLogin: false});
  }
  handleInputChange = e => {
    this.setState({[e.target.name]: e.target.value});
  }
  render() {
    return this.state.showLogin ?
      (
        <div>
          <button className="mdl-button mdl-button--disabled mdl-button--light popup-container">
            {'Log in'}
          </button>
          <ClickOutside onClickOutside={this.closeDialog}>
            <div className="mdl-card mdl-shadow--2dp popup">
              <form onSubmit={this.handleLogin}>
                <div className="mdl-card__supporting-text">
                  <Input
                      id="email"
                      label="email"
                      name="email"
                      onChange={this.handleInputChange}
                      required
                      value={this.state.value}
                  />
                  <Input
                      id="password"
                      label="password"
                      name="password"
                      onChange={this.handleInputChange}
                      required
                      type="password"
                      value={this.state.value}
                  />
                </div>
                <div className="mdl-card__actions mdl-card__actions--spread">
                  <Link to="/passwordReset">
                    {'Did you forget your password?'}
                  </Link>
                  <button className="mdl-button mdl-js-button">
                    {'Log in'}
                  </button>
                </div>
              </form>
            </div>
          </ClickOutside>
        </div>
      )
    :
      (
        <button
            className="mdl-button mdl-js-button mdl-button--light"
            onClick={this.openDialog}
            type="button"
        >
          {'Log in'}
        </button>
      );
  }
}
