import {titleOpts, toolboxOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {BarChart as BChart} from 'echarts/charts';
import {GridComponent, TitleComponent, TooltipComponent, ToolboxComponent} from 'echarts/components';

echarts.use(
    [
        BChart,
        GridComponent,
        TooltipComponent,
        ToolboxComponent,
        TitleComponent,
        CanvasRenderer,
    ]
)

const BarChart = ({x, y, title}) => {

    const options = {
        ...titleOpts(title),
        ...toolboxOpts,
        tooltip: {
            trigger: 'item',
        },
        grid: {
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: x,
            splitNumber: x.length,
            axisTick: {
                alignWithLabel: true,
            },
            axisLabel: {
                interval: 0,
                rotate: 45,
                fontSize: 12,
            },
            nameRotate: 30,
            nameGap: 30,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: y,
                type: 'bar',
            }
        ]
    }

    return <Echarts
        echarts={echarts}
        option={options}
        style={{minWidth: 500, height: 500}}
    />
}

export default BarChart;