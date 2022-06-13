import chroma from "chroma-js";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from '@mui/material/MenuItem';
import {memo, useState} from "react";


const Colormap = ({name}) => {

    const colors = chroma.scale(name).colors(50);

    return <div style={{width: '150px', height: '18px', whiteSpace: 'nowrap'}}>
        {
            colors.map((c) => (
                <span key={c} style={{
                    display: 'inline-block',
                    backgroundColor: c, width: '3px', height: '18px'
                }}></span>
            ))
        }
    </div>
}

const MemoColormap = memo(Colormap);


const CMaps = [
    // red color
    "Reds",
    // "OrRd",
    // "YlOrRd",
    "Oranges",
    // "YlOrBr",
    // blue
    "Blues",
    // "PuBu",
    // "YlGnBu",
    // "GnBu",
    // green
    "Greens",
    //  "BuGn",
    // "YlGn",
    // "PuBuGn",
    // purples
    "Purples",
    // "PuRd",
    // "RdPu",
    // "BuPu",
    // Others

    "Greys",
    // "Viridis",
]


const ColorMapSelect = ({onColorChange, color, options, ...props}) => {

    return <FormControl {...props}>
        <InputLabel variant="standard" htmlFor="uncontrolled-native">
            Colormap
        </InputLabel>
        <Select
            variant="standard"
            value={color}
            label="Colormap"
            onChange={(e) => {
                onColorChange(e.target.value)
            }}
        >
            {
                options.map((c) => (
                    <MenuItem value={c} key={c}>
                        <MemoColormap name={c}/>
                    </MenuItem>
                ))
            }
        </Select>
    </FormControl>
}

export default ColorMapSelect;