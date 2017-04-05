import React from 'react';

export default (Element, params, props = {}) =>
  params && params.length > 0 ?
    class RouteParamWrapper extends React.Component {
      render = () =>
        <Element {...Object.assign(props,
          params.reduce((prev, curr) => {
            let key = typeof curr === 'object' ? curr.key : curr;
            return key && this.props.params[key] ?
              Object.assign(
                prev,
                {
                  [key]: typeof curr === 'object' && typeof curr.transform === 'function' ?
                    curr.transform(this.props.params[key]) :
                    this.props.params[key]
                }
              )
            : prev;
          }, {}))}
        />;
      }
  : Element;
