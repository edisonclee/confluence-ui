import PropTypes from "prop-types";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

export default function TransitionDashboardHeader({
  loading,
  onRunScan,
  scanTime,
  dashboardData,
}) {
  const signalCount = dashboardData.signals?.length ?? 0;

  return (
    <Box sx={{ mb: 3 }}>
      {/* =====================================================
          PAGE HEADER
          ===================================================== */}
      <Box
        sx={{
          width: "100%",
          mb: 2.5,

          display: "flex",
          alignItems: "center",
        }}
      >
        {/* LEFT */}
        <Box>
          <Typography
            sx={{
              color: "#55c9df",
              fontSize: "22px",
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            Transition Play Scanner
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "#91a4b8",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            Surface liquid markets shifting from compression
            to directional expansion, with normalized move
            strength and setup classification.
          </Typography>
        </Box>

        {/* RIGHT STATUS */}
        <Box
          sx={{
            ml: "auto",
            minWidth: 180,
            alignSelf: "center",
            textAlign: "right",
          }}
        >
          <Box
            sx={{
              width: "100%",

              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",

              gap: "7px",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                minWidth: 6,
                minHeight: 6,

                borderRadius: "50%",

                backgroundColor: "#55dfb0",

                boxShadow:
                  "0 0 7px rgba(85, 223, 176, 0.65)",
              }}
            />

            <Typography
              sx={{
                color: "#55dfb0",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                lineHeight: 1,
                textAlign: "right",
              }}
            >
              READY
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 0.7,

              color: "#62778c",

              fontFamily: "monospace",
              fontSize: "10px",
              lineHeight: 1,

              textAlign: "right",
              whiteSpace: "nowrap",
            }}
          >
            {scanTime
              ? `Last scan: ${new Date(
                  scanTime,
                ).toLocaleTimeString()}`
              : "No scan executed"}
          </Typography>
        </Box>
      </Box>

      {/* =====================================================
          SCAN CONTROL PANEL
          ===================================================== */}
      <Box
        sx={{
          width: "100%",

          border: "1px solid #26394a",
          borderRadius: "7px",

          backgroundColor: "#0d141c",

          px: 1.75,
          py: 1.5,
        }}
      >
        <Box
          sx={{
            minHeight: 46,

            display: "flex",
            alignItems: "center",

            gap: 2,
          }}
        >
          {/* DESCRIPTION */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: "#d7e5ed",
                fontSize: "13px",
                fontWeight: 600,
                lineHeight: 1.4,
              }}
            >
              Perpetual futures · RSI 70/30 on 1hr
              timeframe for the last 24 hrs
            </Typography>

            <Typography
              sx={{
                mt: 0.4,

                color: "#718798",

                fontSize: "11px",
                lineHeight: 1.4,
              }}
            >
              RSI 70/30 on 1hr timeframe ·{" "}
              {dashboardData.symbolsScanned ?? 0} symbols
              scanned
            </Typography>
          </Box>

          {/* RUN SCAN */}
          <Button
            variant="contained"
            onClick={onRunScan}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress
                  size={14}
                  color="inherit"
                />
              ) : (
                <PlayArrowIcon sx={{ fontSize: 16 }} />
              )
            }
            sx={{
              flexShrink: 0,

              minWidth: 112,
              width: 112,
              height: 40,

              px: 1.5,

              whiteSpace: "nowrap",

              fontSize: "12px",
              fontWeight: 700,

              textTransform: "none",

              backgroundColor: "#55c9df",
              color: "#071016",

              boxShadow: "none",

              "&:hover": {
                backgroundColor: "#69d3e6",
                boxShadow: "none",
              },

              "&:disabled": {
                backgroundColor: "#24424b",
                color: "#78909c",
              },
            }}
          >
            {loading ? "Scanning..." : "Run Scan"}
          </Button>
        </Box>
      </Box>

      {/* =====================================================
          SUMMARY STRIP
          ===================================================== */}
      <Box
        sx={{
          mt: 2,

          minHeight: 42,

          px: 1.5,
          py: 1,

          display: "flex",
          alignItems: "center",

          borderRadius: "6px",

          backgroundColor: "#103e48",

          border: "1px solid #164d58",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            width: "100%",
            flexWrap: "nowrap",
          }}
        >
          {/* SIGNAL COUNT */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              height: 22,

              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                minWidth: 6,
                minHeight: 6,

                borderRadius: "50%",

                backgroundColor: "#55c9df",

                mr: 0.8,
              }}
            />

            <Typography
              sx={{
                color: "#e0f8ff",

                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: 700,

                lineHeight: 1,
              }}
            >
              {signalCount}
            </Typography>

            <Typography
              sx={{
                ml: 0.7,

                color: "#c0d5df",

                fontSize: "13px",
                lineHeight: 1,
              }}
            >
              transition plays detected
            </Typography>
          </Box>

          {/* SEPARATOR */}
          <Typography
            sx={{
              color: "#52717d",
              fontSize: "13px",
            }}
          >
            ·
          </Typography>

          {/* DURATION */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",

              whiteSpace: "nowrap",
            }}
          >
            <Typography
              sx={{
                color: "#e0f8ff",

                fontFamily: "monospace",
                fontSize: "13px",
                fontWeight: 700,

                lineHeight: 1,
              }}
            >
              {Number(
                dashboardData.durationSeconds ?? 0,
              ).toFixed(2)}
              s
            </Typography>

            <Typography
              sx={{
                ml: 0.7,

                color: "#c0d5df",

                fontSize: "13px",
                lineHeight: 1,
              }}
            >
              duration
            </Typography>
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* SYMBOL COUNT */}
          <Typography
            sx={{
              color: "#8fa6b5",

              fontFamily: "monospace",
              fontSize: "11px",

              whiteSpace: "nowrap",
            }}
          >
            {dashboardData.symbolsScanned ?? 0} symbols
            scanned
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}

TransitionDashboardHeader.propTypes = {
  loading: PropTypes.bool.isRequired,

  onRunScan: PropTypes.func.isRequired,

  scanTime: PropTypes.string,

  dashboardData: PropTypes.object.isRequired,
};