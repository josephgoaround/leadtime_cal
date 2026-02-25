# **LeadTime Intelligence: Global Logistics AI Pathfinder**

## **Project Overview**
엔터프라이즈급 글로벌 물류 리드타임 시뮬레이터 및 경로 시각화 플랫폼. 현실적인 해상 및 항공 경로를 기반으로 전 세계 30개 이상의 주요 항구 간의 운송 시간 및 대략적인 비용을 정밀하게 분석하며, 지형지물을 완벽히 회피하는 해상 전용 다익스트라(Dijkstra) 엔진을 탑재하고 있습니다.

## **Core Features** (Implemented)

### **1. Advanced Logistics Engine**
- **Mode Simulation:** Sea (16kts), Air (Cargo Jet) 간의 리드타임 비교.
- **Cost Analysis:** 운송 거리와 리스크 할증료를 반영한 대략적인 물류 비용 산출 (참조용).
- **Global Hub Network:** 전 세계 30개 이상의 주요 항구 데이터 보유 (닝보, 제벨 알리, 안트베르펜 등 포함).

### **2. Zero-Intrusion Maritime Routing**
- **Precision Waypoints:** 100개 이상의 해상 전용 노드를 통해 내륙 및 섬 침범 0% 달성.
- **Dijkstra Optimization:** 해상 네트워크 상에서 수학적으로 증명된 최단 바닷길 탐색.
- **Antimeridian Handling:** 태평양 횡단 시 날짜변경선 좌표 보정으로 시각적 연속성 확보.

### **3. UI/UX & Intelligence**
- **Multi-language Support:** UI 및 모든 면책 조항(Disclaimer)의 실시간 한/영 전환.
- **Risk Simulation:** 홍해 및 파나마 리스크 선택 시 즉각적인 우회 항로 및 비용 할증 반영.
- **Interactive Map:** 빨간색 점선 스타일의 애니메이션 항로 시각화.

## **Technical Stack**
- **Frontend:** Vanilla JavaScript (ES6+), Tailwind CSS.
- **Mapping:** Leaflet.js.
- **Routing Algorithm:** Graph-based Dijkstra Pathfinding.

## **Recent Updates**
- **Port Expansion:** 전 세계 핵심 거점 항구를 30개 이상으로 대폭 확충.
- **Cost Estimation:** 해상/항공별 거리 기반 운임 및 리스크 서차지 시뮬레이션 도입.
- **Precision Routing:** 내륙 침범 문제를 완전히 해결한 초정밀 해상 네트워크 그래프 적용.
- **Refined Disclaimers:** 비용 및 리드타임에 대한 다국어 면책 조항 강화.
