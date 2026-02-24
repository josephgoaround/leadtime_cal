
# Project Blueprint: Global Shipping Lead Time & Customs Estimator

## Overview

This application is a web-based tool designed to provide estimated lead times for international shipping routes. It has evolved from a country-to-country estimator to a detailed city-to-city logistics planner. It visualizes the entire shipping journey, including the first mile, middle mile (via sea or air), and last mile, on an interactive map.

## Design and Features

### Implemented

*   **UI/UX:**
    *   A clean, modern dashboard layout built with Tailwind CSS.
    *   Responsive design for both desktop and mobile use.
    *   Interactive map using Leaflet.js to visualize shipping routes.
    *   Dynamic popups on the map displaying real-time news headlines for origin and destination countries, providing SCM intelligence.

*   **Core Functionality:**
    *   An input form for users to select cargo type and departure/arrival countries.
    *   JavaScript logic to dynamically calculate and display estimated shipping lead time.
    *   Integration with the NewsAPI.org to fetch and display relevant news.

## Current Plan: Implement Multi-Modal, City-to-City Logistics

The current goal is to transform the estimator into a detailed logistics planning tool. This involves shifting from country-level estimates to specific city-to-city routes, incorporating multi-modal transport (sea/air), and breaking down the journey into distinct logistical segments.

**Steps:**

1.  **Enhance the UI (`index.html`):**
    *   Modify the dropdown menus to allow users to select specific origin and destination *cities* instead of countries.
    *   Add a new selection input for the primary `Transport Mode` (e.g., Sea Freight, Air Freight).

2.  **Restructure Data (`main.js`):**
    *   Create a new data structure for `locations`. This will include major cities with their coordinates, country codes, and associated transport `hubs` (major seaports and airports).
    *   Create a separate data structure for `hubs` with their specific coordinates and types (seaport/airport).

3.  **Implement Advanced Routing Logic (`main.js`):**
    *   **Find Nearest Hub:** Develop a function that identifies the most logical starting and ending hubs (seaport or airport) based on the user's selected origin/destination cities and transport mode.
    *   **Segment the Journey:** The application will calculate the route in three parts:
        *   **First Mile:** The overland route from the origin city to the starting hub.
        *   **Middle Mile:** The main transit route (sea or air) between the origin and destination hubs.
        *   **Last Mile:** The overland route from the destination hub to the final destination city.

4.  **Refine Lead Time Calculation:**
    *   Implement a more sophisticated calculation that applies different average speeds for each segment of the journey (e.g., overland truck speed, container ship speed, cargo plane speed).

5.  **Upgrade Map Visualization:**
    *   Display the multi-segment route on the map, using different colors or dashed lines to distinguish the First, Middle, and Last Miles.
    *   Add markers for the origin/destination cities *and* the intermediary hubs to give a clear visual representation of the entire supply chain.
