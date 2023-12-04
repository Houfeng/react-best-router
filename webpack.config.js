const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV } = process.env;
const publicPath = NODE_ENV === 'development' ? '/' : './';

module.exports = {
  mode: NODE_ENV || 'development',
  entry: './develop/index.tsx',
  output: {
    path: resolve(__dirname, './docs'),
    filename: '[name]-[hash].bundle.js',
    publicPath: publicPath,
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
            configFile: NODE_ENV === 'development'
              ? require.resolve('./tsconfig.dev.json')
              : require.resolve('./tsconfig.json'),
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
      {
        resourceQuery: /raw/,
        type: 'asset/source'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ]
  },
  devtool: NODE_ENV === 'development' ? 'inline-source-map' : false,
  devServer: {
    port: 8081,
    liveReload: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    watchFiles: ["src/**/*", "develop/**/*"],
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: require.resolve('./assets/index.html'),
      publicPath: publicPath,
    })
  ],
};