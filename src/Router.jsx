import {
  Route,
  BrowserRouter
} from 'react-router-dom';

import Root from 'containers/Root.component';

export default class extends Component {
  shouldComponentUpdate = () => false;
  render() {
    return (
      <BrowserRouter>
        <Route component={Root} path='/' />
      </BrowserRouter>
    );
  }
}
