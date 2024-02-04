// 匹配views里面所有的.vue文件
const modules = import.meta.glob('../views/**/*.vue');
import Layout from '@/views/layout/index.vue';
import ParentView from '@/views/components/ParentView.vue';

/**
 * 加载路由
 * @param {*} view 路径
 * @returns
 */
const loadView = (view) => {
  let res;
  for (const path in modules) {
    //得到组件名
    const dir = path.split('views/')[1].split('.vue')[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
};

export const loadRoutes = (dynammenuicRoutes) => {
  return dynammenuicRoutes.map((route) => {
    //加载路由文件
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = () => import('@/views/layout/index.vue');
      } else if (route.component === 'ParentView') {
        route.component = () => import('@/views/components/ParentView.vue');
      } else {
        //加载.vue文件
        route.component = loadView(route.component);
      }
    }
    //递归
    if (route.children) {
      route.children = loadRoutes(route.children);
    }
    return route;
  });
};
