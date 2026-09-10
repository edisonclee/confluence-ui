# Confluence UI

A React-based dashboard for the **Confluence Scanner** cryptocurrency market-analysis application.

The application provides a web interface for viewing scanner results and interacting with the backend REST API.

## Features

* Cryptocurrency scanner dashboard
* REST API integration
* Market-data presentation
* Scanner result tables
* Responsive Material UI components
* Client-side routing
* API communication using Axios
* Modular component and page structure

## Architecture

```text
┌──────────────────────────────────────┐
│              React UI                │
│                                      │
│  ┌────────────┐    ┌──────────────┐ │
│  │   Pages    │    │  Components  │ │
│  └─────┬──────┘    └──────┬───────┘ │
│        │                   │         │
│        └─────────┬─────────┘         │
│                  ▼                   │
│           API / Axios Layer          │
└──────────────────┬───────────────────┘
                   │
                   │ REST
                   ▼
        ┌──────────────────────┐
        │   Confluence Scanner │
        │    Spring Boot API   │
        └──────────────────────┘
```

## Technology Stack

| Area            | Technology   |
| --------------- | ------------ |
| Framework       | React        |
| Build Tool      | Vite         |
| UI Library      | Material UI  |
| HTTP Client     | Axios        |
| Routing         | React Router |
| Language        | JavaScript   |
| Package Manager | npm          |

## Project Structure

```text
src/
├── api/
│   └── API integration
│
├── components/
│   └── Reusable UI components
│
├── pages/
│   └── Application pages
│
├── theme/
│   └── Material UI theme
│
├── utils/
│   └── Utility functions
│
├── App.jsx
└── main.jsx
```

The project is structured to keep API communication, reusable components, pages, styling, and utility functions separated.

## Getting Started

### Requirements

* Node.js
* npm

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Vite will start the development server and provide the local URL.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Backend

This application is designed to work with the separate Spring Boot backend:

**confluence-scanner**

```text
React UI
   │
   │ Axios / REST
   ▼
Spring Boot Backend
   │
   ▼
Market Data APIs
```

## Development

The UI is being developed alongside the backend as the scanner functionality expands.

The project is intentionally separated from the backend so that the frontend and API can be developed and deployed independently.

## Project Status

This is an actively developed personal project.

The dashboard will continue to evolve as additional market-analysis features are added to the backend.

## Planned Improvements

* Expanded scanner dashboards
* Additional technical indicators
* Volume analysis
* Open Interest analysis
* Funding-rate information
* Improved market-data visualization
* Additional filtering and sorting options

## Related Repository

**confluence-scanner** — Spring Boot backend and REST API.
