import {
    Box,
    Button,
    CircularProgress,
    Divider,
    Stack,
    Typography
} from "@mui/material";

import SummaryCard from "./SummaryCard";
import ScannerFilters from "./ScannerFilters";

export default function DashboardHeader({

    loading,

    onRunScan,

    generatedAt,

    dashboardData,

    filters,

    setFilters

}) {

    return (

        <Box

            sx={{

                border: "1px solid",

                borderColor: "divider",

                borderRadius: 2,

                p: 3,

                mb: 3,

                backgroundColor: "background.paper"

            }}

        >

            {/* HEADER */}

            <Stack

                direction="row"

                justifyContent="space-between"

                alignItems="flex-start"

            >

                <Box>

                    <Typography

                        variant="h5"

                        fontWeight={600}

                    >

                        Confluence Scanner

                    </Typography>

                    <Typography

                        variant="body2"

                        color="text.secondary"

                        sx={{ mt: 0.5 }}

                    >

                        {

                            generatedAt

                                ? `Last Scan : ${new Date(generatedAt).toLocaleString()}`

                                : "No scan has been executed."

                        }

                    </Typography>

                </Box>

                <Button

                    variant="contained"

                    onClick={onRunScan}

                    disabled={loading}

                    startIcon={

                        loading

                            ? <CircularProgress

                                size={18}

                                color="inherit"

                            />

                            : null

                    }

                >

                    {

                        loading

                            ? "Scanning..."

                            : "Run Scan"

                    }

                </Button>

            </Stack>

            <Divider sx={{ my: 2 }} />

            <SummaryCard

                symbolsScanned={dashboardData.symbolsScanned}

                totalMatches={dashboardData.totalMatches}

                multiTimeframeMatches={dashboardData.multiTimeframeMatches}

                performance={dashboardData.performance}

            />

            <Divider sx={{ my: 2 }} />

            <ScannerFilters

                filters={filters}

                setFilters={setFilters}

            />

        </Box>

    );

}