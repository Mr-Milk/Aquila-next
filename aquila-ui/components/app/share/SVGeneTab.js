import {useEffect, useRef, useState} from "react";
import NumericField from "../../InputComponents/NumberInput";
import axios from "axios";
import Selector from "../../InputComponents/Selector";
import Typography from "@mui/material/Typography";
import VirtualizedAutoComplete from "../../InputComponents/VirtualizedAutoComplete";
import {runSVGene} from "../../../data/post";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import ParamWrap from "../../InputComponents/ParamWrap";
import OneItemCenter from "../../Layout/OneItemCenter";
import {array, number, object} from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import LeftPanel from "../../Layout/LeftPanel";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import SubmitButton from "../../InputComponents/SubmitButton";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";


const Viz = ({data}) => {

    const pos = [];
    const neg = [];
    const nan = [];
    data.forEach((i) => {
        if (i.status) {
            pos.push(i.marker)
        } else {
            neg.push(i.marker)
        }
    })

    return <Grid container>
        <Grid item>
            <Stack direction="column" spacing={1} sx={{px: 2}}>
                <Typography variant="h6" sx={{mx: 2}}>SV</Typography>
                {
                    pos.map((g, i) => (
                        <Chip key={i} label={g} color={"error"}/>
                    ))
                }
            </Stack>
        </Grid>
        <Divider orientation="vertical" flexItem/>
        <Grid item>

            <Stack direction="column" spacing={1} sx={{px: 2}}>
                <Typography variant="h6" sx={{mx: 2}}>Non SV</Typography>
                {
                    neg.map((g, i) => (
                        <Chip key={i} label={g} color={"secondary"}/>
                    ))
                }
            </Stack>
        </Grid>
    </Grid>
}

const methods = [
    {value: 'spatialde', label: 'SpatialDE'},
]

const defaultValues = {
    method: "spatialde",
    pValue: 0.05,
    markers: []
}

const schema = object({
    pValue: number().positive().lessThan(1),
    markers: array().min(1).max(50),
})

const SVGeneTab = ({roiID, recordData, cellData, getCellExpBatch}) => {

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


    const handleRun = async (data) => {
        setRunStatus(true)
        const expMatrix = await getCellExpBatch(roiID, data.markers);
        const body = {
            exp_matrix: expMatrix.map((r) => {
                return {
                    marker: r.marker,
                    exp: r.expression
                }
            }),
            x: cellData.cell_x,
            y: cellData.cell_y,
            pval: data.pValue,
            method: data.method
        }

        userpValue.current = data.pValue

        //console.log(body)

        axios.post(runSVGene, body).then((res) => {
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
                    <SectionTitleWrap
                        title={"Whether the gene expression is dependent on spatial location"}
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
                                        description={"SpatialDE"}
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
                        <Viz data={result.current}/>
                    </>
                    : <></>}
            </OneItemCenter>
        </Stack>
    )

}

export default SVGeneTab;