import { ref } from "vue";

export const useTableList = (api, prefix, size = 10) => {
  // 表单参数
  const query = ref({});
  // 分页
  const Page = ref({
    current: 1,
    size,
  });
  // 加载状态
  const loading = ref(false);
  //列表
  const list = ref([]);
  // 列表总数
  const total = ref(0);

  // 重置
  const reset = () => {
    Page.value.current = 1;
    getData();
  };

  // 请求方法
  const getData = () => {
    loading.value = true;
    api({ ...Page.value, ...query.value })
      .then((res) => {
        if (res.code == 0) {
          list.value = res.data.records;
          total.value = Number(res.data.total);
        }
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // 页码改变
  const pageChange = ({ page }) => {
    Page.value.current = page;
    getData();
  };

  return {
    [prefix ? prefix + "_Query" : "query"]: query,
    [prefix ? prefix + "_Page" : "Page"]: Page,
    [prefix ? prefix + "_Loading" : "loading"]: loading,
    [prefix ? prefix + "_List" : "list"]: list,
    [prefix ? prefix + "_Total" : "total"]: total,
    [prefix ? prefix + "_Reset" : "reset"]: reset,
    [prefix ? prefix + "_GetData" : "getData"]: getData,
    [prefix ? prefix + "_PageChange" : "pageChange"]: pageChange,
  };
};
