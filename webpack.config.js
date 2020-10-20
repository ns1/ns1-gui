'use strict';
/* globals __dirname, require, process */
var path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var isProd = process.env.NODE_ENV === 'production';
const IconfontPlugin = require('iconfont-plugin-webpack');
const EditFontPlugin = require('./utils/editFontPlugin');
const devPort = 8500; 
console.log('isProd: ', isProd);

const url = (suffix) => {
  return `${suffix}`;
};

let ico = () => {
  return new IconfontPlugin({
      src: `${__dirname}/assets/svg`,
      family: 'iconfont',
      dest: {
        font: `${__dirname}/docs/[family].[type]`,
        css: `${__dirname}/docs/[family].css`
      },
      watch: {
        pattern: `${__dirname}/assets/svg/**/*.svg`,
        cwd: `${__dirname}/assets/svg`
      },
      cssTemplate: function(unicodes) {
        return unicodes.unicodes.map((char)=>{
          return `.icon.${char.name}:before{
            content: '${char.unicode}';
          }`;
        }).concat(`
            @font-face {
            font-family: "icons";
            src: url("${url('eot')}");
            src: url("${url('iconfont.eot?#iefix')}") format("embedded-opentype"),
                 url("${url('iconfont.woff')}") format("woff"),
                 url("${url('iconfont.ttf')}") format("truetype"),
                 url("${url('iconfont.svg#iconfont')}") format("svg");
            font-weight: normal;
            font-style: normal;
          }
          .icon::before{
            vertical-align: middle;
            font-family: "icons"!important;
            display: inline-block;
            font-style: normal;
            font-weight: normal;
            font-variant: normal;
            padding: 0 4px;
            line-height: 1;
            font-size: 18px;
            text-decoration: inherit;
            text-rendering: optimizeLegibility;
            text-transform: none;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            font-smoothing: antialiased;
          }
        `).join('\n');
      }
    });
};
let config = {
  entry: isProd ? './demo.js' : [`webpack-dev-server/client?http://localhost:${devPort}`, './demo.js'],
  devtool: 'cheap-module-source-map',
  context: `${__dirname}/src`,
  watchOptions: {
    ignored: /node_modules/
  },
  resolve: {
    modules: [
      path.resolve('./components'),
      path.resolve('./src'),
      path.resolve('./scss'),
      path.resolve('./node_modules'),
      path.resolve('.')
    ],
    moduleExtensions: ['-compat']
  },
  output: {
    path: `${__dirname}/docs`,
    filename: 'bundle.js',
    library: 'gui'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'postcss-loader', 'sass-loader'],
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'scss'),
          path.resolve(__dirname, 'components')
        ]
      },
      {
        test: /\.css$/i,
        sideEffects: true,
        loaders: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          }
        ],
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'scss'),
          path.resolve(__dirname, 'components')
        ]
      },
      {test: /\.(js|jsx)$/,
        include:[
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'components')
        ],
        exclude: /node_modules(?!\/input-moment|lodash-compat|lodash)|lodash/,
        loader: 'babel-loader',
        query: {
          presets: isProd ? ['react', 'es2015', 'stage-0'] : ['react', 'react-hmre', 'es2015', 'stage-0'],
          plugins: ['transform-decorators-legacy']
        }
      },
      {test: /\.(woff|woff2|eot|ttf)$/, loader: 'file-loader'},
      {
        test: /\.(jpg|png|gif|jpeg)$/,
        loader: 'file-loader',
        include: [path.resolve(__dirname, 'assets')]
      },
    ]
  },
  // env conditional plugins for filesize, dashboard, etc.
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    ico(),
    new EditFontPlugin()
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        warnings: false,
        mangle:{
          keep_classname: true,
          keep_fnames: true,
        },
        // sourceMap: {
        //   url: "inline"
        // },
        compress: {
          keep_fnames: true,
          drop_console: true,
          dead_code: true,
          drop_debugger: true,
        }
      })
    ]
  }
};
if (!isProd){
  config.devServer = {
    contentBase: ['./', './docs'],
    compress: true,
    port: devPort,
    public: `localhost:${devPort}`,
    host: '0.0.0.0'
  };
  config.output.publicPath = `http://localhost:${devPort}/`;
}
module.exports = config;
