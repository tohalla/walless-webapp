import shadow from 'styles/shadow';
import {content, normal} from 'styles/spacing';
import colors from 'styles/colors';

export default {
  contentContainer: Object.assign({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    backgroundColor: colors.backgroundLight,
    padding: content
  }, shadow.small),
  informationContainer: {
    fontSize: '0.9rem',
    paddingLeft: normal,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch'
  }
};
