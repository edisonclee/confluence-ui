import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
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

import PlayArrowIcon from "@mui/icons-material/PlayArrow";

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
    return "#55dfb0";
  }

  if (score >= 60) {
    return "#f5c451";
  }

  if (score >= 40) {
    return "#55c9df";
  }

  return "#62778c";
}

function getStatusColor(status) {
  switch (status) {
    case "Momentum":
      return "#55dfb0";

    case "Building":
      return "#f5c451";

    case "Waking Up":
      return "#55c9df";

    case "Crowded":
      return "#ef6b73";

    default:
      return "#62778c";
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

function formatMarketCapInput(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "";
  }

  if (number >= 1_000_000_000) {
    const billions = number / 1_000_000_000;

    return `${Number(
      billions.toFixed(2)
    )}B`;
  }

  if (number >= 1_000_000) {
    const millions = number / 1_000_000;

    return `${Number(
      millions.toFixed(2)
    )}M`;
  }

  if (number >= 1_000) {
    const thousands = number / 1_000;

    return `${Number(
      thousands.toFixed(2)
    )}K`;
  }

  return String(number);
}

function parseMarketCapInput(value) {
  if (!value) {
    return "";
  }

  const normalized = String(value)
    .trim()
    .toUpperCase()
    .replace(/[$,\s]/g, "");

  const match = normalized.match(
    /^([0-9]*\.?[0-9]+)([KMB])?$/
  );

  if (!match) {
    return null;
  }

  const number = Number(match[1]);

  if (Number.isNaN(number)) {
    return null;
  }

  const suffix = match[2];

  if (suffix === "B") {
    return String(
      Math.round(number * 1_000_000_000)
    );
  }

  if (suffix === "M") {
    return String(
      Math.round(number * 1_000_000)
    );
  }

  if (suffix === "K") {
    return String(
      Math.round(number * 1_000)
    );
  }

  return String(number);
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
   * Runs the actual OI Radar scan.
   *
   * Market-cap values are passed to the backend so the
   * market-cap filter is applied BEFORE the expensive scan.
   */
  const handleScan = async () => {
    try {
      setLoading(true);
      setError("");

      const firstPage = await scanOiRadar(
        minimumMarketCap === ""
          ? null
          : Number(minimumMarketCap),
        maximumMarketCap === ""
          ? null
          : Number(maximumMarketCap)
      );

      const allResults = await getAllOiRadarResults(
        firstPage
      );

      const sortedResults = [...allResults].sort(
        (a, b) => {
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
        }
      );

      setResults(sortedResults);
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

  useEffect(() => {
    setPage(0);
  }, [
    search,
    minimumScore,
    minimumMarketCap,
    maximumMarketCap,
  ]);

  const filteredResults = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    const minScore =
      Number(minimumScore || 0);

    const minMarketCap =
      minimumMarketCap === ""
        ? null
        : Number(minimumMarketCap);

    const maxMarketCap =
      maximumMarketCap === ""
        ? null
        : Number(maximumMarketCap);

    return results.filter((item) => {
      const symbol = String(
        item.symbol || ""
      ).toLowerCase();

      if (
        normalizedSearch &&
        !symbol.includes(normalizedSearch)
      ) {
        return false;
      }

      const score = Number(
        item.radarScore || 0
      );

      if (score < minScore) {
        return false;
      }

      const marketCap =
        item.marketCap === null ||
        item.marketCap === undefined
          ? null
          : Number(item.marketCap);

      if (minMarketCap !== null) {
        if (
          marketCap === null ||
          marketCap < minMarketCap
        ) {
          return false;
        }
      }

      if (maxMarketCap !== null) {
        if (
          marketCap === null ||
          marketCap >= maxMarketCap
        ) {
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
    const startIndex =
      currentPage * PAGE_SIZE;

    return filteredResults.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
  }, [
    filteredResults,
    currentPage,
  ]);

  const handleMarketCapPresetChange = (
    event
  ) => {
    const value = event.target.value;

    setMarketCapPreset(value);

    if (value === "custom") {
      return;
    }

    const preset =
      MARKET_CAP_PRESETS[value];

    if (!preset) {
      return;
    }

    setMinimumMarketCap(preset.min);
    setMaximumMarketCap(preset.max);
  };

  const handleMinimumMarketCapChange = (
    event
  ) => {
    const value = event.target.value;

    setMinimumMarketCap(value);

    setMarketCapPreset(
      detectPreset(
        value,
        maximumMarketCap
      )
    );
  };

  const handleMaximumMarketCapChange = (
    event
  ) => {
    const value = event.target.value;

    setMaximumMarketCap(value);

    setMarketCapPreset(
      detectPreset(
        minimumMarketCap,
        value
      )
    );
  };

  const handlePreviousPage = () => {
    setPage((current) =>
      Math.max(current - 1, 0)
    );
  };

  const handleNextPage = () => {
    setPage((current) =>
      Math.min(
        current + 1,
        Math.max(totalPages - 1, 0)
      )
    );
  };

  const formatLastScan = () => {
    if (!scanMeta?.generatedAt) {
      return "No scan executed";
    }

    const date = new Date(
      scanMeta.generatedAt
    );

    if (Number.isNaN(date.getTime())) {
      return "No scan executed";
    }

    return `Last scan: ${date.toLocaleTimeString()}`;
  };

  const firstVisibleIndex =
    filteredResults.length === 0
      ? 0
      : currentPage * PAGE_SIZE + 1;

  const lastVisibleIndex = Math.min(
    (currentPage + 1) * PAGE_SIZE,
    filteredResults.length
  );

  return (
    <Box
      sx={{
        px: {
          xs: 1.5,
          md: 2.5,
        },
        pb: 4,
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              color: "#55c9df",
              fontSize: {
                xs: "20px",
                md: "22px",
              },
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            OI Radar
          </Typography>

          <Typography
            sx={{
              mt: 0.6,
              color: "#8ba0b5",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            Detect futures activity using open
            interest, volume, price, and funding
            data.
          </Typography>
        </Box>

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
                boxShadow:
                  "0 0 7px rgba(85,223,176,0.65)",
              }}
            />

            <Typography
              sx={{
                color: "#55dfb0",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.04em",
                lineHeight: 1,
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
              whiteSpace: "nowrap",
            }}
          >
            {formatLastScan()}
          </Typography>
        </Box>
      </Box>

      {/* SCAN PANEL */}
      <Box
        sx={{
          border: "1px solid #263d50",
          backgroundColor: "#0c151e",
          borderRadius: "6px",
          p: {
            xs: 1.5,
            md: 1.75,
          },
          mb: 2,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "stretch",
            lg: "center",
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: "#dce7ef",
                fontSize: "12px",
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              Futures open interest and volume
              activity across Bitunix perpetual
              markets
            </Typography>

            <Typography
              sx={{
                mt: 0.6,
                color: "#62778c",
                fontSize: "10px",
                lineHeight: 1.4,
              }}
            >
              Market cap is applied before
              scanning. Click Scan after changing
              the market-cap range.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress
                  size={15}
                  color="inherit"
                />
              ) : (
                <PlayArrowIcon
                  sx={{ fontSize: 17 }}
                />
              )
            }
            onClick={handleScan}
            disabled={loading}
            sx={{
              width: 112,
              minWidth: 112,
              height: 40,
              flexShrink: 0,
              backgroundColor: "#55c9df",
              color: "#071017",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "7px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#69d4e7",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                backgroundColor:
                  "#315b66",
                color: "#8ba0aa",
              },
            }}
          >
            {loading ? "Scanning..." : "Scan"}
          </Button>
        </Stack>
      </Box>

      {/* ERROR */}
      {error && (
        <Box
          sx={{
            border: "1px solid #61343b",
            backgroundColor: "#1b1014",
            borderRadius: "6px",
            px: 1.5,
            py: 1.25,
            mb: 2,
          }}
        >
          <Typography
            sx={{
              color: "#ef6b73",
              fontSize: "11px",
            }}
          >
            {error}
          </Typography>
        </Box>
      )}

      {/* FILTERS */}
      <Box
        sx={{
          border: "1px solid #1e3344",
          backgroundColor: "#0d161f",
          borderRadius: "6px",
          p: 1.25,
          mb: 2,
        }}
      >
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          spacing={1.5}
          alignItems={{
            xs: "stretch",
            lg: "center",
          }}
        >
          <TextField
            placeholder="Search Coin"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            size="small"
            sx={{
              width: {
                xs: "100%",
                lg: 203,
              },
              "& .MuiInputBase-root": {
                height: 40,
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              width: {
                xs: "100%",
                lg: 145,
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
              // Minimum Score
              sx={{
                width: {
                  xs: "100%",
                  lg: 145,
                },
              }}
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
              width: {
                xs: "100%",
                lg: 155,
              },
            }}
          >
            <InputLabel>
              Market Cap
            </InputLabel>

            <Select
              value={marketCapPreset}
              label="Market Cap"
              onChange={
                handleMarketCapPresetChange
              }
              // Market Cap
              sx={{
                width: {
                  xs: "100%",
                  lg: 155,
                },
              }}
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
            placeholder="Min Market Cap"
            value={formatMarketCapInput(minimumMarketCap)}
            onChange={(event) => {
              const parsed = parseMarketCapInput(
                event.target.value
              );

              if (parsed === null) {
                return;
              }

              setMinimumMarketCap(parsed);

              setMarketCapPreset(
                detectPreset(
                  parsed,
                  maximumMarketCap
                )
              );
            }}
            size="small"
            sx={{
              width: {
                xs: "100%",
                lg: 203,
              },
              "& .MuiInputBase-root": {
                height: 40,
              },
            }}
          />

          <TextField
            placeholder="Max Market Cap"
            value={formatMarketCapInput(maximumMarketCap)}
            onChange={(event) => {
              const parsed = parseMarketCapInput(
                event.target.value
              );

              if (parsed === null) {
                return;
              }

              setMaximumMarketCap(parsed);

              setMarketCapPreset(
                detectPreset(
                  minimumMarketCap,
                  parsed
                )
              );
            }}
            size="small"
            sx={{
              width: {
                xs: "100%",
                lg: 203,
              },
              "& .MuiInputBase-root": {
                height: 40,
              },
            }}
          />
        </Stack>

        <Typography
          sx={{
            mt: 0.9,
            color: "#62778c",
            fontSize: "9px",
          }}
        >
          Market cap is applied before scanning.
          Click Scan after changing the
          market-cap range.
        </Typography>
      </Box>

      {/* SUMMARY */}
      {hasScanned && !loading && (
        <Box
          sx={{
            minHeight: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: 1.5,
            py: 1,
            mb: 2,
            border: "1px solid #215465",
            backgroundColor: "#103f49",
            borderRadius: "6px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 0,
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
                color: "#dce7ef",
                fontSize: "11px",
                lineHeight: 1,
              }}
            >
              {filteredResults.length}{" "}
              matches detected
            </Typography>

            <Typography
              sx={{
                mx: 1.5,
                color: "#527083",
                fontSize: "11px",
              }}
            >
              ·
            </Typography>

            <Typography
              sx={{
                color: "#dce7ef",
                fontFamily: "monospace",
                fontSize: "11px",
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {scanMeta?.durationSeconds !==
              undefined
                ? `${Number(
                    scanMeta.durationSeconds
                  ).toFixed(2)}s`
                : "0.00s"}{" "}
              duration
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "#8ba0b5",
              fontFamily: "monospace",
              fontSize: "9px",
              whiteSpace: "nowrap",
            }}
          >
            {scanMeta?.totalResults ??
              results.length}{" "}
            symbols scanned
          </Typography>
        </Box>
      )}

      {/* LOADING */}
      {loading && (
        <Box
          sx={{
            border: "1px solid #263d50",
            backgroundColor: "#0c151e",
            borderRadius: "6px",
            minHeight: 120,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 1.2,
          }}
        >
          <CircularProgress
            size={24}
            sx={{
              color: "#55c9df",
            }}
          />

          <Typography
            sx={{
              color: "#8ba0b5",
              fontSize: "11px",
            }}
          >
            Scanning futures market...
          </Typography>
        </Box>
      )}

      {/* RESULTS */}
      {hasScanned &&
        !loading &&
        filteredResults.length > 0 && (
          <Box
            sx={{
              border: "1px solid #263d50",
              backgroundColor: "#0b141d",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            {/* TABLE HEADER */}
            <Box
              sx={{
                height: 42,
                px: 1.5,
                display: "flex",
                alignItems: "center",
                borderBottom:
                  "1px solid #263d50",
                backgroundColor: "#0e1a24",
              }}
            >
              <Typography
                sx={{
                  color: "#dce7ef",
                  fontSize: "12px",
                  fontWeight: 700,
                }}
              >
                OI Radar Results
              </Typography>

              <Typography
                sx={{
                  ml: "auto",
                  color: "#62778c",
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.04em",
                }}
              >
                {filteredResults.length} MATCHES
              </Typography>
            </Box>

            {/* TABLE */}
            <TableContainer>
              <Table
                size="small"
                sx={{
                  tableLayout: "fixed",
                  minWidth: 1120,
                }}
              >
                <TableHead>
                  <TableRow>
                    {[
                      ["Coin", "10%"],
                      ["Price", "9%"],
                      ["Market Cap", "10%"],
                      ["Vol 1H", "10%"],
                      ["Vol 4H", "10%"],
                      ["OI 1H", "9%"],
                      ["OI 4H", "9%"],
                      ["Price 1H", "9%"],
                      ["Funding", "9%"],
                      ["Score", "6%"],
                      ["Status", "9%"],
                    ].map(
                      ([label, width], index) => (
                        <TableCell
                          key={label}
                          align={
                            index === 0 ||
                            index === 10
                              ? "left"
                              : "right"
                          }
                          sx={{
                            width,
                            height: 38,
                            px: 1.25,
                            py: 0.75,
                            color: "#8ba0b5",
                            backgroundColor:
                              index === 0
                                ? "#132431"
                                : index === 9
                                ? "#10232d"
                                : "#0d1821",
                            borderBottom:
                              "1px solid #294154",
                            fontSize: "10px",
                            fontWeight: 700,
                            letterSpacing:
                              "0.03em",
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {label.toUpperCase()}
                        </TableCell>
                      )
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {visibleResults.map(
                    (item) => (
                      <TableRow
                        key={item.symbol}
                        hover
                        sx={{
                          "&:hover td": {
                            backgroundColor:
                              "#172a38 !important",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#132431",
                            borderBottom:
                              "1px solid #213544",
                            color: "#e3edf4",
                            fontSize: "11px",
                            fontWeight: 700,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {item.symbol}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#0f1b24",
                            borderBottom:
                              "1px solid #213544",
                            color: "#dce7ef",
                            fontFamily:
                              "monospace",
                            fontSize: "10px",
                          }}
                        >
                          {formatNumber(
                            item.price,
                            6
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#10212c",
                            borderBottom:
                              "1px solid #213544",
                            color: "#dce7ef",
                            fontFamily:
                              "monospace",
                            fontSize: "10px",
                          }}
                        >
                          {formatMarketCap(
                            item.marketCap
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#0e1a23",
                            borderBottom:
                              "1px solid #213544",
                            color: "#dce7ef",
                            fontFamily:
                              "monospace",
                            fontSize: "10px",
                          }}
                        >
                          {formatNumber(
                            item.volume1h,
                            0
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#0e1a23",
                            borderBottom:
                              "1px solid #213544",
                            color: "#dce7ef",
                            fontFamily:
                              "monospace",
                            fontSize: "10px",
                          }}
                        >
                          {formatNumber(
                            item.volume4h,
                            0
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#101f29",
                            borderBottom:
                              "1px solid #213544",
                            color: "#dce7ef",
                            fontFamily:
                              "monospace",
                            fontSize: "10px",
                          }}
                        >
                          {formatPercent(
                            item.openInterestChange1h,
                            2
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#101f29",
                            borderBottom:
                              "1px solid #213544",
                            color: "#dce7ef",
                            fontFamily:
                              "monospace",
                            fontSize: "10px",
                          }}
                        >
                          {formatPercent(
                            item.openInterestChange4h,
                            2
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#0f1b24",
                            borderBottom:
                              "1px solid #213544",
                            color: "#dce7ef",
                            fontFamily:
                              "monospace",
                            fontSize: "10px",
                          }}
                        >
                          {formatPercent(
                            item.priceChange1h,
                            2
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#10212c",
                            borderBottom:
                              "1px solid #213544",
                            color: "#dce7ef",
                            fontFamily:
                              "monospace",
                            fontSize: "10px",
                          }}
                        >
                          {formatFunding(
                            item.fundingRate
                          )}
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#10232d",
                            borderBottom:
                              "1px solid #213544",
                            color: getScoreColor(
                              Number(
                                item.radarScore ||
                                  0
                              )
                            ),
                            fontFamily:
                              "monospace",
                            fontSize: "11px",
                            fontWeight: 700,
                          }}
                        >
                          {formatNumber(
                            item.radarScore,
                            0
                          )}
                        </TableCell>

                        <TableCell
                          sx={{
                            px: 1.25,
                            py: 0.9,
                            backgroundColor:
                              "#0f1b24",
                            borderBottom:
                              "1px solid #213544",
                            color: getStatusColor(
                              item.status
                            ),
                            fontSize: "10px",
                            fontWeight: 700,
                            whiteSpace:
                              "nowrap",
                          }}
                        >
                          {item.status || "-"}
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <Box
                sx={{
                  height: 48,
                  px: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  borderTop:
                    "1px solid #263d50",
                  backgroundColor: "#0d1821",
                }}
              >
                <Typography
                  sx={{
                    color: "#62778c",
                    fontFamily:
                      "monospace",
                    fontSize: "9px",
                  }}
                >
                  Showing {firstVisibleIndex}-
                  {lastVisibleIndex} of{" "}
                  {filteredResults.length}
                </Typography>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Button
                    size="small"
                    onClick={
                      handlePreviousPage
                    }
                    disabled={
                      currentPage === 0
                    }
                    sx={{
                      minWidth: 76,
                      height: 28,
                      color: "#8ba0b5",
                      border:
                        "1px solid #294154",
                      fontSize: "9px",
                      textTransform:
                        "none",
                      "&:disabled": {
                        color: "#3e5364",
                        borderColor:
                          "#1d2d3a",
                      },
                    }}
                  >
                    Previous
                  </Button>

                  <Typography
                    sx={{
                      minWidth: 70,
                      textAlign:
                        "center",
                      color: "#8ba0b5",
                      fontFamily:
                        "monospace",
                      fontSize: "9px",
                    }}
                  >
                    Page{" "}
                    {currentPage + 1} /{" "}
                    {totalPages}
                  </Typography>

                  <Button
                    size="small"
                    onClick={handleNextPage}
                    disabled={
                      currentPage >=
                      totalPages - 1
                    }
                    sx={{
                      minWidth: 76,
                      height: 28,
                      color: "#8ba0b5",
                      border:
                        "1px solid #294154",
                      fontSize: "9px",
                      textTransform:
                        "none",
                      "&:disabled": {
                        color: "#3e5364",
                        borderColor:
                          "#1d2d3a",
                      },
                    }}
                  >
                    Next
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        )}

      {/* NO RESULTS */}
      {hasScanned &&
        !loading &&
        filteredResults.length === 0 && (
          <Box
            sx={{
              border: "1px solid #263d50",
              backgroundColor: "#0c151e",
              borderRadius: "6px",
              minHeight: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: 2,
            }}
          >
            <Typography
              sx={{
                color: "#62778c",
                fontSize: "11px",
              }}
            >
              No results match the current
              filters.
            </Typography>
          </Box>
        )}
    </Box>
  );
}