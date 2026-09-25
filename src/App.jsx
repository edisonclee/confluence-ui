import { useState } from "react";

import {
  AppBar,
  Box,
  Tabs,
  Tab,
  Toolbar,
  Typography,
} from "@mui/material";

import TrackChangesIcon from "@mui/icons-material/TrackChanges";

import Dashboard from "./pages/Dashboard";
import TransitionDashboard from "./pages/TransitionDashboard";
import OiRadar from "./pages/OiRadar";

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <Box className="app-shell">
      <AppBar
        position="sticky"
        className="app-header"
      >
        <Toolbar className="app-toolbar">
          <Box className="app-brand">
            <Box className="app-brand-icon">
              <TrackChangesIcon fontSize="small" />
            </Box>

            <Box>
              <Typography className="app-brand-name">
                Confluence
              </Typography>

              <Typography className="app-brand-subtitle">
                Market Scanner
              </Typography>
            </Box>
          </Box>
        </Toolbar>

        <Tabs
          value={tab}
          onChange={(event, value) => setTab(value)}
          centered
          className="app-navigation"
        >
          <Tab label="BB50 Touch Scanner" />

          <Tab label="Transition Play Scanner" />

          <Tab label="OI Scanner" />
        </Tabs>
      </AppBar>

      <Box className="app-content">
        {tab === 0 && <Dashboard />}

        {tab === 1 && <TransitionDashboard />}

        {tab === 2 && <OiRadar />}
      </Box>
    </Box>
  );
}