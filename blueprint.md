# **LeadTime Intelligence: Global Container Logistics AI Pathfinder**

## **Project Overview**
엔터프라이즈급 글로벌 컨테이너 물류 리드타임 시뮬레이터 및 경로 시각화 플랫폼. 항해사의 전문적 조언을 반영하여 정형화된 전 세계 컨테이너 정기선(Liner Shipping) 항로 패턴을 분석하며, 허브 항구 간의 '해상 고속도로'를 정밀하게 재현합니다.

## **Core Features**

### **1. Advanced Logistics Analysis Engine**
- **Dynamic Bottleneck Algorithm:** Dijkstra 알고리즘에 실시간 리스크(Active Risks) 가중치를 부여하여 병목 구간 자동 우회 및 지연 시간 산출.
- **Inland Transport Simulation:** 항만/공항에서 최종 목적지까지의 내륙 운송(First/Last Mile) 시간 및 비용 시뮬레이션 통합.
- **Granular Cargo Delays:** HS 코드 및 화물 특성(Reefer, DG, Pharma 등)에 따른 세분화된 통관/검역 지연 시간 반영.

### **2. 3D Load Planner (Professional Edition)**
- **Weight Distribution Optimization:** 화물 중량(Weight) 데이터를 기반으로 하중 분산을 고려한 적재 순서 최적화 (중량물 하단 배치).
- **Cargo Grouping (Mixing Restrictions):** 화물 그룹(Group) 지정을 통해 혼적 금지 제약 조건을 시뮬레이션에 반영.
- **Interactive HUD:** 적재 효율, 중량 밸런스 및 미적재 항목 수를 실시간으로 모니터링.

### **3. UI/UX & Map Intelligence**
- **Map Risk Visualization:** 홍해, 파나마 등 주요 지연 발생 구역을 지도상에 Red-Zone으로 시각화하고 팝업 정보를 통해 원인 뉴스 연동.
- **Smart Port Search:** UN/LOCODE 및 국가 기반의 실시간 자동완성(Autocomplete) 필터링 시스템 도입.
- **Multi-modal Comparison:** 해상과 항공 운송 간의 리드타임 및 비용 차이를 대조 분석하는 컴페어러 기능 고도화.

### **4. System Infrastructure**
- **Automated Data Pipeline:** GitHub Actions를 활용한 2시간 단위의 전 세계 물류 뉴스 및 리스크 데이터 동기화 (`sync_data.py`).
- **Firebase MCP Integration:** 서버리스 인프라 확장을 위한 Firebase 도구 연동 설정 완료.

## **Latest Updates**
- **Bottleneck & Weights:** 리스크 데이터 기반의 동적 가중치 알고리즘 구현.
- **3D Refinement:** 중량 기반 적재 및 그룹 제약 로직 추가.
- **Search UI:** 출발/도착항 검색 필터링 기능 `index.html` 및 `main.js` 반영.
- **Risk Markers:** 지도 레이어 상에 리스크 마커 시각화 기능 추가.

## **Current Implementation Plan**
1. **Intelligence Expansion:** 외부 물류 API 연동을 통한 실시간 선사 스케줄링 반영 준비.
2. **Account Integration:** 사용자별 경로 히스토리 및 선적 템플릿 저장을 위한 Firebase Auth 연동.
