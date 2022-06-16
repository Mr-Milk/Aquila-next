export const ThumbNailSize = 150;

export const GRAD_COLORS = [
    "#ECDBBD",
    "#E8C4A4",
    "#E5AC93",
    "#E19488",
    "#D87C82",
    "#CC6680",
    "#B9537E",
    "#A2437C",
    "#863576",
    "#68296B",
    "#49205A",
    "#2C1641",
    "#130C23",
    "#000000",
];

export const RDBU11 = ['#053061',
    '#195696',
    '#2f79b5',
    '#4c99c6',
    '#87beda',
    '#b6d7e8',
    '#dbeaf2',
    '#f7f6f6',
    '#fbe3d4',
    '#f9c4a9',
    '#f09c7b',
    '#da6853',
    '#c13639',
    '#9c1127',
    '#67001f']

export const Greens = ['#f7fcf5',
    '#edf8e9',
    '#e1f3dc',
    '#d0edca',
    '#bce4b5',
    '#a7dba0',
    '#8ed08b',
    '#73c476',
    '#56b567',
    '#3da65a',
    '#2c944c',
    '#18823d',
    '#05712f',
    '#005b25',
    '#00441b']

export const CAT_COLORS = [
    "#5470c6",
    "#91cc75",
    "#fac858",
    "#ee6666",
    "#73c0de",
    "#3ba272",
    "#fc8452",
    "#9a60b4",
    "#ea7ccc",
    "#c1232b",
    "#27727b",
    "#fcce10",
    "#e87c25",
    "#b5c334",
    "#fe8463",
    "#9bca63",
    "#fad860",
    "#f3a43b",
    "#60c0dd",
    "#d7504b",
    "#c6e579",
    "#f4e001",
    "#f0805a",
    "#26c0c0"]

export const titleOpts = (title) => ({
    title: {
        text: title,
        left: "center",
        top: "top",
        textStyle: {
            fontSize: 14,
        },
    }
})

export const tooltipOpts = () => ({
    tooltip: {
        trigger: 'item',
        formatter: "{c}",
    }
})

export const toolboxOpts = {
    toolbox: {
        itemSize: 13,
        right: '25%',
        feature: {
            saveAsImage: {
                show: true,
                title: 'Save',
            },
        },
    },
}

export const legendOpts = (data) => ({
    legend: {
        data: data,
        orient: "vertical",
        right: "right",
        top: "center",
        itemHeight: 8,
        itemWidth: 8,
        textStyle: {
            fontSize: 8,
        },
    },
})

export const axis3DOptions = {
        axisTick: {show: false},
        splitLine: {show: false},
        axisPointer: {show: false},
        axisLabel: {show: false}
    }