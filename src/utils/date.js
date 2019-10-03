import moment from "moment";

const getLastDate = (dates = []) => {
  if (dates.length === 0) return false;
  const sorted = dates.sort((a, b) => new Date(b) - new Date(a));
  return sorted[0];
};

const getLastDateFromNow = (dates = []) => {
  moment.locale("fr");
  const lastDate = getLastDate(dates);
  return lastDate && moment(lastDate).fromNow();
};

const compareLastDate = (datesA = [], datesB = []) => {
  if (!datesA.length && !datesB.length) return 0;
  if (!datesA.length) {
    return -1;
  } else if (!datesB.length) {
    return 1;
  } else {
    const lastA = moment(getLastDate(datesA.map(({ date }) => date)));
    const lastB = moment(getLastDate(datesB.map(({ date }) => date)));
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
  const toDay =  dateFormat(date, "dddd");
  return toDay.charAt(0).toUpperCase() + toDay.slice(1);
};

const addDays = (date, offset) =>
  moment(date)
    .add(offset, "d")
    .format("YYYY-MM-DD");

const isToday = date => moment(date).isSame(moment(), "day");



export {
  getLastDate,
  getLastDateFromNow,
  compareLastDate,
  compareDateProperty,
  formatToDay,
  formatToDayOfWeek,
  addDays,
  isToday,
};
