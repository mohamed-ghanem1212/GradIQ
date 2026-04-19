ALTER TABLE "ats"
ALTER COLUMN "score" TYPE numeric
USING score::numeric;

ALTER TABLE "ats"
ALTER COLUMN "score" SET DEFAULT 0;