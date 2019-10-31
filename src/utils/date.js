import moment from 'moment';
import 'moment/locale/fr';
moment.locale('fr');
const fromNow = date => {
  return moment(date).fromNow();
}

const dateFormat = (date, format) => moment(date).format(format);

const formatToDay = date => {
  return dateFormat(date, "DD MMM");
};

const formatToDayOfWeek = date => {
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
