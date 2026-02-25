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
            aiRec: "AI Strategic Advice",
            esgOffset: "Sustainability Impact",
            treesMsg: "trees to offset this shipment",
            volatility: "12-Month Volatility Index",
            recentTitle: "Recent Analyses",
            customsDocs: "Required Documentation",
            shareBtn: "Share Link",
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
            tabCustoms: "통관 정보",
            totalLead: "총 리드타임",
            reliability: "네트워크 건전성",
            eta: "최종 도착 예정일",
            freightCost: "운송 비용",
            inventoryCost: "재고 금융 비용",
            dutyTax: "예상 관세 및 부가세",
            totalImpact: "총 물류 비용 합계",
            journeyLog: "여정 주요 마일스톤",
            aiRec: "AI 전략적 제언",
            esgOffset: "지속가능성 영향",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "12개월 변동 지수",
            recentTitle: "최근 분석 기록",
            customsDocs: "필수 통관 서류",
            shareBtn: "링크 공유",
            exportCsv: "CSV 내보내기",
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
        "Port of Santos": { coords: [-23.9618, -46.3322], hub: "bra-ssz", country: "Brazil", duty: 0.25, status: "red" }
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
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450] },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764] },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398] },
        "deu-fra": { name: "Frankfurt Intl", coords: [50.0379, 8.5622] },
        "usa-jfk": { name: "John F. Kennedy", coords: [40.6413, -73.7781] }
    };

    const customsChecklists = {
        "South Korea": ["KC Mark Certification", "FTA Origin Certificate", "Commercial Invoice"],
        "China": ["CCC Certificate", "CIQ Inspection Label", "Export License"],
        "Brazil": ["RADAR License", "Import Declaration (DI)", "CNPJ Tax ID"],
        "USA": ["ISF 10+2 Filing", "Customs Bond", "HS Specified Packing List"],
        "Germany": ["EORI Number", "Transit Accompanying Doc", "VAT Certificate"]
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "good_hope": [-34.35, 18.47], "cape_verde": [15.0, -25.0], "suez": [29.9, 32.5] };

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const networkBadge = document.getElementById('network-status-badge');
    const feedContainer = document.getElementById('feed-container');
    const recentContainer = document.getElementById('recent-searches');

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
        const originName = originSelect.value;
        const destName = destinationSelect.value;
        const departureDate = new Date(dateInput.value);

        if (originName === destName || !originName || !destName) return;

        const sandbox = {
            redSea: document.getElementById('risk-redsea').checked,
            panama: document.getElementById('risk-panama').checked,
            peak: document.getElementById('peak-season').checked
        };

        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originName]; const dest = cityData[destName];
        const oHub = hubs[origin.hub]; const dHub = hubs[dest.hub];

        let risks = [];
        let path = [oHub.coords];
        let tHub = null;

        if ((origin.country === "South Korea" || origin.country === "China") && (dest.country === "Netherlands" || dest.country === "Germany")) {
            tHub = hubs["sgp-sin"]; path.push(tHub.coords);
        }

        if (Math.abs(oHub.coords[1] - dHub.coords[1]) > 180) path.push(waypoints.pacific_mid);
        else if ((oHub.coords[1]>60 && dHub.coords[1]<20) || (oHub.coords[1]<20 && dHub.coords[1]>60)) {
            if (sandbox.redSea && mode === 'sea') { path.push(waypoints.good_hope, waypoints.cape_verde); risks.push("Red Sea Conflict"); }
            else if (mode === 'sea') path.push(waypoints.suez);
        }
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const fDist = dist(origin.coords, oHub.coords); const lDist = dist(dHub.coords, dest.coords);
        const totalDist = mDist + fDist + lDist;

        const speeds = { sea: 711, air: 20000, truck: 500 };
        let transitD = mDist / speeds[mode];
        let handlingD = (mode==='sea' ? 5 : 2) + (sandbox.peak ? 4 : 0) + (tHub ? 3 : 0);
        
        if (risks.includes("Red Sea Conflict")) transitD += 12;
        if (sandbox.panama && totalDist > 10000) { handlingD += 5; risks.push("Panama Delay"); }

        const cDelay = (dest.country === "China" || dest.country === "Brazil" ? 6 : 2);
        const totalD = transitD + (fDist+lDist)/500 + handlingD + cDelay;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        // Analysis Calculations
        const baseFreight = totalDist * (mode==='sea'?0.15:4.5) * weight;
        const inventoryCost = (value * annualICC / 365) * totalD;
        const estDuty = value * (dest.duty || 0.10);
        const totalImpact = baseFreight + inventoryCost + estDuty;
        const co2Kg = Math.round((totalDist * (mode==='sea'?25:500) * weight) / 1000);
        const health = Math.max(25, 98 - risks.length * 25);

        // Strategic Advice
        let recommendation = "";
        if (mode === 'sea' && inventoryCost > (baseFreight * 2)) recommendation = currentLang === 'ko' ? "고가치 화물: 리드타임 지연으로 인한 금융 손실이 큽니다. 항공 운송으로의 전환을 강력 추천합니다." : "High-value detected: Financial loss from delay exceeds freight savings. Recommend switching to AIR.";

        const t = translations[currentLang];
        const convert = (val) => `${currentCurrency==='KRW'?'₩':'$'}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;

        document.getElementById('result').innerHTML = `
            <div class="space-y-4 animate-fade-in">
                <div class="flex bg-gray-100 p-1 rounded-xl">
                    <button onclick="switchTab('overview')" id="tab-overview" class="flex-1 py-2 text-[9px] font-bold rounded-lg bg-white shadow-sm text-indigo-600">${t.tabOverview}</button>
                    <button onclick="switchTab('finance')" id="tab-finance" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabFinance}</button>
                    <button onclick="switchTab('risk')" id="tab-risk" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabRisk}</button>
                    <button onclick="switchTab('customs')" id="tab-customs" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabCustoms}</button>
                </div>

                <div id="tab-content-overview" class="tab-pane space-y-4">
                    <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                        <p class="text-5xl font-black text-indigo-900">${Math.round(totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${eta.toLocaleDateString()}</p>
                    </div>
                    ${recommendation ? `<div class="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl"><p class="text-[10px] font-bold text-indigo-600 uppercase mb-1">${t.aiRec}</p><p class="text-xs font-semibold text-gray-700 leading-relaxed">${recommendation}</p></div>` : ''}
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between"><span>Freight</span><span class="font-bold">${convert(baseFreight)}</span></div>
                            <div class="flex justify-between text-orange-500"><span>ICC (Capital)</span><span class="font-bold">${convert(inventoryCost)}</span></div>
                            <div class="flex justify-between text-blue-500"><span>Duty/Tax</span><span class="font-bold">${convert(estDuty)}</span></div>
                            <div class="border-t pt-2 flex justify-between font-black text-gray-900 text-lg"><span>Total</span><span>${convert(totalImpact)}</span></div>
                        </div>
                        <div class="h-3 w-full bg-gray-100 rounded-full flex overflow-hidden">
                            <div style="width: ${(baseFreight/totalImpact)*100}%" class="bg-indigo-500"></div>
                            <div style="width: ${(inventoryCost/totalImpact)*100}%" class="bg-orange-400"></div>
                            <div style="width: ${(estDuty/totalImpact)*100}%" class="bg-blue-400"></div>
                        </div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${Math.ceil(co2Kg / 22)}</span><p class="text-[10px] text-indigo-100 pb-1">${t.treesMsg}</p></div>
                    </div>
                </div>

                <div id="tab-content-customs" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.customsDocs}: ${dest.country}</p>
                        <ul class="space-y-2">
                            ${(customsChecklists[dest.country] || ["Invoice", "Packing List", "BL"]).map(item => `<li class="flex items-center gap-3 text-xs font-semibold text-gray-700 p-2 bg-gray-50 rounded-lg"><input type="checkbox" class="rounded text-indigo-600"> ${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>`;

        updateIntelligence(origin, dest, risks, health);
        renderMap(path, origin, dest, oHub, dHub, originName, destName, tHub);
        saveToHistory(originName, destName, mode);
    }

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        const btn = document.getElementById(`tab-${tab}`);
        btn.classList.add('bg-white', 'shadow-sm', 'text-indigo-600'); btn.classList.remove('text-gray-500');
    };

    function updateIntelligence(o, d, risks, health) {
        networkBadge.classList.remove('hidden');
        const statusText = networkBadge.querySelector('span:last-child');
        const statusDot = networkBadge.querySelector('span:first-child span:last-child');
        if (health > 70) { statusText.innerText = "Network Stable"; statusDot.className = "relative inline-flex rounded-full h-2 w-2 bg-green-500"; }
        else { statusText.innerText = "Elevated Alert"; statusDot.className = "relative inline-flex rounded-full h-2 w-2 bg-red-500"; }
        feedContainer.innerHTML = (risks.length > 0 ? `<div class="p-4 bg-red-50 rounded-xl border-l-4 border-red-500 text-sm font-medium text-red-700">Warning: ${risks.join(' & ')}.</div>` : '') + `<div class="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-sm text-gray-700 font-medium">Standard regional monitoring active for ${d.country}.</div>`;
    }

    function renderMap(path, o, d, oH, dH, oN, dN, tH) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
        
        const pin = (color) => L.divIcon({
            html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md bg-${color}-500"></div>`,
            className: 'custom-div-icon', iconSize: [16, 16]
        });

        L.marker(o.coords, {icon: pin(o.status)}).addTo(map).bindPopup(oN);
        L.marker(d.coords, {icon: pin(d.status)}).addTo(map).bindPopup(dN);
        if (tH) L.marker(tH.coords, {icon: pin('indigo')}).addTo(map).bindPopup(`<b>${tH.name} Hub</b>`);

        L.polyline([o.coords, oH.coords], {color: '#ef4444', weight: 2, dashArray: '5, 5'}).addTo(map);
        path.forEach((p, i) => { if(i>0 && Math.abs(path[i-1][1]-p[1])<180) L.polyline([path[i-1], p], {color: '#dc2626', weight: 5}).addTo(map); });
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
