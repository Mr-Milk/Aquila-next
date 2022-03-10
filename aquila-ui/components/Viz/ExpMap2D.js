import Echarts from "./echarts-obj";
import {GRAD_COLORS, titleOpts} from "components/Viz/config";


import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {ScatterChart} from 'echarts/charts';
import {
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    ToolboxComponent,
    TooltipComponent,
    VisualMapComponent,
    VisualMapContinuousComponent,
} from 'echarts/components';

echarts.use([
    CanvasRenderer,
    ScatterChart,
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    TitleComponent,
    TooltipComponent,
    ToolboxComponent,
    VisualMapComponent,
    VisualMapContinuousComponent
])

const AssignColor = (colors, arr, min, max) => {
    const cut = colors.length;
    const range = max - min;
    const bin = range / cut;
    let ranges = {};
    let start = min;
    colors.map((c) => {
        ranges[c] = [start, start + bin];
        start += bin;
    });

    return arr.map((a) => {
        if (a === max) {
            return colors.slice(-1)[0];
        } else {
            for (let i = 0; i < cut; i++) {
                let c = colors[i];
                let r = ranges[c];
                if (a >= r[0] && a < r[1]) {
                    return c;
                }
            }
        }
    });
};

const ExpMap2D = ({cx, cy, exp, markerName, symbolSize, canvasSize, ...leftProps}) => {

    const min_exp = Math.min(...exp);
    const max_exp = Math.max(...exp);

    const renderData = exp.map((e, i) => {
        return [cx[i], cy[i], e]
    });

    const options = {
        ...titleOpts(`Expression of ${markerName}`),
        visualMap: {
            min: min_exp,
            max: max_exp,
            precision: 3,
            calculable: false,
            left: 20,
            top: "middle",
            inRange: {
                color: GRAD_COLORS,
            },
            text: [Math.round(max_exp), Math.round(min_exp)],
        },
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0]
            },
            {
                type: 'inside',
                yAxisIndex: [0],
            },
        ],
        grid: {
            top: 'middle',
            width: canvasSize,
            height: canvasSize,
            containLabel: true,
        },
        xAxis: {show: false},
        yAxis: {show: false},
        series: [
            {
                type: "scatter",
                symbolSize: symbolSize,
                data: renderData,
                itemStyle: {
                    borderColor: '#555',
                    borderWidth: 0.5
                },
            },
        ],
    };

    return (
        <Echarts echarts={echarts} option={options} style={{height: canvasSize + 100, width: canvasSize + 100}}/>
    )
}

export default ExpMap2D;