import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";

export default function ScannerFilters({
  filters,

  setFilters,

  bbTimeframes,

  setBbTimeframes,
}) {
  function toggleTimeframe(timeframe) {
    if (bbTimeframes.includes(timeframe)) {
      setBbTimeframes(bbTimeframes.filter((value) => value !== timeframe));
    } else {
      setBbTimeframes([...bbTimeframes, timeframe]);
    }
  }

  return (
    <Box>
      <Stack
        direction="row"

        spacing={2}

        alignItems="center"

        flexWrap="wrap"
      >
        <TextField
          label="Coin"

          size="small"

          value={filters.coin}

          onChange={(event) =>
            setFilters({
              ...filters,

              coin: event.target.value,
            })
          }

          sx={{
            width: 160,

            "& .MuiInputBase-input": {
              fontSize: "0.85rem",
            },

            "& .MuiInputLabel-root": {
              fontSize: "0.85rem",
            },
          }}
        />

        <TextField
          label="BB ≥ %"

          type="number"

          size="small"

          value={filters.minBbWidth}

          onChange={(event) =>
            setFilters({
              ...filters,

              minBbWidth: event.target.value,
            })
          }

          sx={{
            width: 90,

            "& .MuiInputBase-input": {
              fontSize: "0.85rem",
            },

            "& .MuiInputLabel-root": {
              fontSize: "0.85rem",
            },
          }}
        />

        <Stack
          direction="row"

          spacing={0}

          alignItems="center"
        >
          {[
            ["H1", "1H"],

            ["H4", "4H"],

            ["D1", "1D"],

            ["W1", "1W"],

            ["MN1", "1M"],
          ].map(([value, label]) => (
            <FormControlLabel
              key={value}

              sx={{
                mr: 0.5,

                "& .MuiFormControlLabel-label": {
                  fontSize: "0.85rem",
                },
              }}

              control={
                <Checkbox
                  size="small"

                  checked={bbTimeframes.includes(value)}

                  onChange={() => toggleTimeframe(value)}
                />
              }

              label={label}
            />
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}
