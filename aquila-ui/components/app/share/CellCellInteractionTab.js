import {useEffect, useMemo, useRef, useState} from "react";
import Selector from "components/InputComponents/Selector";
import NumericField from "components/InputComponents/NumberInput";
import {runCellInterations} from "data/post";
import Heatmap from "components/Viz/Heatmap";
import natsort from "natsort";
import axios from "axios";
import Stack from "@mui/material/Stack";
import ParamWrap from "../../InputComponents/ParamWrap";
import Ranger from "../../InputComponents/Ranger";
import OneItemCenter from "../../Layout/OneItemCenter";
import {number, object} from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import LeftPanel from "../../Layout/LeftPanel";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import SubmitButton from "../../InputComponents/SubmitButton";
import uniq from "loadsh/uniq";
import SectionExplainer from "../../InputComponents/SectionExplainer";

const patternMap = {'0': 'Non significant', '1': 'Attract', '-1': 'Repeal'}


const processResult = (data) => {

    const dataMapper = {}
    data.type1.map((t1, i) => {
        dataMapper[`${t1}${data.type2[i]}`] = data.score[i]
    })

    const labelOrder = uniq(data.type1).sort(natsort());
    const plotData = [];
    for (let i = 0; i < labelOrder.length; i++) {
        for (let j = 0; j < labelOrder.length; j++) {
            let k1 = labelOrder[i];
            let k2 = labelOrder[j];
            let key = `${k1}${k2}`
            plotData.push([labelOrder[i], labelOrder[j], dataMapper[key]])
        }
    }

    return plotData
}


const methods = [
    {value: 'pval', label: 'Pseudo P-value'},
    {value: 'zscore', label: 'zscore'},
]

const defaultValues = {
    method: "pval",
    times: 500,
    pValue: 0.05,
}

const schema = object({
    pValue: number().positive().lessThan(1),
})


const CellCellInteractionTab = ({roiID, cellData, neighborsData}) => {


    const result = useRef({type1: []});
    const labels = useRef([]);

    const [showResult, setShowResult] = useState(0);
    const [runStatus, setRunStatus] = useState(false);
    const {handleSubmit, formState: {errors, isValid}, control} = useForm({
        defaultValues,
        resolver: yupResolver(schema)
    });

    useMemo(() => {
        if (cellData !== undefined) {
            labels.current = [...new Set(cellData.cell_type)].sort(natsort())
        }
    }, [cellData]);

    useEffect(() => {
        setShowResult(0);
    }, [roiID]);

    const handleRun = (data) => {
        setRunStatus(true)
        const body = {
            neighbors_map: neighborsData.map,
            cell_type: cellData.cell_type,
            times: data.times,
            pvalue: data.pValue,
            method: data.method
        }
        //console.log(body)
        axios.post(runCellInterations, body).then((res) => {
            //console.log(res.data)
            result.current = processResult(res.data);
            //console.log(result.current)
            setShowResult(showResult + 1)
            setRunStatus(false)
        }).catch((e) => {
            // console.log(e)
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
                    <SectionExplainer
                        title={"The likelihood of two cells proximate or avoiding each other"}
                        details={"This analysis uses bootstrapping method to determine " +
                            "if the co-occurrences event of two cells is random."}
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
                                        description={"A permutation test is conducted by shuffling the cell label and " +
                                            "using either pseudo p-value or z-score to determine the significance"}
                                        {...field}/>
                                )
                            }}
                        />
                    </ParamWrap>

                    <ParamWrap>
                        <Controller
                            name="times"
                            control={control}
                            render={({field}) => (
                                <Ranger
                                    {...field}
                                    min={100} max={2000} step={100}
                                    title={"Times"}
                                    description={"Number of time to perform shuffling"}
                                    onChange={(_, value) => field.onChange(value)}
                                />
                            )}
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
                {
                    showResult ? <Heatmap title="Cell interactions"
                                          data={result.current}
                                          xlabel={labels.current}
                                          ylabel={labels.current}
                                          legendText={['1', '-1']}
                                          min={-1}
                                          max={1}
                                          height={500}
                                          width={500}
                    /> : <></>
                }
            </OneItemCenter>
        </Stack>
    )

}

export default CellCellInteractionTab;