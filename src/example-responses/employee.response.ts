export const SubmitAttendanceResponse = {
  "message": "You have submitted your attendance for 14-06-2025, Creola Grimes!",
  "attendance": {
    "id": 7,
    "userId": 348,
    "date": "14-06-2025",
    "status": "present",
    "checkIn": "2025-06-13T19:12:23.090Z",
    "checkOut": null,
    "created_at": "2025-06-13T19:12:23.100Z",
    "updated_at": "2025-06-13T19:12:23.100Z"
  }
}

export const SubmitOvertimeResponse = {
  "message": "You have submitted your overtime for today!",
  "overtime": {
    "id": 2,
    "userId": 349,
    "date": "14-06-2025",
    "hours": 3,
    "amount": 4642857,
    "reason": "No reason",
    "created_at": "2025-06-13T21:29:35.892Z",
    "updated_at": "2025-06-13T21:29:35.892Z"
  }
}

export const SubmitReimburseResponse = {
  "message": "You have submitted your reimbursement!",
  "reimburse": {
    "id": 1,
    "userId": 349,
    "amount": 2000000,
    "description": "Test",
    "link": "localhost:3030/uploads/my-photo-1749879296616-116745367.jpg",
    "created_at": "2025-06-14T05:34:56.636Z",
    "updated_at": "2025-06-14T05:34:56.636Z"
  }
}

export const GetPayslipResponse = {
  "message": "Payslip generated successfully!",
  "data": {
    "attendances": {
      "totalWorkingDays": 21,
      "totalPresentDays": 0,
      "totalAbsentDays": 21,
      "totalLateDays": 0
    },
    "overtimes": {
      "totalHours": 6,
      "totalPay": 9285714,
      "overtimes": [
        {
          "date": "13-06-2025",
          "hours": 3,
          "totalPay": 4642857
        },
        {
          "date": "14-06-2025",
          "hours": 3,
          "totalPay": 4642857
        }
      ]
    },
    "reimbursements": {
      "totalAmount": 2000000,
      "reimbursements": [
        {
          "description": "Test",
          "amount": 2000000,
          "link": "localhost:3030/uploads/my-photo-1749879296616-116745367.jpg",
          "created_at": "2025-06-13T22:34:56.636Z"
        }
      ]
    },
    "baseSalary": 130000000,
    "takeHomePay": 141285714
  }
}