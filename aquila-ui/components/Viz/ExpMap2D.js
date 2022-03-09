import Echarts from "./echarts-obj";
import {ResponsiveSize, ResponsiveSymbolSize} from "components/Viz/ResponsiveSize";
import {color_pool, titleOpts} from "components/Viz/config";


import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {ScatterChart} from 'echarts/charts';
import { GridComponent,
    LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent,
    VisualMapComponent,
    VisualMapContinuousComponent,
} from 'echarts/components';

echarts.use([
    CanvasRenderer,
    ScatterChart,
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

const ExpMap = ({cx, cy, exp, markerName, ...leftProps}) => {

    const min_exp = Math.min(...exp);
    const max_exp = Math.max(...exp);
    const size = cx.length;
    const canvasSize = ResponsiveSize(size);
    const symbolSize = ResponsiveSymbolSize(size);

    const renderData = cx.map((x, i) => {
        return [x, cy[i], exp[i]]
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
                color: color_pool,
            },
            text: [Math.round(max_exp), Math.round(min_exp)],
        },
        grid: {
            top: 'middle',
            width: 450,
            height: 450,
            containLabel: true,
        },
        xAxis: {show: false},
        yAxis: {show: false},
        series: [
            {
                type: "scatter",
                animation: false,
                symbolSize: symbolSize,
                data: renderData,
                // links: [],
            },
        ],
    };

    return (
        <Echarts echarts={echarts} option={options} style={{height: 500, width: 500}}/>
    )
}

export default ExpMap;