/*
  Warnings:

  - You are about to drop the column `storageOptions` on the `Product` table. All the data in the column will be lost.
  - The `grade` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `ram` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `supplierName` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "storageOptions",
ADD COLUMN     "levelSupplier" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "storage" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "supplierVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "variant" TEXT[] DEFAULT ARRAY[]::TEXT[],
DROP COLUMN "grade",
ADD COLUMN     "grade" TEXT[],
DROP COLUMN "ram",
ADD COLUMN     "ram" TEXT[],
ALTER COLUMN "supplierName" SET NOT NULL;

-- CreateTable
CREATE TABLE "ProductPricingTier" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "minQty" INTEGER NOT NULL,
    "maxQty" INTEGER,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductPricingTier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductPricingTier" ADD CONSTRAINT "ProductPricingTier_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
