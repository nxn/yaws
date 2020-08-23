const path                    = require('path');
const WorkerPlugin            = require('worker-plugin');
const HtmlWebpackPlugin       = require('html-webpack-plugin');
const { CleanWebpackPlugin }  = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app.ts'
  },
  mode: 'development',
  target: 'web',
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  },
  module: {
    rules: [{ // Main app/root TypeScript loader instance
      test: /\.tsx?$/,
      /* Code within the /src/components/workers directory should be compiled using a separate ts-loader instance so 
      that the compiler uses the correct tsconfig.json file*/
      exclude: [/src\/components\/web-workers\/.*\.tsx?$/, /node_modules/],
      loader: 'ts-loader',
      options: {
        instance: "root",
        configFile: path.resolve(__dirname, 'tsconfig.json')
      }
    },{ // Web Worker TypeScript loader instance
      test: /src\/components\/web-workers\/.*\.tsx?$/,
      loader: 'ts-loader',
      options: {
        instance: "workers",
        configFile: path.resolve(__dirname, 'src/components/web-workers/tsconfig.json')
      }
    },{ // Sourse map loader
      enforce: "pre",
      test: /\.js$/,
      loader: "source-map-loader"
    },{ // CSS/Stylesheet loader
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ],
    },{ // Image loader (file)
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader'
      ]
    },{ // Font loader(file)
      test: /\.(woff|woff2|eot|ttf|otf)$/,
      use: [
        'file-loader'
      ]
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
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WorkerPlugin({ globalObject: 'self' }),
    new HtmlWebpackPlugin({ template: 'src/components/page/index.html' })
  ]
};