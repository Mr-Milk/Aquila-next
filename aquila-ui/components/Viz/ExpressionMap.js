import ReactECharts from 'echarts-for-react';
import {max, min, round} from "mathjs";
import {ResponsiveSize, ResponsiveSymbolSize} from "@/components/Viz/ResponsiveSize";
import {color_pool, titleOpts} from "@/components/Viz/config";

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

    const min_exp = min(exp);
    const max_exp = max(exp);
    const colors = AssignColor(color_pool, exp);
    const size = cx.length;
    const canvasSize = ResponsiveSize(size);
    const symbolSize = ResponsiveSymbolSize(size);

    const RenderData = cx.map((x, i) => {
        return {
            x: x,
            y: cy[i],
            value: exp[i],
            itemStyle: {
                color: colors[i],
            }
        }
    });

    const options = {
        ...titleOpts(`Expression of ${markerName}`),
        visualMap: {
            min: min_exp,
            max: max_exp,
            precision: 3,
            calculable: false,
            right: "right",
            top: "center",
            inRange: {
                color: color_pool,
            },
            text: [round(max_exp, 0), round(min_exp, 0)],
        },
        series: [
            {
                type: "graph",
                layout: "none",
                animation: false,
                symbolSize: symbolSize,
                data: RenderData,
                // links: [],
            },
        ],
    };

    return (
        <ReactECharts option={options} opts={{locale: "EN"}} style={canvasSize}/>
    )
}

export default ExpMap;