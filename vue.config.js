module.exports = {
  publicPath: process.env.NODE_ENV == 'production'
    ? '/hyperchef/'
    : '/',
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import "./node_modules/bootstrap/scss/_functions.scss";
          @import "@/styles/_variables.scss";
        `
      }
    }
  }
}
