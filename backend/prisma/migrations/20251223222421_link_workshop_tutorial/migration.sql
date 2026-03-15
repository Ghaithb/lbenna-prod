-- AlterTable
ALTER TABLE "workshops" ADD COLUMN     "tutorialId" TEXT;

-- AddForeignKey
ALTER TABLE "workshops" ADD CONSTRAINT "workshops_tutorialId_fkey" FOREIGN KEY ("tutorialId") REFERENCES "tutorials"("id") ON DELETE SET NULL ON UPDATE CASCADE;
