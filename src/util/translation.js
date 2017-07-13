// @flow
import Polyglot from 'node-polyglot';
import fetch from 'isomorphic-fetch';

import config from 'config';

const {api: {protocol, port, url, translation: {endpoint}}} = config;

const translationsUrl = `${protocol}://${url}:${port}/${endpoint}`;

const polyglot = new Polyglot();

const SET_TRANSLATIONS = 'SET_TRANSLATIONS';
const SET_LANGUAGES = 'SET_LANGUAGES';

const initialState = {
 t: () => '',
 language: 'en'
};

export default (state: Object = initialState, action: Object) =>
  action.type === SET_TRANSLATIONS || action.type === SET_LANGUAGES ?
    Object.assign({}, state, action.payload)
  : state;

export const setLanguage = (langCode: string) => async(dispatch: Function) => {
  const translations = await (
    await fetch(`${translationsUrl}/${langCode}`)
  ).json();
  polyglot.replace(translations);
  dispatch({
    type: SET_TRANSLATIONS,
    payload: {
      t: (key, interpolarisations) => polyglot.t(key, interpolarisations)
    }
  });
};

export const fetchLanguages = async(dispatch: Function) => {
  const languages = await (await fetch(translationsUrl)).json();
  dispatch({
    type: SET_LANGUAGES,
    payload: {languages}
  });
};
