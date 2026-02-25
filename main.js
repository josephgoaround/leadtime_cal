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
            aiRec: "Strategic SCM Advisory",
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
            aiRec: "전략적 SCM 제언",
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

    // --- Global Hub Intelligence Database ---
    const hubs = {
        "kor-pus": { name: "Port of Busan", coords: [35.1069, 129.0453], status: "green", congestion: "Low", type: "Sea", country: "South Korea" },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407], status: "green", congestion: "Stable", type: "Air", country: "South Korea" },
        "chn-sha": { name: "Port of Shanghai", coords: [31.3833, 121.5833], status: "red", congestion: "High", type: "Sea", country: "China" },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398], status: "yellow", congestion: "Medium", type: "Sea", country: "Singapore" },
        "nld-rot": { name: "Port of Rotterdam", coords: [51.9490, 4.1450], status: "yellow", congestion: "Medium", type: "Sea", country: "Netherlands" },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764], status: "red", congestion: "High", type: "Sea", country: "USA" }
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
        "JFK (New York)": { hub: "usa-jfk", country: "USA" }
    };

    const cargoMetadata = {
        general: { duty: 0.08, docs: ["Commercial Invoice", "Packing List"] },
        electronics: { duty: 0.0, docs: ["KC/CE Certificate", "FTA Origin"] },
        textiles: { duty: 0.12, docs: ["Origin Declaration", "Inspection Cert"] }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "suez": [29.9, 32.5], "good_hope": [-34.35, 18.47] };

    const modeSelect = document.getElementById('transport-mode');
    const carrierSelect = document.getElementById('carrier-select');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const serviceTier = document.getElementById('service-tier');
    const resultContainer = document.getElementById('result');
    const executiveActions = document.getElementById('executive-actions');
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
        const tier = serviceTier.value;
        const category = document.getElementById('cargo-category').value;
        const inlandMode = document.getElementById('inland-mode').value;
        const hsCode = document.getElementById('hs-code').value;
        const departureDate = new Date(dateInput.value);
        const originName = originSelect.value;
        const destName = destinationSelect.value;

        if (originName === destName || !originName || !destName) return;

        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originName]; const dest = cityData[destName];
        const oHub = hubs[origin.hub] || {coords: [35, 129], status: 'green', name: originName};
        const dHub = hubs[dest.hub] || {coords: [40, -74], status: 'green', name: destName};

        let risks = [];
        let path = [oHub.coords];
        
        // --- Intelligent Routing & Transshipment ---
        let tHub = null;
        if (mode === 'sea' && (oHub.country === "China" || oHub.country === "South Korea") && dest.country === "Netherlands") {
            tHub = hubs["sgp-sin"]; path.push(tHub.coords);
        }
        
        const sandbox = {
            redSea: document.getElementById('risk-redsea').checked,
            panama: document.getElementById('risk-panama').checked,
            strike: document.getElementById('risk-strike').checked
        };

        if (mode === 'sea' && sandbox.redSea) { path.push(waypoints.good_hope); risks.push("Red Sea Redirect"); }
        else if (mode === 'sea' && dist(oHub.coords, dHub.coords) > 8000) path.push(waypoints.suez);
        
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const totalDist = mDist + 1000; // inland buffer

        const speeds = { sea: 711, air: 20000, truck: 500, rail: 300 };
        const co2Factors = { sea: 25, air: 500, truck: 80, rail: 20 };
        
        let transitD = mDist / speeds[mode];
        let handlingD = (mode==='sea' ? 5 : 2) + (tHub ? 3 : 0);
        if (tier === 'premium') handlingD *= 0.6;
        if (sandbox.strike) { handlingD += 7; risks.push("Labor Strike"); }
        if (oHub.status === 'red' || dHub.status === 'red') { handlingD += 3; risks.push("Hub Congestion"); }

        const totalD = transitD + (1000/speeds[inlandMode]) + handlingD + 2;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        // --- Landed Cost Calculations ---
        const baseFreight = (mDist * (mode==='sea'?0.15:4.5) + 1000 * (inlandMode==='truck'?0.8:0.3)) * weight;
        const dutyRate = hsCode.startsWith('85') ? 0.0 : cargoMetadata[category].duty;
        const inventoryCost = (value * annualICC / 365) * totalD;
        const totalSpend = baseFreight + inventoryCost + (value * dutyRate);
        
        const co2LegMain = (mDist * co2Factors[mode] * weight) / 1000;
        const co2LegInland = (1000 * co2Factors[inlandMode] * weight) / 1000;
        const co2Total = co2LegMain + co2LegInland;
        const reliability = Math.max(25, 98 - (risks.length * 15));

        const t = translations[currentLang];
        const convert = (val) => {
            const sym = { USD: '$', KRW: '₩', EUR: '€' };
            return `${sym[currentCurrency]}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;
        };

        // --- Strategic Recommendation ---
        let recommendation = "";
        if (mode === 'sea' && (inventoryCost > baseFreight)) {
            recommendation = currentLang==='ko' ? "AI 제언: 고가치 화물입니다. 항공 전환 시 재고 유지 비용 절감이 운임 상승분보다 큽니다." : "AI Rec: High-value cargo. Switching to AIR saves more in capital costs than the freight premium.";
        } else if (risks.length > 0) {
            recommendation = currentLang==='ko' ? "리스크 대응: 경로상의 병목이 심각합니다. 긴급 물량은 니어쇼어링 또는 항공 분할 선적을 권장합니다." : "Risk Strategic: Significant lane stress. Recommend split-shipment via AIR for urgent inventory.";
        }

        resultContainer.innerHTML = `
            <div class="space-y-4 animate-fade-in">
                <div class="flex bg-gray-100 p-1 rounded-xl">
                    <button onclick="switchTab('overview')" id="tab-overview" class="flex-1 py-2 text-[9px] font-bold rounded-lg bg-white shadow-sm text-indigo-600">${t.tabOverview}</button>
                    <button onclick="switchTab('finance')" id="tab-finance" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabFinance}</button>
                    <button onclick="switchTab('risk')" id="tab-risk" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabRisk}</button>
                </div>

                <div id="tab-content-overview" class="tab-pane space-y-4">
                    <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                        <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                        <p class="text-5xl font-black text-indigo-900">${Math.round(totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${eta.toLocaleDateString()}</p>
                    </div>
                    ${recommendation ? `<div class="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl shadow-sm"><p class="text-[10px] font-bold text-indigo-600 uppercase mb-1">${t.aiRec}</p><p class="text-xs font-semibold text-gray-700 leading-relaxed">${recommendation}</p></div>` : ''}
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${t.volatility}</p><p class="text-2xl font-black ${reliability > 80 ? 'text-green-500' : 'text-red-500'}">${reliability}%</p></div>
                        <div class="text-right"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Landed Spend</p><p class="text-lg font-bold text-gray-700">${convert(totalSpend)}</p></div>
                    </div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between"><span>Freight + Inland</span><span class="font-bold">${convert(baseFreight)}</span></div>
                            <div class="flex justify-between text-blue-500"><span>Est. Duty (${(dutyRate*100).toFixed(1)}%)</span><span class="font-bold">${convert(value * dutyRate)}</span></div>
                            <div class="flex justify-between text-orange-500"><span>ICC (Financial Loss)</span><span class="font-bold">${convert(inventoryCost)}</span></div>
                            <div class="border-t pt-2 flex justify-between font-black text-gray-900 text-lg"><span>Total landed cost</span><span>${convert(totalSpend)}</span></div>
                        </div>
                        <div class="h-3 w-full bg-gray-100 rounded-full flex overflow-hidden">
                            <div style="width: ${(baseFreight/totalSpend)*100}%" class="bg-indigo-500"></div>
                            <div style="width: ${((value*dutyRate)/totalSpend)*100}%" class="bg-blue-400"></div>
                            <div style="width: ${(inventoryCost/totalSpend)*100}%" class="bg-orange-400"></div>
                        </div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${Math.ceil(co2Total / 22)}</span><p class="text-[10px] text-indigo-100 pb-1">${t.treesMsg}</p></div>
                    </div>
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ESG Breakdown (CO2)</p>
                        <div class="flex justify-between text-xs"><span>Main Leg (${mode})</span><span class="font-bold">${(co2LegMain/1000).toFixed(2)}t</span></div>
                        <div class="flex justify-between text-xs"><span>Inland Leg (${inlandMode})</span><span class="font-bold">${(co2LegInland/1000).toFixed(2)}t</span></div>
                    </div>
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        renderMap(path, oHub, dHub, risks, tHub);
        updateTicker(oHub, dHub, risks);
        
        window.currentAnalysis = { originName, destName, mode, totalD, eta, convert, totalSpend, reliability, risks };
    }

    function updateTicker(o, d, risks) {
        let news = `<span>Live Analysis: ${o.name} to ${d.name}.</span>`;
        if (risks.includes("Red Sea Redirect")) news += "<span>Alert: Vessels rerouting via Good Hope (+12 days).</span>";
        newsTicker.innerHTML = news + "<span>Global air cargo demand rising.</span><span>Shanghai efficiency at 92%.</span>";
    }

    // --- Currency Handling ---
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
        const text = `[EXECUTIVE SCM REPORT]\n\nRoute: ${a.originName} to ${a.destName}\nLead Time: ${Math.round(a.totalD)} Days\nLanded Cost: ${a.convert(a.totalSpend)}\nReliability: ${a.reliability}%\n\nGenerated by LeadTime Intelligence AI.`;
        navigator.clipboard.writeText(text); alert("Summary Copied!");
    };

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function renderMap(path, oH, dH, risks, tH) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
        const dot = (color) => L.divIcon({ html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md bg-${color}-500"></div>`, className: 'custom-div-icon', iconSize: [16, 16] });
        L.marker(oH.coords, {icon: dot(oH.status)}).addTo(map).bindPopup(oH.name);
        L.marker(dH.coords, {icon: dot(dH.status)}).addTo(map).bindPopup(dH.name);
        if (tH) L.marker(tH.coords, {icon: dot('indigo')}).addTo(map).bindPopup(`<b>${tH.name} Hub</b><br>T/S Handling Active`);
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
