import {array, object} from "yup";
import {useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Stack from "@mui/material/Stack";
import LeftPanel from "../../Layout/LeftPanel";
import ParamWrap from "../../InputComponents/ParamWrap";
import VirtualizedAutoComplete from "../../InputComponents/VirtualizedAutoComplete";
import SubmitButton from "../../InputComponents/SubmitButton";
import OneItemCenter from "../../Layout/OneItemCenter";
import {runCoexp} from "../../../data/post";
import axios from "axios";
import Selector from "../../InputComponents/Selector";
import Heatmap from "../../Viz/Heatmap";
import SectionExplainer from "../../InputComponents/SectionExplainer";


const ExpViz = ({data}) => {

    let heatData = [];
    data.forEach((r) => {
        heatData.push([r.marker1, r.marker2, r.value])
        if (r.marker1 !== r.marker2) {
            heatData.push([r.marker2, r.marker1, r.value])
        }
    })

    return <Heatmap data={heatData} colors={"RdBu"}
                    min={-1} max={1} legendText={["1", "-1"]}/>
}


const methods = [
    {value: 'pearson', label: 'Pearson Correlation'},
    {value: 'spearman', label: 'Spearman Correlation'}
]

const defaultValues = {
    method: "pearson",
    markers: []
}

const schema = object({
    markers: array().min(2).max(30),
})

const CoExpTab = ({roiID, recordData, getCellExpBatch}) => {
    const [showResult, setShowResult] = useState(0);
    const [runStatus, setRunStatus] = useState(false);
    const {handleSubmit, formState: {errors, isValid}, control} = useForm({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema)
    });

    const result = useRef();

    useEffect(() => {
        setShowResult(0);
    }, [roiID]);

    const handleRun = async (data) => {
        setRunStatus(true)
        const expMatrix = await getCellExpBatch(roiID, data.markers);
        axios.post(runCoexp, {
            exp_matrix: expMatrix.map((r) => {
                return {
                    marker: r.marker,
                    exp: r.expression
                }
            }),
            method: data.method
        }).then((res) => {
            //console.log(res.data)
            result.current = res.data
            setShowResult(showResult + 1)
            setRunStatus(false)
        }).catch((e) => {
            //console.log(e)
            setRunStatus(false)
        })
    }

    return (
        <Stack direction="row" sx={{height: '100%'}}>

            <form onSubmit={handleSubmit(handleRun)}>
                <LeftPanel>
                    <SectionExplainer title={"Markers co-expression analysis"}
                                      details={"Reveal the relationship among markers, whether they express at the " +
                                          "same pattern (+1) or complementary pattern (-1)."}/>
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
                                                <li>Pearson correlation</li>
                                                <li>Spearman correlation</li>
                                            </>
                                        }
                                        {...field}/>
                                )
                            }}
                        />
                    </ParamWrap>
                    <ParamWrap>
                        <Controller
                            name="markers"
                            control={control}
                            render={({field}) => {
                                return (
                                    <VirtualizedAutoComplete
                                        {...field}
                                        multiple={true}
                                        disableCloseOnSelect={true}
                                        error={!(errors.markers === undefined)}
                                        helperText={"Select 2~30 markers"}
                                        value={field.value}
                                        label={'Select or Search Marker'}
                                        options={recordData.markers}
                                        onChange={(_, v) => field.onChange(v)}
                                    />
                                )
                            }}
                        />
                    </ParamWrap>
                    <SubmitButton disabled={(!isValid) || runStatus} text={runStatus ? "Working..." : "Run"}/>
                </LeftPanel>
            </form>

            <OneItemCenter>
                {
                    showResult !== 0 ? <ExpViz data={result.current}/> : null
                }
            </OneItemCenter>
        </Stack>
    )
}

export default CoExpTab;