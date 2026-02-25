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
            tabCustoms: "Customs",
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
            customsDocs: "Required Documentation",
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
            customsDocs: "필수 통관 서류",
            disclaimer: "• 16노트 평균속도 기준. 전 세계 물류 부하 지수를 반영합니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const rates = { KRW: 1350, EUR: 0.92, USD: 1 };
    const annualICC = 0.15;

    // --- Global Hub Database with Congestion Status ---
    const hubs = {
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453], status: "green", congestion: "Low" },
        "kor-icn": { name: "Incheon Intl", coords: [37.4602, 126.4407], status: "green", congestion: "Stable" },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833], status: "red", congestion: "High (48h wait)" },
        "sgp-sin": { name: "Singapore Hub", coords: [1.2644, 103.8398], status: "yellow", congestion: "Medium" },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450], status: "yellow", congestion: "Medium" },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764], status: "red", congestion: "High (72h wait)" }
    };

    const carriers = {
        sea: [ { name: "Maersk", rel: 0.92 }, { name: "MSC", rel: 0.85 }, { name: "HMM", rel: 0.88 } ],
        air: [ { name: "Korean Air", rel: 0.98 }, { name: "FedEx", rel: 0.99 }, { name: "Emirates", rel: 0.95 } ]
    };

    const customsDocs = {
        "South Korea": ["KC Certification", "FTA Origin Certificate", "Commercial Invoice"],
        "China": ["CCC Mark", "Export License", "CIQ Inspection"],
        "USA": ["ISF 10+2 Filing", "Customs Bond", "BOL"],
        "Germany": ["EORI Number", "VAT Certificate", "EU Transit Doc"]
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "suez": [29.9, 32.5], "good_hope": [-34.35, 18.47] };

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
        const cities = mode === 'sea' ? 
            Object.fromEntries(Object.entries(hubs).filter(([k,v]) => v.name.includes("Port") || v.name.includes("Hub"))) :
            Object.fromEntries(Object.entries(hubs).filter(([k,v]) => v.name.includes("Intl") || v.name.includes("Air")));
        
        originSelect.innerHTML = ''; destinationSelect.innerHTML = '';
        Object.values(hubs).forEach(h => {
            originSelect.add(new Option(h.name, h.name));
            destinationSelect.add(new Option(h.name, h.name));
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

        const oHub = Object.values(hubs).find(h => h.name === originName);
        const dHub = Object.values(hubs).find(h => h.name === destName);

        let risks = [];
        let path = [oHub.coords];
        if (mode === 'sea' && sandbox.redSea) { path.push(waypoints.good_hope); risks.push("Red Sea Redirect"); }
        else if (mode === 'sea') path.push(waypoints.suez);
        path.push(dHub.coords);

        let mDist = 0; for(let i=0; i<path.length-1; i++) mDist += dist(path[i], path[i+1]);
        const totalDist = mDist;

        const speeds = { sea: 711, air: 20000 };
        let transitD = mDist / speeds[mode];
        let handlingD = (mode==='sea' ? 5 : 2);
        if (tier === 'premium') handlingD *= 0.6;
        if (sandbox.strike) { handlingD += 7; risks.push("Labor Strike"); }
        if (oHub.status === 'red' || dHub.status === 'red') { handlingD += 3; risks.push("Hub Congestion"); }

        const totalD = transitD + handlingD + 2;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        const baseFreight = totalDist * (mode==='sea'?0.15:4.5) * weight;
        const inventoryCost = (value * annualICC / 365) * totalD;
        const totalSpend = baseFreight + inventoryCost;
        const reliability = Math.max(25, 98 - (risks.length * 15));

        const t = translations[currentLang];
        const convert = (val) => `${currentCurrency==='KRW'?'₩':'$'}${Math.round(val * rates[currentCurrency]).toLocaleString()}`;

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
                    <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                        <div><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">${t.volatility}</p><p class="text-2xl font-black ${reliability > 80 ? 'text-green-500' : 'text-red-500'}">${reliability}%</p></div>
                        <div class="text-right"><p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Landed spend</p><p class="text-lg font-bold text-gray-700">${convert(totalSpend)}</p></div>
                    </div>
                </div>

                <div id="tab-content-finance" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div class="space-y-2 text-xs">
                            <div class="flex justify-between"><span>Freight + Handling</span><span class="font-bold">${convert(baseFreight)}</span></div>
                            <div class="flex justify-between text-orange-500"><span>ICC (Financial)</span><span class="font-bold">${convert(inventoryCost)}</span></div>
                            <div class="border-t pt-2 flex justify-between font-black text-gray-900 text-lg"><span>Total Landed Cost</span><span>${convert(totalSpend)}</span></div>
                        </div>
                    </div>
                </div>

                <div id="tab-content-risk" class="tab-pane hidden space-y-4">
                    <div class="bg-indigo-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                        <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                        <div class="flex items-end gap-2"><span class="text-4xl font-black text-green-400">${Math.ceil((totalDist * (mode==='sea'?25:500) * weight / 1000) / 22)}</span><p class="text-[10px] text-indigo-100 pb-1">${t.treesMsg}</p></div>
                    </div>
                </div>

                <div id="tab-content-customs" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.customsDocs}</p>
                        <ul class="space-y-2">
                            ${["Commercial Invoice", "Packing List", "Bill of Lading"].map(doc => `<li class="flex items-center gap-3 text-xs font-semibold text-gray-700 p-2 bg-gray-50 rounded-lg"><input type="checkbox" class="rounded text-indigo-600"> ${doc}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        renderMap(path, oHub, dHub, risks);
        updateTicker(oHub, dHub, risks);
        
        window.currentAnalysis = { originName, destName, mode, totalD, eta, convert, totalSpend, reliability, risks };
    }

    function updateTicker(o, d, risks) {
        let news = `<span>Live corridor analysis active for ${o.name} to ${d.name}.</span>`;
        if (risks.includes("Red Sea Redirect")) news += "<span>Alert: Suez rerouting via Good Hope (+12 days).</span>";
        newsTicker.innerHTML = news + "<span>Shanghai Port automation efficiency at 92%.</span><span>Global air cargo demand up 4.2%.</span>";
    }

    window.copyExecutiveSummary = () => {
        const a = window.currentAnalysis; if (!a) return;
        const text = `[EXECUTIVE SUMMARY]\n\nRoute: ${a.originName} to ${a.destName}\nMode: ${a.mode.toUpperCase()}\nLead Time: ${Math.round(a.totalD)} Days\nLanded Cost: ${a.convert(a.totalSpend)}\nReliability: ${a.reliability}%\n\nGenerated by LeadTime Intelligence.`;
        navigator.clipboard.writeText(text); alert("Summary Copied!");
    };

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

    function renderMap(path, oH, dH, risks) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
        const dot = (color) => L.divIcon({ html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md bg-${color}-500"></div>`, className: 'custom-div-icon', iconSize: [16, 16] });
        L.marker(oH.coords, {icon: dot(oH.status)}).addTo(map).bindPopup(`<b>${oH.name}</b><br>Congestion: ${oH.congestion}`);
        L.marker(dH.coords, {icon: dot(dH.status)}).addTo(map).bindPopup(`<b>${dH.name}</b><br>Congestion: ${dH.congestion}`);
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
