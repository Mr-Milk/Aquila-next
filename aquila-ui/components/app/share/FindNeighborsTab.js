import {runCellNeighbors} from "data/post";
import {useCallback, useEffect, useState} from "react";
import Selector from "components/InputComponents/Selector";
import NumericField from "components/InputComponents/NumberInput";
import axios from "axios";
import Stack from "@mui/material/Stack";
import ParamWrap from "../../InputComponents/ParamWrap";
import OneItemCenter from "../../Layout/OneItemCenter";
import Ranger from "../../InputComponents/Ranger";
import GraphGL from "../../Viz/GraphGL";
import {getDefaultR} from "../../compute/geo";
import {number, object} from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import LeftPanel from "../../Layout/LeftPanel";
import SubmitButton from "../../InputComponents/SubmitButton";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";


const getRunBody = (cellData, userData) => {
    let parsedK = userData.k;
    let parsedR = userData.radius;
    let parsedMethod = userData.method;

    if (userData.method === "kd-tree-1") {
        parsedK = -1
    } else if (userData.method === "kd-tree-2") {
        parsedR = -1
    }

    if (userData.method !== "delaunay") {
        parsedMethod = "kd-tree"
    }

    const body = {
        x: cellData.cell_x,
        y: cellData.cell_y,
        method: parsedMethod,
        r: parsedR,
        k: parsedK + 1,
    }
    return body;
}

const methods = [
    {value: 'kd-tree-2', label: 'KD Tree (KNN)'},
    {value: 'kd-tree-1', label: 'KD Tree (Radius)'},
    {value: 'kd-tree-3', label: 'KD Tree (Radius + KNN)'},
    {value: 'delaunay', label: 'Delaunay Triangulation'},
]

const defaultValues = {
    method: "kd-tree-2",
    radius: 10,
    k: 3,
}

const schema = object({
    k: number().positive().integer().lessThan(11),
    radius: number().positive(),
})


const FindNeighborsTab = ({cellData, updateNeighbors, getNeighbors, bbox}) => {

    const [showResult, setShowResult] = useState(0);
    const [runStatus, setRunStatus] = useState(false);
    const {handleSubmit, formState: {errors, isValid}, watch, control} = useForm({
        defaultValues: {
            ...defaultValues,
            radius: getDefaultR(bbox)
        },
        resolver: yupResolver(schema)
    });
    const watchMethod = watch('method');

    useEffect(() => {
        setShowResult(0);
    }, [cellData]);

    const plotX = useCallback(() => {
        //const oy = bbox.y2;
        const ox = bbox.x2;
        return cellData.cell_x.map((x) => {
            return -x + ox
        })
    }, [bbox.x2, cellData.cell_x])
    const cell_x = plotX();

    const handleRun = (data) => {
        const body = getRunBody(cellData, data);
        //console.log(body)
        axios.post(runCellNeighbors, body).then((res) => {
            updateNeighbors(res.data)
            setShowResult(showResult + 1)
            setRunStatus(false)
        }).catch((e) => {
            //console.log(e)
            setRunStatus(false)
        })
    }
    const neighborsData = getNeighbors();

    if (!cellData) {
        return null
    }


    return (
        <Stack direction="row" sx={{height: '100%'}}>

            <form onSubmit={handleSubmit(handleRun)}>
                <LeftPanel>
                    <SectionTitleWrap title={"Find the neighbors for cells"}/>
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
                                                <li>KD Tree: Search nearest K neighbors or neighbors within radius</li>
                                                <li>Delaunay Triangulation: Building a triangulation network</li>
                                            </>
                                        }
                                        {...field}/>
                                )
                            }}
                        />
                    </ParamWrap>

                    <ParamWrap show={(watchMethod === 'kd-tree-2') || (watchMethod === 'kd-tree-3')}>
                        <Controller
                            name="k"
                            control={control}
                            render={({field}) => (
                                <Ranger
                                    {...field}
                                    min={1} max={10} step={1}
                                    title={"Number of neighbors (K)"}
                                    description={"Number of neighbors a cell will have"}
                                    onChange={(_, value) => field.onChange(value)}
                                />
                            )}
                        />

                    </ParamWrap>

                    <ParamWrap show={(watchMethod === 'kd-tree-1') || (watchMethod === 'kd-tree-3')}>
                        <Controller
                            name="radius"
                            control={control}
                            render={({field}) => (
                                <NumericField
                                    title={"Radius"}
                                    error={!(errors.radius === undefined)}
                                    // placeholder="Sample Radius"
                                    helperText={"Positive Integer"}
                                    description={"Cells that intersect with the radius range of " +
                                        "the center cell will be consider as neighbors"}
                                    {...field}
                                />
                            )}
                        />
                    </ParamWrap>

                    <SubmitButton disabled={(!isValid) || runStatus} text={runStatus ? "Working..." : "Run"}/>
                </LeftPanel>
            </form>
            <OneItemCenter>
                {
                    showResult ? <GraphGL
                        title={"Cell Neighobrs"}
                        cx={cell_x}
                        cy={cellData.cell_y}
                        ct={cellData.cell_type}
                        weights={neighborsData.weights}
                        p1={neighborsData.p1}
                        p2={neighborsData.p2}
                        rotate={180}
                    /> : <></>
                }
            </OneItemCenter>
        </Stack>
    )
}

export default FindNeighborsTab;