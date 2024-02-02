import * as echarts from "echarts";
import {
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";

import { BarChart, LineChart, PieChart } from "echarts/charts";

import { UniversalTransition } from "echarts/features";

// 可以根据需要选用只用到的渲染器
import { SVGRenderer, CanvasRenderer } from "echarts/renderers";

echarts.use([
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  SVGRenderer,
  CanvasRenderer,
  UniversalTransition,
]);

export default echarts;
