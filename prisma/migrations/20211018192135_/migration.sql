-- CreateTable
CREATE TABLE "Reward" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "archived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "rewardId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "acceptedAt" TIMESTAMP(3),
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "sentAt" TIMESTAMP(3),
    "received" BOOLEAN NOT NULL DEFAULT false,
    "receivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_userId_key" ON "Order"("userId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_rewardId_fkey" FOREIGN KEY ("rewardId") REFERENCES "Reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
