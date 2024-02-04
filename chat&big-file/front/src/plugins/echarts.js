import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import {
  GraphChart,
  LinesChart,
  LineChart,
  PieChart,
  GaugeChart,
} from 'echarts/charts';
import { UniversalTransition, LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  GraphChart,
  LinesChart,
  PieChart,
  GaugeChart,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
  LabelLayout,
]);

export default echarts;
