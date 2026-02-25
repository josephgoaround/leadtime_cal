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
            tabStrategy: "Strategic Comp",
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
            compTitle: "As-Is vs To-Be Strategy",
            disclaimer: "• 16kts avg. speed. Strategic advice based on 2026 geo-trends."
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
            tabStrategy: "전략 비교",
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
            compTitle: "현재 노선 vs 전략적 대안",
            disclaimer: "• 16노트 평균속도 기준. 전략 제언은 2026년 지오트렌드를 반영합니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    // --- Enterprise Hub Intelligence ---
    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453], status: "green", congestion: "Low", type: "Sea", country: "South Korea" },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407], status: "green", congestion: "Stable", type: "Air", country: "South Korea" },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833], status: "red", congestion: "High", type: "Sea", country: "China" },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398], status: "yellow", congestion: "Medium", type: "Sea", country: "Singapore" },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450], status: "yellow", congestion: "Medium", type: "Sea", country: "Netherlands" },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764], status: "red", congestion: "High", type: "Sea", country: "USA" },
        "mex-man": { name: "Manzanillo Hub", coords: [19.0522, -104.3158], status: "green", congestion: "Low", type: "Sea", country: "Mexico" },
        "vnm-hcm": { name: "Ho Chi Minh Port", coords: [10.7626, 106.6602], status: "green", congestion: "Stable", type: "Sea", country: "Vietnam" }
    };

    const portCities = {
        "Port of Busan": { hub: "kor-pus", country: "South Korea" },
        "Port of Shanghai": { hub: "chn-sha", country: "China" },
        "Port of Singapore": { hub: "sgp-sin", country: "Singapore" },
        "Port of Rotterdam": { hub: "nld-rot", country: "Netherlands" },
        "Port of Los Angeles": { hub: "usa-lax", country: "USA" },
        "Port of Manzanillo": { hub: "mex-man", country: "Mexico" },
        "Port of Ho Chi Minh": { hub: "vnm-hcm", country: "Vietnam" }
    };

    const airportCities = {
        "ICN (Incheon)": { hub: "kor-icn", country: "South Korea" },
        "JFK (New York)": { hub: "usa-jfk", country: "USA" }
    };

    const cargoMetadata = {
        general: { duty: 0.08, vat: 0.10 },
        electronics: { duty: 0.0, vat: 0.10 },
        textiles: { duty: 0.12, vat: 0.10 }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "suez": [29.9, 32.5], "good_hope": [-34.35, 18.47] };
    const riskZones = {
        "redsea": { coords: [18.0, 40.0], radius: 1200000, color: 'red', label: "Conflict Area" },
        "panama": { coords: [9.1, -79.7], radius: 600000, color: 'orange', label: "Drought Delay" }
    };

    const modeSelect = document.getElementById('transport-mode');
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
        const category = document.getElementById('cargo-category').value;
        const departureDate = new Date(dateInput.value);
        const originName = originSelect.value;
        const destName = destinationSelect.value;

        if (originName === destName || !originName || !destName) return;

        const oHub = hubs[portCities[originName]?.hub || airportCities[originName]?.hub];
        const dHub = hubs[portCities[destName]?.hub || airportCities[destName]?.hub];
        
        const sandbox = {
            redSea: document.getElementById('risk-redsea').checked,
            panama: document.getElementById('risk-panama').checked,
            strike: document.getElementById('risk-strike').checked
        };

        const result = solveRoute(oHub, dHub, mode, weight, value, category, sandbox);
        
        // --- Strategy Logic: Near-shoring Alternative ---
        let alternative = null;
        if (oHub.country === "China" && dHub.country === "USA") {
            alternative = solveRoute(hubs["mex-man"], dHub, "sea", weight, value, category, {redSea: false, panama: false, strike: false});
            alternative.strategyLabel = "Mexico Near-shoring";
        } else if (mode === "sea") {
            alternative = solveRoute(oHub, dHub, "air", weight, value, category, sandbox);
            alternative.strategyLabel = "Air Freight Priority";
        }

        const t = translations[currentLang];
        const convert = (val) => {
            const sym = { USD: '$', KRW: '₩', EUR: '€' };
            return `${sym[currentCurrency]}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;
        };

        resultContainer.innerHTML = `
            <div class="space-y-4 animate-fade-in">
                <div class="flex bg-gray-100 p-1 rounded-xl">
                    <button onclick="switchTab('overview')" id="tab-overview" class="flex-1 py-2 text-[9px] font-bold rounded-lg bg-white shadow-sm text-indigo-600">${t.tabOverview}</button>
                    <button onclick="switchTab('finance')" id="tab-finance" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabFinance}</button>
                    <button onclick="switchTab('strategy')" id="tab-strategy" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabStrategy}</button>
                </div>

                <div id="tab-content-overview" class="tab-pane space-y-4">
                    <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                        <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                        <p class="text-5xl font-black text-indigo-900">${Math.round(result.totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${result.eta.toLocaleDateString()}</p>
                    </div>
                    ${result.recommendation ? `<div class="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl shadow-sm"><p class="text-[10px] font-bold text-indigo-600 uppercase mb-1">${t.aiRec}</p><p class="text-xs font-semibold text-gray-700 leading-relaxed">${result.recommendation}</p></div>` : ''}
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between"><span>Freight + Handling</span><span class="font-bold">${convert(result.freight)}</span></div>
                            <div class="flex justify-between text-orange-500"><span>ICC (Capital tying)</span><span class="font-bold">${convert(result.icc)}</span></div>
                            <div class="border-t pt-2 flex justify-between font-black text-gray-900 text-lg"><span>Landed Cost</span><span>${convert(result.totalSpend)}</span></div>
                        </div>
                    </div>
                </div>

                <div id="tab-content-strategy" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.compTitle}</p>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p class="text-[8px] font-bold text-gray-400 uppercase mb-1">Current Route</p>
                                <p class="text-xl font-black text-gray-800">${Math.round(result.totalD)} <span class="text-[10px]">Days</span></p>
                                <p class="text-xs font-bold text-gray-500">${convert(result.totalSpend)}</p>
                            </div>
                            <div class="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                                <p class="text-[8px] font-bold text-indigo-400 uppercase mb-1">${alternative.strategyLabel}</p>
                                <p class="text-xl font-black text-indigo-600">${Math.round(alternative.totalD)} <span class="text-[10px]">Days</span></p>
                                <p class="text-xs font-bold text-indigo-500">${convert(alternative.totalSpend)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        renderMap(result.path, oHub, dHub, result.risks, sandbox);
        updateTicker(oHub, dHub, result.risks);
        
        window.currentAnalysis = { originName, destName, mode, totalD: result.totalD, eta: result.eta, convert, totalSpend: result.totalSpend, reliability: result.reliability, risks: result.risks };
    }

    function solveRoute(o, d, mode, weight, value, category, sandbox) {
        let path = [o.coords];
        let risks = [];
        let transitD = 0;
        let handlingD = (mode==='sea' ? 5 : 2);

        if (mode === 'sea') {
            if (sandbox.redSea) { path.push(waypoints.good_hope); risks.push("Red Sea Redirect"); }
            else if (dist(o.coords, d.coords) > 8000) path.push(waypoints.suez);
        }
        path.push(d.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const speeds = { sea: 711, air: 20000 };
        transitD = mDist / speeds[mode];
        if (risks.includes("Red Sea Redirect")) transitD += 12;
        if (sandbox.strike) handlingD += 7;

        const totalD = transitD + (1000/500) + handlingD + 2;
        const eta = new Date(dateInput.value); eta.setDate(eta.getDate() + totalD);
        
        const freight = mDist * (mode==='sea'?0.15:4.5) * weight;
        const icc = (value * annualICC / 365) * totalD;
        const totalSpend = freight + icc + (value * cargoMetadata[category].duty);
        const reliability = Math.max(25, 98 - (risks.length * 20));

        let rec = "";
        if (mode === 'sea' && icc > freight) rec = "AI Rec: High-value cargo. Switching to AIR saves more in capital costs.";

        return { totalD, eta, freight, icc, totalSpend, reliability, risks, path, recommendation: rec };
    }

    function updateTicker(o, d, risks) {
        let news = `<span>Live Analysis: ${o.name} to ${d.name}.</span>`;
        if (risks.includes("Red Sea Redirect")) news += "<span>Alert: Suez volumes down 42% YoY. Rerouting via Good Hope.</span>";
        newsTicker.innerHTML = news + "<span>Global air capacity rising.</span><span>EU CBAM implementation starts.</span>";
    }

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function renderMap(path, oH, dH, risks, sandbox) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline || l instanceof L.Circle) map.removeLayer(l); });
        
        if (sandbox.redSea) L.circle(riskZones.redsea.coords, { radius: riskZones.redsea.radius, color: 'red', fillOpacity: 0.1, weight: 1 }).addTo(map);
        if (sandbox.panama) L.circle(riskZones.panama.coords, { radius: riskZones.panama.radius, color: 'orange', fillOpacity: 0.1, weight: 1 }).addTo(map);

        const dot = (color) => L.divIcon({ html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md bg-${color}-500"></div>`, className: 'custom-div-icon', iconSize: [16, 16] });
        L.marker(oH.coords, {icon: dot(oH.status)}).addTo(map).bindPopup(oH.name);
        L.marker(dH.coords, {icon: dot(dH.status)}).addTo(map).bindPopup(dH.name);
        
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
