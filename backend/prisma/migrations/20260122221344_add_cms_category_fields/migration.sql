-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "color" TEXT,
ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "portfolio_items" ADD COLUMN     "categoryId" TEXT;

-- AlterTable
ALTER TABLE "service_offers" ADD COLUMN     "categoryId" TEXT;

-- AddForeignKey
ALTER TABLE "service_offers" ADD CONSTRAINT "service_offers_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
