import Fab from "@mui/material/Fab";
import Badge from "@mui/material/Badge";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import {useState} from "react";
import DialogContent from "@mui/material/DialogContent";
import {ImBoxAdd} from "react-icons/im";
import Typography from "@mui/material/Typography";


const DownloadFab = ({ downloadList }) => {

    const [open, setOpen] = useState(false);

    return (
        <>
        <Fab variant="extended"
                 color="secondary"
                 sx={{
                     color: 'white',
                     position: 'fixed',
                     bottom: (theme) => theme.spacing(2),
                     right: (theme) => theme.spacing(2),
                     textTransform: 'none'
                 }}
                 onClick={() => setOpen(true)}
            >
                <Typography variant="subtitle2" sx={{ mr: 1 }}>{"Download List"}</Typography>
                <Badge badgeContent={downloadList.length}
                       color="error">
                    <ImBoxAdd/>
                </Badge>

            </Fab>

            <Dialog
                open={ downloadList.length === 0 ? false : open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>
                    Download Multiple Dataset
                </DialogTitle>
                <DialogContent>
                    {`You are going to download ${downloadList.length} ${downloadList.length === 1 ? "dataset" : "datasets"}.`}
                </DialogContent>
                <DialogActions>
                    <Button
                        href={`https://api.cheunglab.org/download?files=${downloadList.join(",")}`}
                        onClick={() => setOpen(false)}
                    >Confirm</Button>
                </DialogActions>
            </Dialog>
            </>
    )
}

export default DownloadFab;