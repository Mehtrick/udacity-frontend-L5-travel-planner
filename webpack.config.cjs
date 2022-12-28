
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");




module.exports = {
    mode: "development",
    entry: path.resolve(__dirname, "./src/client/index.js"),
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            }
        ]
    },
    resolve: {
        extensions: ["*", ".js"]
    },
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
        clean: true,
    },
    devServer: {
        static: path.resolve(__dirname, "./dist"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
        }),
        new ESLintPlugin()
    ],
};