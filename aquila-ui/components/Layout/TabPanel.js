import Box from "@mui/material/Box";
import {useEffect, useRef} from "react";

export function TabPanel(props) {
    const {children, value, index, roiID, ...other} = props;

    // we use a variable to track whether a page is open or not
    // this will lazy load the tabs, also suppress the echarts warning
    // if the <div> is set to display: none at the first draw, echarts will fail to get the DOM size
    // this will ensure the first render of a tab is set to display: block
    const visited = useRef(false);
    if (value === index) {
        visited.current = true
    }
    useEffect(() => {
        visited.current = false
    }, [roiID])

    if (visited.current) {
        return (
            <div
                role="tab-panel"
                style={{
                    display: value === index ? "block" : "none",
                    flexGrow: 2,
                }}
                {...other}
            >
                <Box sx={{ height: '100%'}}>
                    {children}
                </Box>
            </div>
        );
    } else {
        return <></>
    }
}
