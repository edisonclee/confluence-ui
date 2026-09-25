import { Box, Stack, Typography } from "@mui/material";

function Metric({ value, label, strong = false }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.7}
      sx={{ whiteSpace: "nowrap" }}
    >
      <Typography
        sx={{
          color: strong ? "#d9f7ff" : "#d0e0ea",
          fontFamily: "monospace",
          fontSize: "12px",
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          color: "#8ca2b4",
          fontSize: "12px",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
    </Stack>
  );
}

export default function SummaryCard({
  symbolsScanned,
  totalMatches,
  multiTimeframeMatches,
  performance,
  timeframeCount,
}) {
  return (
    <Box
      sx={{
        minHeight: 40,
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
        spacing={2}
        sx={{
          width: "100%",
          flexWrap: "nowrap",
        }}
      >
        {/* MATCHES */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: 20,
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
              flexShrink: 0,
              mr: 0.8,
            }}
          />

          <Typography
            sx={{
              color: "#e0f8ff",
              fontFamily: "monospace",
              fontSize: "12px",
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            {totalMatches}
          </Typography>

          <Typography
            sx={{
              ml: 0.7,
              color: "#c0d5df",
              fontSize: "12px",
              lineHeight: 1,
            }}
          >
            markets matched
          </Typography>
        </Box>

        {/* SEPARATOR */}
        <Typography
          sx={{
            color: "#52717d",
            fontSize: "12px",
          }}
        >
          ·
        </Typography>

        {/* TIMEFRAMES */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.7}
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          <Typography
            sx={{
              color: "#e0f8ff",
              fontFamily: "monospace",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {timeframeCount}
          </Typography>

          <Typography
            sx={{
              color: "#c0d5df",
              fontSize: "12px",
            }}
          >
            timeframes
          </Typography>
        </Stack>

        {/* SEPARATOR */}
        <Typography
          sx={{
            color: "#52717d",
            fontSize: "12px",
          }}
        >
          ·
        </Typography>

        {/* SYMBOLS */}
        <Metric
          value={symbolsScanned}
          label="symbols scanned"
        />

        <Box sx={{ flex: 1 }} />

        {/* PERFORMANCE */}
        {performance && (
          <Typography
            sx={{
              color: "#718b98",
              fontFamily: "monospace",
              fontSize: "10px",
              whiteSpace: "nowrap",
            }}
          >
            Completed in {performance.totalSeconds.toFixed(2)}s
          </Typography>
        )}
      </Stack>
    </Box>
  );
}