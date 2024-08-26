-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "categoryId" TEXT,
ALTER COLUMN "image" SET DEFAULT 'no-recipe-image';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT DEFAULT 'no-user-image';

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
