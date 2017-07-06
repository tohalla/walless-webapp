module.exports = {
  settings: {
    'import/parser': 'babel-eslint',
    'import/resolver': {"babel-module": {}}
  },
  extends: [
    'google',
    'plugin:flowtype/recommended'
  ],
  globals: {
    google: true
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'babel',
    'react',
    'import',
    'flowtype'
  ],
  env: {
    browser: true,
    node: true,
    es6: true
  },
  settings: {'import/resolver': {'node': {'extensions': ['.js', '.jsx']}}},
  parser: 'babel-eslint',
  rules: {
    'no-invalid-this': 0,
    'no-undef': 2,
    'require-jsdoc': 0,
    'comma-dangle': [2, 'never'],
    'import/named': 2,
    'import/no-commonjs': 2,
    'import/namespace': 2,
    'import/default': 2,
    'import/export': 2,
    'import/extensions': [2, {jsx: 'never', js: 'never'}],
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-nested-ternary': 0,
    'operator-linebreak': 0,
    'generator-star-spacing': 1,
    'babel/new-cap': 1,
    'array-bracket-spacing': 1,
    'babel/object-curly-spacing': 1,
    'object-shorthand': 1,
    'no-await-in-loop': 1,
    'max-len': 0,
    'react/jsx-boolean-value': 2,
    'react/jsx-closing-bracket-location': 2,
    'react/jsx-curly-spacing': 2,
    'react/jsx-indent-props': 2,
    'react/jsx-key': 2,
    'react/jsx-max-props-per-line': [2, {maximum: 5}],
    'react/jsx-no-bind': [2, {ignoreRefs: true}],
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-literals': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-pascal-case': 2,
    'jsx-quotes': 2,
    'react/jsx-sort-props': 2,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/no-danger': 2,
    'react/no-deprecated': 2,
    'react/no-did-mount-set-state': 2,
    'react/no-did-update-set-state': 2,
    'react/no-direct-mutation-state': 2,
    'react/no-is-mounted': 2,
    'react/no-multi-comp': 0,
    'react/no-string-refs': 2,
    'react/no-unknown-property': 2,
    'react/prefer-es6-class': 2,
    'react/react-in-jsx-scope': 2,
    'react/self-closing-comp': 2,
    'react/sort-comp': 2,
    'react/prop-types': 0,
    'react/jsx-wrap-multilines': 2
  }
};
