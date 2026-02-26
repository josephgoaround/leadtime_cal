# **LeadTime Intelligence: Global Container Logistics AI Pathfinder**

## **Project Overview**
엔터프라이즈급 글로벌 컨테이너 물류 리드타임 시뮬레이터 및 경로 시각화 플랫폼. 항해사의 전문적 조언을 반영하여 정형화된 전 세계 컨테이너 정기선(Liner Shipping) 항로 패턴을 분석하며, 허브 항구 간의 '해상 고속도로'를 정밀하게 재현합니다.

## **Core Features** (Implemented)

### **1. Container Liner Logistics Engine**
- **Mode Simulation:** Container Shipping (17kts avg), Air Cargo (850km/h) 간의 정밀 비교.
- **Fixed Oceanic Arteries:** 300개 이상의 노드와 실제 정기선 경로를 결합한 '글로벌 컨테이너 백본' 구축.
- **Advanced Cost Analysis:** 노선별 TEU/FEU 벤치마크 운임과 리스크 할증료를 반영한 비용 산출.

### **2. Professional Routing Architecture**
- **Global Arteries Mapping:** 아시아-유럽(수에즈), 북미 횡단(북태평양 대권항로), 대서양 간선 등 주요 항로의 고정 패턴 완벽 반영.
- **Strategic Gateways:** 말라카 해협, 수에즈 운하, 지브롤터 해협, 파나마 운하 등 핵심 길목을 거점으로 하는 경로 최적화.
- **Visual Path Logic:** 컨테이너선 특유의 항로를 파란색 점선으로 시각화하여 정기선 서비스의 특성을 강조.

### **3. UI/UX & Intelligence**
- **Liner-Specific Intel:** 항만 선석 대기 및 컨테이너 터미널 상황을 반영한 동적 정보 생성.
- **Localized Disclaimers:** 분석 결과 하단에 실제 선사 스케줄 확인을 권고하는 면책 공지 강제 노출.
- **Multi-language Support:** UI 및 분석 리포트의 실시간 한/영 전환.

## **Technical Stack**
- **Frontend:** Vanilla JavaScript (ES6+), Tailwind CSS.
- **Mapping:** Leaflet.js (Esri World Street Map style).
- **Routing Algorithm:** Graph-based Dijkstra using a fixed liner shipping network.
