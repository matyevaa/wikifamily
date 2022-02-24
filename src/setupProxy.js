const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/api1/*', {
            target: 'http://localhost:5000/',
            secure: false,
            changeOrigin: true,
        }),
    );
    app.use('/api2', createProxyMiddleware({
        target: 'http://localhost:3000/',
        changeOrigin: true,
        pathRewrite: {
            [`^/api2`]: '',
        },
    }));
};
