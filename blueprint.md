# **LeadTime Intelligence: Global Logistics AI Pathfinder**

## **Project Overview**
엔터프라이즈급 글로벌 물류 리드타임 시뮬레이터 및 경로 시각화 플랫폼. 현실적인 해상 및 항공 경로를 기반으로 전 세계 70개 이상의 주요 도시 간의 운송 시간을 정밀하게 분석하며, 특히 해상 운송의 경우 지리적 요충지(운하, 곶 등)를 경유하여 내륙 침범 없는 완벽한 해상 항로를 제공합니다.

## **Core Features** (Implemented)

### **1. Simplified Logistics Engine**
- **Mode Simulation:** Sea (16kts), Air (Cargo Jet) 간의 리드타임 비교.
- **Departure/Arrival Dates:** 실시간 도착 예정일(ETA) 산출.
- **Global Hub Network:** 전 세계 70개 이상의 주요 항구 및 공항 데이터를 보유 (Asia, Europe, Americas, Africa, Oceania).

### **2. Advanced Maritime Routing**
- **Region-Based Waypoints:** 출발지와 목적지의 지리적 영역을 분석하여 적절한 해상 경로 자동 생성.
- **Realistic Ocean Paths:** 육지를 가로지르지 않고 Malacca, Suez, Panama, Gibraltar, Good Hope, Cape Horn 등 주요 해상 병목 지점을 경유.
- **Dynamic Risk Rerouting:** 홍해(Red Sea), 파나마 운하(Panama Canal) 리스크 발생 시 자동으로 희망봉(Good Hope) 등으로 우회하며 추가 소요 시간 반영.

### **3. Operational Insights**
- **Milestone Breakdown:** 수출 통관, 해상/항공 운송, 수입 핸들링 등 단계별 소요 시간 상세 제공.
- **Interactive Map:** Leaflet.js를 이용한 애니메이션 항로 시각화.

## **Technical Stack**
- **Frontend:** Vanilla JavaScript (ES6+), Tailwind CSS.
- **Mapping:** Leaflet.js (Ant-Path Animation).
- **Routing Algorithm:** Region-categorized waypoint navigation.

## **Recent Updates**
- **UI Simplification:** 불필요한 비용 분석 및 HS Code 필드 제거로 직관성 극대화.
- **City Database Expansion:** 전 세계 주요 도시 데이터를 70개 이상으로 대폭 확충.
- **Maritime Realism:** 모든 해상 경로가 지리적 특성을 반영하여 바다 위로만 지나가도록 로직 고도화.
- **Multi-language Disclaimer:** 면책 조항(Disclaimer)을 선택된 언어(영어/한국어)에 맞게 동적으로 표시하도록 개선.

## **Current Task: Multi-language Disclaimer Support**
- **Objective:** 현재 영어와 한국어가 동시에 표시되는 면책 조항을 UI 언어 설정에 따라 해당 언어만 표시되도록 변경.
- **Steps:**
    1. `index.html`의 면책 조항 영역에 `data-i18n` 속성 적용 및 구조 정리.
    2. `main.js`의 `translations` 객체에 상세 면책 조항 텍스트 추가.
    3. 언어 전환 시 면책 조항도 함께 업데이트되도록 보장.
