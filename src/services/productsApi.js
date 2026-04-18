/**
 * ============================================================
 * PRODUCTS API SERVICE (phía client)
 * ============================================================
 * File này đóng vai trò lớp trung gian giữa Vue component
 * và backend API (/api/products).
 *
 * Cơ chế fallback khi chạy local (DEV):
 *   1. Thử gọi /api/products (Vite dev server proxy)
 *   2. Nếu thất bại → gọi thẳng Supabase REST API
 *
 * Khi deploy production: chỉ dùng /api/products (Vercel function).
 * ============================================================
 */

// Đọc cấu hình Supabase từ biến môi trường Vite (file .env).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// Tên bảng products trong Supabase, mặc định là 'products'.
const supabaseProductsTable = import.meta.env.VITE_SUPABASE_PRODUCTS_TABLE || 'products';
// Chỉ cho phép fallback Supabase trực tiếp khi đang chạy local DEV và đã cấu hình env.
const canUseDirectSupabaseFallback = import.meta.env.DEV && Boolean(supabaseUrl && supabaseAnonKey);

// Đọc sản phẩm trực tiếp từ Supabase khi runtime API local không khả dụng.
// Chỉ dùng trong môi trường DEV, không dùng khi deploy production.
async function fetchProductsFromSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Vite Supabase env for direct fallback');
  }

  // Lấy tất cả sản phẩm sắp xếp theo id tăng dần.
  const requestUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(supabaseProductsTable)}?select=*&order=id.asc`;
  const response = await fetch(requestUrl, {
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase fallback failed with status ${response.status}`);
  }

  const payload = await response.json();
  if (!Array.isArray(payload)) {
    throw new Error('Invalid Supabase products payload');
  }

  return {
    items: payload,
    meta: {
      storage: 'supabase-direct'
    }
  };
}

// Tải danh sách sản phẩm qua backend API và fallback sang Supabase trực tiếp khi chạy local.
// Trả về { items: Product[], meta: { storage: string } }
export async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = await response.json();
    if (!Array.isArray(payload.data)) {
      throw new Error('Invalid products payload');
    }

    return {
      items: payload.data,
      meta: payload.meta || { storage: 'api' }
    };
  } catch (error) {
    if (!canUseDirectSupabaseFallback) {
      console.error('Khong the tai san pham tu /api/products.', error);
      return {
        items: [],
        meta: {
          storage: 'api-unavailable',
          error: error.message
        }
      };
    }

    console.warn('Failed to load products from /api/products. Falling back to Supabase direct read.', error);

    try {
      return await fetchProductsFromSupabase();
    } catch (fallbackError) {
      console.error('Failed to load products from Supabase fallback.', fallbackError);
      return {
        items: [],
        meta: {
          storage: 'api-unavailable',
          error: fallbackError.message
        }
      };
    }
  }
}

// Tạo sản phẩm mới thông qua backend API.
// productInput: { name, price, imageUrl, category, adminKey }
// Trả về Product vừa được tạo trong DB.
export async function createProduct(productInput) {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productInput)
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to create product');
  }

  return payload.data;
}

// Xóa sản phẩm thông qua backend API.
// productInput: { id, adminKey }
// Trả về Product vừa bị xoá.
export async function deleteProduct(productInput) {
  const response = await fetch('/api/products', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productInput)
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to delete product');
  }

  return payload.data;
}

// Cập nhật sản phẩm hiện có thông qua backend API.
// productInput: { id, name, price, imageUrl, category, adminKey }
// Trả về Product sau khi đã cập nhật.
export async function updateProduct(productInput) {
  const response = await fetch('/api/products', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productInput)
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || 'Failed to update product');
  }

  return payload.data;
}
