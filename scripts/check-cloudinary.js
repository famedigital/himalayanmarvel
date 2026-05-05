// Cloudinary credentials diagnostic tool
const https = require('https');

const credentials = {
  cloud_name: 'dxztrqjft',
  api_key: '978162971325389',
  api_secret: 'ecrooli1Y54iQysSfqaP0I7Jz8o'
};

function checkCredentials() {
  console.log('Cloudinary Credentials Check');
  console.log('============================');
  console.log('Cloud Name:', credentials.cloud_name);
  console.log('API Key:', credentials.api_key);
  console.log('API Secret:', credentials.api_secret.substring(0, 10) + '...');
  console.log();

  // The issue is likely that the cloud_name doesn't match the API key/secret
  console.log('Possible issues:');
  console.log('1. Cloud name might be incorrect for these API credentials');
  console.log('2. API key or secret might be from a different Cloudinary account');
  console.log('3. Credentials might need to be regenerated in Cloudinary dashboard');
  console.log();

  console.log('To find your correct cloud name:');
  console.log('1. Go to https://cloudinary.com/console');
  console.log('2. Look at the URL - it will show your cloud name');
  console.log('3. Or check Settings > Account > Cloud name');
  console.log();

  console.log('The cloud name should match what you see in your Cloudinary dashboard URL:');
  console.log('https://cloudinary.com/console/<YOUR_CLOUD_NAME>');
}

checkCredentials();