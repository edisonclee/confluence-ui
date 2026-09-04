import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#1976d2",
    },

    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
  },
});

export default theme;
