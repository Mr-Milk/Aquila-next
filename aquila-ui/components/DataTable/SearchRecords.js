import Search from "@mui/icons-material/Search";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Fuse from 'fuse.js';
import {startTransition} from "react";

const SearchRecords = ({data, updateDataFn}) => {

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
        ]
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

    return <>
        <Search sx={{color: 'action.active', mr: 1, my: 0.5}}/>
        <TextField fullWidth
                   variant="standard"
                   placeholder="Search technology, disease, species, ..."
                   sx={{maxWidth: 'md'}}
                   onChange={(e) => {
                       runSearch(e.target.value)
                   }}
        />
    </>
}

export default SearchRecords;