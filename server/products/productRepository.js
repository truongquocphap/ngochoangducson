const fs = require('fs');
const path = require('path');
const { requestJson } = require('../shared/requestJson');

const CATALOG_KEY = 'products:catalog';
const DEFAULT_SUPABASE_TABLE = 'products';

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

function getSupabaseServerKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
}

function hasSupabaseConfig() {
  return Boolean(process.env.SUPABASE_URL && getSupabaseServerKey());
}

function getSupabaseTableName() {
  return process.env.SUPABASE_PRODUCTS_TABLE || DEFAULT_SUPABASE_TABLE;
}

async function readProductsFromSupabase() {
  const baseUrl = process.env.SUPABASE_URL.replace(/\/$/, '');
  const tableName = getSupabaseTableName();
  const authKey = getSupabaseServerKey();
  const requestUrl = `${baseUrl}/rest/v1/${encodeURIComponent(tableName)}?select=*&order=id.asc`;

  const response = await requestJson(requestUrl, {
    headers: {
      apikey: process.env.SUPABASE_ANON_KEY || authKey,
      Authorization: `Bearer ${authKey}`
    }
  });

  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new Error(`Supabase request failed with status ${response.statusCode}: ${response.body}`);
  }

  const payload = response.json;
  return Array.isArray(payload) ? payload : [];
}

function hasKvConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

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

function createProductRepository() {
  return {
    async listProducts() {
      if (hasSupabaseConfig()) {
        const items = await readProductsFromSupabase();
        if (items.length > 0) {
          return {
            items,
            storage: 'supabase'
          };
        }
      }

      if (hasKvConfig()) {
        const items = await readCatalogFromKv();
        if (items.length > 0) {
          return {
            items,
            storage: 'kv'
          };
        }
      }

      return {
        items: loadSeedProducts(),
        storage: 'seed'
      };
    },

    async createProduct(product) {
      if (!hasSupabaseConfig()) {
        throw new Error('Supabase storage is not configured');
      }

      const baseUrl = process.env.SUPABASE_URL.replace(/\/$/, '');
      const tableName = getSupabaseTableName();
      const authKey = getSupabaseServerKey();
      const requestUrl = `${baseUrl}/rest/v1/${encodeURIComponent(tableName)}`;
      const response = await requestJson(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_ANON_KEY || authKey,
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

    async deleteProduct(productId) {
      if (!hasSupabaseConfig()) {
        throw new Error('Supabase storage is not configured');
      }

      const baseUrl = process.env.SUPABASE_URL.replace(/\/$/, '');
      const tableName = getSupabaseTableName();
      const authKey = getSupabaseServerKey();
      const requestUrl = `${baseUrl}/rest/v1/${encodeURIComponent(tableName)}?id=eq.${encodeURIComponent(String(productId))}`;
      const response = await requestJson(requestUrl, {
        method: 'DELETE',
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY || authKey,
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

    async updateProduct(productId, productUpdate) {
      if (!hasSupabaseConfig()) {
        throw new Error('Supabase storage is not configured');
      }

      const baseUrl = process.env.SUPABASE_URL.replace(/\/$/, '');
      const tableName = getSupabaseTableName();
      const authKey = getSupabaseServerKey();
      const requestUrl = `${baseUrl}/rest/v1/${encodeURIComponent(tableName)}?id=eq.${encodeURIComponent(String(productId))}`;
      const response = await requestJson(requestUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.SUPABASE_ANON_KEY || authKey,
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
