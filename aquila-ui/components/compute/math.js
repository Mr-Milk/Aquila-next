export const counter = (arr) => {
    const counts = {};
    arr.forEach((i) => {
        counts[i] = counts[i] ? counts[i] + 1 : 1;
    })
    return Object.entries(counts).map(([k, v]) => {
        return {name: k, value: v}
    });
}