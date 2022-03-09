import ReactEChartsCore from 'echarts-for-react/lib/core';

// The bundle analyzer suggest bundle size gain larger when loading separately
// Don't know why
// import ReactECharts from "echarts-for-react";

const Echarts = ({echarts, ...props}) => {
    return <ReactEChartsCore
        echarts={echarts}
        opts={{locale: "EN"}}
        {...props}/>
}

export default Echarts;
