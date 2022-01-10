import Histogram from "@/components/Viz/Histogram";
import useSWR from "swr";
import {fetcher, getCellExpURL} from "@/data/get";


const ExpDist = ({roiID, marker}) => {

    const {data: ExpData} = useSWR(`${getCellExpURL}/${roiID}/${marker}`, fetcher);

    if (ExpData === undefined) {
        return <></>
    } else {
        return (
            <Histogram arr={ExpData.expression} title="Expression distribution"></Histogram>
        )
    }
}

export default ExpDist;