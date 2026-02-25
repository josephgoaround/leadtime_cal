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
            tabCustoms: "Customs",
            totalLead: "Total Lead Time",
            reliability: "Network Health",
            eta: "Estimated ETA",
            freightCost: "Freight Cost",
            inventoryCost: "ICC (Capital Cost)",
            totalImpact: "Total Logistics Spend",
            journeyLog: "Journey Milestones",
            aiRec: "Strategic Recommendation",
            esgOffset: "Sustainability Impact",
            carbonTax: "Est. Carbon Tax (Future)",
            treesMsg: "trees to offset this shipment",
            volatility: "Lane Reliability Score",
            recentTitle: "Recent Analyses",
            shareBtn: "Share Link",
            copySummary: "Copy Summary",
            exportCsv: "Export CSV",
            customsDocs: "Required Documentation",
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
            tabCustoms: "통관 정보",
            totalLead: "총 리드타임",
            reliability: "네트워크 건전성",
            eta: "최종 도착 예정일",
            freightCost: "운송 비용",
            inventoryCost: "재고 금융 비용",
            totalImpact: "총 물류 비용 합계",
            journeyLog: "여정 주요 마일스톤",
            aiRec: "전략적 솔루션 제언",
            esgOffset: "지속가능성 영향",
            carbonTax: "예상 탄소세 (미래)",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "노선 정시 신뢰도 점수",
            recentTitle: "최근 분석 기록",
            shareBtn: "링크 공유",
            copySummary: "요약 복사",
            exportCsv: "CSV 내보내기",
            customsDocs: "필수 통관 서류",
            disclaimer: "• 16노트 평균속도 기준. 모든 지표는 AI 추정치입니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453], status: "green", congestion: "Low" },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407], status: "green", congestion: "Stable" },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833], status: "red", congestion: "High" },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398], status: "yellow", congestion: "Medium" },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450], status: "yellow", congestion: "Medium" },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764], status: "red", congestion: "High" }
    };

    const portCities = {
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea", duty: 0.10 },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China", duty: 0.15 },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore", duty: 0.07 },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands", duty: 0.12 },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", duty: 0.05 }
    };

    const airportCities = {
        "ICN (Incheon)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", duty: 0.10 },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", country: "Germany", duty: 0.12 }
    };

    const customsChecklists = {
        "South Korea": ["KC Certification (Electronics)", "FTA Origin Certificate", "Commercial Invoice", "Packing List"],
        "China": ["CCC Mark (Mandatory)", "Export License", "CIQ Inspection", "HS Code Verified Invoice"],
        "USA": ["ISF 10+2 Filing (Sea)", "Customs Bond", "BOL / AWB", "FDA/EPA Declaration"],
        "Germany": ["EORI Number", "VAT ID Certificate", "EU Transit Doc", "Safety Data Sheet"]
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "suez": [29.9, 32.5] };

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

        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originName]; const dest = cityData[destName];
        const oHub = hubs[origin.hub] || {coords: origin.coords, status: 'green'};
        const dHub = hubs[dest.hub] || {coords: dest.coords, status: 'green'};

        let risks = [];
        let path = [oHub.coords];
        if (Math.abs(oHub.coords[1] - dHub.coords[1]) > 180) path.push(waypoints.pacific_mid);
        else if ((oHub.coords[1]>60 && dHub.coords[1]<20) || (oHub.coords[1]<20 && dHub.coords[1]>60)) path.push(waypoints.suez);
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const totalDist = mDist + dist(origin.coords, oHub.coords) + dist(dHub.coords, dest.coords);

        const speeds = { sea: 711, air: 20000, truck: 500 };
        let transitD = mDist / speeds[mode];
        let handlingD = (mode==='sea' ? 5 : 2);
        if (tier === 'premium') handlingD *= 0.6;

        const totalD = transitD + (dist(origin.coords, oHub.coords)+dist(dHub.coords, dest.coords))/500 + handlingD + 2;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        const baseFreight = totalDist * (mode==='sea'?0.15:4.5) * weight;
        const inventoryCost = (value * annualICC / 365) * totalD;
        const totalSpend = baseFreight + inventoryCost;
        const reliability = Math.round(98 - (totalDist / 10000) * 5);

        const t = translations[currentLang];
        const convert = (val) => `${currentCurrency==='KRW'?'₩':'$'}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;

        const checklist = customsChecklists[dest.country] || ["Invoice", "Packing List", "BOL"];

        resultContainer.innerHTML = `
            <div class="space-y-4 animate-fade-in">
                <div class="flex bg-gray-100 p-1 rounded-xl">
                    <button onclick="switchTab('overview')" id="tab-overview" class="flex-1 py-2 text-[9px] font-bold rounded-lg bg-white shadow-sm text-indigo-600">${t.tabOverview}</button>
                    <button onclick="switchTab('finance')" id="tab-finance" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabFinance}</button>
                    <button onclick="switchTab('customs')" id="tab-customs" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabCustoms}</button>
                </div>

                <div id="tab-content-overview" class="tab-pane space-y-4">
                    <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                        <p class="text-5xl font-black text-indigo-900">${Math.round(totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${eta.toLocaleDateString()}</p>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${t.reliability}</p><p class="text-2xl font-black text-green-500">${reliability}%</p></div>
                        <div class="text-right"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Efficiency</p><p class="text-lg font-bold text-gray-700">${tier.toUpperCase()}</p></div>
                    </div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                        <div class="flex justify-between text-xs"><span>Freight Cost</span><span class="font-bold">${convert(baseFreight)}</span></div>
                        <div class="flex justify-between text-xs text-orange-500"><span>ICC (Capital)</span><span class="font-bold">${convert(inventoryCost)}</span></div>
                        <div class="border-t pt-3 flex justify-between font-black text-gray-900 text-lg"><span>Total spend</span><span>${convert(totalSpend)}</span></div>
                    </div>
                    <button onclick="exportCSV()" class="w-full bg-gray-900 text-white font-bold py-2 rounded-lg text-[10px] uppercase hover:bg-black transition-all flex items-center justify-center gap-2">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M16 10l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        ${t.exportCsv}
                    </button>
                </div>

                <div id="tab-content-customs" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.customsDocs}: ${dest.country}</p>
                        <ul class="space-y-2">
                            ${checklist.map(item => `
                                <li class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-700">
                                    <input type="checkbox" class="rounded text-indigo-600 focus:ring-indigo-500">
                                    ${item}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        renderMap(path, origin, dest, oHub, dHub, originName, destName);
        window.currentAnalysis = { originName, destName, mode, totalD, eta, convert, totalSpend };
    }

    window.exportCSV = () => {
        const a = window.currentAnalysis;
        const csv = `Metric,Value\nRoute,${a.originName} to ${a.destName}\nLead Time,${Math.round(a.totalD)} Days\nETA,${a.eta.toLocaleDateString()}\nCost,${a.convert(a.totalSpend)}`;
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a_el = document.createElement('a'); a_el.setAttribute('hidden', ''); a_el.setAttribute('href', url); a_el.setAttribute('download', 'leadtime_analysis.csv');
        document.body.appendChild(a_el); a_el.click(); document.body.removeChild(a_el);
    };

    window.copyExecutiveSummary = () => {
        const a = window.currentAnalysis;
        const text = `[LOGISTICS ANALYSIS SUMMARY]\n\nRoute: ${a.originName} to ${a.destName}\nMode: ${a.mode.toUpperCase()}\nLead Time: ${Math.round(a.totalD)} Days\nEstimated ETA: ${a.eta.toLocaleDateString()}\nLanded Cost: ${a.convert(a.totalSpend)}\n\nGenerated by LeadTime Intelligence.`;
        navigator.clipboard.writeText(text); alert("Summary Copied!");
    };

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function renderMap(path, o, d, oH, dH, oN, dN) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
        const hI = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41] });
        L.marker(o.coords).addTo(map).bindPopup(oN); L.marker(d.coords).addTo(map).bindPopup(dN);
        L.marker(oH.coords, {icon: hI}).addTo(map); L.marker(dH.coords, {icon: hI}).addTo(map);
        path.forEach((p, i) => { if(i>0 && Math.abs(path[i-1][1]-p[1])<180) L.polyline([path[i-1], p], {color: '#dc2626', weight: 5}).addTo(map); });
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
