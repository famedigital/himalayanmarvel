// Script to update Cloudinary URLs from old to new account
// Usage: node scripts/update-cloudinary-urls.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const OLD_CLOUD_NAME = 'dxztrqjft';
const NEW_CLOUD_NAME = 'dlv3qqv3f';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local');
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in .env.local');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('✅ Environment variables loaded successfully');

function updateCloudinaryUrl(url) {
  if (!url || typeof url !== 'string') return url;
  if (!url.includes(OLD_CLOUD_NAME)) return url;

  console.log('  Updating:', url.substring(0, 50) + '...');
  return url.replace(OLD_CLOUD_NAME, NEW_CLOUD_NAME);
}

async function updateBlogs() {
  console.log('\n📝 Updating blogs...');

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('id, title, featured_image, gallery_images');

  if (error) {
    console.error('❌ Error fetching blogs:', error);
    return;
  }

  console.log(`Found ${blogs.length} blogs`);

  for (const blog of blogs) {
    const updates = {};

    if (blog.featured_image && blog.featured_image.includes(OLD_CLOUD_NAME)) {
      updates.featured_image = updateCloudinaryUrl(blog.featured_image);
    }

    if (blog.gallery_images && Array.isArray(blog.gallery_images)) {
      const updatedImages = blog.gallery_images.map(img => updateCloudinaryUrl(img));
      if (updatedImages.some(img => img !== blog.gallery_images[blog.gallery_images.indexOf(img)])) {
        updates.gallery_images = updatedImages;
      }
    }

    if (Object.keys(updates).length > 0) {
      console.log(`\nUpdating blog: ${blog.title}`);
      const { error: updateError } = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', blog.id);

      if (updateError) {
        console.error('❌ Error updating blog:', updateError);
      } else {
        console.log('✅ Blog updated successfully');
      }
    }
  }
}

async function updateTours() {
  console.log('\n🏔️ Updating tours...');

  const { data: tours, error } = await supabase
    .from('tours')
    .select('id, title, hero_image, gallery_images');

  if (error) {
    console.error('❌ Error fetching tours:', error);
    return;
  }

  console.log(`Found ${tours.length} tours`);

  for (const tour of tours) {
    const updates = {};

    if (tour.hero_image && tour.hero_image.includes(OLD_CLOUD_NAME)) {
      updates.hero_image = updateCloudinaryUrl(tour.hero_image);
    }

    if (tour.gallery_images && Array.isArray(tour.gallery_images)) {
      const updatedImages = tour.gallery_images.map(img => updateCloudinaryUrl(img));
      if (updatedImages.some(img => img !== tour.gallery_images[tour.gallery_images.indexOf(img)])) {
        updates.gallery_images = updatedImages;
      }
    }

    if (Object.keys(updates).length > 0) {
      console.log(`\nUpdating tour: ${tour.title}`);
      const { error: updateError } = await supabase
        .from('tours')
        .update(updates)
        .eq('id', tour.id);

      if (updateError) {
        console.error('❌ Error updating tour:', updateError);
      } else {
        console.log('✅ Tour updated successfully');
      }
    }
  }
}

async function updateItineraries() {
  console.log('\n📋 Updating itineraries...');

  const { data: itineraries, error } = await supabase
    .from('itineraries')
    .select('id, title, cover_image, logo');

  if (error) {
    console.error('❌ Error fetching itineraries:', error);
    return;
  }

  console.log(`Found ${itineraries.length} itineraries`);

  for (const itinerary of itineraries) {
    const updates = {};

    if (itinerary.cover_image && itinerary.cover_image.includes(OLD_CLOUD_NAME)) {
      updates.cover_image = updateCloudinaryUrl(itinerary.cover_image);
    }

    if (itinerary.logo && itinerary.logo.includes(OLD_CLOUD_NAME)) {
      updates.logo = updateCloudinaryUrl(itinerary.logo);
    }

    if (Object.keys(updates).length > 0) {
      console.log(`\nUpdating itinerary: ${itinerary.title}`);
      const { error: updateError } = await supabase
        .from('itineraries')
        .update(updates)
        .eq('id', itinerary.id);

      if (updateError) {
        console.error('❌ Error updating itinerary:', updateError);
      } else {
        console.log('✅ Itinerary updated successfully');
      }
    }
  }
}

async function updateSettings() {
  console.log('\n⚙️ Updating settings...');

  const { data: settings, error } = await supabase
    .from('settings')
    .select('*');

  if (error) {
    console.error('❌ Error fetching settings:', error);
    return;
  }

  console.log(`Found ${settings.length} settings`);

  for (const setting of settings) {
    if (setting.value && typeof setting.value === 'object') {
      let needsUpdate = false;

      // Check for logo_url
      if (setting.value.logo_url && setting.value.logo_url.includes(OLD_CLOUD_NAME)) {
        setting.value.logo_url = updateCloudinaryUrl(setting.value.logo_url);
        needsUpdate = true;
      }

      // Check for other image URLs in settings value
      const jsonString = JSON.stringify(setting.value);
      if (jsonString.includes(OLD_CLOUD_NAME)) {
        const updatedJson = jsonString.replace(OLD_CLOUD_NAME, NEW_CLOUD_NAME);
        setting.value = JSON.parse(updatedJson);
        needsUpdate = true;
      }

      if (needsUpdate) {
        console.log(`\nUpdating setting: ${setting.key}`);
        const { error: updateError } = await supabase
          .from('settings')
          .update({ value: setting.value })
          .eq('key', setting.key);

        if (updateError) {
          console.error('❌ Error updating setting:', updateError);
        } else {
          console.log('✅ Setting updated successfully');
        }
      }
    }
  }
}

async function main() {
  console.log('🔄 Cloudinary URL Migration Script');
  console.log('====================================');
  console.log(`Old cloud name: ${OLD_CLOUD_NAME}`);
  console.log(`New cloud name: ${NEW_CLOUD_NAME}`);
  console.log('\n⚠️  This will update all Cloudinary URLs in your database.');
  console.log('Make sure you have migrated all images to the new account first!\n');

  // Wait for user confirmation
  await new Promise(resolve => {
    process.stdout.write('Press Enter to continue or Ctrl+C to cancel... ');
    process.stdin.once('data', resolve);
  });

  try {
    await updateBlogs();
    await updateTours();
    await updateItineraries();
    await updateSettings();

    console.log('\n✅ Migration completed successfully!');
    console.log('\n⚠️  IMPORTANT: If you still see broken images, you need to:');
    console.log('1. Re-upload the images to the new Cloudinary account');
    console.log('2. Or manually update the URLs in the database');
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

main();