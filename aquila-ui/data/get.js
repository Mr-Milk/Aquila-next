import axios from 'axios';
import useSWR from "swr";
import {db} from "../db/schema";
import {useLiveQuery} from "dexie-react-hooks";

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


const DBStatsFallback = {
        data_count: 0,
        disease_count: 0,
        tissue_count: 0,
    }


export const useDBStats = () => {
    const { data, error } = useSWR(getDbStatsURL, fetcher)
    return {
        data: !data ? DBStatsFallback : data,
        error: error,
    }
}

const DataInfoFallback = {
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
        created_at: 123
    }

export const useDataInfo = (dataID) => {
    const { data, error } = useSWR(`${getOneRecordURL}/${dataID}`, fetcher)

    return {
        data: !data ? DataInfoFallback : data,
        error: error,
    }
}


export const useDataInfoDB = (dataID) => {
    console.log(dataID)
    if (!dataID) { dataID = "non-existing-keys"}
    console.log(dataID)
    const record = useLiveQuery(() => db.DataRecords.get(dataID), [dataID], {
        id: "key",
        created_at: 123123,
        cell_count: 213123,
        marker_count: 13123,
        markers: [""],
        has_cell_type: true,
        roi_count: 10,
    });

    const roi = useLiveQuery(() => db.ROIInfo.where({"data_uuid": dataID}).first(), [dataID], {
        roi_id: "key"
    })


    return {
        data_uuid: record.id,
        markers: record.markers,
        created_at: record.created_at,
        cell_count: record.cell_count,
        marker_count: record.marker_count,
        roi_count: record.roi_count,
        has_cell_type: record.has_cell_type,
        init_roi: roi.roi_id,
        init_marker: record.markers[0]
    }
}


const ROIMetaFallback = [{"roi_id":"7fe9d30f-7047-44b2-acc3-f201c7d46ef8",
        "data_uuid":"f909c60ddb489858fb8b569456fb90a8",
        "meta":"{\"Field of View\": 0, \"data_uuid\": \"f909c60ddb489858fb8b569456fb90a8\", \"roi_id\": \"7fe9d30f-7047-44b2-acc3-f201c7d46ef8\"}"
    },]


export const useROIMeta = (dataID) => {
    const { data, error } = useSWR(`${getROIMetaURL}/${dataID}`, fetcher)
    return {
        data: !data ? ROIMetaFallback : data,
        error: error,
    }
}


export const useROIMetaDB = (dataID) => {
    if (!dataID) { dataID = "non-existing-keys"}
    return useLiveQuery(() => db.ROIInfo.where("data_uuid").equals(dataID).toArray(),
        [dataID], ROIMetaFallback)
}


const CellDataFallback = {
        cell_x: [0.0, 0.1],
        cell_y: [0.0, 0.1],
        cell_type: ['a', 'b']
    }


export const useCellData = (roiID) => {
    const { data, error } = useSWR(`${getCellInfoURL}/${roiID}`, fetcher, {
        revalidateOnFocus: false
    })

    return {
        data: !data ? CellDataFallback : data,
        error: error,
    }
}


export const useCellDataDB = (roiID) => {
    console.log(roiID)
    const data = useLiveQuery(() => db.CellInfo.where({"roi_id": roiID}).first(), [roiID], CellDataFallback)
    return data ? data : CellDataFallback;
}


const ExpFallback = {
    data_uuid: "",
    marker: "",
    roi_id: "",
    expression: [10.0, 20.0]
}


export const useExpData = (roiID, marker) => {
    const { data, error } = useSWR(`${getCellExpURL}/${roiID}/${marker}`, fetcher, {
        revalidateOnFocus: false
    })

    return {
        data: !data ? ExpFallback : data,
        error: error,
    }
}

export const useExpDataDB = (roiID, marker) => {
    return useLiveQuery(() => db.CellExp.where({roi_id: roiID, marker}).first(), [roiID, marker],
        ExpFallback)
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
