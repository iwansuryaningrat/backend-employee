-- AlterTable
ALTER TABLE "Employees" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Overtimes" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Payslips" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Reimbursements" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(6);

-- CreateIndex
CREATE INDEX "Attendances_userId_idx" ON "Attendances"("userId");

-- CreateIndex
CREATE INDEX "Employees_userId_idx" ON "Employees"("userId");

-- CreateIndex
CREATE INDEX "Overtimes_userId_idx" ON "Overtimes"("userId");

-- CreateIndex
CREATE INDEX "Payslips_userId_idx" ON "Payslips"("userId");

-- CreateIndex
CREATE INDEX "Payslips_month_year_idx" ON "Payslips"("month", "year");

-- CreateIndex
CREATE INDEX "Reimbursements_userId_idx" ON "Reimbursements"("userId");
