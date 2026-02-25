document.addEventListener('DOMContentLoaded', () => {
    // --- i18n Dictionary ---
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
            totalImpact: "Total Landed Spend",
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
            tabCustoms: "통관 정보",
            totalLead: "총 리드타임",
            reliability: "네트워크 건전성",
            eta: "최종 도착 예정일",
            totalImpact: "총 수입 원가 합계",
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
            compChart: "비용-시간 효율성 (해상 vs 항공)",
            disclaimer: "• 16노트 평균속도 기준. 전 세계 물류 부하 지수를 반영합니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    // --- Enterprise Databases ---
    const carriers = {
        sea: [ { name: "Maersk", rel: 0.92, premium: 1.1 }, { name: "MSC", rel: 0.85, premium: 1.0 }, { name: "HMM", rel: 0.88, premium: 1.05 } ],
        air: [ { name: "Korean Air", rel: 0.98, premium: 1.2 }, { name: "FedEx", rel: 0.99, premium: 1.5 }, { name: "Emirates", rel: 0.95, premium: 1.1 } ]
    };

    const cargoMetadata = {
        general: { duty: 0.08, vat: 0.10, docs: ["Invoice", "Packing List"] },
        electronics: { duty: 0.0, vat: 0.10, docs: ["KC/CE Certificate", "FTA Origin"] },
        textiles: { duty: 0.12, vat: 0.10, docs: ["Origin Declaration", "Inspection"] },
        chemicals: { duty: 0.06, vat: 0.10, docs: ["MSDS (SDS)", "DG Dec"] }
    };

    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453], status: "green", congestion: "Low" },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407], status: "green", congestion: "Stable" },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833], status: "red", congestion: "High" },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398], status: "yellow", congestion: "Medium" },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450], status: "yellow", congestion: "Medium" },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764], status: "red", congestion: "High" },
        "usa-jfk": { name: "New York JFK", coords: [40.6413, -73.7781], status: "yellow", congestion: "Stable" }
    };

    const portCities = {
        "Port of Busan": { hub: "kor-pus", country: "South Korea" },
        "Port of Shanghai": { hub: "chn-sha", country: "China" },
        "Port of Singapore": { hub: "sgp-sin", country: "Singapore" },
        "Port of Rotterdam": { hub: "nld-rot", country: "Netherlands" },
        "Port of Los Angeles": { hub: "usa-lax", country: "USA" }
    };

    const airportCities = {
        "ICN (Incheon)": { hub: "kor-icn", country: "South Korea" },
        "FRA (Frankfurt)": { hub: "deu-fra", country: "Germany" },
        "JFK (New York)": { hub: "usa-jfk", country: "USA" }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "suez": [29.9, 32.5], "good_hope": [-34.35, 18.47] };
    const riskZones = {
        "redsea": { coords: [18.0, 40.0], radius: 1200000, color: 'red', label: "Conflict Area" },
        "panama": { coords: [9.1, -79.7], radius: 600000, color: 'orange', label: "Drought Region" }
    };

    const modeSelect = document.getElementById('transport-mode');
    const carrierSelect = document.getElementById('carrier-select');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const resultContainer = document.getElementById('result');
    const executiveActions = document.getElementById('executive-actions');
    const newsTicker = document.getElementById('news-ticker');

    dateInput.valueAsDate = new Date();

    function populate() {
        const mode = modeSelect.value;
        const cities = mode === 'sea' ? portCities : airportCities;
        
        carrierSelect.innerHTML = '';
        carriers[mode].forEach(c => carrierSelect.add(new Option(c.name, c.name)));

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
        const carrierName = carrierSelect.value;
        const weight = parseFloat(document.getElementById('cargo-weight').value) || 1;
        const volume = parseFloat(document.getElementById('cargo-volume').value) || 2;
        const value = parseFloat(document.getElementById('cargo-value').value) || 50000;
        const tier = document.getElementById('service-tier').value;
        const category = document.getElementById('cargo-category').value;
        const inlandMode = document.getElementById('inland-mode').value;
        const hsCode = document.getElementById('hs-code').value;
        const departureDate = new Date(dateInput.value);
        const originName = originSelect.value;
        const destName = destinationSelect.value;

        if (originName === destName || !originName || !destName) return;

        const sandbox = {
            redSea: document.getElementById('risk-redsea').checked,
            panama: document.getElementById('risk-panama').checked,
            strike: document.getElementById('risk-strike').checked
        };

        const carrier = carriers[mode].find(c => c.name === carrierName);
        const cargoInfo = cargoMetadata[category];
        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originName]; const dest = cityData[destName];
        const oHub = hubs[origin.hub] || {coords: [35, 129], status: 'green', name: originName};
        const dHub = hubs[dest.hub] || {coords: [40, -74], status: 'green', name: destName};

        let risks = [];
        let path = [oHub.coords];
        
        // --- Intelligent Routing ---
        let tHub = null;
        if (mode === 'sea') {
            if ((origin.country === "South Korea" || origin.country === "China") && dest.country === "Netherlands") {
                tHub = hubs["sgp-sin"]; path.push(tHub.coords);
            }
            if (sandbox.redSea) { path.push(waypoints.good_hope); risks.push("Red Sea Redirect"); }
            else if (dist(oHub.coords, dHub.coords) > 10000) path.push(waypoints.suez);
        }
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const totalDist = mDist + 1000; // adding inland buffers

        const speeds = { sea: 711, air: 20000, truck: 500, rail: 300 };
        let transitD = mDist / speeds[mode];
        let handlingD = (mode==='sea' ? 5 : 2) + (tHub ? 3 : 0);
        if (tier === 'premium') handlingD *= 0.6;
        if (sandbox.strike) { handlingD += 7; risks.push("Labor Strike"); }
        if (oHub.status === 'red' || dHub.status === 'red') { handlingD += 3; risks.push("Hub Congestion"); }

        const totalD = transitD + (1000/speeds[inlandMode]) + handlingD + 2;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        // --- Landed Cost Calculations ---
        const cw = mode === 'air' ? Math.max(weight * 1000, volume * 167) / 1000 : Math.max(weight, volume);
        const baseFreight = totalDist * (mode==='sea'?0.15:4.5) * cw * carrier.premium;
        const insurance = value * 0.003;
        const duty = value * (hsCode.startsWith('85') ? 0.0 : cargoInfo.duty);
        const vat = (value + baseFreight + duty) * cargoInfo.vat;
        const inventoryCost = (value * annualICC / 365) * totalD;
        const totalSpend = baseFreight + insurance + duty + vat + inventoryCost;
        
        const reliability = Math.round(carrier.rel * (risks.length > 0 ? 0.85 : 1.0) * 100);
        const co2Total = (totalDist * (mode==='sea'?25:500) * weight) / 1000;

        const t = translations[currentLang];
        const convert = (val) => {
            const sym = { USD: '$', KRW: '₩', EUR: '€' };
            return `${sym[currentCurrency]}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;
        };

        // Milestone Dates
        const d1 = new Date(departureDate);
        const d2 = new Date(departureDate); d2.setDate(d2.getDate() + 1 + handlingD/2);

        resultContainer.innerHTML = `
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
                    <!-- Detailed Timeline -->
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.journeyLog}</p><div class="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-100"><div class="flex gap-4 relative items-center group cursor-help"><div class="w-4 h-4 rounded-full bg-indigo-600 z-10 border-4 border-white shadow-sm"></div><div class="flex-1"><p class="text-xs font-bold text-gray-800">${originName} Departure</p><p class="text-[10px] text-gray-400">${d1.toLocaleDateString()}</p></div></div><div class="flex gap-4 relative items-center group cursor-help"><div class="w-4 h-4 rounded-full bg-indigo-400 z-10 border-4 border-white shadow-sm"></div><div class="flex-1"><p class="text-xs font-bold text-gray-800">Main Transit (${carrierName})</p><p class="text-[10px] text-indigo-500">${d2.toLocaleDateString()}</p></div></div><div class="flex gap-4 relative items-center group cursor-help"><div class="w-4 h-4 rounded-full bg-indigo-600 z-10 border-4 border-white shadow-sm"></div><div class="flex-1"><p class="text-xs font-bold text-gray-800">${destName} Arrival</p><p class="text-[10px] text-gray-400">ETA: ${eta.toLocaleDateString()}</p></div></div></div></div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between"><span>Freight + Handling</span><span class="font-bold">${convert(baseFreight)}</span></div>
                            <div class="flex justify-between text-blue-500"><span>Est. Duty & VAT</span><span class="font-bold">${convert(duty + vat)}</span></div>
                            <div class="flex justify-between text-orange-500"><span>ICC (Capital)</span><span class="font-bold">${convert(inventoryCost)}</span></div>
                            <div class="border-t pt-2 flex justify-between font-black text-gray-900 text-lg"><span>Total Landed cost</span><span>${convert(totalSpend)}</span></div>
                        </div>
                        <!-- Stacked Bar -->
                        <div class="h-3 w-full bg-gray-100 rounded-full flex overflow-hidden">
                            <div style="width: ${(baseFreight/totalSpend)*100}%" class="bg-indigo-500"></div>
                            <div style="width: ${((duty+vat)/totalSpend)*100}%" class="bg-blue-400"></div>
                            <div style="width: ${(inventoryCost/totalSpend)*100}%" class="bg-orange-400"></div>
                        </div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${Math.ceil(co2Total / 22)}</span><p class="text-[10px] text-indigo-100 pb-1">${t.treesMsg}</p></div>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${t.reliability}</p><p class="text-2xl font-black ${reliability > 80 ? 'text-green-500' : 'text-red-500'}">${reliability}%</p></div>
                        <div class="text-right"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network Status</p><p class="text-[10px] font-bold text-gray-700 uppercase">${risks.length > 0 ? risks[0] : 'Stable'}</p></div>
                    </div>
                </div>

                <div id="tab-content-customs" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Required Checklist: ${dest.country}</p>
                        <ul class="space-y-2">
                            ${(cargoInfo.docs).map(doc => `<li class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-xs font-semibold text-gray-700"><input type="checkbox" class="rounded text-indigo-600"> ${doc}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        renderMap(path, oHub, dHub, risks, sandbox);
        updateTicker(oHub, dHub, risks);
        
        window.currentAnalysis = { originName, destName, mode, totalD, eta, convert, totalSpend, reliability, risks, carrierName };
    }

    function updateTicker(o, d, risks) {
        let news = `<span>Live corridor analysis: ${o.name} to ${d.name}.</span>`;
        if (risks.includes("Red Sea Redirect")) news += "<span>Vessels rerouting via Good Hope (+12 days).</span>";
        newsTicker.innerHTML = news + "<span>Shanghai efficiency at 92%.</span><span>EU CBAM phase-in active.</span>";
    }

    // --- Currency Switching ---
    const setCurrency = (c) => {
        currentCurrency = c;
        ['usd', 'krw', 'eur'].forEach(id => {
            const btn = document.getElementById(`curr-${id}`);
            btn.className = `px-2 py-1 rounded text-[10px] font-bold transition-all ${id===c.toLowerCase()?'bg-white shadow-sm text-indigo-600':'text-gray-500'}`;
        });
        if (window.currentAnalysis) calculateAndDisplay();
    };
    document.getElementById('curr-usd').onclick = () => setCurrency('USD');
    document.getElementById('curr-krw').onclick = () => setCurrency('KRW');
    document.getElementById('curr-eur').onclick = () => setCurrency('EUR');

    window.copyExecutiveSummary = () => {
        const a = window.currentAnalysis; if (!a) return;
        const text = `[EXECUTIVE SUMMARY]\n\nRoute: ${a.originName} to ${a.destName}\nCarrier: ${a.carrierName}\nLead Time: ${Math.round(a.totalD)} Days\nLanded Cost: ${a.convert(a.totalSpend)}\nReliability: ${a.reliability}%\n\nStrategic Insight: ${a.risks.length > 0 ? 'Risk alert for ' + a.risks.join(', ') : 'Network stable.'}`;
        navigator.clipboard.writeText(text); alert("Summary Copied!");
    };

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function renderMap(path, oH, dH, risks, sandbox) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline || l instanceof L.Circle) map.removeLayer(l); });
        
        // Risk Zones
        if (sandbox.redSea) L.circle(riskZones.redsea.coords, { radius: riskZones.redsea.radius, color: 'red', fillOpacity: 0.1, weight: 1 }).addTo(map);
        if (sandbox.panama) L.circle(riskZones.panama.coords, { radius: riskZones.panama.radius, color: 'orange', fillOpacity: 0.1, weight: 1 }).addTo(map);

        const dot = (color) => L.divIcon({ html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md bg-${color}-500"></div>`, className: 'custom-div-icon', iconSize: [16, 16] });
        L.marker(oH.coords, {icon: dot(oH.status)}).addTo(map).bindPopup(`<b>${oH.name}</b><br>Status: ${oH.congestion}`);
        L.marker(dH.coords, {icon: dot(dH.status)}).addTo(map).bindPopup(`<b>${dH.name}</b><br>Status: ${dH.congestion}`);
        
        L.polyline(path, {color: '#4f46e5', weight: 5, className: 'leaflet-ant-path'}).addTo(map);
        map.fitBounds([oH.coords, dH.coords], {padding: [50, 50]});
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
