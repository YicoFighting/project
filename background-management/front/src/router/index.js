import { createRouter, createWebHistory } from "vue-router";
import { usePermissionStore } from "@/store/permission";

export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/404"),
    hidden: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

let isLogin = false;
router.beforeEach(async (to, from, next) => {
  if (isLogin) return next();
  try {
    isLogin = true;
    // 获取用户拥有的菜单权限
    const accessRoutes = await usePermissionStore().generateRoutes();
    accessRoutes.forEach((route) => {
      router.addRoute(route);
    });
    next({ ...to, replace: true });
  } catch (error) {
    next({ path: "/login" });
  }
});

export default router;
