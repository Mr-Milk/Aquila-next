import {RDBU11, rdbu11, titleOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {HeatmapChart} from 'echarts/charts';
import { GridComponent,
    TitleComponent, ToolboxComponent, TooltipComponent,
    VisualMapComponent,
} from 'echarts/components';

echarts.use([
    CanvasRenderer,
    HeatmapChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    VisualMapComponent,
])

const Heatmap = ({data, xlabel, ylabel, title, width, height}) => {

    const options = {
        ...titleOpts(title),
        grid: {
            show: false,
            top: "10%",
            left: "0%",
            right: "10%",
            width: 'auto',
            height: 'auto',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            position: 'bottom',
            data: xlabel,
            splitNumber: 1,
            splitArea: {
                show: true
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                rotate: 30,
                fontSize: 12,
            },
            fontSize: 6,
        },
        yAxis: {
            type: 'category',
            data: ylabel,
            splitNumber: 1,
            splitArea: {
                show: true
            },
            axisLabel: {
                fontSize: 12,
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
        },
        visualMap: {
            min: -1.0,
            max: 1.0,
            precision: 3,
            right: "right",
            top: "center",
            inRange: {
                color: RDBU11,
            },
            text: ['1', '-1'],
        },
        series: [
            {
                type: 'heatmap',
                data: data,
            }
        ]
    }

    return <Echarts
        echarts={echarts}
        option={options}
        style={{width: "600px", height: "550px"}}
    />
}

export default Heatmap;