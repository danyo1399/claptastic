const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const devMode = process.env.NODE_ENV !== "production";
const fs = require("fs");
//const buildNo = Math.ceil(Date.now() / 1000 - 1614980000);
const version = `1.0.37`;
module.exports = {
  entry: {
    main: { import: "./src/main.js", filename: "[name].[hash].js" },
    "service-worker": {
      import: "./src/service-worker.js",
      filename: "service-worker.js",
    },
    tailwind: { import: "./src/tailwind.js", filename: "[name].[hash].js" },
  },
  devtool: "inline-source-map",
  target: "web",
  devServer: {
    serveIndex: true,
    contentBase: "./dist",
    publicPath: "/claptastic/",
    compress: true,
    historyApiFallback: true,
    watchContentBase: true,
    // hot: true,
    // injectHot: true,
    // inline: true,
    https: {
      key: fs.readFileSync("./keys/localhost-key.pem"),
      cert: fs.readFileSync("./keys/localhost.pem"),
    },
  },
  output: {
    path: path.resolve(__dirname, "dist/claptastic"),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|mp3)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, "src"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, "src"),
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      WEBPACK_VERSION: JSON.stringify(version),
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? "[name].css" : "[name].[contenthash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[contenthash].css",
    }),
    new CleanWebpackPlugin(),
    // new CopyPlugin({
    //   patterns: [
    //     { from: "./src/icons", to: "icons" },
    //     { from: "./src/media", to: "media" },
    //   ],
    // }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      excludeChunks: ["service-worker"],
      favicon: "./src/icons/hand-icon-192.png",
      environment: { WEBPACK_VERSION: version },
    }),
    new WebpackPwaManifest({
      name: "Claptastic",
      short_name: "Claptastic",
      description:
        "You ever tried clapping while holding your phone? Well now you can",
      background_color: "#323030",
      theme_color: "#323030",
      crossorigin: "anonymous", //can be null, use-credentials or anonymous
      display: "fullscreen",
      orientation: "portrait",
      publicPath: "/claptastic/",
      start_url: "index.html",
      icons: [
        {
          src: path.resolve("src/icons/icon.png"),
          sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
        },
        {
          src: path.resolve("src/icons/icon.png"),
          size: "1024x1024", // you can also use the specifications pattern
        },
        {
          src: path.resolve("src/icons/maskable-icon.png"),
          size: [96, 128, 192, 256, 384, 512, 1024],
          purpose: "maskable",
        },
      ],
    }),
  ],
};
