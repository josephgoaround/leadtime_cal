document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            subtitle: "Global Logistics AI Pathfinder",
            formTitle: "Route Config",
            labelMode: "Transport Mode",
            labelDate: "Departure Date",
            labelOrigin: "Departure City",
            labelDest: "Arrival City",
            btnAnalyze: "RUN ROUTE ANALYSIS",
            tabOverview: "Summary",
            tabStrategy: "Timeline",
            totalLead: "Total Lead Time",
            totalDist: "Total Distance",
            eta: "Estimated ETA",
            labelCost: "Estimated Cost",
            unitDays: "Days",
            unitNM: "NM",
            approx: "Approx.",
            riskRedSea: "Red Sea Conflict",
            riskPanama: "Panama Drought",
            riskStrike: "Port Labor Strike",
            riskMsgSuez: "Suez Bypass: Rerouted via Good Hope",
            riskMsgPanama: "Panama Drought: Rerouted via Suez",
            sandboxTitle: "Risk Scenario Sandbox",
            news1: "Suez Canal transit volume down 42% YoY.",
            news2: "Panama Canal daily slots restricted due to low water levels.",
            news3: "Shanghai Port automation upgrades improving turnaround by 15%.",
            news4: "New EU Carbon Border Adjustment Mechanism (CBAM) phase-in starts.",
            feedPlaceholder: "Select a route to generate deep-dive intelligence briefing.",
            feedTitle: "Route-Specific Intelligence",
            liveAlert: "Live Alert",
            updatedRealtime: "Updated: Real-time",
            disclaimerSpeed: "• Estimated lead times are calculated based on average container ship speeds (approx. 16-18 knots).",
            disclaimerLabel: "• Disclaimer:",
            disclaimerText: "Actual arrival dates may vary due to weather conditions, natural disasters, and port congestion.",
            disclaimerCost: "• Cost estimates are for reference only and may differ from actual carrier rates.",
            marketRateLabel: "Market Benchmark Rate",
            scmNewsTitle: "Latest SCM Intelligence & News"
        },
        ko: {
            subtitle: "글로벌 물류 AI 경로 분석기",
            formTitle: "경로 설정",
            labelMode: "운송 수단",
            labelDate: "출발 예정일",
            labelOrigin: "출발 도시",
            labelDest: "도착 도시",
            btnAnalyze: "경로 분석 실행",
            tabOverview: "요약",
            tabStrategy: "타임라인",
            totalLead: "총 리드타임",
            totalDist: "총 운송 거리",
            eta: "최종 도착 예정일",
            labelCost: "예상 운송 비용",
            unitDays: "일",
            unitNM: "해리(NM)",
            approx: "약",
            riskRedSea: "홍해 분쟁 리스크",
            riskPanama: "파나마 운하 가뭄",
            riskStrike: "항만 파업 시뮬레이션",
            riskMsgSuez: "수에즈 운하 폐쇄: 희망봉 우회 항로 적용",
            riskMsgPanama: "파나마 가뭄: 수에즈 운하 경유 항로로 변경",
            sandboxTitle: "리스크 시나리오 샌드박스",
            news1: "수에즈 운하 통과 물동량 전년 대비 42% 감소.",
            news2: "파나마 운하, 저수위로 인해 일일 통과 선박 수 제한.",
            news3: "상하이 항구 자동화 업그레이드로 처리 속도 15% 향상.",
            news4: "EU 탄소국경조정제도(CBAM) 단계적 도입 시작.",
            feedPlaceholder: "경로를 선택하면 상세 물류 인텔리전스 브리핑이 생성됩니다.",
            feedTitle: "경로별 특화 인텔리전스",
            liveAlert: "실시간 알림",
            updatedRealtime: "업데이트: 실시간",
            disclaimerSpeed: "• 예상 소요 시간은 컨테이너 선종의 평균 속력(약 16-18노트)을 기준으로 계산되었습니다.",
            disclaimerLabel: "• 면책 공지:",
            disclaimerText: "소요 예정 날짜는 악천후, 천재지변 및 항구 혼잡도에 따라 달라질 수 있습니다.",
            disclaimerCost: "• 비용 분석은 참조용이며, 실제 운송사 요금과는 다를 수 있습니다.",
            marketRateLabel: "시장 벤치마크 운임",
            scmNewsTitle: "최신 SCM 물류 인텔리전스 & 뉴스"
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { USD: 1, KRW: 1350, EUR: 0.92 };
    const symbols = { USD: "$", KRW: "₩", EUR: "€" };

    const NEWS_API_KEY = "YOUR_NEWSAPI_KEY"; // NewsAPI 키 필요

    const seaNodes = {
        "pusan_gate": [35.0, 129.1], "geoje_s": [34.6, 128.8], "namhae_s": [34.2, 128.0], "jeju_ne": [33.8, 127.5], "jeju_s": [32.5, 126.5], "incheon_gate": [37.2, 126.1], "incheon_outer": [37.0, 125.0], "yellow_sea_mid": [35.5, 124.5],
        "shanghai_gate": [31.2, 122.5], "shanghai_outer": [30.5, 123.5], "ningbo_exit": [29.8, 122.5], "qingdao_exit": [36.0, 121.0], "taipei_gate": [25.2, 121.8], "taipei_outer": [25.5, 123.0], "kaohsiung_gate": [22.5, 120.2], "hongkong_gate": [22.1, 114.3], "hongkong_outer": [21.5, 115.0], "luzon_strait": [20.0, 121.5], "kyushu_s": [30.5, 131.0], "tokyo_gate": [35.5, 140.0], "tokyo_outer": [34.0, 141.5],
        "vietnam_s": [9.0, 108.0], "vietnam_tip": [8.2, 105.0], "gulf_thailand": [6.5, 102.5], "malacca_e": [1.5, 104.8], "singapore_gate": [1.2, 103.8], "malacca_mid": [2.8, 101.0], "malacca_west": [5.2, 97.5], "andaman_sea": [6.5, 94.0], "jakarta_exit": [-6.0, 106.8], "sunda_strait": [-6.2, 105.5], "indonesia_south": [-10.0, 115.0], "manila_exit": [14.5, 120.8], "bangkok_exit": [13.0, 100.8],
        "srilanka_s": [5.5, 80.5], "mumbai_exit": [18.8, 72.5], "mumbai_outer": [18.5, 71.0], "dubai_gate": [25.2, 55.5], "dubai_outer": [25.8, 56.8], "jebel_ali_exit": [25.0, 55.0], "jeddah_exit": [21.5, 39.0], "arabian_sea_mid": [15.0, 62.0], "bab_el_mandeb": [12.6, 43.3], "red_sea_1": [17.0, 40.5], "red_sea_2": [21.0, 38.0], "red_sea_3": [25.0, 36.0], "suez_s": [29.8, 32.6], "suez_n": [31.3, 32.3],
        "piraeus_exit": [37.8, 23.6], "med_mid": [34.5, 18.0], "gibraltar": [35.9, -5.8], "valencia_exit": [39.4, -0.2], "algeciras_gate": [36.0, -5.4], "portugal_w": [39.0, -11.0], "finisterre": [44.5, -10.0], "bay_of_biscay": [46.5, -6.5], "english_channel": [49.8, -3.5], "le_havre_exit": [49.5, 0.0], "rotterdam_exit": [52.0, 3.8], "antwerp_exit": [51.3, 4.3], "hamburg_exit": [54.0, 8.2], "felixstowe_exit": [51.9, 1.3],
        "good_hope": [-36.0, 20.0], "durban_exit": [-30.0, 31.0], "cape_town_exit": [-34.0, 18.4], "west_africa_1": [15.0, -19.0], "west_africa_2": [0.0, -12.0], "canary_islands": [28.0, -17.0],
        "nyc_gate": [40.2, -73.5], "savannah_exit": [31.5, -80.5], "houston_exit": [29.0, -94.5], "florida_s": [24.2, -81.0], "bahamas_n": [27.0, -78.5], "caribbean_mid": [16.0, -76.0], "panama_e": [9.5, -79.8], "panama_w": [8.8, -79.6], "mexico_w": [18.5, -106.0], "lax_gate": [33.5, -118.5], "lax_outer": [32.5, -120.0], "oakland_exit": [37.8, -122.5], "vancouver_gate": [49.0, -123.8], "vancouver_outer": [48.5, -126.5], "brazil_e": [-6.0, -34.0], "santos_gate": [-24.2, -46.0], "santos_outer": [-25.5, -45.0], "buenos_aires_exit": [-34.6, -58.0], "cape_horn": [-57.5, -67.0],
        "pacific_mid_w": [30.0, 175.0], "pacific_mid_e": [30.0, -175.0], "atlantic_mid": [32.0, -45.0], "sydney_gate": [-33.9, 151.5], "sydney_outer": [-35.0, 153.0]
    };

    const seaEdges = [
        ["incheon_gate", "incheon_outer"], ["incheon_outer", "yellow_sea_mid"], ["yellow_sea_mid", "jeju_s"], ["pusan_gate", "geoje_s"], ["geoje_s", "namhae_s"], ["namhae_s", "jeju_ne"], ["jeju_ne", "jeju_s"], ["jeju_s", "shanghai_gate"], ["jeju_s", "kyushu_s"],
        ["shanghai_gate", "shanghai_outer"], ["shanghai_outer", "taipei_outer"], ["taipei_gate", "taipei_outer"], ["taipei_outer", "kaohsiung_gate"], ["kaohsiung_gate", "luzon_strait"], ["taipei_outer", "luzon_strait"], ["taipei_outer", "kyushu_s"], ["kyushu_s", "tokyo_outer"], ["tokyo_gate", "tokyo_outer"], ["luzon_strait", "hongkong_outer"], ["hongkong_gate", "hongkong_outer"], ["hongkong_outer", "vietnam_s"], ["vietnam_s", "vietnam_tip"], ["vietnam_tip", "bangkok_exit"], ["vietnam_s", "manila_exit"], ["vietnam_s", "malacca_e"], ["malacca_e", "singapore_gate"], ["singapore_gate", "jakarta_exit"], ["jakarta_exit", "sunda_strait"], ["singapore_gate", "malacca_mid"], ["malacca_mid", "malacca_w"], ["malacca_w", "andaman_sea"],
        ["andaman_sea", "srilanka_s"], ["srilanka_s", "mumbai_outer"], ["mumbai_exit", "mumbai_outer"], ["srilanka_s", "arabian_sea_mid"], ["mumbai_outer", "arabian_sea_mid"], ["dubai_outer", "arabian_sea_mid"], ["dubai_gate", "dubai_outer"], ["jebel_ali_exit", "dubai_outer"], ["arabian_sea_mid", "bab_el_mandeb"], ["bab_el_mandeb", "red_sea_1"], ["red_sea_1", "red_sea_2"], ["red_sea_2", "red_sea_3"], ["red_sea_3", "suez_s"], ["suez_s", "suez_n"], ["suez_n", "piraeus_exit"], ["suez_n", "med_mid"], ["med_mid", "valencia_exit"], ["med_mid", "gibraltar"], ["srilanka_s", "good_hope"],
        ["gibraltar", "algeciras_gate"], ["gibraltar", "portugal_w"], ["portugal_w", "finisterre"], ["finisterre", "bay_of_biscay"], ["bay_of_biscay", "le_havre_exit"], ["bay_of_biscay", "english_channel"], ["english_channel", "felixstowe_exit"], ["english_channel", "rotterdam_exit"], ["rotterdam_exit", "antwerp_exit"], ["rotterdam_exit", "hamburg_exit"], ["good_hope", "durban_exit"], ["good_hope", "cape_town_exit"], ["good_hope", "west_africa_2"], ["west_africa_2", "west_africa_1"], ["west_africa_1", "canary_islands"], ["canary_islands", "portugal_w"],
        ["portugal_w", "atlantic_mid"], ["atlantic_mid", "nyc_gate"], ["nyc_gate", "savannah_exit"], ["savannah_exit", "florida_s"], ["florida_s", "houston_exit"], ["florida_s", "bahamas_n"], ["bahamas_n", "caribbean_mid"], ["caribbean_mid", "panama_e"], ["panama_e", "panama_w"], ["panama_w", "mexico_w"], ["mexico_w", "lax_outer"], ["lax_gate", "lax_outer"], ["lax_outer", "oakland_exit"], ["lax_outer", "vancouver_outer"], ["vancouver_gate", "vancouver_outer"], ["canary_islands", "brazil_e"], ["brazil_e", "santos_outer"], ["santos_gate", "santos_outer"], ["santos_gate", "buenos_aires_exit"], ["santos_outer", "cape_horn"],
        ["tokyo_outer", "pacific_mid_w"], ["pacific_mid_w", "pacific_mid_e"], ["pacific_mid_e", "lax_outer"], ["singapore_gate", "sunda_strait"], ["sunda_strait", "indonesia_south"], ["indonesia_south", "sydney_gate"], ["sydney_gate", "sydney_outer"], ["pacific_mid_w", "sydney_outer"]
    ];

    const hubs = {
        // ASIA
        "kor-pus": { name: "Busan", coords: [35.10, 129.04], exit: "pusan_gate", country: "South Korea" },
        "kor-icn": { name: "Incheon", coords: [37.46, 126.44], exit: "incheon_gate", country: "South Korea" },
        "kor-kwn": { name: "Gwangyang", coords: [34.91, 127.69], exit: "namhae_s", country: "South Korea" },
        "chn-sha": { name: "Shanghai", coords: [31.23, 121.47], exit: "shanghai_gate", country: "China" },
        "chn-nbo": { name: "Ningbo", coords: [29.86, 121.54], exit: "ningbo_exit", country: "China" },
        "chn-shz": { name: "Shenzhen", coords: [22.54, 114.05], exit: "hongkong_gate", country: "China" },
        "chn-hkg": { name: "Hong Kong", coords: [22.31, 114.16], exit: "hongkong_gate", country: "Hong Kong" },
        "chn-can": { name: "Guangzhou", coords: [23.13, 113.26], exit: "hongkong_gate", country: "China" },
        "chn-tjn": { name: "Tianjin", coords: [38.96, 117.78], exit: "yellow_sea_mid", country: "China" },
        "jpn-tyo": { name: "Tokyo", coords: [35.67, 139.65], exit: "tokyo_gate", country: "Japan" },
        "sgp-sin": { name: "Singapore", coords: [1.26, 103.83], exit: "singapore_gate", country: "Singapore" },
        "ind-bom": { name: "Mumbai", coords: [18.93, 72.83], exit: "mumbai_exit", country: "India" },
        "uae-dxb": { name: "Dubai", coords: [25.20, 55.27], exit: "dubai_exit", country: "UAE" },
        "nld-rot": { name: "Rotterdam", coords: [51.92, 4.47], exit: "rotterdam_exit", country: "Netherlands" },
        "deu-ham": { name: "Hamburg", coords: [53.55, 9.99], exit: "hamburg_exit", country: "Germany" },
        "usa-lax": { name: "Los Angeles", coords: [33.75, -118.27], exit: "lax_gate", country: "USA" },
        "usa-nyc": { name: "New York", coords: [40.71, -74.00], exit: "nyc_gate", country: "USA" },
        "aus-syd": { name: "Sydney", coords: [-33.86, 151.20], exit: "sydney_gate", country: "Australia" }
    };

    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');

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
                if (redSeaRisk && (neighbor === "red_sea_mid" || neighbor === "bab_el_mandeb" || neighbor === "red_sea_1" || neighbor === "red_sea_2" || neighbor === "red_sea_3")) return;

                let d = getDist(seaNodes[closest], seaNodes[neighbor]);
                let alt = distances[closest] + d;
                if (alt < distances[neighbor]) { distances[neighbor] = alt; previous[neighbor] = closest; }
            });
        }
        let path = []; let curr = end;
        while (curr) { path.unshift(seaNodes[curr]); curr = previous[curr]; }
        return path;
    }

    async function fetchSCMNews(oHub, dHub) {
        const feedContainer = document.getElementById('feed-container');
        const newsSection = document.createElement('div');
        newsSection.className = "mt-12 border-t pt-8";
        newsSection.innerHTML = `<h4 class="text-lg font-bold mb-4 flex items-center gap-2"><svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>${translations[currentLang].scmNewsTitle}</h4>`;
        
        const queries = [`logistics ${oHub.country}`, `supply chain ${dHub.country}`, "global shipping crisis"];
        const query = queries.join(" OR ");
        
        try {
            // NewsAPI는 클라이언트 사이드 호출 시 API 키 노출 위험이 있으므로, 실제 서비스 시에는 백엔드 프록시 권장.
            // 여기서는 구조만 잡고 mock 데이터를 섞어 응답합니다.
            const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevance&pageSize=5&apiKey=${NEWS_API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            
            let newsHtml = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
            if (data.articles && data.articles.length > 0) {
                data.articles.forEach(art => {
                    newsHtml += `
                        <a href="${art.url}" target="_blank" class="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-300 transition-all group">
                            <p class="text-[10px] font-bold text-indigo-500 uppercase mb-1">${art.source.name}</p>
                            <h5 class="text-sm font-bold text-gray-800 group-hover:text-indigo-600 line-clamp-2 mb-2">${art.title}</h5>
                            <p class="text-xs text-gray-500 line-clamp-2">${art.description || ""}</p>
                        </a>`;
                });
            } else {
                newsHtml += `<p class="text-xs text-gray-400 italic">No recent SCM news found for this route. Searching global updates...</p>`;
            }
            newsHtml += '</div>';
            newsSection.innerHTML += newsHtml;
            feedContainer.appendChild(newsSection);
        } catch (e) {
            console.error("News fetch failed", e);
        }
    }

    function solveRoute(oId, dId, mode) {
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
        const totalD = (dist / (speed * 1.852 * 24)) + (mode === 'sea' ? 7 : 2);
        
        let costUSD = mode === 'sea' ? 1200 + (dist * 0.15) : 500 + (dist * 1.25);
        if (isRedSea && mode === 'sea') costUSD += 800;

        const eta = new Date(document.getElementById('departure-date').value || new Date());
        eta.setDate(eta.getDate() + totalD);
        return { totalD, eta, path: finalPath, dist, costUSD, risks: isRedSea && mode === 'sea' ? ["riskMsgSuez"] : [] };
    }

    function getDist(c1, c2) {
        const R = 6371;
        const a = Math.sin((c2[0]-c1[0])*Math.PI/360)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin((c2[1]-c1[1])*Math.PI/360)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function renderMap(path) {
        map.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker) map.removeLayer(l); });
        const start = path[0], end = path[path.length - 1];
        L.marker(start).addTo(map); L.marker(end).addTo(map);
        L.polyline(path, { color: '#ef4444', weight: 5, dashArray: '10, 15', lineJoin: 'round' }).addTo(map);
        map.fitBounds(path, { padding: [50, 50] });
    }

    async function calculateAndDisplay() {
        const oId = originSelect.value, dId = destinationSelect.value;
        if(!oId || !dId || oId === dId) return;
        const route = solveRoute(oId, dId, modeSelect.value);
        const t = translations[currentLang];
        const costConverted = route.costUSD * rates[currentCurrency];
        
        const feedContainer = document.getElementById('feed-container');
        feedContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <div class="p-8 bg-indigo-50 rounded-3xl shadow-lg border border-indigo-100 text-center relative overflow-hidden group hover:bg-indigo-100 transition-all">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
                    <p class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">${t.totalLead}</p>
                    <p class="text-5xl font-black text-indigo-900 mb-2 leading-none">${Math.round(route.totalD)} <span class="text-lg font-bold text-indigo-400">${t.unitDays}</span></p>
                    <p class="text-xs font-bold text-indigo-500 mt-2 bg-white/50 py-1 px-3 rounded-full inline-block border border-indigo-200">${t.eta}: ${route.eta.toLocaleDateString()}</p>
                </div>
                <div class="p-8 bg-green-50 rounded-3xl shadow-lg border border-green-100 text-center relative overflow-hidden group hover:bg-green-100 transition-all">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
                    <p class="text-xs font-black text-green-600 uppercase tracking-widest mb-3">${t.labelCost}</p>
                    <p class="text-5xl font-black text-gray-900 mb-2 leading-none"><span class="text-3xl text-gray-400 mr-1">${symbols[currentCurrency]}</span>${Math.round(costConverted).toLocaleString()}</p>
                    <p class="text-xs font-bold text-gray-500 mt-2 uppercase tracking-tighter">${t.marketRateLabel}</p>
                </div>
                <div class="p-8 bg-orange-50 rounded-3xl shadow-lg border border-orange-100 text-center relative overflow-hidden group hover:bg-orange-100 transition-all">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>
                    <p class="text-xs font-black text-orange-600 uppercase tracking-widest mb-3">${t.totalDist}</p>
                    <p class="text-5xl font-black text-gray-900 mb-2 leading-none">${Math.round(route.dist * 0.539957).toLocaleString()} <span class="text-lg font-bold text-orange-400">${t.unitNM}</span></p>
                    <p class="text-xs font-bold text-gray-500 mt-2">${t.approx} ${Math.round(route.dist).toLocaleString()} KM</p>
                </div>
            </div>
            ${route.risks.length ? `<div class="mt-6 p-5 bg-red-50 text-red-700 text-xs font-extrabold rounded-2xl border-l-8 border-red-500 shadow-sm animate-pulse">${route.risks.map(rk => t[rk] || rk).join('<br>')}</div>` : ''}`;
        
        renderMap(route.path);
        await fetchSCMNews(hubs[oId], hubs[dId]);
    }

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    
    // Currency Switcher
    ['usd', 'krw', 'eur'].forEach(curr => {
        document.getElementById(`curr-${curr}`).onclick = (e) => {
            currentCurrency = curr.toUpperCase();
            document.querySelectorAll('[id^="curr-"]').forEach(btn => {
                btn.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600');
                btn.classList.add('text-gray-500');
            });
            e.target.classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
            if(document.getElementById('feed-container').innerHTML.includes('p-8')) calculateAndDisplay();
        };
    });

    document.getElementById('lang-ko').onclick = () => { currentLang='ko'; updateUI(); };
    document.getElementById('lang-en').onclick = () => { currentLang='en'; updateUI(); };
    
    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n'); if(translations[currentLang][k]) el.textContent = translations[currentLang][k];
        });
        if(document.getElementById('feed-container').innerHTML.includes('p-8')) calculateAndDisplay();
        populate();
    }
    updateUI();
});
