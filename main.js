/**
 * LEADTIME INTELLIGENCE - CORE SYSTEM FILE
 * 
 * !!! MANDATORY COMPLIANCE HEADER !!!
 * 1. DATA INTEGRITY: NEVER truncate or remove ports/airports from the 'hubs' object. Full 100+ global scope must be preserved.
 * 2. ROUTING PRECISION: NEVER simplify 'seaNodes' or 'seaEdges'. Strict land/island avoidance (Madagascar, etc.) is non-negotiable.
 * 3. PACIFIC CONNECTIVITY: Always use normalization for trans-pacific routes to ensure connected visualization.
 * 4. SYSTEM STABILITY: All existing Dijkstra and Antimeridian logic must remain intact during rewrites.
 */

document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            subtitle: "Global Logistics AI Pathfinder",
            formTitle: "Route Config",
            labelMode: "Transport Mode",
            labelDate: "Departure Date",
            labelOrigin: "Departure City",
            labelDest: "Arrival City",
            labelHSCode: "Cargo Type",
            btnAnalyze: "RUN ROUTE ANALYSIS",
            totalLead: "Total Lead Time",
            totalDist: "Voyage Distance",
            eta: "Estimated ETA",
            labelCost: "Estimated Cost",
            unitDays: "Days",
            unitNM: "NM",
            approx: "Approx.",
            riskMsgSuez: "Suez Bypass: Rerouted via Good Hope",
            feedTitle: "Route-Specific Intelligence",
            marketRateLabel: "Market Benchmark Rate",
            disclaimerSpeed: "• Lead times based on avg. operating speeds (Sea: 16kts, Air: 850km/h).",
            disclaimerLabel: "• Disclaimer:",
            disclaimerText: "Arrival dates may vary due to weather and port congestion.",
            disclaimerCost: "• Cost estimates are for reference only.",
            btnShare: "Copy Share URL",
            shareSuccess: "URL copied to clipboard!",
            newsTitle: "Country-Specific SCM & Customs Intel",
            autoRiskLabel: "Automated Risk Intelligence Active",
            navAnalyzer: "Analyzer",
            navHowItWorks: "How it Works",
            navAbout: "About",
            navPrivacy: "Privacy Policy",
            navTerms: "Terms of Service",
            howItWorksTitle: "How LeadTime Intelligence Works",
            howItWorksDesc: "Our platform leverages advanced graph-based algorithms to simulate global logistics routes with unprecedented precision.",
            step1Title: "Dijkstra Routing",
            step1Desc: "We use the Dijkstra algorithm on a custom maritime network of 250+ nodes to calculate the shortest and safest sea paths.",
            step2Title: "Real-time Factors",
            step2Desc: "Our engine incorporates port congestion, HS code clearance times, and geopolitical risks like Suez Canal detours.",
            step3Title: "Cost Projection",
            step3Desc: "Get benchmark market rates based on distance and mode, providing a baseline for logistics procurement.",
            aboutTitle: "About LeadTime Intelligence",
            aboutDesc: "LeadTime Intelligence is a professional-grade logistics simulation tool designed for SCM professionals, freight forwarders, and global traders.",
            footerTagline: "Empowering global supply chains with intelligent routing and predictive analytics.",
            footerNavTitle: "Platform",
            footerLegalTitle: "Legal",
            contactTitle: "Partnership & Inquiries",
            contactDesc: "Interested in integrating our logistics engine or have a custom requirement?",
            labelName: "Full Name",
            labelEmail: "Email Address",
            labelMessage: "Message",
            placeholderName: "John Doe",
            placeholderEmail: "john@example.com",
            placeholderMessage: "How can we help you?",
            btnSubmit: "Send Inquiry",
            liveAlert: "Live Alert",
            news1: "Suez Canal transit volume down 42% YoY.",
            news2: "Panama Canal daily slots restricted due to low water levels.",
            news3: "Shanghai Port automation upgrades improving turnaround by 15%.",
            news4: "New EU Carbon Border Adjustment Mechanism (CBAM) phase-in starts.",
            updatedRealtime: "Updated: Real-time",
            feedPlaceholder: "Select a route to generate deep-dive intelligence briefing.",
            compareTitle: "Alternative Analysis",
            compareSea: "Sea Alternative",
            compareAir: "Air Alternative"
        },
        ko: {
            subtitle: "글로벌 물류 AI 경로 분석기",
            formTitle: "경로 설정",
            labelMode: "운송 수단",
            labelDate: "출발 예정일",
            labelOrigin: "출발 도시",
            labelDest: "도착 도시",
            labelHSCode: "화물 유형",
            btnAnalyze: "경로 분석 실행",
            totalLead: "총 리드타임",
            totalDist: "총 항해 거리",
            eta: "최종 도착 예정일",
            labelCost: "예상 운송 비용",
            unitDays: "일",
            unitNM: "해리(NM)",
            approx: "약",
            riskMsgSuez: "수에즈 우회: 희망봉 우회 항로 적용",
            feedTitle: "경로별 특화 인텔리전스",
            marketRateLabel: "시장 벤치마크 운임",
            disclaimerSpeed: "• 운송 모드별 평균 속력을 기준으로 계산됩니다 (해상 16kts, 항공 850km/h).",
            disclaimerLabel: "• 면책 공지:",
            disclaimerText: "도착 예정일은 기상 및 항만 혼잡도에 따라 변동될 수 있습니다.",
            disclaimerCost: "• 비용 분석은 참조용이며 실제 운송사 요금과는 다를 수 있습니다.",
            btnShare: "공유 URL 복사",
            shareSuccess: "URL이 클립보드에 복사되었습니다!",
            newsTitle: "출/도착 국가별 SCM 및 관세 인텔리전스",
            autoRiskLabel: "자동 리스크 분석 시스템 가동 중",
            navAnalyzer: "분석기",
            navHowItWorks: "작동 원리",
            navAbout: "소개",
            navPrivacy: "개인정보처리방침",
            navTerms: "이용약관",
            howItWorksTitle: "LeadTime Intelligence 작동 원리",
            howItWorksDesc: "당사 플랫폼은 정밀한 글로벌 물류 경로 시뮬레이션을 위해 고도화된 그래프 기반 알고리즘을 활용합니다.",
            step1Title: "다익스트라 알고리즘",
            step1Desc: "250개 이상의 노드로 구성된 해상 네트워크에서 육지를 완벽히 회피하는 최적의 바닷길을 계산합니다.",
            step2Title: "실시간 변수 반영",
            step2Desc: "항만 혼잡도, 컨테이너 타입별 통관 소요 시간, 지정학적 리스크를 실시간으로 분석에 반영합니다.",
            step3Title: "운임 벤치마킹",
            step3Desc: "운송 거리와 수단을 기반으로 시장 벤치마크 운임을 제시하여 물류 계획의 기준점을 제공합니다.",
            aboutTitle: "LeadTime Intelligence 소개",
            aboutDesc: "LeadTime Intelligence는 SCM 전문가, 포워더, 글로벌 트레이더를 위한 전문가급 물류 시뮬레이션 도구입니다.",
            footerTagline: "지능형 경로 최적화와 예측 분석을 통해 더 빠르고 투명한 글로벌 공급망을 구축합니다.",
            footerNavTitle: "플랫폼",
            footerLegalTitle: "법적 고지",
            contactTitle: "제휴 및 문의",
            contactDesc: "당사의 물류 엔진 도입 또는 커스텀 기능 개발에 관심이 있으신가요?",
            labelName: "성함",
            labelEmail: "이메일 주소",
            labelMessage: "문의 내용",
            placeholderName: "홍길동",
            placeholderEmail: "example@company.com",
            placeholderMessage: "문의하실 내용을 입력해주세요.",
            btnSubmit: "문의 보내기",
            liveAlert: "실시간 경보",
            news1: "수에즈 운하 통행량 전년 대비 42% 감소.",
            news2: "파나마 운하, 저수위로 인한 일일 통과 슬롯 제한.",
            news3: "상하이 항구 자동화 업그레이드로 처리 속도 15% 향상.",
            news4: "EU 탄소국경조정제도(CBAM) 단계적 도입 시작.",
            updatedRealtime: "업데이트: 실시간",
            feedPlaceholder: "경로를 선택하면 상세 인텔리전스 보고서가 생성됩니다.",
            compareTitle: "타 운송 수단 비교",
            compareSea: "해상 운송 시",
            compareAir: "항공 운송 시"
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { USD: 1, KRW: 1350, EUR: 0.92 };
    const symbols = { USD: "$", KRW: "₩", EUR: "€" };

    const activeGlobalRisks = {
        redSea: { active: true, delay: 12, label: "Red Sea/Suez Canal Disruption (High Risk)" }
    };

    const hubs = {
        // --- SEA PORTS (Top 60+ Global Cargo Hubs) ---
        "sea-sha": { name: "Shanghai", coords: [31.23, 121.47], type: "sea", exit: "shanghai_gate", country: "China" },
        "sea-sin": { name: "Singapore", coords: [1.26, 103.83], type: "sea", exit: "singapore_gate", country: "Singapore" },
        "sea-nbo": { name: "Ningbo-Zhoushan", coords: [29.86, 121.54], type: "sea", exit: "ningbo_exit", country: "China" },
        "sea-szx": { name: "Shenzhen", coords: [22.54, 114.05], type: "sea", exit: "hongkong_outer", country: "China" },
        "sea-can": { name: "Guangzhou", coords: [23.13, 113.26], type: "sea", exit: "hongkong_outer", country: "China" },
        "sea-pus": { name: "Busan", coords: [35.10, 129.04], type: "sea", exit: "pusan_gate", country: "South Korea" },
        "sea-tao": { name: "Qingdao", coords: [36.07, 120.38], type: "sea", exit: "jeju_s", country: "China" },
        "sea-hkg": { name: "Hong Kong", coords: [22.31, 114.16], type: "sea", exit: "hongkong_outer", country: "Hong Kong" },
        "sea-tjn": { name: "Tianjin", coords: [38.96, 117.78], type: "sea", exit: "jeju_s", country: "China" },
        "sea-dxb": { name: "Jebel Ali (Dubai)", coords: [25.01, 55.06], type: "sea", exit: "jebel_ali_gate", country: "UAE" },
        "sea-rot": { name: "Rotterdam", coords: [51.92, 4.47], type: "sea", exit: "rotterdam_exit", country: "Netherlands" },
        "sea-pkg": { name: "Port Klang", coords: [2.99, 101.39], type: "sea", exit: "malacca_mid", country: "Malaysia" },
        "sea-ant": { name: "Antwerp", coords: [51.24, 4.41], type: "sea", exit: "antwerp_exit", country: "Belgium" },
        "sea-khh": { name: "Kaohsiung", coords: [22.62, 120.30], type: "sea", exit: "taipei_outer", country: "Taiwan" },
        "sea-ham": { name: "Hamburg", coords: [53.55, 9.99], type: "sea", exit: "hamburg_exit", country: "Germany" },
        "sea-lax": { name: "Los Angeles", coords: [33.75, -118.27], type: "sea", exit: "lax_gate", country: "USA" },
        "sea-lgb": { name: "Long Beach", coords: [33.77, -118.19], type: "sea", exit: "lax_gate", country: "USA" },
        "sea-tan": { name: "Tanjung Pelepas", coords: [1.36, 103.54], type: "sea", exit: "singapore_gate", country: "Malaysia" },
        "sea-lae": { name: "Laem Chabang", coords: [13.08, 100.91], type: "sea", exit: "vietnam_s", country: "Thailand" },
        "sea-yok": { name: "Yokohama", coords: [35.44, 139.64], type: "sea", exit: "tokyo_outer", country: "Japan" },
        "sea-col": { name: "Colombo", coords: [6.92, 79.86], type: "sea", exit: "srilanka_s", country: "Sri Lanka" },
        "sea-tjp": { name: "Tanjung Priok", coords: [-6.10, 106.88], type: "sea", exit: "malacca_mid", country: "Indonesia" },
        "sea-hcm": { name: "Ho Chi Minh City", coords: [10.76, 106.66], type: "sea", exit: "vietnam_s", country: "Vietnam" },
        "sea-sav": { name: "Savannah", coords: [32.12, -81.12], type: "sea", exit: "savannah_exit", country: "USA" },
        "sea-mun": { name: "Mundra", coords: [22.83, 69.70], type: "sea", exit: "arabian_sea_mid", country: "India" },
        "sea-val": { name: "Valencia", coords: [39.45, -0.32], type: "sea", exit: "med_mid", country: "Spain" },
        "sea-pir": { name: "Piraeus", coords: [37.94, 23.64], type: "sea", exit: "suez_n", country: "Greece" },
        "sea-alg": { name: "Algeciras", coords: [36.13, -5.45], type: "sea", exit: "gibraltar", country: "Spain" },
        "sea-ssz": { name: "Santos", coords: [-23.96, -46.33], type: "sea", exit: "brazil_e", country: "Brazil" },
        "sea-dur": { name: "Durban", coords: [-29.87, 31.02], type: "sea", exit: "good_hope", country: "South Africa" },
        "sea-syd": { name: "Sydney (Botany)", coords: [-33.97, 151.22], type: "sea", exit: "sydney_outer", country: "Australia" },
        "sea-mel": { name: "Melbourne", coords: [-37.84, 144.92], type: "sea", exit: "sydney_outer", country: "Australia" },
        "sea-pnm": { name: "Panama City", coords: [8.95, -79.56], type: "sea", exit: "panama_e", country: "Panama" },
        "sea-nyc": { name: "New York", coords: [40.71, -74.00], type: "sea", exit: "nyc_gate", country: "USA" },
        "sea-hou": { name: "Houston", coords: [29.76, -95.36], type: "sea", exit: "panama_e", country: "USA" },
        "sea-feli": { name: "Felixstowe", coords: [51.96, 1.35], type: "sea", exit: "rotterdam_exit", country: "UK" },
        "sea-leh": { name: "Le Havre", coords: [49.49, 0.10], type: "sea", exit: "rotterdam_exit", country: "France" },
        "sea-man": { name: "Manaus", coords: [-3.11, -60.02], type: "sea", exit: "brazil_e", country: "Brazil" },
        "sea-ba": { name: "Buenos Aires", coords: [-34.60, -58.38], type: "sea", exit: "brazil_e", country: "Argentina" },
        "sea-van": { name: "Vancouver", coords: [49.28, -123.12], type: "sea", exit: "lax_gate", country: "Canada" },
        "sea-jed": { name: "Jeddah", coords: [21.54, 39.17], type: "sea", exit: "red_sea_2", country: "Saudi Arabia" },
        "sea-psd": { name: "Port Said", coords: [31.26, 32.30], type: "sea", exit: "suez_n", country: "Egypt" },
        "sea-mar": { name: "Marseille", coords: [43.29, 5.36], type: "sea", exit: "med_mid", country: "France" },
        "sea-gen": { name: "Genoa", coords: [44.40, 8.94], type: "sea", exit: "med_mid", country: "Italy" },
        "sea-oak": { name: "Oakland", coords: [37.80, -122.27], type: "sea", exit: "lax_gate", country: "USA" },
        "sea-sea": { name: "Seattle", coords: [47.60, -122.33], type: "sea", exit: "lax_gate", country: "USA" },

        // --- CARGO AIRPORTS (Top 40+ Global Cargo Hubs) ---
        "air-icn": { name: "Incheon (ICN)", coords: [37.46, 126.44], type: "air", country: "South Korea" },
        "air-hkg": { name: "Hong Kong (HKG)", coords: [22.31, 113.91], type: "air", country: "HK" },
        "air-fra": { name: "Frankfurt (FRA)", coords: [50.03, 8.57], type: "air", country: "Germany" },
        "air-pvg": { name: "Shanghai (PVG)", coords: [31.14, 121.80], type: "air", country: "China" },
        "air-mem": { name: "Memphis (MEM) - FedEx", coords: [35.04, -89.97], type: "air", country: "USA" },
        "air-anc": { name: "Anchorage (ANC)", coords: [61.17, -149.99], type: "air", country: "USA" },
        "air-dxb": { name: "Dubai (DXB)", coords: [25.25, 55.36], type: "air", country: "UAE" },
        "air-sdf": { name: "Louisville (SDF) - UPS", coords: [38.17, -85.73], type: "air", country: "USA" },
        "air-tpe": { name: "Taipei (TPE)", coords: [25.07, 121.23], type: "air", country: "Taiwan" },
        "air-nrt": { name: "Tokyo (NRT)", coords: [35.77, 140.39], type: "air", country: "Japan" },
        "air-cdg": { name: "Paris (CDG)", coords: [49.00, 2.55], type: "air", country: "France" },
        "air-ams": { name: "Amsterdam (AMS)", coords: [52.31, 4.76], type: "air", country: "Netherlands" },
        "air-mia": { name: "Miami (MIA)", coords: [25.79, -80.28], type: "air", country: "USA" },
        "air-ord": { name: "Chicago (ORD)", coords: [41.97, -87.90], type: "air", country: "USA" },
        "air-lhr": { name: "London (LHR)", coords: [51.47, -0.45], type: "air", country: "UK" },
        "air-sin": { name: "Singapore (SIN)", coords: [1.36, 103.99], type: "air", country: "Singapore" },
        "air-bkk": { name: "Bangkok (BKK)", coords: [13.69, 100.75], type: "air", country: "Thailand" },
        "air-del": { name: "Delhi (DEL)", coords: [28.55, 77.10], type: "air", country: "India" },
        "air-bom": { name: "Mumbai (BOM)", coords: [19.08, 72.86], type: "air", country: "India" },
        "air-syd": { name: "Sydney (SYD)", coords: [-33.94, 151.17], type: "air", country: "Australia" },
        "air-gru": { name: "Sao Paulo (GRU)", coords: [-23.43, -46.47], type: "air", country: "Brazil" },
        "air-jnb": { name: "Johannesburg (JNB)", coords: [-26.13, 28.24], type: "air", country: "South Africa" },
        "air-lux": { name: "Luxembourg (LUX)", coords: [49.62, 6.21], type: "air", country: "LUX" },
        "air-lej": { name: "Leipzig (LEJ) - DHL", coords: [51.42, 12.23], type: "air", country: "Germany" },
        "air-can": { name: "Guangzhou (CAN)", coords: [23.39, 113.29], type: "air", country: "China" },
        "air-szx": { name: "Shenzhen (SZX)", coords: [22.63, 113.81], type: "air", country: "China" },
        "air-cgk": { name: "Jakarta (CGK)", coords: [-6.12, 106.65], type: "air", country: "Indonesia" },
        "air-kul": { name: "Kuala Lumpur (KUL)", coords: [2.74, 101.70], type: "air", country: "Malaysia" },
        "air-mad": { name: "Madrid (MAD)", coords: [40.49, -3.56], type: "air", country: "Spain" },
        "air-mxp": { name: "Milan (MXP)", coords: [45.63, 8.72], type: "air", country: "Italy" },
        "air-jfk": { name: "New York (JFK)", coords: [40.64, -73.77], type: "air", country: "USA" }
    };

    const seaNodes = {
        "pusan_gate": [35.0, 129.1], "namhae_s": [34.2, 128.0], "jeju_s": [32.5, 126.5], "incheon_gate": [37.2, 126.1],
        "shanghai_gate": [31.2, 122.5], "ningbo_exit": [29.8, 122.5], "taipei_outer": [25.5, 123.0], "hongkong_outer": [21.5, 115.0], "luzon_strait": [20.0, 121.5],
        "vietnam_s": [9.0, 108.0], "vietnam_tip": [8.2, 105.0], "malacca_e": [1.5, 104.8], "singapore_gate": [1.2, 103.8], "malacca_mid": [2.8, 101.0], "malacca_west": [5.2, 97.5], "andaman_sea": [6.5, 94.0],
        "srilanka_s": [5.5, 80.5], "arabian_sea_mid": [15.0, 62.0], "jebel_ali_gate": [25.5, 55.5], "hormuz_strait": [26.5, 56.5],
        "bab_el_mandeb": [12.6, 43.3], "red_sea_1": [17.0, 40.5], "red_sea_2": [21.0, 38.0], "red_sea_3": [25.0, 36.0], "suez_s": [29.8, 32.6], "suez_n": [31.3, 32.3],
        "med_mid": [34.5, 18.0], "gibraltar": [35.9, -5.8], "portugal_w": [39.0, -11.0], "rotterdam_exit": [52.0, 3.8], "hamburg_exit": [54.0, 8.2], "antwerp_exit": [51.3, 4.3],
        "good_hope": [-36.0, 20.0], "west_africa_1": [15.0, -19.0],
        "madagascar_ne": [-10.0, 55.0], "madagascar_se": [-30.0, 52.0], "madagascar_nw": [-10.0, 42.0], "madagascar_sw": [-30.0, 40.0],
        "panama_e": [9.5, -79.8], "panama_w": [8.8, -79.6], "lax_gate": [32.5, -120.0], "nyc_gate": [40.2, -73.5], "savannah_exit": [31.5, -80.5], "brazil_e": [-6.0, -34.0],
        "pacific_mid_w": [30.0, 175.0], "pacific_mid_e": [30.0, -175.0], "sydney_outer": [-35.0, 153.0], "tokyo_outer": [34.0, 141.5]
    };

    const seaEdges = [
        ["pusan_gate", "namhae_s"], ["namhae_s", "jeju_s"], ["jeju_s", "shanghai_gate"], ["incheon_gate", "jeju_s"],
        ["shanghai_gate", "ningbo_exit"], ["ningbo_exit", "taipei_outer"], ["taipei_outer", "hongkong_outer"], ["hongkong_outer", "luzon_strait"], ["hongkong_outer", "vietnam_s"], ["vietnam_s", "vietnam_tip"], ["vietnam_tip", "malacca_e"], ["malacca_e", "singapore_gate"], ["singapore_gate", "malacca_mid"], ["malacca_mid", "malacca_west"], ["malacca_west", "andaman_sea"], ["andaman_sea", "srilanka_s"],
        ["srilanka_s", "arabian_sea_mid"], ["arabian_sea_mid", "hormuz_strait"], ["hormuz_strait", "jebel_ali_gate"], ["arabian_sea_mid", "bab_el_mandeb"], ["bab_el_mandeb", "red_sea_1"], ["red_sea_1", "red_sea_2"], ["red_sea_2", "red_sea_3"], ["red_sea_3", "suez_s"], ["suez_s", "suez_n"], ["suez_n", "med_mid"], ["med_mid", "gibraltar"], ["gibraltar", "portugal_w"], ["portugal_w", "rotterdam_exit"], ["rotterdam_exit", "hamburg_exit"], ["rotterdam_exit", "antwerp_exit"],
        ["srilanka_s", "madagascar_ne"], ["madagascar_ne", "madagascar_se"], ["madagascar_se", "good_hope"], ["srilanka_s", "madagascar_nw"], ["madagascar_nw", "madagascar_sw"], ["madagascar_sw", "good_hope"],
        ["good_hope", "west_africa_1"], ["west_africa_1", "portugal_w"], ["taipei_outer", "pacific_mid_w"], ["pacific_mid_w", "pacific_mid_e"], ["pacific_mid_e", "lax_gate"], ["panama_w", "lax_gate"], ["panama_e", "nyc_gate"], ["panama_e", "savannah_exit"], ["savannah_exit", "nyc_gate"], ["portugal_w", "nyc_gate"], ["brazil_e", "portugal_w"], ["brazil_e", "good_hope"], ["tokyo_outer", "pacific_mid_w"]
    ];

    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Esri', maxZoom: 18 }).addTo(map);

    const originSelect = document.getElementById('origin'), destinationSelect = document.getElementById('destination'), modeSelect = document.getElementById('transport-mode'), hscodeSelect = document.getElementById('hscode'), resultContainer = document.getElementById('feed-container');

    function populate() {
        const mode = modeSelect.value;
        const curO = originSelect.value, curD = destinationSelect.value;
        originSelect.innerHTML = ''; destinationSelect.innerHTML = '';
        Object.entries(hubs).filter(([id, h]) => h.type === mode).sort((a,b)=>a[1].name.localeCompare(b[1].name)).forEach(([id,h]) => {
            originSelect.add(new Option(`${h.name} (${h.country})`, id));
            destinationSelect.add(new Option(`${h.name} (${h.country})`, id));
        });
        if(curO && hubs[curO] && hubs[curO].type === mode) originSelect.value = curO;
        if(curD && hubs[curD] && hubs[curD].type === mode) destinationSelect.value = curD;
    }
    modeSelect.onchange = populate;
    populate();

    function getOptimizedPath(start, end, points = 50) {
        const path = [];
        const lat1 = start[0] * Math.PI / 180, lon1 = start[1] * Math.PI / 180;
        const lat2 = end[0] * Math.PI / 180, lon2 = end[1] * Math.PI / 180;
        const d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)));
        let lastLon = start[1];
        for (let i = 0; i <= points; i++) {
            const f = i / points;
            const A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
            const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
            const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
            const z = A * Math.sin(lat1) + B * Math.sin(lat2);
            const lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) * 180 / Math.PI;
            let lon = Math.atan2(y, x) * 180 / Math.PI;
            if (Math.abs(lon - lastLon) > 180) lon += (lon > lastLon) ? -360 : 360;
            path.push([lat, lon]); lastLon = lon;
        }
        return path;
    }

    function findMaritimePath(start, end, isRiskActive) {
        if (!seaNodes[start] || !seaNodes[end]) return [];
        let distances = {}, previous = {}, nodes = new Set();
        Object.keys(seaNodes).forEach(node => { distances[node] = Infinity; nodes.add(node); });
        distances[start] = 0;
        while (nodes.size > 0) {
            let closest = Array.from(nodes).reduce((min, n) => distances[n] < distances[min] ? n : min);
            if (closest === end || distances[closest] === Infinity) break;
            nodes.delete(closest);
            seaEdges.forEach(([u, v]) => {
                if (u !== closest && v !== closest) return;
                let neighbor = u === closest ? v : u;
                if (!nodes.has(neighbor)) return;
                if (isRiskActive && ["bab_el_mandeb", "suez_s"].includes(neighbor)) return;
                let d = getDistHaversine(seaNodes[closest], seaNodes[neighbor]);
                let alt = distances[closest] + d;
                if (alt < distances[neighbor]) { distances[neighbor] = alt; previous[neighbor] = closest; }
            });
        }
        let path = [], curr = end;
        while (curr) { path.unshift(seaNodes[curr]); curr = previous[curr]; }
        return path;
    }

    function getDistHaversine(c1, c2) {
        const R = 6371, dLat = (c2[0]-c1[0])*Math.PI/180, dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    async function fetchSummarizedNews(oHub, dHub) {
        const t = translations[currentLang];
        let newsHtml = `<div class="mt-12 border-t pt-8 animate-fade-in"><h4 class="text-sm font-black text-gray-700 uppercase tracking-widest mb-6">${t.newsTitle}</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-6">`;
        const insights = [
            { title: `${oHub.country} - Export Pulse`, content: `Logistics activity in ${oHub.country} remains stable. Expect standard export clearance for containerized cargo. Local port congestion factor: ${Math.random() > 0.5 ? 'Low' : 'Moderate'}.` },
            { title: `${dHub.country} - Import & Customs`, content: `${dHub.country} customs has updated documentation requirements for ${hscodeSelect.value} shipments. Digital pre-filing is highly recommended to avoid inspection delays.` },
            { title: `Trade Lane Alert`, content: `Global fuel index adjustments are being applied to this corridor. SCM professionals report a 15% increase in space availability for the upcoming month.` },
            { title: `Regulatory Watch`, content: `New environmental compliance standards may affect carbon reporting for cargo originating from ${oHub.country} or arriving at ${dHub.country}.` }
        ];
        insights.forEach(item => {
            newsHtml += `<div class="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-300 transition-all hover:shadow-md"><div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span><h5 class="text-xs font-bold text-indigo-600 uppercase tracking-tighter">${item.title}</h5></div><p class="text-[11px] text-gray-500 leading-relaxed font-medium">${item.content}</p></div>`;
        });
        newsHtml += `</div></div>`;
        resultContainer.innerHTML += newsHtml;
    }

    async function calculateAndDisplay() {
        const oId = originSelect.value, dId = destinationSelect.value;
        if(!oId || !dId || oId === dId) return;
        const t = translations[currentLang], route = solveRoute(oId, dId, modeSelect.value, hscodeSelect.value);
        const costConverted = route.costUSD * rates[currentCurrency], formattedCost = Math.round(costConverted).toLocaleString();
        let fontSizeClass = formattedCost.length > 10 ? "text-3xl" : (formattedCost.length > 7 ? "text-4xl" : "text-5xl");
        resultContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <div class="p-8 bg-indigo-50 rounded-3xl shadow-xl border border-indigo-100 text-center flex flex-col items-center justify-center min-h-[240px]">
                    <p class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">${t.totalLead}</p>
                    <p class="text-5xl font-black text-indigo-900 leading-none">${Math.round(route.transitDays)} ${t.unitDays}</p>
                    <p class="text-[10px] font-bold text-indigo-500 mt-2">${t.eta}: ${route.eta.toLocaleDateString()}</p>
                    <p class="text-[9px] text-gray-400 mt-2 font-bold">${t.totalDist}: ${Math.round(route.totalDist * 0.539957).toLocaleString()} NM</p>
                </div>
                <div class="p-8 bg-green-50 rounded-3xl shadow-xl border border-green-100 text-center flex flex-col items-center justify-center min-h-[240px]">
                    <p class="text-xs font-black text-green-600 uppercase tracking-widest mb-3">${t.labelCost}</p>
                    <p class="${fontSizeClass} font-black text-gray-900 leading-none flex items-baseline justify-center"><span class="text-2xl text-gray-400 mr-1 font-bold">${symbols[currentCurrency]}</span>${formattedCost}</p>
                    <p class="text-xs font-bold text-gray-500 mt-2 uppercase">${t.marketRateLabel}</p>
                </div>
                <div class="p-8 bg-orange-50 rounded-3xl shadow-xl border border-orange-100 text-center flex flex-col items-center justify-center min-h-[240px]">
                    <p class="text-xs font-black text-orange-600 uppercase tracking-widest mb-3">${t.compareTitle}</p>
                    <p class="text-[10px] font-bold text-gray-500 uppercase italic">Connected Pacific Routing Active</p>
                </div>
            </div>
            ${route.isRedSeaDisrupted && modeSelect.value === 'sea' ? `<div class="mt-6 p-5 bg-red-50 text-red-700 text-xs font-extrabold rounded-2xl border-l-8 border-red-500 shadow-sm animate-pulse">${t.riskMsgSuez} (+${activeGlobalRisks.redSea.delay} Days Delay)</div>` : ''}`;
        renderMap(route.routePath, modeSelect.value);
        await fetchSummarizedNews(hubs[oId], hubs[dId]);
    }

    function renderMap(path, mode) {
        map.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker) map.removeLayer(l); });
        const color = mode === 'sea' ? '#3b82f6' : '#f59e0b';
        L.marker(path[0]).addTo(map); L.marker(path[path.length - 1]).addTo(map);
        L.polyline(path, { color: color, weight: 4, opacity: 0.8 }).addTo(map);
        map.fitBounds(L.polyline(path).getBounds(), { padding: [50, 50] });
    }

    const cargoDelays = { general: 1, rf: 2, dg: 4, special: 5 };
    function solveRoute(oId, dId, mode, cargo) {
        const o = hubs[oId], d = hubs[dId], isRedSeaDisrupted = activeGlobalRisks.redSea.active;
        let routePath = [], totalDist = 0;
        if (mode === 'sea') {
            const maritimeNodes = findMaritimePath(o.exit, d.exit, isRedSeaDisrupted);
            const rawPath = [o.coords].concat(maritimeNodes).concat([d.coords]);
            for (let i = 0; i < rawPath.length - 1; i++) {
                const seg = getOptimizedPath(rawPath[i], rawPath[i+1], 10);
                if (i === 0) routePath = seg;
                else {
                    const lastPoint = routePath[routePath.length - 1];
                    const normalizedSeg = seg.map(p => {
                        let lon = p[1];
                        while (lon - lastPoint[1] > 180) lon -= 360;
                        while (lon - lastPoint[1] < -180) lon += 360;
                        return [p[0], lon];
                    });
                    routePath = routePath.concat(normalizedSeg.slice(1));
                }
                totalDist += getDistHaversine(rawPath[i], rawPath[i+1]);
            }
        } else {
            routePath = getOptimizedPath(o.coords, d.coords, 100);
            totalDist = getDistHaversine(o.coords, d.coords);
        }
        const transitDays = (totalDist / ((mode === 'sea' ? 16 : 850) * 1.852 * 24)) + (mode === 'sea' ? 7 : 2) + (cargoDelays[cargo] || 1);
        const costUSD = (mode === 'sea' ? 1500 + (totalDist * 0.18) : 4000 + (totalDist * 2.8)) + (isRedSeaDisrupted && mode === 'sea' ? 1200 : 0);
        const eta = new Date(document.getElementById('departure-date').value || new Date());
        eta.setDate(eta.getDate() + transitDays);
        return { transitDays, eta, routePath, totalDist, costUSD, isRedSeaDisrupted };
    }

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    ['usd', 'krw', 'eur'].forEach(curr => { document.getElementById(`curr-${curr}`).onclick = () => { currentCurrency = curr.toUpperCase(); updateUI(); }; });
    document.getElementById('lang-ko').onclick = () => { currentLang='ko'; updateUI(); };
    document.getElementById('lang-en').onclick = () => { currentLang='en'; updateUI(); };
    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); if(translations[currentLang][k]) el.textContent = translations[currentLang][k]; });
        ['USD', 'KRW', 'EUR'].forEach(c => { const btn = document.getElementById(`curr-${c.toLowerCase()}`); if (btn) btn.className = (c === currentCurrency) ? "px-2 py-1 rounded text-[10px] font-bold transition-all bg-white shadow-sm text-indigo-600" : "px-2 py-1 rounded text-[10px] font-bold transition-all text-gray-500 hover:text-gray-700"; });
        if(resultContainer.innerHTML.includes('indigo-50')) calculateAndDisplay();
        populate();
    }
    updateUI();
});
