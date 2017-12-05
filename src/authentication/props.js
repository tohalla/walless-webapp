import fetch from 'isomorphic-fetch';
import Cookie from 'js-cookie';
import {t} from 'i18next';

import config from 'config';

const query = window.location.search
  .substr(1)
  .split('&')
  .reduce((prev, curr) => {
    const [key, value] = curr.split('=');
    return Object.assign({}, prev, {[key]: value});
  }, {});

const {email, token} = query;

const props = {
  reset: {
    submitId: query.token && query.email ? 'update-password' : 'send-link',
    titleKey: query.email ? 'account.resetPasswordFor' : 'account.resetPassword',
    form: Object.assign(
      {action: ''},
      token && email ? {
        onsubmit: event => {
          event.preventDefault();
          const password = document.getElementById('new-password').value;
          const retypePassword = document.getElementById('retype-password').value;
          if (password === retypePassword) {
            fetch(
              `${config.api.protocol}://${config.api.url}${
                config.api.port === 80 ? '' : `:${config.api.port}`
              }/${config.api.authentication.endpoint}/password`,
              {
                method: 'POST',
                body: JSON.stringify({
                  token,
                  email,
                  password
                }),
                headers: {'Content-Type': 'application/json; charset=utf-8'}
              }
            )
              .then(response => response.json())
              .then(({message}) => setMessage(message));
          } else {
            addError(t('error.passwordsDoNotMatch'));
          }
        }
      } : {
        onsubmit: event => {
          event.preventDefault();
          const email = document.getElementById('email').value;
          fetch(
            `${config.api.protocol}://${config.api.url}${
              config.api.port === 80 ? '' : `:${config.api.port}`
            }/${config.api.authentication.endpoint}/request-reset`,
            {
              method: 'POST',
              body: JSON.stringify({email}),
              headers: {'Content-Type': 'application/json; charset=utf-8'}
            }
          )
            .then(response => response.json())
            .then(({message}) => setMessage(message));
        }
      }
    )
  },
  default: {
    submitId: 'authenticate',
    titleKey: 'account.authenticate',
    form: {
      action: `${config.api.protocol}://${config.api.url}${
        config.api.port === 80 ? '' : `:${config.api.port}`
      }/${config.api.authentication.endpoint}/`
    }
  }
};

export const setMessage = message => {
  const messageContainer = Object.assign(
    document.createElement('div'),
    {className: 'message-container'}
  );
  messageContainer.appendChild(
    Object.assign(document.createElement('span'), {
      innerHTML: t(message, {email})
    })
  );
  const authentication = document.getElementById('authentication');
  authentication.parentNode.replaceChild(
    messageContainer,
    authentication
  );
};

const actions = document.getElementById('actions');

export const addError = (error = t(Cookie.get('Error'))) => {
  [...document.getElementsByClassName('error')].forEach(element =>
    element.parentNode.removeChild(element)
  );
  if (error) {
    [].concat(error).forEach(error =>
      actions.parentNode.insertBefore(
        Object.assign(
          document.createElement('p'),
          {innerHTML: error, className: 'error'}
        ),
        actions
      )
    );
  };
  Cookie.remove('Error');
};

export default Object.assign(
  {},
  query,
  Object.keys(props.default).reduce(
    (prev, curr) =>
      Object.assign({}, prev, {
        [curr]: props[query.action || 'default'][curr] || props.default[curr]
      }),
    {}
  )
);
