import axios from 'axios';

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
