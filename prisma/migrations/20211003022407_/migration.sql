/*
  Warnings:

  - You are about to drop the `Signature` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_userId_fkey";

-- DropTable
DROP TABLE "Signature";

-- CreateTable
CREATE TABLE "Petition" (
    "id" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "cin" TEXT NOT NULL,
    "electoral_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Petition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Petition_cin_key" ON "Petition"("cin");

-- CreateIndex
CREATE UNIQUE INDEX "Petition_electoral_number_key" ON "Petition"("electoral_number");

-- CreateIndex
CREATE UNIQUE INDEX "Petition_email_key" ON "Petition"("email");

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
