-- CreateEnum
CREATE TYPE "TutorialLanguage" AS ENUM ('FR', 'EN', 'AR');

-- AlterTable
ALTER TABLE "tutorials" ADD COLUMN     "language" "TutorialLanguage" NOT NULL DEFAULT 'FR';

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "tutorialId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "videoUrl" TEXT,
    "mediaUrls" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chapters_tutorialId_idx" ON "chapters"("tutorialId");

-- CreateIndex
CREATE INDEX "tutorials_language_idx" ON "tutorials"("language");

-- AddForeignKey
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "tutorials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
