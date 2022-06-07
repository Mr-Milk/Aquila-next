import Search from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Fuse from 'fuse.js';
import {startTransition, useState} from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import {getDataIdbyMarkerURL} from "../../data/get";

const SearchRecords = ({data, updateDataFn}) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [searchMethod, setSearchMethod] = useState("fuzz");
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const fuse = new Fuse(data, {
        keys: [
            'species',
            'technology',
            'disease',
            'disease_details',
            'tissue',
            'organ',
            'molecule',
            'source_name',
            'journal',
            'year'
        ],
        threshold: 0.2
    })

    const runSearch = (keyword) => {
        startTransition(() => {
            if (keyword.length > 0) {
                const result = fuse.search(keyword).map((r) => {
                    return r.item
                });
                updateDataFn(result)
            } else {
                updateDataFn(data)
            }
        })

    }

    const runMarkerSearch = (marker) => {
        startTransition(() => {
            if (marker.length > 0) {
                axios.get(`${getDataIdbyMarkerURL}/${marker}`).then((res) => {
                    const dataList = res.data;
                    const result = data.filter((d) => dataList.includes(d.data_uuid));
                    updateDataFn(result)
                })
            } else {
                updateDataFn(data)
            }
        })
    }

    return <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
        <Button
            startIcon={<Search/>}
            endIcon={<ExpandMoreIcon/>}
            sx={{mr: 1, my: 0.5, textTransform: 'none', color: 'action.active'}}
            onClick={handleClick}
        >
            {(searchMethod === "fuzz") ? 'Keywords' : 'Markers'}
        </Button>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
        >
            <MenuItem onClick={() => {setAnchorEl(null); setSearchMethod("fuzz")}}>Search Keywords</MenuItem>
            <MenuItem onClick={() => {setAnchorEl(null); setSearchMethod("marker")}}>Search Markers</MenuItem>
        </Menu>
        {/*<Search sx={{color: 'action.active', mr: 1, my: 0.5}}/>*/}
        <TextField fullWidth
                   variant="standard"
                   sx={{ minWidth: '400px' }}
                   placeholder={(searchMethod === "fuzz") ? "Any keywords..." : "Markers/Genes..."}
                   onChange={(e) => {
                       (searchMethod === "fuzz") ? runSearch(e.target.value) : runMarkerSearch(e.target.value)
                   }}
        />
    </Stack>
}

export default SearchRecords;