import max from "loadsh/max"
import min from "loadsh/min"
import {GRAD_COLORS, titleOpts, toolboxOpts, ThumbNailSize, axis3DOptions} from "./config";
import Echarts from "./echarts-obj";
import * as echarts from "echarts/core";
import {GridComponent, VisualMapContinuousComponent} from 'echarts/components';
import 'echarts-gl';

echarts.use([GridComponent, VisualMapContinuousComponent]);


export const ExpMap3DThumbNail  = ({cx, cy, cz, exp}) => {

    const min_exp = min(exp);
    const max_exp = max(exp);
    const dataSize = cx.length;

    const renderData = cx.map((x, i) => {
        return [x, cy[i], cz[i], exp[i]]
    });

    const option = {
        visualMap: {
            show: false,
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
        tooltip: {
            show: false
        },
        grid3D: {
            show: false,
            top: 'middle',
        },
        xAxis3D: {...axis3DOptions},
        yAxis3D: {...axis3DOptions},
        zAxis3D: {...axis3DOptions},
        series: [
            {
                type: "scatter3D",
                symbolSize: dataSize < 5000 ? 2 : ( dataSize < 10000 ? 1 : 0.5),
                data: renderData,
                silent: true,
            },
        ],
    }

     return (
        <Echarts echarts={echarts} option={option} style={{height: ThumbNailSize, width: ThumbNailSize}}/>
    )
}

export const ExpMap3D = ({cx, cy, cz, exp, markerName, symbolSize, canvasSize}) => {

    const min_exp = min(exp);
    const max_exp = max(exp);
    const dataSize = cx.length;

    const renderData = cx.map((x, i) => {
        return [x, cy[i], cz[i], exp[i]]
    });

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
        xAxis3D: {...axis3DOptions},
        yAxis3D: {...axis3DOptions},
        zAxis3D: {...axis3DOptions},
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