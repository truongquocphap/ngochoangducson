const { defineConfig, loadEnv } = require('vite');
const vue = require('@vitejs/plugin-vue');
const { createProductsService } = require('./server/products/productService');
const { readJsonBody } = require('./server/shared/readRequestBody');

// Gắn products API vào Vite dev server để local dev chạy giống backend runtime.
function localProductsApiPlugin() {
  return {
    name: 'local-products-api',
    apply: 'serve',
    configureServer(server) {
      const productsService = createProductsService();

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/products')) {
          next();
          return;
        }

        if (req.method !== 'GET') {
          if (req.method !== 'POST' && req.method !== 'DELETE' && req.method !== 'PATCH') {
            res.statusCode = 405;
            res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ error: 'Method Not Allowed' }));
            return;
          }
        }

        try {
          if (req.method === 'GET') {
            const requestUrl = new URL(req.url, 'http://localhost');
            const search = requestUrl.searchParams.get('search') || '';
            const category = requestUrl.searchParams.get('category') || '';
            const result = await productsService.listProducts({ search, category });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify({ data: result.items, meta: result.meta }));
            return;
          }

          const body = await readJsonBody(req);
          const result = req.method === 'POST'
            ? await productsService.createProduct(body)
            : req.method === 'DELETE'
              ? await productsService.deleteProduct(body)
              : await productsService.updateProduct(body);
          res.statusCode = req.method === 'POST' ? 201 : 200;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ data: result.item, meta: result.meta }));
        } catch (error) {
          console.error('Local /api/products failed', error);
          const isValidationError = !String(error.message || '').includes('Supabase');
          res.statusCode = isValidationError ? 400 : 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ error: error.message || 'Products API failed' }));
        }
      });
    }
  };
}

// Nạp biến môi trường vào local Node process và đăng ký plugin Vue cùng local API.
module.exports = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [vue(), localProductsApiPlugin()],
    define: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
    }
  };
});
