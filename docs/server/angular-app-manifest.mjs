
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
    'index.csr.html': {size: 821, hash: 'db261a54a54fc2329abe1a6a220d17217c90813537e2a12340738140176651c4', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1140, hash: '1576042991f6214c1aa64e7e246cabfe7d26ac0d7fcd655e341f0c346dd6b3ac', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 9096, hash: '11181560f8943b1c1bb0469313c6c84f17573842724b9799ce1ddab1ac7d9f93', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-F7QSTRZ2.css': {size: 69, hash: 'xHy/R+P1TiM', text: () => import('./assets-chunks/styles-F7QSTRZ2_css.mjs').then(m => m.default)}
  },
};
