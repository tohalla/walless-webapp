import props from 'authentication/props';
import {updateTranslations} from 'authentication/translation';
import walless from 'images/walless.svg';
import wallessPng from 'images/walless.png';
import 'styles/font.css';
import 'styles/authentication.css';
import 'normalize.css/normalize.css';

const actions = document.getElementById('actions');

const email = Object.assign(document.createElement('input'), {
  className: 'input',
  name: 'email',
  id: 'email',
  required: true,
  type: 'text'
});

const password = Object.assign(document.createElement('input'), {
  className: 'input',
  name: 'password',
  id: props.token ? 'new-password' : 'password',
  required: true,
  type: 'password'
});

const submit = Object.assign(document.createElement('button'), {
  className: 'button',
  id: props.submitId,
  type: 'submit'
});

const authentication = Object.assign(
  document.getElementById('authentication'),
  props.form
);

window.onload = () => {
  if (props.action === 'reset') {
    actions.appendChild(document.createElement('span'));
    if (props.token && props.email) {
      authentication.insertBefore(password, actions);
      authentication.insertBefore(
        Object.assign(document.createElement('input'), {
          className: 'input',
          id: 'retype-password',
          required: true,
          type: 'password'
        }),
        actions
      );
    } else {
      authentication.insertBefore(email, actions);
    }
  } else {
    actions.appendChild(
      Object.assign(document.createElement('a'), {
        id: 'password-reset',
        href: '?action=reset'
      })
    );
    authentication.insertBefore(email, actions);
    authentication.insertBefore(password, actions);
  }
  actions.appendChild(submit);
  const logo = document.getElementById('logo');
  logo.setAttribute('xlink:href', walless);
  logo.setAttribute('src', wallessPng);
  updateTranslations('onload');
};
