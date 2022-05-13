import { SERVER_URL } from "./const";
import createHttpRequest from "./utils/request";

const J = createHttpRequest(SERVER_URL);

function addEvent<T>(param: object) {
  return J.post<T>('/addEvent', param);
};

export {
  addEvent
};
