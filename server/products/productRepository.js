const fs = require('fs');
const path = require('path');
const { requestJson } = require('../shared/requestJson');

const CATALOG_KEY = 'products:catalog';
const DEFAULT_SUPABASE_TABLE = 'products';
const HARDCODED_SUPABASE_URL = 'https://ykissyxxmgenjtfajcsb.supabase.co';
const HARDCODED_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXNzeXh4bWdlbmp0ZmFqY3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDMxNjEsImV4cCI6MjA5MTkxOTE2MX0.AkvUDyaWP4riyLQtmUjSQSAdGTJI8g2UfrHuVL4VgQA';
const HARDCODED_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlraXNzeXh4bWdlbmp0ZmFqY3NiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjM0MzE2MSwiZXhwIjoyMDkxOTE5MTYxfQ.tPWf0dMtMJYbkdUU_nr5slGExlJSxceQYooGvAe__EI';
const HARDCODED_PRODUCTS_TABLE = 'products';

// Nạp dữ liệu seed local chỉ khi chưa có nguồn dữ liệu từ server.
function loadSeedProducts() {
  const candidates = [
    path.join(__dirname, '../../data/products.json'),
    path.join(__dirname, '../../data/products1.json')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return JSON.parse(fs.readFileSync(candidate, 'utf8'));
    }
  }

  return [];
}

// Chọn Supabase key phía server để gọi request trong repository.
function getSupabaseServerKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY
    || HARDCODED_SUPABASE_SERVICE_ROLE_KEY
    || process.env.SUPABASE_ANON_KEY
    || HARDCODED_SUPABASE_ANON_KEY;
}

// Kiểm tra runtime hiện tại đã cấu hình storage Supabase hay chưa.
function hasSupabaseConfig() {
  return Boolean((process.env.SUPABASE_URL || HARDCODED_SUPABASE_URL) && getSupabaseServerKey());
}

// Lấy tên bảng products từ biến môi trường.
function getSupabaseTableName() {
  return process.env.SUPABASE_PRODUCTS_TABLE || HARDCODED_PRODUCTS_TABLE || DEFAULT_SUPABASE_TABLE;
}

// Đọc toàn bộ danh sách sản phẩm từ Supabase REST.
async function readProductsFromSupabase() {
  const baseUrl = (process.env.SUPABASE_URL || HARDCODED_SUPABASE_URL).replace(/\/$/, '');
  const tableName = getSupabaseTableName();
  const authKey = getSupabaseServerKey();
  const requestUrl = `${baseUrl}/rest/v1/${encodeURIComponent(tableName)}?select=*&order=id.asc`;

  const response = await requestJson(requestUrl, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY || HARDCODED_SUPABASE_ANON_KEY || authKey,
      Authorization: `Bearer ${authKey}`
    }
  });

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`Supabase request failed with status ${response.statusCode}: ${response.body}`);
  }

  const payload = response.json;
  return Array.isArray(payload) ? payload : [];
}

