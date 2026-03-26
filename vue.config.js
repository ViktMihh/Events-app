module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/events-platform/' : '',
  transpileDependencies: true,
  devServer: {
    allowedHosts: ['.develop'],
    client: {
      overlay: {
        warnings: true,
        errors: true,
      },
    },
    port: process.env.PORT,
  },
};
