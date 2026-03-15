/*
  Warnings:

  - You are about to drop the `camera_bodies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lab_presets` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `labs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lenses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lessons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `submissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_progress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "labs" DROP CONSTRAINT "labs_courseId_fkey";

-- DropForeignKey
ALTER TABLE "labs" DROP CONSTRAINT "labs_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_courseId_fkey";

-- DropForeignKey
ALTER TABLE "submissions" DROP CONSTRAINT "submissions_labId_fkey";

-- DropForeignKey
ALTER TABLE "user_progress" DROP CONSTRAINT "user_progress_moduleId_fkey";

-- DropTable
DROP TABLE "camera_bodies";

-- DropTable
DROP TABLE "courses";

-- DropTable
DROP TABLE "lab_presets";

-- DropTable
DROP TABLE "labs";

-- DropTable
DROP TABLE "lenses";

-- DropTable
DROP TABLE "lessons";

-- DropTable
DROP TABLE "modules";

-- DropTable
DROP TABLE "submissions";

-- DropTable
DROP TABLE "user_progress";

-- DropEnum
DROP TYPE "SensorFormat";
