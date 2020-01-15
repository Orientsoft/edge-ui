const path = require('path');

module.exports = {
  entry: 'src/index.jsx',
  publicPath: './',
  plugins: [
    ['ice-plugin-fusion', {
      themePackage: '@icedesign/theme',
    }],
    ['ice-plugin-moment-locales', {
      locales: ['zh-cn'],
    }],
  ],
  alias: {
    '@': path.resolve(__dirname, './src/'),
  },
  devServer: {
    historyApiFallback: true,
  },
   define: {
    // 此处不能省略 JSON.stringify，否则构建过程会出现语法问题
    BACKEND_URL: JSON.stringify(process.env.BACKEND_URL || 'http://192.168.0.186:31783'),
  },
};
