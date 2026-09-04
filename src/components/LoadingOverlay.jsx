import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

export default function LoadingOverlay({ open }) {
  return (
    <Backdrop
      open={open}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1000,
      }}
    >
      <Box textAlign="center">
        <CircularProgress color="inherit" size={60} />

        <Typography variant="h5" sx={{ mt: 3 }}>
          Scanning Market...
        </Typography>

        <Typography variant="body2" sx={{ mt: 1 }}>
          Please wait while all symbols are being analyzed.
        </Typography>
      </Box>
    </Backdrop>
  );
}
