const crypto = require('crypto');
const https = require('https');

const cloudName = 'dxztrqjft';
const apiKey = '847911927811565';
const apiSecret = 'c3SPmMM7yQ5gbMleKwmAUwHHofQ';

const folder = 'himalayanmarvel';
const maxResults = 10;
const timestamp = Math.floor(Date.now() / 1000);

const paramsToSign = [
  `prefix=${folder}`,
  `max_results=${maxResults}`,
  `timestamp=${timestamp}`
];
paramsToSign.sort();
const stringToSign = paramsToSign.join('&');
const signature = crypto.createHash('sha1').update(stringToSign + apiSecret).digest('hex');

const queryParams = new URLSearchParams({
  api_key: apiKey,
  prefix: folder,
  max_results: maxResults.toString(),
  timestamp: timestamp.toString(),
  signature: signature,
});

const url = `/v1_1/${cloudName}/resources/image?${queryParams.toString()}`;

console.log('Testing Cloudinary API...');
console.log('Endpoint:', `api.cloudinary.com${url}`);

const options = {
  hostname: 'api.cloudinary.com',
  path: url,
  method: 'GET',
};

const req = https.request(options, (res) => {
  console.log('Response status:', res.statusCode);
  console.log('Status message:', res.statusMessage);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (res.statusCode === 200) {
        console.log('✓ Success! Found', result.total_count, 'total images');
        console.log('✓ Retrieved', result.resources?.length || 0, 'images in this batch');
        if (result.resources && result.resources.length > 0) {
          console.log('\nSample images:');
          result.resources.slice(0, 3).forEach((img, i) => {
            console.log(`  ${i + 1}. ${img.public_id}`);
          });
        }
      } else {
        console.error('✗ API Error:', result.error?.message || data);
      }
    } catch (e) {
      console.error('Parse error:', e.message);
      console.log('Raw response:', data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.end();
