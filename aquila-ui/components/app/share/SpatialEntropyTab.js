import {useEffect, useState} from "react";
import Selector from "components/InputComponents/Selector";
import NumericField from "components/InputComponents/NumberInput";
import axios from "axios";
import {runEntropy, runSpatialEntropy} from "data/post";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ParamWrap from "../../InputComponents/ParamWrap";
import OneItemCenter from "../../Layout/OneItemCenter";
import {number, object} from "yup";
import {Controller, useForm} from "react-hook-form";
import {getDefaultR} from "../../compute/geo";
import {yupResolver} from "@hookform/resolvers/yup";
import LeftPanel from "../../Layout/LeftPanel";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import SubmitButton from "../../InputComponents/SubmitButton";
import SectionExplainer from "../../InputComponents/SectionExplainer";


const methods = [
    {value: 'spatial-entropy', label: 'Spatial Entropy'},
    {value: 'entropy', label: 'Shannon Entropy',}
]

const defaultValues = {
    method: 'spatial-entropy',
    radius: 10
}

const schema = object({
    radius: number().positive(),
})


const SpatialEntropyTab = ({cellData, bbox}) => {

    const [result, setResult] = useState(0);
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
        setResult(0);
    }, [cellData]);

    const handleRun = (data) => {
        setRunStatus(true)
        if (data.method === "spatial-entropy") {
            const body = {
                x: cellData.cell_x,
                y: cellData.cell_y,
                types: cellData.cell_type,
                d: data.radius
            };
            axios.post(runSpatialEntropy, body).then((res) => {
                setResult(res.data.entropy);
                setRunStatus(false)
            }).catch((e) => {
                //console.log(e)
                setRunStatus(false)
            })
        } else {
            const body = {
                cell_type: cellData.cell_type
            }
            axios.post(runEntropy, body).then((res) => {
                setResult(res.data.entropy);
                setRunStatus(false)
            }).catch((e) => {
                //console.log(e)
                setRunStatus(false)
            })
        }
    }

    if (!cellData) {
        return null
    }
    return (
        <Stack direction="row" sx={{height: '100%'}}>
            <form onSubmit={handleSubmit(handleRun)}>
                <LeftPanel>
                    <SectionExplainer
                        title={"Quantify the heterogeneity of ROI"}
                        details={"Entropy is a metric to quantify the chaos of a system." +
                            " It can be used to quantify the heterogeneity of cancer."}
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
                                                <li>Shannon Entropy: The original entropy quantification</li>
                                                <li>Spatial Entropy: Spatial co-occurrences to determine the entropy</li>
                                            </>
                                        }
                                        {...field}/>
                                )
                            }}
                        />
                    </ParamWrap>

                    <ParamWrap show={watchMethod === 'spatial-entropy'}>
                        <Controller
                            name="radius"
                            control={control}
                            render={({field}) => (
                                <NumericField
                                    title={"Radius"}
                                    error={!(errors.radius === undefined)}
                                    // placeholder="Sample Radius"
                                    helperText={"Positive Integer"}
                                    description={"The distance to determine co-occurrence"}
                                    {...field}
                                />
                            )}
                        />
                    </ParamWrap>
                    <SubmitButton disabled={(!isValid) || runStatus} text={runStatus ? "Working..." : "Run"}/>
                </LeftPanel>
            </form>
            <OneItemCenter>
                {(result !== 0) ?
                    <Typography component="h3" sx={{mt: 2}}>Entropy
                        is: {result.toFixed(5)}</Typography> : <></>}
            </OneItemCenter>
        </Stack>)

}


export default SpatialEntropyTab;