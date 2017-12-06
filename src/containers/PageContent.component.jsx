import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import Footer from 'containers/Footer.component';
import {major} from 'styles/spacing';

@Radium
export default class PageContent extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object
    ])
  };
  render() {
    const {children, style, ...props} = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.contentContainer}>
          <div style={styles.padding} />
          <div {...props} style={[styles.content, style]}>
            {children}
          </div>
          <div style={styles.padding} />
        </div>
        <Footer />
      </div>
    );
  }
}

const styles = {
  padding: {
    flexBasis: '5rem'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    flex: 1
  },
  contentContainer: {
    padding: `${major} 0`,
    display: 'flex',
    flexDirection: 'row',
    flex: 1
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  }
};
