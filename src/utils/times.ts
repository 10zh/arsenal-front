import dayjs from 'dayjs';

export default function formatDate(time: any, format: any) {
  return dayjs(time).format(format);
}
