const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV } = process.env;

module.exports = {
  mode: NODE_ENV || 'development',
  entry: './src/develop.tsx',
  output: {
    path: resolve(__dirname, './assets/app'),
    filename: '[name]-[hash].bundle.js',
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10
        },
      },
    }
  },
  target: 'web',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    mainFields: ['browser', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: require.resolve('./tsconfig.dev.json'),
          },
        },
        exclude: /node_modules/,
      },
    ]
  },
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : false,
  devServer: {
    port: 8081,
    liveReload: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchFiles: ["src/**/*"],
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: require.resolve('./assets/index.html'),
      publicPath: '/'
    })
  ],
};