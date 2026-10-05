-- First-touch attribution on the user.
--
-- Nullable, additive, no default: an account created without a captured origin
-- records null rather than a made-up one. The signup action writes these once, at
-- creation, from the first-touch cookie the marketing site sets. This migration
-- computes nothing; it only stores what was already known when the landlord
-- arrived.
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "utmSource"   TEXT,
  ADD COLUMN IF NOT EXISTS "utmMedium"   TEXT,
  ADD COLUMN IF NOT EXISTS "utmCampaign" TEXT,
  ADD COLUMN IF NOT EXISTS "landingPage" TEXT,
  ADD COLUMN IF NOT EXISTS "referrer"    TEXT;
