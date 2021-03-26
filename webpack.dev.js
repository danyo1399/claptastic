'use strict'
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const httpOnly = !!process.env.HTTP_ONLY
const fs = require('fs')
module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',

    devServer: {
        serveIndex: true,
        contentBase: './dist',
        publicPath,
        compress: true,
        historyApiFallback: true,
        watchContentBase: true,
        // hot: true,
        // injectHot: true,
        // inline: true,
        https: httpOnly
            ? undefined
            : {
                  key: fs.readFileSync('./keys/localhost-key.pem'),
                  cert: fs.readFileSync('./keys/localhost.pem'),
              },
    },
})
