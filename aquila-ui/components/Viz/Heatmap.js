import {Greens, RDBU11, titleOpts, toolboxOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {HeatmapChart} from 'echarts/charts';
import {
    GridComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapContinuousComponent,
} from 'echarts/components';

echarts.use([
    CanvasRenderer,
    HeatmapChart,
    GridComponent,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    VisualMapContinuousComponent,
])

const cmap = {
    "RdBu": RDBU11,
    "Greens": Greens
}

const Heatmap = ({data, xlabel, ylabel, title, legendText, min, max, colors = "RdBu", width, height}) => {

    if (legendText === undefined) {
        let intMax = Number.isInteger(max)
        let intMin = Number.isInteger(min)
        legendText = [intMax ? max : max.toFixed(2), intMin ? min : min.toFixed(2)]
    }

    const options = {
        ...titleOpts(title),
        ...toolboxOpts,
        grid: {
            show: false,
            top: "5%",
            bottom: "5%",
            left: "5%",
            right: "10%",
            width: 'auto',
            height: 'auto',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            position: 'bottom',
            //data: xlabel,
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
                rotate: 90,
                fontSize: 12,
            },
            fontSize: 6,
        },
        yAxis: {
            type: 'category',
            //data: ylabel,
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
            min: min,
            max: max,
            precision: 3,
            right: "right",
            top: "center",
            inRange: {
                color: cmap[colors],
            },
            text: legendText,
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