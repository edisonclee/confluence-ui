import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import {
  getAllOiRadarResults,
  scanOiRadar,
} from "../api/oiRadarApi";

const PAGE_SIZE = 20;

const MARKET_CAP_PRESETS = {
  all: {
    label: "All",
    min: "",
    max: "",
  },
  micro: {
    label: "Micro Cap",
    min: "",
    max: "50000000",
  },
  small: {
    label: "Small Cap",
    min: "50000000",
    max: "250000000",
  },
  mid: {
    label: "Mid Cap",
    min: "250000000",
    max: "1000000000",
  },
  large: {
    label: "Large Cap",
    min: "1000000000",
    max: "10000000000",
  },
  mega: {
    label: "Mega Cap",
    min: "10000000000",
    max: "",
  },
};

function formatNumber(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatPercent(value, decimals = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return `${Number(value).toFixed(decimals)}%`;
}

function formatFunding(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  return `${(Number(value) * 100).toFixed(4)}%`;
}

function formatMarketCap(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "-";
  }

  const number = Number(value);

  if (number >= 1_000_000_000) {
    return `$${(number / 1_000_000_000).toFixed(2)}B`;
  }

  if (number >= 1_000_000) {
    return `$${(number / 1_000_000).toFixed(2)}M`;
  }

  if (number >= 1_000) {
    return `$${(number / 1_000).toFixed(2)}K`;
  }

  return `$${number.toFixed(0)}`;
}

function getScoreColor(score) {
  if (score >= 80) {
    return "success.main";
  }

  if (score >= 60) {
    return "warning.main";
  }

  if (score >= 40) {
    return "info.main";
  }

  return "text.secondary";
}

function getStatusColor(status) {
  switch (status) {
    case "Momentum":
      return "success.main";

    case "Building":
      return "warning.main";

    case "Waking Up":
      return "info.main";

    case "Crowded":
      return "error.main";

    default:
      return "text.secondary";
  }
}

function detectPreset(min, max) {
  const entries = Object.entries(MARKET_CAP_PRESETS);

  for (const [key, preset] of entries) {
    if (preset.min === min && preset.max === max) {
      return key;
    }
  }

  return "custom";
}

