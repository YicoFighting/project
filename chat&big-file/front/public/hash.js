/** 基础版 */
/** 导入脚本 */
self.importScripts('/spark-md5.min.js');

/** 生成文件Hash(全量hash) */
self.onmessage = (e) => {
  /** 拿到切片列表 */
  const { fileChunkList } = e.data;
  const spark = new self.SparkMD5.ArrayBuffer();
  /** 进度 */
  let percentage = 0;
  /** 计数器 */
  let count = 0;
  /** 加载文件 */
  const loadNext = (index) => {
    /** 读取文件 */
    const reader = new FileReader();
    /** 启动读取(读取每一个切片) */
    reader.readAsArrayBuffer(fileChunkList[index].fragment);
    /** 读取完成 */
    reader.onload = (e) => {
      /** 计数器自增 */
      count++;
      spark.append(e.target.result);
      /** 完成 */
      if (count === fileChunkList.length) {
        self.postMessage({
          percentage: 100,
          hash: spark.end(),
        });
        self.close();
      } else {
        percentage += 100 / fileChunkList.length;
        self.postMessage({
          percentage,
        });
        loadNext(count);
      }
    };
  };
  loadNext(0);
};
