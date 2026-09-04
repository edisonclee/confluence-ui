import { useState } from "react";

import Container from "@mui/material/Container";

import { runTransitionScanner } from "../api/transitionScannerApi";

import TransitionDashboardHeader from "../components/TransitionDashboardHeader";
import TransitionResultTable from "../components/TransitionResultTable";
import LoadingOverlay from "../components/LoadingOverlay";

export default function TransitionDashboard() {
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState({
    scanTime: null,

    durationSeconds: 0,

    symbolsScanned: 0,

    signals: [],
  });

  async function handleRunScanner() {
    try {
      setLoading(true);

      const response = await runTransitionScanner();

      setDashboardData(response);
    } catch (error) {
      console.error(error);

      alert("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container
      maxWidth="xl"

      sx={{
        mt: 4,
        mb: 4,
      }}
    >
      <TransitionDashboardHeader
        loading={loading}

        onRunScan={handleRunScanner}

        scanTime={dashboardData.scanTime}

        dashboardData={dashboardData}
      />

      <TransitionResultTable results={dashboardData.signals} />

      <LoadingOverlay open={loading} />
    </Container>
  );
}
