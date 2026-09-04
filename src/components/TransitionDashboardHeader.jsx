import PropTypes from "prop-types";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
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
  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={600}>
          Transition Scanner
        </Typography>

        <Button
          variant="contained"
          startIcon={<PlayArrowIcon />}
          onClick={onRunScan}
          disabled={loading}
        >
          Run Scan
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Last Scan"
            value={scanTime ? new Date(scanTime).toLocaleString() : "-"}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="Duration"
            value={`${dashboardData.durationSeconds.toFixed(2)} sec`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Symbols" value={dashboardData.symbolsScanned} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard title="Signals" value={dashboardData.signals.length} />
        </Grid>
      </Grid>
    </Box>
  );
}

function SummaryCard({ title, value }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>

        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

TransitionDashboardHeader.propTypes = {
  loading: PropTypes.bool.isRequired,

  onRunScan: PropTypes.func.isRequired,

  scanTime: PropTypes.string,

  dashboardData: PropTypes.object.isRequired,
};
