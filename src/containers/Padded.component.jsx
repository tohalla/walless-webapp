import React from 'react';

export default props => (
  <div className="mdl-grid">
    <div className="mdl-cell mdl-cell--1-col"/>
    <div className="mdl-cell mdl-cell--10-col">
      {props.children}
    </div>
    <div className="mdl-cell mdl-cell--1-col"/>
  </div>
);
