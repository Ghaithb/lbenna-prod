-- CreateEnum
CREATE TYPE "TutorialCategory" AS ENUM ('PHOTOGRAPHY', 'EDITING', 'LIGHTING', 'COMPOSITION', 'EQUIPMENT');

-- CreateEnum
CREATE TYPE "TutorialLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "WorkshopType" AS ENUM ('PHOTO_CHALLENGE', 'EDITING_EXERCISE', 'COMPOSITION_STUDY');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('PDF', 'PRESET', 'TEMPLATE', 'CHEATSHEET', 'EBOOK');

-- CreateTable
CREATE TABLE "tutorials" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "videoUrl" TEXT,
    "duration" INTEGER,
    "category" "TutorialCategory" NOT NULL DEFAULT 'PHOTOGRAPHY',
    "level" "TutorialLevel" NOT NULL DEFAULT 'BEGINNER',
    "tags" TEXT[],
    "thumbnailUrl" TEXT,
    "coverUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tutorials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshops" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "type" "WorkshopType" NOT NULL DEFAULT 'PHOTO_CHALLENGE',
    "difficulty" "TutorialLevel" NOT NULL DEFAULT 'BEGINNER',
    "duration" INTEGER,
    "objectives" JSONB,
    "thumbnailUrl" TEXT,
    "exampleUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workshop_submissions" (
    "id" TEXT NOT NULL,
    "workshopId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "notes" TEXT,
    "score" INTEGER,
    "feedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workshop_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ResourceType" NOT NULL DEFAULT 'PDF',
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "category" TEXT,
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "tutorialId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tutorials_slug_key" ON "tutorials"("slug");

-- CreateIndex
CREATE INDEX "tutorials_slug_idx" ON "tutorials"("slug");

-- CreateIndex
CREATE INDEX "tutorials_category_idx" ON "tutorials"("category");

-- CreateIndex
CREATE INDEX "tutorials_level_idx" ON "tutorials"("level");

-- CreateIndex
CREATE UNIQUE INDEX "workshops_slug_key" ON "workshops"("slug");

-- CreateIndex
CREATE INDEX "workshops_slug_idx" ON "workshops"("slug");

-- CreateIndex
CREATE INDEX "workshops_type_idx" ON "workshops"("type");

-- CreateIndex
CREATE INDEX "workshop_submissions_workshopId_idx" ON "workshop_submissions"("workshopId");

-- CreateIndex
CREATE INDEX "workshop_submissions_userId_idx" ON "workshop_submissions"("userId");

-- CreateIndex
CREATE INDEX "resources_tutorialId_idx" ON "resources"("tutorialId");

-- CreateIndex
CREATE INDEX "resources_type_idx" ON "resources"("type");

-- AddForeignKey
ALTER TABLE "workshop_submissions" ADD CONSTRAINT "workshop_submissions_workshopId_fkey" FOREIGN KEY ("workshopId") REFERENCES "workshops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "tutorials"("id") ON DELETE SET NULL ON UPDATE CASCADE;
