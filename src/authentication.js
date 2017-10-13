import walless from 'images/walless.svg';
import wallessPng from 'images/walless.png';
import 'styles/main.css';
import 'styles/font.css';
import 'styles/authentication.css';
import 'normalize.css/normalize.css';

import config from 'config';

window.onload = () => {
  document.getElementById('authentication').action = `${config.api.protocol}://${config.api.url}${config.api.port === 80 ? '' : `:${config.api.port}`}/${config.api.authentication.endpoint}/`;

  let logo = document.getElementById('logo');
  logo.setAttribute('xlink:href', walless);
  logo.setAttribute('src', wallessPng);
};
