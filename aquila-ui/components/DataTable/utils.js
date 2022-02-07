import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableRow from "@mui/material/TableRow";

export const TitleCol = (props) => {
    return <TableCell>
        <Typography sx={{fontWeight: "medium"}} variant={"body2"}>
            {props.children}
        </Typography>
    </TableCell>
}


export const TextCol = (props) => {
    return <TableCell>
        <Typography variant={"body2"}>
            {props.children}
        </Typography>
    </TableCell>
}


export const InfoRow = ({title, info}) => {
    return <TableRow>
        <TitleCol>{title}</TitleCol>
        <TextCol>{info}</TextCol>
    </TableRow>
}