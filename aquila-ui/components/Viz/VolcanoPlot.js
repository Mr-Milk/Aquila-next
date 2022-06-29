import {toolboxOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {ScatterChart} from 'echarts/charts';
import {GridComponent, ToolboxComponent, TooltipComponent} from 'echarts/components';

echarts.use([
    CanvasRenderer,
    GridComponent,
    ScatterChart,
    TooltipComponent,
    ToolboxComponent
])

const VolcanoPlot = ({x, y, label, xrange = [-1, 1], yrange = [0, 1], xtitle, ytitle, xthresh, ythresh}) => {

    const plotData = x.map((vx, i) => {
        let vy = y[i];
        let color;
        if (vx > xthresh) {
            color = '#CB1B45'
        } else if (vx < -xthresh) {
            color = "#211E55"
        } else {
            color = "#ccc"
        }
        if (vy < ythresh) {
            color = "#ccc"
        }
        return {
            value: [vx, vy],
            name: label[i],
            itemStyle: {
                color: color
            }
        }
    })

    const options = {
        ...toolboxOpts,
        xAxis: {
            name: xtitle,
            nameLocation: 'center',
            nameGap: 20,
            min: xrange[0],
            max: xrange[1]
        },
        yAxis: {
            name: ytitle,
            min: yrange[0],
            max: yrange[1]
        },
        tooltip: {
            formatter: '{b} {c0}'
        },
        series: [{
            type: 'scatter',
            colorBy: 'data',
            data: plotData,
            symbolSize: 10,
            label: {
                show: false,
                formatter: "{b}",
                fontSize: 11,
            },
        }]

    }

    return <Echarts
        echarts={echarts}
        option={options}
        style={{width: 600, height: 600}}
    />
}

export default VolcanoPlot;