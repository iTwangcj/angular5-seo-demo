const fs = require('fs');
const path = require('path');
const webpack = require('./node_modules/webpack/lib/webpack');

const nodeModules = {};
fs.readdirSync('node_modules')
    .filter((x) => !['.bin'].includes(x))
    .forEach((mod) => {
        nodeModules[mod] = 'commonjs ' + mod;
    });

module.exports = {
    entry: {
        // This is our Express server for Dynamic universal
        server: path.join(__dirname, '../backend/.tmp/server.ts')
    },
    resolve: {extensions: ['.ts', '.js']},
    output: {
        // Puts the output at the root of the dist folder
        path: path.join(__dirname, 'dist'),
        filename: '[name].js'
    },
    target: 'node',
    externals: nodeModules,
    context: __dirname,
    node: {
        __filename: false,
        __dirname: false,
        console: false
    },
    module: {
        rules: [
            {test: /\.ts$/, loader: 'ts-loader'}
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            // fixes WARNING Critical dependency: the request of a dependency is an expression
            /(.+)?angular(\\|\/)core(.+)?/,
            path.join(__dirname, 'src'), // location of your src
            {} // a map of your routes
        ),
        new webpack.ContextReplacementPlugin(
            // fixes WARNING Critical dependency: the request of a dependency is an expression
            /(.+)?express(\\|\/)(.+)?/,
            path.join(__dirname, 'src'),
            {}
        ),
        new webpack.optimize.UglifyJsPlugin() // Code compression
    ]
};
