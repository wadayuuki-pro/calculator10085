
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
    'index.csr.html': {size: 821, hash: '0540e720c69c0fd9a4aacd76973f999daa136ead737ecf66af44b4b454ff8323', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1140, hash: '3332c0ea9689bf6781b99d5c6a91637b60f5bef3658de4285605605bc2c07f8b', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 9096, hash: '8bfb4b9615de1fbfad9d932c2b63afe94bbd3776abb4cda181b845a38b16160d', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'styles-YJ2TCUSV.css': {size: 69, hash: 'zBSl+igycaI', text: () => import('./assets-chunks/styles-YJ2TCUSV_css.mjs').then(m => m.default)}
  },
};
