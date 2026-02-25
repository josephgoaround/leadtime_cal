document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            subtitle: "Global Logistics AI Pathfinder",
            formTitle: "Route Config",
            labelMode: "Transport Mode",
            labelDate: "Departure Date",
            labelOrigin: "Departure City",
            labelDest: "Arrival City",
            btnAnalyze: "RUN ROUTE ANALYSIS",
            tabOverview: "Summary",
            tabStrategy: "Timeline",
            totalLead: "Total Lead Time",
            eta: "Estimated ETA",
            aiRec: "Routing Intelligence",
            disclaimer: "• 16kts avg. sea speed. Routes strictly maritime optimized."
        },
        ko: {
            subtitle: "글로벌 물류 AI 경로 분석기",
            formTitle: "경로 설정",
            labelMode: "운송 수단",
            labelDate: "출발 예정일",
            labelOrigin: "출발 도시",
            labelDest: "도착 도시",
            btnAnalyze: "경로 분석 실행",
            tabOverview: "요약",
            tabStrategy: "타임라인",
            totalLead: "총 리드타임",
            eta: "최종 도착 예정일",
            aiRec: "라우팅 인텔리전스",
            disclaimer: "• 해상 평균 16노트 기준. 육지 침범 없는 현실적 항로 반영."
        }
    };

    let currentLang = 'en';

    const hubs = {
        // ASIA
        "kor-pus": { name: "Busan", coords: [35.10, 129.04], type: "Both", country: "South Korea", region: "NE_ASIA" },
        "kor-icn": { name: "Incheon", coords: [37.46, 126.44], type: "Both", country: "South Korea", region: "NE_ASIA" },
        "chn-sha": { name: "Shanghai", coords: [31.23, 121.47], type: "Both", country: "China", region: "NE_ASIA" },
        "chn-hkg": { name: "Hong Kong", coords: [22.31, 114.16], type: "Both", country: "Hong Kong", region: "SE_ASIA" },
        "chn-szn": { name: "Shenzhen", coords: [22.54, 114.05], type: "Sea", country: "China", region: "SE_ASIA" },
        "chn-tjn": { name: "Tianjin", coords: [38.96, 117.78], type: "Sea", country: "China", region: "NE_ASIA" },
        "sgp-sin": { name: "Singapore", coords: [1.26, 103.83], type: "Both", country: "Singapore", region: "SE_ASIA" },
        "jpn-tyo": { name: "Tokyo", coords: [35.67, 139.65], type: "Both", country: "Japan", region: "NE_ASIA" },
        "vnm-hcm": { name: "Ho Chi Minh City", coords: [10.76, 106.66], type: "Both", country: "Vietnam", region: "SE_ASIA" },
        "ind-bom": { name: "Mumbai", coords: [18.93, 72.83], type: "Both", country: "India", region: "SOUTH_ASIA" },
        "ind-maa": { name: "Chennai", coords: [13.08, 80.27], type: "Both", country: "India", region: "SOUTH_ASIA" },
        "tha-bkk": { name: "Bangkok", coords: [13.75, 100.50], type: "Both", country: "Thailand", region: "SE_ASIA" },
        "mys-kul": { name: "Kuala Lumpur", coords: [3.13, 101.68], type: "Both", country: "Malaysia", region: "SE_ASIA" },
        "twn-tpe": { name: "Taipei", coords: [25.03, 121.56], type: "Both", country: "Taiwan", region: "NE_ASIA" },
        "phl-mnl": { name: "Manila", coords: [14.59, 120.98], type: "Both", country: "Philippines", region: "SE_ASIA" },

        // EUROPE
        "nld-rot": { name: "Rotterdam", coords: [51.92, 4.47], type: "Both", country: "Netherlands", region: "EUROPE_NORTH" },
        "deu-ham": { name: "Hamburg", coords: [53.55, 9.99], type: "Both", country: "Germany", region: "EUROPE_NORTH" },
        "gbr-lhr": { name: "London", coords: [51.50, -0.12], type: "Both", country: "UK", region: "EUROPE_NORTH" },
        "fra-cdg": { name: "Paris", coords: [48.85, 2.35], type: "Both", country: "France", region: "EUROPE_NORTH" },
        "ita-goa": { name: "Genoa", coords: [44.40, 8.94], type: "Sea", country: "Italy", region: "EUROPE_SOUTH" },
        "esp-bcn": { name: "Barcelona", coords: [41.38, 2.17], type: "Both", country: "Spain", region: "EUROPE_SOUTH" },
        "tur-ist": { name: "Istanbul", coords: [41.00, 28.97], type: "Both", country: "Turkey", region: "EUROPE_SOUTH" },

        // AMERICAS
        "usa-lax": { name: "Los Angeles", coords: [33.75, -118.27], type: "Both", country: "USA", region: "US_WEST" },
        "usa-nyc": { name: "New York", coords: [40.71, -74.00], type: "Both", country: "USA", region: "US_EAST" },
        "usa-sav": { name: "Savannah", coords: [32.08, -81.09], type: "Sea", country: "USA", region: "US_EAST" },
        "can-yvr": { name: "Vancouver", coords: [49.28, -123.12], type: "Both", country: "Canada", region: "US_WEST" },
        "mex-man": { name: "Manzanillo", coords: [19.05, -104.31], type: "Sea", country: "Mexico", region: "MEXICO" },
        "bra-sao": { name: "Santos", coords: [-23.96, -46.33], type: "Sea", country: "Brazil", region: "SA_EAST" },
        "arg-bue": { name: "Buenos Aires", coords: [-34.60, -58.38], type: "Both", country: "Argentina", region: "SA_EAST" },

        // MEA / OCEANIA
        "uae-dxb": { name: "Dubai", coords: [25.20, 55.27], type: "Both", country: "UAE", region: "MIDDLE_EAST" },
        "egy-psu": { name: "Port Said", coords: [31.26, 32.30], type: "Sea", country: "Egypt", region: "MIDDLE_EAST" },
        "zaf-cpt": { name: "Cape Town", coords: [-33.92, 18.42], type: "Both", country: "South Africa", region: "AFRICA" },
        "aus-syd": { name: "Sydney", coords: [-33.86, 151.20], type: "Both", country: "Australia", region: "OCEANIA" }
    };

    // Maritime Gateways (Precise coordinates for rounding land)
    const gates = {
        "taiwan_strait": [24.0, 119.5],
        "vnm_south": [8.5, 107.0],
        "singapore": [1.2, 103.8],
        "sri_lanka": [5.5, 80.5],
        "bab_el_mandeb": [12.6, 43.3],
        "suez": [29.9, 32.5],
        "med_west": [37.0, 5.0],
        "gibraltar": [35.9, -5.3],
        "portugal": [40.0, -11.0],
        "english_channel": [50.5, -0.5],
        "good_hope": [-35.0, 20.0],
        "panama_w": [8.9, -79.6],
        "panama_e": [9.3, -79.9],
        "florida": [24.5, -81.0],
        "malacca_entrance": [5.5, 95.5]
    };

    const modeSelect = document.getElementById('transport-mode');
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const dateInput = document.getElementById('departure-date');
    const resultContainer = document.getElementById('result');
    const executiveActions = document.getElementById('executive-actions');

    dateInput.valueAsDate = new Date();

    function populate() {
        const mode = modeSelect.value;
        const currentOrigin = originSelect.value;
        const currentDest = destinationSelect.value;
        originSelect.innerHTML = ''; destinationSelect.innerHTML = '';
        Object.entries(hubs)
            .filter(([id, h]) => mode === 'air' ? h.type !== 'Sea' : h.type !== 'Air')
            .sort((a,b) => a[1].name.localeCompare(b[1].name))
            .forEach(([id, h]) => {
                const label = `${h.name}, ${h.country}`;
                originSelect.add(new Option(label, id));
                destinationSelect.add(new Option(label, id));
            });
        if (currentOrigin && hubs[currentOrigin]) originSelect.value = currentOrigin;
        if (currentDest && hubs[currentDest]) destinationSelect.value = currentDest;
    }

    modeSelect.onchange = populate;
    populate();

    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    function calculateAndDisplay() {
        const mode = modeSelect.value;
        const oId = originSelect.value;
        const dId = destinationSelect.value;
        if (!oId || !dId || oId === dId) return;
        const oHub = hubs[oId], dHub = hubs[dId];
        const sandbox = {
            redSea: document.getElementById('risk-redsea').checked,
            panama: document.getElementById('risk-panama').checked,
            strike: document.getElementById('risk-strike').checked
        };
        const route = solveRoute(oHub, dHub, mode, sandbox);
        const t = translations[currentLang];

        resultContainer.innerHTML = `
            <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
                <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                <p class="text-5xl font-black text-indigo-900">${Math.round(route.totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${route.eta.toLocaleDateString()}</p>
            </div>
            ${route.risks.length ? `<div class="mt-4 p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border-l-4 border-red-500">${route.risks.join('<br>')}</div>` : ''}`;
        executiveActions.classList.remove('hidden');
        renderMap(route.path, oHub, dHub);
    }

    function solveRoute(o, d, mode, sandbox) {
        let path = [o.coords];
        let risks = [];
        if (mode === 'sea') {
            const r1 = o.region, r2 = d.region;
            const match = (a, b) => (r1 === a && r2 === b) || (r1 === b && r2 === a);
            
            // NE/SE ASIA to EUROPE
            if (match('NE_ASIA', 'EUROPE_NORTH') || match('SE_ASIA', 'EUROPE_NORTH') || match('NE_ASIA', 'EUROPE_SOUTH') || match('SE_ASIA', 'EUROPE_SOUTH')) {
                if (r1 === 'NE_ASIA' || r2 === 'NE_ASIA') path.push(gates.taiwan_strait);
                path.push(gates.vnm_south, gates.singapore, gates.malacca_entrance, gates.sri_lanka);
                if (sandbox.redSea) {
                    path.push(gates.good_hope, gates.portugal);
                    risks.push("Suez Bypass: Rerouted via Good Hope");
                } else {
                    path.push(gates.bab_el_mandeb, gates.suez, gates.med_west, gates.gibraltar);
                }
                if (r1.includes('NORTH') || r2.includes('NORTH')) path.push(gates.portugal, gates.english_channel);
            }
            // ASIA to US EAST
            else if ((r1.includes('ASIA')) && r2 === 'US_EAST') {
                if (sandbox.panama) {
                    path.push(gates.vnm_south, gates.singapore, gates.sri_lanka, gates.bab_el_mandeb, gates.suez, gates.gibraltar);
                    risks.push("Panama Drought: Rerouted via Suez");
                } else {
                    path.push([20, 160], gates.panama_w, gates.panama_e, gates.florida);
                }
            }
            // ASIA to US WEST
            else if (r1.includes('ASIA') && r2 === 'US_WEST') {
                path.push([35, 170], [35, -140]);
            }
        } else {
            path.push(d.coords);
        }
        path.push(d.coords);

        let dist = 0;
        for (let i = 0; i < path.length - 1; i++) dist += getDist(path[i], path[i+1]);
        const transitD = dist / (mode === 'sea' ? 16 * 1.852 * 24 : 850 * 24);
        const totalD = transitD + (mode === 'sea' ? 7 : 2);
        const eta = new Date(dateInput.value); eta.setDate(eta.getDate() + totalD);
        return { totalD, eta, path, risks };
    }

    function getDist(c1, c2) {
        const R = 6371;
        const dLat = (c2[0]-c1[0])*Math.PI/180, dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function renderMap(path, oH, dH) {
        map.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker) map.removeLayer(l); });
        L.marker(oH.coords).addTo(map); L.marker(dH.coords).addTo(map);
        L.polyline(path, { color: '#4f46e5', weight: 4, className: 'leaflet-ant-path' }).addTo(map);
        map.fitBounds(path, { padding: [50, 50] });
    }

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    document.getElementById('lang-ko').onclick = () => { currentLang='ko'; updateUI(); };
    document.getElementById('lang-en').onclick = () => { currentLang='en'; updateUI(); };
    function updateUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n'); if(translations[currentLang][k]) el.textContent = translations[currentLang][k];
        });
        populate();
    }
    updateUI();
});
