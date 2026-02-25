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
            totalLead: "Total Est. Lead Time",
            totalDist: "Total Distance",
            reliability: "Network Health Index",
            eta: "Estimated ETA",
            financialImpact: "Financial Impact Analysis",
            totalImpact: "Total Logistics Spend",
            recentTitle: "Recent Analyses",
            journeyLog: "Detailed Journey Timeline",
            esgOffset: "ESG Offset Equivalents",
            treesMsg: "trees required to offset this trip",
            disclaimer: "• 16kts avg. speed applied. Financial metrics are estimates."
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
            totalLead: "총 예상 리드타임",
            totalDist: "총 운송 거리",
            reliability: "네트워크 건전성 지수",
            eta: "최종 도착 예정일",
            financialImpact: "금융 및 비용 영향 분석",
            totalImpact: "총 물류 비용 합계",
            recentTitle: "최근 분석 기록",
            journeyLog: "상세 여정 타임라인",
            esgOffset: "ESG 탄소 상쇄 지표",
            treesMsg: "이 운송의 탄소를 상쇄하기 위해 필요한 소나무 수",
            disclaimer: "• 컨테이너선 16노트 기준. 금융 비용은 연 이자율 15% 가정치입니다."
        }
    };

    let currentLang = 'en';
    let currentCurrency = 'USD';
    const exchangeRate = 1350;
    const annualICC = 0.15;

    const portCities = {
        "Port of New York": { coords: [40.7128, -74.0060], hub: "usa-nyc", country: "USA" },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA" },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China" },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands" },
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea" },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore" }
    };

    const airportCities = {
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA" },
        "LAX (Los Angeles)": { coords: [33.9416, -118.4085], hub: "usa-lax-air", country: "USA" },
        "ICN (Incheon)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea" }
    };

    const hubs = {
        "usa-nyc": { name: "Port of NY/NJ", coords: [40.6892, -74.0445] },
        "usa-jfk": { name: "John F. Kennedy Intl", coords: [40.6413, -73.7781] },
        "usa-lax": { name: "Port of LA", coords: [33.7542, -118.2764] },
        "usa-lax-air": { name: "Los Angeles Intl", coords: [33.9416, -118.4085] },
        "chn-sha": { name: "Shanghai Port", coords: [31.3833, 121.5833] },
        "nld-rot": { name: "Rotterdam Port", coords: [51.9490, 4.1450] },
        "kor-pus": { name: "Busan Port", coords: [35.1069, 129.0453] },
        "kor-icn": { name: "Incheon Intl Airport", coords: [37.4602, 126.4407] },
        "sgp-sin": { name: "Singapore Port", coords: [1.2644, 103.8398] }
    };

    const waypoints = { "pacific_mid": [20.0, -160.0], "good_hope": [-34.35, 18.47], "cape_verde": [15.0, -25.0] };

    const modeSelect = document.getElementById('transport-mode');
    const subModeSelect = document.getElementById('sub-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const networkBadge = document.getElementById('network-status-badge');
    const feedContainer = document.getElementById('feed-container');
    const recentContainer = document.getElementById('recent-searches');

    dateInput.valueAsDate = new Date();

    function populate() {
        const mode = modeSelect.value;
        const cities = mode === 'sea' ? portCities : airportCities;
        subModeSelect.innerHTML = '';
        (mode==='sea' ? ["FCL (Full Container)", "LCL (Shared)"] : ["Express Priority", "Standard Cargo"]).forEach(s => {
            const opt = new Option(s, s); subModeSelect.add(opt);
        });
        originSelect.innerHTML = ''; destinationSelect.innerHTML = '';
        Object.keys(cities).sort().forEach(c => {
            originSelect.add(new Option(c, c));
            destinationSelect.add(new Option(c, c));
        });
    }

    modeSelect.onchange = populate;
    populate();

    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);

    function calculateAndDisplay() {
        const mode = modeSelect.value;
        const weight = parseFloat(document.getElementById('cargo-weight').value) || 1;
        const value = parseFloat(document.getElementById('cargo-value').value) || 50000;
        const originName = originSelect.value;
        const destName = destinationSelect.value;
        const departureDate = new Date(dateInput.value);

        const sandbox = {
            redSea: document.getElementById('risk-redsea').checked,
            panama: document.getElementById('risk-panama').checked
        };

        if (originName === destName) return;

        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originName]; const dest = cityData[destName];
        const oHub = hubs[origin.hub]; const dHub = hubs[dest.hub];

        let risks = [];
        let path = [oHub.coords];
        if (Math.abs(oHub.coords[1] - dHub.coords[1]) > 180) path.push(waypoints.pacific_mid);
        else if ((oHub.coords[1]>60 && dHub.coords[1]<20) || (oHub.coords[1]<20 && dHub.coords[1]>60)) {
            if (sandbox.redSea) { path.push(waypoints.good_hope, waypoints.cape_verde); risks.push("Red Sea Conflict"); }
            else path.push([1.2, 103.8], [30.5, 32.2]);
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

        const cDelay = (dest.country === "China" ? 5 : 2);
        const totalD = transitD + inlandD + handlingD + cDelay;
        const eta = new Date(departureDate); eta.setDate(eta.getDate() + totalD);

        // ESG Calculation (CO2 Trees)
        const co2Kg = Math.round((totalDist * (mode==='sea'?25:500) * weight) / 1000);
        const treesNeeded = Math.ceil(co2Kg / 22); // Avg. tree absorbs 22kg CO2/year

        const convert = (val) => currentCurrency === 'USD' ? `$${Math.round(val).toLocaleString()}` : `₩${Math.round(val * exchangeRate).toLocaleString()}`;
        const t = translations[currentLang];

        // Generate Timeline Events
        const log = [
            { d: 0, msg: currentLang==='ko'?'창고에서 출고 및 내륙 운송 시작':'Departure from Warehouse & Inland transit' },
            { d: inlandD/2, msg: currentLang==='ko'?`${oHub.name} 도착 및 선적 대기`:`Arrived at ${oHub.name}, awaiting loading` },
            { d: inlandD/2 + (handlingD/2), msg: currentLang==='ko'?'본선 운송 시작':'Main transit started' },
            { d: totalD - cDelay, msg: currentLang==='ko'?`${dHub.name} 도착 및 하역 시작`:`Arrived at ${dHub.name}, unloading started` },
            { d: totalD, msg: currentLang==='ko'?'통관 완료 및 최종 목적지 도착':'Customs cleared, arrived at final destination' }
        ];

        document.getElementById('result').innerHTML = `
            <div class="space-y-6 animate-fade-in">
                <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">${t.totalLead}</p>
                            <p class="text-5xl font-black text-indigo-900">${Math.round(totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                            <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${eta.toLocaleDateString(currentLang==='ko'?'ko-KR':'en-US')}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-[10px] font-bold text-green-500 uppercase">${t.reliability}</p>
                            <p class="text-xl font-black ${98 - risks.length*25 > 70 ? 'text-green-500' : 'text-red-500'}">${Math.max(25, 98 - risks.length*25)}%</p>
                        </div>
                    </div>
                    <div class="h-1.5 w-full bg-gray-100 rounded-full flex overflow-hidden">
                        <div style="width: ${(inlandD/totalD)*100}%" class="bg-green-400"></div>
                        <div style="width: ${(transitD/totalD)*100}%" class="bg-indigo-500"></div>
                        <div style="width: ${((handlingD+cDelay)/totalD)*100}%" class="bg-gray-300"></div>
                    </div>
                </div>

                <!-- Journey Log -->
                <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">${t.journeyLog}</p>
                    <div class="space-y-4">
                        ${log.map(ev => {
                            const evDate = new Date(departureDate); evDate.setDate(evDate.getDate() + ev.d);
                            return `
                                <div class="flex gap-3 items-start">
                                    <div class="text-[9px] font-bold text-gray-400 w-16 pt-1 uppercase">${evDate.toLocaleDateString(currentLang==='ko'?'ko-KR':'en-US', {month:'short', day:'numeric'})}</div>
                                    <div class="relative pb-4 last:pb-0 pl-4 border-l border-gray-100">
                                        <div class="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-50"></div>
                                        <p class="text-xs font-semibold text-gray-700 leading-tight">${ev.msg}</p>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- ESG Offset -->
                <div class="bg-indigo-900 p-5 rounded-2xl text-white shadow-xl overflow-hidden relative">
                    <div class="absolute -right-4 -bottom-4 opacity-10"><svg class="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path d="M5.223 2.262c2.735-2.735 7.123-2.133 9.124.592a2.391 2.391 0 01.126.189c.159.26.314.54.466.845 3.317 6.633-1.33 13.456-8.314 13.124-1.691-.08-3.484-.82-4.146-2.483-.12-.303-.187-.63-.192-.96-.033-2.136 1.44-4.044 3.06-5.305z"></path></svg></div>
                    <p class="text-[10px] font-bold text-indigo-300 uppercase tracking-widest mb-2">${t.esgOffset}</p>
                    <div class="flex items-end gap-2">
                        <span class="text-3xl font-black text-green-400">${treesNeeded}</span>
                        <p class="text-[10px] font-medium text-indigo-100 pb-1 mb-1">${t.treesMsg}</p>
                    </div>
                </div>
            </div>`;

        updateIntelligence(origin, dest, risks, Math.max(25, 98 - risks.length*25));
        renderMap(path, origin, dest, oHub, dHub, originName, destName);
        saveToHistory(originName, destName, mode);
    }

    function updateIntelligence(o, d, risks, health) {
        networkBadge.classList.remove('hidden');
        const statusText = networkBadge.querySelector('span:last-child');
        const statusDot = networkBadge.querySelector('span:first-child span:last-child');
        if (health > 70) { statusText.innerText = "Network Stable"; statusDot.className = "relative inline-flex rounded-full h-2 w-2 bg-green-500"; }
        else { statusText.innerText = "Elevated Alert"; statusDot.className = "relative inline-flex rounded-full h-2 w-2 bg-red-500"; }

        let briefing = risks.length > 0 ? `<div class="p-4 bg-red-50 rounded-xl border-l-4 border-red-500 text-sm font-medium text-red-700">Route Impacted by ${risks.join(' & ')}.</div>` : '';
        briefing += `<div class="p-4 bg-indigo-50 rounded-xl border-l-4 border-indigo-500 text-sm text-gray-700">Standard audit protocol active for ${d.country}. Ensure certificates of origin are ready.</div>`;
        feedContainer.innerHTML = briefing;
    }

    function renderMap(path, o, d, oH, dH, oN, dN) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline) map.removeLayer(l); });
        const hI = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41] });
        L.marker(o.coords).addTo(map).bindPopup(oN); L.marker(d.coords).addTo(map).bindPopup(dN);
        L.marker(oH.coords, {icon: hI}).addTo(map); L.marker(dH.coords, {icon: hI}).addTo(map);
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
        if (h.length === 0) return;
        recentContainer.innerHTML = h.map(x => `
            <div class="p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-300 cursor-pointer transition-all" onclick="loadHistory('${x.o}', '${x.d}', '${x.m}')">
                <p class="text-[9px] font-bold text-indigo-500 uppercase">${x.m}</p>
                <p class="text-xs font-semibold text-gray-700 truncate">${x.o} → ${x.d}</p>
            </div>
        `).join('');
    }

    window.loadHistory = (o, d, m) => { modeSelect.value = m; populate(); originSelect.value = o; destinationSelect.value = d; calculateAndDisplay(); };

    function dist(c1, c2) {
        const R = 6371; const dLat = (c2[0]-c1[0])*Math.PI/180; const dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function setLang(lang) {
        currentLang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n'); if(translations[lang][k]) el.textContent = translations[lang][k];
        });
        document.getElementById('lang-ko').className = `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${lang==='ko'?'bg-indigo-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600'}`;
        document.getElementById('lang-en').className = `px-3 py-1.5 rounded-md text-xs font-bold transition-all ${lang==='en'?'bg-indigo-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600'}`;
    }

    document.getElementById('lang-ko').onclick = () => setLang('ko');
    document.getElementById('lang-en').onclick = () => setLang('en');
    document.getElementById('curr-usd').onclick = function() { currentCurrency = 'USD'; this.className = 'px-2 py-1 rounded text-[10px] font-bold bg-white shadow-sm text-indigo-600'; document.getElementById('curr-krw').className = 'px-2 py-1 rounded text-[10px] font-bold text-gray-500'; calculateAndDisplay(); };
    document.getElementById('curr-krw').onclick = function() { currentCurrency = 'KRW'; this.className = 'px-2 py-1 rounded text-[10px] font-bold bg-white shadow-sm text-indigo-600'; document.getElementById('curr-usd').className = 'px-2 py-1 rounded text-[10px] font-bold text-gray-500'; calculateAndDisplay(); };

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    renderHistory();
    setLang('en');
});
