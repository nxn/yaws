const path                    = require('path');
const WorkerPlugin            = require('worker-plugin');
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');
const MiniCssExtractPlugin    = require('mini-css-extract-plugin');
const CopyPlugin              = require('copy-webpack-plugin');

const outputPath = path.resolve(__dirname, 'dist');
const workers = /src[\/\\]components[\/\\]web-workers[\/\\].*\.tsx?$/i;

module.exports = {
  entry: {
    yaws: './src/app.ts'
  },
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  devServer: {
    contentBase: outputPath,
    hot: true
  },
  module: {
    rules: [{ // Main app/root TypeScript loader instance
      test: /\.tsx?$/,
      /* Code within the /src/components/workers directory should be compiled using a separate ts-loader instance so 
      that the compiler uses the correct tsconfig.json file*/
      exclude: [workers, /node_modules/],
      loader: 'ts-loader',
      options: {
        instance: "root",
        configFile: path.resolve(__dirname, 'tsconfig.json')
      }
    },{ // Web Worker TypeScript loader instance
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
      ],
    },{
      test: /\.html$/i,
      use: [
        'html-loader'
      ],
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
    extensions: [ '.tsx', '.ts', '.js' ],
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
    new CleanWebpackPlugin(),
    new CopyPlugin({ patterns: [{ from: 'CNAME', to: outputPath }] }),
    new WorkerPlugin({ globalObject: 'self' }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css", 
      chunkFilename: "[id].[contenthash].css"
    }),
    new HtmlWebpackPlugin({ template: 'src/components/page/index.html' })
  ]
};