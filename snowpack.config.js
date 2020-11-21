/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-react-refresh',
    '@snowpack/plugin-sass',
    [
      "@snowpack/plugin-babel",
      {
        "input": ['.js', '.jsx']
      }
    ],
    [
      '@snowpack/plugin-webpack',
      {
        externals: {
          moment: 'moment'
        }
      },
    ]
  ],
  proxy: {
    '/api-v1': 'http://localhost:4000/api-v1'
  },
  devOptions: {
    port: 3000,
    open: "safari"
  }
};
