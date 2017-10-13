import 'images/walless.svg';
import 'images/walless.png';
import 'styles/main.css';
import 'styles/font.css';
import 'styles/authentication.css';
import 'normalize.css/normalize.css';

import config from 'config';

window.onload = () => {
  document.getElementById('authentication').action = `${config.api.protocol}://${config.api.url}:${config.api.port}/${config.api.authentication.endpoint}/`;
};
