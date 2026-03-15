-- AlterTable
ALTER TABLE "labs" ADD COLUMN     "moduleId" TEXT;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "quiz" JSONB,
ADD COLUMN     "resources" JSONB;

-- CreateIndex
CREATE INDEX "labs_moduleId_idx" ON "labs"("moduleId");

-- AddForeignKey
ALTER TABLE "labs" ADD CONSTRAINT "labs_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;
