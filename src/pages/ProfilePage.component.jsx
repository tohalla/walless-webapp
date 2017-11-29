import {compose} from 'react-apollo';
import {account} from 'walless-graphql';

import loadable from 'decorators/loadable';

@loadable()
@Radium
class Profile extends Component {
  render() {
    return <div />;
  }
}

export default compose(
  account.getActiveAccount
)(Profile);
