# **LeadTime Intelligence: Global Container Logistics AI Pathfinder**

## **Project Overview**
Enterprise-grade global container logistics lead time simulator and route visualization platform. Analyzes standardized global container liner shipping patterns and precisely reproduces 'maritime highways' between hub ports.

## **Core Features**

### **1. Advanced Logistics Analysis Engine**
- **Dynamic Bottleneck Algorithm:** Applies real-time risk weights to Dijkstra's algorithm for automatic rerouting and delay calculation.
- **Inland Transport Simulation:** Integrated First/Last Mile trucking time and cost simulations from ports/airports to final destinations.
- **Granular Cargo Delays:** Specific customs and quarantine delay times based on cargo characteristics (Reefer, DG, Pharma, etc.).

### **2. 3D Load Planner (Professional Edition)**
- **Weight Distribution Optimization:** Optimizes packing sequence based on cargo weight data (heavier items at bottom).
- **Cargo Grouping (Mixing Restrictions):** Reflects compatibility constraints through group designations.
- **Interactive HUD:** Real-time monitoring of packing efficiency, weight balance, and unpacked item counts.

### **3. UI/UX & Map Intelligence**
- **One-Screen Analysis:** Core results (Lead Time, Cost, Comparison) displayed directly under the map for zero-scroll workflow.
- **Map Risk Visualization:** Visualizes major delay zones (Red Sea, Panama) as Red-Zones with news popups.
- **Smart Port Search:** Real-time autocomplete filtering system for 100+ global hubs.

### **4. Language & Localization**
- **Unified English Interface:** All pages and analysis results are strictly in English for global professional consistency.
- **Currency Support:** Dynamic switching between USD, EUR, and KRW.

## **Latest Updates**
- **English Unification:** Removed multilingual toggle logic and standardized all UI/UX to English.
- **3D Planner Restoration:** Fixed library loading and initialization issues for the 3D Load Planner.
- **News Feed Repair:** Fixed element ID mismatches and standardized news rendering to English format.
- **Analyzer Optimization:** Fixed Korean labels in the ETD and insights sections.

## **Current Implementation Plan**
1. **Liner Schedule Integration:** Preparing to integrate real-time carrier schedules via external logistics APIs.
2. **Account Integration:** Firebase Auth integration for user-specific route history and shipping templates.
