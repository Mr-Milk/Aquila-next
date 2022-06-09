import {useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {array, object} from "yup";
import VirtualizedAutoComplete from "../../InputComponents/VirtualizedAutoComplete";
import ParamWrap from "../../InputComponents/ParamWrap";
import Stack from "@mui/material/Stack";
import LeftPanel from "../../Layout/LeftPanel";
import SubmitButton from "../../InputComponents/SubmitButton";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import OneItemCenter from "../../Layout/OneItemCenter";
import Heatmap from "../../Viz/Heatmap";
import groupBy from "loadsh/groupBy"
import meanBy from "loadsh/meanBy"
import max from "loadsh/max"
import min from "loadsh/min"
import SectionExplainer from "../../InputComponents/SectionExplainer";


const defaultValues = {
    markers: []
}

const schema = object({
    markers: array().min(2).max(30),
})


const CellExpressionTab = ({roiID, recordData, cellData, getCellExpBatch}) => {
    const [showResult, setShowResult] = useState(0);
    const [runStatus, setRunStatus] = useState(false);
    const {handleSubmit, formState: {errors, isValid}, control} = useForm({
        mode: "onChange",
        defaultValues,
        resolver: yupResolver(schema)
    });
    const result = useRef([{}]);
    const MinMax = useRef({min: 0, max: 10});
    useEffect(() => {
        setShowResult(0);
    }, [cellData]);

    if (cellData === undefined) {
        return null
    }

    const handleRun = async (data) => {
        setRunStatus(true)
        const expMatrix = await getCellExpBatch(roiID, data.markers);

        const cellType = cellData.cell_type;

        const flatData = [];
        expMatrix.map((record) => {
            record.expression.map((e, i) => {
                flatData.push(
                    {'cell_type': cellType[i], 'marker': record.marker, 'expression': e}
                )
            })
        })

        const plotData = []
        const expData = []
        Object.entries(groupBy(flatData, 'cell_type')).map(([ct, v]) => {
            Object.entries(groupBy(v, 'marker')).map(([m, ele]) => {
                let meanExp = meanBy(ele, 'expression');
                plotData.push([ct, m, meanExp])
                expData.push(meanExp)
            })
        })
        result.current = plotData

        MinMax.current.min = min(expData)
        MinMax.current.max = max(expData)
        setRunStatus(false)
        setShowResult(showResult + 1)

    }

    return (
        <Stack direction="row" sx={{height: '100%'}}>

            <form onSubmit={handleSubmit(handleRun)}>
                <LeftPanel>
                    <SectionExplainer title={"Expression in different cell types"}
                        details={"To visualize the expression of different markers in " +
                            "different cell tyeps."}
                    />
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
                    showResult !== 0 ? <Heatmap data={result.current}
                                                min={MinMax.current.min} max={MinMax.current.max}
                                                colors={"Greens"}/> : null
                }
            </OneItemCenter>
        </Stack>
    )
}

export default CellExpressionTab;