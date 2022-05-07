import { BASE_URL } from "./const";
import createHttpRequest from "./utils/request";

const J = createHttpRequest(BASE_URL);

// 获取全部菜单
function addEvent<T>(param: object) {
  return J.post<T>('/addEvent', param);
};

export {
  addEvent
};
