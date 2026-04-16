const supabaseUrl = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const tableName = process.env.SUPABASE_PRODUCTS_TABLE || 'products';

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL');
}

const authKey = serviceRoleKey || anonKey;
if (!authKey) {
  throw new Error('Missing Supabase API key');
}

const requestUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${encodeURIComponent(tableName)}?select=*&order=id.asc`;
const response = await fetch(requestUrl, {
  headers: {
    apikey: anonKey || authKey,
    Authorization: `Bearer ${authKey}`
  }
});

if (!response.ok) {
  const details = await response.text();
  throw new Error(`Failed to read products: ${response.status} ${details}`);
}

const payload = await response.json();
console.log(JSON.stringify({ total: payload.length, first: payload[0]?.name || null }, null, 2));
