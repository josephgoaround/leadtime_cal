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
            labelCargo: "Cargo Category",
            chargeableWt: "Chargeable Weight",
            disclaimer: "• 16kts avg. speed. Reliability accounts for Carrier performance."
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
            carbonTax: "예상 탄소세 (미래)",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "노선 정시 신뢰도 점수",
            recentTitle: "최근 분석 기록",
            shareBtn: "링크 공유",
            copySummary: "요약 복사",
            exportCsv: "CSV 내보내기",
            chargeableWt: "운임 청구 중량",
            disclaimer: "• 16노트 평균속도 기준. 신뢰도는 선사별 퍼포먼스를 반영합니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    const carriers = {
        sea: [
            { name: "Maersk", reliability: 0.92, premium: 1.1 },
            { name: "MSC", reliability: 0.85, premium: 1.0 },
            { name: "HMM", reliability: 0.88, premium: 1.05 }
        ],
        air: [
            { name: "Korean Air Cargo", reliability: 0.98, premium: 1.2 },
            { name: "FedEx Express", reliability: 0.99, premium: 1.5 },
            { name: "Emirates SkyCargo", reliability: 0.95, premium: 1.1 }
        ]
    };

    const cargoTypes = {
        general: { duty: 0.08, docs: ["Commercial Invoice", "Packing List"] },
        electronics: { duty: 0.0, docs: ["KC/CE Certificate", "FTA Certificate", "Invoice"] },
        textiles: { duty: 0.13, docs: ["Origin Declaration", "Inspection Certificate"] },
        chemicals: { duty: 0.06, docs: ["MSDS (SDS)", "DG Declaration", "UN Packaging Cert"] }
    };

    const portCities = {
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea", status: "green" },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China", status: "red" },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore", status: "yellow" },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands", status: "yellow" },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", status: "red" }
    };

    const airportCities = {
        "ICN (Incheon)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", status: "green" },
        "PVG (Shanghai)": { coords: [31.1443, 121.8083], hub: "chn-pvg", country: "China", status: "red" },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", country: "Germany", status: "yellow" },
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA", status: "yellow" }
    };

    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453] },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407] },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833] },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398] },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450] },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764] }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "suez": [29.9, 32.5] };

    const modeSelect = document.getElementById('transport-mode');
    const carrierSelect = document.getElementById('carrier-select');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const serviceTier = document.getElementById('service-tier');
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
        const value = parseFloat(document.getElementById('cargo-value').value) || 50000;
        const category = cargoCategory.value;
        const tier = serviceTier.value;
        const originName = originSelect.value;
        const destName = destinationSelect.value;
        const departureDate = new Date(dateInput.value);

        if (originName === destName || !originName || !destName) return;

        const carrier = carriers[mode].find(c => c.name === carrierName);
        const cargoInfo = cargoTypes[category];
        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originName]; const dest = cityData[destName];
        const oHub = hubs[origin.hub]; const dHub = hubs[dest.hub];

        // Chargeable Weight (Simplified for demo: 1:6 Air, 1:1 Sea)
        const volume = parseFloat(document.getElementById('cargo-volume').value) || 2;
        const cw = mode === 'air' ? Math.max(weight * 1000, volume * 167) / 1000 : Math.max(weight, volume);

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

        const baseFreight = totalDist * (mode==='sea'?0.15:4.5) * cw * carrier.premium;
        const dutyCost = value * cargoInfo.duty;
        const inventoryCost = (value * annualICC / 365) * totalD;
        const totalSpend = baseFreight + dutyCost + inventoryCost;
        
        const reliability = Math.round(carrier.reliability * (risks.length > 0 ? 0.8 : 1.0) * 100);
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
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${t.volatility}</p><p class="text-2xl font-black ${reliability > 85 ? 'text-green-500' : 'text-orange-500'}">${reliability}%</p></div>
                        <div class="text-right"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Carrier</p><p class="text-sm font-bold text-gray-700">${carrier.name}</p></div>
                    </div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between"><span>Freight (${carrier.name})</span><span class="font-bold">${convert(baseFreight)}</span></div>
                            <div class="flex justify-between text-blue-500"><span>Duty (${(cargoInfo.duty*100).toFixed(1)}%)</span><span class="font-bold">${convert(dutyCost)}</span></div>
                            <div class="flex justify-between text-orange-500"><span>ICC (Financial)</span><span class="font-bold">${convert(inventoryCost)}</span></div>
                            <div class="border-t pt-2 flex justify-between font-black text-gray-900 text-lg"><span>Landed Cost</span><span>${convert(totalSpend)}</span></div>
                        </div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">Required Compliance: ${category.toUpperCase()}</p>
                        <ul class="text-[10px] space-y-1 opacity-90">${cargoInfo.docs.map(d => `<li>• ${d}</li>`).join('')}</ul>
                    </div>
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        renderMap(path, origin, dest, oHub, dHub, originName, destName);
        window.currentAnalysis = { originName, destName, mode, totalD, eta, convert, totalSpend, reliability, carrierName };
    }

    window.copyExecutiveSummary = () => {
        const a = window.currentAnalysis; if (!a) return;
        const text = `[EXECUTIVE SUMMARY]\n\nRoute: ${a.originName} to ${a.destName}\nCarrier: ${a.carrierName}\nLead Time: ${Math.round(a.totalD)} Days\nLanded Cost: ${a.convert(a.totalSpend)}\nReliability: ${a.reliability}%\n\nGenerated by LeadTime Intelligence.`;
        navigator.clipboard.writeText(text); alert("Executive Summary Copied!");
    };

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function renderMap(path, o, d, oH, dH, oN, dN) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
        L.marker(o.coords).addTo(map).bindPopup(oN); L.marker(d.coords).addTo(map).bindPopup(dN);
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
