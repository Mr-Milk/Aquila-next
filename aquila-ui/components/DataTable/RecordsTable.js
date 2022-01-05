import MUIDataTable from "mui-datatables";
import IconButton from "@mui/material/IconButton";
import Launch from "@mui/icons-material/Launch";
import LibraryBooksOutlined from "@mui/icons-material/LibraryBooksOutlined";
import {useMemo} from "react";

const createColumns = (name, label) => {
    return {
        name: name,
        label: label,
        options: {
            filter: true,
            sort: true,
        }}
}

const DataTable = ({ data }) => {

    data.map((d) => {
        d.download = `/static/${d.data_uuid}`;
        d.published = `${d.journal}, ${d.year}`;
    })

    const columns = useMemo(() => [
        createColumns('technology', 'Technology'),
        createColumns('species', 'Species'),
        createColumns('tissue', 'Tissue'),
        createColumns('disease', 'Disease'),
        createColumns('molecule', 'Molecule'),
        {
            name: 'cell_count',
            label: 'Data Size',
            options: {
                filter: false,
                sort: true,
            }},
        {
            name: 'published',
            label: 'Journal',
            options: {
                filter: false,
                sort: true,
            }},
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
            name: "data_uuid",
            label: "Details",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value) => {
                    return (
                        <IconButton
                            color="primary"
                            href={`/view/${value}`}
                            target="_blank"
                            rel="noreferrer noopener"
                        >
                            <Launch/>
                        </IconButton>
                    );
                },
            },
        },
    ], [])

    const hints = {
        'cell_count': 'Number of cells/dots',
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
                    return (hints[column.name] != undefined) ? hints[column.name] : column.label
                }
            }
        }
    }
    if (typeof window !== "undefined") {
        return (
            <MUIDataTable
                title="All Data"
                data={data}
                columns={columns}
                options={options}
            />
        );
    } else {
        return <></>
    }

}

export default DataTable;