import {
    Card,
    CardContent,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

export default function MultiTimeframeTable({

    results

}) {

    if (!results || results.length === 0) {

        return (

            <Card sx={{ mt: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom>

                        ⭐ Multi-Timeframe

                    </Typography>

                    <Typography>

                        No multi-timeframe matches.

                    </Typography>

                </CardContent>

            </Card>

        );

    }

    return (

        <Card sx={{ mt: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom>

                    ⭐ Multi-Timeframe

                </Typography>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>

                                Coin

                            </TableCell>

                            <TableCell>

                                Timeframes

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            results.map(result => (

                                <TableRow
                                    key={result.symbol}>

                                    <TableCell>

                                        <Link

                                            href={`https://www.tradingview.com/chart/?symbol=BITUNIX:${result.symbol}.P`}

                                            target="_blank"

                                            underline="hover">

                                            {result.symbol}

                                        </Link>

                                    </TableCell>

                                    <TableCell>

                                        {result.timeframes.join(" • ")}

                                    </TableCell>

                                </TableRow>

                            ))

                        }

                    </TableBody>

                </Table>

            </CardContent>

        </Card>

    );

}