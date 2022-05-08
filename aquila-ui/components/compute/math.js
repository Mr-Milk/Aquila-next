import {louvainAsync, iLouvainAsync, labelPropagationAsync} from '@antv/algorithm';

export const counter = (arr) => {
    const counts = {};
    arr.forEach((i) => {
        counts[i] = counts[i] ? counts[i] + 1 : 1;
    })
    return Object.entries(counts).map(([k, v]) => {
        return {name: k, value: v}
    });
}

export function Counter(array) {
    array.forEach(val => this[val] = (this[val] || 0) + 1);
}