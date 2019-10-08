import moment from "moment";
import { isoWeekdayCalc } from "moment-weekday-calc";

const getDays = (month = "") => {
  const firstDay = moment()
    .month(month)
    .startOf("month")
    .format("YYYY-MM-DD");

  const lastDay = moment()
    .month(month)
    .endOf("month")
    .format("YYYY-MM-DD");

  const workingDays = moment().isoWeekdayCalc({
    rangeStart: firstDay,
    rangeEnd: lastDay,
    weekdays: [1, 2, 3, 4, 5]
  });

  const restOfDays = moment().isoWeekdayCalc({
    rangeStart: new Date(),
    rangeEnd: lastDay,
    weekdays: [1, 2, 3, 4, 5]
  });

  const isFuture = (month) => {
    const today = moment().format('YYYY-MM-DD');
    const nextMonth = moment().month(month).startOf("month").format('YYYY-MM-DD')
    return moment(today).isBefore(nextMonth)
  }

  return { firstDay, lastDay, workingDays, restOfDays, isFuture }
}

export default getDays;