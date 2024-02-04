import SparkMD5 from 'spark-md5';

/** 切片函数 */
const sliceFile = (file, size = 1024 * 1024 * 5) => {
  const fileChunkList = [];
  let count = 0;
  while (count < file.size) {
    fileChunkList.push({
      fragment: file.slice(count, count + size, file.type),
    });
    count += size;
  }
  return fileChunkList;
};

/**
 * 开启Work线程(全量hash)
 * 主线程使用 postMessage 给 worker 线程传入所有切片 fileChunkList
 * 并监听 worker 线程发出的 postMessage 事件拿到文件 hash
 * @param {*} fileChunkList 待上传的文件列表
 * @returns
 */
const calculateHash = (fileChunkList, allProgress) => {
  return new Promise((resolve) => {
    /** 创建一个worker */
    let worker = new Worker('/hash.js');
    /** 将文件列表传给它 */
    worker.postMessage({ fileChunkList });
    /** 监听事件 */
    worker.onmessage = (e) => {
      const { percentage, hash } = e.data;
      allProgress.value = Number(Number(percentage).toFixed(2));
      if (hash) {
        resolve(hash);
      }
    };
  });
};

/** 兼容 */
window.requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    const start = Date.now();
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining: () => {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

/** 兼容 */
window.cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id);
  };

/**
 * 时间切片(全量hash)
 * @param {*} chunks 文件切片
 * @param {*} allProgress 切片进度条
 * @returns
 */
const timeSlice = (chunks, allProgress) => {
  return new Promise((resolve) => {
    /** md5 */
    const spark = new SparkMD5.ArrayBuffer();
    let index = 0;
    /**
     * 根据文件内容追加计算hsh
     * @param {*} file 切片内容
     * @returns
     */
    const appendToSpark = (file) => {
      return new Promise((resolve) => {
        /** 读取文件 */
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        /** 读取完成 */
        reader.onload = (e) => {
          spark.append(e.target.result);
          resolve();
        };
      });
    };

    let externalId = null;
    let internalId = null;
    //循环
    const workLoop = async (deadline) => {
      // 有任务 并且 当前帧还没结束
      while (index < chunks.length && deadline.timeRemaining() > 1) {
        await appendToSpark(chunks[index].fragment);
        index++;
        if (index < chunks.length) {
          allProgress.value = Number(
            ((100 * index) / chunks.length).toFixed(2)
          );
        } else {
          allProgress.value = 100;
          window.cancelIdleCallback(internalId);
          internalId = null;
          //返回hash
          resolve(spark.end());
        }
      }
      // window.cancelIdleCallback这个方法可能有问题吧
      if (allProgress.value != 100) {
        internalId = window.requestIdleCallback(workLoop);
      }

      //结束外循环
      if (externalId) {
        window.cancelIdleCallback(externalId);
        externalId = null;
      }
    };
    externalId = window.requestIdleCallback(workLoop);
  });
};

/**
 * 抽样hash
 * @param {*} file 未拆分的文件
 * @param {*} allProgress 生成hash进度条
 * @returns hash
 */
const calculateHashSample = async (file, allProgress) => {
  return new Promise((resolve) => {
    const spark = new SparkMD5.ArrayBuffer();
    const reader = new FileReader();
    const size = file.size;
    let offset = 2 * 1024 * 1024;
    let chunks = [file.slice(0, offset)];
    let cur = offset;
    while (cur < size) {
      if (cur + offset >= size) {
        chunks.push(file.slice(cur, cur + offset));
      } else {
        //切片的中间位置
        const mid = cur + offset / 2;
        //切面最后位置
        const end = cur + offset;
        //开头两字节
        chunks.push(file.slice(cur, cur + 2));
        //中间两字节
        chunks.push(file.slice(mid, mid + 2));
        //右侧两字节两字节
        chunks.push(file.slice(end - 2, end));
      }
      //修改指针
      cur += offset;
      allProgress.value = Number(
        (allProgress.value + (offset / size) * 100).toFixed(2)
      );
    }
    // 拼接
    reader.readAsArrayBuffer(new Blob(chunks));
    reader.onload = (e) => {
      spark.append(e.target.result);
      //返回hash
      allProgress.value = 100;
      resolve(spark.end());
    };
  });
};

/**
 * 网络请求并发控制(单一请求)
 * @param {*} networks 网络请求数组
 * @param {*} max 默认最大并发数为4
 * @returns
 */
const concurrencyNetwork = (networks, max = 4) => {
  return new Promise((resolve) => {
    //得到网络请求的数量
    const len = networks.length;
    //索引值
    let index = 0;
    //已完成网络请求
    let counter = 0;
    const run = async () => {
      // 有网络请求 并且 有通道
      while (index < len && max > 0) {
        const network = networks[index];
        // 占用通道
        max--;
        index++;
        network().finally(() => {
          max++;
          counter++;
          //完成所有网络请求
          if (counter === len) {
            resolve();
            //执行下一个网络请求
          } else {
            run();
          }
        });
      }
    };
    run();
  });
};

/**
 * 上传文件
 */
const handleUpload = () => {};

export {
  sliceFile,
  calculateHash,
  calculateHashSample,
  timeSlice,
  concurrencyNetwork,
};
