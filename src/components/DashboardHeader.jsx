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

                p: 2,

                mb: 3,

                backgroundColor: "background.paper"

            }}

        >

            <Stack

                direction="row"

                justifyContent="space-between"

                alignItems="center"

            >

                <Box>

                    <Typography

                        variant="h6"

                        fontWeight={700}

                    >

                        Confluence Scanner

                    </Typography>

                    <Typography

                        variant="caption"

                        color="text.secondary"

                    >

                        {

                            generatedAt

                                ? `Last Scan: ${new Date(generatedAt).toLocaleString()}`

                                : "No scan executed"

                        }

                    </Typography>

                </Box>

                <Button

                    variant="contained"

                    size="small"

                    sx={{

                        ml: 3,

                        minWidth: 110,

                        height: 40

                    }}

                    onClick={onRunScan}

                    disabled={loading}

                    startIcon={

                        loading

                            ? (

                                <CircularProgress

                                    size={16}

                                    color="inherit"

                                />

                            )

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

            <Divider sx={{ my: 1.5 }} />

            <SummaryCard

                symbolsScanned={dashboardData.symbolsScanned}

                totalMatches={dashboardData.totalMatches}

                multiTimeframeMatches={dashboardData.multiTimeframeMatches}

                performance={dashboardData.performance}

            />

            <Divider sx={{ my: 1.5 }} />

            <ScannerFilters

                filters={filters}

                setFilters={setFilters}

            />

        </Box>

    );

}