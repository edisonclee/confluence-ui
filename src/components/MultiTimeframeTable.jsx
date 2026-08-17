import { useEffect, useMemo, useState } from "react";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Link,
    Pagination,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const PAGE_SIZE = 10;

export default function MultiTimeframeTable({

    results

}) {

    const [page, setPage] =
        useState(1);

    useEffect(() => {

        setPage(1);

    }, [results]);

    const sortedResults = useMemo(() => {

        return [...results].sort((a, b) => {

            if (b.timeframes.length !== a.timeframes.length) {

                return b.timeframes.length - a.timeframes.length;

            }

            return a.symbol.localeCompare(b.symbol);

        });

    }, [results]);

    const pageCount = Math.ceil(

        sortedResults.length /

        PAGE_SIZE

    );

    const pagedResults = sortedResults.slice(

        (page - 1) * PAGE_SIZE,

        page * PAGE_SIZE

    );

    return (

        <Accordion

            defaultExpanded

            sx={{

                mt: 2

            }}

        >

            <AccordionSummary

                expandIcon={<ExpandMoreIcon />}

            >

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                    width="100%"

                >

                    <Typography

                        fontWeight={600}

                    >

                        ⭐ Multi-Timeframe

                    </Typography>

                    <Chip

                        label={`${results.length} Matches`}

                        size="small"

                    />

                </Stack>

            </AccordionSummary>

            <AccordionDetails>

                {

                    results.length === 0 ?

                        (

                            <Typography

                                color="text.secondary"

                            >

                                No multi-timeframe matches.

                            </Typography>

                        )

                        :

                        (

                            <>

                                <Table

                                    size="small"

                                    stickyHeader

                                >

                                    <TableHead>

                                        <TableRow>

                                            <TableCell>

                                                Coin

                                            </TableCell>

                                            <TableCell>

                                                Matching Timeframes

                                            </TableCell>

                                        </TableRow>

                                    </TableHead>

                                    <TableBody>

                                        {

                                            pagedResults.map(result => (

                                                <TableRow

                                                    hover

                                                    key={result.symbol}

                                                >

                                                    <TableCell>

                                                        <Link

                                                            href={`https://www.tradingview.com/chart/?symbol=BITUNIX:${result.symbol}.P`}

                                                            target="_blank"

                                                            rel="noopener noreferrer"

                                                            underline="hover"

                                                        >

                                                            {result.symbol}

                                                        </Link>

                                                    </TableCell>

                                                    <TableCell>

                                                        {

                                                            result.timeframes.map(

                                                                timeframe => (

                                                                    <Chip

                                                                        key={timeframe}

                                                                        label={timeframe}

                                                                        size="small"

                                                                        sx={{

                                                                            mr: 0.5,

                                                                            mb: 0.5

                                                                        }}

                                                                    />

                                                                )

                                                            )

                                                        }

                                                    </TableCell>

                                                </TableRow>

                                            ))

                                        }

                                    </TableBody>

                                </Table>

                                {

                                    pageCount > 1 &&

                                    (

                                        <Stack

                                            direction="row"

                                            justifyContent="flex-end"

                                            sx={{

                                                mt: 2

                                            }}

                                        >

                                            <Pagination

                                                page={page}

                                                count={pageCount}

                                                color="primary"

                                                onChange={(event, value) =>

                                                    setPage(value)

                                                }

                                            />

                                        </Stack>

                                    )

                                }

                            </>

                        )

                }

            </AccordionDetails>

        </Accordion>

    );

}