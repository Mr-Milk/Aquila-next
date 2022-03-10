import Divider from "@mui/material/Divider";

const ParamWrap = ({show, children}) => {

    if (show === undefined) {
        show = true
    }
    const display = show ? 'block' : 'none';

    return (
        <>
            <div style={{display}}>
                {children}
            </div>
            <Divider style={{display}}/>
        </>
    )
}

export default ParamWrap;