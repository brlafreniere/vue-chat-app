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
                target: "http://lab.lizardgizzards.com:4001",
                changeOrigin: true,
                pathRewrite: { "^/api": "" }
            }
        }
    },
    publicPath: "/",
}
