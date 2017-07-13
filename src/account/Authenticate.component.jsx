import React from 'react';
import Radium from 'radium';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import Button from 'components/Button.component';

import Input from 'components/Input.component';
import PopOver from 'containers/PopOver.component';
import {addNotification} from 'notifications/notification';
import authenticationHandler from 'util/auth';
import apolloClient from 'apolloClient';
import {normal} from 'styles/spacing';

const mapStateToProps = state => ({t: state.util.translation.t});

@Radium
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
        <Button disabled>
          {t('account.authenticate')}
        </Button>
        <PopOver onClickOutside={this.closeDialog} style={styles.popOver}>
          <form onSubmit={this.handleAuthentication}>
            <div>
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
            <div>
              <Link to="/passwordReset">
                {t('account.passwordForgotten')}
              </Link>
              <Button type="submit">
                {t('account.authenticate')}
              </Button>
            </div>
          </form>
        </PopOver>
      </div>
    ) : (
      <Button onClick={this.openDialog}>
        {t('account.authenticate')}
      </Button>
    );
  }
}

export default connect(
  mapStateToProps, {addNotification}
)(Authenticate);

const styles = {
  popOver: {
    marginLeft: `-${normal}`,
    minWidth: '20rem'
  }
};
