import Dexie from 'dexie';

export const db = new Dexie('aquilaAnalysisDatabase');

db.version(1).stores({
    "DataRecords": "++id, data_id",  // data_id, created_time
    "ROIInfo": "data_id, roi_id", // data_id, roi_id, meta
    "CellInfo": "roi_id", // data_id, roi_id, cell_x, cell_y, cell_type
    "CellExp": "roi_id, marker" // roi_id, marker, expression
})