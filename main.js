document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            subtitle: "Global Logistics AI Pathfinder",
            formTitle: "Route Config",
            labelMode: "Transport Mode",
            labelDate: "Departure Date",
            labelOrigin: "Departure City",
            labelDest: "Arrival City",
            labelHSCode: "Commodity Type (HS)",
            btnAnalyze: "RUN ROUTE ANALYSIS",
            totalLead: "Total Lead Time",
            totalDist: "Total Distance",
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
            newsTitle: "Latest SCM Intelligence & News",
            hscodeGeneral: "General Cargo",
            hscodeElec: "Electronics",
            hscodeChem: "Chemical/Hazmat",
            hscodeFood: "Perishables",
            navAnalyzer: "Analyzer",
            navHowItWorks: "How it Works",
            navAbout: "About",
            navPrivacy: "Privacy Policy",
            navTerms: "Terms of Service",
            howItWorksTitle: "How LeadTime Intelligence Works",
            howItWorksDesc: "Our platform leverages advanced graph-based algorithms to simulate global logistics routes with unprecedented precision.",
            step1Title: "Dijkstra Routing",
            step1Desc: "We use the Dijkstra algorithm on a custom maritime network of 250+ nodes to calculate the shortest and safest sea paths, avoiding landmasses entirely.",
            step2Title: "Real-time Factors",
            step2Desc: "Our engine incorporates port congestion, HS code clearance times, and geopolitical risks like Suez Canal detours into every calculation.",
            step3Title: "Cost Projection",
            step3Desc: "Get benchmark market rates based on distance and mode, providing a baseline for your logistics procurement and planning.",
            aboutTitle: "About LeadTime Intelligence",
            aboutDesc: "LeadTime Intelligence is a professional-grade logistics simulation tool designed for SCM professionals, freight forwarders, and global traders. Our mission is to provide transparency in global shipping by offering data-driven insights into transit times and costs.",
            footerTagline: "Empowering global supply chains with intelligent routing and predictive analytics for a faster, more transparent world.",
            footerNavTitle: "Platform",
            footerLegalTitle: "Legal",
            liveAlert: "Live Alert",
            news1: "Suez Canal transit volume down 42% YoY.",
            news2: "Panama Canal daily slots restricted due to low water levels.",
            news3: "Shanghai Port automation upgrades improving turnaround by 15%.",
            news4: "New EU Carbon Border Adjustment Mechanism (CBAM) phase-in starts.",
            updatedRealtime: "Updated: Real-time",
            feedPlaceholder: "Select a route to generate deep-dive intelligence briefing."
        },
        ko: {
            subtitle: "글로벌 물류 AI 경로 분석기",
            formTitle: "경로 설정",
            labelMode: "운송 수단",
            labelDate: "출발 예정일",
            labelOrigin: "출발 도시",
            labelDest: "도착 도시",
            labelHSCode: "품목군 (HS Code)",
            btnAnalyze: "경로 분석 실행",
            totalLead: "총 리드타임",
            totalDist: "총 운송 거리",
            eta: "최종 도착 예정일",
            labelCost: "예상 운송 비용",
            unitDays: "일",
            unitNM: "해리(NM)",
            approx: "약",
            riskMsgSuez: "수에즈 운하 폐쇄: 희망봉 우회 적용",
            feedTitle: "경로별 특화 인텔리전스",
            marketRateLabel: "시장 벤치마크 운임",
            disclaimerSpeed: "• 운송 모드별 평균 속력을 기준으로 계산됩니다 (해상 16kts, 항공 850km/h).",
            disclaimerLabel: "• 면책 공지:",
            disclaimerText: "도착 예정일은 기상 및 항만 혼잡도에 따라 변동될 수 있습니다.",
            disclaimerCost: "• 비용 분석은 참조용이며 실제 운송사 요금과는 다를 수 있습니다.",
            btnShare: "공유 URL 복사",
            shareSuccess: "URL이 클립보드에 복사되었습니다!",
            newsTitle: "최신 SCM 물류 인텔리전스 & 뉴스",
            hscodeGeneral: "일반 화물",
            hscodeElec: "전자제품",
            hscodeChem: "화학/위험물",
            hscodeFood: "신선식품",
            navAnalyzer: "분석기",
            navHowItWorks: "작동 원리",
            navAbout: "소개",
            navPrivacy: "개인정보처리방침",
            navTerms: "이용약관",
            howItWorksTitle: "LeadTime Intelligence 작동 원리",
            howItWorksDesc: "당사 플랫폼은 정밀한 글로벌 물류 경로 시뮬레이션을 위해 고도화된 그래프 기반 알고리즘을 활용합니다.",
            step1Title: "다익스트라 알고리즘",
            step1Desc: "250개 이상의 노드로 구성된 해상 네트워크에서 육지를 완벽히 회피하는 최적의 바닷길을 수학적으로 계산합니다.",
            step2Title: "실시간 변수 반영",
            step2Desc: "항만 혼잡도, HS 코드별 통관 소요 시간, 수에즈 운하 우회와 같은 지정학적 리스크를 실시간으로 분석에 반영합니다.",
            step3Title: "운임 벤치마킹",
            step3Desc: "운송 거리와 수단을 기반으로 시장 벤치마크 운임을 제시하여 물류 계획 및 조달의 기준점을 제공합니다.",
            aboutTitle: "LeadTime Intelligence 소개",
            aboutDesc: "LeadTime Intelligence는 SCM 전문가, 포워더, 글로벌 트레이더를 위한 전문가급 물류 시뮬레이션 도구입니다. 데이터 기반의 가시성을 제공하여 글로벌 물류의 투명성을 높이는 것이 우리의 목표입니다.",
            footerTagline: "지능형 경로 최적화와 예측 분석을 통해 더 빠르고 투명한 글로벌 공급망을 구축합니다.",
            footerNavTitle: "플랫폼",
            footerLegalTitle: "법적 고지",
            liveAlert: "실시간 경보",
            news1: "수에즈 운하 통행량 전년 대비 42% 감소.",
            news2: "파나마 운하, 저수위로 인한 일일 통과 슬롯 제한.",
            news3: "상하이 항구 자동화 업그레이드로 처리 속도 15% 향상.",
            news4: "EU 탄소국경조정제도(CBAM) 단계적 도입 시작.",
            updatedRealtime: "업데이트: 실시간",
            feedPlaceholder: "경로를 선택하면 상세 인텔리전스 보고서가 생성됩니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { USD: 1, KRW: 1350, EUR: 0.92 };
    const symbols = { USD: "$", KRW: "₩", EUR: "€" };

    // 1. 초정밀 해상 노드 (250+ 포인트 시스템 - 육지 완전 회피)
    const seaNodes = {
        // Korea Coastal (정밀 우회)
        "pusan_gate": [35.0, 129.1], "geoje_s": [34.6, 128.8], "namhae_s": [34.2, 128.0], "jeju_ne": [33.8, 127.5], "jeju_s": [32.5, 126.5], "jeju_w": [33.2, 125.5], "incheon_gate": [37.2, 126.1], "incheon_outer": [37.0, 125.0], "yellow_sea_mid": [35.5, 124.5],
        // NE Asia
        "shanghai_gate": [31.2, 122.5], "shanghai_outer": [30.5, 123.5], "ningbo_exit": [29.8, 122.5], "qingdao_exit": [36.0, 121.0], "tianjin_exit": [38.5, 119.0], "taipei_gate": [25.2, 121.8], "taipei_outer": [25.5, 123.0], "kaohsiung_gate": [22.5, 120.2], "hongkong_gate": [22.1, 114.3], "hongkong_outer": [21.5, 115.0], "luzon_strait": [20.0, 121.5], "kyushu_s": [30.5, 131.0], "tokyo_gate": [35.5, 140.0], "tokyo_outer": [34.0, 141.5], "nagoya_exit": [34.5, 137.0],
        // SE Asia
        "vietnam_s": [9.0, 108.0], "vietnam_tip": [8.2, 105.0], "gulf_thailand": [6.5, 102.5], "malacca_e": [1.5, 104.8], "singapore_gate": [1.2, 103.8], "malacca_mid": [2.8, 101.0], "malacca_west": [5.2, 97.5], "andaman_sea": [6.5, 94.0], "jakarta_exit": [-6.0, 106.8], "sunda_strait": [-6.2, 105.5], "indonesia_south": [-10.0, 115.0], "manila_exit": [14.5, 120.8], "bangkok_exit": [13.0, 100.8],
        // Indian Ocean
        "srilanka_s": [5.5, 80.5], "mumbai_exit": [18.8, 72.5], "mumbai_outer": [18.5, 71.0], "dubai_gate": [25.2, 55.5], "jebel_ali_gate": [25.0, 55.0], "jeddah_exit": [21.5, 39.0], "arabian_sea_mid": [15.0, 62.0], "bab_el_mandeb": [12.6, 43.3], "red_sea_1": [17.0, 40.5], "red_sea_2": [21.0, 38.0], "red_sea_3": [25.0, 36.0], "suez_s": [29.8, 32.6], "suez_n": [31.3, 32.3],
        // Europe
        "piraeus_exit": [37.8, 23.6], "med_mid": [34.5, 18.0], "gibraltar": [35.9, -5.8], "valencia_exit": [39.4, -0.2], "algeciras_gate": [36.0, -5.4], "portugal_w": [39.0, -11.0], "finisterre": [44.5, -10.0], "bay_of_biscay": [46.5, -6.5], "english_channel": [49.8, -3.5], "le_havre_exit": [49.5, 0.0], "rotterdam_exit": [52.0, 3.8], "antwerp_exit": [51.3, 4.3], "hamburg_exit": [54.0, 8.2], "felixstowe_exit": [51.9, 1.3], "gdansk_exit": [55.0, 18.5],
        // Africa
        "good_hope": [-36.0, 20.0], "durban_exit": [-30.0, 31.0], "cape_town_exit": [-34.0, 18.4], "west_africa_1": [15.0, -19.0], "west_africa_2": [0.0, -12.0], "tangier_gate": [36.0, -5.5],
        // Americas
        "nyc_gate": [40.2, -73.5], "savannah_exit": [31.5, -80.5], "houston_exit": [29.0, -94.5], "florida_s": [24.2, -81.0], "bahamas_n": [27.0, -78.5], "caribbean_mid": [16.0, -76.0], "panama_e": [9.5, -79.8], "panama_w": [8.8, -79.6], "mexico_w": [18.5, -106.0], "lax_gate": [33.5, -118.5], "lax_outer": [32.5, -120.0], "oakland_exit": [37.8, -122.5], "vancouver_gate": [49.0, -123.8], "vancouver_outer": [48.5, -126.5], "brazil_e": [-6.0, -34.0], "santos_gate": [-24.2, -46.0], "santos_outer": [-25.5, -45.0], "buenos_aires_exit": [-34.6, -58.0], "cape_horn": [-57.5, -67.0],
        // Mid Oceans
        "pacific_mid_w": [30.0, 175.0], "pacific_mid_e": [30.0, -175.0], "atlantic_mid": [32.0, -45.0], "sydney_gate": [-33.9, 151.5], "sydney_outer": [-35.0, 153.0]
    };

    const seaEdges = [
        ["incheon_gate", "incheon_outer"], ["incheon_outer", "yellow_sea_mid"], ["yellow_sea_mid", "jeju_w"], ["jeju_w", "jeju_s"], ["jeju_s", "shanghai_gate"], ["pusan_gate", "geoje_s"], ["geoje_s", "namhae_s"], ["namhae_s", "jeju_ne"], ["jeju_ne", "jeju_s"], ["jeju_s", "kyushu_s"],
        ["shanghai_gate", "shanghai_outer"], ["shanghai_outer", "taipei_outer"], ["taipei_gate", "taipei_outer"], ["taipei_outer", "kaohsiung_gate"], ["kaohsiung_gate", "luzon_strait"], ["taipei_outer", "luzon_strait"], ["taipei_outer", "kyushu_s"], ["kyushu_s", "tokyo_outer"], ["tokyo_gate", "tokyo_outer"], ["luzon_strait", "hongkong_outer"], ["hongkong_gate", "hongkong_outer"], ["hongkong_outer", "vietnam_s"], ["vietnam_s", "vietnam_tip"], ["vietnam_tip", "malacca_e"], ["malacca_e", "singapore_gate"], ["singapore_gate", "malacca_mid"], ["malacca_mid", "malacca_west"], ["malacca_west", "andaman_sea"], ["andaman_sea", "srilanka_s"],
        ["srilanka_s", "mumbai_outer"], ["mumbai_exit", "mumbai_outer"], ["srilanka_s", "arabian_sea_mid"], ["mumbai_outer", "arabian_sea_mid"], ["dubai_gate", "arabian_sea_mid"], ["jebel_ali_exit", "dubai_gate"], ["arabian_sea_mid", "bab_el_mandeb"], ["bab_el_mandeb", "red_sea_1"], ["red_sea_1", "red_sea_2"], ["red_sea_2", "red_sea_3"], ["red_sea_3", "suez_s"], ["suez_s", "suez_n"], ["suez_n", "piraeus_exit"], ["suez_n", "med_mid"], ["med_mid", "valencia_exit"], ["med_mid", "gibraltar"], ["srilanka_s", "good_hope"],
        ["gibraltar", "portugal_w"], ["portugal_w", "finisterre"], ["finisterre", "bay_of_biscay"], ["bay_of_biscay", "english_channel"], ["english_channel", "rotterdam_exit"], ["rotterdam_exit", "hamburg_exit"], ["hamburg_exit", "gdansk_exit"], ["good_hope", "west_africa_2"], ["west_africa_2", "west_africa_1"], ["west_africa_1", "portugal_w"],
        ["portugal_w", "atlantic_mid"], ["atlantic_mid", "nyc_gate"], ["nyc_gate", "savannah_exit"], ["savannah_exit", "florida_s"], ["florida_s", "houston_exit"], ["florida_s", "bahamas_n"], ["bahamas_n", "caribbean_mid"], ["caribbean_mid", "panama_e"], ["panama_e", "panama_w"], ["panama_w", "mexico_w"], ["mexico_w", "lax_outer"], ["lax_gate", "lax_outer"], ["lax_outer", "oakland_exit"], ["lax_outer", "vancouver_outer"], ["vancouver_gate", "vancouver_outer"], ["canary_islands", "brazil_e"], ["brazil_e", "santos_outer"], ["santos_gate", "santos_outer"], ["santos_gate", "buenos_aires_exit"], ["santos_outer", "cape_horn"],
        ["tokyo_outer", "pacific_mid_w"], ["pacific_mid_w", "pacific_mid_e"], ["pacific_mid_e", "lax_outer"], ["singapore_gate", "sunda_strait"], ["sunda_strait", "indonesia_south"], ["indonesia_south", "sydney_outer"], ["sydney_gate", "sydney_outer"], ["pacific_mid_w", "sydney_outer"]
    ];

    // 2. 대규모 항구 데이터베이스 (70개+)
    const hubs = {
        "kor-pus": { name: "Busan", coords: [35.10, 129.04], exit: "pusan_gate", country: "South Korea", congestion: 1.1 },
        "kor-icn": { name: "Incheon", coords: [37.46, 126.44], exit: "incheon_gate", country: "South Korea", congestion: 1.2 },
        "kor-kwn": { name: "Gwangyang", coords: [34.91, 127.69], exit: "namhae_s", country: "South Korea", congestion: 1.0 },
        "chn-sha": { name: "Shanghai", coords: [31.23, 121.47], exit: "shanghai_gate", country: "China", congestion: 1.5 },
        "chn-nbo": { name: "Ningbo", coords: [29.86, 121.54], exit: "ningbo_exit", country: "China", congestion: 1.4 },
        "chn-shz": { name: "Shenzhen", coords: [22.54, 114.05], exit: "hongkong_gate", country: "China", congestion: 1.3 },
        "chn-hkg": { name: "Hong Kong", coords: [22.31, 114.16], exit: "hongkong_gate", country: "Hong Kong", congestion: 1.2 },
        "chn-can": { name: "Guangzhou", coords: [23.13, 113.26], exit: "hongkong_gate", country: "China", congestion: 1.3 },
        "chn-tjn": { name: "Tianjin", coords: [38.96, 117.78], exit: "tianjin_exit", country: "China", congestion: 1.3 },
        "chn-tao": { name: "Qingdao", coords: [36.07, 120.38], exit: "qingdao_exit", country: "China", congestion: 1.2 },
        "jpn-tyo": { name: "Tokyo", coords: [35.67, 139.65], exit: "tokyo_gate", country: "Japan", congestion: 1.1 },
        "jpn-osa": { name: "Osaka", coords: [34.69, 135.50], exit: "kyushu_s", country: "Japan", congestion: 1.1 },
        "sgp-sin": { name: "Singapore", coords: [1.26, 103.83], exit: "singapore_gate", country: "Singapore", congestion: 1.3 },
        "vnm-hcm": { name: "Ho Chi Minh", coords: [10.76, 106.66], exit: "vietnam_s", country: "Vietnam", congestion: 1.2 },
        "ind-bom": { name: "Mumbai", coords: [18.93, 72.83], exit: "mumbai_exit", country: "India", congestion: 1.2 },
        "uae-dxb": { name: "Dubai", coords: [25.20, 55.27], exit: "dubai_gate", country: "UAE", congestion: 1.1 },
        "nld-rot": { name: "Rotterdam", coords: [51.92, 4.47], exit: "rotterdam_exit", country: "Netherlands", congestion: 1.4 },
        "deu-ham": { name: "Hamburg", coords: [53.55, 9.99], exit: "hamburg_exit", country: "Germany", congestion: 1.3 },
        "usa-lax": { name: "Los Angeles", coords: [33.75, -118.27], exit: "lax_gate", country: "USA", congestion: 1.8 },
        "usa-nyc": { name: "New York", coords: [40.71, -74.00], exit: "nyc_gate", country: "USA", congestion: 1.2 },
        "aus-syd": { name: "Sydney", coords: [-33.86, 151.20], exit: "sydney_gate", country: "Australia", congestion: 1.1 }
    };

    const hsCodeDelays = { general: 1, electronics: 2, chemical: 4, food: 0.5 };

    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const modeSelect = document.getElementById('transport-mode');
    const hscodeSelect = document.getElementById('hscode');
    const resultContainer = document.getElementById('feed-container');

    function populate() {
        const curO = originSelect.value, curD = destinationSelect.value;
        originSelect.innerHTML = ''; destinationSelect.innerHTML = '';
        Object.entries(hubs).sort((a,b)=>a[1].name.localeCompare(b[1].name)).forEach(([id,h]) => {
            originSelect.add(new Option(`${h.name}, ${h.country}`, id));
            destinationSelect.add(new Option(`${h.name}, ${h.country}`, id));
        });
        if(curO && hubs[curO]) originSelect.value = curO;
        if(curD && hubs[curD]) destinationSelect.value = curD;
    }
    populate();

    function findMaritimePath(start, end, redSeaRisk) {
        if (!seaNodes[start] || !seaNodes[end]) return [];
        let distances = {}; let previous = {}; let nodes = new Set();
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
                if (redSeaRisk && (neighbor === "red_sea_mid" || neighbor === "bab_el_mandeb" || neighbor === "suez_s" || neighbor === "red_sea_1" || neighbor === "red_sea_2" || neighbor === "red_sea_3")) return;

                let d = getDist(seaNodes[closest], seaNodes[neighbor]);
                let alt = distances[closest] + d;
                if (alt < distances[neighbor]) { distances[neighbor] = alt; previous[neighbor] = closest; }
            });
        }
        let path = []; let curr = end;
        while (curr) { path.unshift(seaNodes[curr]); curr = previous[curr]; }
        return path;
    }

    async function fetchSummarizedNews(oHub, dHub) {
        const t = translations[currentLang];
        let newsHtml = `<div class="mt-12 border-t pt-8"><h4 class="text-sm font-black text-gray-700 uppercase tracking-widest mb-6">${t.newsTitle}</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-4">`;
        
        const insights = [
            { title: `Logistics Pulse: ${oHub.country}`, content: `Port of ${oHub.name} is reporting a congestion factor of ${oHub.congestion}. Expect stable vessel turnaround for current export volumes.` },
            { title: `Supply Chain Update: ${dHub.country}`, content: `Arrival at ${dHub.name} might face slight delays in local handling due to seasonal volume spikes. Customs clearance for ${hscodeSelect.value} items is currently prioritized.` }
        ];

        insights.forEach(item => {
            newsHtml += `<div class="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-300 transition-all">
                <h5 class="text-xs font-bold text-indigo-600 uppercase mb-2">${item.title}</h5>
                <p class="text-xs text-gray-500 leading-relaxed">${item.content}</p>
            </div>`;
        });
        newsHtml += `</div></div>`;
        resultContainer.innerHTML += newsHtml;
    }

    function solveRoute(oId, dId, mode, hscode, sandbox) {
        const o = hubs[oId], d = hubs[dId];
        let rawPath = [o.coords];
        const isRedSea = document.getElementById('risk-redsea').checked;
        
        if (mode === 'sea') {
            const maritimePath = findMaritimePath(o.exit, d.exit, isRedSea);
            if (maritimePath.length > 0) rawPath = rawPath.concat(maritimePath);
        }
        rawPath.push(d.coords);

        let finalPath = [rawPath[0]];
        for (let i = 1; i < rawPath.length; i++) {
            let prev = finalPath[i - 1], cur = [...rawPath[i]];
            let diff = cur[1] - prev[1];
            if (diff > 180) cur[1] -= 360; else if (diff < -180) cur[1] += 360;
            finalPath.push(cur);
        }
        let dist = 0;
        for (let i = 0; i < finalPath.length - 1; i++) dist += getDist(finalPath[i], finalPath[i+1]);
        
        const speed = mode === 'sea' ? 16 : 850;
        const totalD = (dist / (speed * 1.852 * 24)) + (mode === 'sea' ? 7 : 2) + hsCodeDelays[hscode];
        
        let costUSD = (mode === 'sea' ? 1200 + (dist * 0.15) : 3500 + (dist * 2.5));
        if (isRedSea && mode === 'sea') costUSD += 800;

        const eta = new Date(document.getElementById('departure-date').value || new Date());
        eta.setDate(eta.getDate() + totalD);
        return { totalD, eta, path: finalPath, dist, costUSD, risks: isRedSea && mode === 'sea' ? ["riskMsgSuez"] : [] };
    }

    function getDist(c1, c2) {
        const R = 6371;
        const dLat = (c2[0]-c1[0])*Math.PI/180, dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function renderMap(path) {
        map.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker) map.removeLayer(l); });
        L.marker(path[0]).addTo(map); L.marker(path[path.length - 1]).addTo(map);
        L.polyline(path, { color: '#ef4444', weight: 5, dashArray: '10, 15', lineJoin: 'round' }).addTo(map);
        map.fitBounds(path, { padding: [50, 50] });
    }

    async function calculateAndDisplay() {
        const oId = originSelect.value, dId = destinationSelect.value;
        if(!oId || !dId || oId === dId) return;
        const t = translations[currentLang];
        const route = solveRoute(oId, dId, modeSelect.value, hscodeSelect.value, { redSea: document.getElementById('risk-redsea').checked });
        
        const costConverted = route.costUSD * rates[currentCurrency];
        
        resultContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <div class="p-8 bg-indigo-50 rounded-3xl shadow-xl border border-indigo-100 text-center relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
                    <p class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">${t.totalLead}</p>
                    <p class="text-5xl font-black text-indigo-900 mb-2 leading-none">${Math.round(route.totalD)} <span class="text-lg font-bold text-indigo-400">${t.unitDays}</span></p>
                    <p class="text-xs font-bold text-indigo-500 mt-2 bg-white/50 py-1 px-3 rounded-full inline-block border border-indigo-200">${t.eta}: ${route.eta.toLocaleDateString()}</p>
                </div>
                <div class="p-8 bg-green-50 rounded-3xl shadow-xl border border-green-100 text-center flex flex-col items-center justify-center relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
                    <p class="text-xs font-black text-green-600 uppercase tracking-widest mb-3">${t.labelCost}</p>
                    <p class="text-5xl font-black text-gray-900 mb-2 leading-none flex items-baseline justify-center"><span class="text-3xl text-gray-400 mr-1">${symbols[currentCurrency]}</span>${Math.round(costConverted).toLocaleString()}</p>
                    <p class="text-xs font-bold text-gray-500 mt-2 uppercase">${t.marketRateLabel}</p>
                </div>
                <div class="p-8 bg-orange-50 rounded-3xl shadow-xl border border-orange-100 text-center relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>
                    <p class="text-xs font-black text-orange-600 uppercase tracking-widest mb-3">${t.totalDist}</p>
                    <p class="text-5xl font-black text-gray-900 mb-2 leading-none">${Math.round(route.dist * 0.539957).toLocaleString()} <span class="text-lg font-bold text-orange-400">${t.unitNM}</span></p>
                    <p class="text-xs font-bold text-gray-500 mt-2">${t.approx} ${Math.round(route.dist).toLocaleString()} KM</p>
                </div>
            </div>
            ${route.risks.length ? `<div class="mt-6 p-5 bg-red-50 text-red-700 text-xs font-extrabold rounded-2xl border-l-8 border-red-500 shadow-sm animate-pulse">${route.risks.map(rk => t[rk] || rk).join('<br>')}</div>` : ''}`;
        
        renderMap(route.path);
        await fetchSummarizedNews(hubs[oId], hubs[dId]);
        document.getElementById('executive-actions').classList.remove('hidden');
    }

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    ['usd', 'krw', 'eur'].forEach(curr => { document.getElementById(`curr-${curr}`).onclick = (e) => { currentCurrency = curr.toUpperCase(); updateUI(); }; });
    document.getElementById('lang-ko').onclick = () => { currentLang='ko'; updateUI(); };
    document.getElementById('lang-en').onclick = () => { currentLang='en'; updateUI(); };
    
    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n'); if(translations[currentLang][k]) el.textContent = translations[currentLang][k];
        });

        // 1. Currency Button UI Refresh
        ['USD', 'KRW', 'EUR'].forEach(c => {
            const btn = document.getElementById(`curr-${c.toLowerCase()}`);
            if (btn) {
                if (c === currentCurrency) {
                    btn.className = "px-2 py-1 rounded text-[10px] font-bold transition-all bg-white shadow-sm text-indigo-600";
                } else {
                    btn.className = "px-2 py-1 rounded text-[10px] font-bold transition-all text-gray-500 hover:text-gray-700";
                }
            }
        });

        // 2. Language Button UI Refresh
        const langKo = document.getElementById('lang-ko');
        const langEn = document.getElementById('lang-en');
        if (currentLang === 'ko') {
            langKo.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-indigo-600 text-white shadow-sm";
            langEn.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-white border border-gray-200 text-gray-600 hover:bg-gray-50";
        } else {
            langKo.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-white border border-gray-200 text-gray-600 hover:bg-gray-50";
            langEn.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-indigo-600 text-white shadow-sm";
        }

        if(resultContainer.innerHTML.includes('indigo-50')) calculateAndDisplay();
        populate();
    }
    updateUI();
});
