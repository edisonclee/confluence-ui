import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import {
  Box,
  Chip,
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

const PAGE_SIZE = 10;

const COLORS = {
  panel: "#0d141c",
  panelHeader: "#101a23",

  symbolColumn: "#13212c",
  directionColumn: "#101d25",
  patternColumn: "#0e1820",

  border: "#26394a",
  borderSoft: "#1d2d3b",

  text: "#dce8f0",
  muted: "#718798",

  cyan: "#55c9df",
};

export default function TransitionResultTable({
  results,
}) {
  if (!results || results.length === 0) {
    return null;
  }
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [results]);

  const pageCount = Math.ceil(
    results.length / PAGE_SIZE,
  );

  const startIndex =
    (page - 1) * PAGE_SIZE;

  const pagedResults = results.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  const emptyRows = Math.max(
    0,
    PAGE_SIZE - pagedResults.length,
  );

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: 430,

        border: `1px solid ${COLORS.border}`,
        borderRadius: "7px",
        overflow: "hidden",

        backgroundColor: COLORS.panel,

        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* =====================================================
          TABLE TITLE
          ===================================================== */}
      <Box
        sx={{
          minHeight: 42,
          px: 1.75,

          display: "flex",
          alignItems: "center",

          backgroundColor: COLORS.panelHeader,

          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <Typography
          sx={{
            color: COLORS.text,

            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          Transition Signals
        </Typography>

        <Typography
          sx={{
            ml: "auto",

            color: COLORS.muted,

            fontFamily: "monospace",
            fontSize: "11px",
            fontWeight: 600,

            letterSpacing: "0.04em",

            whiteSpace: "nowrap",
          }}
        >
          {results.length} MATCHES
        </Typography>
      </Box>

      {/* =====================================================
          TABLE
          ===================================================== */}
      <Table
        size="small"
        sx={{
          tableLayout: "fixed",
          width: "100%",
        }}
      >
        <TableHead>
          <TableRow>
            {/* SYMBOL */}
            <TableCell
              sx={{
                width: "45%",

                py: 1.25,
                px: 1.75,

                backgroundColor:
                  COLORS.symbolColumn,

                borderBottom:
                  `1px solid ${COLORS.border}`,

                color: "#9bb0bf",

                fontSize: "11px",
                fontWeight: 700,

                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Symbol
            </TableCell>

            {/* DIRECTION */}
            <TableCell
              align="center"
              sx={{
                width: "25%",

                py: 1.25,
                px: 1.5,

                backgroundColor:
                  COLORS.directionColumn,

                borderBottom:
                  `1px solid ${COLORS.border}`,

                color: "#9bb0bf",

                fontSize: "11px",
                fontWeight: 700,

                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Direction
            </TableCell>

            {/* PATTERN */}
            <TableCell
              align="center"
              sx={{
                width: "30%",

                py: 1.25,
                px: 1.5,

                backgroundColor:
                  COLORS.patternColumn,

                borderBottom:
                  `1px solid ${COLORS.border}`,

                color: "#9bb0bf",

                fontSize: "11px",
                fontWeight: 700,

                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Pattern
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {pagedResults.map((result) => (
            <TableRow
              key={`${result.symbol}-${result.direction}-${result.pattern}`}
              sx={{
                height: 46,

                "&:hover td": {
                  backgroundColor: "#162632",
                },
              }}
            >
              {/* SYMBOL */}
              <TableCell
                sx={{
                  px: 1.75,
                  py: 1,

                  backgroundColor:
                    COLORS.symbolColumn,

                  borderBottom:
                    `1px solid ${COLORS.borderSoft}`,
                }}
              >
                <Link
                  href={`https://www.tradingview.com/chart/?symbol=BITUNIX:${result.symbol}.P`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="hover"
                  sx={{
                    color: COLORS.cyan,

                    fontFamily: "monospace",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  {result.symbol}
                </Link>

                <Typography
                  component="span"
                  sx={{
                    ml: 0.6,

                    color: "#7c91a0",

                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                >
                  / USDT
                </Typography>
              </TableCell>

              {/* DIRECTION */}
              <TableCell
                align="center"
                sx={{
                  px: 1.5,
                  py: 1,

                  backgroundColor:
                    COLORS.directionColumn,

                  borderBottom:
                    `1px solid ${COLORS.borderSoft}`,
                }}
              >
                <Chip
                  label={result.direction}
                  size="small"
                  sx={{
                    height: 25,

                    px: 0.8,

                    fontSize: "11px",
                    fontWeight: 700,

                    color:
                      result.direction === "LONG"
                        ? "#8ff0c8"
                        : "#ff9a9a",

                    backgroundColor:
                      result.direction === "LONG"
                        ? "rgba(52, 211, 153, 0.12)"
                        : "rgba(248, 113, 113, 0.12)",

                    border:
                      result.direction === "LONG"
                        ? "1px solid rgba(85, 223, 176, 0.35)"
                        : "1px solid rgba(248, 113, 113, 0.35)",

                    "& .MuiChip-label": {
                      px: 1,
                    },
                  }}
                />
              </TableCell>

              {/* PATTERN */}
              <TableCell
                align="center"
                sx={{
                  px: 1.5,
                  py: 1,

                  backgroundColor:
                    COLORS.patternColumn,

                  borderBottom:
                    `1px solid ${COLORS.borderSoft}`,

                  color: "#d6e4eb",

                  fontFamily: "monospace",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {result.pattern}
              </TableCell>
            </TableRow>
          ))}

          {/* EMPTY ROWS
              Keeps table height consistent */}
          {Array.from({
            length: emptyRows,
          }).map((_, index) => (
            <TableRow
              key={`empty-${index}`}
              sx={{
                height: 46,
              }}
            >
              <TableCell
                sx={{
                  backgroundColor:
                    COLORS.symbolColumn,

                  borderBottom:
                    `1px solid ${COLORS.borderSoft}`,
                }}
              />

              <TableCell
                sx={{
                  backgroundColor:
                    COLORS.directionColumn,

                  borderBottom:
                    `1px solid ${COLORS.borderSoft}`,
                }}
              />

              <TableCell
                sx={{
                  backgroundColor:
                    COLORS.patternColumn,

                  borderBottom:
                    `1px solid ${COLORS.borderSoft}`,
                }}
              />
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* =====================================================
          PAGINATION
          ===================================================== */}
      <Box
        sx={{
          mt: "auto",

          height: 52,
          px: 1.75,

          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",

          backgroundColor: COLORS.panelHeader,

          borderTop:
            `1px solid ${COLORS.border}`,
        }}
      >
        {pageCount > 1 && (
          <Pagination
            page={page}
            count={pageCount}
            size="small"
            onChange={(event, value) =>
              setPage(value)
            }
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#8da2b3",

                fontSize: "11px",

                minWidth: 28,
                height: 28,
              },

              "& .Mui-selected": {
                backgroundColor:
                  COLORS.cyan,

                color: "#071016",
              },
            }}
          />
        )}
      </Box>
    </Box>
  );
}

TransitionResultTable.propTypes = {
  results: PropTypes.array.isRequired,
};