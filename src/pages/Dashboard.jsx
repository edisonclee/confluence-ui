import { useEffect, useState } from "react";

import Container from "@mui/material/Container";

import { runScanner } from "../api/scannerApi";

import DashboardHeader from "../components/DashboardHeader";
import MultiTimeframeTable from "../components/MultiTimeframeTable";
import ResultTable from "../components/ResultTable";
import LoadingOverlay from "../components/LoadingOverlay";

import { filterTimeframes, filterMultiTimeframe } from "../utils/filterResults";

const BB_SCAN_CACHE_PREFIX = "confluence-scanner:bb-scan:";

function createEmptyDashboardData() {
  return {
    performance: null,
    generatedAt: null,
    symbolsScanned: 0,
    totalMatches: 0,
    multiTimeframeMatches: 0,
    multiTimeframe: [],
    timeframes: [],
  };
}

function getCacheKey(timeframes) {
  return `${BB_SCAN_CACHE_PREFIX}${[...timeframes].sort().join(",")}`;
}

function toDashboardData(response) {
  return {
    performance: {
      downloadSeconds: response.downloadSeconds,
      scanSeconds: response.scanSeconds,
      totalSeconds: response.totalSeconds,
    },
    generatedAt: response.generatedAt,
    symbolsScanned: response.symbolsScanned,
    totalMatches: response.totalMatches,
    multiTimeframeMatches: response.multiTimeframeMatches,
    multiTimeframe: response.multiTimeframe,
    timeframes: response.timeframes,
  };
}

export default function Dashboard() {
  const [loading, setLoading] = useState(false);

  const [dashboardData, setDashboardData] = useState(createEmptyDashboardData);

  const [isCachedResult, setIsCachedResult] = useState(false);

  const [filters, setFilters] = useState({
    coin: "",

    minBbWidth: "",
  });

  const [bbTimeframes, setBbTimeframes] = useState(["H1", "H4", "D1", "W1"]);

  useEffect(() => {
    const cacheKey = getCacheKey(bbTimeframes);

    try {
      const cachedValue = localStorage.getItem(cacheKey);

      if (cachedValue === null) {
        setDashboardData(createEmptyDashboardData());
        setIsCachedResult(false);
        return;
      }

      const cachedData = JSON.parse(cachedValue);

      if (!Array.isArray(cachedData.timeframes)) {
        throw new Error("Invalid cached BB scan result.");
      }

      setDashboardData(cachedData);
      setIsCachedResult(true);
    } catch (error) {
      console.warn("Unable to restore cached BB scan result.", error);
      localStorage.removeItem(cacheKey);
      setDashboardData(createEmptyDashboardData());
      setIsCachedResult(false);
    }
  }, [bbTimeframes]);

  const filteredTimeframes = filterTimeframes(
    dashboardData.timeframes,

    filters,
  );

  const filteredMultiTimeframe = filterMultiTimeframe(
    dashboardData.multiTimeframe,

    filters,
  );

  async function handleRunScanner() {
    try {
      setLoading(true);

      const response = await runScanner(bbTimeframes);

      const updatedDashboardData = toDashboardData(response);

      setDashboardData(updatedDashboardData);
      setIsCachedResult(false);

      localStorage.setItem(
        getCacheKey(bbTimeframes),
        JSON.stringify(updatedDashboardData),
      );
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
      <DashboardHeader
        loading={loading}

        onRunScan={handleRunScanner}

        generatedAt={dashboardData.generatedAt}

        isCachedResult={isCachedResult}

        dashboardData={dashboardData}

        filters={filters}

        setFilters={setFilters}

        bbTimeframes={bbTimeframes}

        setBbTimeframes={setBbTimeframes}
      />

      {filteredMultiTimeframe.length > 0 && (
        <MultiTimeframeTable results={filteredMultiTimeframe} />
      )}

      {filteredTimeframes.map((timeframe) => (
        <ResultTable
          key={timeframe.timeframe}

          title={`${timeframe.chartTimeframeDisplayName} Chart Timeframe | ${timeframe.bbTimeframeDisplayName} BB Timeframe`}

          results={timeframe.results}
        />
      ))}

      <LoadingOverlay open={loading} />
    </Container>
  );
}
