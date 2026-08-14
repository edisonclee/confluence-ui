import {
    Box,
    Divider,
    Stack,
    Typography
} from "@mui/material";

function Metric({ label, value }) {

    return (

        <Box
            sx={{
                minWidth: 90
            }}>

            <Typography
                variant="caption"
                color="text.secondary">

                {label}

            </Typography>

            <Typography
                variant="h6"
                fontWeight={600}>

                {value}

            </Typography>

        </Box>

    );

}

export default function SummaryCard({

    symbolsScanned,

    totalMatches,

    multiTimeframeMatches,

    performance

}) {

    return (

        <Stack

            direction="row"

            spacing={3}

            divider={<Divider orientation="vertical" flexItem />}

            sx={{

                mt: 2,

                mb: 2,

                flexWrap: "wrap"

            }}

        >

            <Metric

                label="Symbols"

                value={symbolsScanned}

            />

            <Metric

                label="Matches"

                value={totalMatches}

            />

            <Metric

                label="Multi-TF"

                value={multiTimeframeMatches}

            />

            <Metric

                label="Download"

                value={

                    performance

                        ? `${performance.downloadSeconds.toFixed(1)} s`

                        : "--"

                }

            />

            <Metric

                label="Scan"

                value={

                    performance

                        ? `${performance.scanSeconds.toFixed(1)} s`

                        : "--"

                }

            />

            <Metric

                label="Total"

                value={

                    performance

                        ? `${performance.totalSeconds.toFixed(1)} s`

                        : "--"

                }

            />

        </Stack>

    );

}