import {
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

export default function SummaryCard({

    symbolsScanned,

    totalMatches,

    multiTimeframeMatches

}) {

    return (

        <Card sx={{ mb: 3 }}>

            <CardContent>

                <Grid container spacing={3}>

                    <Grid size={4}>

                        <Typography
                            variant="h3">

                            {symbolsScanned}

                        </Typography>

                        <Typography>

                            Symbols

                        </Typography>

                    </Grid>

                    <Grid size={4}>

                        <Typography
                            variant="h3">

                            {totalMatches}

                        </Typography>

                        <Typography>

                            Matches

                        </Typography>

                    </Grid>

                    <Grid size={4}>

                        <Typography
                            variant="h3">

                            {multiTimeframeMatches}

                        </Typography>

                        <Typography>

                            Multi-Timeframe

                        </Typography>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

}