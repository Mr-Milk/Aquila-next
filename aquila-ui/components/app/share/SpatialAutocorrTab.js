import {useEffect, useRef, useState} from "react";
import NumericField from "../../InputComponents/NumberInput";
import axios from "axios";
import {runSpatialAutoCorr} from "../../../data/post";
import Selector from "../../InputComponents/Selector";
import VirtualizedAutoComplete from "../../InputComponents/VirtualizedAutoComplete";
import Stack from "@mui/material/Stack";
import ParamWrap from "../../InputComponents/ParamWrap";
import OneItemCenter from "../../Layout/OneItemCenter";
import {array, number, object} from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import LeftPanel from "../../Layout/LeftPanel";
import SubmitButton from "../../InputComponents/SubmitButton";
import VolcanoPlot from "../../Viz/VolcanoPlot";
import {displayMinMax} from "../../humanize";


const Viz = ({data, pvalue}) => {

    const x = [];
    const y = [];
    const label = [];
    data.forEach((record) => {

        x.push((record.value === null) ? 0 : record.value.toFixed(2))
        let pvalue;
        if (record.pvalue === 0) {
            pvalue = 1e-20
        } else if (record.pvalue === null) {
            pvalue = 1
        } else {
            pvalue = record.pvalue
        }
        y.push(-Math.log10(pvalue).toFixed(2))
        label.push(record.marker)
    })

    let yrange = displayMinMax(y)
    if (yrange[1] < 5) {
        yrange = [0, 10]
    }

    return <VolcanoPlot x={x} y={y} label={label}
                        xrange={[-1, 1]}
                        yrange={yrange}
                        ytitle={"-log10(pval)"}
                        xtitle={"Autocorrelation"}
                        ythresh={-Math.log10(pvalue)}
                        xthresh={0.5}
    />
}


const methods = [
    {value: 'moran_i', label: 'Moran\'s I'},
    {value: 'geary_c', label: 'Geary\'s C'},
]

const defaultValues = {
    method: "moran_i",
    pValue: 0.05,
    markers: []
}

const schema = object({
    pValue: number().positive().lessThan(1),
    markers: array().min(1).max(50),
})


const SpatialAutocorrTab = ({roiID, recordData, cellData, getNeighbors, getCellExpBatch}) => {

    const result = useRef();
    const userpValue = useRef();
    const [showResult, setShowResult] = useState(0);
    const [runStatus, setRunStatus] = useState(false);
    const {handleSubmit, formState: {errors, isValid}, watch, control} = useForm({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema)
    });

    //const {data: expData} = getExpData(roiID, marker);

    useEffect(() => {
        setShowResult(0);
    }, [cellData]);

    const neighborsData = getNeighbors();


    const handleRun = async (data) => {
        setRunStatus(true)
        const expMatrix = await getCellExpBatch(roiID, data.markers);
        const body = {
            neighbors_map: neighborsData.map,
            exp_matrix: expMatrix.map((r) => {
                return {
                    marker: r.marker,
                    exp: r.expression
                }
            }),
            pvalue: data.pValue,
            method: data.method
        }

        userpValue.current = data.pValue

        //console.log(body)

        axios.post(runSpatialAutoCorr, body).then((res) => {
            //console.log(res.data)
            result.current = res.data
            setShowResult(showResult + 1)
            setRunStatus(false)
        }).catch((e) => {
            //console.log(e)
            setRunStatus(false)
        })
    }

    if (!cellData) {
        return null
    }
    return (
        <Stack direction="row" sx={{height: '100%'}}>
            <form onSubmit={handleSubmit(handleRun)}>
                <LeftPanel>
                    <SectionTitleWrap title={"Correlation between expression and nearby spatial location"}/>

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
                                                <p>Due to the precision issue of floating point in JavaScript,
                                                    the result may be a bit different between each run</p>
                                                <li>{"Moran'I: Local measurement"}</li>
                                                <li>{"Geary'C: Global measurement"}</li>
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
                                        helperText={"Select 1~50 markers"}
                                        value={field.value}
                                        label={'Select or Search Marker'}
                                        options={recordData.markers}
                                        onChange={(_, v) => field.onChange(v)}
                                    />
                                )
                            }}
                        />
                    </ParamWrap>

                    <ParamWrap>
                        <Controller
                            name="pValue"
                            control={control}
                            render={({field}) => (
                                <NumericField
                                    title={"P-value"}
                                    error={!(errors.pValue === undefined)}
                                    placeholder="p value"
                                    helperText={"Number from 0 to 1"} {...field}
                                    description={"Threshold to determine significance"}
                                />
                            )}
                        />
                    </ParamWrap>


                    <SubmitButton disabled={(!isValid) || runStatus} text={runStatus ? "Working..." : "Run"}/>
                </LeftPanel>
            </form>
            <OneItemCenter>
                {(showResult !== 0) ?
                    <>
                        <Viz data={result.current} pvalue={userpValue.current}/>
                    </>
                    : <></>}
            </OneItemCenter>
        </Stack>
    )

}

export default SpatialAutocorrTab;