import ReactECharts from 'echarts-for-react';
import {legendOpts, titleOpts} from "@components/Viz/config";
import natsort from "natsort";

const Counter = (arr) => {
    const counts = {};
    arr.forEach((i) => {counts[i] = counts[i] ? counts[i] + 1 : 1;})
    return Object.entries(counts).map(([k, v]) => {
        return {name: k, value: v}
    });
}

const Pie = ({arr, width, height, title}) => {

    width = width || '350px';
    height = height || '250px';

    const data = Counter(arr);
    const legendData = data.map((i) => i.name).sort(natsort());

    const options = {
        ...titleOpts(title),
        tooltip: {
            trigger: 'item'
        },
        legend: {
            data: legendData,
            bottom: '5%',
            left: 'center',
            itemHeight: 8,
            itemWidth: 8,
            textStyle: {
                fontSize: 8,
            },
        },
        series: [
            {
                type: 'pie',
                roseType: 'area',
                radius: '75%',
                itemStyle: {
                    borderRadius: 8
                },
                label: {
                    show: false,
                    position: 'center',
                },
                data: data,
            }
        ]
    }

    return <ReactECharts
        option={options}
        opts={{ locale: "EN" }}
        style={{ width: width, height: height}}
    />
}

export default Pie;