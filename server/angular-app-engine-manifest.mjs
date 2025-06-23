
export default {
  basePath: 'https://davidchiriac.github.io/Personal-Website',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
