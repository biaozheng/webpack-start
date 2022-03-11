const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const config = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "bundle.js",
  },
  experiments: {
    asyncWebAssembly: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /(\.scss|\.sass)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      // V4 的写法
      // {
      //   test: /\.(jpe?g|png|gif|svg)$/i,
      //   use: [
      //     {
      //       loader: "url-loader",
      //       options: {
      //         limit: 10000,
      //         name: "[name].[ext]",
      //         outputPath: "imgs/",
      //       },
      //     },
      //   ],
      // },
      // v5 内置静态资源构建能力
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'image/[name][ext]',
        }
      },
      {
        test: /\.js$/,
        use: "babel-loader",
      },
      {
        test: /\.wasm$/,
        type: 'webassembly/async'
      },
      // V4 处理webworker需要借助worker-loader来处理
      // {
      //   test: /\.worker\.js$/,
      //   use: {loader: 'worker-loader'}
      // }
      // v5 中不需要添加loader的处理方式，并且不需要针对worker配置特定的.worker.js之类的文件
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "template.html",
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, "assets"),
          to: "assets",
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  devServer: {
    hot: true,
  },
  // V5 内置File System Cache能力加速二次构建
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],    // 当构建依赖的config文件内容发生改变时，缓存失效
    },
    name: 'pc'  // 配置以name为隔离，创建不同的缓存文件，可以生成不同终端的配置文件
  }
};

module.exports = config;
