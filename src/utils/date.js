import moment from "moment-with-locales-es6";

const getLastDate = (dates = []) => {
  if (dates.length === 0) return false;
  moment.locale("fr");
  return dates
    .map(date => moment(date))
    .sort((a, b) => moment(a).isBefore(b))[0];
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

export { getLastDate, getLastDateFromNow, compareLastDate };
