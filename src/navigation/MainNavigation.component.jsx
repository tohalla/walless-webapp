import {connect} from 'react-redux';
import {compose} from 'react-apollo';
import {account} from 'walless-graphql';

import Logo from 'components/Logo.component';
import Navigation from 'navigation/Navigation.component';
import NavigationItem from 'navigation/NavigationItem.component';
import colors from 'styles/colors';
import shadow from 'styles/shadow';
import {normal, minor} from 'styles/spacing';
import UserNavigation from 'navigation/UserNavigation.component';

const menuItems = [
  {
    path: '/',
    translationKey: 'navigation.restaurant'
  },
  {
    path: '/documentation',
    translationKey: 'navigation.documentation'
  },
  {
    path: '/contact',
    translationKey: 'navigation.contactUs'
  },
  {
    path: '/profile',
    translationKey: 'navigation.profile'
  }
];

const mapStateToProps = state => ({
  t: state.util.translation.t
});

@Radium
class MainNavigation extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  render() {
    const {t, location} = this.props;
    return (
      <div style={[styles.container, shadow.small]}>
        <Logo />
        <Navigation style={styles.navigation}>
          {menuItems
            .map((item, index) => (
              <NavigationItem
                  active={
                    location.pathname.indexOf(item.path) === 0 &&
                    (item.path !== '/' || location.pathname === '/')
                  }
                  activeStyle={styles.itemActive}
                  key={index}
                  path={item.path}
                  style={styles.item}
              >
                {t(item.translationKey)}
              </NavigationItem>
          ))}
        </Navigation>
        <UserNavigation />
      </div>
    );
  }
}

export default compose(
  connect(mapStateToProps, {}),
  account.getActiveAccount
)(MainNavigation);

const styles = {
  container: {
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: `0 ${minor}`,
    backgroundColor: colors.headerBackground,
    color: colors.headerForeground
  },
  navigation: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: normal
  },
  item: {
    color: colors.headerForeground,
    textDecoration: 'none',
    padding: normal
  },
  itemActive: {
    textDecoration: 'underline'
  }
};
