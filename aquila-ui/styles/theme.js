import {createTheme, responsiveFontSizes} from "@mui/material/styles";
import {lightBlue, orange} from "@mui/material/colors";

// Create a theme instance.
let theme = createTheme({
    typography: {
      fontFamily: '"IBM Plex Sans", -apple-system, sans-serif'
    },
    palette: {
        primary: orange,
        secondary: lightBlue,
        grass: '#838A2D'
    },
});

theme = responsiveFontSizes(theme);

export default theme;