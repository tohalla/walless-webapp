import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';

import {minimal, minor, normal, content} from 'styles/spacing';
import colors from 'styles/colors';

@Radium
export default class Tabbed extends React.Component {
  static propTypes = {
    tabs: PropTypes.shape({tab: PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired
    })}).isRequired,
    tab: PropTypes.string,
    onTabChange: PropTypes.func.isRequired
  }
  handleTabChange = tab => event => this.props.onTabChange(tab);
  render() {
    const {tabs, tab = Object.keys(tabs)[0]} = this.props;
    return (
      <div style={styles.container}>
        <div style={styles.tabs}>
          {Object.keys(tabs).map(key => (
            <div
                key={key}
                onClick={this.handleTabChange(key)}
                style={[].concat(styles.tab, key === tab ? styles.tabActive : [])}
            >
              {tabs[key].label}
            </div>
          ))}
        </div>
        <div style={styles.content}>
          {tabs[tab] && tabs[tab].content ?
            tabs[tab].content : null
          }
        </div>
      </div>
    );
  }
};

const styles = {
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'stretch',
    marginBottom: content
  },
  tabs: {
    flex: '0 1 auto',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tab: {
    fontSize: '0.9rem',
    margin: '0 1px',
    padding: `${minimal} ${minor}`,
    color: colors.foregroundDark,
    background: colors.backgroundDarken
  },
  tabActive: {
    background: colors.background,
    textDecoration: 'underline'
  },
  content: {
    padding: normal,
    display: 'flex',
    flexDirection: 'column',
    border: `1px solid ${colors.border}`
  }
};
