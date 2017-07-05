import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import ClickOutside from 'react-click-outside';
import Button from 'components/Button.component';

import Input from 'components/Input.component';
import {addNotification} from 'notifications/notification';
import authenticationHandler from 'util/auth';
import apolloClient from 'apolloClient';

const mapStateToProps = state => ({t: state.util.translation.t});

class Authenticate extends React.Component {
  state = {
    password: '',
    email: '',
    showLogin: false
  };
  openDialog = () =>
    this.setState({showLogin: true});
  closeDialog = () =>
    this.setState({showLogin: false});
  handleAuthentication = async(e) => {
    e.preventDefault();
    await authenticationHandler.authenticate(
      this.state.email,
      this.state.password
    )
      .catch(() => this.props.addNotification({
        type: 'alert',
        content: 'login failed'
      }));
    apolloClient.resetStore();
  };
  handleInputChange = e => {
    const {id, value} = e.target;
    this.setState({[id]: value});
  };
  render() {
    const {t} = this.props;
    const {email, password, showLogin} = this.state;
    return showLogin ? (
      <div>
        <Button className="popup-container" disabled light>
          {t('account.authenticate')}
        </Button>
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
                <Button type="submit">
                  {t('account.authenticate')}
                </Button>
              </div>
            </form>
          </div>
        </ClickOutside>
      </div>
    ) : (
      <Button light onClick={this.openDialog}>
        {t('account.authenticate')}
      </Button>
    );
  }
}

export default connect(
  mapStateToProps, {addNotification}
)(Authenticate);

