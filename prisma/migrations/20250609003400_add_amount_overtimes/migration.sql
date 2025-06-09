/*
  Warnings:

  - Added the required column `amount` to the `Overtimes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Overtimes" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL;
