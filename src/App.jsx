import { useState } from "react";

import {
  AppBar,
  Box,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";

import Dashboard from "./pages/Dashboard";
import TransitionDashboard from "./pages/TransitionDashboard";
import OiRadar from "./pages/OiRadar";

export default function App() {

  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ flexGrow: 1 }}>

      <AppBar position="static">

        <Toolbar>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
          >
            Confluence Scanner
          </Typography>

        </Toolbar>

        <Tabs
          value={tab}
          onChange={(event, value) =>
            setTab(value)
          }
          centered
        >

          <Tab label="BB50 Touch Scanner" />

          <Tab label="Transition Play Scanner" />

          <Tab label="OI Radar" />

        </Tabs>

      </AppBar>

      <Box sx={{ mt: 2 }}>

        {tab === 0 && (
          <Dashboard />
        )}

        {tab === 1 && (
          <TransitionDashboard />
        )}

        {tab === 2 && (
          <OiRadar />
        )}

      </Box>

    </Box>
  );
}