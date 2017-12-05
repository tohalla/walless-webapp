// @flow
import i18next from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';
import i18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';

import config from 'config';


export default (
  {modules = [], options}: { modules: Array<any>, options: {} },
  cb: (error: any, t: () => string) => any
) =>
  [i18nextXHRBackend, i18nextBrowserLanguageDetector, ...modules]
    .reduce((prev, curr) => prev.use(curr), i18next)
    .init(
      Object.assign(
        {
          keySeparator: false,
          fallbackLng: 'en',
          load: 'languageOnly',
          debug: process.env.NODE_ENV === 'development',
          backend: {
            loadPath: `${config.api.protocol}://${config.api.url}${
              config.api.port === 80 ? '' : `:${config.api.port}`
            }/${config.api.translation.endpoint}/{{lng}}`
          }
        },
        options
      ),
      (error, t) => typeof cb === 'function' && cb(error, t)
    );
