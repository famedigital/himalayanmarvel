// Script to create Cloudinary folders for hero and blog
const cloudinary = require('cloudinary').v2;

// Configuration from environment
cloudinary.config({
  cloud_name: 'dlv3qqv3f',
  api_key: '978162971325389',
  api_secret: 'ecrooli1Y54iQysSfqaP0I7Jz8o',
  secure: true
});

async function createFolders() {
  try {
    console.log('Testing Cloudinary connection...');
    const testResult = await cloudinary.api.ping();
    console.log('✓ Cloudinary connection successful!\n');

    console.log('Creating Cloudinary folders...');

    // Create hero folder
    try {
      const heroResult = await cloudinary.api.create_folder('himalayanmarvel/hero');
      console.log('✓ Hero folder created:', heroResult.path);
    } catch (heroError) {
      if (heroError.message && heroError.message.includes('already exists')) {
        console.log('✓ Hero folder already exists: himalayanmarvel/hero');
      } else {
        throw heroError;
      }
    }

    // Create blog folder
    try {
      const blogResult = await cloudinary.api.create_folder('himalayanmarvel/blog');
      console.log('✓ Blog folder created:', blogResult.path);
    } catch (blogError) {
      if (blogError.message && blogError.message.includes('already exists')) {
        console.log('✓ Blog folder already exists: himalayanmarvel/blog');
      } else {
        throw blogError;
      }
    }

    console.log('\n✅ All folders ready!');
    console.log('Folder structure:');
    console.log('  - himalayanmarvel/hero');
    console.log('  - himalayanmarvel/blog');
    console.log('\nYou can now upload images to these folders.');

  } catch (error) {
    console.error('❌ Error:', error.message || error);
    if (error.http_code) {
      console.error('HTTP Status:', error.http_code);
    }
    process.exit(1);
  }
}

createFolders().catch(console.error);