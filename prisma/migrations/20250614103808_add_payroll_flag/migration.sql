-- AlterTable
ALTER TABLE "Attendances" ADD COLUMN     "is_run_payroll" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Overtimes" ADD COLUMN     "is_run_payroll" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Reimbursements" ADD COLUMN     "is_run_payroll" BOOLEAN NOT NULL DEFAULT false;
