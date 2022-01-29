import MUIDataTable from "mui-datatables";
import useSWR from "swr";
import {fetcher, getROIMetaURL} from "data/get";
import {styled} from "@mui/material/styles";
import {useCallback, useMemo} from "react";


const ViewROIButton = styled('span')(({theme}) => ({
    color: theme.palette.primary.main,
    cursor: "pointer",
    '&:hover': {
        color: theme.palette.primary.light
    },
    textDecoration: "none"
}))


const ROITable = ({ roiMeta, updateFn }) => {

    const renderData = [];
    roiMeta.map((d) => {
        renderData.push(JSON.parse(d["meta"]));
    });

    const getColumns = useCallback((data) => {
        const columns = [];
        const header = (data === undefined) ? ['roi_id'] : Object.keys(JSON.parse(data[0]['meta']));
        header.map((h) => {
            if (h === "roi_id") {
                columns.push({
                    name: 'roi_id',
                    label: 'View ROI',
                    options: {
                        sort: false,
                        filter: false,
                        customBodyRender: (value) => {
                            return (
                                <ViewROIButton
                                    onClick={() => updateFn(value)}
                                    key={value}
                                >
                                    View
                                </ViewROIButton>
                            );
                        }
                    }
                })
            } else if (h === "data_uuid") {
            } else {
                columns.push({
                    name: h,
                    label: h.replace(/^\w/, (c) => c.toUpperCase()),
                    options: {
                        sort: true,
                        filter: true,
                    }
                });
            }
        });
        return columns;
    }, [updateFn]);

    const columns = useMemo(() => getColumns(roiMeta), [roiMeta, getColumns]);

    const options = {
        selectableRowsHideCheckboxes: true,
        viewColumns: false,
        print: false,
        elevation: 0,
        download: false,
        responsive: "standard",
        setTableProps: () => {
            return {
                // material ui v4 only
                size: 'small',
            };
        },
    };

    if (typeof window !== "undefined") {
        return (
            <MUIDataTable
                title="Select ROI"
                data={renderData}
                columns={columns}
                options={options}
            />
        );
    } else {
        return <></>
    }

}

export default ROITable;