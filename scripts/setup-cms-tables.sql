-- ============================================
-- Himalayan Marvels - Frontend CMS Schema
-- Phase 4: Content Management System
-- ============================================
-- This schema enables editing of all public website content
-- from the admin panel while keeping layouts and animations fixed.
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. CMS PAGES TABLE
-- ============================================
-- Registry of all editable pages on the website
-- This table defines which pages can be edited via the CMS
-- ============================================
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT UNIQUE NOT NULL, -- URL path (e.g., '/', '/tours', '/about')
  page_name TEXT NOT NULL, -- Display name for admin UI
  is_editable BOOLEAN DEFAULT true, -- Can this page be edited?
  icon TEXT, -- Icon name for admin UI (lucide-react icons)
  order_index INTEGER DEFAULT 0, -- Display order in admin panel
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 2. CMS CONTENT TABLE
-- ============================================
-- Stores all editable content for every component on every page
-- Supports text, media URLs, colors, drafts, and versioning
-- ============================================
CREATE TABLE IF NOT EXISTS cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL, -- References cms_pages.page_path
  component_id TEXT NOT NULL, -- Component name (e.g., 'hero', 'navigation', 'footer')
  content_key TEXT NOT NULL, -- Specific content piece (e.g., 'title', 'subtitle', 'description')

  -- Content storage
  content_value TEXT, -- Text content (headlines, paragraphs, CTAs)
  media_url TEXT, -- Cloudinary URLs for images/videos
  color_value TEXT, -- Hex colors for theme customization

  -- Ordering for lists and slides
  order_index INTEGER DEFAULT 0, -- General ordering
  slide_order INTEGER DEFAULT 0, -- For hero slider/carousel items
  is_primary BOOLEAN DEFAULT false, -- Mark primary slides/items

  -- Version control
  is_draft BOOLEAN DEFAULT false, -- Is this a draft version?
  published_version INTEGER DEFAULT 1, -- Current published version
  draft_version JSONB, -- Draft content before publishing

  -- Metadata
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id), -- Last editor

  -- Ensure unique content keys per component per page
  UNIQUE(page_path, component_id, content_key)
);

-- ============================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================
-- Speed up common queries for the CMS
-- ============================================

-- Index for fetching all content for a page
CREATE INDEX IF NOT EXISTS idx_cms_content_page ON cms_content(page_path);

-- Index for fetching specific component content
CREATE INDEX IF NOT EXISTS idx_cms_content_component ON cms_content(page_path, component_id);

-- Index for fetching published content (exclude drafts)
CREATE INDEX IF NOT EXISTS idx_cms_content_published ON cms_content(page_path, is_draft);

-- Index for draft content queries
CREATE INDEX IF NOT EXISTS idx_cms_content_drafts ON cms_content(is_draft, updated_at DESC);

-- Index for hero slider ordering
CREATE INDEX IF NOT EXISTS idx_cms_content_slides ON cms_content(page_path, component_id, slide_order);

-- Index for page ordering in admin
CREATE INDEX IF NOT EXISTS idx_cms_pages_order ON cms_pages(order_index);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable role-based access control for CMS operations
-- ============================================

-- Enable RLS on both tables
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CMS PAGES RLS POLICIES
-- ============================================

-- Admins can do everything
CREATE POLICY "admins_full_access_cms_pages"
  ON cms_pages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Everyone can read page registry (needed for public site)
CREATE POLICY "public_read_cms_pages"
  ON cms_pages
  FOR SELECT
  TO public
  USING (true);

-- ============================================
-- CMS CONTENT RLS POLICIES
-- ============================================

-- Admins can do everything
CREATE POLICY "admins_full_access_cms_content"
  ON cms_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Reservation staff can edit tour-related content only
CREATE POLICY "reservation_staff_edit_tours"
  ON cms_content
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'reservation'
    )
    AND page_path LIKE '/tours%'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'reservation'
    )
    AND page_path LIKE '/tours%'
  );

-- Public can read published content (no drafts)
CREATE POLICY "public_read_published_cms_content"
  ON cms_content
  FOR SELECT
  TO public
  USING (is_draft = false);

-- ============================================
-- 5. INITIAL DATA SEEDING
-- ============================================
-- Register all pages that should be editable via CMS
-- ============================================

