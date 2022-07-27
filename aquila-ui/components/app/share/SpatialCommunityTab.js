import {number, object} from "yup";
import {useCallback, useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import axios from "axios";
import {runSpatailCommunity} from "../../../data/post";
import Stack from "@mui/material/Stack";
import LeftPanel from "../../Layout/LeftPanel";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import ParamWrap from "../../InputComponents/ParamWrap";
import Selector from "../../InputComponents/Selector";
import SubmitButton from "../../InputComponents/SubmitButton";
import OneItemCenter from "../../Layout/OneItemCenter";
import {yupResolver} from "@hookform/resolvers/yup";
import NumericField from "../../InputComponents/NumberInput";
import GraphGL from "../../Viz/GraphGL";
import {Counter} from "../../compute/math";
import Heatmap from "../../Viz/Heatmap";
import max from "loadsh/max"
import min from "loadsh/min"
import SectionExplainer from "../../InputComponents/SectionExplainer";


const ComponentViz = ({ct = [], community}) => {

    if (ct.length > 0) {
        const comp = {};
        community.map((comm, i) => {
            if (!comp.hasOwnProperty(comm)) {
                comp[comm] = [ct[i]]
            } else {
                comp[comm].push(ct[i])
            }
        })
        const plotData = [];
        const counts = [];
        Object.entries(comp).map(([comm, cts]) => {
            let count = new Counter(cts);
            Object.entries(count).forEach(([ct, v]) => {
                plotData.push([ct, comm, v])
                counts.push(v)
            })
        })
        return <Heatmap data={plotData}
                        min={min(counts)}
                        max={max(counts)}
                        colors={"Greens"}
        />
    }

    return null
}


const methods = [
    {value: 'leiden', label: 'Leiden'},
    {value: 'louvain', label: 'Louvain'},
    {value: 'infomap', label: 'Infomap'},
]

const defaultValues = {
    method: "leiden",
    resolution: 0.1,
    trials: 10,
}

const schema = object({
    resolution: number().positive(),
    trials: number().positive().integer().lessThan(50),
})

const SpatialCommunityTab = ({roiID, cellData, getNeighbors, bbox, is3D=false}) => {
    const [showResult, setShowResult] = useState(0);
    const [runStatus, setRunStatus] = useState(false);
    const {handleSubmit, formState: {errors, isValid}, watch, control} = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    });
    const watchMethod = watch('method');
    const neighborsData = getNeighbors();
    const plotX = useCallback(() => {
        // const oy = bbox.y2;
        const ox = bbox.x2;
        return cellData.cell_x.map((x) => {
            return -x + ox
        })
    }, [bbox.x2, cellData.cell_x])
    const cell_x = plotX();

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
            weights: neighborsData.weights,
            trials: data.trials,
            resolution: data.resolution,
            method: data.method
        }
        //console.log(body)
        axios.post(runSpatailCommunity, body).then((res) => {
            //console.log(res.data)
            result.current = res.data
            setShowResult(showResult + 1)
            setRunStatus(false)
        }).catch((e) => {
            //console.log(e)
            setRunStatus(false)
            setRunStatus(false)
        })
    }

    return (
        <Stack direction="row" sx={{height: '100%'}}>

            <form onSubmit={handleSubmit(handleRun)}>
                <LeftPanel>
                    <SectionExplainer
                        title={"Calculate centrality of different cell types"}
                        details={"Graph community algorithms partition the " +
                            "neighboring network into different communities."}
                        vizTips={"The graph shows the cell communities, " +
                            "and the heatmap shows the portion of different cell types in each community."}
                    />
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
                                                <li>Leiden</li>
                                                <li>Louvain</li>
                                                <li>Infomap</li>
                                            </>
                                        }
                                        {...field}/>
                                )
                            }}
                        />
                    </ParamWrap>
                    <ParamWrap show={watchMethod === 'infomap'}>
                        <Controller
                            name="trials"
                            control={control}
                            render={({field}) => (
                                <NumericField
                                    title={"Trials"}
                                    error={!(errors.trials === undefined)}
                                    placeholder="Number of iterations"
                                    helperText={"Positive Integer"} {...field}
                                    description={"Number of iterations to refine results"}
                                />
                            )}
                        />
                    </ParamWrap>

                    <ParamWrap show={watchMethod === 'leiden'}>
                        <Controller
                            name="resolution"
                            control={control}
                            render={({field}) => (
                                <NumericField
                                    title={"Resolution"}
                                    error={!(errors.resolution === undefined)}
                                    placeholder="Resolution"
                                    helperText={"Positive Number"} {...field}
                                    description={"Control the size of communities"}
                                />
                            )}
                        />
                    </ParamWrap>
                    <SubmitButton disabled={(!isValid) || runStatus} text={runStatus ? "Working..." : "Run"}/>
                </LeftPanel>
            </form>

            <OneItemCenter>
                {
                    showResult !== 0 ?
                        <Stack direction="column" alignItems="center">
                            { is3D ? <></> :
                            <GraphGL
                            title={"Cell Community"}
                            cx={cell_x}
                            cy={cellData.cell_y}
                            ct={result.current}
                            p1={neighborsData.p1}
                            p2={neighborsData.p2}
                            weights={neighborsData.weights}
                            community={true}
                            rotate={180}
                        />}
                            <ComponentViz ct={cellData.cell_type} community={result.current}/>
                        </Stack> : null
                }

            </OneItemCenter>
        </Stack>
    )
}

export default SpatialCommunityTab;