import React from 'react';
import PropTypes from 'prop-types';

export default class Tabbed extends React.Component {
  static propTypes = {
    tabs: PropTypes.shape({tab: PropTypes.shape({
      label: PropTypes.string.isRequired,
      render: PropTypes.bool.isRequired
    })}).isRequired,
    tab: PropTypes.string,
    onTabChange: PropTypes.func.isRequired
  }
  handleTabChange = tab => event => this.props.onTabChange(tab);
  render() {
    const {tabs, tab = Object.keys(tabs)[0]} = this.props;
    return (
      <div className="tab-container container--padded">
        <div className="tab-container__tabs">
          {Object.keys(tabs).map(key => (
            <div
                className={`tab-container__tab${key === tab ? ' tab-container__tab--active' : ''}`}
                key={key}
                onClick={this.handleTabChange(key)}
            >
              {tabs[key].label}
            </div>
          ))}
        </div>
        <div className="tab-container__content">
          {tabs[tab] && typeof tabs[tab].render === 'function' ?
            tabs[tab].render() : null
          }
        </div>
      </div>
    );
  }
};
