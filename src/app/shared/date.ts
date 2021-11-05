import moment from 'moment';

function currentDate(format = 'YYYY-MM-DD'): string {
  const date = new Date();
  return moment(date).format(format);
}

function currentTime(format = 'HH:mm:ss'): string {
  const date = new Date();
  return moment(date).format(format);
}

function currentTimeWithZone(format = 'HH:mm:ssZ'): string {
  const date = new Date();
  return moment(date).format(format);
}

function currentDateTime(format = 'YYYY-MM-DD|HH:mm:ss'): string {
  const date = new Date();
  return moment(date).format(format);
}

const DateTime = {
  currentDate,
  currentTime,
  currentTimeWithZone,
  currentDateTime,
};

export { DateTime };
