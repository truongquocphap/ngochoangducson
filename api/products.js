const { createProductsService } = require('../server/products/productService');
const { readJsonBody } = require('../server/shared/readRequestBody');

/**
 * ============================================================
 * API HANDLER: /api/products
 * ============================================================
 * Đây là serverless function được deploy trên Vercel.
 * Xử lý 4 loại HTTP method:
 *   GET    → Lấy danh sách sản phẩm (có thể lọc theo search / category)
 *   POST   → Tạo mới một sản phẩm
 *   DELETE → Xoá một sản phẩm theo id
 *   PATCH  → Cập nhật thông tin một sản phẩm
 * Mọi request đều đi qua productsService để validate trước khi ghi DB.
 * ============================================================
 */

// Khởi tạo service một lần dùng chung cho toàn bộ các request.
const productsService = createProductsService();

// Xử lý các request CRUD sản phẩm cho serverless route khi deploy.
module.exports = async (req, res) => {
  // Đảm bảo response luôn là JSON với encoding UTF-8 (hỗ trợ tiếng Việt).
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    // ===== GET: Lấy danh sách sản phẩm =====
    // Query params: ?search=từkhoá&category=do_uong
    if (req.method === 'GET') {
      const search = typeof req.query?.search === 'string' ? req.query.search : '';
      const category = typeof req.query?.category === 'string' ? req.query.category : '';
      const result = await productsService.listProducts({ search, category });

      res.statusCode = 200;
      // Trả về { data: [...], meta: { storage, total, search, category } }
      res.end(JSON.stringify({ data: result.items, meta: result.meta }));
      return;
    }

    // ===== POST: Tạo sản phẩm mới =====
    // Body JSON: { name, price, imageUrl, category, adminKey }
    if (req.method === 'POST') {
      const body = await readJsonBody(req);
      const result = await productsService.createProduct(body);

      // 201 Created khi tạo thành công
      res.statusCode = 201;
      res.end(JSON.stringify({ data: result.item, meta: result.meta }));
      return;
    }

    // ===== DELETE: Xoá sản phẩm theo id =====
    // Body JSON: { id, adminKey }
    if (req.method === 'DELETE') {
      const body = await readJsonBody(req);
      const result = await productsService.deleteProduct(body);

      res.statusCode = 200;
      res.end(JSON.stringify({ data: result.item, meta: result.meta }));
      return;
    }

    // ===== PATCH: Cập nhật sản phẩm theo id =====
    // Body JSON: { id, name, price, imageUrl, category, adminKey }
    if (req.method === 'PATCH') {
      const body = await readJsonBody(req);
      const result = await productsService.updateProduct(body);

      res.statusCode = 200;
      res.end(JSON.stringify({ data: result.item, meta: result.meta }));
      return;
    }

    // ===== Method không được hỗ trợ =====
    res.statusCode = 405;
    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
  } catch (error) {
    console.error('Products API failed', error);
    // Lỗi validation (tên rỗng, giá âm, sai admin key...) → 400 Bad Request
    // Lỗi Supabase hoặc lỗi server nội bộ → 500 Internal Server Error
    const isValidationError = !String(error.message || '').includes('Supabase');
    res.statusCode = isValidationError ? 400 : 500;
    res.end(JSON.stringify({ error: error.message || 'Products API failed' }));
  }
};
