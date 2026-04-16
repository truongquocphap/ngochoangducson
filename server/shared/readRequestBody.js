// Đọc toàn bộ request stream thành chuỗi UTF-8.
function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.setEncoding('utf8');
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      resolve(raw);
    });
    req.on('error', reject);
  });
}

// Parse request body thành JSON để dùng trong API handler.
async function readJsonBody(req) {
  const raw = await readRequestBody(req);
  if (!raw) {
    return {};
  }

  return JSON.parse(raw);
}

module.exports = {
  readRequestBody,
  readJsonBody
};
