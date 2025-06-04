/*
  Warnings:

  - You are about to drop the column `businessName` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'client';

-- AlterTable
ALTER TABLE "Operator" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'operator';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "businessName",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'client';
