import {
    Box,
    Checkbox,
    FormControlLabel,
    Stack,
    TextField,
    Typography
} from "@mui/material";

export default function ScannerFilters({

    filters,

    setFilters

}) {

    function toggleTimeframe(timeframe) {

        if (filters.timeframes.includes(timeframe)) {

            setFilters({

                ...filters,

                timeframes:

                    filters.timeframes.filter(

                        value => value !== timeframe

                    )

            });

        } else {

            setFilters({

                ...filters,

                timeframes: [

                    ...filters.timeframes,

                    timeframe

                ]

            });

        }

    }

    return (

        <Box sx={{ mt: 2 }}>

            <Typography

                variant="subtitle2"

                color="text.secondary"

                sx={{ mb: 1 }}

            >

                Filters

            </Typography>

            <Stack

                direction="row"

                spacing={3}

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

                            coin: event.target.value

                        })

                    }

                    sx={{

                        width: 220

                    }}

                />

                <TextField

                    label="Min BB %"

                    type="number"

                    size="small"

                    value={filters.minBbWidth}

                    onChange={(event) =>

                        setFilters({

                            ...filters,

                            minBbWidth: event.target.value

                        })

                    }

                    sx={{

                        width: 120

                    }}

                />

                <Stack

                    direction="row"

                    spacing={1}

                >

                    <FormControlLabel

                        control={

                            <Checkbox

                                size="small"

                                checked={filters.timeframes.includes("D1")}

                                onChange={() => toggleTimeframe("D1")}

                            />

                        }

                        label="1D"

                    />

                    <FormControlLabel

                        control={

                            <Checkbox

                                size="small"

                                checked={filters.timeframes.includes("H4")}

                                onChange={() => toggleTimeframe("H4")}

                            />

                        }

                        label="4H"

                    />

                    <FormControlLabel

                        control={

                            <Checkbox

                                size="small"

                                checked={filters.timeframes.includes("H1")}

                                onChange={() => toggleTimeframe("H1")}

                            />

                        }

                        label="1H"

                    />

                    <FormControlLabel

                        control={

                            <Checkbox

                                size="small"

                                checked={filters.timeframes.includes("M15")}

                                onChange={() => toggleTimeframe("M15")}

                            />

                        }

                        label="15M"

                    />

                </Stack>

            </Stack>

        </Box>

    );

}