import axios from "axios";
import {runCellDistribution} from "data/post";
import Selector from "components/InputComponents/Selector";
import {useEffect, useRef, useState} from "react";
import NumericField from "components/InputComponents/NumberInput";
import Ranger from "../../InputComponents/Ranger";
import Stack from "@mui/material/Stack";
import OneItemCenter from "../../Layout/OneItemCenter";
import ParamWrap from "../../InputComponents/ParamWrap";
import {Controller, useForm} from "react-hook-form";
import {number, object} from "yup";
import {yupResolver} from '@hookform/resolvers/yup';
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import SubmitButton from "../../InputComponents/SubmitButton";
import Tree from "../../Viz/Tree";
import LeftPanel from "../../Layout/LeftPanel";
import {getDefaultR} from "../../compute/geo";
import SectionExplainer from "../../InputComponents/SectionExplainer";


const getRunBody = (cellData, userData) => {
    return {
        x: cellData.cell_x,
        y: cellData.cell_y,
        cell_type: cellData.cell_type,
        method: userData.method,
        pvalue: userData.pValue,
        r: userData.radius,
        resample: userData.times,
        quad: [userData.quad1, userData.quad2],
    }
}

const remakeData = (data) => {

    const noCellPattern = []
    const randomPattern = []
    const evenPattern = []
    const clusterPattern = []

    data.cell_type.forEach((ct, i) => {
        let pattern = data.pattern[i];
        let value = data.ix_value[i];
        let result = {name: ct, value};
        switch (pattern) {
            case 1:
                randomPattern.push(result)
                break
            case 2:
                evenPattern.push(result)
                break
            case 3:
                clusterPattern.push(result)
                break
            default:
                noCellPattern.push(result)
                break
        }
    })

    return {
        name: 'Distribution',
        children: [
            {
                name: 'NA',
                children: noCellPattern
            }, {
                name: 'Random',
                children: randomPattern
            },
            {
                name: 'Uniform',
                children: evenPattern
            },
            {
                name: 'Aggregate',
                children: clusterPattern
            }
        ]
    }
}


const methods = [
    {value: 'id', label: 'Index of Dispersion'},
    {value: 'morisita', label: 'Morisita Index'},
    {value: 'clark-evans', label: 'Clark-Evans Index'}
]

const defaultValues = {
    method: "id",
    radius: 10,
    times: 500,
    quad1: 10,
    quad2: 10,
    pValue: 0.05,
}

const schema = object({
    pValue: number().positive().lessThan(1),
    radius: number().positive(),
    quad1: number().positive().integer().lessThan(30),
    quad2: number().positive().integer().lessThan(30),
})


const CellDistributionTab = ({cellData, bbox}) => {

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

    const result = useRef({cell_type: [], ix_value: [], pattern: []});

    useEffect(() => {
        setShowResult(0);
    }, [cellData]);

    const handleRun = (data) => {
        //console.log(data)
        setRunStatus(true)
        const body = getRunBody(cellData, data);
        //console.log(body)
        axios.post(runCellDistribution, body).then((res) => {
            result.current = res.data;
            setShowResult(showResult + 1)
            setRunStatus(false)
        }).catch((e) => {
            //console.log(e)
            setRunStatus(false)
        })
    }

    if (cellData === undefined) {
        return null
    }
    return (
        <Stack direction="row" sx={{height: '100%'}}>
            <form onSubmit={handleSubmit(handleRun)}>
                <LeftPanel>
                    <SectionExplainer title={"Distribution pattern of cells"}
                                      details={"The distribution pattern suggests the spatial feature of a certain cell type. " +
                                          "The null hypothesis is that the cells are distributed randomly, " +
                                          "3 methods are provided to test it. Results in random, aggregation or uniform pattern."}/>
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
                                                <li>Index of dispersion: Random sampling</li>
                                                <li>Morisita of index: Quadratic statistic</li>
                                                <li>Clark-Evans Index: Nearest neighbors</li>
                                            </>
                                        }
                                        {...field}/>
                                )
                            }}
                        />
                    </ParamWrap>

                    <ParamWrap show={watchMethod === 'id'}>
                        <Controller
                            name="times"
                            control={control}
                            render={({field}) => (
                                <Ranger
                                    {...field}
                                    min={100} max={2000} step={100}
                                    title={"Repeat Times"}
                                    description={"Number of time to perform sampling"}
                                    onChange={(_, value) => field.onChange(value)}
                                />
                            )}
                        />
                    </ParamWrap>

                    <ParamWrap show={watchMethod === 'id'}>
                        <Controller
                            name="radius"
                            control={control}
                            render={({field}) => (
                                <NumericField
                                    title={"Radius"}
                                    error={!(errors.radius === undefined)}
                                    // placeholder="Sample Radius"
                                    helperText={"Positive Integer"}
                                    description={"The sampling radius"}
                                    {...field}
                                />
                            )}
                        />
                    </ParamWrap>

                    <ParamWrap show={watchMethod === 'morisita'}>
                        <Stack direction="row" spacing={2} sx={{minWidth: "300px"}}>
                            <Controller
                                name="quad1"
                                control={control}
                                render={({field}) => (
                                    <NumericField
                                        title={"Row Quadrats"}
                                        error={!(errors.quad1 === undefined)}
                                        // placeholder="Row Rectangle"
                                        helperText={"Positive Integer less than 30"}
                                        description={"Number of rectangles in each row"}
                                        {...field}
                                    />
                                )}
                            />
                            <Controller
                                name="quad2"
                                control={control}
                                render={({field}) => (
                                    <NumericField
                                        title={"Column Quadrats"}
                                        error={!(errors.quad2 === undefined)}
                                        // placeholder="Quadratic side 2"
                                        helperText={"Positive Integer less than 30"}
                                        description={"Number of rectangles in each column"}
                                        {...field}
                                    />
                                )}
                            />
                        </Stack>
                    </ParamWrap>

                    <ParamWrap>
                        <Controller
                            name="pValue"
                            control={control}
                            render={({field}) => {
                                return <NumericField
                                    {...field}
                                    title={"P-value"}
                                    error={!(errors.pValue === undefined)}
                                    placeholder="p value"
                                    helperText={"Number from 0 to 1"}
                                    description={"Threshold to determine significance"}
                                />
                            }}
                        />
                    </ParamWrap>

                    <SubmitButton disabled={(!isValid) || runStatus} text={runStatus ? "Working..." : "Run"}/>
                </LeftPanel>
            </form>
            <OneItemCenter>
                {
                    showResult !== 0 ? <Tree data={remakeData(result.current)}/> : null
                }

            </OneItemCenter>
        </Stack>
    )
}

export default CellDistributionTab;