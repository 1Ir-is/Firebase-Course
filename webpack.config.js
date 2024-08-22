const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    watch: true,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)  // Add this line
        })
    ]
}
