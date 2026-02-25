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
            disclaimerSpeed: "• Estimated lead times based on avg. speeds.",
            disclaimerLabel: "• Disclaimer:",
            disclaimerText: "Arrival dates may vary due to congestion.",
            disclaimerCost: "• Cost estimates are for reference only.",
            btnShare: "Copy Share URL",
            shareSuccess: "URL copied to clipboard!",
            newsTitle: "Latest SCM Intelligence & News",
            hscodeGeneral: "General Cargo",
            hscodeElec: "Electronics",
            hscodeChem: "Chemical/Hazmat",
            hscodeFood: "Perishables"
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
            disclaimerSpeed: "• 예상 소요 시간은 평균 속력을 기준으로 합니다.",
            disclaimerLabel: "• 면책 공지:",
            disclaimerText: "도착 예정일은 항만 혼잡도에 따라 변동될 수 있습니다.",
            disclaimerCost: "• 비용 분석은 참조용이며 실제와 다를 수 있습니다.",
            btnShare: "공유 URL 복사",
            shareSuccess: "URL이 클립보드에 복사되었습니다!",
            newsTitle: "최신 SCM 물류 인텔리전스 & 뉴스",
            hscodeGeneral: "일반 화물",
            hscodeElec: "전자제품",
            hscodeChem: "화학/위험물",
            hscodeFood: "신선식품"
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { USD: 1, KRW: 1350, EUR: 0.92 };
    const symbols = { USD: "$", KRW: "₩", EUR: "€" };

    // Maritime Navigation Graph Nodes
    const seaNodes = {
        "pusan_gate": [35.0, 129.1], "geoje_s": [34.6, 128.8], "jeju_s": [32.5, 126.5], "incheon_gate": [37.2, 126.1], "yellow_sea_mid": [35.5, 124.5],
        "shanghai_gate": [31.2, 122.5], "shanghai_outer": [30.5, 123.5], "tokyo_gate": [35.5, 140.0], "luzon_strait": [20.0, 121.5],
        "singapore_gate": [1.2, 103.8], "malacca_west": [5.2, 97.5], "andaman_sea": [6.5, 94.0], "srilanka_s": [5.5, 80.5],
        "bab_el_mandeb": [12.6, 43.3], "red_sea_mid": [21.0, 38.0], "suez_s": [29.8, 32.6], "suez_n": [31.3, 32.3],
        "med_mid": [34.5, 18.0], "gibraltar": [35.9, -5.8], "portugal_w": [39.0, -11.0], "english_channel": [49.8, -3.5],
        "rotterdam_exit": [52.0, 3.8], "hamburg_exit": [54.0, 8.2], "good_hope": [-36.0, 20.0], "west_africa": [0.0, -12.0],
        "nyc_gate": [40.2, -73.5], "florida_s": [24.2, -81.0], "panama_e": [9.5, -79.8], "panama_w": [8.8, -79.6],
        "lax_gate": [33.5, -118.5], "pacific_mid_w": [30.0, 175.0], "pacific_mid_e": [30.0, -175.0], "sydney_gate": [-33.9, 151.5]
    };

    const seaEdges = [
        ["incheon_gate", "yellow_sea_mid"], ["pusan_gate", "geoje_s"], ["geoje_s", "jeju_s"], ["yellow_sea_mid", "jeju_s"], ["jeju_s", "shanghai_gate"], ["shanghai_gate", "shanghai_outer"],
        ["shanghai_outer", "luzon_strait"], ["tokyo_gate", "luzon_strait"], ["luzon_strait", "singapore_gate"], ["singapore_gate", "malacca_west"], ["malacca_west", "andaman_sea"], ["andaman_sea", "srilanka_s"],
        ["srilanka_s", "bab_el_mandeb"], ["bab_el_mandeb", "red_sea_mid"], ["red_sea_mid", "suez_s"], ["suez_s", "suez_n"], ["suez_n", "med_mid"], ["med_mid", "gibraltar"], ["gibraltar", "portugal_w"], ["portugal_w", "english_channel"], ["english_channel", "rotterdam_exit"], ["rotterdam_exit", "hamburg_exit"],
        ["srilanka_s", "good_hope"], ["good_hope", "west_africa"], ["west_africa", "portugal_w"], ["portugal_w", "nyc_gate"], ["nyc_gate", "florida_s"], ["florida_s", "panama_e"], ["panama_e", "panama_w"], ["panama_w", "lax_gate"],
        ["tokyo_gate", "pacific_mid_w"], ["pacific_mid_w", "pacific_mid_e"], ["pacific_mid_e", "lax_gate"], ["singapore_gate", "sydney_gate"]
    ];

    // Port Congestion Data (Critical Weights)
    const portWeights = {
        "kor-pus": { name: "Busan", coords: [35.10, 129.04], exit: "pusan_gate", country: "South Korea", congestion: 1.1 },
        "chn-sha": { name: "Shanghai", coords: [31.23, 121.47], exit: "shanghai_gate", country: "China", congestion: 1.4 },
        "sgp-sin": { name: "Singapore", coords: [1.26, 103.83], exit: "singapore_gate", country: "Singapore", congestion: 1.2 },
        "nld-rot": { name: "Rotterdam", coords: [51.92, 4.47], exit: "rotterdam_exit", country: "Netherlands", congestion: 1.3 },
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

    function populate() {
        const curO = originSelect.value, curD = destinationSelect.value;
        originSelect.innerHTML = ''; destinationSelect.innerHTML = '';
        Object.entries(portWeights).sort((a,b)=>a[1].name.localeCompare(b[1].name)).forEach(([id,h]) => {
            originSelect.add(new Option(`${h.name}, ${h.country}`, id));
            destinationSelect.add(new Option(`${h.name}, ${h.country}`, id));
        });
        if(curO && portWeights[curO]) originSelect.value = curO;
        if(curD && portWeights[curD]) destinationSelect.value = curD;
    }
    populate();

    function findPath(start, end, blockNodes) {
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
                if (!nodes.has(neighbor) || blockNodes.includes(neighbor)) return;
                let d = getDist(seaNodes[closest], seaNodes[neighbor]);
                let alt = distances[closest] + d;
                if (alt < distances[neighbor]) { distances[neighbor] = alt; previous[neighbor] = closest; }
            });
        }
        let p = []; let curr = end;
        while (curr) { p.unshift(seaNodes[curr]); curr = previous[curr]; }
        return p;
    }

    function solveRoute(oId, dId, mode, hscode, sandbox) {
        const o = portWeights[oId], d = portWeights[dId];
        let rawPath = [o.coords];
        const isRedSea = sandbox.redSea;
        
        if (mode === 'sea') {
            const block = isRedSea ? ["bab_el_mandeb", "red_sea_mid"] : [];
            const maritimePath = findPath(o.exit, d.exit, block);
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
        
        const transitDays = (dist / (16 * 1.852 * 24));
        const customsDays = hsCodeDelays[hscode] || 1;
        const handlingDays = (o.congestion + d.congestion) * 2;
        const totalD = transitDays + customsDays + handlingDays;

        let costUSD = (mode === 'sea' ? 1200 + (dist * 0.15) : 500 + (dist * 1.25)) + (isRedSea ? 800 : 0);

        const eta = new Date(document.getElementById('departure-date').value || new Date());
        eta.setDate(eta.getDate() + totalD);

        return { totalD, eta, path: finalPath, dist, costUSD, breakdown: { transitDays, customsDays, handlingDays } };
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
        const route = solveRoute(oId, dId, modeSelect.value, hscodeSelect.value, {
            redSea: document.getElementById('risk-redsea').checked
        });
        
        const costConverted = route.costUSD * rates[currentCurrency];
        const feedContainer = document.getElementById('feed-container');
        
        const pTransit = (route.breakdown.transitDays / route.totalD) * 100;
        const pCustoms = (route.breakdown.customsDays / route.totalD) * 100;
        const pHandling = (route.breakdown.handlingDays / route.totalD) * 100;

        feedContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in mb-8">
                <div class="p-8 bg-indigo-50 rounded-3xl shadow-lg border border-indigo-100 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
                    <p class="text-xs font-black text-indigo-600 uppercase tracking-widest mb-3">${t.totalLead}</p>
                    <p class="text-5xl font-black text-indigo-900 mb-2">${Math.round(route.totalD)} <span class="text-lg font-bold text-indigo-400">${t.unitDays}</span></p>
                    <p class="text-xs font-bold text-indigo-500 mt-2 bg-white/50 py-1 px-3 rounded-full inline-block border border-indigo-200">${t.eta}: ${route.eta.toLocaleDateString()}</p>
                </div>
                <div class="p-8 bg-green-50 rounded-3xl shadow-lg border border-green-100 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>
                    <p class="text-xs font-black text-green-600 uppercase tracking-widest mb-3">${t.labelCost}</p>
                    <p class="text-5xl font-black text-gray-900 mb-2"><span class="text-3xl text-gray-400 mr-1">${symbols[currentCurrency]}</span>${Math.round(costConverted).toLocaleString()}</p>
                    <p class="text-xs font-bold text-gray-500 mt-2 uppercase">${t.marketRateLabel}</p>
                </div>
                <div class="p-8 bg-orange-50 rounded-3xl shadow-lg border border-orange-100 text-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>
                    <p class="text-xs font-black text-orange-600 uppercase tracking-widest mb-3">${t.totalDist}</p>
                    <p class="text-5xl font-black text-gray-900 mb-2">${Math.round(route.dist * 0.539957).toLocaleString()} <span class="text-lg font-bold text-orange-400">${t.unitNM}</span></p>
                    <p class="text-xs font-bold text-gray-500 mt-2">${t.approx} ${Math.round(route.dist).toLocaleString()} KM</p>
                </div>
            </div>

            <div class="bg-gray-50 p-6 rounded-3xl border border-gray-200 mb-8">
                <h4 class="text-sm font-black text-gray-700 uppercase tracking-widest mb-4 flex justify-between">
                    <span>Timeline Breakdown</span>
                    <span class="text-indigo-600 font-bold">${Math.round(route.totalD)} Days Total</span>
                </h4>
                <div class="h-12 w-full bg-gray-200 rounded-2xl flex overflow-hidden shadow-inner">
                    <div class="h-full bg-indigo-500 flex items-center justify-center text-[10px] text-white font-bold" style="width: ${pTransit}%">Transit</div>
                    <div class="h-full bg-blue-400 flex items-center justify-center text-[10px] text-white font-bold" style="width: ${pCustoms}%">Customs</div>
                    <div class="h-full bg-green-400 flex items-center justify-center text-[10px] text-white font-bold" style="width: ${pHandling}%">Handling</div>
                </div>
                <div class="flex justify-between mt-3 text-[10px] font-bold text-gray-400">
                    <div><span class="w-2 h-2 bg-indigo-500 rounded-full inline-block"></span> ${Math.round(route.breakdown.transitDays)}d Transit</div>
                    <div><span class="w-2 h-2 bg-blue-400 rounded-full inline-block"></span> ${Math.round(route.breakdown.customsDays)}d Customs</div>
                    <div><span class="w-2 h-2 bg-green-400 rounded-full inline-block"></span> ${Math.round(route.breakdown.handlingDays)}d Handling</div>
                </div>
            </div>
        `;
        renderMap(route.path);
        document.getElementById('executive-actions').classList.remove('hidden');
    }

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    
    ['usd', 'krw', 'eur'].forEach(curr => {
        document.getElementById(`curr-${curr}`).onclick = (e) => {
            currentCurrency = curr.toUpperCase();
            document.querySelectorAll('[id^="curr-"]').forEach(btn => btn.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'));
            e.target.classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
            if(document.getElementById('feed-container').innerHTML.includes('grid')) calculateAndDisplay();
        };
    });

    document.getElementById('lang-ko').onclick = () => { currentLang='ko'; updateUI(); };
    document.getElementById('lang-en').onclick = () => { currentLang='en'; updateUI(); };
    
    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n'); if(translations[currentLang][k]) el.textContent = translations[currentLang][k];
        });
        if(document.getElementById('feed-container').innerHTML.includes('grid')) calculateAndDisplay();
        populate();
    }

    document.getElementById('btn-share').onclick = () => {
        const params = {o: originSelect.value, d: destinationSelect.value, m: modeSelect.value, h: hscodeSelect.value};
        const url = `${window.location.origin}${window.location.pathname}?data=${btoa(JSON.stringify(params))}`;
        navigator.clipboard.writeText(url).then(() => alert(translations[currentLang].shareSuccess));
    };

    updateUI();
});
