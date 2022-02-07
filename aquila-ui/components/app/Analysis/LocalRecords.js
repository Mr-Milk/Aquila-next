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
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";


const Record = ({ record, onClick }) => {
    return (
        <Box component="span" sx={{display: "inline-block"}}>
            <Typography component="span" variant="body1" sx={{
                textDecoration: "underline",
                fontStyle: "italic",
                mr: 1
            }}>
                {record.id}
            </Typography>
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

        </Box>
    )
}


const LocalRecords = () => {

    const deleteID = useRef("");
    const [open, setOpen] = useState(false);
    const allID = useLiveQuery(() => db.DataRecords.orderBy('created_at').reverse().toArray())

    console.log(allID)
    const deleteRecord = () => {
        db.DataRecords.delete(deleteID.current)
        deleteID.current = ""
        setOpen(false)
    }

    return (
        <>
            <ul>
                {(allID?.length > 0) ? allID.map((record) => <li key={record.id}>

                <Record record={record} onClick={() => {
                deleteID.current = record.id;
                setOpen(true)
            }}/>
                </li>) : <></>}
            </ul>
            {(allID?.length === 0) ? <Alert severity="info" color="warning" sx={{maxWidth: "400px", mb: 4 }}>
                    No record is found. Start by trying out the example!
            </Alert> : <></>
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
        </>
    )
}

export default memo(LocalRecords);