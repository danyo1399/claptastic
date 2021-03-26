'use strict'
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const versionInfo = require('./package.json')

const publicPath = process.env.PUBLIC_PATH || '/claptastic/'
const baseConfig = require('./src/environment/environment.json')
const envConfig = process.env.CONFIG
    ? require(`./src/environment/environment.${process.env.CONFIG}.json`)
    : {}
const tempConfig = { ...baseConfig, ...envConfig }
const combinedConfig = {}
const keys = Object.keys(tempConfig)
for (let key of keys) {
    combinedConfig['process.env.' + key] = JSON.stringify(tempConfig[key])
}
const devMode = process.env.NODE_ENV !== 'production'

console.log('combined config', combinedConfig)

// const version = `${versionInfo.version}-${buildNo}`
const version = `${versionInfo.version}`
module.exports = {
    entry: {
        main: { import: './src/main.tsx', filename: '[name].[hash].js' },

        tailwind: { import: './src/tailwind.js', filename: '[name].[hash].js' },
    },
    devtool: 'source-map',
    target: 'web',

    output: {
        path: path.resolve(__dirname, 'dist/claptastic'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
            {
                test: /\.(png|jpe?g|gif|mp3)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            // {
            //   test: /\.js$/i,
            //   include: path.resolve(__dirname, "src"),
            //   exclude: /node_modules/,
            //   use: {
            //     loader: "babel-loader",
            //     options: {
            //       presets: ["@babel/preset-env", "@babel/preset-react"],
            //     },
            //   },
            // },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                include: path.resolve(__dirname, 'src'),
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                ],
            },
        ],
    },

    plugins: [
        new WorkboxPlugin.InjectManifest({
            swSrc: './src/service-worker.js',
            maximumFileSizeToCacheInBytes: 1024 * 1024 * 6,
        }),

        new webpack.DefinePlugin({
            'process.env.VERSION': JSON.stringify(version),
            ...combinedConfig,
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[contenthash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[contenthash].css',
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
                { from: './src/screenshots', to: 'screenshots' },
                // { from: "./src/media", to: "media" },
            ],
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            excludeChunks: ['service-worker'],
            favicon: './src/icons/hand-icon-192.png',
        }),
        new WebpackPwaManifest({
            name: 'Claptastic',
            short_name: 'Claptastic',
            description:
                'You ever tried clapping while holding your phone? Well now you can',
            background_color: '#323030',
            theme_color: '#323030',
            crossorigin: 'anonymous', //can be null, use-credentials or anonymous
            display: 'fullscreen',
            orientation: 'portrait',
            publicPath,
            start_url: 'index.html?src=manifest',
            prefer_related_applications: false,

            icons: [
                {
                    src: path.resolve('src/icons/icon.png'),
                    sizes: [96, 128, 192, 256, 384, 512], // multiple sizes
                },
                {
                    src: path.resolve('src/icons/icon.png'),
                    size: '1024x1024', // you can also use the specifications pattern
                },
                {
                    src: path.resolve('src/icons/maskable-icon.png'),
                    size: [96, 128, 192, 256, 384, 512, 1024],
                    purpose: 'maskable',
                },
            ],
        }),
    ],
}
