import {useEffect, useRef, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import LeftPanel from "../../Layout/LeftPanel";
import SectionTitleWrap from "../../InputComponents/SectionTitleWrap";
import ParamWrap from "../../InputComponents/ParamWrap";
import Selector from "../../InputComponents/Selector";
import Ranger from "../../InputComponents/Ranger";
import Stack from "@mui/material/Stack";
import SubmitButton from "../../InputComponents/SubmitButton";
import OneItemCenter from "../../Layout/OneItemCenter";
import {runRipley} from "../../../data/post";
import axios from "axios";
import LineChart from "../../Viz/LineChart";
import SectionExplainer from "../../InputComponents/SectionExplainer";


const ExpViz = ({data}) => {
    const categories = [];
    const xdata = data[0].distance.map((i) => i.toFixed(2));
    const plotData = data.map((r) => {
        categories.push(r.type)
        return {
            name: r.type,
            value: r.value
        }
    })

    return <LineChart title={"Ripley Statistics"} data={plotData} categories={categories} xdata={xdata}
    />
}


const methods = [
    {value: 'F', label: 'F Function'},
    {value: 'G', label: 'G Function'},
    {value: 'K', label: 'K Function'},
    {value: 'L', label: 'L Function'}
]

const defaultValues = {
    method: "K",
    support: 10,
}


const RipleyTab = ({cellData}) => {
    const [showResult, setShowResult] = useState(0);
    const [runStatus, setRunStatus] = useState(false);
    const {handleSubmit, formState: {errors, isValid}, watch, control} = useForm({
        defaultValues,
    });

    const result = useRef({});

    useEffect(() => {
        setShowResult(0);
    }, [cellData]);

    const handleRun = (data) => {
        axios.post(runRipley, {
            method: data.method,
            support: data.support,
            x: cellData.cell_x,
            y: cellData.cell_y,
            types: cellData.cell_type
        }).then((res) => {
            result.current = res.data
            //console.log(result.current)
            setShowResult(showResult + 1)
        })
    }

    return <Stack direction="row" sx={{height: '100%'}}>
        <form onSubmit={handleSubmit(handleRun)}>
            <LeftPanel>

                <SectionExplainer title={"Distance basis spatial pattern"}
                    details={"The Ripley functions are a series of cumulative distribution functions describe " +
                        "the underlying spatial process given the spatial interval."}
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
                                            <li>F: Point-event</li>
                                            <li>G: Event-to-event</li>
                                            <li>K: Inter-event</li>
                                            <li>L: Scaled K</li>
                                        </>
                                    }
                                    {...field}/>
                            )
                        }}
                    />
                </ParamWrap>

                <ParamWrap>
                    <Controller
                        name="support"
                        control={control}
                        render={({field}) => (
                            <Ranger
                                {...field}
                                min={5} max={20} step={1}
                                title={"Support"}
                                description={"Number of distance interval to take"}
                                onChange={(_, value) => field.onChange(value)}
                            />
                        )}
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
}

export default RipleyTab;