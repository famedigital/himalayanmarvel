// Add default hero slides to settings table
// Run with: node scripts/add-hero-slides.js

const SUPABASE_URL = 'https://zjskswendtlgxpkfavko.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqc2tzd2VuZHRsZ3hwa2ZhdmtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjI3NzI0NSwiZXhwIjoyMDkxODUzMjQ1fQ.I5Yu_U0NiRBKvNopR5MW29X45tR9W_hmXJjaiOKEQLU';

const heroSlidesData = [
  {
    id: 'default-hero-1',
    type: 'video',
    url: 'https://res.cloudinary.com/dxztrqjft/video/upload/v1776271223/tashichodzong_ddin28.mp4',
    thumbnail: '',
    title: 'Himalayan Marvels',
    subtitle: 'Experience sacred landscapes, living traditions, and moments of stillness.',
    description: 'Bhutan is not a destination. It\'s a shift in perspective.',
    link: '/contact',
    experienceLabel: 'Experience',
    ctaText: 'Begin a conversation',
    keywords: ['Sacred Landscapes', 'Living Traditions', 'Moments of Stillness', 'Deeper Clarity', 'A Shift in Perspective'],
    isPrimary: true
  }
];

async function addHeroSlides() {
  try {
    // Check if hero_slides already exists
    const checkResponse = await fetch(`${SUPABASE_URL}/rest/v1/settings?key=eq.hero_slides`, {
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
        'Content-Type': 'application/json'
      }
    });

    const existingData = await checkResponse.json();

    if (existingData && existingData.length > 0) {
      console.log('hero_slides already exists. Updating...');

      // Update existing
      const updateResponse = await fetch(`${SUPABASE_URL}/rest/v1/settings?key=eq.hero_slides`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: heroSlidesData,
          updated_at: new Date().toISOString()
        })
      });

      if (updateResponse.ok) {
        console.log('✓ Hero slides updated successfully!');
      } else {
        const error = await updateResponse.text();
        console.error('Failed to update:', error);
      }
    } else {
      console.log('Creating new hero_slides entry...');

      // Insert new
      const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
          'apikey': SERVICE_ROLE_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: 'hero_slides',
          value: heroSlidesData,
          description: 'Homepage hero slider images and videos'
        })
      });

      if (insertResponse.ok) {
        console.log('✓ Hero slides created successfully!');
      } else {
        const error = await insertResponse.text();
        console.error('Failed to create:', error);
      }
    }

    console.log('\nDefault hero slide data:');
    console.log(JSON.stringify(heroSlidesData, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  }
}

addHeroSlides();
