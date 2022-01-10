import useSWR from "swr";
import {fetcher, getCellInfoURL} from "@/data/get";
import Pie from "@/components/Viz/Pie";
import {Grid} from "@mui/material";

const CellComponentTab = ({roiID}) => {

    const {data, _} = useSWR(`${getCellInfoURL}/${roiID}`, fetcher);

    if (data === undefined) {
        return <></>
    } else {
        return (
            <Grid container flexDirection="row" justifyContent="center">
                <Grid item>
                    <Pie
                        arr={data.cell_type}
                        height="350px"
                        width="350px"
                        title="Cell components"
                    />
                </Grid>
            </Grid>
        )
    }
}

export default CellComponentTab;