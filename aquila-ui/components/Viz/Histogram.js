import {max, min} from "mathjs";
import ReactECharts from 'echarts-for-react';
import {titleOpts} from "components/Viz/config";

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


const Histogram = ({arr, title}) => {

    const {x, y} = histogram(arr, 10);

    const options = {
        ...titleOpts(title),
        xAxis: {
            type: 'category',
            data: x,
            scale: true
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: y,
                type: 'line',
                smooth: true
            }
        ]
    }

    return <ReactECharts
        option={options}
        opts={{locale: "EN"}}
        style={{width: '350px', height: '250px'}}
    />
}


export default Histogram;

