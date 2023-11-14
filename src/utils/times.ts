import dayjs from 'dayjs';

export default function formatDate(time: any, format: any) {
  return time ? dayjs(time).format(format) : '';
  
}

export const formatSeconds = (value: number) => {
  let secondTime: number | string = value;
  let minuteTime: number | string = 0;
  let hourTime: number | string = 0;
  if (secondTime > 60) {
    minuteTime = (secondTime / 60).toFixed(1).slice(0, -2);
    secondTime = (secondTime % 60).toFixed(1).slice(0, -2);
    if (Number(minuteTime) > 60) {
      hourTime = (Number(minuteTime) / 60).toFixed(1).slice(0, -2);
      minuteTime = (Number(minuteTime) % 60).toFixed(1).slice(0, -2);
    }
  }
  if (Number(secondTime) === 0) {
    secondTime = '00';
  } else if (Number(secondTime) < 10) {
    secondTime = `0${secondTime}`;
  }
  if (Number(minuteTime) === 0) {
    minuteTime = '00';
  } else if (Number(minuteTime) < 10) {
    minuteTime = `0${minuteTime}`;
  }
  if (Number(hourTime) === 0) {
    hourTime = '00';
  } else if (Number(hourTime) < 10) {
    hourTime = `0${hourTime}`;
  }
  const result = `${hourTime}:${minuteTime}:${secondTime}`;
  return result;
};
// 时间格式时分秒
export const formatSecondsToText = (value: number) => {
  let secondTime: number | string = value;
  let minuteTime: number | string = 0;
  let hourTime: number | string = 0;
  if (secondTime > 60) {
    minuteTime = (secondTime / 60).toFixed(1).slice(0, -2);
    secondTime = (secondTime % 60).toFixed(1).slice(0, -2);
    if (Number(minuteTime) > 60) {
      hourTime = (Number(minuteTime) / 60).toFixed(1).slice(0, -2);
      minuteTime = (Number(minuteTime) % 60).toFixed(1).slice(0, -2);
    }
  }
  if (Number(secondTime) === 0) {
    secondTime = '0秒';
  } else if (Number(secondTime) < 10) {
    secondTime = `${secondTime}秒`;
  }
  if (Number(minuteTime) === 0) {
    minuteTime = '0分';
  } else if (Number(minuteTime) < 10) {
    minuteTime = `${minuteTime}分`;
  }
  if (Number(hourTime) === 0) {
    hourTime = '0小时';
  } else if (Number(hourTime) < 10) {
    hourTime = `${hourTime}小时`;
  }
  const result = `${hourTime}${minuteTime}${secondTime}秒`;
  return result;
}
