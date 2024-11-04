const TerserPlugin = require('terser-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            // Development configuration
            if (env === 'development') {
                return {
                    ...webpackConfig,
                    mode: 'development',
                    devtool: 'source-map',
                    devServer: {
                        hot: true,
                        port: 3000,
                        historyApiFallback: true,
                    }
                };
            }

            // Production configuration
            return {
                ...webpackConfig,
                optimization: {
                    ...webpackConfig.optimization,
                    minimizer: [
                        new TerserPlugin({
                            terserOptions: {
                                compress: {
                                    drop_console: true,
                                },
                            },
                        }),
                    ],
                },
                plugins: [
                    ...webpackConfig.plugins,
                    new WebpackObfuscator({
                        rotateStringArray: true,
                        stringArray: true,
                        stringArrayEncoding: ['base64'],
                    }, [])
                ],
            };
        },
    },
};