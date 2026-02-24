
# Project Blueprint: Global Shipping Lead Time & Customs Estimator

## Overview

This application is a web-based tool designed to provide estimated lead times for international shipping routes. It has evolved from a country-to-country estimator to a detailed city-to-city logistics planner. It visualizes the entire shipping journey, including the first mile, middle mile (via sea or air), and last mile, on an interactive map.

## Design and Features

### Implemented

*   **UI/UX:**
    *   A clean, modern dashboard layout built with Tailwind CSS.
    *   Responsive design for both desktop and mobile use.
    *   Interactive map using Leaflet.js to visualize shipping routes.
    *   Dynamic popups on the map displaying SCM issues for origin and destination cities.

*   **Core Functionality:**
    *   An input form for users to select cargo type and departure/arrival cities (Expanded list: NYC, LA, London, Shanghai, Hamburg, Tokyo, Busan, Singapore, Rotterdam, Dubai, Mumbai, Sydney, Santos).
    *   JavaScript logic to dynamically calculate and display estimated shipping lead time.
    *   Integration of **Node-specific SCM Intelligence**, providing critical logistics insights (e.g., port congestion, labor issues) for each selected location.

## Current Plan: Continuous Intelligence & Deployment

The application now provides a comprehensive view of global logistics. The current focus is on maintaining data accuracy and ensuring seamless deployment.

**Steps:**

1.  **Expanded City Database:** Added major global hubs including Singapore, Rotterdam, Dubai, and London.
2.  **SCM Issue Integration:** Every location now includes specific Supply Chain Management (SCM) issues that are displayed upon route calculation.
3.  **Enhanced Visualization:** The map markers and result cards now prominently feature these SCM insights.
4.  **Automated Deployment:** Push the updated code to GitHub to trigger any associated CI/CD or to share the latest features.