export default function OiRadar() {
  const [results, setResults] = useState([]);
  const [scanMeta, setScanMeta] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [hasScanned, setHasScanned] = useState(false);

  const [search, setSearch] = useState("");
  const [minimumScore, setMinimumScore] = useState(0);

  const [marketCapPreset, setMarketCapPreset] = useState("all");
  const [minimumMarketCap, setMinimumMarketCap] = useState("");
  const [maximumMarketCap, setMaximumMarketCap] = useState("");

  const [page, setPage] = useState(0);

  /**
   * Scan the radar once, then load the complete cached dataset.
   *
   * POST /scan performs the expensive scan.
   * GET /api/oi-radar?page=N only reads the backend cache.
   */
  const handleScan = async () => {
    try {
      setLoading(true);
      setError("");

      const firstPage = await scanOiRadar();

      const allResults = await getAllOiRadarResults(firstPage);

      const sortedResults = [...allResults].sort((a, b) => {
        const scoreDifference =
          Number(b.radarScore || 0) - Number(a.radarScore || 0);

        if (scoreDifference !== 0) {
          return scoreDifference;
        }

        return String(a.symbol || "").localeCompare(
          String(b.symbol || "")
        );
      });

      setResults(sortedResults);
      setScanMeta(firstPage);
      setHasScanned(true);
      setPage(0);
    } catch (err) {
      console.error("OI Radar scan failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to scan OI Radar."
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset pagination whenever a filter changes.
   *
   * Filtering is performed against the complete scanned dataset,
   * not just the currently visible 20 rows.
   */
  useEffect(() => {
    setPage(0);
  }, [
    search,
    minimumScore,
    minimumMarketCap,
    maximumMarketCap,
  ]);

  const filteredResults = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const minScore = Number(minimumScore || 0);

    const minMarketCap =
      minimumMarketCap === ""
        ? null
        : Number(minimumMarketCap);

    const maxMarketCap =
      maximumMarketCap === ""
        ? null
        : Number(maximumMarketCap);

    return results.filter((item) => {
      const symbol = String(item.symbol || "").toLowerCase();

      if (
        normalizedSearch &&
        !symbol.includes(normalizedSearch)
      ) {
        return false;
      }

      const score = Number(item.radarScore || 0);

      if (score < minScore) {
        return false;
      }

      const marketCap =
        item.marketCap === null ||
        item.marketCap === undefined
          ? null
          : Number(item.marketCap);

      if (minMarketCap !== null) {
        if (marketCap === null || marketCap < minMarketCap) {
          return false;
        }
      }

      if (maxMarketCap !== null) {
        if (marketCap === null || marketCap >= maxMarketCap) {
          return false;
        }
      }

      return true;
    });
  }, [
    results,
    search,
    minimumScore,
    minimumMarketCap,
    maximumMarketCap,
  ]);

  const totalPages = Math.ceil(
    filteredResults.length / PAGE_SIZE
  );

  const currentPage = Math.min(
    page,
    Math.max(totalPages - 1, 0)
  );

  const visibleResults = useMemo(() => {
    const startIndex = currentPage * PAGE_SIZE;

    return filteredResults.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [filteredResults, currentPage]);

  const handleMarketCapPresetChange = (event) => {
    const value = event.target.value;

    setMarketCapPreset(value);

    if (value === "custom") {
      return;
    }

    const preset = MARKET_CAP_PRESETS[value];

    if (!preset) {
      return;
    }

    setMinimumMarketCap(preset.min);
    setMaximumMarketCap(preset.max);
  };

  const handleMinimumMarketCapChange = (event) => {
    const value = event.target.value;

    setMinimumMarketCap(value);

    setMarketCapPreset(
      detectPreset(value, maximumMarketCap)
    );
  };

  const handleMaximumMarketCapChange = (event) => {
    const value = event.target.value;

    setMaximumMarketCap(value);

    setMarketCapPreset(
      detectPreset(minimumMarketCap, value)
    );
  };

  const handlePreviousPage = () => {
    setPage((current) => Math.max(current - 1, 0));
  };

  const handleNextPage = () => {
    setPage((current) =>
      Math.min(current + 1, Math.max(totalPages - 1, 0))
    );
  };

  const formatGeneratedAt = () => {
    if (!scanMeta?.generatedAt) {
      return null;
    }

    const date = new Date(scanMeta.generatedAt);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleString();
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            OI Radar
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Detecting futures activity using open interest,
            volume, price, and funding data.
          </Typography>

          {scanMeta?.generatedAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.5 }}
            >
              Last scan: {formatGeneratedAt()}
            </Typography>
          )}
        </Box>

        <Button
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress
                size={18}
                color="inherit"
              />
            ) : (
              <RefreshIcon />
            )
          }
          onClick={handleScan}
          disabled={loading}
        >
          {loading ? "Scanning..." : "Scan"}
        </Button>
      </Stack>

      {error && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            border: "1px solid",
            borderColor: "error.main",
          }}
        >
          <Typography color="error">
            {error}
          </Typography>
        </Paper>
      )}

      {!hasScanned && !loading && (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            OI Radar is ready
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Click Scan to search the futures market.
          </Typography>
        </Paper>
      )}

      {loading && (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >
          <CircularProgress sx={{ mb: 2 }} />

          <Typography variant="h6">
            Scanning futures market...
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Collecting and calculating radar scores.
          </Typography>
        </Paper>
      )}

      {hasScanned && !loading && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Stack
              direction={{
                xs: "column",
                md: "row",
              }}
              spacing={2}
              alignItems={{
                xs: "stretch",
                md: "center",
              }}
            >
              <TextField
                label="Search Coin"
                placeholder="BTC, ETH..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                size="small"
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 180,
                  },
                }}
              />

              <FormControl
                size="small"
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 150,
                  },
                }}
              >
                <InputLabel>
                  Minimum Score
                </InputLabel>

                <Select
                  value={minimumScore}
                  label="Minimum Score"
                  onChange={(event) =>
                    setMinimumScore(
                      Number(event.target.value)
                    )
                  }
                >
                  <MenuItem value={0}>All</MenuItem>
                  <MenuItem value={40}>40+</MenuItem>
                  <MenuItem value={60}>60+</MenuItem>
                  <MenuItem value={80}>80+</MenuItem>
                </Select>
              </FormControl>

              <FormControl
                size="small"
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 160,
                  },
                }}
              >
                <InputLabel>
                  Market Cap
                </InputLabel>

                <Select
                  value={marketCapPreset}
                  label="Market Cap"
                  onChange={handleMarketCapPresetChange}
                >
                  <MenuItem value="all">
                    All
                  </MenuItem>

                  <MenuItem value="micro">
                    Micro Cap
                  </MenuItem>

                  <MenuItem value="small">
                    Small Cap
                  </MenuItem>

                  <MenuItem value="mid">
                    Mid Cap
                  </MenuItem>

                  <MenuItem value="large">
                    Large Cap
                  </MenuItem>

                  <MenuItem value="mega">
                    Mega Cap
                  </MenuItem>

                  <MenuItem value="custom">
                    Custom
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Min Market Cap"
                type="number"
                size="small"
                value={minimumMarketCap}
                onChange={
                  handleMinimumMarketCapChange
                }
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 160,
                  },
                }}
                inputProps={{
                  min: 0,
                }}
              />

              <TextField
                label="Max Market Cap"
                type="number"
                size="small"
                value={maximumMarketCap}
                onChange={
                  handleMaximumMarketCapChange
                }
                sx={{
                  minWidth: {
                    xs: "100%",
                    md: 160,
                  },
                }}
                inputProps={{
                  min: 0,
                }}
              />
            </Stack>
          </Paper>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Showing{" "}
              {filteredResults.length === 0
                ? 0
                : currentPage * PAGE_SIZE + 1}
              -
              {Math.min(
                (currentPage + 1) * PAGE_SIZE,
                filteredResults.length
              )}{" "}
              of {filteredResults.length}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              {scanMeta?.totalResults ?? 0} scanned
            </Typography>
          </Stack>

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Coin</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Price</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Market Cap</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Vol 1H</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Vol 4H</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>OI 1H</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>OI 4H</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Price 1H</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Funding</strong>
                  </TableCell>

                  <TableCell align="right">
                    <strong>Score</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleResults.map((item) => (
                  <TableRow
                    key={item.symbol}
                    hover
                  >
                    <TableCell>
                      <Typography fontWeight={600}>
                        {item.symbol}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      {formatNumber(item.price, 6)}
                    </TableCell>

                    <TableCell align="right">
                      {formatMarketCap(
                        item.marketCap
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatNumber(
                        item.volume1h,
                        0
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatNumber(
                        item.volume4h,
                        0
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatPercent(
                        item.openInterestChange1h,
                        2
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatPercent(
                        item.openInterestChange4h,
                        2
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatPercent(
                        item.priceChange1h,
                        2
                      )}
                    </TableCell>

                    <TableCell align="right">
                      {formatFunding(
                        item.fundingRate
                      )}
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        color: getScoreColor(
                          Number(item.radarScore || 0)
                        ),
                      }}
                    >
                      {formatNumber(
                        item.radarScore,
                        0
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          color: getStatusColor(
                            item.status
                          ),
                        }}
                      >
                        {item.status || "-"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}

                {visibleResults.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={11}
                      align="center"
                      sx={{ py: 5 }}
                    >
                      <Typography
                        color="text.secondary"
                      >
                        No results match the
                        current filters.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 0 && (
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              sx={{ mt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
              >
                Previous
              </Button>

              <Typography variant="body2">
                Page {currentPage + 1} of{" "}
                {totalPages}
              </Typography>

              <Button
                variant="outlined"
                onClick={handleNextPage}
                disabled={
                  currentPage >= totalPages - 1
                }
              >
                Next
              </Button>
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}