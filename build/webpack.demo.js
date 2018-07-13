const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const md = require('markdown-it')();
const slugify = require('transliteration').slugify;

const striptags = require('./strip-tags');
const config = require('./config');

const isProd = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const isPlay = !!process.env.PLAY_ENV;

/**
 * 将unicode码转为汉子
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function convert(str) {
  str = str.replace(/(&#x)(\w{4})/gi, function($0) {
    return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16));
  });
  return str;
}

/**
 * 添加高亮样式
 * @param  {[type]} render [description]
 * @return {[type]}        [description]
 */
function wrap(render) {
  return function() {
    return render.apply(this, arguments)
      .replace('<code v-pre class="', '<code class="hljs ')
      .replace('<code>', '<code class="hljs">');
  };
}

const webpackConfig = {
  // 根据不同的环境变量，生成不同的入口文件
  // 生产模式入口 =>  docs: './examples/entry.js', 'element-ui': './src/index.js'
  // Play模式入口 => './example/play.js'
  // 开发模式入口 => './example/entry.js'
  entry: isProd ? {
    docs: './examples/entry.js',
    'element-ui': './src/index.js'
  } : (isPlay ? './example/play.js' : './example/entry.js'),
  output: {
    path: path.resolve(process.cwd(), './example/element-ui/'),
    publicPath: process.env.CI_ENV || '',
    filename: '[name].[hash:7].js',
    // 如果不是生产模式就不用hash了
    chunkFilename: isProd ? '[name].[hash:7].js' : '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: config.alias,
    modules: ['node_modules']
  },
  devServer: {
    host: '0.0.0.0',
    port: 8085,
    publicPath: '/',
    noInfo: true
  },
  module: {
    // pitching顺序post, inline, normal, pre
    // transform顺序pre, normal, inline, post
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules|bower_components/,
        loader: 'eslint-loader'
      },
      {
        enforce: 'pre',
        test: /\.vue$/,
        exclude: /node_modules|bower_components/,
        loader: 'eslint-loader'
      },
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: config.jsexclude,
        loader: 'babel-loader'
      },
      {
        test: /.md$/,
        loader: 'vue-markdown-loader',
        options: {
          use: [
            [require('markdown-it-anchor'), {
              level: 2,
              slugify: slugify, // 默认将汉字转为unicode,空格转为-
              permalink: true, // 在标题旁永久添加链接
              permalinkBefore: true // 在标题前添加链接
            }],
            [require('markdown-it-container'), 'demo', {
              validate: function(params) {
                return params.trim().match(/^demo\s*(.*)$/);
              },
              render: function(tokens idx) {
                var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
                if (tokens[idx].nesting === 1) {
                  var description = (m && m.length > 1) ? m[1] : '';
                  var html = convert()
                }
              }
            }],
            [require('markdown-it-container'), 'tip'],
            [require('markdown-it-container'), 'warning']
          ]
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        loader: 'html-loader?minimize=false'
      },
      {
        test: /\.otf|ttf|woff2?|eot(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/index.tpl',
      filename: './index.html',
      favicon: './example/favicon.ico'
    }),
    new CopyWebpackPlugin([
      { from: 'examples/version.json'}
    ]),
    new ProgressBarPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      vue: {
        preserveWhitespace: false
      }
    })
  ]
};

if (isProd) {
  webpackConfig.externals = {
    vue: 'Vue',
    'vue-router': 'VueRouter'
  };
  webpackConfig.module.rules.push(
    {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {
        extractCSS: true,
        preserveWhitespace: false
      }
    },
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader'
        ]
      })
    }
  );
  webpackConfig.plugins.push(
    new webpack.optmize.UglifyJsPlugin({
      compress: {
        wraning: false
      },
      output: {
        comments: false
      },
      sourceMap: false
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:7].css'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['element-ui', 'manifest']
    })
  );
}

if (isDev) {
  webpackConfig.module.rules.push(
    {
      test: /.vue$/,
      loader: 'vue-loader',
      options: {
        preserveWhitespace: false
      }
    },
    {
      test: /\.css$/,
      loader: ['style-loader', 'css-loader', 'postcss-loader']
    }
  );
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  );
}

module.exports = webpackConfig;