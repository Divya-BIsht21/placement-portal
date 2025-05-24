const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://your-api-endpoint.com',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    })
  );
};