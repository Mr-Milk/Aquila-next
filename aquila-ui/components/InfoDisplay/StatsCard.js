import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import {styled} from '@mui/material/styles';


const RootStyle = styled(Card)(({theme}) => ({
    boxShadow: 'none',
    textAlign: 'center',
    width: theme.spacing(25),
    height: theme.spacing(25),
    padding: theme.spacing(2, 0),
    // color: theme.palette.primary.darker,
    // backgroundColor: theme.palette.primary.lighter,
    borderRadius: '25px',
}));


const IconWrapperStyle = styled('div')(({theme}) => ({
    margin: 'auto',
    display: 'flex',
    borderRadius: '50%',
    alignItems: 'center',
    width: theme.spacing(8),
    height: theme.spacing(8),
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    color: theme.palette.common.white,
    // backgroundImage: `linear-gradient(135deg, ${alpha(theme.palette.primary.dark, 0)} 0%, ${alpha(
    //     theme.palette.primary.dark,
    //     0.24
    // )} 100%)`
}));


const StatsCard = ({iconcolor, data, title, ...props}) => {
    const used_data = (data == undefined) ? 0 : data;
    return (
        <RootStyle>
            <IconWrapperStyle sx={{color: iconcolor}}>
                <Typography variant={"h3"}>
                    {props.children}
                </Typography>
            </IconWrapperStyle>
            <Typography variant="h3">{used_data}</Typography>
            <Typography variant="subtitle2" sx={{opacity: 0.72}}>
                {title}
            </Typography>
        </RootStyle>
    )
}

export default StatsCard;