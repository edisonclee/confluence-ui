import {
    Card,
    CardContent,
    Chip,
    Link,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";

import { getBbColor } from "../utils/bbColor";

export default function ResultTable({

    title,

    results

}) {

    if (!results || results.length === 0) {

        return (

            <Card sx={{ mt: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom>

                        {title}

                    </Typography>

                    <Typography
                        color="text.secondary">

                        No matches found.

                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary">

                        Try lowering the minimum BB Width.

                    </Typography>

                </CardContent>

            </Card>

        );

    }

    const sortedResults =
        [...results].sort(

            (a, b) =>

                b.bbWidthPercent - a.bbWidthPercent

        );

    return (

        <Card sx={{ mt: 3 }}>

            <CardContent>

                <Typography
                    variant="h6"
                    gutterBottom>

                    {title}

                </Typography>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>

                                Coin

                            </TableCell>

                            <TableCell
                                align="right">

                                BB Width

                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {

                            sortedResults.map(result => (

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

                                    <TableCell
                                        align="right">

                                        <Chip

                                            label={`${result.bbWidthPercent.toFixed(2)} %`}

                                            sx={{

                                                color:

                                                    getBbColor(

                                                        result.bbWidthPercent

                                                    )

                                            }}

                                        />

                                    </TableCell>

                                </TableRow>

                            ))

                        }

                    </TableBody>

                </Table>

                <Typography

                    sx={{

                        mt: 2,

                        textAlign: "right"

                    }}

                    color="text.secondary">

                    {sortedResults.length} Matches

                </Typography>

            </CardContent>

        </Card>

    );

}