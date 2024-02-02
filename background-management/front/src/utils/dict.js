import { ref, toRefs } from "vue";

const mock = (type) => {
  return new Promise((resove, reject) => {
    setTimeout(() => {
      resove([
        { label: "男", value: 0 },
        { label: "女", value: 1 },
      ]);
    }, 1000);
  });
};

export const getDict = (...args) => {
  const dicts = ref({});
  args.forEach((arg) => {
    // 让数据被响应式追踪
    dicts.value[arg] = [];
    mock(arg).then((res) => {
      dicts.value[arg] = res;
    });
  });

  // 让每个key都是响应式的
  return toRefs(dicts.value);
};
