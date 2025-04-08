
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/calculator10085/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/calculator10085"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 627, hash: '9d682c2f227b5a958d0ff60701ba01c9e1a80b445e757c5c33779471337edab9', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1140, hash: '9716a2c7929eb58d20471e5173a9b0d0389087c0243c4ab7a9873c57e1dcf1f7', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 8901, hash: 'c960f4b824a5db7c1ea9355b1cef9a6f7bb8476ff8542371b09d2399bdc3ea5a', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
