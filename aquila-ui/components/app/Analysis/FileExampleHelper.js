import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import HelpOutline from "@mui/icons-material/HelpOutline";
import IconButton from "@mui/material/IconButton";


const FileExampleHelper = ({title, open, onClick, onClose, sx, children,}) => {
    return (
        <>
            <IconButton
                variant="contained"
                size="small"
                sx={{...sx, mr: {sm: 1}}}
                onClick={onClick}
            >
                <HelpOutline/>
            </IconButton>

            <Dialog open={open} onClose={onClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent sx={{mb: 2}}>
                    {children}
                </DialogContent>
            </Dialog>
        </>

    )
}

export default FileExampleHelper;