INSERT INTO cms_pages (page_path, page_name, icon, order_index) VALUES
  ('/', 'Home', 'home', 0),
  ('/tours', 'Tours', 'map', 1),
  ('/about', 'About', 'info', 2),
  ('/blog', 'Blog', 'file-text', 3),
  ('/contact', 'Contact', 'mail', 4),
  ('/concierge', 'Concierge', 'gem', 5),
  ('/admin', 'Admin Portal', 'lock', 100)
ON CONFLICT (page_path) DO UPDATE SET
  page_name = EXCLUDED.page_name,
  icon = EXCLUDED.icon,
  order_index = EXCLUDED.order_index;

-- ============================================
-- 6. HELPER FUNCTIONS
-- ============================================

-- Function to update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_cms_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers
CREATE TRIGGER update_cms_pages_timestamp
  BEFORE UPDATE ON cms_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_cms_timestamp();

CREATE TRIGGER update_cms_content_timestamp
  BEFORE UPDATE ON cms_content
  FOR EACH ROW
  EXECUTE FUNCTION update_cms_timestamp();

-- ============================================
-- 7. VIEWS FOR COMMON QUERIES
-- ============================================

-- View for fetching published content (excludes drafts)
CREATE OR REPLACE VIEW v_published_cms_content AS
SELECT
  id,
  page_path,
  component_id,
  content_key,
  content_value,
  media_url,
  color_value,
  order_index,
  slide_order,
  is_primary,
  updated_at
FROM cms_content
WHERE is_draft = false;

-- View for admin panel (includes drafts with editor info)
CREATE OR REPLACE VIEW v_admin_cms_content AS
SELECT
  c.id,
  c.page_path,
  c.component_id,
  c.content_key,
  c.content_value,
  c.media_url,
  c.color_value,
  c.order_index,
  c.slide_order,
  c.is_primary,
  c.is_draft,
  c.published_version,
  c.draft_version,
  c.updated_at,
  p.page_name,
  u.email AS updated_by_email,
  u.raw_user_meta_data->>'name' AS updated_by_name
FROM cms_content c
LEFT JOIN cms_pages p ON c.page_path = p.page_path
LEFT JOIN auth.users u ON c.updated_by = u.id;

-- ============================================
-- 8. COMMENTS & DOCUMENTATION
-- ============================================

/*
USAGE GUIDE:

1. CONTENT STORAGE STRUCTURE:
   - Each page has multiple components (hero, navigation, footer, etc.)
   - Each component has multiple content keys (title, subtitle, description, etc.)
   - Use cms_content table to store all editable values

2. DRAFT SYSTEM:
   - Set is_draft = true to create draft versions
   - Use draft_version JSONB field for complex draft data
   - Set is_draft = false to publish content

3. HERO SLIDER:
   - Multiple hero slides can exist for the same page
   - Use slide_order to define sequence
   - Mark the main slide with is_primary = true
   - Component ID pattern: 'hero_slide_1', 'hero_slide_2', etc.

4. MEDIA URLS:
   - Store Cloudinary URLs in media_url field
   - Images: https://res.cloudinary.com/dxztrqjft/image/upload/...
   - Videos: https://res.cloudinary.com/dxztrqjft/video/upload/...

5. COLOR CUSTOMIZATION:
   - Store hex colors in color_value field
   - Format: '#HEXCODE' (e.g., '#D4AF37' for gold)

6. ROLE PERMISSIONS:
   - admin: Can edit all pages and content
   - reservation: Can only edit tour-related pages (/tours/*)
   - account: Cannot edit CMS content (read-only)

EXAMPLE QUERIES:

-- Get all content for homepage
SELECT * FROM v_published_cms_content WHERE page_path = '/';

-- Get hero section content
SELECT * FROM cms_content
WHERE page_path = '/' AND component_id = 'hero';

-- Get all drafts
SELECT * FROM v_admin_cms_content WHERE is_draft = true;

-- Get all hero slides ordered
SELECT * FROM cms_content
WHERE page_path = '/' AND component_id LIKE 'hero_slide%'
ORDER BY slide_order;

-- Update content (as admin)
UPDATE cms_content
SET content_value = 'New Title', updated_by = auth.uid()
WHERE page_path = '/' AND component_id = 'hero' AND content_key = 'title';
*/

-- ============================================
-- END OF CMS SCHEMA
-- ============================================
