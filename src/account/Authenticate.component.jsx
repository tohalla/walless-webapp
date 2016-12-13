import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import ClickOutside from 'react-click-outside';

import Input from 'mdl/Input.component';
import {addNotification} from 'notifications/notification';

const mapStateToProps = state => ({t: state.util.translation.t});

class Authenticate extends React.Component {
  static contextTypes = {
    authenticationHandler: React.PropTypes.object
  };
  state = {
    password: '',
    email: '',
    showLogin: false
  };
  openDialog = () =>
    this.setState({showLogin: true});
  closeDialog = () =>
    this.setState({showLogin: false});
  handleAuthentication = e => {
    e.preventDefault();
    this.context.authenticationHandler.authenticate(
      this.state.email,
      this.state.password
    )
      .catch(() => this.props.addNotification({
        type: 'alert',
        content: 'login failed'
      }));
  }
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  };
  render() {
    const {t} = this.props;
    const {email, password, showLogin} = this.state;
    return showLogin ? (
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
                    value={email}
                />
                <Input
                    id="password"
                    label={t('account.password')}
                    onChange={this.handleInputChange}
                    required
                    type="password"
                    value={password}
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

export default connect(
  mapStateToProps, {addNotification}
)(Authenticate);

