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
            aiRec: "Strategic SCM Advisory",
            esgOffset: "Sustainability Impact",
            carbonTax: "Est. Carbon Tax (Future)",
            treesMsg: "trees to offset this shipment",
            volatility: "Lane Reliability Score",
            recentTitle: "Recent Analyses",
            shareBtn: "Share Link",
            copySummary: "Copy Summary",
            exportCsv: "Export CSV",
            disclaimer: "• 16kts avg. speed. Recommendations based on 2026 Geo-trends."
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
            aiRec: "전략적 SCM 제언",
            esgOffset: "지속가능성 영향",
            carbonTax: "예상 탄소세 (미래)",
            treesMsg: "탄소 상쇄를 위한 소나무 수",
            volatility: "노선 정시 신뢰도 점수",
            recentTitle: "최근 분석 기록",
            shareBtn: "링크 공유",
            copySummary: "요약 복사",
            exportCsv: "CSV 내보내기",
            disclaimer: "• 16노트 평균속도 기준. 제언은 2026년 지오트렌드를 반영합니다."
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
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", duty: 0.05, status: "red" },
        "Port of Manzanillo": { coords: [19.0522, -104.3158], hub: "mex-man", country: "Mexico", duty: 0.03, status: "green" }
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
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398] },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450] },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764] }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "good_hope": [-34.35, 18.47], "suez": [29.9, 32.5] };

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
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
        const tier = document.getElementById('service-tier').value;
        const originName = originSelect.value;
        const destName = destinationSelect.value;
        const departureDate = new Date(dateInput.value);

        if (originName === destName || !originName || !destName) return;

        const sandbox = {
            redSea: document.getElementById('risk-redsea').checked,
            panama: document.getElementById('risk-panama').checked,
            strike: document.getElementById('risk-strike').checked
        };

        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originName]; const dest = cityData[destName];
        const oHub = hubs[origin.hub] || {coords: origin.coords};
        const dHub = hubs[dest.hub] || {coords: dest.coords};

        let risks = [];
        let path = [oHub.coords];
        if (Math.abs(oHub.coords[1] - dHub.coords[1]) > 180) path.push(waypoints.pacific_mid);
        else if ((oHub.coords[1]>60 && dHub.coords[1]<20) || (oHub.coords[1]<20 && dHub.coords[1]>60)) {
            if (sandbox.redSea && mode === 'sea') { path.push(waypoints.good_hope); risks.push("Red Sea Redirect"); }
            else if (mode === 'sea') path.push(waypoints.suez);
        }
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const totalDist = mDist + dist(origin.coords, oHub.coords) + dist(dHub.coords, dest.coords);

        const speeds = { sea: 711, air: 20000 };
        let transitD = mDist / speeds[mode];
        let handlingD = (mode==='sea' ? 5 : 2);
        if (tier === 'premium') handlingD *= 0.6;
        if (sandbox.strike) { handlingD += 7; risks.push("Major Labor Strike"); }

        const totalD = transitD + (dist(origin.coords, oHub.coords)+dist(dHub.coords, dest.coords))/500 + handlingD + 2;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        // --- Strategic Recommendation Engine ---
        let recommendation = "";
        if (origin.country === "China" && dest.country === "USA" && risks.length > 0) {
            recommendation = currentLang === 'ko' ? "니어쇼어링 전략: 멕시코(Manzanillo) 거점 활용 시 리드타임을 60% 단축하고 운하 리스크를 제거할 수 있습니다." : "Near-shoring Advice: Using Mexico (Manzanillo) as a hub can reduce lead time by 60% and bypass Canal risks.";
        } else if (mode === 'sea' && (value * annualICC / 365) * (totalD - 5) > (totalDist * 4 * weight)) {
            recommendation = currentLang === 'ko' ? "금융 최적화: 화물 가액이 높습니다. 항공 전환 시 절감되는 재고 유지 비용이 추가 운임보다 큽니다." : "Financial Optimization: High-value cargo. ICC savings from switching to AIR exceed the freight premium.";
        }

        const baseFreight = totalDist * (mode==='sea'?0.15:4.5) * weight;
        const inventoryCost = (value * annualICC / 365) * totalD;
        const estDuty = value * (dest.duty || 0.10);
        const totalImpact = baseFreight + inventoryCost + estDuty;
        const reliability = Math.max(25, 98 - (risks.length * 20));

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
                    ${recommendation ? `<div class="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl shadow-md"><p class="text-[10px] font-bold text-indigo-600 uppercase mb-1">${t.aiRec}</p><p class="text-xs font-semibold text-gray-700 leading-relaxed">${recommendation}</p></div>` : ''}
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${t.volatility}</p><p class="text-2xl font-black ${reliability > 80 ? 'text-green-500' : 'text-red-500'}">${reliability}%</p></div>
                        <div class="text-right"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Network Status</p><p class="text-[10px] font-bold text-gray-700">${risks.length > 0 ? risks[0] : 'Stable'}</p></div>
                    </div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between"><span>Freight + Surcharges</span><span class="font-bold">${convert(baseFreight)}</span></div>
                            <div class="flex justify-between text-blue-500"><span>Est. Duty & Tax</span><span class="font-bold">${convert(estDuty)}</span></div>
                            <div class="flex justify-between text-orange-500"><span>ICC (Financial Loss)</span><span class="font-bold">${convert(inventoryCost)}</span></div>
                            <div class="border-t pt-2 flex justify-between font-black text-gray-900 text-lg"><span>Total Landed Cost</span><span>${convert(totalImpact)}</span></div>
                        </div>
                        <div class="h-3 w-full bg-gray-100 rounded-full flex overflow-hidden">
                            <div style="width: ${(baseFreight/totalImpact)*100}%" class="bg-indigo-500"></div>
                            <div style="width: ${(estDuty/totalImpact)*100}%" class="bg-blue-400"></div>
                            <div style="width: ${(inventoryCost/totalImpact)*100}%" class="bg-orange-400"></div>
                        </div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${Math.ceil((totalDist * (mode==='sea'?25:500) * weight / 1000) / 22)}</span><p class="text-[10px] text-indigo-100 pb-1">${t.treesMsg}</p></div>
                    </div>
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        updateIntelligence(origin, dest, risks, reliability);
        renderMap(path, origin, dest, oHub, dHub, originName, destName);
        
        window.currentAnalysis = { originName, destName, mode, totalD, eta, convert, totalImpact, reliability, risks };
    }

    window.copyExecutiveSummary = () => {
        const a = window.currentAnalysis;
        const text = `[EXECUTIVE SCM ANALYSIS]\n\nRoute: ${a.originName} to ${a.destName}\nLead Time: ${Math.round(a.totalD)} Days\nLanded Cost: ${a.convert(a.totalImpact)}\nReliability Score: ${a.reliability}%\n\nStrategic Note: ${a.risks.length > 0 ? 'Risk alert active for ' + a.risks.join(', ') : 'Supply chain corridor stable.'}\n\nGenerated by LeadTime Intelligence AI.`;
        navigator.clipboard.writeText(text); alert("Executive Summary Copied!");
    };

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function updateIntelligence(o, d, risks, rel) {
        const badge = document.getElementById('network-status-badge');
        badge.classList.remove('hidden');
        const alert = rel < 80;
        badge.querySelector('span:last-child').innerText = alert ? "Elevated Alert" : "Network Stable";
        badge.querySelector('span:first-child span:last-child').className = `relative inline-flex rounded-full h-2 w-2 ${alert?'bg-red-500':'bg-green-500'}`;
        
        const feed = document.getElementById('feed-container');
        feed.innerHTML = (alert ? `<div class="p-4 bg-red-50 rounded-xl border-l-4 border-red-500 text-sm font-medium text-red-700">Notice: Lane stress at ${rel}%. Potential bottleneck in ${risks.join(' & ')}.</div>` : '') + `<div class="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-sm text-gray-700 font-medium">Market Brief: Regional connectivity at ${d.country} remains optimal.</div>`;
    }

    function renderMap(path, o, d, oH, dH, oN, dN) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
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
