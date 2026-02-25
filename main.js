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
            disclaimerCost: "• Cost estimates are for reference only and may differ from actual carrier rates."
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
            disclaimerCost: "• 비용 분석은 참조용이며, 실제 운송사 요금과는 다를 수 있습니다."
        }
    };

    let currentLang = 'en';

    // 1. 초정밀 해상 노드 (육지 침범 절대 불가 영역)
    const seaNodes = {
        // Korea / NE Asia
        "pusan_exit": [35.0, 129.1], "incheon_exit": [37.2, 126.0], "jeju_s": [32.5, 126.5], "yellow_sea_mid": [35.5, 124.5],
        "shanghai_exit": [31.2, 122.5], "shanghai_outer": [30.5, 123.5], "ningbo_exit": [29.8, 122.5], "qingdao_exit": [36.0, 121.0],
        "taipei_exit": [25.2, 121.8], "taipei_outer": [25.5, 122.5], "kaohsiung_exit": [22.5, 120.2], "hongkong_exit": [22.2, 114.2], "hongkong_outer": [21.5, 114.5],
        "kyushu_s": [30.5, 131.0], "tokyo_exit": [35.5, 140.0], "tokyo_outer": [34.0, 141.0], "luzon_strait": [20.0, 121.5],
        // SE Asia
        "vietnam_s": [9.0, 108.0], "vietnam_tip": [8.2, 105.0], "malacca_east": [1.5, 104.8], "singapore_gate": [1.2, 103.8],
        "port_kelang_exit": [3.0, 101.0], "malacca_mid": [2.8, 101.0], "malacca_west": [5.2, 97.5], "andaman_sea": [6.5, 94.0],
        "jakarta_exit": [-6.0, 106.8], "sunda_strait": [-6.2, 105.5], "indonesia_south": [-10.0, 115.0],
        "manila_exit": [14.5, 120.8], "bangkok_exit": [13.0, 100.8],
        // Indian Ocean
        "srilanka_s": [5.5, 80.5], "mumbai_exit": [18.8, 72.5], "mumbai_outer": [18.5, 71.0], "dubai_exit": [25.2, 55.3], "jebel_ali_gate": [25.0, 55.0], "jeddah_exit": [21.5, 39.0],
        "arabian_sea_mid": [15.0, 62.0], "bab_el_mandeb": [12.6, 43.3], "red_sea_mid": [21.0, 38.0], "suez_s": [29.8, 32.6], "suez_n": [31.3, 32.3],
        // Europe
        "piraeus_exit": [37.8, 23.6], "med_mid": [34.5, 18.0], "gibraltar": [35.9, -5.8], "valencia_exit": [39.4, -0.2], "algeciras_gate": [36.0, -5.4],
        "portugal_w": [39.0, -11.0], "bay_of_biscay": [46.5, -6.5], "english_channel": [49.8, -3.5], "le_havre_gate": [49.5, 0.0],
        "rotterdam_exit": [52.0, 3.8], "antwerp_gate": [51.3, 4.3], "hamburg_exit": [54.0, 8.2], "felixstowe_gate": [51.9, 1.3],
        // Africa
        "good_hope": [-36.0, 20.0], "durban_exit": [-30.0, 31.0], "cape_town_exit": [-34.0, 18.4], "west_africa_1": [15.0, -19.0], "west_africa_2": [0.0, -12.0],
        // Americas
        "nyc_exit": [40.2, -73.5], "savannah_gate": [31.5, -80.5], "houston_gate": [29.0, -94.5], "florida_s": [24.2, -81.0], "panama_e": [9.5, -79.8], "panama_w": [8.8, -79.6],
        "mexico_w": [18.5, -106.0], "lax_exit": [33.5, -118.5], "oakland_gate": [37.8, -122.5], "vancouver_exit": [49.0, -123.8],
        "santos_exit": [-24.0, -46.3], "buenos_aires_exit": [-34.6, -58.0], "brazil_e": [-6.0, -34.0], "cape_horn": [-57.5, -67.0],
        // Mid Oceans
        "pacific_mid_w": [30.0, 175.0], "pacific_mid_e": [30.0, -175.0], "atlantic_mid": [32.0, -45.0], "sydney_gate": [-33.9, 151.5]
    };

    const seaEdges = [
        ["incheon_exit", "yellow_sea_mid"], ["pusan_exit", "jeju_s"], ["yellow_sea_mid", "jeju_s"], ["jeju_s", "shanghai_exit"], ["shanghai_exit", "ningbo_exit"], ["shanghai_exit", "qingdao_exit"], ["jeju_s", "kyushu_s"],
        ["kyushu_s", "tokyo_exit"], ["shanghai_gate", "taipei_exit"], ["taipei_exit", "kaohsiung_exit"], ["kaohsiung_exit", "luzon_strait"], ["taipei_exit", "luzon_strait"], ["luzon_strait", "hongkong_exit"],
        ["hongkong_exit", "vietnam_s"], ["vietnam_s", "vietnam_tip"], ["vietnam_tip", "bangkok_exit"], ["vietnam_s", "manila_exit"], ["vietnam_s", "singapore_gate"], ["singapore_gate", "jakarta_exit"], ["jakarta_exit", "sunda_strait"],
        ["singapore_gate", "port_kelang_exit"], ["port_kelang_exit", "malacca_mid"], ["malacca_mid", "malacca_west"], ["malacca_west", "andaman_sea"], ["andaman_sea", "srilanka_s"],
        ["srilanka_s", "mumbai_exit"], ["srilanka_s", "arabian_sea_mid"], ["mumbai_exit", "arabian_sea_mid"], ["arabian_sea_mid", "dubai_exit"], ["dubai_exit", "jebel_ali_gate"], ["dubai_exit", "bab_el_mandeb"],
        ["bab_el_mandeb", "red_sea_mid"], ["red_sea_mid", "jeddah_exit"], ["red_sea_mid", "suez_s"], ["suez_s", "suez_n"], ["suez_n", "piraeus_exit"], ["suez_n", "med_mid"], ["med_mid", "valencia_exit"], ["med_mid", "gibraltar"],
        ["gibraltar", "algeciras_gate"], ["gibraltar", "portugal_w"], ["portugal_w", "finisterre"], ["finisterre", "bay_of_biscay"], ["bay_of_biscay", "le_havre_gate"], ["bay_of_biscay", "english_channel"], ["english_channel", "felixstowe_gate"], ["english_channel", "rotterdam_exit"], ["rotterdam_exit", "antwerp_gate"], ["rotterdam_exit", "hamburg_exit"],
        ["srilanka_s", "good_hope"], ["good_hope", "durban_exit"], ["good_hope", "cape_town_exit"], ["good_hope", "west_africa_2"], ["west_africa_2", "west_africa_1"], ["west_africa_1", "canary_islands"], ["canary_islands", "portugal_w"],
        ["portugal_w", "atlantic_mid"], ["atlantic_mid", "nyc_exit"], ["nyc_exit", "savannah_gate"], ["savannah_gate", "florida_s"], ["florida_s", "houston_gate"], ["florida_s", "bahamas_n"], ["bahamas_n", "caribbean_mid"], ["caribbean_mid", "panama_e"], ["panama_e", "panama_w"], ["panama_w", "mexico_w"], ["mexico_w", "lax_exit"], ["lax_exit", "oakland_gate"], ["lax_exit", "vancouver_exit"],
        ["canary_islands", "brazil_e"], ["brazil_e", "santos_exit"], ["santos_exit", "buenos_aires_exit"], ["santos_exit", "cape_horn"],
        ["tokyo_exit", "pacific_mid_w"], ["pacific_mid_w", "pacific_mid_e"], ["pacific_mid_e", "lax_exit"], ["singapore_gate", "sunda_strait"], ["sunda_strait", "indonesia_south"], ["indonesia_south", "sydney_gate"]
    ];

    const hubs = {
        "kor-pus": { name: "Busan", coords: [35.10, 129.04], exit: "pusan_exit", country: "South Korea" },
        "kor-icn": { name: "Incheon", coords: [37.46, 126.44], exit: "incheon_exit", country: "South Korea" },
        "chn-sha": { name: "Shanghai", coords: [31.23, 121.47], exit: "shanghai_exit", country: "China" },
        "chn-nbo": { name: "Ningbo", coords: [29.86, 121.54], exit: "ningbo_exit", country: "China" },
        "chn-shz": { name: "Shenzhen", coords: [22.54, 114.05], exit: "hongkong_exit", country: "China" },
        "chn-hkg": { name: "Hong Kong", coords: [22.31, 114.16], exit: "hongkong_exit", country: "Hong Kong" },
        "jpn-tyo": { name: "Tokyo", coords: [35.67, 139.65], exit: "tokyo_exit", country: "Japan" },
        "sgp-sin": { name: "Singapore", coords: [1.26, 103.83], exit: "singapore_gate", country: "Singapore" },
        "mys-pkg": { name: "Port Kelang", coords: [3.00, 101.40], exit: "port_kelang_exit", country: "Malaysia" },
        "vnm-hcm": { name: "Ho Chi Minh", coords: [10.76, 106.66], exit: "vietnam_s", country: "Vietnam" },
        "tha-lcb": { name: "Laem Chabang", coords: [13.08, 100.90], exit: "bangkok_exit", country: "Thailand" },
        "phl-mnl": { name: "Manila", coords: [14.59, 120.98], exit: "manila_exit", country: "Philippines" },
        "ind-bom": { name: "Mumbai", coords: [18.93, 72.83], exit: "mumbai_exit", country: "India" },
        "uae-dxb": { name: "Dubai", coords: [25.20, 55.27], exit: "dubai_exit", country: "UAE" },
        "uae-jba": { name: "Jebel Ali", coords: [25.01, 55.06], exit: "jebel_ali_gate", country: "UAE" },
        "sau-jed": { name: "Jeddah", coords: [21.50, 39.18], exit: "jeddah_exit", country: "Saudi Arabia" },
        "nld-rot": { name: "Rotterdam", coords: [51.92, 4.47], exit: "rotterdam_exit", country: "Netherlands" },
        "deu-ham": { name: "Hamburg", coords: [53.55, 9.99], exit: "hamburg_exit", country: "Germany" },
        "bel-ant": { name: "Antwerp", coords: [51.22, 4.40], exit: "antwerp_gate", country: "Belgium" },
        "gbr-feli": { name: "Felixstowe", coords: [51.96, 1.35], exit: "felixstowe_gate", country: "UK" },
        "esp-val": { name: "Valencia", coords: [39.47, -0.37], exit: "valencia_exit", country: "Spain" },
        "esp-alg": { name: "Algeciras", coords: [36.13, -5.45], exit: "algeciras_gate", country: "Spain" },
        "grc-pir": { name: "Piraeus", coords: [37.94, 23.64], exit: "piraeus_exit", country: "Greece" },
        "usa-lax": { name: "Los Angeles", coords: [33.75, -118.27], exit: "lax_exit", country: "USA" },
        "usa-oak": { name: "Oakland", coords: [37.80, -122.27], exit: "oakland_gate", country: "USA" },
        "usa-nyc": { name: "New York", coords: [40.71, -74.00], exit: "nyc_gate", country: "USA" },
        "usa-sav": { name: "Savannah", coords: [32.08, -81.09], exit: "savannah_gate", country: "USA" },
        "usa-hou": { name: "Houston", coords: [29.76, -95.36], exit: "houston_gate", country: "USA" },
        "can-yvr": { name: "Vancouver", coords: [49.28, -123.12], exit: "vancouver_exit", country: "Canada" },
        "bra-sao": { name: "Santos", coords: [-23.96, -46.33], exit: "santos_exit", country: "Brazil" },
        "aus-syd": { name: "Sydney", coords: [-33.86, 151.20], exit: "sydney_gate", country: "Australia" }
    };

    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const resultContainer = document.getElementById('result');

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
                if (redSeaRisk && (neighbor === "red_sea_mid" || neighbor === "bab_el_mandeb" || neighbor === "suez_s")) return;

                let d = getDist(seaNodes[closest], seaNodes[neighbor]);
                let alt = distances[closest] + d;
                if (alt < distances[neighbor]) { distances[neighbor] = alt; previous[neighbor] = closest; }
            });
        }
        let path = []; let curr = end;
        while (curr) { path.unshift(seaNodes[curr]); curr = previous[curr]; }
        return path;
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
        
        let cost = 0;
        if (mode === 'sea') {
            cost = 1200 + (dist * 0.15);
            if (isRedSea) cost += 800;
        } else {
            cost = 500 + (dist * 1.25);
        }

        const eta = new Date(document.getElementById('departure-date').value || new Date());
        eta.setDate(eta.getDate() + totalD);
        return { totalD, eta, path: finalPath, dist, cost, risks: isRedSea && mode === 'sea' ? ["riskMsgSuez"] : [] };
    }

    function getDist(c1, c2) {
        const R = 6371;
        const dLat = (c2[0]-c1[0])*Math.PI/180, dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function renderMap(path, oH, dH) {
        map.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker) map.removeLayer(l); });
        L.marker(oH.coords).addTo(map); L.marker(dH.coords).addTo(map);
        L.polyline(path, { color: '#ef4444', weight: 5, dashArray: '10, 15', lineJoin: 'round' }).addTo(map);
        map.fitBounds(path, { padding: [50, 50] });
    }

    document.getElementById('shipping-form').onsubmit = (e) => {
        e.preventDefault();
        const oId = originSelect.value, dId = destinationSelect.value;
        if(!oId || !dId || oId === dId) return;
        const route = solveRoute(oId, dId, modeSelect.value);
        const t = translations[currentLang];
        
        resultContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                    <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                    <p class="text-3xl font-black text-indigo-900">${Math.round(route.totalD)} <span class="text-sm font-bold text-gray-400">${t.unitDays}</span></p>
                    <p class="text-[10px] font-bold text-indigo-500 mt-1">${t.eta}: ${route.eta.toLocaleDateString()}</p>
                </div>
                <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <p class="text-[10px] font-extrabold text-green-600 uppercase tracking-widest mb-1">${t.labelCost}</p>
                    <p class="text-3xl font-black text-gray-900">$${Math.round(route.cost).toLocaleString()}</p>
                    <p class="text-[10px] font-bold text-gray-400 mt-1">Estimated Market Rate</p>
                </div>
                <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                    <p class="text-[10px] font-extrabold text-red-500 uppercase tracking-widest mb-1">${t.totalDist}</p>
                    <p class="text-3xl font-black text-gray-900">${Math.round(route.dist * 0.539957).toLocaleString()} <span class="text-sm font-bold text-gray-400">${t.unitNM}</span></p>
                    <p class="text-[10px] font-bold text-gray-400 mt-1">${t.approx} ${Math.round(route.dist).toLocaleString()} KM</p>
                </div>
            </div>
            ${route.risks.length ? `<div class="mt-4 p-4 bg-red-50 text-red-700 text-[10px] font-bold rounded-xl border-l-4 border-red-500">${route.risks.map(rk => t[rk] || rk).join('<br>')}</div>` : ''}`;
        renderMap(route.path, hubs[oId], hubs[dId]);
    };

    document.getElementById('lang-ko').onclick = () => { currentLang='ko'; updateUI(); };
    document.getElementById('lang-en').onclick = () => { currentLang='en'; updateUI(); };
    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n'); if(translations[currentLang][k]) el.textContent = translations[currentLang][k];
        });
        if(resultContainer.innerHTML !== '') document.getElementById('shipping-form').dispatchEvent(new Event('submit'));
        populate();
    }
    updateUI();
});
