/*
  Warnings:

  - You are about to drop the column `uuid` on the `Trainee` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Trainee_uuid_key";

-- AlterTable
ALTER TABLE "Trainee" DROP COLUMN "uuid";
