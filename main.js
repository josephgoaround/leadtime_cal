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
            shareBtn: "Share Link",
            copySummary: "Copy Summary",
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
            aiRec: "전략적 솔루션 제언",
            esgOffset: "지속가능성 영향",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "12개월 변동 지수",
            recentTitle: "최근 분석 기록",
            shareBtn: "링크 공유",
            copySummary: "요약 복사",
            exportCsv: "CSV 내보내기",
            disclaimer: "• 16노트 평균속도 기준. 모든 지표는 AI 추정치입니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    // --- Enterprise Global Database ---
    const portCities = {
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea", duty: 0.10, metrics: { congestion: "Low", status: "green" } },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China", duty: 0.15, metrics: { congestion: "High", status: "red" } },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore", duty: 0.07, metrics: { congestion: "Moderate", status: "yellow" } },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands", duty: 0.12, metrics: { congestion: "Moderate", status: "yellow" } },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", duty: 0.05, metrics: { congestion: "High", status: "red" } },
        "Port of Manzanillo": { coords: [19.0522, -104.3158], hub: "mex-mzo", country: "Mexico", duty: 0.12, metrics: { congestion: "Moderate", status: "yellow" } },
        "Port of Santos": { coords: [-23.9618, -46.3322], hub: "bra-ssz", country: "Brazil", duty: 0.25, metrics: { congestion: "High", status: "red" } }
    };

    const airportCities = {
        "ICN (Incheon)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", duty: 0.10, metrics: { congestion: "Low", status: "green" } },
        "PVG (Shanghai)": { coords: [31.1443, 121.8083], hub: "chn-pvg", country: "China", duty: 0.15, metrics: { congestion: "High", status: "red" } },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", country: "Germany", duty: 0.12, metrics: { congestion: "Moderate", status: "yellow" } },
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA", duty: 0.05, metrics: { congestion: "Moderate", status: "yellow" } }
    };

    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453] },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407] },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833] },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450] },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764] },
        "mex-mzo": { name: "Manzanillo Hub", coords: [19.0522, -104.3158] },
        "bra-ssz": { name: "Santos Hub", coords: [-23.9618, -46.3322] }
    };

    const customsChecklists = {
        "South Korea": ["KC Mark Certification", "FTA Origin Certificate", "Packing List (HS Specified)"],
        "China": ["CCC Certificate", "CIQ Inspection Label", "Export License"],
        "Brazil": ["RADAR License", "Import Declaration (DI)", "CNPJ Tax ID"],
        "USA": ["ISF 10+2 Filing", "Customs Bond", "Commercial Invoice"],
        "Germany": ["EORI Number", "Transit Accompanying Doc", "VAT Certificate"]
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "good_hope": [-34.35, 18.47], "cape_verde": [15.0, -25.0], "suez": [29.9, 32.5] };

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const feedContainer = document.getElementById('feed-container');
    const newsTicker = document.getElementById('news-ticker');

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

        if (originName === destName) return;

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
            if (sandbox.redSea && mode === 'sea') { path.push(waypoints.good_hope, waypoints.cape_verde); risks.push("Red Sea Conflict"); }
            else if (mode === 'sea') path.push(waypoints.suez);
        }
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const fDist = dist(origin.coords, oHub.coords); const lDist = dist(dHub.coords, dest.coords);
        const totalDist = mDist + fDist + lDist;

        const speeds = { sea: 711, air: 20000, land: 500 };
        let transitD = mDist / speeds[mode];
        let inlandD = (fDist + lDist) / speeds.land;
        let handlingD = (mode==='sea' ? 5 : 2);
        if (risks.includes("Red Sea Conflict")) transitD += 12;
        if (sandbox.panama && totalDist > 10000) { handlingD += 5; risks.push("Panama Delay"); }

        const cDelay = (dest.country === "China" || dest.country === "Brazil" ? 6 : 2);
        const totalD = transitD + inlandD + handlingD + cDelay;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        // Analysis Calculations
        const baseFreight = totalDist * (mode==='sea'?0.15:4.5) * weight;
        const inventoryCost = (value * annualICC / 365) * totalD;
        const estDuty = value * (dest.duty || 0.10);
        const totalLogSpend = baseFreight + inventoryCost + estDuty;
        const trees = Math.ceil((totalDist * (mode==='sea'?25:500) * weight / 1000) / 22);
        const health = Math.max(25, 98 - risks.length * 25);

        const t = translations[currentLang];
        const convert = (val) => {
            const sym = { USD: '$', EUR: '€', KRW: '₩' };
            return `${sym[currentCurrency]}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;
        };

        const checklist = customsChecklists[dest.country] || ["Commercial Invoice", "Packing List", "Bill of Lading"];

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
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${eta.toLocaleDateString(currentLang==='ko'?'ko-KR':'en-US')}</p>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div><p class="text-[10px] font-bold text-gray-400 uppercase">${t.reliability}</p><p class="text-2xl font-black ${health > 70 ? 'text-green-500' : 'text-red-500'}">${health}%</p></div>
                        <div class="text-right"><p class="text-[10px] font-bold text-gray-400 uppercase">Distance</p><p class="text-lg font-bold text-gray-700">${Math.round(totalDist).toLocaleString()} km</p></div>
                    </div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                        <div class="flex justify-between text-xs"><span>${t.freightCost}</span><span class="font-bold">${convert(baseFreight)}</span></div>
                        <div class="flex justify-between text-xs"><span>${t.inventoryCost}</span><span class="font-bold text-orange-500">${convert(inventoryCost)}</span></div>
                        <div class="flex justify-between text-xs"><span>${t.dutyTax}</span><span class="font-bold text-blue-500">${convert(estDuty)}</span></div>
                        <div class="border-t pt-3 flex justify-between font-black text-gray-900 text-lg"><span>Total</span><span>${convert(totalLogSpend)}</span></div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${trees}</span><p class="text-[10px] text-indigo-100 pb-1">${t.treesMsg}</p></div>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">${t.volatility}</p>
                        <svg viewBox="0 0 275 40" class="w-full h-8 stroke-current text-indigo-500 fill-none"><path d="M 0,20 L 50,15 L 100,25 L 150,10 L 200,30 L 275,20" stroke-width="2" /></svg>
                    </div>
                </div>

                <div id="tab-content-customs" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.customsDocs}: ${dest.country}</p>
                        <div class="space-y-2">
                            ${checklist.map(item => `
                                <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                    <input type="checkbox" class="rounded text-indigo-600">
                                    <span class="text-xs font-semibold text-gray-700">${item}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-2 pt-2">
                    <button id="export-csv-btn" onclick="exportToCSV()" class="bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-black transition-all text-[10px] uppercase tracking-wider flex items-center justify-center gap-2">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        ${t.exportCsv}
                    </button>
                    <button id="share-btn" onclick="copyShareLink()" class="bg-white border-2 border-indigo-100 text-indigo-600 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-all text-[10px] uppercase tracking-wider flex items-center justify-center gap-2">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 100-5.368 3 3 0 000 5.368zm0 10.736a3 3 0 100-5.368 3 3 0 000 5.368z"></path></svg>
                        ${t.shareBtn}
                    </button>
                </div>
            </div>`;

        updateIntelligence(origin, dest, risks, health);
        renderMap(path, origin, dest, oHub, dHub, originName, destName, sandbox);
        saveToHistory(originName, destName, mode);
    }

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    window.exportToCSV = () => {
        const data = [
            ["Metric", "Value"],
            ["Origin", originSelect.value],
            ["Destination", destinationSelect.value],
            ["Mode", modeSelect.value],
            ["Total Lead Time", document.querySelector('#tab-content-overview p.text-5xl').innerText],
            ["Freight Cost", document.querySelector('#tab-content-finance div:nth-child(1) span:last-child').innerText],
            ["Total Logistics Spend", document.querySelector('#tab-content-finance div:last-child span:last-child').innerText],
            ["Tree Offset Needed", document.querySelector('#tab-content-risk span.text-4xl').innerText]
        ];
        const csvContent = "data:text/csv;charset=utf-8," + data.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a"); link.setAttribute("href", encodedUri);
        link.setAttribute("download", `LeadTime_Intel_${originSelect.value}_to_${destinationSelect.value}.csv`);
        document.body.appendChild(link); link.click();
    };

    window.copyShareLink = () => { navigator.clipboard.writeText(window.location.href); alert(translations[currentLang].shareMsg); };

    function updateIntelligence(o, d, risks, health) {
        networkBadge.classList.remove('hidden');
        const statusText = networkBadge.querySelector('span:last-child');
        const statusDot = networkBadge.querySelector('span:first-child span:last-child');
        if (health > 70) { statusText.innerText = "Network Stable"; statusDot.className = "relative inline-flex rounded-full h-2 w-2 bg-green-500"; }
        else { statusText.innerText = "Elevated Alert"; statusDot.className = "relative inline-flex rounded-full h-2 w-2 bg-red-500"; }
        
        let tickerText = `<span>Market analysis active for ${o.country} trade lane.</span>`;
        if (d.country === "Brazil") tickerText += "<span>Port Santos facing 15% labor capacity reduction this week.</span>";
        newsTicker.innerHTML = tickerText + "<span>Shanghai automation improving turnaround by 12%.</span><span>EU CBAM phase-in affecting steel shipments.</span>";
    }

    function renderMap(path, o, d, oH, dH, oN, dN, sandbox) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline || l instanceof L.Circle) map.removeLayer(l); });
        
        const hI = (color) => L.divIcon({
            html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md marker-pin-${color}"></div>`,
            className: 'custom-div-icon', iconSize: [16, 16], iconAnchor: [8, 8]
        });

        [o, d].forEach((city, i) => {
            const color = city.metrics?.status || "green";
            L.marker(city.coords, { icon: hI(color) }).addTo(map).bindPopup(`<b>${i===0?oN:dN}</b><br>Congestion: ${city.metrics?.congestion || "Normal"}`);
            L.marker(hubs[city.hub].coords, { icon: hI('yellow') }).addTo(map).bindPopup(`<b>${hubs[city.hub].name} Hub</b>`);
        });

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
        document.getElementById('lang-ko').className = `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${currentLang==='ko'?'bg-indigo-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600'}`;
        document.getElementById('lang-en').className = `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${currentLang==='en'?'bg-indigo-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600'}`;
    }

    renderHistory();
    updateUI();
});
