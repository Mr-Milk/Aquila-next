import axios from 'axios';
import useSWR from "swr";
import {memo, useCallback} from "react";

export const fetcher = async url => {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (e) {
        console.log(e);
    }
}
const root = process.env.NEXT_PUBLIC_API_URL;
export const getDbStatsURL = `${root}/dbstats`;
export const getDataIdURL = `${root}/data_ids`;
export const getOneRecordURL = `${root}/record`;
export const getRecordsURL = `${root}/records`;
export const getOneROIURL = `${root}/roi`;
export const getROIMetaURL = `${root}/rois`;
export const getCellInfoURL = `${root}/cell_info`;
export const getCellExpURL = `${root}/cell_exp`;


export const useDataInfo = (dataID) => {
    const { data, error } = useSWR(`${getOneRecordURL}/${dataID}`, fetcher)
    const fallback = {
        data_uuid: "",
        technology: "",
        species: "",
        tissue: "",
        disease: "",
        molecule: "",
        markers: [""],
        source_name: "",
        source_url: "",
        journal: "",
        year: "",
        cell_count: "",
        marker_count: "",
        roi_count: "",
        is_single_cell: false,
        has_cell_type: false,
    }

    return {
        data: !data ? fallback : data,
        error: error,
    }
}


export const useROIMeta = (dataID) => {
    const { data, error } = useSWR(`${getROIMetaURL}/${dataID}`, fetcher)
    const fallback = [{"roi_id":"7fe9d30f-7047-44b2-acc3-f201c7d46ef8",
        "data_uuid":"f909c60ddb489858fb8b569456fb90a8",
        "meta":"{\"Field of View\": 0, \"data_uuid\": \"f909c60ddb489858fb8b569456fb90a8\", \"roi_id\": \"7fe9d30f-7047-44b2-acc3-f201c7d46ef8\"}"
    },]

    return {
        data: !data ? fallback : data,
        error: error,
    }
}


export const useCellData = (roiID) => {
    const { data, error } = useSWR(`${getCellInfoURL}/${roiID}`, fetcher, {
        revalidateOnFocus: false
    })
    const fallback = {
        cell_x: [0.0, 0.1],
        cell_y: [0.0, 0.1],
        cell_type: ['a', 'b']
    }

    return {
        data: !data ? fallback : data,
        error: error,
    }
}


export const useExpData = (roiID, marker) => {
    const { data, error } = useSWR(`${getCellExpURL}/${roiID}/${marker}`, fetcher, {
        revalidateOnFocus: false
    })
    const fallback = {
        expression: [10.0, 20.0]
    }

    return {
        data: !data ? fallback : data,
        error: error,
    }
}


// export const useExpDataAll = ( roiID ) => {
//
//     const { data, error } = useSWR(`${getCellExpURL}/${roiID}`, fetcher, {
//         revalidateOnFocus: false
//     })
//     const fallback = {
//         markers: ["", ""],
//         expression: [[10.0, 20.0]]
//     }
//
//     return {
//         data: !data ? fallback : data,
//         error: error,
//     }
// }
