console.log(process.env.VUE_APP_API_URL);

module.exports = {
    devServer: {
        disableHostCheck: true,
        port: 4000,
        public: '0.0.0.0:4000',
        overlay: {
            warnings: true,
            errors: true
        },
        proxy: {
            "^/api": {
                target: process.env.VUE_APP_API_URL,
                changeOrigin: true,
                pathRewrite: { "^/api": "" }
            }
        }
    },
    publicPath: "/",
}
