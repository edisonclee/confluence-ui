import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#55c9df",
      contrastText: "#071117",
    },

    success: {
      main: "#52d6a5",
    },

    error: {
      main: "#ff6b72",
    },

    warning: {
      main: "#e6bd69",
    },

    info: {
      main: "#55c9df",
    },

    background: {
      default: "#080d12",
      paper: "#0e151d",
    },

    text: {
      primary: "#e7edf2",
      secondary: "#7f8d9a",
    },

    divider: "#253341",
  },

  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

    h1: {
      fontWeight: 750,
    },

    h2: {
      fontWeight: 750,
    },

    h3: {
      fontWeight: 750,
    },

    h4: {
      fontWeight: 750,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 700,
    },

    button: {
      textTransform: "none",
      fontWeight: 650,
    },
  },

  shape: {
    borderRadius: 8,
  },

  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },

      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#253341",
        },
      },
    },
  },
});

export default theme;