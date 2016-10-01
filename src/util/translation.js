// @flow
import Polyglot from 'node-polyglot';
import fetch from 'isomorphic-fetch';

const translationsUrl = 'http://127.0.0.1:8080/translation';

const getLanguages = async () => await (await fetch(translationsUrl)).json();

export const languages = getLanguages();

const polyglot = new Polyglot();

export const updateTranslations = async (language: string) => {
  const translations = await (
    await fetch(`${translationsUrl}/${language}`)
  ).json();
  polyglot.replace(translations);
  return polyglot;
};

export default polyglot;
