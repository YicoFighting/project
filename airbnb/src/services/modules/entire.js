import request from "../index";

export const getEntireRoomList = (offset = 0, size = 20) => {
  return request.get({
    url: "entire/list",
    params: {
      offset,
      size,
    },
  });
};
