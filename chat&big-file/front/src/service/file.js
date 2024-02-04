import http from './noToken';

export const uploadBigFile = (data, callback) => {
  return http({
    url: '/files',
    method: 'post',
    data,
    onUploadProgress: callback,
  });
};

export const mergeBigFile = (data) => {
  return http({
    url: '/mergeFile',
    method: 'post',
    data,
  });
};

/** 慢策略网络请求(上传切片) */
export const uploadFileByStrategy = (data, callback) => {
  return http({
    url: '/fileStrategy',
    method: 'post',
    data,
    onUploadProgress: callback,
  });
};

/** 慢策略网络请求(合并切片) */
export const mergeByStrategy = (data) => {
  return http({
    url: '/mergeStrategy',
    method: 'post',
    data,
  });
};

/** 导出excel,逃避验签 */
export const exportExcel = () => {
  return http({
    url: '/exportExcel',
    method: 'post',
    responseType: 'blob',
  });
};
