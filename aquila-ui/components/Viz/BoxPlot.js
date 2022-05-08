import {titleOpts, toolboxOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {BoxplotChart} from 'echarts/charts';
import {GridComponent, TitleComponent, TooltipComponent} from 'echarts/components';

echarts.use(
    [
        BoxplotChart,
        GridComponent,
        TooltipComponent,
        TitleComponent,
        CanvasRenderer,
    ]
)

const BoxPlot = ({data, xlabel, title}) => {

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
            data: xlabel,
            splitNumber: xlabel.length,
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
                data: data,
                type: 'boxplot',
            }
        ]
    }

    return <Echarts
        echarts={echarts}
        option={options}
        style={{minWidth: 500, height: 500}}
    />
}

export default BoxPlot;