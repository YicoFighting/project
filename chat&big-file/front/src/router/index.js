import { createRouter, createWebHistory } from "vue-router";
import pinia from "@/pinia";
import { useUserStore } from "@/Pinia/user";
import { staticRoutes } from "@/utils/constant";

export const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    name: "qrCode",
    path: "/qrCode",
    component: () => import("@/views/login/qrCode.vue"),
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/index",
    redirect: "/synthesis",
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error/404"),
  },
];

const router = createRouter({
  routes: [...routes, ...staticRoutes],
  history: createWebHistory(),
});

const store = useUserStore(pinia);

const addRouteFn = (routes) => {
  return new Promise((resolve) => {
    routes.forEach((route) => {
      router.addRoute(route);
    });
    resolve();
  });
};

//去白名单页面,不用检查token
//去其他页面,没有token返回登录页,有token查找动态路由
const whiteRoutes = ["/login"];
router.beforeEach(async (to, from, next) => {
  if (whiteRoutes.includes(to.path)) {
    next();
  } else {
    const token = localStorage.getItem("token");
    if (!token) {
      next(`/login?redirect=${to.fullPath}`);
    } else {
      if (store.menu.length === 0) {
        await store.getUserInfo();
        await addRouteFn(store.menu);
        next({ ...to, replace: true });
      } else {
        next();
      }
    }
  }
});

export default router;
