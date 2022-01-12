import {titleOpts} from "components/Viz/config";
import Echarts from "./echarts-obj";

const BarChart = ({x, y, width, height, title}) => {

    const options = {
        ...titleOpts(title),
        tooltip: {
            trigger: 'item',
        },
        grid: {
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: x,
            splitNumber: x.length,
            axisTick: {
                alignWithLabel: true,
            },
            axisLabel: {
                interval: 0,
                rotate: 45,
                fontSize: 10,
            },
            nameRotate: 30,
            nameGap: 30,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: y,
                type: 'bar',
            }
        ]
    }

    return <Echarts
        option={options}
        opts={{locale: "EN"}}
        style={{width: width, height: height}}
    />
}

export default BarChart;