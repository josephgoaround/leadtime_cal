document.addEventListener('DOMContentLoaded', () => {
    // i18n Dictionary
    const translations = {
        en: {
            subtitle: "Global Logistics & Customs AI Pathfinder",
            formTitle: "Shipment Config",
            labelMode: "Transport Mode",
            labelDate: "Departure Date",
            labelService: "Service Level",
            labelOrigin: "Departure",
            labelDest: "Arrival",
            btnAnalyze: "RUN INTELLIGENCE ANALYSIS",
            tabOverview: "Overview",
            tabFinance: "Financials",
            tabRisk: "Risk & ESG",
            totalLead: "Total Lead Time",
            reliability: "Network Health",
            eta: "Estimated ETA",
            freightCost: "Freight Cost",
            inventoryCost: "ICC (Capital Cost)",
            totalImpact: "Total Landed Spend",
            journeyLog: "Journey Milestones",
            aiRec: "AI Strategic Recommendation",
            esgOffset: "Sustainability Impact",
            carbonTax: "Est. Carbon Tax (Future)",
            treesMsg: "trees to offset this shipment",
            volatility: "Lane Reliability Score",
            recentTitle: "Recent Analyses",
            shareBtn: "Share Link",
            copySummary: "Copy Summary",
            exportCsv: "Export CSV",
            compChart: "Cost-Time Efficiency (Sea vs Air)",
            disclaimer: "• 16kts avg. speed. Data reflects real-time global stress."
        },
        ko: {
            subtitle: "글로벌 물류 및 통관 AI 경로 분석기",
            formTitle: "운송 설정",
            labelMode: "운송 수단",
            labelDate: "출발 예정일",
            labelService: "서비스 등급",
            labelCargo: "화물 종류",
            labelOrigin: "출발지",
            labelDest: "도착지",
            btnAnalyze: "물류 분석 실행",
            tabOverview: "종합 요약",
            tabFinance: "비용 분석",
            tabRisk: "리스크/ESG",
            totalLead: "총 리드타임",
            reliability: "네트워크 건전성",
            eta: "최종 도착 예정일",
            freightCost: "운송 비용",
            inventoryCost: "재고 금융 비용",
            totalImpact: "총 수입 원가 합계",
            journeyLog: "여정 주요 마일스톤",
            aiRec: "AI 전략적 솔루션 제언",
            esgOffset: "지속가능성 영향",
            carbonTax: "예상 탄소세 (미래)",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "노선 정시 신뢰도 점수",
            recentTitle: "최근 분석 기록",
            shareBtn: "링크 공유",
            copySummary: "요약 복사",
            exportCsv: "CSV 내보내기",
            compChart: "비용-시간 효율성 (해상 vs 항공)",
            disclaimer: "• 16노트 평균속도 기준. 전 세계 물류 부하 지수를 반영합니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    const portCities = {
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea", duty: 0.10, status: "green" },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China", duty: 0.15, status: "red" },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore", duty: 0.07, status: "yellow" },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands", duty: 0.12, status: "yellow" },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", duty: 0.05, status: "red" }
    };

    const airportCities = {
        "ICN (Incheon)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", duty: 0.10, status: "green" },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", country: "Germany", duty: 0.12, status: "yellow" },
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA", duty: 0.05, status: "yellow" }
    };

    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453] },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407] },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833] },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398] },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450] },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764] },
        "deu-fra": { name: "Frankfurt Air", coords: [50.0379, 8.5622] },
        "usa-jfk": { name: "John F. Kennedy", coords: [40.6413, -73.7781] }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "good_hope": [-34.35, 18.47], "suez": [29.9, 32.5] };

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const serviceTier = document.getElementById('service-tier');
    const resultContainer = document.getElementById('result');
    const executiveActions = document.getElementById('executive-actions');

    dateInput.valueAsDate = new Date();

    function populate() {
        const mode = modeSelect.value;
        const cities = mode === 'sea' ? portCities : airportCities;
        originSelect.innerHTML = ''; destinationSelect.innerHTML = '';
        Object.keys(cities).sort().forEach(c => {
            originSelect.add(new Option(c, c)); destinationSelect.add(new Option(c, c));
        });
    }

    modeSelect.onchange = populate;
    populate();

    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);

    function calculateAndDisplay() {
        const mode = modeSelect.value;
        const weight = parseFloat(document.getElementById('cargo-weight').value) || 1;
        const value = parseFloat(document.getElementById('cargo-value').value) || 50000;
        const tier = serviceTier.value;
        const originName = originSelect.value;
        const destName = destinationSelect.value;
        const departureDate = new Date(dateInput.value);

        if (originName === destName || !originName || !destName) return;

        const sandbox = {
            redSea: document.getElementById('risk-redsea').checked,
            panama: document.getElementById('risk-panama').checked
        };

        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originName]; const dest = cityData[destName];
        const oHub = hubs[origin.hub]; const dHub = hubs[dest.hub];

        let risks = [];
        let path = [oHub.coords];
        
        // Waypoint Logic
        if (mode === 'sea') {
            if (sandbox.redSea) { path.push(waypoints.good_hope); risks.push("Red Sea Conflict"); }
            else if (dist(oHub.coords, dHub.coords) > 10000) path.push(waypoints.suez);
        }
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const totalDistance = mDist + dist(origin.coords, oHub.coords) + dist(dHub.coords, dest.coords);

        const speeds = { sea: 711, air: 20000, truck: 500 };
        let transitD = mDist / speeds[mode];
        let handlingD = (mode==='sea' ? 5 : 2);
        if (tier === 'premium') handlingD *= 0.6;
        if (risks.includes("Red Sea Conflict")) transitD += 12;

        const totalD = transitD + (dist(origin.coords, oHub.coords)+dist(dHub.coords, dest.coords))/500 + handlingD + 2;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        // --- Side-by-Side Mode Comparison Calculation ---
        const altMode = mode === 'sea' ? 'air' : 'sea';
        const altTransitD = mDist / speeds[altMode];
        const altTotalD = altTransitD + (dist(origin.coords, oHub.coords)+dist(dHub.coords, dest.coords))/500 + (altMode==='sea'?5:2) + 2;
        const baseFreight = totalDistance * (mode==='sea'?0.15:4.5) * weight;
        const altFreight = totalDistance * (altMode==='sea'?0.15:4.5) * weight;
        const iccCurrent = (value * annualICC / 365) * totalD;
        const iccAlt = (value * annualICC / 365) * altTotalD;
        const landedCurrent = baseFreight + iccCurrent + (value * (dest.duty || 0.1));
        const landedAlt = altFreight + iccAlt + (value * (dest.duty || 0.1));

        let recommendation = "";
        if (mode === 'sea' && (iccCurrent - iccAlt) > (altFreight - baseFreight)) {
            recommendation = currentLang==='ko' ? "고가치 화물: 항공 전환 시 재고 비용 절감이 운임 차액보다 큽니다. 항공 운송을 적극 권장합니다." : "High-value detection: Switching to AIR saves more in capital costs than the freight premium. Recommend Mode Switch.";
        }

        const t = translations[currentLang];
        const convert = (val) => `${currentCurrency==='KRW'?'₩':'$'}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;
        const reliability = Math.max(25, 98 - (risks.length * 20));

        resultContainer.innerHTML = `
            <div class="space-y-4 animate-fade-in">
                <div class="flex bg-gray-100 p-1 rounded-xl">
                    <button onclick="switchTab('overview')" id="tab-overview" class="flex-1 py-2 text-[9px] font-bold rounded-lg bg-white shadow-sm text-indigo-600">${t.tabOverview}</button>
                    <button onclick="switchTab('finance')" id="tab-finance" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabFinance}</button>
                    <button onclick="switchTab('risk')" id="tab-risk" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabRisk}</button>
                </div>

                <div id="tab-content-overview" class="tab-pane space-y-4">
                    <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-1 h-full ${mode==='sea'?'bg-blue-500':'bg-indigo-600'}"></div>
                        <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                        <p class="text-5xl font-black text-indigo-900">${Math.round(totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${eta.toLocaleDateString()}</p>
                    </div>
                    ${recommendation ? `<div class="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl shadow-sm"><p class="text-[10px] font-bold text-indigo-600 uppercase mb-1">${t.aiRec}</p><p class="text-xs font-semibold text-gray-700 leading-relaxed">${recommendation}</p></div>` : ''}
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${t.reliability}</p><p class="text-2xl font-black ${reliability > 80 ? 'text-green-500' : 'text-red-500'}">${reliability}%</p></div>
                        <div class="text-right"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Efficiency</p><p class="text-sm font-bold text-gray-700">${tier.toUpperCase()}</p></div>
                    </div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${t.compChart}</p>
                        <div class="flex items-end gap-4 h-32">
                            <div class="flex-1 flex flex-col items-center gap-2">
                                <div class="w-full bg-indigo-600 rounded-t-lg relative group transition-all hover:opacity-80" style="height: ${(landedCurrent/Math.max(landedCurrent, landedAlt))*100}%">
                                    <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-indigo-600">${convert(landedCurrent)}</span>
                                </div>
                                <span class="text-[9px] font-black text-gray-500 uppercase">${mode.toUpperCase()} (Now)</span>
                            </div>
                            <div class="flex-1 flex flex-col items-center gap-2">
                                <div class="w-full bg-gray-300 rounded-t-lg relative group transition-all hover:opacity-80" style="height: ${(landedAlt/Math.max(landedCurrent, landedAlt))*100}%">
                                    <span class="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400">${convert(landedAlt)}</span>
                                </div>
                                <span class="text-[9px] font-black text-gray-400 uppercase">${altMode.toUpperCase()} (Alt)</span>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                            <div class="text-center"><p class="text-[9px] font-bold text-gray-400 uppercase">Current Transit</p><p class="text-sm font-bold text-gray-700">${Math.round(totalD)} Days</p></div>
                            <div class="text-center"><p class="text-[9px] font-bold text-gray-400 uppercase">Alt Transit</p><p class="text-sm font-bold text-indigo-500">${Math.round(altTotalD)} Days</p></div>
                        </div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${Math.ceil((totalDistance * (mode==='sea'?25:500) * weight / 1000) / 22)}</span><p class="text-[10px] text-indigo-100 pb-1">${t.treesMsg}</p></div>
                    </div>
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        updateIntelligence(origin, dest, risks, reliability);
        renderMap(path, origin, dest, oHub, dHub, originName, destName);
        
        window.currentAnalysis = { originName, destName, mode, totalD, eta, convert, landedCurrent, reliability, risks };
    }

    window.copyExecutiveSummary = () => {
        const a = window.currentAnalysis; if (!a) return;
        const text = `[LOGISTICS STRATEGIC SUMMARY]\n\nRoute: ${a.originName} to ${a.destName}\nMode: ${a.mode.toUpperCase()}\nLead Time: ${Math.round(a.totalD)} Days\nLanded Cost: ${a.convert(a.landedCurrent)}\nReliability: ${a.reliability}%\n\nStrategic Insight: ${a.risks.length > 0 ? 'Risk alert active for ' + a.risks.join(', ') : 'Network remains stable.'}`;
        navigator.clipboard.writeText(text); alert("Summary Copied!");
    };

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function updateIntelligence(o, d, risks, rel) {
        const badge = document.getElementById('network-status-badge');
        badge.classList.remove('hidden');
        const alert = rel < 80;
        badge.querySelector('span:last-child').innerText = alert ? "Elevated Alert" : "Network Stable";
        badge.querySelector('span:first-child span:last-child').className = `relative inline-flex rounded-full h-2 w-2 ${alert?'bg-red-500':'bg-green-500'}`;
        
        const feed = document.getElementById('feed-container');
        feed.innerHTML = (alert ? `<div class="p-4 bg-red-50 rounded-xl border-l-4 border-red-500 text-sm font-medium text-red-700">Notice: Lane reliability dropped to ${rel}%. Major bottleneck at Suez/Panama observed.</div>` : '') + `<div class="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-sm text-gray-700 font-medium">Standard regional monitoring active for ${d.country}. Clearance speeds optimal.</div>`;
    }

    function renderMap(path, o, d, oH, dH, oN, dN) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
        const dot = (color) => L.divIcon({ html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md bg-${color}-500"></div>`, className: 'custom-div-icon', iconSize: [16, 16] });
        L.marker(o.coords, {icon: dot('green')}).addTo(map).bindPopup(oN);
        L.marker(d.coords, {icon: dot('green')}).addTo(map).bindPopup(dN);
        L.polyline(path, {color: '#4f46e5', weight: 5, className: 'leaflet-ant-path'}).addTo(map);
        map.fitBounds([o.coords, d.coords], {padding: [50, 50]});
    }

    function dist(c1, c2) {
        const R = 6371; const dLat = (c2[0]-c1[0])*Math.PI/180; const dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    document.getElementById('lang-ko').onclick = () => { currentLang='ko'; updateUI(); };
    document.getElementById('lang-en').onclick = () => { currentLang='en'; updateUI(); };
    
    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n'); if(translations[currentLang][k]) el.textContent = translations[currentLang][k];
        });
    }
    updateUI();
});
