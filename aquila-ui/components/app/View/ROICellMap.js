import useSWR from "swr";
import {fetcher, getCellInfoURL} from "data/get";
import CellMap from "components/Viz/CellMap";
import {useRef} from "react";

const ViewROICellMap = ({roiID}) => {

    const {data, _} = useSWR(`${getCellInfoURL}/${roiID}`, fetcher);

    const renderData = useRef({
        cell_x: [],
        cell_y: [],
        cell_type: [],
    });

    if (data !== undefined) {
        renderData.current = data
    }

    return <CellMap cx={renderData.current.cell_x}
                    cy={renderData.current.cell_y}
                    ct={renderData.current.cell_type}
                    showNeighbors={false}/>

}

export default ViewROICellMap;