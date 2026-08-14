import {
    Card,
    CardContent,
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

        <Card
            sx={{
                height: "100%"
            }}>

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom>

                    Filters

                </Typography>

                <Stack spacing={2}>

                    <TextField

                        label="Coin"

                        value={filters.coin}

                        onChange={(event) =>

                            setFilters({

                                ...filters,

                                coin: event.target.value

                            })

                        }

                    />

                    <TextField

                        label="Minimum BB Width"

                        type="number"

                        value={filters.minBbWidth}

                        onChange={(event) =>

                            setFilters({

                                ...filters,

                                minBbWidth: event.target.value

                            })

                        }

                    />

                    <Stack direction="row">

                        <FormControlLabel

                            control={

                                <Checkbox

                                    checked={filters.timeframes.includes("D1")}

                                    onChange={() => toggleTimeframe("D1")}

                                />

                            }

                            label="1D"

                        />

                        <FormControlLabel

                            control={

                                <Checkbox

                                    checked={filters.timeframes.includes("H4")}

                                    onChange={() => toggleTimeframe("H4")}

                                />

                            }

                            label="4H"

                        />

                        <FormControlLabel

                            control={

                                <Checkbox

                                    checked={filters.timeframes.includes("H1")}

                                    onChange={() => toggleTimeframe("H1")}

                                />

                            }

                            label="1H"

                        />

                        <FormControlLabel

                            control={

                                <Checkbox

                                    checked={filters.timeframes.includes("M15")}

                                    onChange={() => toggleTimeframe("M15")}

                                />

                            }

                            label="15M"

                        />

                    </Stack>

                </Stack>

            </CardContent>

        </Card>

    );

}