import {useLiveQuery} from "dexie-react-hooks";
import {db} from "db/schema";
import IconButton from "@mui/material/IconButton";
import OpenInNew from "@mui/icons-material/OpenInNew";
import Delete from "@mui/icons-material/Delete";
import {memo, useRef, useState} from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import TimeAgo from "react-timeago";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";


const Record = ({record, onClick}) => {
    return (
        <>
            <Chip label={record.id} sx={{mr: 1}}/>
            <Paper elevation={0} component="span" sx={{display: "inline-block", my: 1}}>

                <TimeAgo date={record.created_at}/>
                <IconButton
                    size="small"
                    target="_blank"
                    rel="noreferrer"
                    href={`/analysis/${record.id}`}
                    sx={{color: "#2D6D4B"}}
                >
                    <OpenInNew/>
                </IconButton>
                <IconButton
                    size="small"
                    sx={{color: "#CB4042"}}
                    onClick={onClick}>
                    <Delete/>
                </IconButton>
            </Paper>
        </>
    )
}


const LocalRecords = () => {

    const deleteID = useRef("");
    const [open, setOpen] = useState(false);
    const allID = useLiveQuery(() => db.DataRecords.orderBy('created_at').reverse().toArray())

    const deleteRecord = () => {
        setOpen(false)
        db.DataRecords.delete(deleteID.current)
        db.ROIInfo.where({data_uuid: deleteID.current}).delete()
        db.CellInfo.where({data_uuid: deleteID.current}).delete()
        db.CellExp.where({data_uuid: deleteID.current}).delete()
        deleteID.current = ""
    }

    return (
        <Box component="div" sx={{my: 2}}>
            {(allID?.length > 0) ? allID.map((record) =>

                <div key={record.id}>
                    <Record record={record} onClick={() => {
                        deleteID.current = record.id;
                        setOpen(true)
                    }}/></div>) : null}

            {(allID?.length === 0) ? <Alert severity="info" color="warning" sx={{maxWidth: "400px", mb: 4}}>
                No record is found. Start by trying out the example!
            </Alert> : null
            }


            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`You are going to delete record: ${deleteID.current}?`}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} autoFocus>
                        {"Don't delete"}
                    </Button>
                    <Button onClick={deleteRecord}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default memo(LocalRecords);