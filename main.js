document.addEventListener('DOMContentLoaded', () => {
    // i18n Dictionary
    const translations = {
        en: {
            subtitle: "Global Logistics & Customs AI Pathfinder",
            formTitle: "Shipment Config",
            labelMode: "Transport Mode",
            labelDate: "Departure Date",
            labelService: "Service Level",
            labelCargo: "Cargo Category",
            labelOrigin: "Departure",
            labelDest: "Arrival",
            btnAnalyze: "RUN INTELLIGENCE ANALYSIS",
            tabOverview: "Overview",
            tabFinance: "Financials",
            tabRisk: "Risk & ESG",
            tabCustoms: "Customs",
            totalLead: "Total Lead Time",
            reliability: "Network Health",
            eta: "Estimated ETA",
            freightCost: "Freight Cost",
            inventoryCost: "ICC (Capital Cost)",
            dutyTax: "Est. Duty & Taxes",
            totalImpact: "Total Logistics Spend",
            journeyLog: "Journey Milestones",
            aiRec: "Strategic Recommendation",
            esgOffset: "Sustainability Impact",
            treesMsg: "trees to offset this shipment",
            volatility: "12-Month Volatility Index",
            recentTitle: "Recent Analyses",
            shareBtn: "Copy Link",
            exportCsv: "Export CSV",
            comparisonTitle: "Mode Efficiency Comparison",
            costLabel: "Cost",
            timeLabel: "Time",
            transshipMsg: "Transshipment via",
            disclaimer: "• 16kts avg. speed. Data points are high-level simulations."
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
            tabCustoms: "통관 정보",
            totalLead: "총 리드타임",
            reliability: "네트워크 건전성",
            eta: "최종 도착 예정일",
            freightCost: "운송 비용",
            inventoryCost: "재고 금융 비용",
            dutyTax: "예상 관세 및 부가세",
            totalImpact: "총 물류 비용 합계",
            journeyLog: "여정 주요 마일스톤",
            aiRec: "전략적 솔루션 제언",
            esgOffset: "지속가능성 영향",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "12개월 변동 지수",
            recentTitle: "최근 분석 기록",
            shareBtn: "링크 복사",
            exportCsv: "CSV 저장",
            comparisonTitle: "운송 수단별 효율 비교",
            costLabel: "비용",
            timeLabel: "시간",
            transshipMsg: "주요 환적 거점:",
            disclaimer: "• 16노트 평균속도 기준. 모든 지표는 AI 추정치입니다."
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
        "Port of Hamburg": { coords: [53.5511, 9.9937], hub: "deu-ham", country: "Germany", duty: 0.12, status: "green" },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", duty: 0.05, status: "red" },
        "Port of New York": { coords: [40.7128, -74.0060], hub: "usa-nyc", country: "USA", duty: 0.05, status: "yellow" }
    };

    const airportCities = {
        "ICN (Incheon)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", duty: 0.10, status: "green" },
        "PVG (Shanghai)": { coords: [31.1443, 121.8083], hub: "chn-pvg", country: "China", duty: 0.15, status: "red" },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", country: "Germany", duty: 0.12, status: "yellow" },
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA", duty: 0.05, status: "yellow" }
    };

    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453] },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407] },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833] },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398] },
        "nld-rot": { name: "Rotterdam Hub", coords: [51.9490, 4.1450] },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764] },
        "deu-fra": { name: "Frankfurt Air", coords: [50.0379, 8.5622] }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "good_hope": [-34.35, 18.47], "suez": [29.9, 32.5], "panama": [9.1, -79.7] };

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const newsTicker = document.getElementById('news-ticker');
    const feedContainer = document.getElementById('feed-container');

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

    function getResultForMode(mode, oName, dName, w, v, sandbox) {
        const cityData = mode === 'sea' ? portCities : airportCities;
        const o = cityData[oName]; const d = cityData[dName];
        if(!o || !d) return null;
        const oH = hubs[o.hub]; const dH = hubs[d.hub];
        
        let path = [oH.coords];
        let risks = [];
        if (Math.abs(oH.coords[1]-dH.coords[1]) > 180) path.push(waypoints.pacific_mid);
        else if ((oH.coords[1]>60 && dH.coords[1]<20) || (oH.coords[1]<20 && dH.coords[1]>60)) {
            if (sandbox.redSea && mode==='sea') { path.push(waypoints.good_hope); risks.push("Red Sea Conflict"); }
            else if (mode==='sea') path.push(waypoints.suez);
        }
        path.push(dH.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const speeds = { sea: 711, air: 20000 };
        let transitD = mDist / speeds[mode] + (risks.includes("Red Sea Conflict") ? 12 : 0);
        const totalD = transitD + 4 + (d.country==="China"?4:0);
        const cost = totalDist(o, d, path) * (mode==='sea'?0.15:4.5) * w;
        return { totalD, cost, co2: Math.round((totalDist(o, d, path) * (mode==='sea'?25:500) * w)/1000) };
    }

    function totalDist(o, d, path) {
        let dVal = 0; for(let i=0; i<path.length-1; i++) dVal += dist(path[i], path[i+1]);
        return dVal + dist(o.coords, hubs[o.hub].coords) + dist(hubs[d.hub].coords, d.coords);
    }

    function calculateAndDisplay() {
        const mode = modeSelect.value;
        const weight = parseFloat(document.getElementById('cargo-weight').value) || 1;
        const value = parseFloat(document.getElementById('cargo-value').value) || 50000;
        const originName = originSelect.value;
        const destName = destinationSelect.value;
        const departureDate = new Date(dateInput.value);
        const sandbox = { redSea: document.getElementById('risk-redsea').checked, panama: document.getElementById('risk-panama').checked };

        if (originName === destName) return;

        const mainRes = getResultForMode(mode, originName, destName, weight, value, sandbox);
        const altMode = mode === 'sea' ? 'air' : 'sea';
        // Mock alt name for chart comparison
        const altRes = getResultForMode(altMode, (altMode==='air'?Object.keys(airportCities)[0]:Object.keys(portCities)[0]), (altMode==='air'?Object.keys(airportCities)[1]:Object.keys(portCities)[1]), weight, value, sandbox);

        const t = translations[currentLang];
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + mainRes.totalD);
        const convert = (val) => `${currentCurrency==='KRW'?'₩':'$'}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;

        document.getElementById('result').innerHTML = `
            <div class="space-y-4 animate-fade-in">
                <div class="flex bg-gray-100 p-1 rounded-xl">
                    <button onclick="switchTab('overview')" id="tab-overview" class="flex-1 py-2 text-[9px] font-bold rounded-lg bg-white shadow-sm text-indigo-600">${t.tabOverview}</button>
                    <button onclick="switchTab('finance')" id="tab-finance" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabFinance}</button>
                    <button onclick="switchTab('risk')" id="tab-risk" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabRisk}</button>
                </div>

                <div id="tab-content-overview" class="tab-pane space-y-4">
                    <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                        <p class="text-5xl font-black text-indigo-900">${Math.round(mainRes.totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${eta.toLocaleDateString()}</p>
                    </div>

                    <!-- Comparison Chart -->
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.comparisonTitle}</p>
                        <div class="space-y-4">
                            <div>
                                <div class="flex justify-between text-[9px] font-bold text-gray-500 mb-1 uppercase"><span>${t.costLabel}</span><span>${convert(mainRes.cost)} vs ${convert(altRes.cost)}</span></div>
                                <div class="h-2 w-full bg-gray-100 rounded-full flex overflow-hidden">
                                    <div style="width: 100%" class="bg-indigo-500"></div>
                                    <div style="width: ${(altRes.cost/mainRes.cost)*100}%" class="bg-gray-300"></div>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between text-[9px] font-bold text-gray-500 mb-1 uppercase"><span>${t.timeLabel}</span><span>${Math.round(mainRes.totalD)} vs ${Math.round(altRes.totalD)} Days</span></div>
                                <div class="h-2 w-full bg-gray-100 rounded-full flex overflow-hidden">
                                    <div style="width: 100%" class="bg-green-500"></div>
                                    <div style="width: ${(altRes.totalD/mainRes.totalD)*100}%" class="bg-gray-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                        <div class="flex justify-between text-xs"><span>Freight</span><span class="font-bold">${convert(mainRes.cost)}</span></div>
                        <div class="flex justify-between text-xs"><span>Finance ICC</span><span class="font-bold text-orange-500">${convert((value*annualICC/365)*mainRes.totalD)}</span></div>
                        <div class="border-t pt-3 flex justify-between font-black text-lg"><span>Total Spend</span><span>${convert(mainRes.cost + (value*annualICC/365)*mainRes.totalD)}</span></div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${Math.ceil(mainRes.co2/22)}</span><p class="text-[10px] pb-1">${t.treesMsg}</p></div>
                    </div>
                </div>
            </div>`;

        updateIntelligence(portCities[originName] || airportCities[originName], portCities[destName] || airportCities[destName], sandbox);
        renderMap(originName, destName, sandbox);
    }

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function updateIntelligence(o, d, sandbox) {
        networkBadge.classList.remove('hidden');
        const alert = (sandbox.redSea || sandbox.panama);
        networkBadge.querySelector('span:last-child').innerText = alert ? "Elevated Risk" : "Network Stable";
        networkBadge.querySelector('span:first-child span:last-child').className = `relative inline-flex rounded-full h-2 w-2 ${alert?'bg-red-500':'bg-green-500'}`;
        
        let ticker = `<span>Intelligence active for ${o.country} to ${d.country} corridor.</span>`;
        if (d.country === "South Korea") ticker += "<span>Busan terminal automation reducing gate-in times by 10%.</span>";
        newsTicker.innerHTML = ticker + "<span>Suez volumes stabilizing.</span><span>Global air cargo demand up 4% this month.</span>";
        
        feedContainer.innerHTML = `<div class="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-xs font-medium text-gray-700">Market Brief: Routes to ${d.country} are currently seeing ${alert?'significant volatility':'stable performance'}. Recommend ${o.duty > 0.1 ? 'early HTS validation' : 'standard booking'}.</div>`;
    }

    function renderMap(oName, dName, sandbox) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline || l instanceof L.Circle) map.removeLayer(l); });
        const cityData = modeSelect.value === 'sea' ? portCities : airportCities;
        const o = cityData[oName]; const d = cityData[dName];
        
        const pin = (color) => L.divIcon({ html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md marker-pin-${color}"></div>`, className: 'custom-div-icon', iconSize: [16, 16] });
        
        L.marker(o.coords, {icon: pin(o.status)}).addTo(map).bindPopup(oName);
        L.marker(d.coords, {icon: pin(d.status)}).addTo(map).bindPopup(dName);
        
        if(sandbox.redSea) L.circle([15, 40], { radius: 800000, color: 'red', fillOpacity: 0.1 }).addTo(map);
        
        const path = [o.coords, hubs[o.hub].coords, hubs[d.hub].coords, d.coords];
        L.polyline(path, {color: '#dc2626', weight: 4, opacity: 0.6}).addTo(map);
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
