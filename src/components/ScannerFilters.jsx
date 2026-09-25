import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function ScannerFilters({
  filters,
  setFilters,
  bbTimeframes,
  setBbTimeframes,
}) {
  function toggleTimeframe(timeframe) {
    if (bbTimeframes.includes(timeframe)) {
      setBbTimeframes(
        bbTimeframes.filter((value) => value !== timeframe),
      );
    } else {
      setBbTimeframes([
        ...bbTimeframes,
        timeframe,
      ]);
    }
  }

  const timeframes = [
    ["H1", "1H"],
    ["H4", "4H"],
    ["D1", "1D"],
    ["W1", "1W"],
    ["MN1", "1M"],
  ];

  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      spacing={2}
      sx={{
        width: "100%",
        flexWrap: "nowrap",
      }}
    >
      {/* COIN */}
      <Box
        sx={{
          width: 220,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            mb: 0.7,
            color: "#91a4b8",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          Coin
        </Typography>

        <TextField
          hiddenLabel
          fullWidth
          size="small"
          placeholder="e.g. BTC, ETH"
          value={filters.coin}
          onChange={(event) =>
            setFilters({
              ...filters,
              coin: event.target.value,
            })
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 38,
              backgroundColor: "#091018",

              "& fieldset": {
                borderColor: "#31485a",
              },

              "&:hover fieldset": {
                borderColor: "#486477",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#55c9df",
              },
            },

            "& .MuiOutlinedInput-input": {
              px: 1.3,
              py: 1,
              color: "#dce8f0",
              fontSize: "12px",
            },

            "& .MuiOutlinedInput-input::placeholder": {
              color: "#617486",
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* BB WIDTH */}
      <Box
        sx={{
          width: 160,
          flexShrink: 0,
        }}
      >
        <Typography
          sx={{
            mb: 0.7,
            color: "#91a4b8",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          BB Width
        </Typography>

        <TextField
          hiddenLabel
          fullWidth
          type="number"
          size="small"
          placeholder="0.00"
          value={filters.minBbWidth}
          onChange={(event) =>
            setFilters({
              ...filters,
              minBbWidth: event.target.value,
            })
          }
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 38,
              backgroundColor: "#091018",

              "& fieldset": {
                borderColor: "#31485a",
              },

              "&:hover fieldset": {
                borderColor: "#486477",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#55c9df",
              },
            },

            "& .MuiOutlinedInput-input": {
              px: 1.3,
              py: 1,
              color: "#dce8f0",
              fontSize: "12px",
            },

            "& .MuiOutlinedInput-input::placeholder": {
              color: "#617486",
              opacity: 1,
            },
          }}
        />
      </Box>

      {/* TIMEFRAMES */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <Typography
          sx={{
            mb: 0.7,
            color: "#91a4b8",
            fontSize: "12px",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          Timeframes
        </Typography>

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            height: 38,
            whiteSpace: "nowrap",
          }}
        >
          {timeframes.map(([value, label]) => (
            <FormControlLabel
              key={value}
              control={
                <Checkbox
                  size="small"
                  checked={bbTimeframes.includes(value)}
                  onChange={() => toggleTimeframe(value)}
                  sx={{
                    p: 0.5,
                    mr: 0.4,
                    color: "#52697b",

                    "&.Mui-checked": {
                      color: "#55c9df",
                    },
                  }}
                />
              }
              label={label}
              sx={{
                m: 0,
                mr: 1.3,

                "& .MuiFormControlLabel-label": {
                  color: "#a7b8c7",
                  fontSize: "12px",
                  fontWeight: 500,
                },
              }}
            />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}