// Kiểm tra xem fallback KV cũ có đang được cấu hình hay không.
function hasKvConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// Đọc danh sách sản phẩm từ KV fallback store.
async function readCatalogFromKv() {
  const response = await requestJson(`${process.env.KV_REST_API_URL}/get/${encodeURIComponent(CATALOG_KEY)}`, {
    headers: {
      Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`
    }
  });

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`KV request failed with status ${response.statusCode}`);
  }

  const payload = response.json;
  if (!payload.result) {
    return [];
  }

  const parsed = JSON.parse(payload.result);
  return Array.isArray(parsed) ? parsed : [];
}

// Tạo lớp persistence để đọc và ghi dữ liệu sản phẩm.
function createProductRepository() {
  return {
    // Ưu tiên đọc sản phẩm từ Supabase, sau đó đến KV rồi mới fallback sang seed local.
    async listProducts() {
      if (hasSupabaseConfig()) {
        try {
          const items = await readProductsFromSupabase();
          return {
            items,
            storage: 'supabase'
          };
        } catch (error) {
          console.error('Khong the doc du lieu tu Supabase, se fallback sang nguon khac.', error);
        }
      }

      if (hasKvConfig()) {
        try {
          const items = await readCatalogFromKv();
          if (items.length > 0) {
            return {
              items,
              storage: 'kv'
            };
          }
        } catch (error) {
          console.error('Khong the doc du lieu tu KV fallback.', error);
        }
      }

      return {
        items: loadSeedProducts(),
        storage: 'seed'
      };
    },

    // Thêm một dòng sản phẩm mới vào Supabase.
    async createProduct(product) {
      if (!hasSupabaseConfig()) {
        throw new Error('Supabase storage is not configured');
      }

      const baseUrl = (process.env.SUPABASE_URL || HARDCODED_SUPABASE_URL).replace(/\/$/, '');
      const tableName = getSupabaseTableName();
      const authKey = getSupabaseServerKey();
      const requestUrl = `${baseUrl}/rest/v1/${encodeURIComponent(tableName)}`;
      const response = await requestJson(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_ANON_KEY || HARDCODED_SUPABASE_ANON_KEY || authKey,
          Authorization: `Bearer ${authKey}`,
          Prefer: 'return=representation'
        },
        body: JSON.stringify(product)
      });

      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw new Error(`Supabase insert failed with status ${response.statusCode}: ${response.body}`);
      }

      const payload = response.json;
      if (Array.isArray(payload)) {
        return payload[0] || null;
      }

      return payload;
    },

    // Xóa một dòng sản phẩm trong Supabase theo id.
    async deleteProduct(productId) {
      if (!hasSupabaseConfig()) {
        throw new Error('Supabase storage is not configured');
      }

      const baseUrl = (process.env.SUPABASE_URL || HARDCODED_SUPABASE_URL).replace(/\/$/, '');
      const tableName = getSupabaseTableName();
      const authKey = getSupabaseServerKey();
      const requestUrl = `${baseUrl}/rest/v1/${encodeURIComponent(tableName)}?id=eq.${encodeURIComponent(String(productId))}`;
      const response = await requestJson(requestUrl, {
        method: 'DELETE',
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY || HARDCODED_SUPABASE_ANON_KEY || authKey,
          Authorization: `Bearer ${authKey}`,
          Prefer: 'return=representation'
        }
      });

      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw new Error(`Supabase delete failed with status ${response.statusCode}: ${response.body}`);
      }

      const payload = response.json;
      if (Array.isArray(payload)) {
        return payload[0] || null;
      }

      return payload || null;
    },

    // Cập nhật một dòng sản phẩm trong Supabase theo id.
    async updateProduct(productId, productUpdate) {
      if (!hasSupabaseConfig()) {
        throw new Error('Supabase storage is not configured');
      }

      const baseUrl = (process.env.SUPABASE_URL || HARDCODED_SUPABASE_URL).replace(/\/$/, '');
      const tableName = getSupabaseTableName();
      const authKey = getSupabaseServerKey();
      const requestUrl = `${baseUrl}/rest/v1/${encodeURIComponent(tableName)}?id=eq.${encodeURIComponent(String(productId))}`;
      const response = await requestJson(requestUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_ANON_KEY || HARDCODED_SUPABASE_ANON_KEY || authKey,
          Authorization: `Bearer ${authKey}`,
          Prefer: 'return=representation'
        },
        body: JSON.stringify(productUpdate)
      });

      if (response.statusCode < 200 || response.statusCode >= 300) {
        throw new Error(`Supabase update failed with status ${response.statusCode}: ${response.body}`);
      }

      const payload = response.json;
      if (Array.isArray(payload)) {
        return payload[0] || null;
      }

      return payload || null;
    }
  };
}

module.exports = {
  createProductRepository
};
