import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

export default (isBuild) => {
  return createSvgIconsPlugin({
    // 图标路径
    iconDirs: [path.resolve(process.cwd(), "src/assets/icons/svg")],
    // dir/icon1.svg =>> dir-icon1
    // icon1.svg =>> icon1
    symbolId: "icon-[dir]-[name]",
    svgoOptions: isBuild,
  });
};
