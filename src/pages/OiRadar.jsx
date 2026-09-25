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
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "-";
  }

  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function formatPercent(value, decimals = 2) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "-";
  }

  return `${Number(value).toFixed(decimals)}%`;
}

function formatMarketCapInput(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "";
  }

  if (number >= 1_000_000_000) {
    const billions = number / 1_000_000_000;

    return Number.isInteger(billions)
      ? `${billions}B`
      : `${billions.toFixed(1)}B`;
  }

  if (number >= 1_000_000) {
    const millions = number / 1_000_000;

    return Number.isInteger(millions)
      ? `${millions}M`
      : `${millions.toFixed(1)}M`;
  }

  if (number >= 1_000) {
    const thousands = number / 1_000;

    return Number.isInteger(thousands)
      ? `${thousands}K`
      : `${thousands.toFixed(1)}K`;
  }

  return String(number);
}

function formatFunding(value) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
    return "-";
  }

  return `${(Number(value) * 100).toFixed(4)}%`;
}

function formatMarketCap(value) {
  if (
    value === null ||
    value === undefined ||
    Number.isNaN(Number(value))
  ) {
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
    if (
      preset.min === min &&
      preset.max === max
    ) {
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

  /*
   * These filters are applied AFTER the scan.
   */
  const [search, setSearch] = useState("");
  const [minimumScore, setMinimumScore] = useState(0);

  /*
   * Market-cap filters are applied BEFORE the scan.
   */
  const [marketCapPreset, setMarketCapPreset] =
    useState("all");

  const [minimumMarketCap, setMinimumMarketCap] =
    useState("");

  const [maximumMarketCap, setMaximumMarketCap] =
    useState("");

  const [page, setPage] = useState(0);

  /*
   * Scan the market using the currently selected
   * market-cap range.
   */
  const handleScan = async () => {
    try {
      setLoading(true);
      setError("");

      /*
       * Market cap is now sent to the backend.
       *
       * The backend applies this filter BEFORE
       * requesting Binance OI/volume/funding data.
       */
      const firstPage = await scanOiRadar(
        minimumMarketCap,
        maximumMarketCap
      );

      /*
       * Load all pages from the backend cache.
       *
       * No additional Binance scan occurs here.
       */
      const allResults =
        await getAllOiRadarResults(firstPage);

      /*
       * Ensure the final local dataset is sorted
       * by highest Radar Score first.
       */
      const sortedResults =
        [...allResults].sort((a, b) => {

          const scoreDifference =
            Number(b.radarScore || 0) -
            Number(a.radarScore || 0);

          if (scoreDifference !== 0) {
            return scoreDifference;
          }

          return String(
            a.symbol || ""
          ).localeCompare(
            String(b.symbol || "")
          );
        });

      setResults(sortedResults);

      /*
       * Keep the backend scan metadata.
       *
       * totalResults represents the number of coins
       * actually scanned after the market-cap filter.
       */
      setScanMeta(firstPage);

      setHasScanned(true);

      setPage(0);

    } catch (err) {

      console.error(
        "OI Radar scan failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to scan OI Radar."
      );

    } finally {

      setLoading(false);
    }
  };

  /*
   * Reset pagination when post-scan filters change.
   */
  useEffect(() => {
    setPage(0);
  }, [
    search,
    minimumScore,
  ]);

  /*
   * Search and minimum score are POST-SCAN filters.
   *
   * Market cap is intentionally NOT included here.
   */
  const filteredResults = useMemo(() => {

    const normalizedSearch =
      search.trim().toLowerCase();

    const minScore =
      Number(minimumScore || 0);

    return results.filter((item) => {

      const symbol =
        String(
          item.symbol || ""
        ).toLowerCase();

      if (
        normalizedSearch &&
        !symbol.includes(
          normalizedSearch
        )
      ) {
        return false;
      }

      const score =
        Number(
          item.radarScore || 0
        );

      if (score < minScore) {
        return false;
      }

      return true;
    });

  }, [
    results,
    search,
    minimumScore,
  ]);

  const totalPages =
    Math.ceil(
      filteredResults.length /
        PAGE_SIZE
    );

  const currentPage =
    Math.min(
      page,
      Math.max(
        totalPages - 1,
        0
      )
    );

  const visibleResults =
    useMemo(() => {

      const startIndex =
        currentPage *
        PAGE_SIZE;

      return filteredResults.slice(
        startIndex,
        startIndex + PAGE_SIZE
      );

    }, [
      filteredResults,
      currentPage,
    ]);

  /*
   * Market-cap preset.
   *
   * This changes the parameters for the NEXT scan.
   * It does not automatically scan.
   */
  const handleMarketCapPresetChange =
    (event) => {

      const value =
        event.target.value;

      setMarketCapPreset(value);

      if (value === "custom") {
        return;
      }

      const preset =
        MARKET_CAP_PRESETS[value];

      if (!preset) {
        return;
      }

      setMinimumMarketCap(
        preset.min
      );

      setMaximumMarketCap(
        preset.max
      );
    };

  const handleMinimumMarketCapChange =
    (event) => {

      const value =
        event.target.value;

      setMinimumMarketCap(
        value
      );

      setMarketCapPreset(
        detectPreset(
          value,
          maximumMarketCap
        )
      );
    };

  const handleMaximumMarketCapChange =
    (event) => {

      const value =
        event.target.value;

      setMaximumMarketCap(
        value
      );

      setMarketCapPreset(
        detectPreset(
          minimumMarketCap,
          value
        )
      );
    };

  const handlePreviousPage = () => {

    setPage(
      (current) =>
        Math.max(
          current - 1,
          0
        )
    );
  };

  const handleNextPage = () => {

    setPage(
      (current) =>
        Math.min(
          current + 1,
          Math.max(
            totalPages - 1,
            0
          )
        )
    );
  };

  const formatGeneratedAt = () => {

    if (!scanMeta?.generatedAt) {
      return null;
    }

    const date =
      new Date(
        scanMeta.generatedAt
      );

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return null;
    }

    return date.toLocaleString();
  };

  /*
   * Determine whether the currently selected
   * market-cap filter differs from the filter
   * used for the last scan.
   */
  const hasMarketCapChanged =
    hasScanned &&
    (
      String(
        scanMeta?.minMarketCap ?? ""
      ) !==
        String(
          minimumMarketCap
        ) ||
      String(
        scanMeta?.maxMarketCap ?? ""
      ) !==
        String(
          maximumMarketCap
        )
    );

  return (
    <Box>

      {/* =========================
          HEADER
         ========================= */}

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "stretch",
          sm: "center",
        }}
        spacing={2}
        sx={{ mb: 3 }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            OI Radar
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Detecting futures activity using
            open interest, volume, price,
            and funding data.
          </Typography>

          {scanMeta?.generatedAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 0.5,
              }}
            >
              Last scan:{" "}
              {formatGeneratedAt()}
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
          {loading
            ? "Scanning..."
            : "Scan"}
        </Button>

      </Stack>

      {/* =========================
          ERROR
         ========================= */}

      {error && (
        <Paper
          sx={{
            p: 2,
            mb: 2,
            border: "1px solid",
            borderColor:
              "error.main",
          }}
        >
          <Typography color="error">
            {error}
          </Typography>
        </Paper>
      )}

      {/* =========================
          FILTERS
         ========================= */}

      <Paper
        sx={{
          p: 2,
          mb: 2,
        }}
      >

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

          {/* Search */}

          <TextField
            label="Search Coin"
            placeholder="BTC, ETH..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            size="small"
            sx={{
              minWidth: {
                xs: "100%",
                md: 180,
              },
            }}
          />

          {/* Minimum Score */}

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
              value={
                minimumScore
              }
              label="Minimum Score"
              onChange={(event) =>
                setMinimumScore(
                  Number(
                    event.target.value
                  )
                )
              }
            >

              <MenuItem value={0}>
                All
              </MenuItem>

              <MenuItem value={40}>
                40+
              </MenuItem>

              <MenuItem value={60}>
                60+
              </MenuItem>

              <MenuItem value={80}>
                80+
              </MenuItem>

            </Select>

          </FormControl>

          {/* Market Cap */}

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
              value={
                marketCapPreset
              }
              label="Market Cap"
              onChange={
                handleMarketCapPresetChange
              }
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

          {/* Minimum Market Cap */}

          <TextField
            label="Min Market Cap"
            size="small"
            value={formatMarketCapInput(minimumMarketCap)}
            onChange={(event) => {
              const value = event.target.value
                .toUpperCase()
                .replace(/[$,\s]/g, "");

              let numericValue = value;

              if (value.endsWith("B")) {
                const number = Number(
                  value.slice(0, -1)
                );

                numericValue = Number.isNaN(number)
                  ? ""
                  : String(number * 1_000_000_000);
              } else if (value.endsWith("M")) {
                const number = Number(
                  value.slice(0, -1)
                );

                numericValue = Number.isNaN(number)
                  ? ""
                  : String(number * 1_000_000);
              } else if (value.endsWith("K")) {
                const number = Number(
                  value.slice(0, -1)
                );

                numericValue = Number.isNaN(number)
                  ? ""
                  : String(number * 1_000);
              }

              handleMinimumMarketCapChange({
                target: {
                  value: numericValue,
                },
              });
            }}
            placeholder="e.g. 50M"
          />

          {/* Maximum Market Cap */}

          <TextField
            label="Max Market Cap"
            size="small"
            value={formatMarketCapInput(maximumMarketCap)}
            onChange={(event) => {
              const value = event.target.value
                .toUpperCase()
                .replace(/[$,\s]/g, "");

              let numericValue = value;

              if (value.endsWith("B")) {
                const number = Number(
                  value.slice(0, -1)
                );

                numericValue = Number.isNaN(number)
                  ? ""
                  : String(number * 1_000_000_000);
              } else if (value.endsWith("M")) {
                const number = Number(
                  value.slice(0, -1)
                );

                numericValue = Number.isNaN(number)
                  ? ""
                  : String(number * 1_000_000);
              } else if (value.endsWith("K")) {
                const number = Number(
                  value.slice(0, -1)
                );

                numericValue = Number.isNaN(number)
                  ? ""
                  : String(number * 1_000);
              }

              handleMaximumMarketCapChange({
                target: {
                  value: numericValue,
                },
              });
            }}
            placeholder="e.g. 250M"
          />

        </Stack>

        {/* Market cap scan notice */}

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: "block",
            mt: 1.5,
          }}
        >
          Market Cap is applied before
          scanning. Click Scan after changing
          the market-cap range.
        </Typography>

        {hasMarketCapChanged && (
          <Typography
            variant="caption"
            color="warning.main"
            sx={{
              display: "block",
              mt: 0.5,
              fontWeight: 600,
            }}
          >
            Market-cap filter changed.
            Scan again to apply it.
          </Typography>
        )}

      </Paper>

      {/* =========================
          INITIAL STATE
         ========================= */}

      {!hasScanned &&
        !loading && (
          <Paper
            sx={{
              p: 5,
              textAlign: "center",
            }}
          >

            <Typography
              variant="h6"
              sx={{ mb: 1 }}
            >
              OI Radar is ready
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Select your market-cap range
              and click Scan to search the
              futures market.
            </Typography>

          </Paper>
        )}

      {/* =========================
          SCANNING STATE
         ========================= */}

      {loading && (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >

          <CircularProgress
            sx={{ mb: 2 }}
          />

          <Typography variant="h6">
            Scanning futures market...
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Applying market-cap filter and
            collecting futures data.
          </Typography>

        </Paper>
      )}

      {/* =========================
          RESULTS
         ========================= */}

      {hasScanned &&
        !loading && (
          <>

            {/* Result count */}

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                mb: 1,
                width: "100%",
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Showing{" "}
                {filteredResults.length === 0
                  ? 0
                  : currentPage *
                      PAGE_SIZE +
                    1}
                -
                {Math.min(
                  (currentPage + 1) *
                    PAGE_SIZE,
                  filteredResults.length
                )}{" "}
                of{" "}
                {filteredResults.length}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {scanMeta?.totalResults ??
                  results.length}{" "}
                scanned
              </Typography>

            </Stack>

            {/* Table */}

            <TableContainer
              component={Paper}
            >

              <Table size="small">

                <TableHead>

                  <TableRow>

                    <TableCell>
                      <strong>
                        Coin
                      </strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>
                        Price
                      </strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>
                        Market Cap
                      </strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>
                        Vol 1H
                      </strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>
                        Vol 4H
                      </strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>
                        OI 1H
                      </strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>
                        OI 4H
                      </strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>
                        Price 1H
                      </strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>
                        Funding
                      </strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>
                        Score
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Status
                      </strong>
                    </TableCell>

                  </TableRow>

                </TableHead>

                <TableBody>

                  {visibleResults.map(
                    (item) => (

                      <TableRow
                        key={
                          item.symbol
                        }
                        hover
                      >

                        <TableCell>
                          <Typography
                            fontWeight={600}
                          >
                            {
                              item.symbol
                            }
                          </Typography>
                        </TableCell>

                        <TableCell align="right">
                          {formatNumber(
                            item.price,
                            6
                          )}
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
                            item.openInterestChange1h
                          )}
                        </TableCell>

                        <TableCell align="right">
                          {formatPercent(
                            item.openInterestChange4h
                          )}
                        </TableCell>

                        <TableCell align="right">
                          {formatPercent(
                            item.priceChange1h
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
                            color:
                              getScoreColor(
                                Number(
                                  item.radarScore ||
                                    0
                                )
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
                              color:
                                getStatusColor(
                                  item.status
                                ),
                            }}
                          >
                            {
                              item.status ||
                              "-"
                            }
                          </Typography>
                        </TableCell>

                      </TableRow>

                    )
                  )}

                  {visibleResults.length ===
                    0 && (
                    <TableRow>

                      <TableCell
                        colSpan={11}
                        align="center"
                        sx={{
                          py: 5,
                        }}
                      >

                        <Typography
                          color="text.secondary"
                        >
                          No results match
                          the current
                          filters.
                        </Typography>

                      </TableCell>

                    </TableRow>
                  )}

                </TableBody>

              </Table>

            </TableContainer>

            {/* Pagination */}

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
                  onClick={
                    handlePreviousPage
                  }
                  disabled={
                    currentPage === 0
                  }
                >
                  Previous
                </Button>

                <Typography
                  variant="body2"
                >
                  Page{" "}
                  {currentPage + 1}{" "}
                  of{" "}
                  {totalPages}
                </Typography>

                <Button
                  variant="outlined"
                  onClick={
                    handleNextPage
                  }
                  disabled={
                    currentPage >=
                    totalPages - 1
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