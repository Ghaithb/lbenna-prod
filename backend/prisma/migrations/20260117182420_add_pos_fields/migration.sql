/*
  Warnings:

  - The `paymentMethod` column on the `orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OrderSource" AS ENUM ('ONLINE', 'POS', 'MANUAL');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('ONLINE', 'CASH', 'CARD_TERMINAL', 'CHECK', 'TRANSFER');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "cashierId" TEXT,
ADD COLUMN     "source" "OrderSource" NOT NULL DEFAULT 'ONLINE',
ALTER COLUMN "shippingMethod" SET DEFAULT 'DELIVERY',
DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'ONLINE';
