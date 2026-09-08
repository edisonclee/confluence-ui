import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  MenuItem,
  Paper,
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

import { getOiRadar } from "../api/oiRadarApi";

const MARKET_CAP_PRESETS = {
  all: {
    min: "",
    max: "",
  },

  micro: {
    min: "",
    max: "50000000",
  },

  small: {
    min: "50000000",
    max: "250000000",
  },

  mid: {
    min: "250000000",
    max: "1000000000",
  },

  large: {
    min: "1000000000",
    max: "10000000000",
  },

  mega: {
    min: "10000000000",
    max: "",
  },
};

function formatNumber(value, digits = 2) {
  if (value == null) {
    return "-";
  }

  return Number(value).toLocaleString(
    undefined,
    {
      maximumFractionDigits: digits,
    }
  );
}

function formatPercent(value) {
  if (value == null) {
    return "-";
  }

  return `${Number(value).toFixed(2)}%`;
}

function formatFunding(value) {
  if (value == null) {
    return "-";
  }

  return `${(
    Number(value) * 100
  ).toFixed(4)}%`;
}

function formatMarketCap(value) {
  if (value == null) {
    return "-";
  }

  const number = Number(value);

  if (number >= 1_000_000_000) {
    return `$${(
      number / 1_000_000_000
    ).toFixed(2)}B`;
  }

  if (number >= 1_000_000) {
    return `$${(
      number / 1_000_000
    ).toFixed(2)}M`;
  }

  if (number >= 1_000) {
    return `$${(
      number / 1_000
    ).toFixed(2)}K`;
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
  for (const [
    key,
    range,
  ] of Object.entries(
    MARKET_CAP_PRESETS
  )) {
    if (
      range.min === min
      && range.max === max
    ) {
      return key;
    }
  }

  if (min === "" && max === "") {
    return "all";
  }

  return "custom";
}

export default function OiRadar() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [minimumScore, setMinimumScore] =
    useState(0);

  const [marketCapPreset, setMarketCapPreset] =
    useState("all");

  const [minimumMarketCap, setMinimumMarketCap] =
    useState("");

  const [maximumMarketCap, setMaximumMarketCap] =
    useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");

      const result =
        await getOiRadar();

      setData(result);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.message
          || err?.message
          || "Failed to load OI Radar."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function handleMarketCapPresetChange(
    event
  ) {
    const preset =
      event.target.value;

    setMarketCapPreset(preset);

    /*
     * Custom does not overwrite the
     * existing manually entered values.
     */
    if (preset === "custom") {
      return;
    }

    const range =
      MARKET_CAP_PRESETS[preset];

    if (!range) {
      return;
    }

    setMinimumMarketCap(
      range.min
    );

    setMaximumMarketCap(
      range.max
    );
  }

  function handleMinimumMarketCapChange(
    event
  ) {
    const value =
      event.target.value;

    setMinimumMarketCap(value);

    setMarketCapPreset(
      detectPreset(
        value,
        maximumMarketCap
      )
    );
  }

  function handleMaximumMarketCapChange(
    event
  ) {
    const value =
      event.target.value;

    setMaximumMarketCap(value);

    setMarketCapPreset(
      detectPreset(
        minimumMarketCap,
        value
      )
    );
  }

  const results =
    useMemo(() => {
      if (!data?.results) {
        return [];
      }

      const query =
        search
          .trim()
          .toUpperCase();

      const minScore =
        Number(minimumScore) || 0;

      const minMarketCap =
        minimumMarketCap === ""
          ? null
          : Number(
              minimumMarketCap
            );

      const maxMarketCap =
        maximumMarketCap === ""
          ? null
          : Number(
              maximumMarketCap
            );

      return data.results.filter(
        (item) => {
          /*
           * Coin search
           */
          if (
            query
            && !item.symbol.includes(
              query
            )
          ) {
            return false;
          }

          /*
           * Radar score
           */
          if (
            item.radarScore < minScore
          ) {
            return false;
          }

          /*
           * Market cap filter
           */
          if (
            minMarketCap !== null
            || maxMarketCap !== null
          ) {
            if (
              item.marketCap == null
            ) {
              return false;
            }

            const marketCap =
              Number(item.marketCap);

            if (
              minMarketCap !== null
              && marketCap < minMarketCap
            ) {
              return false;
            }

            if (
              maxMarketCap !== null
              && marketCap >= maxMarketCap
            ) {
              return false;
            }
          }

          return true;
        }
      );
    }, [
      data,
      search,
      minimumScore,
      minimumMarketCap,
      maximumMarketCap,
    ]);

  return (
    <Container
      maxWidth={false}
      sx={{ pb: 4 }}
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
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight={700}
          >
            OI Radar
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Detecting futures activity using
            Binance market data.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={load}
          disabled={loading}
        >
          Refresh
        </Button>
      </Stack>

      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <TextField
          size="small"
          label="Search coin"
          placeholder="BTC"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
        />

        <TextField
          size="small"
          type="number"
          label="Minimum score"
          value={minimumScore}
          onChange={(event) =>
            setMinimumScore(
              Number(event.target.value)
            )
          }
          inputProps={{
            min: 0,
            max: 100,
          }}
        />

        <TextField
          select
          size="small"
          label="Market Cap Preset"
          value={marketCapPreset}
          onChange={
            handleMarketCapPresetChange
          }
          sx={{
            minWidth: 190,
          }}
        >
          <MenuItem value="all">
            All
          </MenuItem>

          <MenuItem value="micro">
            Micro Cap (&lt; $50M)
          </MenuItem>

          <MenuItem value="small">
            Small Cap ($50M – $250M)
          </MenuItem>

          <MenuItem value="mid">
            Mid Cap ($250M – $1B)
          </MenuItem>

          <MenuItem value="large">
            Large Cap ($1B – $10B)
          </MenuItem>

          <MenuItem value="mega">
            Mega Cap (&gt; $10B)
          </MenuItem>

          <MenuItem value="custom">
            Custom
          </MenuItem>
        </TextField>

        <TextField
          size="small"
          type="number"
          label="Min Market Cap"
          placeholder="e.g. 10000000"
          value={minimumMarketCap}
          onChange={
            handleMinimumMarketCapChange
          }
          inputProps={{
            min: 0,
          }}
        />

        <TextField
          size="small"
          type="number"
          label="Max Market Cap"
          placeholder="e.g. 1000000000"
          value={maximumMarketCap}
          onChange={
            handleMaximumMarketCapChange
          }
          inputProps={{
            min: 0,
          }}
        />
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
        >
          {error}
        </Alert>
      )}

      {loading && !data ? (
        <Box
          display="flex"
          justifyContent="center"
          py={8}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            overflowX: "auto",
          }}
        >
          <Table
            size="small"
            stickyHeader
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  Coin
                </TableCell>

                <TableCell align="right">
                  Price
                </TableCell>

                <TableCell align="right">
                  Market Cap
                </TableCell>

                <TableCell align="right">
                  Vol 1H
                </TableCell>

                <TableCell align="right">
                  Vol 4H
                </TableCell>

                <TableCell align="right">
                  OI 1H
                </TableCell>

                <TableCell align="right">
                  OI 4H
                </TableCell>

                <TableCell align="right">
                  Price 1H
                </TableCell>

                <TableCell align="right">
                  Funding
                </TableCell>

                <TableCell align="center">
                  Score
                </TableCell>

                <TableCell align="center">
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {results.map((item) => (
                <TableRow
                  key={item.symbol}
                  hover
                >
                  <TableCell>
                    <Typography
                      fontWeight={700}
                    >
                      {item.symbol}
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

                  <TableCell
                    align="right"
                    sx={{
                      color:
                        Number(
                          item.openInterestChange1h
                        ) > 0
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {formatPercent(
                      item.openInterestChange1h
                    )}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color:
                        Number(
                          item.openInterestChange4h
                        ) > 0
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {formatPercent(
                      item.openInterestChange4h
                    )}
                  </TableCell>

                  <TableCell
                    align="right"
                    sx={{
                      color:
                        Number(
                          item.priceChange1h
                        ) > 0
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {formatPercent(
                      item.priceChange1h
                    )}
                  </TableCell>

                  <TableCell align="right">
                    {formatFunding(
                      item.fundingRate
                    )}
                  </TableCell>

                  <TableCell align="center">
                    <Typography
                      fontWeight={800}
                      sx={{
                        color:
                          getScoreColor(
                            item.radarScore
                          ),
                      }}
                    >
                      {item.radarScore}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography
                      fontWeight={700}
                      sx={{
                        color:
                          getStatusColor(
                            item.status
                          ),
                      }}
                    >
                      {item.status}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}

              {!results.length && (
                <TableRow>
                  <TableCell
                    colSpan={11}
                    align="center"
                  >
                    No coins match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}