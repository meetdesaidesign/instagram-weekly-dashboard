-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "igUserId" TEXT,
    "igUsername" TEXT,
    "accessToken" TEXT,
    "tokenExpiresAt" TIMESTAMP(3),
    "captionTemplate" TEXT NOT NULL DEFAULT '',
    "captionExamples" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountSnapshot" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "followersCount" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "follows" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "igMediaId" TEXT NOT NULL,
    "caption" TEXT,
    "mediaType" TEXT,
    "productType" TEXT,
    "permalink" TEXT,
    "thumbnailUrl" TEXT,
    "mediaUrl" TEXT,
    "timestamp" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaSnapshot" (
    "id" SERIAL NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "saved" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,
    "totalInteractions" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IdeaBatch" (
    "id" SERIAL NOT NULL,
    "weekOf" DATE NOT NULL,
    "ideas" JSONB NOT NULL,
    "basedOnMediaIds" JSONB,
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaptionRun" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "output" TEXT NOT NULL,
    "templateUsed" TEXT,
    "model" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaptionRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AccountSnapshot_date_idx" ON "AccountSnapshot"("date");

-- CreateIndex
CREATE UNIQUE INDEX "AccountSnapshot_date_key" ON "AccountSnapshot"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Media_igMediaId_key" ON "Media"("igMediaId");

-- CreateIndex
CREATE INDEX "Media_timestamp_idx" ON "Media"("timestamp");

-- CreateIndex
CREATE INDEX "MediaSnapshot_date_idx" ON "MediaSnapshot"("date");

-- CreateIndex
CREATE UNIQUE INDEX "MediaSnapshot_mediaId_date_key" ON "MediaSnapshot"("mediaId", "date");

-- CreateIndex
CREATE INDEX "IdeaBatch_weekOf_idx" ON "IdeaBatch"("weekOf");

-- CreateIndex
CREATE UNIQUE INDEX "IdeaBatch_weekOf_key" ON "IdeaBatch"("weekOf");

-- CreateIndex
CREATE INDEX "CaptionRun_createdAt_idx" ON "CaptionRun"("createdAt");

-- AddForeignKey
ALTER TABLE "MediaSnapshot" ADD CONSTRAINT "MediaSnapshot_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

