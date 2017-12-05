import color from 'color';

const colors = {
  red: '#e74c3c',
  white: '#FFFFFF',
  carrara: '#F2F1EF',
  gallery: '#E1E1E1',
  lightGray: '#9E9E9E',
  gray: '#424242',
  asphalt: '#95a5a6',
  darkGray: '#212121',
  black: '#000',
  orange: '#f39c12',
  green: '#2ecc71'
};

const labelled = {
  danger: colors.red,
  neutral: colors.lightGray,
  alert: colors.orange,
  success: colors.green,
  default: colors.green,
  accent: colors.red,
  border: colors.lightGray,
  background: colors.carrara,
  backgroundLight: colors.white,
  backgroundDark: colors.gray,
  disabled: colors.lightGray,
  foregroundLight: colors.carrara,
  foregroundDark: colors.darkGray,
  headerBackground: colors.white,
  headerForeground: colors.darkGray,
  inputBackground: colors.carrara,
  inputBackgroundDark: colors.gray
};

export default Object.assign({
  backgroundDarken: color(labelled.background).darken(0.1).hex(),
  neutralDarken: color(labelled.neutral).darken(0.3).hex(),
  defaultDarken: color(labelled.default).darken(0.1).hex(),
  accentDarken: color(labelled.accent).darken(0.2).hex()
}, labelled, colors);
