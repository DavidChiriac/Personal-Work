
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://davidchiriac.github.io/Personal-Website/',
  locale: undefined,
  routes: undefined,
  entryPointToBrowserMapping: {
  "node_modules/@angular/animations/fesm2022/browser.mjs": [
    {
      "path": "chunk-BZV4GJBB.js",
      "dynamicImport": false
    }
  ]
},
  assets: {
    'index.csr.html': {size: 856, hash: 'c6948869db374472353dcaa06e3bf62eac8f3d43e88f64f9640ecc9d9227bf68', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1219, hash: '3d957537168e47864a15d490e0f947a2687361b63172a6d4884da1b3c37f507a', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-HKT7SJK5.css': {size: 347145, hash: 'EQzFn0gRBlU', text: () => import('./assets-chunks/styles-HKT7SJK5_css.mjs').then(m => m.default)}
  },
};
