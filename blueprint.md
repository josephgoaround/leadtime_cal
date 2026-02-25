# **LeadTime Intelligence: Global Logistics AI Pathfinder**

## 🚨 Foundational Mandates (Non-Negotiable Policy)
- **Data Integrity:** The `hubs` database (100+ global ports/airports) is a core asset. **NEVER** truncate, simplify, or remove locations during code rewrites. Full global scope is mandatory.
- **Routing Precision:** The 250+ maritime navigation nodes and their connecting edges must be preserved exactly. Pathfinding **MUST NEVER** cross landmasses or islands (e.g., Madagascar, Indonesia, Philippines).
- **Connected Visualization:** Trans-Pacific routes (Antimeridian crossings) must be rendered as a single continuous line using longitude normalization.
- **Intelligence Depth:** Regional SCM and Customs news generation logic must stay dynamic and country-specific.

## **Project Overview**
엔터프라이즈급 글로벌 물류 리드타임 시뮬레이터 및 경로 시각화 플랫폼. 현실적인 해상 및 항공 경로를 기반으로 전 세계 100개 이상의 주요 허브 간의 운송 시간 및 비용을 정밀 분석하며, 지형지물을 완벽히 회피하는 고도화된 다익스트라(Dijkstra) 엔진을 탑재하고 있습니다.

## **Core Features** (Implemented)

### **1. Advanced Logistics Engine**
- **Mode Simulation:** Sea (16kts), Air (Cargo Jet) 간의 리드타임 비교.
- **Cost Analysis:** 운송 거리와 리스크 할증료를 반영한 대략적인 물류 비용 산출.
- **Global Hub Network:** 전 세계 100개 이상의 주요 항구 및 공항 데이터 (글로벌 전역 커버).

### **2. Zero-Intrusion Maritime Routing**
- **Precision Waypoints:** 250개 이상의 해상 전용 노드를 통해 내륙 및 섬 침범 0% 달성.
- **Dijkstra Optimization:** 해상 네트워크 상에서 수학적으로 증명된 최단 바닷길 탐색.
- **Antimeridian Handling:** 태평양 횡단 시 시각적 끊김 없는 연속 항로 시각화.

### **3. UI/UX & Intelligence**
- **Dynamic SCM Intel:** 출/도착 국가별 맞춤형 관세 및 물류 정보 자동 생성.
- **Multi-language Support:** UI 및 모든 데이터의 실시간 한/영 전환.
- **Live Alert:** 글로벌 리스크(홍해 등) 실시간 공지 및 자동 경로 반영.

## **Technical Stack**
- **Frontend:** Vanilla JavaScript (ES6+), Tailwind CSS.
- **Mapping:** Leaflet.js (Esri World Street Map style).
- **Routing Algorithm:** Graph-based Dijkstra Pathfinding.
