import {FilterType} from '../const';
import isYesterday from 'dayjs/plugin/isYesterday';
import dayjs from 'dayjs';

dayjs.extend(isYesterday);

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => !dayjs(point.dateTo).isYesterday()),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs(point.dateTo).isYesterday()),
};
