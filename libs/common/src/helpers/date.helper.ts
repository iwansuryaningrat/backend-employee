import * as moment from "moment-timezone";

/**
 * Given a date, returns the current date, the day of the week, and the day of the month.
 * If no date is given, the current date is used.
 * @param {Date} [date] The date to get information for.
 * @returns {Object} An object with three properties: date (a moment object), today (a string in the format DD-MM-YYYY), and dayOffWeek (a number between 0 and 6, where 0 is Sunday and 6 is Saturday).
 */
export const getDates = (date?: Date) => {
  date = date || new Date();
  const newDate = moment(date).tz('Asia/Jakarta');
  const today = newDate.format("DD-MM-YYYY");
  const dayOfWeek = newDate.day();

  return {
    date: newDate,
    today,
    dayOfWeek
  }
}

/**
 * Returns the full name of the month for a given month number.
 * 
 * @param monthNumber - The zero-based index of the month (0 for January, 11 for December).
 * @returns The full name of the month in English.
 */
export const getMonthName = (monthNumber: number) => {
  const date = new Date(2025, monthNumber, 1);
  return date.toLocaleString('en-US', { month: 'long' });
};

/**
 * Returns the number of days in a given month and year.
 *
 * @param month - The month (0-11).
 * @param year - The year.
 * @returns {Object} An object with two properties: startDay and endDay with full datetime format.
 */
export const getRangeMonth = (month: number, year: number) => {
  const startDay = moment(new Date(year, month, 1)).tz('Asia/Jakarta').format();
  const endDay = moment(new Date(year, month + 1, 0)).tz('Asia/Jakarta').endOf('day').format();
  return { startDay, endDay };
}

/**
 * Count the number of weekdays (Monday to Friday) in a given month and year.
 *
 * @param {number} year - The year.
 * @param {number} month - The month (0-11).
 * @returns {number} The number of weekdays in the given month and year.
 */
export const countWeekdaysInMonth = (year: number, month: number): number => {
  let count = 0;
  const date = new Date(year, month, 1); // JS month is 0-based

  while (date.getMonth() === month) {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (day !== 0 && day !== 6) count++; // Count Mon–Fri
    date.setDate(date.getDate() + 1);
  }

  return count;
}