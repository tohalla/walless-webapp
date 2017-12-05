import {t} from 'i18next';

import i18n from 'util/i18n';
import props, {addError} from 'authentication/props';

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
  if (element) element[attribute] = t(key, data);
};

i18n({}, () => updateTranslations('init'));
