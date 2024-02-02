import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 首页
    { path: "/", component: () => import("@/views/home") },
    // 技战法仓
    {
      path: "/technical-warfare",
      component: () => import("@/views/technical-warfare"),
    },
    // 重点区域
    { path: "/key-areas", component: () => import("@/views/key-areas") },
    // 数据赋能
    {
      path: "/data-empowerment",
      component: () => import("@/views/data-empowerment"),
    },
    // 设备监管
    {
      path: "/equipment-supervision",
      component: () => import("@/views/equipment-supervision"),
    },

    // 智慧应用
    {
      path: "/smart-applications",
      component: () => import("@/views/smart-applications"),
    },

    // 数据监控
    { path: "/data-monitor", component: () => import("@/views/data-monitor") },

    // 数据资产
    { path: "/data-assets", component: () => import("@/views/data-assets") },

    // 智慧技防
    {
      path: "/technical-prevention",
      component: () => import("@/views/technical-prevention"),
    },

    // 404页面重定向至首页
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});

export default router;
