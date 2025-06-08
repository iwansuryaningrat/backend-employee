/*
  Warnings:

  - The primary key for the `Attendances` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Attendances` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Employees` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Employees` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Overtimes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Overtimes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `userId` on the `Attendances` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Employees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `Overtimes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Attendances" DROP CONSTRAINT "Attendances_userId_fkey";

-- DropForeignKey
ALTER TABLE "Employees" DROP CONSTRAINT "Employees_userId_fkey";

-- DropForeignKey
ALTER TABLE "Overtimes" DROP CONSTRAINT "Overtimes_userId_fkey";

-- AlterTable
ALTER TABLE "Attendances" DROP CONSTRAINT "Attendances_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Attendances_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Employees" DROP CONSTRAINT "Employees_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Employees_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Overtimes" DROP CONSTRAINT "Overtimes_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Overtimes_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Reimbursements" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reimbursements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employees_userId_key" ON "Employees"("userId");

-- AddForeignKey
ALTER TABLE "Employees" ADD CONSTRAINT "Employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendances" ADD CONSTRAINT "Attendances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Overtimes" ADD CONSTRAINT "Overtimes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reimbursements" ADD CONSTRAINT "Reimbursements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
