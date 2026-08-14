import {
    Box,
    Button,
    CircularProgress,
    Paper,
    Stack,
    Typography
} from "@mui/material";

export default function DashboardHeader({

    loading,

    onRunScan,

    generatedAt

}) {

    return (

        <Paper
            elevation={3}
            sx={{
                p: 3,
                mb: 3
            }}
        >

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
            >

                <Box>

                    <Typography
                        variant="h4"
                        gutterBottom>

                        Confluence Scanner

                    </Typography>

                    <Typography
                        color="text.secondary">

                        {

                            generatedAt

                                ? `Last Scan : ${new Date(generatedAt).toLocaleString()}`

                                : "No scan has been executed."

                        }

                    </Typography>

                </Box>

                <Button

                    variant="contained"

                    size="large"

                    onClick={onRunScan}

                    disabled={loading}

                    startIcon={

                        loading

                            ? <CircularProgress
                                size={18}
                                color="inherit" />

                            : null

                    }

                >

                    {

                        loading

                            ? "Scanning..."

                            : "Run Scan"

                    }

                </Button>

            </Box>

        </Paper>

    );

}