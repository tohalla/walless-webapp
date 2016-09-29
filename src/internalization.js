// @flow
import Polyglot from 'node-polyglot';
import fetch from 'isomorphic-fetch';

const translationsUrl = 'http://127.0.0.1:8080/translation'

const getLanguages = async () => await (await fetch(translationsUrl)).json();

const languages = getLanguages();

let polyglot = new Polyglot();

export const updateTranslations = async (language: string) => {
  const translations = await fetch(`${translationsUrl}/${language}`);
  polyglot = new Polyglot();
  polyglot.extend(await translations.json());
}

export {languages};

export default polyglot;
