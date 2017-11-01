import {major} from 'styles/spacing';
import colors from 'styles/colors';

@Radium
export default class Footer extends React.Component {
  render() {
    return (
      <div style={styles.footer}>
        {'© Walless'}
      </div>
    );
  }
}

const styles = {
  footer: {
    flex: '0 0 auto',
    padding: `0 ${major}`,
    overflow: 'hidden',
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    color: colors.lightGray
  }
};
