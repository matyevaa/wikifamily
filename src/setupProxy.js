const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = (app) => {
    app.use(
        createProxyMiddleware('/api1/*', {
            target: 'http://localhost:5000/',
            secure: false,
            changeOrigin: true,
        }),
    );

    app.use(
        createProxyMiddleware('/api2/*', {
            target: 'http://localhost:3000/',
            secure: false,
            changeOrigin: true,
        }),
    );
};
