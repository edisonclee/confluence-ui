import {
    Box,
    Checkbox,
    FormControlLabel,
    Stack,
    TextField
} from "@mui/material";

export default function ScannerFilters({

    filters,

    setFilters

}) {

    function toggleTimeframe(timeframe) {

        if (filters.timeframes.includes(timeframe)) {

            setFilters({

                ...filters,

                timeframes: filters.timeframes.filter(

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

                            coin: event.target.value

                        })

                    }

                    sx={{

                        width: 160,

                        "& .MuiInputBase-input": {

                            fontSize: "0.85rem"

                        },

                        "& .MuiInputLabel-root": {

                            fontSize: "0.85rem"

                        }

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

                            minBbWidth: event.target.value

                        })

                    }

                    sx={{

                        width: 90,

                        "& .MuiInputBase-input": {

                            fontSize: "0.85rem"

                        },

                        "& .MuiInputLabel-root": {

                            fontSize: "0.85rem"

                        }

                    }}

                />

                <Stack

                    direction="row"

                    spacing={0}

                    alignItems="center"

                >

                    {

                        [

                            ["D1", "1D"],

                            ["H4", "4H"],

                            ["H1", "1H"],

                            ["M15", "15M"]

                        ].map(([value, label]) => (

                            <FormControlLabel

                                key={value}

                                sx={{

                                    mr: 0.5,

                                    "& .MuiFormControlLabel-label": {

                                        fontSize: "0.85rem"

                                    }

                                }}

                                control={

                                    <Checkbox

                                        size="small"

                                        checked={filters.timeframes.includes(value)}

                                        onChange={() => toggleTimeframe(value)}

                                    />

                                }

                                label={label}

                            />

                        ))

                    }

                </Stack>

            </Stack>

        </Box>

    );

}