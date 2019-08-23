const merge = require('webpack-merge');
const base = require('./webpack.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(base, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist/',
        compress: true,
        inline: true,
        headers: {
            'Cache-Control': 'no-cache,no-store'
        },
        // lazy:false
    },
    plugins: [
        new MiniCssExtractPlugin({                   //分离css
            filename: 'css/[name].[hash:8].css',
            chunkFilename: 'css/[name].[hash:8].css'
       })
    ]
})