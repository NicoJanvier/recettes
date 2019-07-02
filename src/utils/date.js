import moment from "moment-with-locales-es6";

const getLastDate = (dates = []) => {
  if (dates.length === 0) return false;
  moment.locale("fr");
  // return dates
  //   .map(date => moment(date))
  //   .sort((a, b) => moment(a).isBefore(b))[0];
  const moments = dates.map(date => moment(date));
  const sorted = moments.sort((a, b) => moment(a).isBefore(b));
  return sorted[0];
};

const getLastDateFromNow = (dates = []) => {
  const lastDate = getLastDate(dates);
  return lastDate && lastDate.fromNow();
};

const compareLastDate = (datesA = [], datesB = []) => {
  if (!datesA.length && !datesB.length) return 0;
  if (!datesA.length) {
    return -1;
  } else if (!datesB.length) {
    return 1;
  } else {
    const lastA = getLastDate(datesA);
    const lastB = getLastDate(datesB);
    return lastA.isBefore(lastB) ? -1 : 1;
  }
};

const compareDateProperty = (objA, objB) => {
  if (moment(objA.date).isBefore(moment(objB.date))) {
    return -1;
  } else {
    return 1;
  }
};

const dateFormat = (date, format) => moment(date).format(format);

const formatToDay = date => {
  moment.locale("fr");
  return dateFormat(date, "DD MMM");
};
const formatToDayOfWeek = date => {
  moment.locale("fr");
  return dateFormat(date, "dddd");
};

const addDays = (date, offset) =>
  moment(date)
    .add(offset, "d")
    .format("YYYY-MM-DD");

const isToday = date => moment(date).isSame(moment(), "day");

const generateDateList = (start, end) => {
  const startM = moment(start);
  const endM = moment(end);
  const days = [];
  let day = startM;
  while (day.isSameOrBefore(endM)) {
    days.push(day.format("YYYY-MM-DD"));
    day = day.clone().add(1, "d");
  }
  return days;
};


export {
  getLastDate,
  getLastDateFromNow,
  compareLastDate,
  compareDateProperty,
  formatToDay,
  formatToDayOfWeek,
  addDays,
  isToday,
  generateDateList
};
