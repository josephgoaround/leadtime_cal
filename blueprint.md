# **LeadTime Intelligence: Global Logistics AI Pathfinder**

## **Project Overview**
엔터프라이즈급 글로벌 물류 리드타임 시뮬레이터 및 의사결정 지원 플랫폼. 단순 리드타임 계산을 넘어 지정학적 리스크, 금융 비용(ICC), ESG 영향, 그리고 국가별 통관 규제를 통합 분석합니다.

## **Core Features** (Implemented)

### **1. Multimodal Logistics Engine**
- **Mode Simulation:** Sea (16kts), Air (Cargo Jet), Inland (Truck vs Rail) 간의 속도/비용 트레이드오프 분석.
- **Chargeable Weight:** 항공(1:6) 및 해상(1:1)의 유상 중량 산출 로직 적용.
- **Service Tiers:** Premium(우선 처리) vs Standard 서비스 등급 시뮬레이션.
- **Carrier Intelligence:** Maersk, MSC, FedEx 등 선사/항공사별 정시 신뢰도 및 운임 프리미엄 반영.

### **2. Strategic Risk & Network Intelligence**
- **Dynamic Routing:** 홍해(Red Sea), 파나마 운하(Panama Canal) 등 주요 리스크 구역 자동 감지 및 우회(희망봉 등) 로직.
- **Visual Risk Zones:** 지도상에 반투명한 위험 구역 시각화.
- **Transshipment Logic:** 아시아-유럽 노선 등 장거리 이동 시 싱가포르 등 주요 허브의 환적 지연(+3일) 자동 반영.
- **Port Congestion Index:** 주요 항구별 실시간 혼잡도(상하이, LA 등)에 따른 핸들링 지연 시뮬레이션.

### **3. Advanced Financial & ESG Analytics**
- **Total Landed Cost:** 운임, 관세(품목별), 재고 유지 비용(ICC, 연 15%)을 합산한 총 수입 원가 산출.
- **Mode Efficiency Chart:** 현재 선택 모드와 대안 모드(Sea vs Air)의 비용/시간 효율성 비교 차트 제공.
- **ESG Breakdown:** 주 운송과 내륙 구간의 탄소 배출량을 분리 분석하고, 탄소세(Carbon Tax) 및 소나무 식재 상쇄 비용 환산.

### **4. Operational Readiness & Reporting**
- **Interactive Timeline:** 마일스톤별 정확한 통과 날짜와 단계별 운영 가이드(툴팁) 제공.
- **Customs Checklist:** 도착 국가별 필수 서류(KC, CCC, ISF 등) 및 품목별 규제 준수 체크리스트.
- **Executive Summary:** 경영진 보고용 전문 텍스트 리포트 원클릭 복사 기능.
- **Data Export:** 분석 결과를 CSV 파일로 내보내기.

## **Technical Stack**
- **Frontend:** Vanilla JavaScript (ES6+), Tailwind CSS 2.2.19.
- **Mapping:** Leaflet.js 1.7.1 (Flow Animation & Circle Markers).
- **Persistence:** URL State Sync & LocalStorage History.

## **Upcoming Enhancements**
- **Insurance & VAT Integration:** 적하보험료 및 국가별 부가세 정밀 산정.
- **Weather Overlays:** 태풍/폭설 등 기상 레이어 지도 시각화.
- **Carrier Reliability Feed:** 선사별 실제 정시 도착 통계 기반의 실시간 점수 연동.
