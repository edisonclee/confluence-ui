import {
    Stack,
    Typography
} from "@mui/material";

function Metric({ label, value }) {

    return (

        <Stack

            direction="row"

            spacing={0.5}

            alignItems="center"

        >

            <Typography

                variant="body2"

                fontWeight={600}

            >

                {value}

            </Typography>

            <Typography

                variant="caption"

                color="text.secondary"

            >

                {label}

            </Typography>

        </Stack>

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

            flexWrap="wrap"

            alignItems="center"

            sx={{

                py: 0.5

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

                        ? `${performance.downloadSeconds.toFixed(1)}s`

                        : "--"

                }

            />

            <Metric

                label="Scan"

                value={

                    performance

                        ? `${performance.scanSeconds.toFixed(1)}s`

                        : "--"

                }

            />

            <Metric

                label="Total"

                value={

                    performance

                        ? `${performance.totalSeconds.toFixed(1)}s`

                        : "--"

                }

            />

        </Stack>

    );

}