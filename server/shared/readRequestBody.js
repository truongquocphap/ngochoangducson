/**
 * ============================================================
 * TIỆN ÍCH ĐỌC REQUEST BODY
 * ============================================================
 * Node.js HTTP request là stream, không thể đọc trực tiếp.
 * File này cung cấp 2 hàm tiện ích:
 *   - readRequestBody: đọc stream thành chuỗi UTF-8
 *   - readJsonBody: đọc + parse JSON từ request body
 * ============================================================
 */

// Đọc toàn bộ request stream thành chuỗi UTF-8.
// Trả về Promise<string> - resolve khi stream kết thúc.
function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';

    req.setEncoding('utf8');
    // Nối từng chunk dữ liệu vào biến raw
    req.on('data', (chunk) => {
      raw += chunk;
    });
    // Khi stream kết thúc: resolve với toàn bộ nội dung
    req.on('end', () => {
      resolve(raw);
    });
    // Nếu có lỗi stream: reject promise
    req.on('error', reject);
  });
}

// Parse request body thành JSON để dùng trong API handler.
// Trả về {} nếu body rỗng.
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
