import { defineStore } from 'pinia';
import axios from '@/service';
import { loadRoutes } from '@/utils/dynammenuicRoutes';
import { staticRoutes } from '@/utils/constant';

export const useUserStore = defineStore('user', {
  state: () => ({
    menu: [],
  }),
  getters: {
    //静态与动态路由相结合
    siderMenu: (state) => [...staticRoutes, ...state.menu],
  },
  actions: {
    async getUserInfo() {
      try {
        const { menu } = await axios.get('/userInfo');
        const routes = await loadRoutes(menu);
        this.menu = routes;
      } catch (error) {
        console.log('获取路由菜单失败', error);
      }
    },
  },
});
