const { createProductRepository } = require('./productRepository');

const VALID_CATEGORIES = new Set([
  'ban_chay',
  'do_uong',
  'mi_goi',
  'banh_keo',
  'gia_vi',
  'do_gia_dung'
]);
const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80';
const DEFAULT_ADMIN_KEY = '123456';
const HARDCODED_ADMIN_KEY = '123456';

// Chuẩn hóa tiếng Việt để tìm kiếm không bị ảnh hưởng bởi dấu.
function normalizeText(value = '') {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim()
    .replace(/\s+/g, ' ');
}

// Lấy admin key từ biến môi trường hoặc dùng giá trị mặc định local.
function getAdminKey() {
  return process.env.ADMIN_KEY || HARDCODED_ADMIN_KEY || DEFAULT_ADMIN_KEY;
}

// Tạo lớp business logic để validate dữ liệu sản phẩm trước khi lưu.
function createProductsService({ repository = createProductRepository() } = {}) {
  return {
    // Trả về danh sách sản phẩm sau khi áp dụng lọc theo danh mục và từ khóa.
    async listProducts({ search = '', category = '' } = {}) {
      const result = await repository.listProducts();
      const normalizedSearch = normalizeText(search);
      const normalizedCategory = typeof category === 'string' ? category.trim() : '';

      let items = result.items;

      if (normalizedCategory) {
        if (!VALID_CATEGORIES.has(normalizedCategory)) {
          return {
            items: [],
            meta: {
              storage: result.storage,
              total: 0,
              search: normalizedSearch,
              category: normalizedCategory
            }
          };
        }

        items = items.filter((item) => item.category === normalizedCategory);
      }

      if (normalizedSearch) {
        items = items.filter((item) => normalizeText(item.name).includes(normalizedSearch));
      }

      return {
        items,
        meta: {
          storage: result.storage,
          total: items.length,
          search: normalizedSearch,
          category: normalizedCategory || 'all'
        }
      };
    },

    // Validate và tạo mới một bản ghi sản phẩm.
    async createProduct(input = {}) {
      const name = typeof input.name === 'string' ? input.name.trim() : '';
      const price = Number(input.price);
      const category = typeof input.category === 'string' ? input.category.trim() : '';
      const imageUrl = typeof input.imageUrl === 'string' ? input.imageUrl.trim() : '';
      const adminKey = typeof input.adminKey === 'string' ? input.adminKey : '';

      if (!name) {
        throw new Error('Tên sản phẩm không được để trống.');
      }

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error('Giá sản phẩm phải lớn hơn 0.');
      }

      if (!VALID_CATEGORIES.has(category)) {
        throw new Error('Danh mục sản phẩm không hợp lệ.');
      }

      if (adminKey !== getAdminKey()) {
        throw new Error('Admin key không đúng. Vui lòng thử lại.');
      }

      const createdProduct = await repository.createProduct({
        id: Date.now(),
        name,
        price,
        imageUrl: imageUrl || DEFAULT_PRODUCT_IMAGE,
        category,
        createdAt: new Date().toISOString()
      });

      return {
        item: createdProduct,
        meta: {
          storage: 'supabase'
        }
      };
    },

    // Validate request xóa trước khi xóa sản phẩm.
    async deleteProduct(input = {}) {
      const productId = input.id;
      const adminKey = typeof input.adminKey === 'string' ? input.adminKey : '';

      if (productId === undefined || productId === null || String(productId).trim() === '') {
        throw new Error('Không tìm thấy sản phẩm để xóa.');
      }

      if (adminKey !== getAdminKey()) {
        throw new Error('Admin key không đúng. Vui lòng thử lại.');
      }

      const deletedProduct = await repository.deleteProduct(productId);
      if (!deletedProduct) {
        throw new Error('Không tìm thấy sản phẩm để xóa.');
      }

      return {
        item: deletedProduct,
        meta: {
          storage: 'supabase'
        }
      };
    },

    // Validate và cập nhật một bản ghi sản phẩm hiện có.
    async updateProduct(input = {}) {
      const productId = input.id;
      const name = typeof input.name === 'string' ? input.name.trim() : '';
      const price = Number(input.price);
      const category = typeof input.category === 'string' ? input.category.trim() : '';
      const imageUrl = typeof input.imageUrl === 'string' ? input.imageUrl.trim() : '';
      const adminKey = typeof input.adminKey === 'string' ? input.adminKey : '';

      if (productId === undefined || productId === null || String(productId).trim() === '') {
        throw new Error('Không tìm thấy sản phẩm để chỉnh sửa.');
      }

      if (!name) {
        throw new Error('Tên sản phẩm không được để trống.');
      }

      if (!Number.isFinite(price) || price <= 0) {
        throw new Error('Giá sản phẩm phải lớn hơn 0.');
      }

      if (!VALID_CATEGORIES.has(category)) {
        throw new Error('Danh mục sản phẩm không hợp lệ.');
      }

      if (adminKey !== getAdminKey()) {
        throw new Error('Admin key không đúng. Vui lòng thử lại.');
      }

      const updatedProduct = await repository.updateProduct(productId, {
        name,
        price,
        imageUrl: imageUrl || DEFAULT_PRODUCT_IMAGE,
        category
      });

      if (!updatedProduct) {
        throw new Error('Không tìm thấy sản phẩm để chỉnh sửa.');
      }

      return {
        item: updatedProduct,
        meta: {
          storage: 'supabase'
        }
      };
    }
  };
}

module.exports = {
  createProductsService
};
