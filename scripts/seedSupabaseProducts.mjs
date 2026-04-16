import seedProducts from '../data/products.json' with { type: 'json' };

const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const tableName = process.env.SUPABASE_PRODUCTS_TABLE || 'products';

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL');
}

if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

const requestUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(tableName)}`;

const response = await fetch(requestUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: anonKey || serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    Prefer: 'resolution=merge-duplicates,return=representation'
  },
  body: JSON.stringify(seedProducts)
});

if (!response.ok) {
  const details = await response.text();
  throw new Error(`Failed to seed products: ${response.status} ${details}`);
}

const payload = await response.json();
console.log(`Seeded ${payload.length} products into ${tableName}`);
