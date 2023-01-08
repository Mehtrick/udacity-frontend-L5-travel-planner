const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");


module.exports = {
    mode: "development",
    stats: "errors-warnings",
    entry: path.resolve(__dirname, "./src/client/index.js"),
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: ["babel-loader"]
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            },
        ]
    },
    resolve: {
        extensions: ["*", ".js"]
    },
    output: {
        libraryTarget: "var",
        library: "Client",
        path: path.resolve(__dirname, "./dist"),
        filename: "bundle.js",
        clean: true,
    },
    devServer: {
        static: path.resolve(__dirname, "./dist"),
        watchFiles: ["src/client/views/**"]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html",
            favicon: "./src/client/views/favicon.ico"
        }),
        new ESLintPlugin(),
    ],
};