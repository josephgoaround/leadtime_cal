document.addEventListener('DOMContentLoaded', () => {
    // i18n Dictionary
    const translations = {
        en: {
            subtitle: "Global Logistics & Customs AI Pathfinder",
            formTitle: "Shipment Config",
            labelMode: "Transport Mode",
            labelService: "Service Level",
            labelCargo: "Cargo Type",
            labelOrigin: "Departure",
            labelDest: "Arrival",
            cargoGen: "General Cargo",
            cargoRef: "Refrigerated (Cold Chain)",
            cargoDG: "Dangerous Goods (DG)",
            btnAnalyze: "ANALYZE LOGISTICS DATA",
            feedTitle: "Market Intelligence Live",
            capTitle: "Enterprise Intelligence Engine",
            cap1Title: "Smart Routing",
            cap1Desc: "Calculates routes using major maritime chokepoints and atmospheric wind-corrected flight paths.",
            cap2Title: "Sustainability",
            cap2Desc: "Estimate Scope 3 emissions for your global supply chain with our integrated CO2 intelligence engine.",
            cap3Title: "Risk Mitigation",
            cap3Desc: "Active monitoring of Red Sea, Panama Canal, and regional labor strikes integrated into lead time data.",
            apiTitle: "Power Your TMS with Our API",
            apiDesc: "Integrate professional logistics intelligence directly into your workflow. Trusted by Fortune 500 shippers.",
            riskTitle: "Risk Factors",
            totalLead: "Total Est. Lead Time",
            totalDist: "Total Distance",
            co2Impact: "CO2 Impact",
            customsReg: "Customs & Regulatory",
            shareBtn: "Share Intelligence Report",
            reliability: "Route Reliability",
            journeyLog: "Journey Intelligence Log",
            disclaimer: "• 16kts avg. speed applied. External delays due to weather/congestion not guaranteed."
        },
        ko: {
            subtitle: "글로벌 물류 및 통관 AI 경로 분석기",
            formTitle: "운송 설정",
            labelMode: "운송 수단",
            labelService: "서비스 등급",
            labelCargo: "화물 종류",
            labelOrigin: "출발지",
            labelDest: "도착지",
            cargoGen: "일반 화물",
            cargoRef: "냉장/냉동 (콜드체인)",
            cargoDG: "위험물 (DG)",
            btnAnalyze: "물류 데이터 분석 시작",
            feedTitle: "실시간 마켓 인텔리전스",
            capTitle: "엔터프라이즈급 지능형 엔진",
            cap1Title: "지능형 경로 최적화",
            cap1Desc: "주요 해상 거점 및 기류를 고려한 항공 경로를 정밀하게 계산합니다.",
            cap2Title: "지속가능성 (ESG)",
            cap2Desc: "통합 CO2 지능형 엔진을 통해 공급망의 Scope 3 탄소 배출량을 추정합니다.",
            cap3Title: "리스크 완화",
            cap3Desc: "홍해, 파나마 운하 및 지역별 파업 이슈를 실시간으로 모니터링하여 리드타임에 반영합니다.",
            apiTitle: "TMS에 API를 연동하세요",
            apiDesc: "전문적인 물류 지능을 귀사의 워크플로우에 직접 통합하십시오. 글로벌 화주들이 신뢰합니다.",
            riskTitle: "위험 요인 분석",
            totalLead: "총 예상 리드타임",
            totalDist: "총 운송 거리",
            co2Impact: "탄소 배출 영향",
            customsReg: "통관 및 규제 정보",
            shareBtn: "인텔리전스 보고서 공유",
            reliability: "운송 신뢰도 점수",
            journeyLog: "구간별 상세 여정 로그",
            disclaimer: "• 컨테이너선 평균 16노트 기준. 기상 및 항만 혼잡에 따른 지연은 보장되지 않습니다."
        }
    };

    let currentLang = 'en';

    function setLanguage(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) el.textContent = translations[lang][key];
        });
        
        // Update Buttons
        document.getElementById('lang-ko').className = `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${lang==='ko'?'bg-indigo-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600'}`;
        document.getElementById('lang-en').className = `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${lang==='en'?'bg-indigo-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600'}`;
        
        populateCities(); // Re-populate to handle names if needed
    }

    document.getElementById('lang-ko').onclick = () => setLanguage('ko');
    document.getElementById('lang-en').onclick = () => setLanguage('en');

    // Global Risk Scenarios
    const globalRisks = {
        redSeaCrisis: { active: true, description: "Red Sea/Suez Canal Avoidance", impact: "+12 days via Cape" },
        panamaDrought: { active: true, description: "Panama Canal Drought Restrictions", impact: "+5 days waiting" },
        russiaAirspace: { active: true, description: "Russian Airspace Closure", impact: "+1 day detour" }
    };

    const serviceLevels = {
        sea: ["Full Container Load (FCL)", "Less than Container Load (LCL)"],
        air: ["Express Priority", "Standard Cargo"]
    };

    const portCities = {
        "Port of New York": { coords: [40.7128, -74.0060], hub: "usa-nyc", country: "USA", scmIssues: "Port labor negotiations." },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", scmIssues: "Warehouse capacity limits." },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China", scmIssues: "Strict export inspections." },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands", scmIssues: "Customs clearance backlogs." },
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea", scmIssues: "Labor union strikes." },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore", scmIssues: "Vessel bunching at hub." }
    };

    const airportCities = {
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA", scmIssues: "Terminal upgrades." },
        "LAX (Los Angeles)": { coords: [33.9416, -118.4085], hub: "usa-lax-air", country: "USA", scmIssues: "High storage fees." },
        "PVG (Shanghai)": { coords: [31.1444, 121.8053], hub: "chn-pvg", country: "China", scmIssues: "Flight cancellations." },
        "AMS (Amsterdam)": { coords: [52.3105, 4.7683], hub: "nld-ams", country: "Netherlands", scmIssues: "Flight cap restrictions." },
        "ICN (Seoul)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", scmIssues: "E-commerce volume spikes." }
    };

    const hubs = {
        "usa-nyc": { name: "Port of NY/NJ", coords: [40.6892, -74.0445] },
        "usa-jfk": { name: "John F. Kennedy Intl", coords: [40.6413, -73.7781] },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764] },
        "usa-lax-air": { name: "Los Angeles Intl", coords: [33.9416, -118.4085] },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833] },
        "chn-pvg": { name: "Pudong Intl Airport", coords: [31.1444, 121.8053] },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450] },
        "nld-ams": { name: "Schiphol Airport", coords: [52.3105, 4.7683] },
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453] },
        "kor-icn": { name: "Incheon Intl Airport", coords: [37.4602, 126.4407] },
        "sgp-sin": { name: "Singapore Port", coords: [1.2644, 103.8398] }
    };

    const waypoints = {
        "pacific_mid": [20.0, -160.0], "good_hope": [-34.35, 18.47], "cape_verde": [15.0, -25.0], "suez": [30.5852, 32.2654], "panama": [9.352, -79.920]
    };

    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const modeSelect = document.getElementById('transport-mode');
    const subModeSelect = document.getElementById('sub-mode');

    function populateCities() {
        const mode = modeSelect.value;
        const currentCities = mode === 'sea' ? portCities : airportCities;
        subModeSelect.innerHTML = '';
        serviceLevels[mode].forEach(lvl => { const opt = document.createElement('option'); opt.value = lvl; opt.textContent = lvl; subModeSelect.appendChild(opt); });
        originSelect.innerHTML = ''; destinationSelect.innerHTML = '';
        Object.keys(currentCities).sort().forEach(city => {
            const opt1 = document.createElement('option'); opt1.value = city; opt1.textContent = city; originSelect.appendChild(opt1);
            const opt2 = document.createElement('option'); opt2.value = city; opt2.textContent = city; destinationSelect.appendChild(opt2);
        });
    }

    modeSelect.addEventListener('change', populateCities);
    populateCities();

    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);

    function calculateAndDisplay() {
        const mode = modeSelect.value;
        const subMode = subModeSelect.value;
        const originName = originSelect.value;
        const destName = destinationSelect.value;
        const cityData = mode === 'sea' ? portCities : airportCities;
        
        if (originName === destName) return;

        const origin = cityData[originName];
        const dest = cityData[destName];
        const originHub = hubs[origin.hub];
        const destHub = hubs[dest.hub];

        let activeRisks = [];
        let journeyLog = [];
        
        journeyLog.push({ step: "First Mile", desc: `${originName} → ${originHub.name}`, type: "Inland" });
        let middleMilePath = (mode === 'sea') ? getSeaRoute(originHub.coords, destHub.coords, activeRisks, journeyLog) : getAirRoute(originHub.coords, destHub.coords, activeRisks, journeyLog);
        journeyLog.push({ step: "Last Mile", desc: `${destHub.name} → ${destName}`, type: "Inland" });

        let middleMileDist = 0;
        for (let i = 0; i < middleMilePath.length - 1; i++) middleMileDist += calculateDistance(middleMilePath[i], middleMilePath[i+1]);
        const fDist = calculateDistance(origin.coords, originHub.coords);
        const lDist = calculateDistance(destHub.coords, dest.coords);
        const totalDist = middleMileDist + fDist + lDist;
        
        const speeds = { sea: 711, air: 20000, land: 500 };
        let transitD = middleMileDist / speeds[mode];
        let inlandD = (fDist + lDist) / speeds.land;
        let handlingD = (mode === 'sea' ? 5 : 2);
        if (subMode.includes("LCL")) handlingD += 4;
        
        activeRisks.forEach(r => {
            if (r.description.includes("Red Sea")) transitD += 12;
            if (r.description.includes("Panama")) handlingD += 5;
            if (r.description.includes("Russia")) transitD += 1;
        });

        const customsInfo = getCustomsIntelligence(origin.country, dest.country);
        const totalD = transitD + inlandD + handlingD + customsInfo.delay;
        const reliability = Math.max(30, 98 - (activeRisks.length * 20) - (mode === 'sea' ? 10 : 0));

        const t = translations[currentLang];
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <div class="space-y-6 animate-fade-in">
                <div class="p-5 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-sm relative overflow-hidden">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <p class="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">${t.totalLead}</p>
                            <p class="text-5xl font-black text-indigo-900">${Math.round(totalD)} <span class="text-xl font-normal text-indigo-400">Days</span></p>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">${Math.round(totalDist).toLocaleString()} km</p>
                            <div class="mt-2">
                                <p class="text-[9px] font-bold text-gray-400 uppercase mb-0.5">${t.reliability}</p>
                                <p class="text-lg font-bold ${reliability < 60 ? 'text-red-500' : 'text-green-500'}">${reliability}%</p>
                            </div>
                        </div>
                    </div>
                    <div class="h-2 w-full bg-gray-200 rounded-full flex overflow-hidden shadow-inner">
                        <div style="width: ${(inlandD/totalD)*100}%" class="bg-green-400"></div>
                        <div style="width: ${(transitD/totalD)*100}%" class="bg-indigo-500"></div>
                        <div style="width: ${(handlingD/totalD)*100}%" class="bg-blue-400"></div>
                        <div style="width: ${(customsInfo.delay/totalD)*100}%" class="bg-red-400"></div>
                    </div>
                </div>

                <div class="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div class="p-3 bg-gray-50 border-b font-bold text-[10px] text-gray-500 uppercase tracking-widest">${t.journeyLog}</div>
                    <div class="p-3 space-y-3">
                        ${journeyLog.map(log => `<div class="flex items-start gap-3"><div class="w-1.5 h-1.5 rounded-full mt-1.5 ${log.type==='Inland'?'bg-green-400':'bg-indigo-500'}"></div><div><p class="text-xs font-bold text-gray-800">${log.step}</p><p class="text-[10px] text-gray-500">${log.desc}</p></div></div>`).join('')}
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <div class="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">${t.customsReg}</p>
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${customsInfo.color}">${customsInfo.level}</span>
                    </div>
                    <div class="p-3 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                        <p class="text-[10px] font-bold text-gray-400 uppercase mb-1">${t.co2Impact}</p>
                        <p class="text-sm font-bold text-green-600">${Math.round(totalDist * (mode==='sea'?25:500)/1000)} kg/t</p>
                    </div>
                </div>

                <div class="text-[10px] text-gray-400 leading-relaxed text-center italic">${t.disclaimer}</div>
            </div>`;

        updateMap(middleMilePath, mode, origin, dest, originName, destName);
    }

    function updateMap(path, mode, oCity, dCity, oName, dName) {
        map.eachLayer(layer => { if (layer instanceof L.Marker || layer instanceof L.Polyline) map.removeLayer(layer); });
        L.marker(oCity.coords).addTo(map).bindPopup(oName);
        L.marker(dCity.coords).addTo(map).bindPopup(dName);
        const hubIcon = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41] });
        L.marker(hubs[oCity.hub].coords, { icon: hubIcon }).addTo(map);
        L.marker(hubs[dCity.hub].coords, { icon: hubIcon }).addTo(map);
        L.polyline([oCity.coords, hubs[oCity.hub].coords], { color: '#ef4444', weight: 2, dashArray: '5, 5' }).addTo(map);
        path.forEach((p, i) => { if(i > 0 && Math.abs(path[i-1][1]-p[1]) < 180) L.polyline([path[i-1], p], {color: '#dc2626', weight: 5}).addTo(map); });
        L.polyline([hubs[dCity.hub].coords, dCity.coords], { color: '#ef4444', weight: 2, dashArray: '5, 5' }).addTo(map);
        map.fitBounds([oCity.coords, dCity.coords], { padding: [50, 50] });
    }

    function getSeaRoute(o, d, r, log) {
        let p = [o];
        if (Math.abs(o[1]-d[1]) > 180) { p.push(waypoints.pacific_mid); log.push({ step: "Ocean Transit", desc: "Trans-Pacific Corridor", type: "Ocean" }); }
        else if ((o[1]>60 && d[1]<20) || (o[1]<20 && d[1]>60)) {
            if (globalRisks.redSeaCrisis.active) { p.push(waypoints.good_hope, waypoints.cape_verde); r.push(globalRisks.redSeaCrisis); log.push({ step: "Ocean Transit", desc: "Via Cape of Good Hope (Red Sea Risk)", type: "Ocean" }); }
            else { p.push(waypoints.suez); log.push({ step: "Ocean Transit", desc: "Via Suez Canal", type: "Ocean" }); }
        } else { log.push({ step: "Ocean Transit", desc: "Standard maritime lane", type: "Ocean" }); }
        p.push(d); return p;
    }

    function getAirRoute(o, d, r, log) {
        const p = []; const steps = 20; let sL = o[1], eL = d[1];
        if (Math.abs(sL-eL) > 180) { if (sL>0) eL+=360; else eL-=360; }
        log.push({ step: "Air Transit", desc: "Great Circle polar flight path", type: "Air" });
        for (let i=0; i<=steps; i++) {
            const f = i/steps; let lat = o[0]+(d[0]-o[0])*f; const lon = sL+(eL-sL)*f;
            const dist = calculateDistance(o, d); let off = Math.sin(Math.PI*f)*(dist/12000)*15;
            if (globalRisks.russiaAirspace.active && lat > 45) { off -= 20; if(i===10) r.push(globalRisks.russiaAirspace); }
            p.push([lat+off, lon]);
        }
        return p;
    }

    function calculateDistance(c1, c2) {
        const R = 6371; const dLat = (c2[0]-c1[0])*Math.PI/180; const dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function getCustomsIntelligence(oC, dC) {
        if (oC === dC) return { level: "Low", delay: 1, color: "text-green-600 bg-green-50", docs: ["B/L"] };
        return { level: "Medium", delay: 3, color: "text-blue-600 bg-blue-50", docs: ["B/L", "Invoice"] };
    }

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    setLanguage('en'); // Default
});
