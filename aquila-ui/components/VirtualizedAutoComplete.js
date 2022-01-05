import TextField from "@mui/material/TextField";
import Autocomplete, {autocompleteClasses} from "@mui/material/Autocomplete";
import useMediaQuery from "@mui/material/useMediaQuery";
import Popper from "@mui/material/Popper";
import {styled, useTheme} from "@mui/material/styles";
import {VariableSizeList} from "react-window";
import Typography from "@mui/material/Typography";
import {createContext, forwardRef, useContext, useEffect, useRef} from "react";

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
        ...style,
        top: style.top + LISTBOX_PADDING
    };

    return (
        <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
            {dataSet[1]}
        </Typography>
    );
}

const OuterElementContext = createContext({});

const OuterElementType = forwardRef((props, ref) => {
    const outerProps = useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

// Adapter for react-window
const ListboxComponent = forwardRef(function ListboxComponent(
    props,
    ref
) {
    const { children, ...other } = props;
    const itemData = [];
    children.forEach((item) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
    });

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
        noSsr: true
    });

    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child) => {
        if (child.hasOwnProperty("group")) {
            return 48;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});

// ListboxComponent.propTypes = {
//     children: PropTypes.node
// };

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        boxSizing: "border-box",
        "& ul": {
            padding: 0,
            margin: 0
        }
    }
});

export default function VirtualizedAutoComplete({options, label, ...leftProps}) {
    return (
        <Autocomplete
            id="virtualized"
            size="small"
            disableListWrap
            disableClearable
            PopperComponent={StyledPopper}
            ListboxComponent={ListboxComponent}
            options={options}
            renderInput={(params) => <TextField variant="standard" {...params} label={label} />}
            renderOption={(props, option) => [props, option]}
            {...leftProps}
        />
    );
}
