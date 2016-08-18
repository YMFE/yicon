# isom-fetch

[![Build Status](https://travis-ci.org/malcolmyu/isom-fetch.svg?branch=master)](https://travis-ci.org/malcolmyu/isom-fetch)

A isomorphic fetch for SSR and Koa.

## Use in server

```js
import isomFetch from 'isom-fetch';
import router from '../router';

app.use(router);

app.use(function* (next) {
  const location = this.originalUrl;
  match({ routes, location }, (
    error, redirectLocation, renderProps
  ) => {
    const fetch = isomFetch.use(this, router);
    // begin SSR
    if (renderProps) {
      render();
      fetch.all(() => {
        // SSR actually
        render();
      });
    }
  });
});
```

## Use in client

```js
import fetch from 'isom-fetch';

const fetch = fetch.create({
  baseURL: '/api',
  headers: {}
});

fetch.get(`/user/${id}`);
fetch.post(`/user`, id);
```
