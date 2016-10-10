import React from 'react';
import {Link} from 'react-router';
import ClickOutside from 'react-click-outside';
import {Map} from 'immutable';

import Input from '../mdl/Input.component';

export default class Login extends React.Component {
  static contextTypes = {
    t: React.PropTypes.func,
    account: React.PropTypes.object
  };
  state = {
    data: new Map({
      password: '',
      email: '',
      showLogin: false
    })
  };
  // shouldComponentUpdate = (nextProps, nextState, nextContext) => !(
  //   this.state === nextState &&
  //   this.context.account.data === nextContext.account.data &&
  // ); uncomment when react updates
  openDialog = () =>
    this.setState(({data}) => ({data: data.set('showLogin', true)}));
  closeDialog = () =>
    this.setState(({data}) => ({data: data.set('showLogin', false)}));
  handleAuthentication = e => {
    e.preventDefault();
    this.context.account.authenticate(
      this.state.data.get('email'),
      this.state.data.get('password')
    );
    this.setState(({data}) => ({data: data.merge({
      showLogin: false, email: '', password: ''
    })}));
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState(({data}) => ({data: data.set(id, value)}));
  };
  render() {
    const t = this.context.t;
    const data = this.state.data;
    return data.get('showLogin') ? (
      <div>
        <button className="mdl-button button--light--disabled popup-container">
          {t('account.authenticate')}
        </button>
        <ClickOutside onClickOutside={this.closeDialog}>
          <div className="mdl-card mdl-shadow--2dp popup">
            <form onSubmit={this.handleAuthentication}>
              <div className="mdl-card__supporting-text">
                <Input
                    id="email"
                    label={t('account.email')}
                    onChange={this.handleInputChange}
                    required
                    value={data.get('email')}
                />
                <Input
                    id="password"
                    label={t('account.password')}
                    onChange={this.handleInputChange}
                    required
                    type="password"
                    value={data.get('password')}
                />
              </div>
              <div className="mdl-card__actions mdl-card__actions--spread">
                <Link to="/passwordReset">
                  {t('account.passwordForgotten')}
                </Link>
                <button className="mdl-button mdl-js-button">
                  {t('account.authenticate')}
                </button>
              </div>
            </form>
          </div>
        </ClickOutside>
      </div>
    ) : (
      <button
          className="mdl-button mdl-js-button button--light"
          onClick={this.openDialog}
          type="button"
      >
        {t('account.authenticate')}
      </button>
    );
  }
}
