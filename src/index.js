import ReactDOM from 'react-dom';
import provider from 'provider';
import {reactI18nextModule} from 'react-i18next';

import i18n from 'util/i18n';

i18n({
  modules: [reactI18nextModule],
  options: {
    interpolation: {
      escapeValue: false
    }
  }
});

ReactDOM.render(provider, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}

import 'styles/main.css';
import 'styles/font.css';
import 'styles/day-picker.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'normalize.css/normalize.css';
import 'react-select/dist/react-select.css';
