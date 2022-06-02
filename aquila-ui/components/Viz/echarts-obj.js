import ReactEChartsCore from 'echarts-for-react/lib/core';
import {forwardRef} from "react";

// The bundle analyzer suggest bundle size gain larger when loading separately
// Don't know why
// import ReactECharts from "echarts-for-react";

const Echarts = forwardRef(function Echarts(props, ref) {
    return <ReactEChartsCore
        opts={{locale: "EN"}}
        ref={ref}
        {...props}/>
});

export default Echarts;
