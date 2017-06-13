// @flow
import Polyglot from 'node-polyglot';
import fetch from 'isomorphic-fetch';

const translationsUrl = 'http://127.0.0.1:8080/translation';

const getLanguages = async() => await (await fetch(translationsUrl)).json();

export const languages = getLanguages();

const polyglot = new Polyglot();

const FETCH_TRANSLATIONS = 'FETCH_TRANSLATIONS';
const SET_TRANSLATIONS = 'SET_TRANSLATIONS';

export default (state: Object = {t: () => polyglot.t}, action: Object) =>
  action.type === FETCH_TRANSLATIONS ? {
    isFetching: true,
    t: () => ''
  }
  : action.type === SET_TRANSLATIONS ? {
    t: action.payload.t
  }
  : state;

export const setLanguage = (langCode: string) => async(dispatch: Function) => {
  dispatch({
    type: FETCH_TRANSLATIONS
  });
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
