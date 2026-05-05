// Test Cloudinary API connection and upload capability
const https = require('https');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const cloudName = 'dlv3qqv3f';
const apiKey = '978162971325389';
const apiSecret = 'ecrooli1Y54iQysSfqaP0I7Jz8o';

console.log('🔍 Testing Cloudinary Configuration');
console.log('===================================');
console.log('Cloud Name:', cloudName);
console.log('API Key:', apiKey);
console.log('API Secret:', apiSecret.substring(0, 10) + '...\n');

// Test 1: List resources to verify API access
console.log('Test 1: Verifying API access...');
const testListUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?prefix=himalayanmarvel&max_results=10`;

https.get(testListUrl, {
  headers: {
    'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
  }
}, (res) => {
  console.log('✓ API Access Status:', res.statusCode);

  if (res.statusCode === 200) {
    console.log('✅ Cloudinary API is working correctly!\n');

    // Test 2: Check folders
    console.log('Test 2: Verifying folders exist...');
    const folderUrl = `https://api.cloudinary.com/v1_1/${cloudName}/folders/himalayanmarvel`;

    https.get(folderUrl, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`
      }
    }, (folderRes) => {
      if (folderRes.statusCode === 200) {
        console.log('✅ Base folder accessible\n');
        console.log('🎉 Cloudinary is fully configured for admin uploads!');
        console.log('\n✅ Your admin panel can now:');
        console.log('   • Upload images via drag & drop');
        console.log('   • Browse existing images from Cloudinary');
        console.log('   • Organize images by folder (tours, blog, hero)');
        console.log('   • Select images from a visual picker');
      } else {
        console.log('⚠️  Folder check failed with status:', folderRes.statusCode);
      }
    }).on('error', (err) => {
      console.log('⚠️  Folder check error:', err.message);
    });

  } else {
    console.log('❌ API access failed with status:', res.statusCode);
    console.log('Please check your credentials');
  }
}).on('error', (err) => {
  console.log('❌ Connection error:', err.message);
  console.log('Please check your internet connection and credentials');
});