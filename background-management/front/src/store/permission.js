import { defineStore } from "pinia";
import { constantRoutes } from "@/router";
import { getDynamicRouting } from "@/services/login";
import Layout from "@/views/layout";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("../views/**/*.vue");

export const usePermissionStore = defineStore("permission", {
  state: () => {
    return {
      routes: [],
    };
  },
  actions: {
    setRoutes(routes) {
      this.routes = constantRoutes.concat(routes);
    },
    generateRoutes() {
      return new Promise((resolve, reject) => {
        getDynamicRouting().then((res) => {
          const routes = filterAsyncRouter(res, false, true);
          this.setRoutes(routes);
          resolve(routes);
        });
      });
    },
  },
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, parentRoute = false, type = false) {
  return asyncRouterMap.filter((route) => {
    // 给每个路由添加parentPath
    if (type && parentRoute) {
      route.parentPath =
        (parentRoute.parentPath ? `${parentRoute.parentPath}/` : "") +
        parentRoute.path;
      // 详情页选中菜单
      if (route.hidden) {
        route.meta = route.meta ?? {};
        route.meta.activeMenu = route.meta.activeMenu ?? route.parentPath;
      }
    }

    // 处理component
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else {
        route.component = loadView(route.component);
      }
    }

    // 如果有子节点的话 遍历子节点
    if (route.children?.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

export const loadView = (view) => {
  let res;
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) res = () => modules[path]();
  }
  return res;
};
