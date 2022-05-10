import {DataGrid, GridToolbar} from '@mui/x-data-grid';
import {useCallback, useMemo, useState} from "react";
import Button from "@mui/material/Button";
import {parseROIDisplay} from "../humanize";


const ROITable = ({roiMeta, updateFn}) => {

    const [pageSize, setPageSize] = useState(10);

    const renderData = [];
    roiMeta.map((d) => {
        renderData.push(JSON.parse(d["meta"]));
    });

    const getColumns = useCallback((data) => {
        let roiCol = []
        const columns = [];
        const header = (data === undefined) ? ['roi_id'] : Object.keys(JSON.parse(data[0]['meta']));
        header.map((h) => {
            if (h === "roi_id") {
                roiCol.push({
                    field: 'roi_id',
                    headerName: 'View ROI',
                    renderCell: (params) => {
                        const currentROIMeta = parseROIDisplay(params.row)
                        return (
                            <Button
                                size="small"
                                onClick={() => updateFn(params.value, currentROIMeta)} // update ROI_ID, ROI_META
                            >View</Button>
                        )
                    },
                })
            } else if (h === "data_uuid") {
            } else {
                columns.push({
                    field: h,
                    headerName: h.replace(/^\w/, (c) => c.toUpperCase()),
                });
            }
        });
        return [...roiCol, ...columns];
    }, [updateFn]);

    const columns = useMemo(() => getColumns(roiMeta), [roiMeta, getColumns]);


    return <DataGrid

        density="compact"
        sx={{
            border: 'none',
            height: '400px'
        }}
        rows={renderData}
        columns={columns}
        getRowId={(row) => row.roi_id}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 20, 50]}
        components={{
            Toolbar: GridToolbar,
        }}
    />

}

export default ROITable;