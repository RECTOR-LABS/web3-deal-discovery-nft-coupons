-- Epic 10: Geo-Based Discovery Database Migrations
-- Run this on Supabase SQL Editor

-- =======================
-- 1. Add location columns to merchants table
-- =======================

-- Add latitude and longitude for precise location
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add address components for display
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE merchants ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'United States';

-- =======================
-- 2. Create spatial index for faster location queries
-- =======================

-- Index for location-based queries (WHERE latitude/longitude IS NOT NULL)
CREATE INDEX IF NOT EXISTS idx_merchants_location
ON merchants(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Index for city-based queries
CREATE INDEX IF NOT EXISTS idx_merchants_city ON merchants(city);

-- =======================
-- 3. Create helper function to calculate distance (Haversine)
-- =======================

-- Calculate distance between two points in miles
CREATE OR REPLACE FUNCTION calculate_distance_miles(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
)
RETURNS DECIMAL AS $$
DECLARE
  earth_radius DECIMAL := 3959; -- Earth's radius in miles
  dlat DECIMAL;
  dlon DECIMAL;
  a DECIMAL;
  c DECIMAL;
BEGIN
  -- Convert degrees to radians
  dlat := RADIANS(lat2 - lat1);
  dlon := RADIANS(lon2 - lon1);

  -- Haversine formula
  a := SIN(dlat / 2) * SIN(dlat / 2) +
       COS(RADIANS(lat1)) * COS(RADIANS(lat2)) *
       SIN(dlon / 2) * SIN(dlon / 2);

  c := 2 * ATAN2(SQRT(a), SQRT(1 - a));

  RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =======================
-- 4. Create view for merchants with location data
-- =======================

CREATE OR REPLACE VIEW merchants_with_location AS
SELECT
  m.id,
  m.wallet_address,
  m.business_name,
  m.description,
  m.logo_url,
  m.latitude,
  m.longitude,
  m.address,
  m.city,
  m.state,
  m.postal_code,
  m.country,
  m.created_at,
  COUNT(d.id) as total_deals
FROM merchants m
LEFT JOIN deals d ON d.merchant_id = m.id AND d.is_active = true
WHERE m.latitude IS NOT NULL AND m.longitude IS NOT NULL
GROUP BY m.id, m.wallet_address, m.business_name, m.description, m.logo_url,
         m.latitude, m.longitude, m.address, m.city, m.state, m.postal_code,
         m.country, m.created_at;

-- =======================
-- 5. Seed some test merchant locations (optional - for demo)
-- =======================

-- Example: Update existing merchant with location
-- UPDATE merchants
-- SET
--   latitude = 37.7749,
--   longitude = -122.4194,
--   address = '123 Market St',
--   city = 'San Francisco',
--   state = 'CA',
--   postal_code = '94102',
--   country = 'United States'
-- WHERE id = (SELECT id FROM merchants LIMIT 1);

-- =======================
-- Migration Complete
-- =======================

-- Verify migration
SELECT
  'Migration Complete!' as status,
  (SELECT COUNT(*) FROM merchants WHERE latitude IS NOT NULL) as merchants_with_location,
  (SELECT COUNT(*) FROM merchants) as total_merchants;
