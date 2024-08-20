/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Recipe` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Recipe" DROP CONSTRAINT "Recipe_createdBy_fkey";

-- AlterTable
ALTER TABLE "Recipe" DROP COLUMN "createdBy",
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
