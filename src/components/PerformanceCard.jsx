import {
    Card,
    CardContent,
    Grid,
    Typography
} from "@mui/material";

export default function PerformanceCard({

    performance

}) {

    if (!performance) {

        return (

            <Card
                sx={{
                    height: "100%"
                }}
            >

                <CardContent>

                    <Typography>

                        Run a scan to view performance.

                    </Typography>

                </CardContent>

            </Card>

        );

    }

    return (

        <Card sx={{ mt: 3 }}>

            <CardContent>

                <Grid container spacing={3}>

                    <Grid size={4}>

                        <Typography variant="subtitle2">

                            Download

                        </Typography>

                        <Typography variant="h6">

                            {performance.downloadSeconds.toFixed(2)} sec

                        </Typography>

                    </Grid>

                    <Grid size={4}>

                        <Typography variant="subtitle2">

                            Scan

                        </Typography>

                        <Typography variant="h6">

                            {performance.scanSeconds.toFixed(2)} sec

                        </Typography>

                    </Grid>

                    <Grid size={4}>

                        <Typography variant="subtitle2">

                            Total

                        </Typography>

                        <Typography variant="h6">

                            {performance.totalSeconds.toFixed(2)} sec

                        </Typography>

                    </Grid>

                </Grid>

            </CardContent>

        </Card>

    );

}