import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Chip,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function MultiTimeframeTable({

    results

}) {

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

                <Typography

                    fontWeight={600}

                >

                    ⭐ Multi-Timeframe ({results.length})

                </Typography>

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

                            <Table size="small">

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

                                        results.map(result => (

                                            <TableRow

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

                                                                        mr: 0.5

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

                        )

                }

            </AccordionDetails>

        </Accordion>

    );

}