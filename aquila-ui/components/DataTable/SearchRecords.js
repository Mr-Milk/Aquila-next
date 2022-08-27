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
import {IconBase} from "react-icons";
import IconButton from "@mui/material/IconButton";

const methodTips = {
    "fuzz": {
        name: "Keywords",
        tip: "Search keywords..."
    },
    "marker": {
        name: "Markers",
        tip: "Search protein/gene name..."
    },
    "markerID": {
        name: "Gene ID",
        tip: "Ensembl, NCBI, Entrez, etc..."
    }
}

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

    const runGeneIDSearch = (inputID) => {
        startTransition(() => {
            if (inputID.length > 0) {
                axios.get(`https://mygene.info/v3/query?q=${inputID}`).then((res) => {
                    let data = res.data;
                    if (data.total === 0) {
                        updateDataFn([])
                    } else {
                        runMarkerSearch(data.hits[0].symbol)
                    }
                })
            } else {
                updateDataFn(data)
            }
        })
    }

    const methodExec = (method, ...args) => {

        switch (method) {
            case "fuzz":
                runSearch(...args)
                break;
            case "marker":
                runMarkerSearch(...args)
                break;
            case "markerID":
                runGeneIDSearch(...args)
                break;
        }
    }

    return <Stack direction="row" alignItems="center" sx={{width: '100%'}}>

        <Button
            size="large"
            endIcon={<ExpandMoreIcon/>}
            sx={{
                mr: 1, my: 0.5,
                textTransform: 'none', color: 'action.active',
                minWidth: "110px",
        }}
            onClick={handleClick}
        >
            {methodTips[searchMethod].name}
        </Button>
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => setAnchorEl(null)}
        >
            <MenuItem onClick={() => {
                setAnchorEl(null);
                setSearchMethod("fuzz")
            }}>Search Keywords</MenuItem>
            <MenuItem onClick={() => {
                setAnchorEl(null);
                setSearchMethod("marker")
            }}>Search Markers</MenuItem>
            <MenuItem onClick={() => {
                setAnchorEl(null);
                setSearchMethod("markerID")
            }}>Search Gene ID</MenuItem>
        </Menu>

        {/*<Search sx={{color: 'action.active', mr: 1, my: 0.5}}/>*/}
        <TextField fullWidth
                   size="medium"
                   variant="standard"
                   sx={{minWidth: '400px'}}
                   placeholder={methodTips[searchMethod].tip}
                   // onChange={(e) => {
                   //     methodExec(searchMethod, e.target.value)
                   //     //(searchMethod === "fuzz") ? runSearch(e.target.value) : runMarkerSearch(e.target.value)
                   // }}
                   onKeyUp={(e) => {
                       if (e.key === "Enter") {
                           methodExec(searchMethod, e.target.value)
                       }
                   }
                   }
        />
        <IconButton color="secondary">
            <Search/>
        </IconButton>
    </Stack>
}

export default SearchRecords;