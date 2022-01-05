import useSWR from "swr";
import {fetcher, getCellInfoURL} from "@data/get";
import CellMap from "@components/Viz/CellMap";

const ViewROICellMap = ({roiID}) => {

    const { data, _ } = useSWR(`${getCellInfoURL}/${roiID}`, fetcher);

    // function getRandomInt(min, max) {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    // }
    //
    // const cx = [];
    // const cy = [];
    // const ct = [];
    //
    // Array.apply(null, Array(60000)).map((i) => {
    //     cx.push(10*Math.random() + 100)
    //     cy.push(10*Math.random() + 100)
    //     ct.push(getRandomInt(1, 10).toString())
    // })

    if (data === undefined) {
        return <></>
    } else {
        return (
            <CellMap cx={data.cell_x} cy={data.cell_y} ct={data.cell_type} showNeighbors={false}/>
            // <CellMap cx={cx} cy={cy} ct={ct} showNeighbors={false}/>
        )
    }

}

export default ViewROICellMap;