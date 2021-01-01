import {FilterType} from "../const";

export const filter = {
  [FilterType.EVERYTHING]: (tasks) => tasks,
  [FilterType.FUTURE]: (tasks) => tasks.filter((task) => task.price > 600),
  [FilterType.PAST]: (tasks) => tasks.filter((task) => task.price < 600),
};
