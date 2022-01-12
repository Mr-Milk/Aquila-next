import useSWR from "swr";
import {fetcher, getCellExpURL, getCellInfoURL} from "data/get";
import ExpressionMap from "components/Viz/ExpressionMap";
import {useRef} from "react";


const ViewROIExpMap = ({roiID, marker}) => {

    const {data: cellData} = useSWR(`${getCellInfoURL}/${roiID}`, fetcher);
    const {data: expData} = useSWR(`${getCellExpURL}/${roiID}/${marker}`, fetcher);

    const renderData = useRef({
        cell_x: [0.0],
        cell_y: [0.0],
        expression: [0.0]
    })

    if (cellData !== undefined) {
        renderData.current.cell_x = cellData.cell_x
        renderData.current.cell_y = cellData.cell_y
    }

    if (expData !== undefined) {
        renderData.current.expression = expData.expression
    }

    return <ExpressionMap
        cx={renderData.current.cell_x}
        cy={renderData.current.cell_y}
        exp={renderData.current.expression}
        markerName={marker}/>

}

export default ViewROIExpMap;