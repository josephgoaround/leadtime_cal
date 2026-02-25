# **LeadTime Intelligence: Global Logistics AI Pathfinder**

## **Project Overview**
엔터프라이즈급 글로벌 물류 리드타임 시뮬레이터 및 경로 시각화 플랫폼. 현실적인 해상 및 항공 경로를 기반으로 전 세계 140개 이상의 주요 허브 간의 운송 시간 및 비용을 정밀 분석하며, 지형지물을 완벽히 회피하는 고도화된 다익스트라(Dijkstra) 엔진을 탑재하고 있습니다.

## **Core Features** (Implemented)

### **1. Advanced Logistics Engine**
- **Mode Simulation:** Sea (16kts), Air (Cargo Jet) 간의 리드타임 비교.
- **Cost Analysis:** 운송 거리와 리스크 할증료를 반영한 대략적인 물류 비용 산출.
- **Maximum Global Hub Network:** 전 세계 140개 이상의 주요 항구 및 공항 데이터 (글로벌 전역 커버).

### **2. Intelligent Routing**
- **Zero-Intrusion Maritime:** 250개 이상의 해상 전용 노드를 통해 내륙 및 섬 침범 0% 달성.
- **Oceanic Crossing Optimization:** 유럽-아메리카(대서양), 아시아-아메리카(태평양) 항로를 최단 거리로 자동 연결.
- **Antimeridian Connectivity:** 태평양 횡단 시 시각적 끊김 없는 매끄러운 항로 시각화.

### **3. UI/UX & Intelligence**
- **Dynamic SCM Intel:** 출/도착 국가별 맞춤형 관세 및 물류 정보 자동 생성.
- **Multi-language Support:** UI 및 모든 데이터의 실시간 한/영 전환.
- **Live Alert:** 글로벌 리스크(홍해 등) 실시간 공지 및 자동 경로 반영.

## **Technical Stack**
- **Frontend:** Vanilla JavaScript (ES6+), Tailwind CSS.
- **Mapping:** Leaflet.js (Esri World Street Map style).
- **Routing Algorithm:** Graph-based Dijkstra Pathfinding.
