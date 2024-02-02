import { defineStore } from "pinia";

const useTagsViewStore = defineStore("tags-view", {
  state: () => ({
    cachedViews: [],
  }),
  actions: {
    // 添加缓存
    addView(view) {
      if (this.cachedViews.includes(view.name)) return;
      if (!view.meta.noCache) {
        this.cachedViews.push(view.name);
      }
    },
    // 删除缓存
    delView(view) {
      const index = this.cachedViews.indexOf(view.name);
      index > -1 && this.cachedViews.splice(index, 1);
    },
  },
});

export default useTagsViewStore;
