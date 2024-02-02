import request from "../index";

// 获取uuid和二维码
const getQrCode = () => {
  return request.get("/auth");
};

// 获取扫码结果
const getQrcodeResult = (params) => {
  return request.get("/auth/scan", {
    params,
  });
};

// 获取登录的验证码
const getLoginQrCode = () => {
  return request.get("/auth/login");
};

// 执行登录操作
const loginAction = (data) => {
  return request.post("/auth/login", data);
};

const asyncRoutes = [
  {
    name: "layout",
    path: "/",
    component: "Layout",
    redirect: "/index",
    hidden: false,
    meta: {
      title: "首页",
    },
    children: [
      {
        name: "index",
        path: "/index",
        component: "home/index",
        hidden: true,
      },
    ],
  },
  {
    name: "application",
    path: "/application",
    component: "Layout",
    hidden: false,
    meta: {
      title: "智慧应用",
    },
    children: [
      {
        name: "organization",
        path: "organization",
        component: "application/organization/index",
        hidden: false,
        meta: {
          title: "数据组织",
        },
      },
      {
        name: "administration",
        path: "administration",
        component: "application/administration/index",
        hidden: false,
        meta: {
          title: "数据管理",
        },
      },
      {
        name: "model",
        path: "model",
        component: "application/model/index",
        hidden: false,
        meta: {
          title: "模型管理",
        },
      },
      {
        name: "exchange",
        path: "exchange",
        component: "application/exchange/index",
        hidden: false,
        meta: {
          title: "模型交流",
        },
      },
      {
        name: "fusionTrajectory",
        path: "fusionTrajectory",
        component: "application/fusionTrajectory/index",
        hidden: false,
        meta: {
          title: "融合轨迹",
        },
      },
      {
        name: "holographicPattern",
        path: "holographicPattern",
        component: "application/holographicPattern/index",
        hidden: false,
        meta: {
          title: "全息图谱",
        },
      },
      {
        name: "orchestration",
        path: "orchestration",
        component: "application/orchestration/index",
        hidden: false,
        meta: {
          title: "业务编排",
        },
      },
    ],
  },
  {
    name: "twin",
    path: "/twin",
    component: "Layout",
    hidden: false,
    meta: {
      title: "孪生大屏",
    },
  },
  {
    name: "technology",
    path: "/technology",
    component: "Layout",
    hidden: false,
    meta: {
      title: "技防学校",
    },
    children: [
      {
        name: "basic",
        path: "basic",
        component: "technology/basic/index",
        hidden: false,
        meta: {
          title: "基础页面",
        },
      },
      {
        name: "basic-detail",
        path: "basic/detail/:id",
        component: "technology/basic/detail/index",
        hidden: true,
        meta: {
          title: "基础页面详情",
          activeMenu: "/technology/basic",
        },
      },
      {
        name: "plan-view",
        path: "plan-view",
        component: "technology/plan-view/index",
        hidden: false,
        meta: {
          title: "平面图",
        },
      },
      {
        name: "point",
        path: "point",
        component: "technology/point/index",
        hidden: false,
        meta: {
          title: "点位上图",
        },
      },
    ],
  },
  // {
  //   name: "file",
  //   path: "/file",
  //   component: "Layout",
  //   hidden: false,
  //   meta: {
  //     title: "文件",
  //   },
  //   children: [
  //     {
  //       name: "upload-img",
  //       path: "upload-img",
  //       component: "file/upload-img/index",
  //       hidden: false,
  //       meta: {
  //         title: "图片压缩上传",
  //       },
  //     },
  //     // {
  //     //   name: "pdf",
  //     //   path: "pdf",
  //     //   component: "file/pdf/index",
  //     //   hidden: false,
  //     //   meta: {
  //     //     title: "PDF",
  //     //   },
  //     // },
  //     {
  //       name: "editor",
  //       path: "editor",
  //       component: "file/editor/index",
  //       hidden: false,
  //       meta: {
  //         title: "编辑器",
  //       },
  //     },
  //   ],
  // },
  // {
  //   name: "tools",
  //   path: "/tools",
  //   component: "Layout",
  //   hidden: false,
  //   meta: {
  //     title: "工具",
  //   },
  //   children: [
  //     {
  //       name: "instruction",
  //       path: "instruction",
  //       component: "tools/instruction/index",
  //       hidden: false,
  //       meta: {
  //         title: "自定义指令",
  //       },
  //     },
  //     {
  //       name: "Container",
  //       path: "container",
  //       component: "tools/container/index",
  //       hidden: false,
  //       meta: {
  //         title: "内容示例",
  //       },
  //     },
  //     {
  //       name: "container-detail",
  //       path: "container/detail/:id",
  //       component: "tools/container/detail/index",
  //       hidden: true,
  //       meta: {
  //         title: "内容示例详情",
  //         activeMenu: "/tools/container",
  //       },
  //     },
  //     {
  //       name: "sequenceFrameAnimation",
  //       path: "sequenceFrameAnimation",
  //       component: "tools/sequenceFrameAnimation/index",
  //       meta: {
  //         title: "序列帧动画",
  //       },
  //     },
  //   ],
  // },
  // {
  //   name: "ui",
  //   path: "/ui",
  //   component: "Layout",
  //   hidden: false,
  //   meta: {
  //     title: "组件",
  //   },
  //   children: [
  //     {
  //       name: "atlas",
  //       path: "atlas",
  //       component: "ui/atlas/index",
  //       hidden: false,
  //       meta: {
  //         title: "关系图谱",
  //       },
  //     },
  //     {
  //       name: "gis",
  //       path: "gis",
  //       component: "ui/gis/index",
  //       hidden: false,
  //       meta: {
  //         title: "地图",
  //       },
  //       children: [
  //         {
  //           name: "normal",
  //           path: "normal",
  //           component: "ui/gis/normal/index",
  //           hidden: false,
  //           meta: {
  //             title: "展示地图",
  //           },
  //         },
  //         {
  //           name: "marker",
  //           path: "marker",
  //           component: "ui/gis/marker/index",
  //           hidden: false,
  //           meta: {
  //             title: "标记及轨迹",
  //           },
  //         },
  //         {
  //           name: "aggregation",
  //           path: "aggregation",
  //           component: "ui/gis/aggregation/index",
  //           hidden: false,
  //           meta: {
  //             title: "点聚合",
  //           },
  //         },
  //         {
  //           name: "track",
  //           path: "track",
  //           component: "ui/gis/track/index",
  //           hidden: false,
  //           meta: {
  //             title: "轨迹优化",
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },
];

// 获取动态路由
const getDynamicRouting = () => {
  return Promise.resolve(asyncRoutes);
};

export {
  getQrCode,
  getQrcodeResult,
  getLoginQrCode,
  loginAction,
  getDynamicRouting,
};
