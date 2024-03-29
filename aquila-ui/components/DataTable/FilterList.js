import Box from "@mui/material/Box";
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import {memo, startTransition, useCallback, useRef, useState} from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import {Counter} from '../compute/math';

const FilterTitle = () => {
    return <Stack direction="row" alignItems="center">
        <Typography>Filter</Typography>
        <FilterListIcon/>
    </Stack>
}

const FilterTitleMemo = memo(FilterTitle);

const FilterItemText = ({item, count}) => {
    return <Box sx={{display: 'flex'}}>
        <Typography color="rgba(22,22,22,0.8)" sx={{mr: 1}}>{item}</Typography>
        <Typography color="grass" fontWeight="500">{`(${count})`}</Typography>
    </Box>
}


const FilterGroup = ({title, field, counter, filter, showLess, checkedList, updateOnChange}) => {
    // console.log(field)
    // console.log(counter)
    let ItemList = Object.entries(counter).sort((a, b) => b[1] - a[1])
    // .sort((a, b) => a[0].localeCompare(b[0]))
    if (showLess) {
        ItemList = ItemList.slice(0, 12)
    }

    return (
        <Stack direction="column">
            <FormControl component="fieldset" variant="standard">
                <FormLabel component="legend" sx={{
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: 'rgba(154,80,52,0.85)'
                }}>{title.toUpperCase()}</FormLabel>
                <Box sx={{
                    maxHeight: '390px',
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {display: 'none'},
                }}>
                    {(ItemList.length === 0) ? <Typography>{"No Item Found"}</Typography> :
                        <FormGroup>
                            {
                                ItemList.map(([k, v], i) => {
                                    return <FormControlLabel
                                        control={
                                            <Checkbox
                                                sx={{transform: 'scale(0.75)', p: 0.5, pl: 1}}
                                                size="small"
                                                icon={<RadioButtonUncheckedIcon/>}
                                                checkedIcon={<CheckCircleTwoToneIcon/>}
                                                checked={checkedList[k] ? checkedList[k] : false}
                                                onChange={(e) => {
                                                    const newObj = {...filter}
                                                    if (e.target.checked) {
                                                        newObj[field] = [k, ...filter[field]]
                                                    } else {
                                                        newObj[field] = filter[field].filter((i) => i !== k)
                                                    }
                                                    updateOnChange(newObj, e.target.checked, k, field)
                                                    // updateFilter(newObj)
                                                    // updateCheckedList(k, e.target.checked)
                                                    // updateDataCounter(field)
                                                }}
                                            />
                                        }
                                        label={<FilterItemText item={k} count={v}/>}
                                        sx={{mb: 0.2}}
                                        key={i}
                                    />
                                })
                            }
                        </FormGroup>
                    }
                </Box>
                {
                    ((!showLess) && (ItemList.length > 12)) ? <Box sx={{
                        pt: 0.5,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderTop: 2,
                        borderTopStyle: 'dashed',
                        borderColor: '#bdbdbd',
                        color: '#757575',
                    }}>
                        <KeyboardDoubleArrowDownIcon/>
                        {/*<Typography variant="caption">Scroll</Typography>*/}
                    </Box> : null
                }
            </FormControl>
        </Stack>)
}

const getDataCounter = (data) => {

    const species = [];
    const technology = [];
    const organ = [];
    const disease = [];
    const dimension = [];
    const molecule = [];
    const hasCellType = [];

    data.map((r) => {
        species.push(r.species)
        technology.push(r.technology)
        organ.push(r.organ)
        disease.push(r.disease)
        dimension.push(r.is_3d ? '3D' : '2D')
        molecule.push(r.molecule)
        hasCellType.push(r.has_cell_type ? 'Yes' : 'No')
    })

    return {
        species: new Counter(species),
        technology: new Counter(technology),
        organ: new Counter(organ),
        disease: new Counter(disease),
        dimension: new Counter(dimension),
        molecule: new Counter(molecule),
        'Cell Type': new Counter(hasCellType)
    }
}


const filterInitState = {
    species: [],
    technology: [],
    organ: [],
    disease: [],
    dimension: [],
    molecule: [],
    'Cell Type': []
}


const checkedFieldInitState = {
    species: {},
    dimension: {},
    molecule: {},
    technology: {},
    organ: {},
    disease: {},
    'Cell Type': []
}

