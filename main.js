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
            totalLead: "Total Lead Time",
            reliability: "Network Health",
            eta: "Estimated ETA",
            freightCost: "Freight Cost",
            inventoryCost: "ICC (Capital Cost)",
            totalImpact: "Total Logistics Spend",
            journeyLog: "Journey Milestones",
            aiRec: "Strategic Recommendation",
            esgOffset: "Sustainability Impact",
            treesMsg: "trees to offset this shipment",
            volatility: "12-Month Volatility Index",
            recentTitle: "Recent Analyses",
            shareBtn: "Share Link",
            copySummary: "Copy Executive Summary",
            exportCsv: "Export CSV",
            disclaimer: "• 16kts avg. speed. Data are high-level AI simulations."
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
            totalImpact: "총 물류 비용 합계",
            journeyLog: "여정 주요 마일스톤",
            aiRec: "전략적 솔루션 제언",
            esgOffset: "지속가능성 영향",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "12개월 변동 지수",
            recentTitle: "최근 분석 기록",
            shareBtn: "링크 공유",
            copySummary: "경영 요약 복사",
            exportCsv: "CSV 내보내기",
            disclaimer: "• 16노트 평균속도 기준. 모든 지표는 AI 추정치입니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    const portCities = {
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea", status: "green", duty: 0.10 },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China", status: "red", duty: 0.15 },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore", status: "yellow", duty: 0.07 },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands", status: "yellow", duty: 0.12 },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", status: "red", duty: 0.05 }
    };

    const airportCities = {
        "ICN (Incheon)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", status: "green", duty: 0.10 },
        "PVG (Shanghai)": { coords: [31.1443, 121.8083], hub: "chn-pvg", country: "China", status: "red", duty: 0.15 },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", country: "Germany", status: "yellow", duty: 0.12 },
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA", status: "yellow", duty: 0.05 }
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
    const networkBadge = document.getElementById('network-status-badge');
    const feedContainer = document.getElementById('feed-container');
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
        const inlandMode = document.getElementById('inland-mode').value;
        const isPeak = document.getElementById('peak-season').checked;
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
        if (Math.abs(oHub.coords[1] - dHub.coords[1]) > 180) path.push(waypoints.pacific_mid);
        else if ((oHub.coords[1]>60 && dHub.coords[1]<20) || (oHub.coords[1]<20 && dHub.coords[1]>60)) {
            if (sandbox.redSea && mode === 'sea') { path.push(waypoints.good_hope); risks.push("Red Sea Conflict"); }
            else if (mode === 'sea') path.push(waypoints.suez);
        }
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const fDist = dist(origin.coords, oHub.coords); const lDist = dist(dHub.coords, dest.coords);
        const totalDist = mDist + fDist + lDist;

        const speeds = { sea: 711, air: 20000, truck: 500, rail: 300 };
        let transitD = mDist / speeds[mode];
        let inlandD = (fDist + lDist) / speeds[inlandMode];
        let handlingD = (mode==='sea' ? 5 : 2) + (isPeak ? 4 : 0);
        
        if (risks.includes("Red Sea Conflict")) transitD += 12;
        if (sandbox.panama && totalDist > 10000) { handlingD += 5; risks.push("Panama Delay"); }

        const totalD = transitD + inlandD + handlingD + 2;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        const baseFreight = (totalDist * (mode==='sea'?0.15:4.5) + (fDist+lDist)*(inlandMode==='truck'?0.8:0.3)) * weight;
        const peakPremium = isPeak ? baseFreight * 0.2 : 0;
        const inventoryCost = (value * annualICC / 365) * totalD;
        const totalSpend = baseFreight + peakPremium + inventoryCost;
        const co2Kg = Math.round((totalDist * (mode==='sea'?25:500) * weight) / 1000);
        const health = Math.max(25, (isPeak ? 75 : 98) - risks.length * 25);

        const t = translations[currentLang];
        const convert = (val) => `${currentCurrency==='KRW'?'₩':'$'}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;

        resultContainer.innerHTML = `
            <div class="space-y-4 animate-fade-in">
                <div class="flex bg-gray-100 p-1 rounded-xl">
                    <button onclick="switchTab('overview')" id="tab-overview" class="flex-1 py-2 text-[9px] font-bold rounded-lg bg-white shadow-sm text-indigo-600">${t.tabOverview}</button>
                    <button onclick="switchTab('finance')" id="tab-finance" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabFinance}</button>
                    <button onclick="switchTab('risk')" id="tab-risk" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabRisk}</button>
                </div>

                <div id="tab-content-overview" class="tab-pane space-y-4">
                    <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                        <p class="text-5xl font-black text-indigo-900">${Math.round(totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${eta.toLocaleDateString()}</p>
                    </div>
                    <!-- Timeline -->
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.journeyLog}</p><div class="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-100"><div class="flex gap-4 relative items-center"><div class="w-4 h-4 rounded-full bg-indigo-600 z-10 border-4 border-white shadow-sm"></div><div class="flex-1"><p class="text-xs font-bold text-gray-800">${originName} Departure</p><p class="text-[10px] text-gray-400">${departureDate.toLocaleDateString()}</p></div></div><div class="flex gap-4 relative items-center"><div class="w-4 h-4 rounded-full bg-indigo-400 z-10 border-4 border-white shadow-sm"></div><div class="flex-1"><p class="text-xs font-bold text-gray-800">Main Transit (~${Math.round(transitD)} Days)</p><p class="text-[10px] text-indigo-500">${risks.length > 0 ? risks.join(' & ') : 'Stable Path'}</p></div></div><div class="flex gap-4 relative items-center"><div class="w-4 h-4 rounded-full bg-indigo-600 z-10 border-4 border-white shadow-sm"></div><div class="flex-1"><p class="text-xs font-bold text-gray-800">${destName} Final Arrival</p><p class="text-[10px] text-gray-400">ETA: ${eta.toLocaleDateString()}</p></div></div></div></div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between"><span>Freight + Surcharges</span><span class="font-bold">${convert(baseFreight + peakPremium)}</span></div>
                            <div class="flex justify-between text-orange-500"><span>ICC (Capital tied-up)</span><span class="font-bold">${convert(inventoryCost)}</span></div>
                            <div class="border-t pt-2 flex justify-between font-black text-gray-900 text-lg"><span>Total Logistics Spend</span><span>${convert(totalSpend)}</span></div>
                        </div>
                        <div class="h-3 w-full bg-gray-100 rounded-full flex overflow-hidden">
                            <div style="width: ${((baseFreight+peakPremium)/totalSpend)*100}%" class="bg-indigo-500"></div>
                            <div style="width: ${(inventoryCost/totalSpend)*100}%" class="bg-orange-400"></div>
                        </div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${Math.ceil(co2Kg / 22)}</span><p class="text-[10px] text-indigo-100 pb-1">${t.treesMsg}</p></div>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Route Health</p><p class="text-2xl font-black ${health > 70 ? 'text-green-500' : 'text-red-500'}">${health}%</p></div>
                        <div class="text-right"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network Risk</p><p class="text-xs font-bold text-gray-700">${risks.length > 0 ? risks[0] : 'Stable'}</p></div>
                    </div>
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        updateIntelligence(origin, dest, risks, health);
        renderMap(path, origin, dest, oHub, dHub, originName, destName);
        
        // --- Expose calculation state for Executive Summary ---
        window.currentAnalysis = { originName, destName, mode, totalD, eta, convert, totalSpend, co2Kg, risks };
    }

    window.copyExecutiveSummary = () => {
        const a = window.currentAnalysis;
        if (!a) return;
        const text = `[EXECUTIVE LOGISTICS SUMMARY]\n\nRoute: ${a.originName} to ${a.destName}\nMode: ${a.mode.toUpperCase()}\nLead Time: ${Math.round(a.totalD)} Days\nEstimated ETA: ${a.eta.toLocaleDateString()}\nTotal Spend: ${a.convert(a.totalSpend)}\nESG Impact: ${Math.ceil(a.co2Kg / 22)} Trees needed for offset\nRisk Status: ${a.risks.length > 0 ? a.risks.join(', ') : 'Stable Network'}\n\nGenerated by LeadTime Intelligence AI.`;
        navigator.clipboard.writeText(text);
        alert(translations[currentLang].copySummary + " Copied!");
    };

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function updateIntelligence(o, d, risks, health) {
        networkBadge.classList.remove('hidden');
        const alert = risks.length > 0;
        networkBadge.querySelector('span:last-child').innerText = alert ? "Elevated Alert" : "Network Stable";
        networkBadge.querySelector('span:first-child span:last-child').className = `relative inline-flex rounded-full h-2 w-2 ${alert?'bg-red-500':'bg-green-500'}`;
        feedContainer.innerHTML = (alert ? `<div class="p-4 bg-red-50 rounded-xl border-l-4 border-red-500 text-sm font-medium text-red-700">Notice: ${risks.join(' & ')} active. Surcharges applied.</div>` : '') + `<div class="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-sm text-gray-700 font-medium">Market Intel: Regional throughput at ${d.country} hub is optimal.</div>`;
    }

    function renderMap(path, o, d, oH, dH, oN, dN) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
        const hI = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41] });
        L.marker(o.coords).addTo(map).bindPopup(oN); L.marker(d.coords).addTo(map).bindPopup(dN);
        L.marker(oH.coords, {icon: hI}).addTo(map); L.marker(dH.coords, {icon: hI}).addTo(map);
        L.polyline([o.coords, oH.coords], {color: '#ef4444', weight: 2, dashArray: '5, 5'}).addTo(map);
        path.forEach((p, i) => { if(i>0 && Math.abs(path[i-1][1]-p[1])<180) L.polyline([path[i-1], p], {color: '#dc2626', weight: 5}).addTo(map); });
        L.polyline([dH.coords, d.coords], {color: '#ef4444', weight: 2, dashArray: '5, 5'}).addTo(map);
        map.fitBounds([o.coords, d.coords], {padding: [50, 50]});
    }

    function saveToHistory(o, d, m) {
        let h = JSON.parse(localStorage.getItem('lt_history') || '[]');
        h = [{o, d, m}, ...h.filter(x => x.o!==o || x.d!==d)].slice(0, 5);
        localStorage.setItem('lt_history', JSON.stringify(h));
        renderHistory();
    }

    function renderHistory() {
        const h = JSON.parse(localStorage.getItem('lt_history') || '[]');
        recentContainer.innerHTML = h.length === 0 ? '<p class="text-xs text-gray-400 italic">No history</p>' : h.map(x => `<div class="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-300 cursor-pointer transition-all" onclick="loadHistory('${x.o}', '${x.d}', '${x.m}')"><p class="text-[9px] font-bold text-indigo-500 uppercase">${x.m}</p><p class="text-xs font-semibold text-gray-700 truncate">${x.o} → ${x.d}</p></div>`).join('');
    }

    window.loadHistory = (o, d, m) => { modeSelect.value = m; populate(); originSelect.value = o; destinationSelect.value = d; calculateAndDisplay(); };

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

    renderHistory();
    updateUI();
});
