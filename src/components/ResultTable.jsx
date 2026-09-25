import { useEffect, useMemo, useState } from "react";

import {
  Box,
  Link,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { getBbColor } from "../utils/bbColor";

const PAGE_SIZE = 10;

const COLORS = {
  panel: "#0d141c",
  panelHeader: "#101a23",
  marketColumn: "#111e29",
  detailColumn: "#0d161f",
  border: "#26394a",
  borderSoft: "#1d2d3b",
  text: "#dce8f0",
  muted: "#718798",
  cyan: "#55c9df",
};

export default function ResultTable({
  title,
  results,
}) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [results]);

  const sortedResults = useMemo(() => {
    return [...results].sort(
      (a, b) => b.bbWidthPercent - a.bbWidthPercent,
    );
  }, [results]);

  const pageCount = Math.ceil(
    sortedResults.length / PAGE_SIZE,
  );

  const pagedResults = sortedResults.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  const emptyRows = Math.max(
    0,
    PAGE_SIZE - pagedResults.length,
  );

  return (
    <Box
      sx={{
        width: "100%",
        width: "100%",
        height: "100%",
        minWidth: 0,

        border: `1px solid ${COLORS.border}`,
        borderRadius: "7px",
        overflow: "hidden",

        backgroundColor: COLORS.panel,

        display: "flex",
        flexDirection: "column",

        border: `1px solid ${COLORS.border}`,
        borderRadius: "7px",
        overflow: "hidden",

        backgroundColor: COLORS.panel,
      }}
    >
      {/* TABLE HEADER */}
      <Box
        sx={{
          minHeight: 38,
          px: 1.5,

          display: "flex",
          alignItems: "center",

          backgroundColor: COLORS.panelHeader,
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <Typography
          sx={{
            color: COLORS.text,
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            ml: "auto",
            color: COLORS.muted,
            fontFamily: "monospace",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {results.length} MATCHES
        </Typography>
      </Box>

      {/* TABLE */}
      <Table
        size="small"
        sx={{
          tableLayout: "fixed",
          width: "100%",
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                width: "32%",
                py: 1.1,
                px: 1.5,

                backgroundColor: "#13212c",
                borderBottom: `1px solid ${COLORS.border}`,

                color: "#8da2b3",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Market
            </TableCell>

            <TableCell
              sx={{
                width: "68%",
                py: 1.1,
                px: 1.5,

                backgroundColor: "#101a23",
                borderBottom: `1px solid ${COLORS.border}`,

                color: "#8da2b3",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              BB50 Touch Detail
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pagedResults.map((result) => (
            <TableRow
              key={result.symbol}
              sx={{
                height: 41,

                "&:hover td": {
                  backgroundColor: "#162632",
                },
              }}
            >
              <TableCell
                sx={{
                  px: 1.5,
                  py: 0.8,

                  backgroundColor: COLORS.marketColumn,
                  borderBottom: `1px solid ${COLORS.borderSoft}`,

                  fontFamily: "monospace",
                  fontSize: "10px",
                }}
              >
                <Link
                  href={`https://www.tradingview.com/chart/?symbol=BITUNIX:${result.symbol}.P`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    color: COLORS.cyan,
                    fontSize: "10px",
                    fontFamily: "monospace",
                  }}
                >
                  {result.symbol}
                </Link>

                <Typography
                  component="span"
                  sx={{
                    color: "#7c91a0",
                    fontSize: "10px",
                    fontFamily: "monospace",
                    ml: 0.5,
                  }}
                >
                  / USDT
                </Typography>
              </TableCell>

              <TableCell
                sx={{
                  px: 1.5,
                  py: 0.8,

                  backgroundColor: COLORS.detailColumn,
                  borderBottom: `1px solid ${COLORS.borderSoft}`,

                  fontFamily: "monospace",
                  fontSize: "10px",
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    color: getBbColor(
                      result.bbWidthPercent,
                    ),
                    fontFamily: "monospace",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  {result.bbWidthPercent.toFixed(2)}%
                </Typography>
              </TableCell>
            </TableRow>
          ))}

          {/* BLANK ROWS KEEP ALL TABLES THE SAME HEIGHT */}
          {Array.from({ length: emptyRows }).map(
            (_, index) => (
              <TableRow
                key={`empty-${index}`}
                sx={{
                  height: 41,
                }}
              >
                <TableCell
                  sx={{
                    backgroundColor: COLORS.marketColumn,
                    borderBottom: `1px solid ${COLORS.borderSoft}`,
                  }}
                />

                <TableCell
                  sx={{
                    backgroundColor: COLORS.detailColumn,
                    borderBottom: `1px solid ${COLORS.borderSoft}`,
                  }}
                />
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <Box
        sx={{
          height: 50,
          px: 1.5,

          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",

          backgroundColor: COLORS.panelHeader,
          borderTop: `1px solid ${COLORS.border}`,
        }}
      >
        {pageCount > 1 && (
          <Pagination
            page={page}
            count={pageCount}
            size="small"
            onChange={(event, value) => setPage(value)}
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#8da2b3",
                fontSize: "11px",
                minWidth: 28,
                height: 28,
              },

              "& .Mui-selected": {
                backgroundColor: COLORS.cyan,
                color: "#071016",
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}