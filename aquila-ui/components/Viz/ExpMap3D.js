import max from "loadsh/max"
import min from "loadsh/min"
import {GRAD_COLORS, titleOpts, toolboxOpts} from "./config";
import Echarts from "./echarts-obj";
import 'echarts-gl';
import * as echarts from "echarts/core";
import {GridComponent, VisualMapComponent} from 'echarts/components';

echarts.use([GridComponent, VisualMapComponent]);


const ExpMap3D = ({cx, cy, cz, exp, markerName, symbolSize, canvasSize}) => {

    const min_exp = min(exp);
    const max_exp = max(exp);
    const size = cx.length;

    const renderData = cx.map((x, i) => {
        return [x, cy[i], cz[i], exp[i]]
    });

    const axisOptions = {
        axisTick: {show: false},
        splitLine: {show: false},
        axisPointer: {show: false},
        axisLabel: {show: false}
    }

    const option = {
        ...titleOpts(`Expression of ${markerName}`),
        ...toolboxOpts,
        visualMap: {
            min: min_exp,
            max: max_exp,
            precision: 3,
            calculable: false,
            left: '90%',
            right: 0,
            top: "middle",
            inRange: {
                color: GRAD_COLORS,
            },
            text: [Math.round(max_exp), Math.round(min_exp)],
        },
        grid3D: {
            top: 'middle',
        },
        xAxis3D: {...axisOptions},
        yAxis3D: {...axisOptions},
        zAxis3D: {...axisOptions},
        series: [
            {
                type: "scatter3D",
                symbolSize: symbolSize,
                data: renderData,
            },
        ],
    };

    return (
        <Echarts echarts={echarts} option={option} style={{height: canvasSize, width: canvasSize}}/>
    )
}

export default ExpMap3D;