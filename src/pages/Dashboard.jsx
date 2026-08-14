import { useState } from "react";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

import { runScanner } from "../api/scannerApi";

import DashboardHeader from "../components/DashboardHeader";
import PerformanceCard from "../components/PerformanceCard";
import ScannerFilters from "../components/ScannerFilters";
import MultiTimeframeTable from "../components/MultiTimeframeTable";
import ResultTable from "../components/ResultTable";

import SummaryCard from "../components/SummaryCard";

import {

    filterTimeframes,

    filterMultiTimeframe

} from "../utils/filterResults";

export default function Dashboard() {

    const [loading, setLoading] =
        useState(false);

    const [dashboardData, setDashboardData] =
        useState({

            performance: null,

            generatedAt: null,

            symbolsScanned: 0,

            totalMatches: 0,

            multiTimeframeMatches: 0,

            multiTimeframe: [],

            timeframes: []

        });

    const [filters, setFilters] =
        useState({

            coin: "",

            minBbWidth: "",

            timeframes: [

                "D1",

                "H4",

                "H1",

                "M15"

            ]

        });

    const filteredTimeframes =

        filterTimeframes(

            dashboardData.timeframes,

            filters

        );

    const filteredMultiTimeframe =

        filterMultiTimeframe(

            dashboardData.multiTimeframe,

            filters

        );

    async function handleRunScanner() {

        try {

            setLoading(true);

            const response =
                await runScanner();

            setDashboardData({

                performance: {

                    downloadSeconds:
                        response.downloadSeconds,

                    scanSeconds:
                        response.scanSeconds,

                    totalSeconds:
                        response.totalSeconds

                },

                generatedAt:
                    response.generatedAt,

                symbolsScanned:
                    response.symbolsScanned,

                totalMatches:
                    response.totalMatches,

                multiTimeframeMatches:
                    response.multiTimeframeMatches,

                multiTimeframe:
                    response.multiTimeframe,

                timeframes:
                    response.timeframes

            });

        } catch (error) {

            console.error(error);

            alert(
                "Unable to connect to backend.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <Container
            maxWidth="xl"
            sx={{
                mt: 4,
                mb: 4
            }}>

            <DashboardHeader

                loading={loading}

                onRunScan={handleRunScanner}

                generatedAt={dashboardData.generatedAt}

            />

            <SummaryCard

                symbolsScanned={
                    dashboardData.symbolsScanned
                }

                totalMatches={
                    dashboardData.totalMatches
                }

                multiTimeframeMatches={
                    dashboardData.multiTimeframeMatches
                }

            />

            <Grid
                container
                spacing={3}
                sx={{ mb: 3 }}>

                <Grid
                    size={{
                        xs: 12,
                        md: 4
                    }}>

                    <PerformanceCard

                        performance={dashboardData.performance}

                    />

                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        md: 8
                    }}>

                    <ScannerFilters

                        filters={filters}

                        setFilters={setFilters}

                    />

                </Grid>

            </Grid>

            <MultiTimeframeTable

                results={filteredMultiTimeframe}

            />

            {

                filteredTimeframes.map(timeframe => (

                    <ResultTable

                        key={timeframe.timeframe}

                        title={`${timeframe.chartTimeframeDisplayName} | ${timeframe.bbTimeframeDisplayName} BB`}

                        results={timeframe.results}

                    />

                ))

            }

        </Container>

    );

}