import ReactECharts from "echarts-for-react";
import {rdbu11, titleOpts} from "components/Viz/config";

const Heatmap = ({data, xlabel, ylabel, title, width, height}) => {

    const options = {
        ...titleOpts(title),
        grid: {
            left: "5%",
            right: "10%",
            containLabel: true,
        },
        xAxis: {
            type: 'category',
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
                fontSize: 8,
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
                fontSize: 8,
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
                color: rdbu11,
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

    return <ReactECharts
        option={options}
        opts={{locale: "EN"}}
        style={{width: width, height: height}}
    />
}

export default Heatmap;