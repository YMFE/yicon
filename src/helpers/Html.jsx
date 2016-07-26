import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import { getURLStateName } from 'isom-fetch';

const Html = (props) => {
  const { assets, component, store, urls, authType } = props;
  const content = component ? ReactDOM.renderToString(component) : '';

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {Object.keys(assets.styles).map((style, i) =>
          <link
            href={assets.styles[style]}
            key={i}
            media="screen, projection"
            rel="stylesheet"
            type="text/css"
          />)
        }
        <title>qicon</title>
      </head>
      <body>
        <div
          id="app"
          dangerouslySetInnerHTML={{ __html: content }}
        >
        </div>
        <script
          charSet="utf-8"
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_STATE__=${serialize(store.getState())};`,
          }}
        />
        <script
          charSet="utf-8"
          dangerouslySetInnerHTML={{
            __html: `window.${getURLStateName()}=${serialize(urls)};`,
          }}
        />
        <script src={assets.javascript.main} charSet="utf-8" />
        {
          authType === 'qsso' &&
            <script
              src="https://qsso.corp.qunar.com/lib/qsso-auth.js"
              charSet="utf-8"
              dangerouslySetInnerHTML={{
                __html: 'QSSO.attach("qsso-login", "/api/login")',
              }}
            >
            </script>
        }
      </body>
    </html>
  );
};

Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object,
  urls: PropTypes.object,
  authType: PropTypes.string,
};

export default Html;
