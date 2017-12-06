import React from 'react';
import PropTypes from 'prop-types';
import Radium from 'radium';
import {minor, minimal} from 'styles/spacing';
import shadow from 'styles/shadow';
import Button from 'components/Button.component';
import colors from 'styles/colors';

const Header = ({children, style, actions}) =>
  <div style={[{
    display: 'flex',
    backgroundColor: colors.carrara,
    color: colors.foregroundDark,
    justifyContent: 'space-between',
    alignItems: 'center'
  }].concat(shadow.bottom, style || [])}>
    <div style={{padding: `${minimal} ${minor}`}}>{children}</div>
    {Array.isArray(actions) && actions.length &&
      <div>
        {actions.map((action, index) =>
          <Button
            key={index}
            onClick={action.onClick}
            plain
            style={{color: colors.foregroundDark}}
          >
            {action.label}
          </Button>
        )}
      </div>}
  </div>;

Header.propTypes = {
  children: PropTypes.node,
  actions: PropTypes.arrayOf(PropTypes.shape({
    onClick: PropTypes.func.isRequired,
    label: PropTypes.node.isRequired
  })),
  style: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.object),
    PropTypes.object
  ])
};

export default new Radium(Header);
