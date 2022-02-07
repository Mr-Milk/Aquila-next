import Dexie from 'dexie';

export const db = new Dexie('aquilaAnalysisDatabase');

db.version(1).stores({
    DataRecords: "id, created_at",  // data_id, created_time
    ROIInfo: "++, data_uuid", // data_id, roi_id, meta
    CellInfo: "++, roi_id", // data_id, roi_id, cell_x, cell_y, cell_type
    CellExp: "++, [roi_id+marker]" // roi_id, marker, expression
})


const addOne = () => {
    const result = db.DataRecords.get("123")
    if (result === undefined) {
        db.DataRecords.add({id: "123", created_at: new Date().getTime()})
        db.DataRecords.add({id: "456", created_at: new Date().getTime()})

    }
}

addOne();
