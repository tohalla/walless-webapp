import React from 'react';

export default (Element, params, props) =>
  params && params.length > 0 ?
    class RouteParamWrapper extends React.Component {
      render = () =>
        <Element {...Object.assign(props,
          params.reduce((prev, curr) =>
            this.props.routeParams[curr] ?
              Object.assign(prev, {[curr]: this.props.routeParams[curr]})
            : prev,
            {}
          ))}
        />;
      }
  : Element;
