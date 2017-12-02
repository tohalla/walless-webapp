import i18next from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';

import props, {addError} from 'authentication/props';
import config from 'config';

i18next
  .use(i18nextXHRBackend)
  .use(i18nextBrowserLanguageDetector)
  .init(
    {
      keySeparator: false,
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      backend: {
        loadPath: `${config.api.protocol}://${config.api.url}${
          config.api.port === 80 ? '' : `:${config.api.port}`
        }/${config.api.translation.endpoint}/{{lng}}`
      }
    },
    (err, t) => updateTranslations('init')
  );

let loaded = false;
let initialized = false;

export const updateTranslations = caller => {
  if (caller === 'onload') loaded = true;
  if (caller === 'init') initialized = true;
  if (loaded && initialized) {
    translateElement('title', props.titleKey, {email: props.email});

    translateElement('password-reset', 'account.passwordForgotten');

    translateElement('password', 'account.password', undefined, 'placeholder');
    translateElement(
      'retype-password',
      'account.retypePassword',
      undefined,
      'placeholder'
    );
    translateElement(
      'new-password',
      'account.newPassword',
      undefined,
      'placeholder'
    );

    translateElement('email', 'account.email', undefined, 'placeholder');

    translateElement('update-password', 'account.updatePassword');
    translateElement('authenticate', 'account.authenticate');
    translateElement('send-link', 'account.sendResetEmail');

    addError();
  }
};

const translateElement = (id, key, data, attribute = 'innerHTML') => {
  const element = document.getElementById(id);
  if (element) element[attribute] = i18next.t(key, data);
};
