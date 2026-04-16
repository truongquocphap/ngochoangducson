const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseProductsTable = import.meta.env.VITE_SUPABASE_PRODUCTS_TABLE || 'products';

async function fetchProductsFromSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Vite Supabase env for direct fallback');
  }

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
