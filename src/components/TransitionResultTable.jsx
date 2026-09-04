import PropTypes from "prop-types";

import {
  Chip,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function TransitionResultTable({ results }) {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>

            <TableCell align="center">Direction</TableCell>

            <TableCell align="center">Pattern</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {results.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Typography color="text.secondary">
                  No signals found.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            results.map((result) => (
              <TableRow key={result.symbol} hover>
                <TableCell>
                  <Link
                    href={`https://www.tradingview.com/chart/?symbol=BITUNIX:${result.symbol}.P`}
                    target="_blank"
                    underline="hover"
                  >
                    {result.symbol}
                  </Link>
                </TableCell>

                <TableCell align="center">
                  <Chip
                    label={result.direction}
                    color={result.direction === "LONG" ? "success" : "error"}
                    size="small"
                  />
                </TableCell>

                <TableCell align="center">{result.pattern}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

TransitionResultTable.propTypes = {
  results: PropTypes.array.isRequired,
};
