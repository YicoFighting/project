import { useScriptTag } from '@vueuse/core';
import { ref, onMounted } from 'vue';

/*异步按需创建script标签统一方法 */
export default (opts) => {
  const loading = ref(true);
  const isSuccess = ref(false);
  const promise = new Promise((resolve) => {
    onMounted(() => {
      const { load } = useScriptTag(
        opts.src,
        // 在标签加载完之后,想做的事情
        () => {},
        //开启异步调用async/await
        { manual: true }
      );
      load().then(() => {
        loading.value = false;
        isSuccess.value = true;
        resolve();
      });
    });
  });

  return {
    loading,
    isSuccess,
    toPromise: () => promise,
  };
};
