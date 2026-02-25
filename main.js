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
            aiRec: "Routing Intelligence",
            disclaimer: "• 16kts avg. sea speed. Routes strictly maritime optimized.",
            disclaimerSpeed: "• Estimated lead times are calculated based on average container ship speeds (approx. 16-18 knots).",
            disclaimerLabel: "• Disclaimer:",
            disclaimerText: "Actual arrival dates may vary due to weather conditions, natural disasters, and port congestion.",
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
            updatedRealtime: "Updated: Real-time"
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
            aiRec: "라우팅 인텔리전스",
            disclaimer: "• 해상 평균 16노트 기준. 육지 침범 없는 현실적 항로 반영.",
            disclaimerSpeed: "• 예상 소요 시간은 컨테이너 선종의 평균 속력(약 16-18노트)을 기준으로 계산되었습니다.",
            disclaimerLabel: "• 면책 공지:",
            disclaimerText: "소요 예정 날짜는 악천후, 천재지변 및 항구 혼잡도에 따라 달라질 수 있습니다.",
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
            updatedRealtime: "업데이트: 실시간"
        }
    };

    let currentLang = 'en';

    // 1. 초정밀 해상 노드 (육지 완전 회피 그리드)
    const seaNodes = {
        // Korea Coastal (Detailed Bypass)
        "pusan_gate": [35.0, 129.1], "geoje_s": [34.5, 128.8], "namhae_s": [34.1, 127.8], "jeju_nw": [33.8, 125.8], "jeju_s": [32.5, 126.5], "incheon_gate": [37.2, 126.1], "yellow_sea_mid": [35.5, 124.5],
        // NE Asia
        "shanghai_gate": [31.2, 122.5], "shanghai_outer": [30.5, 123.5], "kyushu_s": [30.5, 131.0], "tokyo_gate": [35.0, 140.0], "tokyo_outer": [34.0, 141.0], "taipei_gate": [25.2, 122.0], "taipei_outer": [25.5, 123.0], "luzon_strait": [20.0, 121.5], "hongkong_gate": [22.1, 114.3], "hongkong_outer": [21.5, 115.0],
        // SE Asia (Detailed Malacca)
        "vietnam_s": [9.0, 108.0], "vietnam_tip": [8.2, 105.0], "gulf_thailand": [6.5, 102.5], "malacca_east": [1.5, 104.8], "singapore_gate": [1.2, 103.8], "malacca_mid": [2.8, 101.0], "malacca_west": [5.2, 97.5], "andaman_sea": [6.5, 94.0], "indonesia_south": [-10.0, 115.0], "sunda_strait": [-6.2, 105.5],
        // Indian Ocean
        "srilanka_s": [5.5, 80.5], "mumbai_gate": [18.8, 72.5], "mumbai_outer": [18.5, 71.0], "dubai_gate": [25.2, 55.5], "dubai_outer": [25.8, 56.8], "arabian_sea_mid": [15.0, 62.0], "bab_el_mandeb": [12.6, 43.3], "red_sea_1": [17.0, 40.5], "red_sea_2": [21.0, 38.0], "red_sea_3": [25.0, 36.0], "suez_s": [29.8, 32.6], "suez_n": [31.3, 32.3],
        // Europe & Africa
        "med_mid": [34.5, 18.0], "gibraltar": [35.9, -5.8], "portugal_w": [39.0, -11.0], "finisterre": [44.5, -10.0], "bay_of_biscay": [46.5, -6.5], "english_channel": [49.8, -3.5], "rotterdam_gate": [52.0, 3.8], "hamburg_gate": [54.0, 8.2], "good_hope": [-36.0, 20.0], "west_africa_1": [15.0, -19.0], "west_africa_2": [0.0, -12.0], "canary_islands": [28.0, -17.0],
        // Americas
        "nyc_gate": [40.2, -73.5], "florida_s": [24.2, -81.0], "bahamas_n": [27.0, -78.5], "caribbean_mid": [16.0, -76.0], "panama_e": [9.5, -79.8], "panama_w": [8.8, -79.6], "mexico_w": [18.5, -106.0], "lax_gate": [33.5, -118.5], "lax_outer": [32.5, -120.0], "vancouver_gate": [49.0, -123.8], "vancouver_outer": [48.5, -126.5], "brazil_e": [-6.0, -34.0], "santos_gate": [-24.2, -46.0], "santos_outer": [-25.5, -45.0], "cape_horn": [-57.5, -67.0],
        // Mid Oceans (Antimeridian Handling)
        "pacific_mid_w": [30.0, 175.0], "pacific_mid_e": [30.0, -175.0], "atlantic_mid": [32.0, -45.0], "sydney_gate": [-33.9, 151.5], "sydney_outer": [-35.0, 153.0]
    };

    // 2. 정밀 해상 연결망 (육지 절대 침범 불가)
    const seaEdges = [
        // Korea Bypass
        ["incheon_gate", "yellow_sea_mid"], ["yellow_sea_mid", "jeju_nw"], ["jeju_nw", "jeju_s"], ["pusan_gate", "geoje_s"], ["geoje_s", "namhae_s"], ["namhae_s", "jeju_nw"], ["jeju_s", "shanghai_gate"], ["jeju_s", "kyushu_s"],
        // Asia Network
        ["shanghai_gate", "shanghai_outer"], ["shanghai_outer", "taipei_outer"], ["taipei_gate", "taipei_outer"], ["taipei_outer", "luzon_strait"], ["taipei_outer", "kyushu_s"], ["kyushu_s", "tokyo_outer"], ["tokyo_gate", "tokyo_outer"], ["luzon_strait", "hongkong_outer"], ["hongkong_gate", "hongkong_outer"], ["hongkong_outer", "vietnam_s"], ["vietnam_s", "vietnam_tip"], ["vietnam_tip", "gulf_thailand"], ["gulf_thailand", "malacca_east"], ["vietnam_s", "malacca_east"], ["malacca_east", "singapore_gate"], ["singapore_gate", "malacca_mid"], ["malacca_mid", "malacca_west"], ["malacca_west", "andaman_sea"],
        // Indian Ocean & Suez
        ["andaman_sea", "srilanka_s"], ["srilanka_s", "mumbai_outer"], ["mumbai_gate", "mumbai_outer"], ["srilanka_s", "arabian_sea_mid"], ["mumbai_outer", "arabian_sea_mid"], ["dubai_outer", "arabian_sea_mid"], ["dubai_gate", "dubai_outer"], ["arabian_sea_mid", "bab_el_mandeb"], ["bab_el_mandeb", "red_sea_1"], ["red_sea_1", "red_sea_2"], ["red_sea_2", "red_sea_3"], ["red_sea_3", "suez_s"], ["suez_s", "suez_n"], ["suez_n", "med_mid"], ["srilanka_s", "good_hope"],
        // Europe & Africa
        ["med_mid", "gibraltar"], ["gibraltar", "portugal_w"], ["portugal_w", "finisterre"], ["finisterre", "bay_of_biscay"], ["bay_of_biscay", "english_channel"], ["english_channel", "rotterdam_gate"], ["rotterdam_gate", "hamburg_gate"], ["good_hope", "west_africa_2"], ["west_africa_2", "west_africa_1"], ["west_africa_1", "canary_islands"], ["canary_islands", "portugal_w"],
        // Americas
        ["portugal_w", "atlantic_mid"], ["atlantic_mid", "nyc_gate"], ["nyc_gate", "bahamas_n"], ["bahamas_n", "florida_s"], ["florida_s", "caribbean_mid"], ["caribbean_mid", "panama_e"], ["panama_e", "panama_w"], ["panama_w", "mexico_w"], ["mexico_w", "lax_outer"], ["lax_gate", "lax_outer"], ["lax_outer", "vancouver_outer"], ["vancouver_gate", "vancouver_outer"], ["canary_islands", "brazil_e"], ["brazil_e", "santos_outer"], ["santos_gate", "santos_outer"], ["santos_outer", "cape_horn"],
        // Pacific (Antimeridian)
        ["tokyo_outer", "pacific_mid_w"], ["pacific_mid_w", "pacific_mid_e"], ["pacific_mid_e", "lax_outer"], ["singapore_gate", "indonesia_south"], ["indonesia_south", "sydney_outer"], ["sydney_gate", "sydney_outer"], ["pacific_mid_w", "sydney_outer"]
    ];

    const hubs = {
        "kor-pus": { name: "Busan", coords: [35.10, 129.04], exit: "pusan_gate" },
        "kor-icn": { name: "Incheon", coords: [37.46, 126.44], exit: "incheon_gate" },
        "chn-sha": { name: "Shanghai", coords: [31.23, 121.47], exit: "shanghai_gate" },
        "jpn-tyo": { name: "Tokyo", coords: [35.67, 139.65], exit: "tokyo_gate" },
        "chn-hkg": { name: "Hong Kong", coords: [22.31, 114.16], exit: "hongkong_gate" },
        "twn-tpe": { name: "Taipei", coords: [25.03, 121.56], exit: "taipei_gate" },
        "sgp-sin": { name: "Singapore", coords: [1.26, 103.83], exit: "singapore_gate" },
        "nld-rot": { name: "Rotterdam", coords: [51.92, 4.47], exit: "rotterdam_gate" },
        "deu-ham": { name: "Hamburg", coords: [53.55, 9.99], exit: "hamburg_gate" },
        "usa-lax": { name: "Los Angeles", coords: [33.75, -118.27], exit: "lax_gate" },
        "usa-nyc": { name: "New York", coords: [40.71, -74.00], exit: "nyc_gate" },
        "aus-syd": { name: "Sydney", coords: [-33.86, 151.20], exit: "sydney_gate" }
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
            originSelect.add(new Option(h.name, id));
            destinationSelect.add(new Option(h.name, id));
        });
        if(curO) originSelect.value = curO; if(curD) destinationSelect.value = curD;
    }
    populate();

    function findMaritimePath(start, end, redSeaRisk) {
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
                if (redSeaRisk && (neighbor === "red_sea_1" || neighbor === "bab_el_mandeb" || neighbor === "suez_s")) return;

                let d = getDist(seaNodes[closest], seaNodes[neighbor]);
                let alt = distances[closest] + d;
                if (alt < distances[neighbor]) { distances[neighbor] = alt; previous[neighbor] = closest; }
            });
        }
        let path = []; let curr = end;
        while (curr) { path.unshift(seaNodes[curr]); curr = previous[curr]; }
        return path;
    }

    function solveRoute(oId, dId, mode, sandbox) {
        const o = hubs[oId], d = hubs[dId];
        let rawPath = [o.coords];
        if (mode === 'sea') {
            rawPath = rawPath.concat(findMaritimePath(o.exit, d.exit, document.getElementById('risk-redsea').checked));
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
        const eta = new Date(document.getElementById('departure-date').value || new Date());
        eta.setDate(eta.getDate() + totalD);
        return { totalD, eta, path: finalPath, dist, risks: document.getElementById('risk-redsea').checked && mode === 'sea' ? ["riskMsgSuez"] : [] };
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
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                    <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                    <p class="text-4xl font-black text-indigo-900">${Math.round(route.totalD)} <span class="text-sm font-bold text-gray-400">${t.unitDays}</span></p>
                    <p class="text-[10px] font-bold text-indigo-500 mt-1">${t.eta}: ${route.eta.toLocaleDateString()}</p>
                </div>
                <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                    <p class="text-[10px] font-extrabold text-red-500 uppercase tracking-widest mb-1">${t.totalDist}</p>
                    <p class="text-4xl font-black text-gray-900">${Math.round(route.dist * 0.539957).toLocaleString()} <span class="text-sm font-bold text-gray-400">${t.unitNM}</span></p>
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
