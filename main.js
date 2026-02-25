document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            subtitle: "Global Logistics AI Pathfinder",
            formTitle: "Route Config",
            labelMode: "Transport Mode",
            labelDate: "Departure Date",
            labelOrigin: "Departure City",
            labelDest: "Arrival City",
            labelHSCode: "Commodity Type",
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
            newsTitle: "Latest SCM Intelligence & News",
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
            labelHSCode: "품목군",
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
            newsTitle: "최신 SCM 물류 인텔리전스 & 뉴스",
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

    const seaNodes = {
        "pusan_gate": [35.0, 129.1], "geoje_s": [34.6, 128.8], "namhae_s": [34.2, 128.0], "jeju_ne": [33.8, 127.5], "jeju_s": [32.5, 126.5], "jeju_w": [33.2, 125.5], "incheon_gate": [37.2, 126.1], "incheon_outer": [37.0, 125.0], "yellow_sea_mid": [35.5, 124.5],
        "shanghai_gate": [31.2, 122.5], "shanghai_outer": [30.5, 123.5], "ningbo_exit": [29.8, 122.5], "taipei_outer": [25.5, 123.0], "kaohsiung_gate": [22.5, 120.2], "hongkong_outer": [21.5, 115.0], "luzon_strait": [20.0, 121.5], "kyushu_s": [30.5, 131.0], "tokyo_outer": [34.0, 141.5],
        "vietnam_s": [9.0, 108.0], "vietnam_tip": [8.2, 105.0], "malacca_e": [1.5, 104.8], "singapore_gate": [1.2, 103.8], "malacca_mid": [2.8, 101.0], "malacca_west": [5.2, 97.5], "andaman_sea": [6.5, 94.0],
        "srilanka_s": [5.5, 80.5], "mumbai_outer": [18.5, 71.0], "dubai_gate": [25.2, 55.5], "arabian_sea_mid": [15.0, 62.0], "bab_el_mandeb": [12.6, 43.3], "red_sea_1": [17.0, 40.5], "red_sea_2": [21.0, 38.0], "red_sea_3": [25.0, 36.0], "suez_s": [29.8, 32.6], "suez_n": [31.3, 32.3],
        "gibraltar": [35.9, -5.8], "med_mid": [34.5, 18.0], "portugal_w": [39.0, -11.0], "finisterre": [44.5, -10.0], "bay_of_biscay": [46.5, -6.5], "english_channel": [49.8, -3.5], "rotterdam_exit": [52.0, 3.8], "hamburg_exit": [54.0, 8.2], "gdansk_exit": [55.0, 18.5],
        "good_hope": [-36.0, 20.0], "west_africa_2": [0.0, -12.0], "west_africa_1": [15.0, -19.0],
        "nyc_gate": [40.2, -73.5], "savannah_exit": [31.5, -80.5], "houston_exit": [29.0, -94.5], "florida_s": [24.2, -81.0], "bahamas_n": [27.0, -78.5], "caribbean_mid": [16.0, -76.0], "panama_e": [9.5, -79.8], "panama_w": [8.8, -79.6], "mexico_w": [18.5, -106.0], "lax_outer": [32.5, -120.0], "vancouver_outer": [48.5, -126.5],
        "brazil_e": [-6.0, -34.0], "santos_outer": [-25.5, -45.0], "buenos_aires_exit": [-34.6, -58.0], "cape_horn": [-57.5, -67.0],
        "pacific_mid_w": [30.0, 175.0], "pacific_mid_e": [30.0, -175.0], "atlantic_mid": [32.0, -45.0], "sydney_outer": [-35.0, 153.0]
    };

    const seaEdges = [
        ["pusan_gate", "geoje_s"], ["geoje_s", "namhae_s"], ["namhae_s", "jeju_ne"], ["jeju_ne", "jeju_s"], ["jeju_s", "kyushu_s"],
        ["incheon_gate", "incheon_outer"], ["incheon_outer", "yellow_sea_mid"], ["yellow_sea_mid", "jeju_w"], ["jeju_w", "jeju_s"],
        ["shanghai_gate", "shanghai_outer"], ["shanghai_outer", "taipei_outer"], ["taipei_outer", "hongkong_outer"], ["hongkong_outer", "vietnam_s"], ["vietnam_s", "vietnam_tip"], ["vietnam_tip", "malacca_e"], ["malacca_e", "singapore_gate"], ["singapore_gate", "malacca_mid"], ["malacca_mid", "malacca_west"], ["malacca_west", "andaman_sea"], ["andaman_sea", "srilanka_s"],
        ["srilanka_s", "mumbai_outer"], ["mumbai_outer", "arabian_sea_mid"], ["arabian_sea_mid", "bab_el_mandeb"], ["bab_el_mandeb", "red_sea_1"], ["red_sea_1", "red_sea_2"], ["red_sea_2", "red_sea_3"], ["red_sea_3", "suez_s"], ["suez_s", "suez_n"], ["suez_n", "med_mid"], ["med_mid", "gibraltar"], ["gibraltar", "portugal_w"],
        ["srilanka_s", "good_hope"], ["good_hope", "west_africa_2"], ["west_africa_2", "west_africa_1"], ["west_africa_1", "portugal_w"],
        ["portugal_w", "finisterre"], ["finisterre", "bay_of_biscay"], ["bay_of_biscay", "english_channel"], ["english_channel", "rotterdam_exit"], ["rotterdam_exit", "hamburg_exit"],
        ["portugal_w", "atlantic_mid"], ["atlantic_mid", "nyc_gate"], ["nyc_gate", "savannah_exit"], ["savannah_exit", "florida_s"], ["florida_s", "caribbean_mid"], ["caribbean_mid", "panama_e"], ["panama_e", "panama_w"], ["panama_w", "mexico_w"], ["mexico_w", "lax_outer"],
        ["tokyo_outer", "pacific_mid_w"], ["pacific_mid_w", "pacific_mid_e"], ["pacific_mid_e", "lax_outer"]
    ];

    const hubs = {
        "kor-pus": { name: "Busan", coords: [35.10, 129.04], exit: "pusan_gate", country: "South Korea", congestion: 1.1 },
        "kor-icn": { name: "Incheon", coords: [37.46, 126.44], exit: "incheon_gate", country: "South Korea", congestion: 1.2 },
        "chn-sha": { name: "Shanghai", coords: [31.23, 121.47], exit: "shanghai_gate", country: "China", congestion: 1.5 },
        "sgp-sin": { name: "Singapore", coords: [1.26, 103.83], exit: "singapore_gate", country: "Singapore", congestion: 1.3 },
        "nld-rot": { name: "Rotterdam", coords: [51.92, 4.47], exit: "rotterdam_exit", country: "Netherlands", congestion: 1.4 },
        "usa-lax": { name: "Los Angeles", coords: [33.75, -118.27], exit: "lax_gate", country: "USA", congestion: 1.8 },
        "uae-dxb": { name: "Dubai", coords: [25.20, 55.27], exit: "dubai_gate", country: "UAE", congestion: 1.1 }
    };

    const commodityDelays = { general: 1, rf: 2, dg: 4, special: 5 };

    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
        maxZoom: 13
    }).addTo(map);

    const originSelect = document.getElementById('origin'), destinationSelect = document.getElementById('destination'), modeSelect = document.getElementById('transport-mode'), hscodeSelect = document.getElementById('hscode'), resultContainer = document.getElementById('feed-container');

    function populate() {
        originSelect.innerHTML = ''; destinationSelect.innerHTML = '';
        Object.entries(hubs).sort((a,b)=>a[1].name.localeCompare(b[1].name)).forEach(([id,h]) => {
            originSelect.add(new Option(`${h.name}, ${h.country}`, id));
            destinationSelect.add(new Option(`${h.name}, ${h.country}`, id));
        });
    }
    populate();

    function getGreatCirclePath(start, end, points = 50) {
        const path = [];
        const lat1 = start[0] * Math.PI / 180, lon1 = start[1] * Math.PI / 180;
        const lat2 = end[0] * Math.PI / 180, lon2 = end[1] * Math.PI / 180;
        const d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)));
        for (let i = 0; i <= points; i++) {
            const f = i / points;
            const A = Math.sin((1 - f) * d) / Math.sin(d);
            const B = Math.sin(f * d) / Math.sin(d);
            const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
            const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
            const z = A * Math.sin(lat1) + B * Math.sin(lat2);
            const lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
            const lon = Math.atan2(y, x);
            path.push([lat * 180 / Math.PI, lon * 180 / Math.PI]);
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
                if (isRiskActive && ["red_sea_1", "red_sea_2", "red_sea_3", "bab_el_mandeb", "suez_s"].includes(neighbor)) return;
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

    function calculateStats(dist, mode, cargo, isRedSea) {
        const speed = mode === 'sea' ? 16 : 850;
        const transitDays = (dist / (speed * 1.852 * 24)) + (mode === 'sea' ? 7 : 2) + commodityDelays[cargo];
        let costUSD = (mode === 'sea' ? 1500 + (dist * 0.18) : 4000 + (dist * 2.8));
        if (isRedSea && mode === 'sea') costUSD += 1200;
        return { transitDays, costUSD };
    }

    function solveRoute(oId, dId, mode, cargo) {
        const o = hubs[oId], d = hubs[dId];
        const isRedSeaDisrupted = activeGlobalRisks.redSea.active;
        let routePath = [], totalDist = 0;

        if (mode === 'sea') {
            const maritimeNodes = findMaritimePath(o.exit, d.exit, isRedSeaDisrupted);
            const rawPath = [o.coords].concat(maritimeNodes).concat([d.coords]);
            for (let i = 0; i < rawPath.length - 1; i++) {
                routePath = routePath.concat(getGreatCirclePath(rawPath[i], rawPath[i+1]));
                totalDist += getDistHaversine(rawPath[i], rawPath[i+1]);
            }
        } else {
            routePath = getGreatCirclePath(o.coords, d.coords);
            totalDist = getDistHaversine(o.coords, d.coords);
        }

        const stats = calculateStats(totalDist, mode, cargo, isRedSeaDisrupted);
        const altMode = mode === 'sea' ? 'air' : 'sea';
        let altDist = (altMode === 'sea') ? totalDist * 1.2 : getDistHaversine(o.coords, d.coords);
        const altStats = calculateStats(altDist, altMode, cargo, isRedSeaDisrupted);

        const eta = new Date(document.getElementById('departure-date').value || new Date());
        eta.setDate(eta.getDate() + stats.transitDays);

        return { transitDays: stats.transitDays, eta, routePath, totalDist, costUSD: stats.costUSD, altStats, altMode, isRedSeaDisrupted };
    }

    async function calculateAndDisplay() {
        const oId = originSelect.value, dId = destinationSelect.value;
        if(!oId || !dId || oId === dId) return;
        const t = translations[currentLang], route = solveRoute(oId, dId, modeSelect.value, hscodeSelect.value);
        const costConverted = route.costUSD * rates[currentCurrency], formattedCost = Math.round(costConverted).toLocaleString(), altCostConverted = route.altStats.costUSD * rates[currentCurrency];
        
        let fontSizeClass = formattedCost.length > 10 ? "text-3xl" : (formattedCost.length > 7 ? "text-4xl" : "text-5xl");

        resultContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <div class="p-8 bg-indigo-50 rounded-3xl shadow-xl border border-indigo-100 text-center flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
                    <p class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">${t.totalLead}</p>
                    <p class="text-5xl font-black text-indigo-900 mb-2 leading-none">${Math.round(route.transitDays)} <span class="text-lg font-bold text-indigo-400">${t.unitDays}</span></p>
                    <p class="text-[10px] font-bold text-indigo-500 mt-2 bg-white/50 py-1 px-3 rounded-full border border-indigo-200">${t.eta}: ${route.eta.toLocaleDateString()}</p>
                    <p class="text-[9px] text-gray-400 mt-2 font-bold">${t.totalDist}: ${Math.round(route.totalDist * 0.539957).toLocaleString()} NM</p>
                </div>
                <div class="p-8 bg-green-50 rounded-3xl shadow-xl border border-green-100 text-center flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
                    <p class="text-xs font-black text-green-600 uppercase tracking-widest mb-3">${t.labelCost}</p>
                    <p class="${fontSizeClass} font-black text-gray-900 mb-2 leading-none flex items-baseline justify-center"><span class="text-2xl text-gray-400 mr-1 font-bold">${symbols[currentCurrency]}</span>${formattedCost}</p>
                    <p class="text-xs font-bold text-gray-500 mt-2 uppercase">${t.marketRateLabel}</p>
                </div>
                <div class="p-8 bg-orange-50 rounded-3xl shadow-xl border border-orange-100 text-center flex flex-col items-center justify-center min-h-[240px] relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>
                    <p class="text-xs font-black text-orange-600 uppercase tracking-widest mb-3">${t.compareTitle}</p>
                    <div class="space-y-2">
                        <p class="text-[10px] font-bold text-orange-400 uppercase tracking-tighter">${route.altMode === 'sea' ? t.compareSea : t.compareAir}</p>
                        <p class="text-2xl font-black text-gray-900 leading-tight">${Math.round(route.altStats.transitDays)}${t.unitDays} / <span class="text-indigo-600">${symbols[currentCurrency]}${Math.round(altCostConverted).toLocaleString()}</span></p>
                        <p class="text-[9px] text-gray-400 font-medium italic">Haversine Great Circle Applied</p>
                    </div>
                </div>
            </div>
            ${route.isRedSeaDisrupted && modeSelect.value === 'sea' ? `<div class="mt-6 p-5 bg-red-50 text-red-700 text-xs font-extrabold rounded-2xl border-l-8 border-red-500 shadow-sm animate-pulse">${t.riskMsgSuez} (+${activeGlobalRisks.redSea.delay} Days Delay Auto-Applied)</div>` : ''}`;
        
        renderMap(route.routePath, modeSelect.value);
        await fetchSummarizedNews(hubs[oId], hubs[dId]);
        document.getElementById('executive-actions').classList.remove('hidden');
    }

    function renderMap(path, mode) {
        map.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker) map.removeLayer(l); });
        
        const startIcon = L.divIcon({ className: 'custom-div-icon', html: `<div class="w-3 h-3 bg-white border-2 border-indigo-600 rounded-full shadow-lg"></div>` });
        const endIcon = L.divIcon({ className: 'custom-div-icon', html: `<div class="w-3 h-3 bg-indigo-600 border-2 border-white rounded-full shadow-lg"></div>` });

        L.marker(path[0], {icon: startIcon}).addTo(map);
        L.marker(path[path.length - 1], {icon: endIcon}).addTo(map);

        const color = mode === 'sea' ? '#1e40af' : '#06b6d4'; 
        
        // Background glow line
        L.polyline(path, { color: color, weight: 8, opacity: 0.15 }).addTo(map);
        
        // Main path line
        L.polyline(path, { 
            color: color, 
            weight: 3, 
            opacity: 0.8, 
            dashArray: mode === 'sea' ? '1, 8' : '10, 10',
            lineCap: 'round'
        }).addTo(map);

        map.fitBounds(path, { padding: [80, 80] });
    }

    function startLiveUpdates() {
        setInterval(() => {
            const ticker = document.getElementById('news-ticker'); if (!ticker) return;
            const liveNews = [
                `ALERT: ${activeGlobalRisks.redSea.label} is currently active. All sea routes auto-rerouted.`,
                "Shanghai Port terminal automation update: expect 15% faster turnaround.",
                "Rotterdam berthing delay reported: 8-12 hours for ultra-large vessels.",
                "Global Bunker fuel price index down 2.1% this week.",
                "New customs regulation in EU (CBAM) requiring additional documentation."
            ];
            const randomIndex = Math.floor(Math.random() * liveNews.length);
            const newItem = document.createElement('span'); newItem.className = "text-indigo-400 animate-pulse font-bold"; newItem.textContent = liveNews[randomIndex];
            ticker.appendChild(newItem); if (ticker.children.length > 8) ticker.removeChild(ticker.firstChild);
        }, 12000);
    }

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    ['usd', 'krw', 'eur'].forEach(curr => { document.getElementById(`curr-${curr}`).onclick = () => { currentCurrency = curr.toUpperCase(); updateUI(); }; });
    document.getElementById('lang-ko').onclick = () => { currentLang='ko'; updateUI(); };
    document.getElementById('lang-en').onclick = () => { currentLang='en'; updateUI(); };
    
    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); if(translations[currentLang][k]) el.textContent = translations[currentLang][k]; });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { const k = el.getAttribute('data-i18n-placeholder'); if(translations[currentLang][k]) el.placeholder = translations[currentLang][k]; });
        ['USD', 'KRW', 'EUR'].forEach(c => { const btn = document.getElementById(`curr-${c.toLowerCase()}`); if (btn) btn.className = (c === currentCurrency) ? "px-2 py-1 rounded text-[10px] font-bold transition-all bg-white shadow-sm text-indigo-600" : "px-2 py-1 rounded text-[10px] font-bold transition-all text-gray-500 hover:text-gray-700"; });
        const langKo = document.getElementById('lang-ko'), langEn = document.getElementById('lang-en');
        if (currentLang === 'ko') { langKo.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-indigo-600 text-white shadow-sm"; langEn.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"; }
        else { langKo.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"; langEn.className = "px-3 py-1.5 rounded-md text-xs font-bold transition-all bg-indigo-600 text-white shadow-sm"; }
        if(resultContainer.innerHTML.includes('indigo-50')) calculateAndDisplay();
        populate();
    }
    updateUI(); startLiveUpdates();
});
