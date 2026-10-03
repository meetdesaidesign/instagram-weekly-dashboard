-- Drop Instagram analytics, ideas, and caption history.
-- Caption structure settings stay.

DROP TABLE IF EXISTS "MediaSnapshot";
DROP TABLE IF EXISTS "Media";
DROP TABLE IF EXISTS "AccountSnapshot";
DROP TABLE IF EXISTS "IdeaBatch";
DROP TABLE IF EXISTS "CaptionRun";

ALTER TABLE "Setting" DROP COLUMN IF EXISTS "igUserId";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "igUsername";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "accessToken";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "tokenExpiresAt";
