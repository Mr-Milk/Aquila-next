import {startTransition, useState} from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import SortIcon from '@mui/icons-material/Sort';
import Tooltip from "@mui/material/Tooltip";


const sortMethods = [
    'Sort by Year',
    'Sort by Cell',
    'Sort by Marker',
    'Sort by ROI',
    'Sort by Publication'
]


const sortData = (data, method, order) => {
    if (method === 'Sort by Publication') {
        return (order) ?
            data.sort((a, b) => a.source_name.localeCompare(b.source_name)) :
            data.sort((a, b) => b.source_name.localeCompare(a.source_name))
    } else if (method === 'Sort by Year') {
        return (order) ?
            data.sort((a, b) => parseInt(a.year) - parseInt(b.year)) :
            data.sort((a, b) => parseInt(b.year) - parseInt(a.year))
    } else if (method === 'Sort by Cell') {
        return (order) ?
            data.sort((a, b) => a.cell_count - b.cell_count) :
            data.sort((a, b) => b.cell_count - a.cell_count)
    } else if (method === 'Sort by Marker') {
        return (order) ?
            data.sort((a, b) => a.marker_count - b.marker_count) :
            data.sort((a, b) => b.marker_count - a.marker_count)
    } else if (method === 'Sort by ROI') {
        return (order) ?
            data.sort((a, b) => a.roi_count - b.roi_count) :
            data.sort((a, b) => b.roi_count - a.roi_count)
    } else {
        return data
    }

}


const SortButton = ({displayData, updateDataFn}) => {

    const [sortMethod, setSortMethod] = useState('Sort by Paper');
    const [anchorEl, setAnchorEl] = useState(null);
    const [order, setOrder] = useState(false);

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleOrderClick = () => {
        setOrder(!order)
        startTransition(() => {
            updateDataFn([...displayData.reverse()])
        })
    }

    return (
        <Stack direction="row" alignItems="center" sx={{minWidth: "180px", md: {mb: 2}}}>

            <Button
                size="large"
                startIcon={<SortIcon/>}
                onClick={handleClick}
                color="secondary"
                sx={{textTransform: 'none'}}
            >
                {sortMethod}
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                {
                    sortMethods.map((m, i) => (
                        <MenuItem onClick={() => {
                            setAnchorEl(null);
                            setSortMethod(m)
                            startTransition(() => {
                                const sortedData = sortData(displayData, m, order);
                                updateDataFn([...sortedData])
                            })
                        }} key={i}>{m}</MenuItem>
                    ))
                }
            </Menu>

            <Tooltip title={order ? 'Current: Ascending' : 'Current: Descending'}>
            <IconButton
                size="large"
                color="secondary"
                onClick={handleOrderClick}
            >
                {order ? <ArrowUpwardIcon/> : <ArrowDownwardIcon/>}
            </IconButton>
                </Tooltip>
        </Stack>
    )
}

export default SortButton;