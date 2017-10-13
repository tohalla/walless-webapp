import 'babel-polyfill';
import ReactDOM from 'react-dom';
import apolloProvider from 'apolloProvider';

ReactDOM.render(apolloProvider, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}

import 'styles/main.css';
import 'styles/font.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'normalize.css/normalize.css';
import 'react-select/dist/react-select.css';
