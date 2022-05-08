import {titleOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

import * as echarts from 'echarts/core';
import {CanvasRenderer} from 'echarts/renderers';
import {LineChart} from 'echarts/charts';
import {GridComponent, TitleComponent, TooltipComponent,} from 'echarts/components';

import max from "loadsh/max"
import min from "loadsh/min"

echarts.use([
    CanvasRenderer,
    GridComponent,
    LineChart,
    TitleComponent,
    TooltipComponent,
])

// histogram([100, 101, 102, 230, 304, 305, 400], 3) === [3, 1, 3];
function histogram(arr, binCnt) {
    binCnt = binCnt || 4;
    const first = min(arr);
    const binWidth = (max(arr) - first) / binCnt;
    const len = arr.length;
    const bins = [];
    const interval = [];
    let i;

    for (i = 0; i < binCnt; i++) {
        bins.push(0);
        interval.push(Math.round(first + binWidth * i));
    }

    for (i = 0; i < len; i++) {
        bins[Math.min(Math.floor(((arr[i] - first) / binWidth)), binCnt - 1)] += 1;
    }
    return {
        x: interval,
        y: bins,
    };
}


const ExpDist = ({arr, title}) => {

    const {x, y} = histogram(arr, 10);

    const options = {
        ...titleOpts(title),
        xAxis: {
            name: 'Expression',
            nameLocation: 'middle',
            nameGap: 20,
            type: 'category',
            data: x,
            scale: true
        },
        yAxis: {
            name: 'Cell\nCount',
            nameLocation: 'end',
            nameGap: 10,
            nameTextStyle: {
                align: 'right'
            },
            type: 'value',
            label: {
                show: false
            }
        },
        grid: {
            top: '20%',
            bottom: '10%',
            left: '3%',
            right: '5%',
            containLabel: true
        },
        series: [
            {
                data: y,
                type: 'line',
                smooth: true
            }
        ]
    }

    return <Echarts
        echarts={echarts}
        option={options}
        style={{width: '300px', height: '180px'}}
    />
}


export default ExpDist;

