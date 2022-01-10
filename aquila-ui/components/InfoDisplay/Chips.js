import Chip from "@mui/material/Chip";

const LinkPool = {
    MIBI: "https://www.ionpath.com/",
    IMC: "https://www.fluidigm.com/applications/imaging-mass-cytometry",
    CODEX: "https://www.akoyabio.com/codex/",
    CyCIF: "https://www.cycif.org/",

    seqFISH: "https://www.seqfish.com/",
    osmFISH: "https://linnarssonlab.org/osmFISH/",
    MERFISH: "http://zhuang.harvard.edu/merfish.html",
};

export const TechChip = ({name}) => {
    return (
        <a href={LinkPool[name]} target="_blank" rel="noreferrer noopener" style={{textDecoration: "none"}}>
            <Chip
                variant="outlined"
                label={name}
                color="primary"
                size="small"
                sx={{
                    cursor: "pointer",
                }}
            />
        </a>
    )
}
