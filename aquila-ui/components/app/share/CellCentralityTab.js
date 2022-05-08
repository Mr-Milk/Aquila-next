import {useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import axios from "axios";
import {runCentrality} from "../../../data/post";
import Stack from "@mui/material/Stack";
import LeftPanel from "../../Layout/LeftPanel";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import ParamWrap from "../../InputComponents/ParamWrap";
import Selector from "../../InputComponents/Selector";
import SubmitButton from "../../InputComponents/SubmitButton";
import OneItemCenter from "../../Layout/OneItemCenter";
import BoxPlot from "../../Viz/BoxPlot";


const BoxViz = ({data}) => {

    let boxData = [];
    let xlabel = [];
    data.forEach((r) => {
        boxData.push(r.centrality)
        xlabel.push(r.type)
    })

    return <BoxPlot data={boxData} xlabel={xlabel} title={'Cell Centrality'}/>
}

const methods = [
    {value: 'closeness', label: 'Closeness'},
    {value: 'betweenness', label: 'Betweenness'},
    {value: 'degree', label: 'Degree'},
]

const defaultValues = {
    method: "closeness",
}

const CellCentralityTab = ({roiID, cellData, getNeighbors}) => {
    const [showResult, setShowResult] = useState(0);
    const [runStatus, setRunStatus] = useState(false);
    const {handleSubmit, formState: {errors, isValid}, watch, control} = useForm({
        defaultValues,
    });

    const result = useRef();

    useEffect(() => {
        setShowResult(0);
    }, [roiID]);

    const handleRun = async (data) => {
        setRunStatus(true)
        const neighborsData = getNeighbors();
        const body = {
            e1: neighborsData.p1,
            e2: neighborsData.p2,
            types: cellData.cell_type,
            method: data.method
        }
        console.log(body)
        axios.post(runCentrality, body).then((res) => {
            console.log(res.data)
            result.current = res.data
            setShowResult(showResult + 1)
            setRunStatus(false)
        }).catch((e) => {
            console.log(e)
            setRunStatus(false)
            setRunStatus(false)
        })
    }

    return (
        <Stack direction="row" sx={{height: '100%'}}>

            <form onSubmit={handleSubmit(handleRun)}>
                <LeftPanel>
                    <SectionTitleWrap title={"Calculate centrality of different cell types"}/>
                    <ParamWrap>
                        <Controller
                            name="method"
                            control={control}
                            render={({field}) => {
                                return (
                                    <Selector
                                        title={"Method"}
                                        options={methods}
                                        description={
                                            <>
                                                <li>Closseness</li>
                                                <li>Betweenness</li>
                                                <li>Degree</li>
                                            </>
                                        }
                                        {...field}/>
                                )
                            }}
                        />
                    </ParamWrap>
                    <SubmitButton disabled={(!isValid) || runStatus} text={runStatus ? "Working..." : "Run"}/>
                </LeftPanel>
            </form>

            <OneItemCenter>
                {
                    showResult !== 0 ? <BoxViz data={result.current}/> : null
                }
            </OneItemCenter>
        </Stack>
    )
}

export default CellCentralityTab;