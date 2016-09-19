import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom/server';
import serialize from 'serialize-javascript';
import config from '../config';

const { authUrl } = config.login;

const Html = (props) => {
  const { assets, component, store, title } = props;
  const content = component ? ReactDOM.renderToString(component) : '';
  const serverTime = +new Date();

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
        <title>{title}</title>
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
            __html: `
            window.__INITIAL_STATE__=${serialize(store.getState())};
            window.SERVER_TIME=${serverTime};
            window.__AUTH=${serialize({ AUTH_URL: authUrl })};
            `,
          }}
        />
        <script src={assets.javascript.main} charSet="utf-8" />
      </body>
    </html>
  );
};

Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object,
  authType: PropTypes.string,
  title: PropTypes.string,
};

export default Html;
