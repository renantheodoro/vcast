const basePath = process.env.VUE_APP_MODE

module.exports = {
  publicPath: "",
  outputDir: "../www",
  assetsDir: undefined,
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "materialize-css/sass/materialize.scss";
          @import "@/assets/scss/${basePath}/main.scss";
        `
      }
    }
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'vCast';
        args[0].meta = {
          viewport: 'width=device-width, height=device-height,initial-scale=1,user-scalable=no,viewport-fit=cover'
        };

        return args;
      })
  }
};