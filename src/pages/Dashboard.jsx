import { useState } from "react";

import Container from "@mui/material/Container";

import { runScanner } from "../api/scannerApi";

import DashboardHeader from "../components/DashboardHeader";
import MultiTimeframeTable from "../components/MultiTimeframeTable";
import ResultTable from "../components/ResultTable";

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

                dashboardData={dashboardData}

                filters={filters}

                setFilters={setFilters}

            />

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