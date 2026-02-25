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
            journeyLog: "Journey Intelligence Log",
            aiRec: "Strategic Recommendation",
            esgOffset: "Sustainability Impact",
            treesMsg: "trees to offset this shipment",
            volatility: "12-Month Volatility Index",
            recentTitle: "Recent Analyses",
            transshipment: "Transshipment Hub",
            disclaimer: "• 16kts avg. speed. Financials based on 15% annual rate."
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
            journeyLog: "상세 여정 인텔리전스",
            aiRec: "전략적 솔루션 제언",
            esgOffset: "지속가능성 영향",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "12개월 변동 지수",
            recentTitle: "최근 분석 기록",
            transshipment: "주요 환적 거점",
            disclaimer: "• 16노트 평균속도 기준. 금융비용은 연 15% 기준입니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    // Strategic Hubs with Operational Data
    const portCities = {
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea", status: "green" },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China", status: "red" },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore", status: "yellow" },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands", status: "yellow" },
        "Port of Dubai (Jebel Ali)": { coords: [25.0112, 55.0612], hub: "are-dxb", country: "UAE", status: "green" },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", status: "red" }
    };

    const airportCities = {
        "ICN (Incheon)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", status: "green" },
        "PVG (Shanghai)": { coords: [31.1443, 121.8083], hub: "chn-pvg", country: "China", status: "red" },
        "SIN (Singapore)": { coords: [1.3644, 103.9915], hub: "sgp-sin-air", country: "Singapore", status: "yellow" },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", country: "Germany", status: "yellow" },
        "DXB (Dubai)": { coords: [25.2532, 55.3657], hub: "are-dxb-air", country: "UAE", status: "green" }
    };

    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453] },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407] },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833] },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398] },
        "nld-rot": { name: "Rotterdam Hub", coords: [51.9490, 4.1450] },
        "are-dxb": { name: "Jebel Ali Hub", coords: [25.0112, 55.0612] },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764] }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "good_hope": [-34.35, 18.47], "suez": [29.9, 32.5], "panama": [9.1, -79.7] };

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const networkBadge = document.getElementById('network-status-badge');
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
        let tHub = null;

        // Intelligent Routing Logic with Transshipment detection
        if (Math.abs(oHub.coords[1] - dHub.coords[1]) > 180) path.push(waypoints.pacific_mid);
        else if ((oHub.coords[1]>60 && dHub.coords[1]<20) || (oHub.coords[1]<20 && dHub.coords[1]>60)) {
            tHub = hubs["sgp-sin"]; // Force Singapore as T/S hub for Asia-Europe
            if (sandbox.redSea && mode === 'sea') { path.push(tHub.coords, waypoints.good_hope, waypoints.cape_verde); risks.push("Red Sea Redirect"); }
            else if (mode === 'sea') path.push(tHub.coords, waypoints.suez);
        }
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const fDist = dist(origin.coords, oHub.coords); const lDist = dist(dHub.coords, dest.coords);
        const totalDist = mDist + fDist + lDist;

        const speeds = { sea: 711, air: 20000, land: 500 };
        let transitD = mDist / speeds[mode];
        let inlandD = (fDist + lDist) / speeds.land;
        let handlingD = (mode==='sea' ? 5 : 2) + (tHub ? 3 : 0); // Add 3 days for transshipment
        
        if (risks.includes("Red Sea Redirect")) transitD += 12;
        if (sandbox.panama && totalDist > 10000) { handlingD += 5; risks.push("Panama Delay"); }

        const cDelay = (dest.country === "China" ? 6 : 2);
        const totalD = transitD + inlandD + handlingD + cDelay;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        const t = translations[currentLang];
        const convert = (val) => `${currentCurrency==='KRW'?'₩':'$'}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;
        const co2Kg = Math.round((totalDist * (mode==='sea'?25:500) * weight) / 1000);
        const health = Math.max(25, 98 - risks.length * 25);

        // Timeline Generation
        const log = [
            { d: 0, msg: currentLang==='ko'?'창고 출발 및 내륙 운송':'Departure & Inland transit' },
            { d: inlandD/2, msg: currentLang==='ko'?'선적항 도착 및 적재':'Port loading' },
            { d: totalD/2, msg: tHub ? (currentLang==='ko'?`환적 거점(${tHub.name}) 통과`:`Transshipment at ${tHub.name}`) : (currentLang==='ko'?'본선 운송 중':'Main Transit') },
            { d: totalD - cDelay, msg: currentLang==='ko'?'도착항 하역 및 통관':'Discharge & Customs' },
            { d: totalD, msg: currentLang==='ko'?'최종 목적지 도착':'Final Delivery' }
        ];

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
                        <p class="text-5xl font-black text-indigo-900">${Math.round(totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${eta.toLocaleDateString()}</p>
                    </div>
                    
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.journeyLog}</p>
                        <div class="space-y-4">
                            ${log.map(ev => {
                                const evDate = new Date(departureDate); evDate.setDate(evDate.getDate() + ev.d);
                                return `<div class="flex gap-3 items-start"><div class="text-[9px] font-bold text-gray-400 w-16 pt-1">${evDate.toLocaleDateString(currentLang==='ko'?'ko-KR':'en-US', {month:'short', day:'numeric'})}</div><div class="relative pb-4 last:pb-0 pl-4 border-l border-gray-100"><div class="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-50"></div><p class="text-xs font-semibold text-gray-700">${ev.msg}</p></div></div>`;
                            }).join('')}
                        </div>
                    </div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                        <div class="flex justify-between text-xs"><span>Freight Cost</span><span class="font-bold">${convert(totalDist * (mode==='sea'?0.15:4.5) * weight)}</span></div>
                        <div class="flex justify-between text-xs"><span>Inventory ICC</span><span class="font-bold text-orange-500">${convert((value * annualICC / 365) * totalD)}</span></div>
                        <div class="border-t pt-3 flex justify-between font-black text-gray-900 text-lg"><span>Total Spend</span><span>${convert((totalDist * (mode==='sea'?0.15:4.5) * weight) + (value * annualICC / 365) * totalD)}</span></div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${Math.ceil(co2Kg / 22)}</span><p class="text-[10px] pb-1">${t.treesMsg}</p></div>
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
        const alert = risks.length > 0;
        networkBadge.querySelector('span:last-child').innerText = alert ? "Elevated Alert" : "Network Stable";
        networkBadge.querySelector('span:first-child span:last-child').className = `relative inline-flex rounded-full h-2 w-2 ${alert?'bg-red-500':'bg-green-500'}`;
        feedContainer.innerHTML = (alert ? `<div class="p-4 bg-red-50 rounded-xl border-l-4 border-red-500 text-sm font-medium text-red-700">Warning: ${risks.join(' & ')} detected. Expect equipment shortages.</div>` : '') + `<div class="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-sm text-gray-700 font-medium">${d.country} hub operation efficiency stable at 94%.</div>`;
    }

    function renderMap(path, o, d, oH, dH, oN, dN, tH) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
        const hI = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41] });
        L.marker(o.coords).addTo(map).bindPopup(oN); L.marker(d.coords).addTo(map).bindPopup(dN);
        if (tH) L.marker(tH.coords, {icon: hI}).addTo(map).bindPopup(`<b>${tH.name}</b> (T/S Hub)`);
        
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
    document.getElementById('curr-usd').onclick = function() { currentCurrency='USD'; calculateAndDisplay(); };
    document.getElementById('curr-krw').onclick = function() { currentCurrency='KRW'; calculateAndDisplay(); };

    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n'); if(translations[currentLang][k]) el.textContent = translations[currentLang][k];
        });
    }

    renderHistory();
    updateUI();
});
