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
            aiRec: "Strategic Recommendation",
            esgOffset: "Sustainability Impact",
            carbonTax: "Est. Carbon Tax (Future)",
            treesMsg: "trees to offset this shipment",
            volatility: "Lane Reliability Score",
            recentTitle: "Recent Analyses",
            shareBtn: "Share Link",
            copySummary: "Copy Summary",
            exportCsv: "Export CSV",
            insurance: "Cargo Insurance",
            importVat: "Import VAT",
            weatherAlert: "Seasonal Weather Impact",
            disclaimer: "• 16kts avg. speed. Insurance at 0.3% of value. VAT varies by region."
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
            aiRec: "전략적 솔루션 제언",
            esgOffset: "지속가능성 영향",
            carbonTax: "예상 탄소세 (미래)",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "노선 정시 신뢰도 점수",
            recentTitle: "최근 분석 기록",
            shareBtn: "링크 공유",
            copySummary: "요약 복사",
            exportCsv: "CSV 내보내기",
            insurance: "적하 보험료",
            importVat: "수입 부가세",
            weatherAlert: "계절성 기상 영향 발생",
            disclaimer: "• 16노트 평균속도 기준. 보험료는 가액의 0.3%, 부가세는 지역별 상이."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    const carriers = {
        sea: [ { name: "Maersk", reliability: 0.92, premium: 1.1 }, { name: "MSC", reliability: 0.85, premium: 1.0 }, { name: "HMM", reliability: 0.88, premium: 1.05 } ],
        air: [ { name: "Korean Air Cargo", reliability: 0.98, premium: 1.2 }, { name: "FedEx Express", reliability: 0.99, premium: 1.5 }, { name: "Emirates SkyCargo", reliability: 0.95, premium: 1.1 } ]
    };

    const cargoTypes = {
        general: { duty: 0.08, vat: 0.10, docs: ["Commercial Invoice", "Packing List"] },
        electronics: { duty: 0.0, vat: 0.10, docs: ["KC/CE Certificate", "FTA Certificate"] },
        textiles: { duty: 0.13, vat: 0.10, docs: ["Origin Declaration", "Inspection Cert"] },
        chemicals: { duty: 0.06, vat: 0.10, docs: ["MSDS (SDS)", "DG Declaration"] }
    };

    const portCities = {
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea" },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China" },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore" },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands" },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA" }
    };

    const airportCities = {
        "ICN (Incheon)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea" },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", country: "Germany" },
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA" }
    };

    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453], status: "green" },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407], status: "green" },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833], status: "red" },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398], status: "yellow" },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450], status: "yellow" },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764], status: "red" }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "suez": [29.9, 32.5], "good_hope": [-34.35, 18.47] };

    const modeSelect = document.getElementById('transport-mode');
    const carrierSelect = document.getElementById('carrier-select');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const cargoCategory = document.getElementById('cargo-category');
    const resultContainer = document.getElementById('result');
    const executiveActions = document.getElementById('executive-actions');

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
        const category = cargoCategory.value;
        const departureDate = new Date(dateInput.value);
        const originName = originSelect.value;
        const destName = destinationSelect.value;

        if (originName === destName || !originName || !destName) return;

        const carrier = carriers[mode].find(c => c.name === carrierName);
        const cargoInfo = cargoTypes[category];
        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originName]; const dest = cityData[destName];
        const oHub = hubs[origin.hub] || {coords: origin.coords, status: 'green'};
        const dHub = hubs[dest.hub] || {coords: dest.coords, status: 'green'};

        // --- Weather Risk Simulation ---
        let risks = [];
        const month = departureDate.getMonth();
        if (mode === 'sea' && (month >= 6 && month <= 9) && origin.coords[1] > 100) risks.push("Typhoon Season Alert");
        if (dest.coords[0] > 45 && (month >= 11 || month <= 1)) risks.push("Winter Freezing Delay");

        // --- Path Logic ---
        let path = [oHub.coords];
        if (mode === 'sea' && risks.includes("Typhoon Season Alert")) {
            path.push([15.0, 130.0]); // Avoidance path
        }
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const totalDist = mDist + dist(origin.coords, oHub.coords) + dist(dHub.coords, dest.coords);

        const speeds = { sea: 711, air: 20000 };
        let transitD = mDist / speeds[mode];
        let handlingD = (mode==='sea' ? 5 : 2) + (risks.length > 0 ? 3 : 0);

        const totalD = transitD + (dist(origin.coords, oHub.coords)+dist(dHub.coords, dest.coords))/500 + handlingD + 2;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        // --- Precise Landed Cost Logic ---
        const cw = mode === 'air' ? Math.max(weight * 1000, volume * 167) / 1000 : Math.max(weight, volume);
        const baseFreight = totalDist * (mode==='sea'?0.15:4.5) * cw * carrier.premium;
        const insurance = value * 0.003; // 0.3% standard
        const duty = value * cargoInfo.duty;
        const vat = (value + baseFreight + duty) * (cargoInfo.vat || 0.1);
        const inventoryCost = (value * annualICC / 365) * totalD;
        const totalSpend = baseFreight + insurance + duty + vat + inventoryCost;
        
        const reliability = Math.round(carrier.reliability * (risks.length > 0 ? 0.85 : 1.0) * 100);
        const co2Total = (totalDist * (mode==='sea'?25:500) * weight) / 1000;

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
                    ${risks.length > 0 ? `<div class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm"><p class="text-[10px] font-bold text-red-600 uppercase mb-1">${t.weatherAlert}</p><p class="text-xs font-semibold text-gray-700">${risks.join(' & ')}</p></div>` : ''}
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${t.volatility}</p><p class="text-2xl font-black ${reliability > 85 ? 'text-green-500' : 'text-orange-500'}">${reliability}%</p></div>
                        <div class="text-right"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Carrier</p><p class="text-sm font-bold text-gray-700">${carrier.name}</p></div>
                    </div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between"><span>Freight Cost</span><span class="font-bold">${convert(baseFreight)}</span></div>
                            <div class="flex justify-between text-blue-500"><span>Duty + ${t.importVat}</span><span class="font-bold">${convert(duty + vat)}</span></div>
                            <div class="flex justify-between text-indigo-400"><span>${t.insurance}</span><span class="font-bold">${convert(insurance)}</span></div>
                            <div class="flex justify-between text-orange-500"><span>ICC (Capital tying)</span><span class="font-bold">${convert(inventoryCost)}</span></div>
                            <div class="border-t pt-2 flex justify-between font-black text-gray-900 text-lg"><span>${t.totalImpact}</span><span>${convert(totalSpend)}</span></div>
                        </div>
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
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        renderMap(path, origin, dest, oHub, dHub, originName, destName, risks);
        window.currentAnalysis = { originName, destName, mode, totalD, eta, convert, totalSpend, reliability, carrierName };
    }

    window.copyExecutiveSummary = () => {
        const a = window.currentAnalysis; if (!a) return;
        const text = `[EXECUTIVE LANDED COST ANALYSIS]\n\nRoute: ${a.originName} to ${a.destName}\nMode: ${a.mode.toUpperCase()}\nCarrier: ${a.carrierName}\nLead Time: ${Math.round(a.totalD)} Days\nLanded Spend: ${a.convert(a.totalSpend)}\nReliability: ${a.reliability}%\n\nGenerated by LeadTime Intelligence.`;
        navigator.clipboard.writeText(text); alert("Executive Summary Copied!");
    };

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function renderMap(path, o, d, oH, dH, oN, dN, risks) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline || l instanceof L.Circle) map.removeLayer(l); });
        
        // Visual Weather Warning
        if (risks.includes("Typhoon Season Alert")) {
            L.circle([20.0, 130.0], { radius: 1500000, color: 'blue', fillOpacity: 0.05, weight: 1 }).addTo(map).bindPopup("Active Typhoon Corridor");
        }

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
