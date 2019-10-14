import moment from "moment";

const fromNow = date => {
  moment.locale("fr");
  return moment(date).fromNow();
}

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

const isToday = date => moment(date).isSame(moment(), "day");

const generateDateList = (offset) => {
  const startM = moment().add(offset, "d");
  const endM = moment().add(10, "d");
  const days = [];
  let day = startM.clone();
  while (day.isSameOrBefore(endM)) {
    days.push(day.format("YYYY-MM-DD"));
    day = day.clone().add(1, "d");
  }
  return days;
}

export {
  fromNow,
  formatToDay,
  formatToDayOfWeek,
  isToday,
  generateDateList,
};
