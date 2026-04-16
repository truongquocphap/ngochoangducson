const http = require('http');
const https = require('https');

// Thực hiện HTTP request thô và trả về response dưới dạng text.
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
