-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'Beginner',
    "targetEv" DOUBLE PRECISION NOT NULL,
    "goals" TEXT[],
    "targetX" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "targetY" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "optimalFocalLength" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);
