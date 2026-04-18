/**
 * ============================================================
 * TIỆN ÍCH GỌI HTTP REQUEST
 * ============================================================
 * Node.js không có built-in fetch như trình duyệt.
 * File này wrap Node.js http/https module thành 2 hàm tiện ích:
 *   - requestText: gọi HTTP và trả về response dạng text
 *   - requestJson: gọi HTTP và parse response thành JSON
 * Dùng chủ yếu để gọi Supabase REST API từ phía server.
 * ============================================================
 */
const http = require('http');
const https = require('https');

// Thực hiện HTTP request thô và trả về response dưới dạng text.
// Tự động chọn http hoặc https dựa vào protocol của URL.
// Trả về { statusCode, headers, body: string }
function requestText(url, { method = 'GET', headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const target = new URL(url);
    const client = target.protocol === 'https:' ? https : http;

    const request = client.request(
      target,
      {
        method,
        headers
      },
      (response) => {
        let data = '';

        response.setEncoding('utf8');
        response.on('data', (chunk) => {
          data += chunk;
        });
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode || 0,
            headers: response.headers,
            body: data
          });
        });
      }
    );

    request.on('error', reject);

    if (body) {
      request.write(body);
    }

    request.end();
  });
}

// Thực hiện HTTP request và parse response body thành JSON.
// Trả về { statusCode, headers, body: string, json: object|null }
// json = null nếu response body không phải JSON hợp lệ.
async function requestJson(url, options) {
  const response = await requestText(url, options);
  let json = null;

  if (response.body) {
    try {
      json = JSON.parse(response.body);
    } catch (error) {
      json = null;
    }
  }

  return {
    ...response,
    json
  };
}

module.exports = {
  requestJson,
  requestText
};
