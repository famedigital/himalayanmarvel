// Script to create Cloudinary folders for tours and categories
const cloudinary = require('cloudinary').v2;

// Configuration from environment
cloudinary.config({
  cloud_name: 'dlv3qqv3f',
  api_key: '978162971325389',
  api_secret: 'ecrooli1Y54iQysSfqaP0I7Jz8o',
  secure: true
});

// Tour categories based on the system
const TOUR_CATEGORIES = [
  'cultural',      // Cultural Journey
  'honeymoon',     // Honeymoon
  'adventure',     // Adventure Trek
  'spiritual',     // Spiritual & Wellness
  'custom'         // Custom Experience
];

async function createTourFolders() {
  try {
    console.log('Testing Cloudinary connection...');
    const testResult = await cloudinary.api.ping();
    console.log('✓ Cloudinary connection successful!\n');

    console.log('Creating tour folders structure...\n');

    // Create main tours folder
    try {
      const toursResult = await cloudinary.api.create_folder('himalayanmarvel/tours');
      console.log('✓ Main tours folder created:', toursResult.path);
    } catch (toursError) {
      if (toursError.message && toursError.message.includes('already exists')) {
        console.log('✓ Main tours folder already exists: himalayanmarvel/tours');
      } else {
        throw toursError;
      }
    }

    // Create category subfolders
    console.log('\nCreating category subfolders:');
    for (const category of TOUR_CATEGORIES) {
      const folderPath = `himalayanmarvel/tours/${category}`;
      try {
        const result = await cloudinary.api.create_folder(folderPath);
        console.log(`  ✓ ${category}: ${result.path}`);
      } catch (error) {
        if (error.message && error.message.includes('already exists')) {
          console.log(`  ✓ ${category}: already exists`);
        } else {
          console.log(`  ⚠️  ${category}: Error - ${error.message}`);
        }
      }
    }

    console.log('\n✅ All tour folders ready!');
    console.log('\nFolder structure:');
    console.log('  himalayanmarvel/tours/');
    console.log('    ├── cultural/      (Cultural Journey)');
    console.log('    ├── honeymoon/     (Honeymoon)');
    console.log('    ├── adventure/     (Adventure Trek)');
    console.log('    ├── spiritual/     (Spiritual & Wellness)');
    console.log('    └── custom/        (Custom Experience)');
    console.log('\nYou can now upload tour images to these category folders.');

  } catch (error) {
    console.error('❌ Error:', error.message || error);
    if (error.http_code) {
      console.error('HTTP Status:', error.http_code);
    }
    process.exit(1);
  }
}

createTourFolders().catch(console.error);