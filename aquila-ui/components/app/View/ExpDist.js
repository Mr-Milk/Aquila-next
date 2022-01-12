import Histogram from "components/Viz/Histogram";
import useSWR from "swr";
import {fetcher, getCellExpURL} from "data/get";
import {useRef} from "react";


const ExpDist = ({roiID, marker}) => {

    const {data: ExpData} = useSWR(`${getCellExpURL}/${roiID}/${marker}`, fetcher);

    const renderData = useRef({
        expression: [0.0]
    })

    if (ExpData !== undefined) {
        renderData.current.expression = ExpData.expression
    }

    return <Histogram arr={renderData.current.expression} title="Expression distribution"/>
}

export default ExpDist;