# **LeadTime Intelligence: Global Container Logistics AI Pathfinder**

## **Project Overview**
엔터프라이즈급 글로벌 컨테이너 물류 리드타임 시뮬레이터 및 경로 시각화 플랫폼. 항해사의 전문적 조언을 반영하여 정형화된 전 세계 컨테이너 정기선(Liner Shipping) 항로 패턴을 분석하며, 허브 항구 간의 '해상 고속도로'를 정밀하게 재현합니다.

## **Core Features**

### **1. Container Liner Logistics Engine**
- **Mode Simulation:** Container Shipping (17kts avg), Air Cargo (850km/h) 간의 정밀 비교.
- **Fixed Oceanic Arteries:** 300개 이상의 노드와 실제 정기선 경로를 결합한 '글로벌 컨테이너 백본' 구축.
- **Advanced Cost Analysis:** 노선별 TEU/FEU 벤치마크 운임과 리스크 할증료를 반영한 비용 산출.

### **2. 3D Load Planner (FCL/LCL Simulation)**
- **Interactive 3D Visualization:** Three.js 기반의 20ft/40ft/40HC 컨테이너 적재 시뮬레이션.
- **Advanced Bin Packing Algorithm:** 2D 회전, 동적 공간 분할(Guillotine split) 및 휴리스틱 최적화 알고리즘 적용.
- **Stackability Control:** 화물별 2단 적재(Stackable) 옵션 제공 및 적재 시뮬레이션 반영.
- **Real-time Efficiency HUD:** 적재율(Volume Efficiency) 및 적재 아이템 수를 실시간으로 계산하여 반영.

### **3. Logistics Daily Feed (News Board)**
- **Cumulative News Feed:** 전 세계 물류 뉴스 및 항만 상태를 일자별 타임라인 형태로 누적 관리.
- **Dynamic Category Filtering:** 선사 동향(Liner), 항만 상태(Port), 물류 기술(Tech) 등 카테고리별 필터링 제공.
- **Automated Data Sync:** `news.json` 기반의 데이터 구조로 실시간 뉴스 업데이트 및 누적 저장 기능 구현.

### **4. UI/UX & Intelligence**
- **Liner-Specific Intel:** 항만 선석 대기 및 컨테이너 터미널 상황을 반영한 동적 정보 생성.
- **Multi-language Support:** UI 및 분석 리포트의 실시간 한/영 전환.

## **Latest Updates & Fixes**
- **Logistics News Feed Implementation:** 블로그 형태의 타임라인 뉴스 게시판(`news.html`) 신규 개발.
- **Packing Optimization:** 3D Load Planner의 적재 알고리즘 고도화 및 2단 적재 옵션 추가.
- **Volume Efficiency Reflection Fix:** 3D Load Planner에서 적재 효율이 HUD에 실시간으로 반영되지 않던 버그 수정.

## **Current Implementation Plan**
1. **News Architecture:** `data/news.json`을 통한 데이터 관리 및 `news.js`를 이용한 동적 렌더링.
2. **Navigation Sync:** 모든 메인 페이지 헤더에 'Logistics News' 메뉴 통합.
3. **Data Accumulation:** 새로운 뉴스가 추가될 때마다 JSON 데이터에 누적하여 관리.
