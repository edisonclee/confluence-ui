import { Stack, Typography } from "@mui/material";

function Metric({ label, value }) {
  return (
    <Stack
      direction="row"

      spacing={0.5}
    >
      <Typography fontWeight={600}>{value}</Typography>

      <Typography
        variant="caption"

        color="text.secondary"
      >
        {label}
      </Typography>
    </Stack>
  );
}

export default function TransitionSummaryCard({
  scanTime,

  durationSeconds,

  symbolsScanned,

  signals,
}) {
  return (
    <Stack
      direction="row"

      spacing={3}
    >
      <Metric
        label="Last Scan"

        value={scanTime ? new Date(scanTime).toLocaleTimeString() : "--"}
      />

      <Metric
        label="Duration"

        value={`${durationSeconds.toFixed(1)}s`}
      />

      <Metric
        label="Symbols"

        value={symbolsScanned}
      />

      <Metric
        label="Signals"

        value={signals.length}
      />
    </Stack>
  );
}
