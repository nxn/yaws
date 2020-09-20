const path                    = require('path');
const webpack                 = require('webpack');
const WorkerPlugin            = require('worker-plugin');
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const CopyPlugin              = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin            = require('terser-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');
const workers = /src[\/\\]components[\/\\]web-workers[\/\\].*\.tsx?$/i;

module.exports = {
  entry: {
    yaws: './src/app.ts'
  },
  mode: 'production',
  target: 'web',
  module: {
    rules: [{ // Main JS/TS loader via babel -> tsc
      test: /\.(js|jsx|tsx|ts)$/,
      loaders: 'babel-loader',
      exclude: [workers, /node_modules/]
    },{ // Web Worker TypeScript loader instance (requires separate tsconfig)
      test: workers,
      loader: 'ts-loader',
      options: {
        instance: "workers",
        configFile: path.resolve(__dirname, 'src/components/web-workers/tsconfig.json')
      }
    },{ // Sourse maps
      enforce: "pre",
      test: /\.js$/i,
      loader: "source-map-loader"
    },{ // CSS/Stylesheets
      test: /\.css$/i,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader'
      ]
    },{ // EJS/HTML (ejs-loader)
      test: /\.ejs$/i,
      use: [ 
        { loader: 'ejs-loader', options: { variable: 'data' } },
        'extract-loader',
        'html-loader'
      ]
    },{ // Images (file-loader)
      test: /\.(png|svg|jpg|gif)$/i,
      loader: 'file-loader',
      options: { outputPath: 'assets/images' }
    },{ // Fonts (file-loader)
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      loader: 'file-loader',
      options: { outputPath: 'assets/fonts' }
    }]
  },
  resolve: {
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@lib'       : path.resolve(__dirname, 'src/lib/'),
      '@utilities' : path.resolve(__dirname, 'src/components/utilities')
    }
  },
  output: {
    filename: '[name].[hash:20].js',
    path: outputPath
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({ 
      patterns: [
        { from: 'CNAME', to: outputPath },
        //{ from: 'manifest.json', to: outputPath }
      ]}),
    new WorkerPlugin({ globalObject: 'self' }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css", 
      chunkFilename: "[id].[contenthash].css"
    }),
    new HtmlWebpackPlugin({ template: 'src/components/page/index.ejs' })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCssAssetsPlugin({})
    ]
  }
};