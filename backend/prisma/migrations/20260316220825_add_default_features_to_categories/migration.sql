/*
  Warnings:

  - You are about to drop the `cart_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `certificates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `chapters` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `expenses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `jobs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `licenses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `order_status_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_order_items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `purchase_orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz_attempts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz_options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz_questions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quizzes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quotes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scenarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_levels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stock_movements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subscriptions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `templates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tutorial_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tutorials` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `warehouses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workshop_submissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `workshops` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transferToken]` on the table `bookings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_userId_fkey";

-- DropForeignKey
ALTER TABLE "certificates" DROP CONSTRAINT "certificates_userId_fkey";

-- DropForeignKey
ALTER TABLE "chapters" DROP CONSTRAINT "chapters_tutorialId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_orderId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_userId_fkey";

-- DropForeignKey
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_orderId_fkey";

-- DropForeignKey
ALTER TABLE "licenses" DROP CONSTRAINT "licenses_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_orderId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_validatedById_fkey";

-- DropForeignKey
ALTER TABLE "order_status_history" DROP CONSTRAINT "order_status_history_orderId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_addressId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_couponId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_order_items" DROP CONSTRAINT "purchase_order_items_purchaseOrderId_fkey";

-- DropForeignKey
ALTER TABLE "purchase_orders" DROP CONSTRAINT "purchase_orders_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_attempts" DROP CONSTRAINT "quiz_attempts_quizId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_attempts" DROP CONSTRAINT "quiz_attempts_userId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_options" DROP CONSTRAINT "quiz_options_questionId_fkey";

-- DropForeignKey
ALTER TABLE "quiz_questions" DROP CONSTRAINT "quiz_questions_quizId_fkey";

-- DropForeignKey
ALTER TABLE "quizzes" DROP CONSTRAINT "quizzes_tutorialId_fkey";

-- DropForeignKey
ALTER TABLE "quotes" DROP CONSTRAINT "quotes_userId_fkey";

-- DropForeignKey
ALTER TABLE "resources" DROP CONSTRAINT "resources_tutorialId_fkey";

-- DropForeignKey
ALTER TABLE "stock_levels" DROP CONSTRAINT "stock_levels_productId_fkey";

-- DropForeignKey
ALTER TABLE "stock_levels" DROP CONSTRAINT "stock_levels_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_productId_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_userId_fkey";

-- DropForeignKey
ALTER TABLE "stock_movements" DROP CONSTRAINT "stock_movements_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "tutorial_progress" DROP CONSTRAINT "tutorial_progress_tutorialId_fkey";

-- DropForeignKey
ALTER TABLE "tutorial_progress" DROP CONSTRAINT "tutorial_progress_userId_fkey";

-- DropForeignKey
ALTER TABLE "workshop_submissions" DROP CONSTRAINT "workshop_submissions_userId_fkey";

-- DropForeignKey
ALTER TABLE "workshop_submissions" DROP CONSTRAINT "workshop_submissions_workshopId_fkey";

-- DropForeignKey
ALTER TABLE "workshops" DROP CONSTRAINT "workshops_tutorialId_fkey";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "paidAmount" DOUBLE PRECISION,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
ADD COLUMN     "transferToken" TEXT;

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "defaultFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repliedAt" TIMESTAMP(3),
ADD COLUMN     "replyContent" TEXT;

-- AlterTable
ALTER TABLE "portfolio_items" ALTER COLUMN "category" DROP NOT NULL;

-- AlterTable
ALTER TABLE "service_offers" ADD COLUMN     "isPack" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPromo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "promoExpiresAt" TIMESTAMP(3),
ADD COLUMN     "promoPrice" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "name" TEXT;

-- DropTable
DROP TABLE "cart_items";

-- DropTable
DROP TABLE "certificates";

-- DropTable
DROP TABLE "chapters";

-- DropTable
DROP TABLE "coupons";

-- DropTable
DROP TABLE "expenses";

-- DropTable
DROP TABLE "invoices";

-- DropTable
DROP TABLE "jobs";

-- DropTable
DROP TABLE "licenses";

-- DropTable
DROP TABLE "order_items";

-- DropTable
DROP TABLE "order_status_history";

-- DropTable
DROP TABLE "orders";

-- DropTable
DROP TABLE "products";

-- DropTable
DROP TABLE "purchase_order_items";

-- DropTable
DROP TABLE "purchase_orders";

-- DropTable
DROP TABLE "quiz_attempts";

-- DropTable
DROP TABLE "quiz_options";

-- DropTable
DROP TABLE "quiz_questions";

-- DropTable
DROP TABLE "quizzes";

-- DropTable
DROP TABLE "quotes";

-- DropTable
DROP TABLE "resources";

-- DropTable
DROP TABLE "scenarios";

-- DropTable
DROP TABLE "stock_levels";

-- DropTable
DROP TABLE "stock_movements";

-- DropTable
DROP TABLE "subscriptions";

-- DropTable
DROP TABLE "suppliers";

-- DropTable
DROP TABLE "templates";

-- DropTable
DROP TABLE "tutorial_progress";

-- DropTable
DROP TABLE "tutorials";

-- DropTable
DROP TABLE "warehouses";

-- DropTable
DROP TABLE "workshop_submissions";

-- DropTable
DROP TABLE "workshops";

-- DropEnum
DROP TYPE "CouponType";

-- DropEnum
DROP TYPE "CustomizationStatus";

-- DropEnum
DROP TYPE "ExpenseCategory";

-- DropEnum
DROP TYPE "InvoiceStatus";

-- DropEnum
DROP TYPE "JobStatus";

-- DropEnum
DROP TYPE "JobType";

-- DropEnum
DROP TYPE "OrderSource";

-- DropEnum
DROP TYPE "OrderStatus";

-- DropEnum
DROP TYPE "PaperType";

-- DropEnum
DROP TYPE "ProductCategory";

-- DropEnum
DROP TYPE "ProductType";

-- DropEnum
DROP TYPE "PurchaseExperience";

-- DropEnum
DROP TYPE "PurchaseOrderStatus";

-- DropEnum
DROP TYPE "QuoteStatus";

-- DropEnum
DROP TYPE "ResourceType";

-- DropEnum
DROP TYPE "ScenarioType";

-- DropEnum
DROP TYPE "ShippingMethod";

-- DropEnum
DROP TYPE "StockMovementType";

-- DropEnum
DROP TYPE "SubscriptionStatus";

-- DropEnum
DROP TYPE "TutorialCategory";

-- DropEnum
DROP TYPE "TutorialLanguage";

-- DropEnum
DROP TYPE "TutorialLevel";

-- DropEnum
DROP TYPE "WorkshopType";

-- CreateTable
CREATE TABLE "global_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "group" TEXT NOT NULL DEFAULT 'GENERAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "global_settings_key_key" ON "global_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_transferToken_key" ON "bookings"("transferToken");
