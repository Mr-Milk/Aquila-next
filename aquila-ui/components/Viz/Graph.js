import Echarts from "./echarts-obj";


const Graph = ({width, height}) => {

    const option = {}

    return <Echarts
        option={option}
        style={{width: width, height: height}}
    />
}