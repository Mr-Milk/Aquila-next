import MUIDataTable from "mui-datatables";
import IconButton from "@mui/material/IconButton";
import Launch from "@mui/icons-material/Launch";
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import LibraryBooksOutlined from "@mui/icons-material/LibraryBooksOutlined";
import {useMemo} from "react";

const createColumns = (name, label) => {
    return {
        name: name,
        label: label,
        options: {
            filter: true,
            sort: true,
        }
    }
}

const DataTable = ({data}) => {

    data.map((d) => {
        d.download = `/static/${d.data_uuid}`;
        d.published = `${d.journal}, ${d.year}`;
        d.dimension = (d.is_3d ? `3D, ${d.cell_count}×${d.marker_count}` : `2D, ${d.cell_count}×${d.marker_count}`);
        d.view = {
            id: d.data_uuid,
            is3D: d.is_3d
        }
    })

    const columns = useMemo(() => [
        createColumns('technology', 'Technology'),
        createColumns('species', 'Species'),
        createColumns('tissue', 'Tissue'),
        createColumns('disease', 'Disease'),
        createColumns('molecule', 'Molecule'),
        {
            name: 'dimension',
            label: 'Dimension',
            options: {
                filter: false,
                sort: true,
            }
        },
        {
            name: 'published',
            label: 'Journal',
            options: {
                filter: false,
                sort: true,
            }
        },
        {
            name: "source_url",
            label: "Publication",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <IconButton
                            color="primary"
                            href={`${value}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <LibraryBooksOutlined/>
                        </IconButton>
                    );
                },
            },
        },
        {
            name: "view",
            label: "Details",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    const link = value.is3D ? `/view3d/${value.id}` : `/view/${value.id}`
                    return (
                        <IconButton
                            color="primary"
                            href={link}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            {value.is3D ? <ThreeDRotationIcon/> : <Launch/>}
                        </IconButton>
                    );
                },
            },
        },
    ], [])

    const hints = {
        'dimension': 'Cell × Gene',
    }

    const options = {
        selectableRowsHideCheckboxes: true,
        viewColumns: false,
        print: false,
        download: false,
        responsive: "standard",
        tableBodyHeight: "50%",
        elevation: 0,
        sortOrder: {
            name: 'year',
            direction: 'desc',
        },
        textLabels: {
            body: {
                columnHeaderTooltip: column => {
                    return (hints[column.name] !== undefined) ? hints[column.name] : column.label
                }
            }
        }
    }
    return (
        <MUIDataTable
            title="All Data"
            data={data}
            columns={columns}
            options={options}
        />
    );
}

export default DataTable;