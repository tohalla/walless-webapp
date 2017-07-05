import React from 'react';
import PropTypes from 'prop-types';

import mdl from 'components/mdl';

class Button extends React.Component {
  static propTypes = {
    colored: PropTypes.bool,
    className: PropTypes.string,
    accent: PropTypes.bool,
    raised: PropTypes.bool,
    children: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.element
    ]),
    onClick: PropTypes.func,
    type: PropTypes.string,
    style: PropTypes.object,
    plain: PropTypes.bool,
    light: PropTypes.bool
  };
  static defaultProps = {
    type: 'button'
  }
  handleClick = event => {
    event.stopPropagation();
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(event);
    }
  }
  render() {
    const {
      raised,
      colored,
      accent,
      children,
      className,
      plain,
      light,
      onClick, // eslint-disable-line
      ...props
    } = this.props;
    return (
      <button
          className={
            [].concat(
              plain ? ['button--plain'].concat(
                colored ? 'button--colored' : [],
                raised ? 'button--raised' : [],
                accent ? 'button--accent' : []
              ) : ['mdl-button mdl-js-button'].concat(
                colored ? 'mdl-button--colored' : [],
                raised ? 'mdl-button--raised' : [],
                accent ? 'mdl-button--accent' : []
              ),
              light ? 'button--light' : [],
              className ? className : []
            ).join(' ')
          }
          onClick={this.handleClick}
          {...props}
      >
        {children}
      </button>
    );
  }
}

export default mdl(Button);
