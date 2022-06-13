import {useLiveQuery} from "dexie-react-hooks";
import {db} from "db/schema";
import {memo, useRef, useState} from "react";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from "@mui/material/Button";
import TimeAgo from "react-timeago";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {StatsText} from "../../DataTable/Cards";
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import DialogContent from "@mui/material/DialogContent";
import Grid from "@mui/material/Grid";


const Record = ({record, onDelete}) => {

    const time = new Date(record.created_at);
    const displayTime = `${time.toDateString()}, ${time.toLocaleTimeString()}`

    return (
        <Box sx={{
            p: 2,
            my: 2,
            border: 1,
            borderLeft: 6,
            borderColor: 'primary.main',
            borderRadius: 1,
            // display: 'flex',
            // alignItems: 'center',
            // justifyContent: 'space-between'
        }}>
            <div>
                <Grid container direction="row" alignItems="center" justifyContent="space-between" spacing={1}>

                    <Grid item>
                        <Typography variant="h5" fontWeight="500">{record.id}</Typography>
                    </Grid>

                    <Grid item>
                        <Grid container spacing={1} justifyContent="flex-start">
                            <Grid item>
                                <Typography variant="subtitle2" fontWeight="400"
                                            fontStyle="italic">{displayTime}{" "}</Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle2" fontWeight="400" fontStyle="italic" color="#757575">
                                    <TimeAgo date={record.created_at}/>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>


                </Grid>
                <Stack direction="row" justifyContent="space-between" sx={{my: 2}}>
                    <StatsText count={record.cell_count} unit={'Cells'}/>
                    <StatsText count={record.marker_count} unit={'Markers'}/>
                    <StatsText count={record.roi_count} unit={record.roi_count === 1 ? 'ROI' : 'ROIs'}/>
                </Stack>


            </div>
            <Stack direction="row" spacing={2} alignItems="space-around" sx={{mt: 2}}>
                <Button
                    variant="outlined"
                    disableElevation
                    target="_blank"
                    rel="noreferrer"
                    href={`/analysis/${record.id}`}
                    color="success"
                    sx={{textTransform: 'none'}}
                    startIcon={<AssessmentRoundedIcon/>}
                >
                    Result
                </Button>
                <Button
                    variant="outlined"
                    disableElevation
                    color="error"
                    onClick={onDelete}
                    sx={{textTransform: 'none'}}
                    startIcon={<ClearRoundedIcon/>}
                >
                    Delete
                </Button>
            </Stack>

        </Box>
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
        <Box component="div" sx={{my: 2, maxWidth: '600px'}}>
            {(allID?.length > 0) ? allID.map((record) =>

                <div key={record.id}>
                    <Record record={record} onDelete={() => {
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
                    {'Delete Record'}
                </DialogTitle>
                <DialogContent>
                    <Stack direction="row" spacing={1}>
                        <Typography>{"You are going to delete record: "}</Typography>
                        <Typography fontWeight="500">{deleteID.current}</Typography>
                    </Stack>
                    <Typography>{"This action is permanent. " +
                        "You won't be able to retrieve the analysis result again."}</Typography>
                </DialogContent>
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