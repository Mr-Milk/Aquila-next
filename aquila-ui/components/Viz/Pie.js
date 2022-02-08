import {titleOpts} from "components/Viz/config";
import natsort from "natsort";
import Echarts from "./echarts-obj";
import {counter} from "components/math";



const Pie = ({arr, width, height, title}) => {

    width = width || '350px';
    height = height || '250px';

    const data = counter(arr);
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

    return <Echarts
        option={options}
        style={{width: width, height: height}}
    />
}

export default Pie;