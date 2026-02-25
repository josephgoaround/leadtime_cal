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

    // 정밀 해상 노드 (내륙 침범 방지용 좌표망)
    const seaNodes = {
        // Korea & NE Asia
        "pusan_exit": [34.0, 130.0], "incheon_exit": [37.0, 124.0], "shanghai_exit": [31.0, 123.0],
        "jeju_s": [32.5, 127.0], "tokyo_exit": [34.5, 140.5], "taipei_exit": [25.5, 122.5],
        // SE Asia
        "luzon_strait": [20.0, 121.0], "hongkong_exit": [21.5, 114.5], "vietnam_s": [8.5, 107.0],
        "singapore": [1.2, 104.0], "malacca_w": [6.0, 95.0], "indonesia_s": [-10.0, 115.0],
        // Indian Ocean
        "srilanka": [5.0, 80.0], "mumbai_exit": [18.5, 72.0], "dubai_exit": [25.5, 56.0],
        "bab_el_mandeb": [12.5, 43.5], "red_sea_mid": [20.0, 38.5], "suez": [29.9, 32.5],
        // Europe & Africa
        "med_mid": [34.0, 20.0], "gibraltar": [36.0, -5.5], "portugal_w": [40.0, -11.0],
        "finisterre": [44.0, -10.0], "english_channel": [50.0, -2.0], "rotterdam_exit": [52.5, 4.0],
        "hamburg_exit": [54.5, 8.5], "good_hope": [-35.5, 20.0], "west_africa": [0.0, -15.0],
        // Americas
        "nyc_exit": [40.5, -73.0], "florida": [24.5, -81.0], "panama_e": [9.5, -79.5],
        "panama_w": [8.5, -79.6], "mexico_w": [18.0, -106.0], "lax_exit": [33.5, -119.0],
        "vancouver_exit": [48.5, -126.0], "brazil_ne": [-5.0, -34.0], "santos_exit": [-24.5, -45.5],
        // Pacific Waypoints
        "pacific_mid": [30.0, 175.0], "pacific_east": [35.0, -140.0], "sydney_exit": [-34.0, 152.0]
    };

    // 해상 전용 연결망 (육지를 가로지르는 연결 없음)
    const seaEdges = [
        ["incheon_exit", "jeju_s"], ["pusan_exit", "jeju_s"], ["jeju_s", "shanghai_exit"],
        ["jeju_s", "tokyo_exit"], ["shanghai_exit", "taipei_exit"], ["taipei_exit", "luzon_strait"],
        ["taipei_exit", "hongkong_exit"], ["hongkong_exit", "vietnam_s"], ["vietnam_s", "singapore"],
        ["luzon_strait", "singapore"], ["singapore", "malacca_w"], ["malacca_w", "srilanka"],
        ["srilanka", "mumbai_exit"], ["srilanka", "dubai_exit"], ["dubai_exit", "bab_el_mandeb"],
        ["bab_el_mandeb", "red_sea_mid"], ["red_sea_mid", "suez"], ["suez", "med_mid"],
        ["med_mid", "gibraltar"], ["gibraltar", "portugal_w"], ["portugal_w", "finisterre"],
        ["finisterre", "english_channel"], ["english_channel", "rotterdam_exit"], ["rotterdam_exit", "hamburg_exit"],
        ["srilanka", "good_hope"], ["good_hope", "west_africa"], ["west_africa", "portugal_w"],
        ["portugal_w", "nyc_exit"], ["nyc_exit", "florida"], ["florida", "panama_e"],
        ["panama_e", "panama_w"], ["panama_w", "mexico_w"], ["mexico_w", "lax_exit"],
        ["lax_exit", "vancouver_exit"], ["tokyo_exit", "pacific_mid"], ["pacific_mid", "pacific_east"],
        ["pacific_east", "lax_exit"], ["singapore", "indonesia_s"], ["indonesia_s", "sydney_exit"],
        ["pacific_mid", "sydney_exit"], ["west_africa", "brazil_ne"], ["brazil_ne", "santos_exit"]
    ];

    const hubs = {
        "kor-pus": { name: "Busan", coords: [35.10, 129.04], exit: "pusan_exit" },
        "kor-icn": { name: "Incheon", coords: [37.46, 126.44], exit: "incheon_exit" },
        "chn-sha": { name: "Shanghai", coords: [31.23, 121.47], exit: "shanghai_exit" },
        "jpn-tyo": { name: "Tokyo", coords: [35.67, 139.65], exit: "tokyo_exit" },
        "sgp-sin": { name: "Singapore", coords: [1.26, 103.83], exit: "singapore" },
        "nld-rot": { name: "Rotterdam", coords: [51.92, 4.47], exit: "rotterdam_exit" },
        "deu-ham": { name: "Hamburg", coords: [53.55, 9.99], exit: "hamburg_exit" },
        "usa-lax": { name: "Los Angeles", coords: [33.75, -118.27], exit: "lax_exit" },
        "usa-nyc": { name: "New York", coords: [40.71, -74.00], exit: "nyc_exit" },
        "aus-syd": { name: "Sydney", coords: [-33.86, 151.20], exit: "sydney_exit" }
    };

    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const resultContainer = document.getElementById('result');

    function populate() {
        const mode = modeSelect.value;
        const curO = originSelect.value, curD = destinationSelect.value;
        originSelect.innerHTML = ''; destinationSelect.innerHTML = '';
        Object.entries(hubs).sort((a,b)=>a[1].name.localeCompare(b[1].name)).forEach(([id,h]) => {
            const label = `${h.name}, ${h.country || ''}`;
            originSelect.add(new Option(label, id));
            destinationSelect.add(new Option(label, id));
        });
        if(curO) originSelect.value = curO; if(curD) destinationSelect.value = curD;
    }
    populate();

    // 다익스트라(Dijkstra) 기반 최단 해상 경로 탐색
    function findMaritimePath(start, end, redSeaRisk) {
        let distances = {};
        let previous = {};
        let nodes = new Set();

        Object.keys(seaNodes).forEach(node => {
            distances[node] = Infinity;
            nodes.add(node);
        });
        distances[start] = 0;

        while (nodes.size > 0) {
            let closest = Array.from(nodes).reduce((minNode, node) => 
                distances[node] < distances[minNode] ? node : minNode
            );

            if (closest === end || distances[closest] === Infinity) break;
            nodes.delete(closest);

            seaEdges.forEach(([u, v]) => {
                if (u !== closest && v !== closest) return;
                let neighbor = u === closest ? v : u;
                if (!nodes.has(neighbor)) return;

                // 리스크 구간 차단
                if (redSeaRisk && (neighbor === "red_sea_mid" || neighbor === "bab_el_mandeb")) return;

                let d = getDist(seaNodes[closest], seaNodes[neighbor]);
                let alt = distances[closest] + d;
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    previous[neighbor] = closest;
                }
            });
        }

        let path = [];
        let curr = end;
        while (curr) {
            path.unshift(seaNodes[curr]);
            curr = previous[curr];
        }
        return path;
    }

    function solveRoute(oId, dId, mode, sandbox) {
        const o = hubs[oId], d = hubs[dId];
        let rawPath = [o.coords];
        
        if (mode === 'sea') {
            const maritimePath = findMaritimePath(o.exit, d.exit, sandbox.redSea);
            rawPath = rawPath.concat(maritimePath);
        }
        rawPath.push(d.coords);

        // Antimeridian 보정 (그리기용)
        let finalPath = [rawPath[0]];
        for (let i = 1; i < rawPath.length; i++) {
            let prev = finalPath[i - 1], cur = [...rawPath[i]];
            let diff = cur[1] - prev[1];
            if (diff > 180) cur[1] -= 360;
            else if (diff < -180) cur[1] += 360;
            finalPath.push(cur);
        }

        let dist = 0;
        for (let i = 0; i < finalPath.length - 1; i++) dist += getDist(finalPath[i], finalPath[i+1]);
        
        const speed = mode === 'sea' ? 16 : 850;
        const totalD = (dist / (speed * 1.852 * 24)) + (mode === 'sea' ? 7 : 2);
        const eta = new Date(document.getElementById('departure-date').value || new Date());
        eta.setDate(eta.getDate() + totalD);

        return { totalD, eta, path: finalPath, dist, risks: sandbox.redSea && mode === 'sea' ? ["riskMsgSuez"] : [] };
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
        const route = solveRoute(oId, dId, modeSelect.value, {
            redSea: document.getElementById('risk-redsea').checked
        });
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
