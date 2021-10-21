/*
  Warnings:

  - Added the required column `price` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "canceled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" INTEGER NOT NULL;
