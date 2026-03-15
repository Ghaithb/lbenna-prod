-- CreateEnum
CREATE TYPE "ScenarioType" AS ENUM ('PORTRAIT', 'LANDSCAPE', 'MACRO', 'ASTRO', 'ACTION', 'PRODUCT', 'OTHER');

-- AlterTable
ALTER TABLE "scenarios" ADD COLUMN     "type" "ScenarioType" NOT NULL DEFAULT 'OTHER';
