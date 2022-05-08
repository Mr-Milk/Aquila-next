import axios from 'axios';

export const runner = async (url, body) => {
    console.log(`POST: ${url}`)
    try {
        const res = await axios.post(url, body);
        return res.data
    } catch (e) {
        console.log(e);
    }
}


// export const runner = async (url, body) => {
//     console.log(`POST: ${url}`)
//     console.log(body)
//     const header = new Headers();
//     header.append("Content-Type", "application/json");
//
//     const requestOptions = {
//         method: 'POST',
//         headers: header,
//         body: JSON.stringify(body),
//         redirect: 'follow'
//     };
//
//     const res = await fetch(url, requestOptions);
//
//     return res.json();
// }


const root = process.env.NEXT_PUBLIC_API_URL;
const root2 = process.env.NEXT_PUBLIC_FASTAPI_URL;
export const runCellNeighbors = `${root}/cell_neighbors`;
export const runCellDistribution = `${root}/cell_distribution`;
export const runSpatialAutoCorr = `${root}/spatial_autocorr`;
export const runSpatialEntropy = `${root}/spatial_entropy`;
export const runEntropy = `${root}/entropy`;
export const runCellInterations = `${root}/cell_interactions`;
export const runCoexp = `${root}/coexp`;
export const runSpatialCoexp = `${root}/spatial_coexp`;

export const runSVGene = `${root2}/svgene`;
export const runRipley = `${root2}/ripley`;
export const runSpatailCommunity = `${root2}/community`;
export const runCentrality = `${root2}/centrality`;
