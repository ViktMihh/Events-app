module.exports = {
  publicPath: '/Events-app/',
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
