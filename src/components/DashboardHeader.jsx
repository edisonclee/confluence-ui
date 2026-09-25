import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import SummaryCard from "./SummaryCard";
import ScannerFilters from "./ScannerFilters";

export default function DashboardHeader({
  loading,
  onRunScan,
  generatedAt,
  isCachedResult,
  dashboardData,
  filters,
  setFilters,
  bbTimeframes,
  setBbTimeframes,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      {/* =========================================
          PAGE HEADER
          ========================================= */}
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          width: "100%",
          mb: 2.5,
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
            BB50 Touch Scanner
          </Typography>

          <Typography
            sx={{
              mt: 0.7,
              color: "#91a4b8",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            Find markets touching the 50-period Bollinger basis across
            selected timeframes, filtered by normalized band width.
          </Typography>
        </Box>

        {/* RIGHT */}
        <Box
          sx={{
            ml: "auto",
            minWidth: 150,
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
                boxShadow: "0 0 7px rgba(85, 223, 176, 0.65)",
              }}
            />

            <Typography
              sx={{
                color: "#55dfb0",
                fontSize: "11px",
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
              mt: 0.6,
              color: "#62778c",
              fontFamily: "monospace",
              fontSize: "9px",
              lineHeight: 1,
              textAlign: "right",
              whiteSpace: "nowrap",
            }}
          >
            {generatedAt
              ? `Last scan: ${new Date(generatedAt).toLocaleTimeString()}`
              : "No scan executed"}
          </Typography>
        </Box>
      </Stack>

      {/* =========================================
          FILTER PANEL
          ========================================= */}
      <Box
        sx={{
          border: "1px solid #26394a",
          borderRadius: "7px",
          backgroundColor: "#0d141c",
          px: 1.5,
          py: 2,
          mb: 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-end"
          spacing={2}
          sx={{
            width: "100%",
            flexWrap: "nowrap",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <ScannerFilters
              filters={filters}
              setFilters={setFilters}
              bbTimeframes={bbTimeframes}
              setBbTimeframes={setBbTimeframes}
            />
          </Box>

          <Button
            variant="contained"
            onClick={onRunScan}
            disabled={loading || bbTimeframes.length === 0}
            startIcon={
              loading ? (
                <CircularProgress
                  size={14}
                  color="inherit"
                />
              ) : null
            }
            sx={{
              flexShrink: 0,
              minWidth: 112,
              width: 112,
              height: 40,
              px: 1.5,
              whiteSpace: "nowrap",
              fontSize: "11px",
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
        </Stack>
      </Box>

      {/* =========================================
          SUMMARY
          ========================================= */}
      <SummaryCard
        symbolsScanned={dashboardData.symbolsScanned}
        totalMatches={dashboardData.totalMatches}
        multiTimeframeMatches={dashboardData.multiTimeframeMatches}
        performance={dashboardData.performance}
        timeframeCount={bbTimeframes.length}
      />
    </Box>
  );
}