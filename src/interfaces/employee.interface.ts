export interface IAttendance {
  totalWorkingDays: number;
  totalPresentDays: number;
  totalLateDays: number;
  totalAbsentDays: number;
}

export interface IOvertime {
  date: string;
  hours: number;
  totalPay: number;
}

export interface IOvertimesSummmary {
  totalHours: number;
  totalPay: number;
  overtimes: IOvertime[];
}

export interface IReimburse {
  description: string;
  amount: number;
  link: string;
  created_at: Date;
}

export interface IReimburseSummmary {
  totalAmount: number;
  reimbursements: IReimburse[];
}

export interface IEmployeePayslip {
  attendances: IAttendance;
  overtimes: IOvertimesSummmary;
  reimbursements: IReimburseSummmary;
  baseSalary: number;
  takeHomePay: number;
  month: string;
  year: number;
}