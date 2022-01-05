import useSWR from "swr";
import {fetcher, getCellExpURL, getCellInfoURL} from "@data/get";
import ExpressionMap from "@components/Viz/ExpressionMap";
import Histogram from "@components/Viz/Histogram";


const ViewROIExpMap = ({roiID, marker}) => {

    const { data: CellData } = useSWR(`${getCellInfoURL}/${roiID}`, fetcher);
    const { data: ExpData } = useSWR(`${getCellExpURL}/${roiID}/${marker}`, fetcher);


    if ((CellData === undefined) || (ExpData === undefined)) {
        return <></>
    } else {
        return (
                <ExpressionMap cx={CellData.cell_x} cy={CellData.cell_y} exp={ExpData.expression} markerName={marker}/>
        )
    }

}

export default ViewROIExpMap;