/*
  Warnings:

  - You are about to drop the column `status` on the `Reimbursements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reimbursements" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "Payslips" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "month" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "takeHomePay" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payslips_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payslips" ADD CONSTRAINT "Payslips_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
