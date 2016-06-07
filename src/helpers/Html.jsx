import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';

export default class Html extends Component {
  render() {
    const { assets, component, store } = this.props;
    const content = component ? ReactDOM.renderToString(component) : '';

    return (
      <html>
        <head>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>qicon</title>
        </head>
        <body>
          <div id="app">{content}</div>
          <script charSet="utf-8">
            window.__data={serialize(store.getState())};
          </script>
          <script src={assets.javascript.main} charSet="utf-8" />
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object,
};
