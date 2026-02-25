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
            dutyTax: "Est. Duty & Taxes",
            totalImpact: "Total Logistics Spend",
            journeyLog: "Journey Milestones",
            aiRec: "Strategic Recommendation",
            esgOffset: "Sustainability Impact",
            treesMsg: "trees to offset this shipment",
            volatility: "12-Month Volatility Index",
            recentTitle: "Recent Analyses",
            shareBtn: "Copy Report Link",
            shareMsg: "Link copied to clipboard!",
            disclaimer: "• 16kts avg. speed. Tax/Duty are high-level estimates."
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
            dutyTax: "예상 관세 및 부가세",
            totalImpact: "총 물류 비용 합계",
            journeyLog: "여정 주요 마일스톤",
            aiRec: "전략적 솔루션 제언",
            esgOffset: "지속가능성 영향",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "12개월 변동 지수",
            recentTitle: "최근 분석 기록",
            shareBtn: "보고서 링크 복사",
            shareMsg: "클립보드에 링크가 복사되었습니다!",
            disclaimer: "• 16노트 평균속도 기준. 세금은 품목별 상이할 수 있는 추정치입니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    const portCities = {
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea", dutyRate: 0.10 },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China", dutyRate: 0.15 },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore", dutyRate: 0.07 },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands", dutyRate: 0.12 },
        "Port of New York": { coords: [40.7128, -74.0060], hub: "usa-nyc", country: "USA", dutyRate: 0.05 },
        "Port of Santos": { coords: [-23.9618, -46.3322], hub: "bra-ssz", country: "Brazil", dutyRate: 0.25 },
        "Nhava Sheva (Mumbai)": { coords: [18.9498, 72.9481], hub: "ind-bom", country: "India", dutyRate: 0.20 }
    };

    const airportCities = {
        "ICN (Incheon)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", dutyRate: 0.10 },
        "PVG (Shanghai)": { coords: [31.1443, 121.8083], hub: "chn-pvg", country: "China", dutyRate: 0.15 },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", country: "Germany", dutyRate: 0.12 },
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA", dutyRate: 0.05 }
    };

    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453] },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407] },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833] },
        "chn-pvg": { name: "Pudong Intl", coords: [31.1443, 121.8083] },
        "sgp-sin": { name: "Singapore Port", coords: [1.2644, 103.8398] },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450] },
        "deu-fra": { name: "Frankfurt Intl", coords: [50.0379, 8.5622] },
        "usa-nyc": { name: "Port of NY/NJ", coords: [40.6892, -74.0445] },
        "usa-jfk": { name: "John F. Kennedy", coords: [40.6413, -73.7781] },
        "bra-ssz": { name: "Port of Santos", coords: [-23.9618, -46.3322] },
        "ind-bom": { name: "Nhava Sheva", coords: [18.8922, 72.9481] }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "good_hope": [-34.35, 18.47], "cape_verde": [15.0, -25.0], "suez": [29.9, 32.5] };

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const networkBadge = document.getElementById('network-status-badge');
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

        // --- Financial Analysis ---
        const baseFreight = totalDist * (mode==='sea'?0.15:4.5) * weight;
        const inventoryCost = (value * annualICC / 365) * totalD;
        const estDuty = value * (dest.dutyRate || 0.10);
        const totalImpactUSD = baseFreight + inventoryCost + estDuty;

        // --- ESG Breakdown ---
        const co2KgTransit = Math.round((mDist * (mode==='sea'?25:500) * weight) / 1000);
        const co2KgInland = Math.round(((fDist + lDist) * 80 * weight) / 1000); // Trucking avg 80g
        const totalCo2 = co2KgTransit + co2KgInland;
        const trees = Math.ceil(totalCo2 / 22);

        const t = translations[currentLang];
        const convert = (val) => {
            const sym = { USD: '$', EUR: '€', KRW: '₩' };
            return `${sym[currentCurrency]}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;
        };
        const health = Math.max(25, 98 - risks.length * 25);

        document.getElementById('result').innerHTML = `
            <div class="space-y-4 animate-fade-in">
                <div class="flex bg-gray-100 p-1 rounded-xl">
                    <button onclick="switchTab('overview')" id="tab-overview" class="flex-1 py-2 text-[10px] font-bold rounded-lg bg-white shadow-sm text-indigo-600">${t.tabOverview}</button>
                    <button onclick="switchTab('finance')" id="tab-finance" class="flex-1 py-2 text-[10px] font-bold rounded-lg text-gray-500">${t.tabFinance}</button>
                    <button onclick="switchTab('risk')" id="tab-risk" class="flex-1 py-2 text-[10px] font-bold rounded-lg text-gray-500">${t.tabRisk}</button>
                </div>

                <div id="tab-content-overview" class="tab-pane space-y-4">
                    <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                        <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                        <p class="text-5xl font-black text-indigo-900">${Math.round(totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${eta.toLocaleDateString(currentLang==='ko'?'ko-KR':'en-US')}</p>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.journeyLog}</p><div class="space-y-4 text-xs font-semibold text-gray-700"><p>• ${originName} Departure</p><p>• Main Transit (~${Math.round(transitD)} Days)</p><p>• ${destName} Final Arrival</p></div></div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                        <div class="flex justify-between text-sm"><span>${t.freightCost}</span><span class="font-bold">${convert(baseFreight)}</span></div>
                        <div class="flex justify-between text-sm"><span>${t.inventoryCost}</span><span class="font-bold text-orange-500">${convert(inventoryCost)}</span></div>
                        <div class="flex justify-between text-sm"><span>${t.dutyTax}</span><span class="font-bold text-blue-500">${convert(estDuty)}</span></div>
                        <div class="border-t pt-3 flex justify-between font-black text-gray-900 text-lg"><span>${t.totalImpact}</span><span>${convert(totalImpactUSD)}</span></div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${trees}</span><p class="text-[10px] text-indigo-100 pb-1">${t.treesMsg}</p></div>
                        <div class="mt-4 pt-4 border-t border-indigo-800 text-[9px] flex justify-between">
                            <span>Main Transit: ${co2KgTransit.toLocaleString()}kg</span>
                            <span>Inland: ${co2KgInland.toLocaleString()}kg</span>
                        </div>
                    </div>
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
        const btn = document.getElementById(`tab-${tab}`);
        btn.classList.add('bg-white', 'shadow-sm', 'text-indigo-600'); btn.classList.remove('text-gray-500');
    };

    function updateIntelligence(o, d, risks, health) {
        networkBadge.classList.remove('hidden');
        const statusText = networkBadge.querySelector('span:last-child');
        const statusDot = networkBadge.querySelector('span:first-child span:last-child');
        if (health > 70) { statusText.innerText = "Network Stable"; statusDot.className = "relative inline-flex rounded-full h-2 w-2 bg-green-500"; }
        else { statusText.innerText = "Elevated Alert"; statusDot.className = "relative inline-flex rounded-full h-2 w-2 bg-red-500"; }
        
        let dynamicNews = `<span>Route intelligence active for ${o.country} to ${d.country}.</span>`;
        if (d.country === "Brazil") dynamicNews += "<span>Brazil's Port Santos facing labor negotiation delays.</span>";
        if (d.country === "India") dynamicNews += "<span>Nhava Sheva digital customs pilot reducing paperwork by 20%.</span>";
        newsTicker.innerHTML = dynamicNews + "<span>Shanghai Port automation improving efficiency.</span><span>EU CBAM regulations in transition phase.</span>";

        feedContainer.innerHTML = (risks.length > 0 ? `<div class="p-4 bg-red-50 rounded-xl border-l-4 border-red-500 text-sm font-medium text-red-700">Alert: ${risks.join(' & ')}.</div>` : '') + `<div class="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-sm text-gray-700 font-medium">${d.country} duty estimate based on ${Math.round(d.dutyRate*100)}% standard rate for general cargo.</div>`;
    }

    function renderMap(path, o, d, oH, dH, oN, dN, sandbox) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline || l instanceof L.Circle) map.removeLayer(l); });
        if (sandbox.redSea) L.circle([15, 40], { radius: 1000000, color: 'red', fillOpacity: 0.1, weight: 1 }).addTo(map);
        if (sandbox.panama) L.circle([9, -80], { radius: 500000, color: 'orange', fillOpacity: 0.1, weight: 1 }).addTo(map);

        const hI = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41] });
        [o, d].forEach((city, i) => {
            L.marker(city.coords).addTo(map).bindPopup(`<b>${i===0?oN:dN}</b>`);
            L.marker(hubs[city.hub].coords, {icon: hI}).addTo(map).bindPopup(`<b>${hubs[city.hub].name} Hub</b>`);
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
    document.getElementById('curr-usd').onclick = function() { currentCurrency='USD'; updateCurrencyUI(this); calculateAndDisplay(); };
    document.getElementById('curr-eur').onclick = function() { currentCurrency='EUR'; updateCurrencyUI(this); calculateAndDisplay(); };
    document.getElementById('curr-krw').onclick = function() { currentCurrency='KRW'; updateCurrencyUI(this); calculateAndDisplay(); };

    function updateCurrencyUI(btn) {
        document.querySelectorAll('[id^="curr-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        btn.classList.add('bg-white', 'shadow-sm', 'text-indigo-600'); btn.classList.remove('text-gray-500');
    }

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
