const { createProductsService } = require('../server/products/productService');
const { readJsonBody } = require('../server/shared/readRequestBody');

const productsService = createProductsService();

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    if (req.method === 'GET') {
      const search = typeof req.query?.search === 'string' ? req.query.search : '';
      const category = typeof req.query?.category === 'string' ? req.query.category : '';
      const result = await productsService.listProducts({ search, category });

      res.statusCode = 200;
      res.end(JSON.stringify({ data: result.items, meta: result.meta }));
      return;
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const result = await productsService.createProduct(body);

      res.statusCode = 201;
      res.end(JSON.stringify({ data: result.item, meta: result.meta }));
      return;
    }

    if (req.method === 'DELETE') {
      const body = await readJsonBody(req);
      const result = await productsService.deleteProduct(body);

      res.statusCode = 200;
      res.end(JSON.stringify({ data: result.item, meta: result.meta }));
      return;
    }

    if (req.method === 'PATCH') {
      const body = await readJsonBody(req);
      const result = await productsService.updateProduct(body);

      res.statusCode = 200;
      res.end(JSON.stringify({ data: result.item, meta: result.meta }));
      return;
    }

    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  } catch (error) {
    console.error('Products API failed', error);
    const isValidationError = !String(error.message || '').includes('Supabase');
    res.statusCode = isValidationError ? 400 : 500;
    res.end(JSON.stringify({ error: error.message || 'Products API failed' }));
  }
};
