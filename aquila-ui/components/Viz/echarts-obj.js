import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import {BarChart, GraphChart, HeatmapChart, LineChart, PieChart,} from 'echarts/charts';
import {
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent,
    VisualMapContinuousComponent,
} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use(
    [GraphChart,
        PieChart,
        BarChart,
        HeatmapChart,
        LineChart,
        GridComponent,
        TitleComponent,
        TooltipComponent,
        LegendComponent,
        ToolboxComponent,
        VisualMapComponent,
        VisualMapContinuousComponent,
        CanvasRenderer]
)

// The bundle analyzer suggest bundle size gain larger when loading separately
// Don't know why
// import ReactECharts from "echarts-for-react";

const Echarts = ({...props}) => {
    return <ReactEChartsCore
        echarts={echarts}
        opts={{locale: "EN"}}
        {...props}/>
}

export default Echarts;
