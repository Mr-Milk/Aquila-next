import Pie from "components/Viz/Pie";
import OneItemCenter from "../../OneItemCenter";

const CellComponentTab = ({cellData}) => {

    if (!cellData) {return null}

    return (
        <OneItemCenter>
            <Pie
                arr={cellData.cell_type}
                height="350px"
                width="350px"
                title="Cell components"
            />
        </OneItemCenter>
    )
}

export default CellComponentTab;