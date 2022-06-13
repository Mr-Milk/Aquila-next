import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import HelpOutline from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";
import {memo, useState} from "react";
import Typography from "@mui/material/Typography";
import MetaExample from "./MetaExample";
import Chip from "@mui/material/Chip";
import CellInfoExample from "./CellInfoExample";
import ExpExample from "./ExpExample";

//open, onClick, onClose,
const FileExampleHelper = ({title, sx, children,}) => {

    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton
                variant="contained"
                size="small"
                sx={sx}
                onClick={() => setOpen(!open)}
            >
                <HelpOutline/>
            </IconButton>

            <Dialog open={open} onClose={() => setOpen(!open)}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent sx={{mb: 2}}>
                    {children}
                </DialogContent>
            </Dialog>
        </>

    )
}

export const ROIFileExample = memo(function ROIFileExample() {
    return (
        <FileExampleHelper
            title={'ROI File Example'}
        >
            <Typography sx={{mb: 2, maxWidth: "300px"}}>
                Each line should annotate the ROI that a cell belongs to
            </Typography>
            <MetaExample/>
        </FileExampleHelper>
    )
})

export const CellInfoFileExample = memo(function CellInfoFileExample() {
    return (
        <FileExampleHelper
            title={'Cell Info File Example'}
        >
            <Typography sx={{mb: 2, maxWidth: "400px"}}>
                {`Must have following columns, if you are spatial transcriptome
                                data, you don't need to specify cell type. Remember the order 
                                must match exact as listed beneath.`}
            </Typography>
            <ul style={{lineHeight: "35px"}}>
                <li>Cell coordination X: <Chip label="Cell X" size='small'/></li>
                <li>Cell coordination Y: <Chip label="Cell Y" size='small'/></li>
                <li>Cell Type <i>(Optional)</i>: <Chip label="Cell Type" size='small'/></li>
            </ul>
            <CellInfoExample/>
        </FileExampleHelper>
    )
})

export const CellExpFileExample = memo(function CellExpFileExample() {
    return (
        <FileExampleHelper
            title={'Expression File Example'}
        >
            <Typography sx={{mb: 2, maxWidth: "300px"}}>
                Each column represents a marker, each line is a cell record
            </Typography>
            <ExpExample/>
        </FileExampleHelper>
    )
})