const FilterList = ({data, updateDataFn}) => {

    const [showLess, setShowLess] = useState(true)
    const [filter, setFilter] = useState({...filterInitState})
    const [checkedList, setCheckedList] = useState({});
    const checkedFields = useRef({...checkedFieldInitState});
    const lastCheckedField = useRef(null)

    const updateCheckedList = (item, value) => {
        const newCheckedList = {...checkedList}
        newCheckedList[item] = value
        setCheckedList(newCheckedList)
    }

    const updateCheckedFields = (field, item, value) => {
        const newCheckedFields = {...checkedFields.current}
        lastCheckedField.current = field
        newCheckedFields[field][item] = value
        checkedFields.current = newCheckedFields
    }
    const getCheckedField = () => checkedFields.current;
    const getLastCheckedField = () => lastCheckedField.current;

    const [dataCounter, setDataCounter] = useState(getDataCounter(data));
    const updateDataCounter = (filteredData) => {
        // console.log("Updating data counter", filteredData.length)
        const newCounter = getDataCounter(filteredData);
        const cf = getCheckedField();
        const lf = getLastCheckedField();
        Object.entries(cf).map(([field, checkedStatus]) => {
            let count = 0;
            Object.values(checkedStatus).forEach((a) => {
                if (a) {
                    count += 1
                }
            })
            if (count > 0) {
                if (field === lf) {
                    newCounter[field] = dataCounter[field]
                } else {
                    // const copyFieldCount = {...newCounter[field]}
                    // // newCounter[field] = dataCounter[field]
                    // Object.entries(checkedStatus).map(([item, value]) => {
                    //     if (value) {
                    //         newCounter[field][item] = copyFieldCount[item]
                    //     }
                    // })
                }

            }
        })
        setDataCounter(newCounter)
    }

    const showButtonText = showLess ? "More Filters" : "Less Filters"

    const filterData = useCallback((data, filter) => {
        console.log(filter)
        return data.filter((r) => {
            const passFilterSpecies = (filter.species.length > 0) ? filter.species.includes(r.species) : true;
            const passFilterTech = (filter.technology.length > 0) ? filter.technology.includes(r.technology) : true;
            const passFilterOrgan = (filter.organ.length > 0) ? filter.organ.includes(r.organ) : true;
            const passFilterDisease = (filter.disease.length > 0) ? filter.disease.includes(r.disease) : true;
            const passFilterDimension = (filter.dimension.length > 0) ? filter.dimension.includes(r.is_3d ? '3D' : '2D') : true;
            const passFilterMolecule = (filter.molecule.length > 0) ? filter.molecule.includes(r.molecule) : true;
            const passFilterCellType = (filter['Cell Type'].length > 0) ? filter['Cell Type'].includes(r.has_cell_type ? 'Yes' : 'No') : true;

            return (passFilterSpecies && passFilterTech && passFilterOrgan
                && passFilterDisease && passFilterDimension && passFilterMolecule && passFilterCellType)
        })
    }, [])

    const updateOnChange = (v, checked, item, field) => {
        setFilter(v);
        updateCheckedFields(field, item, checked)
        startTransition(() => {

            let conditionsCount = 0;

            Object.values(v).map((i) => {
                conditionsCount += i.length
            })
            if (conditionsCount === 0) {
                updateDataFn(data)
                updateDataCounter(data)
            } else {
                const filteredData = filterData(data, v)
                updateDataFn(filteredData)
                updateDataCounter(filteredData)
            }
            updateCheckedList(item, checked)

        })

        // console.log("call update data")
    }

    return (
        <div>
            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                <Stack direction="row" spacing={6}>
                    <Stack direction="column" justifyContent="flex-start" spacing={1}>
                        {
                            ['species'].map((f, i) => {
                                return <FilterGroup field={f} title={f} counter={dataCounter[f]}
                                                    filter={filter} checkedList={checkedList} key={i}
                                                    updateOnChange={updateOnChange}

                                />
                            })
                        }
                    </Stack>

                    {
                        ['technology', 'organ', 'disease'].map((f, i) => {
                            return <FilterGroup field={f} title={f} counter={dataCounter[f]}
                                                filter={filter} showLess={showLess} checkedList={checkedList} key={i}
                                                updateOnChange={updateOnChange}
                            />
                        })
                    }
                    <Stack direction="column" justifyContent="flex-start" spacing={2}>
                        {
                            ['dimension', 'molecule', 'Cell Type'].map((f, i) => {
                                return <FilterGroup field={f} title={f} counter={dataCounter[f]}
                                                    filter={filter} checkedList={checkedList} key={i}
                                                    updateOnChange={updateOnChange}

                                />
                            })
                        }
                    </Stack>
                </Stack>

            </Box>
            <Box sx={{display: 'flex', justifyContent: "center"}}>
                <Button sx={{color: "secondary.main"}}
                        onClick={() => setShowLess(!showLess)}
                        startIcon={showLess ? <KeyboardArrowDownIcon/> : <KeyboardArrowUpIcon/>}
                >
                    {showButtonText}
                </Button>
                <Button sx={{color: "error"}}
                        onClick={() => {
                            setFilter({...filterInitState})
                            setCheckedList({})
                            checkedFields.current = {...checkedFieldInitState}
                            lastCheckedField.current = null
                            updateDataFn(data)
                            updateDataCounter(data)
                        }}
                        endIcon={<ClearIcon/>}
                >
                    Clear All
                </Button>
            </Box>
        </div>

    )


}

export default FilterList;