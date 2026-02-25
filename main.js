document.addEventListener('DOMContentLoaded', () => {
    // --- i18n Dictionary ---
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

    // --- Global Hubs Expansion (100+ Cities) ---
    const hubs = {
        // --- ASIA ---
        "kor-pus": { name: "Busan", coords: [35.1069, 129.0453], type: "Both", country: "South Korea", region: "NE_ASIA" },
        "kor-icn": { name: "Incheon", coords: [37.4602, 126.4407], type: "Both", country: "South Korea", region: "NE_ASIA" },
        "chn-sha": { name: "Shanghai", coords: [31.2304, 121.4737], type: "Both", country: "China", region: "NE_ASIA" },
        "chn-hkg": { name: "Hong Kong", coords: [22.3193, 114.1694], type: "Both", country: "Hong Kong", region: "SE_ASIA" },
        "chn-szn": { name: "Shenzhen", coords: [22.5431, 114.0579], type: "Sea", country: "China", region: "SE_ASIA" },
        "chn-tjn": { name: "Tianjin", coords: [38.9667, 117.7833], type: "Sea", country: "China", region: "NE_ASIA" },
        "chn-dln": { name: "Dalian", coords: [38.9167, 121.6167], type: "Sea", country: "China", region: "NE_ASIA" },
        "chn-tao": { name: "Qingdao", coords: [36.0667, 120.3833], type: "Sea", country: "China", region: "NE_ASIA" },
        "chn-ngb": { name: "Ningbo", coords: [29.8667, 121.55], type: "Sea", country: "China", region: "NE_ASIA" },
        "chn-can": { name: "Guangzhou", coords: [23.1291, 113.2644], type: "Both", country: "China", region: "SE_ASIA" },
        "sgp-sin": { name: "Singapore", coords: [1.3521, 103.8198], type: "Both", country: "Singapore", region: "SE_ASIA" },
        "jpn-tyo": { name: "Tokyo", coords: [35.6762, 139.6503], type: "Both", country: "Japan", region: "NE_ASIA" },
        "jpn-osa": { name: "Osaka", coords: [34.6937, 135.5023], type: "Both", country: "Japan", region: "NE_ASIA" },
        "jpn-nag": { name: "Nagoya", coords: [35.1815, 136.9066], type: "Sea", country: "Japan", region: "NE_ASIA" },
        "vnm-hcm": { name: "Ho Chi Minh City", coords: [10.8231, 106.6297], type: "Both", country: "Vietnam", region: "SE_ASIA" },
        "vnm-han": { name: "Haiphong", coords: [20.8449, 106.6881], type: "Sea", country: "Vietnam", region: "SE_ASIA" },
        "ind-bom": { name: "Mumbai", coords: [19.0760, 72.8777], type: "Both", country: "India", region: "SOUTH_ASIA" },
        "ind-maa": { name: "Chennai", coords: [13.0827, 80.2707], type: "Both", country: "India", region: "SOUTH_ASIA" },
        "ind-del": { name: "Delhi", coords: [28.6139, 77.2090], type: "Air", country: "India", region: "SOUTH_ASIA" },
        "ind-ccu": { name: "Kolkata", coords: [22.5726, 88.3639], type: "Both", country: "India", region: "SOUTH_ASIA" },
        "tha-bkk": { name: "Bangkok", coords: [13.7563, 100.5018], type: "Both", country: "Thailand", region: "SE_ASIA" },
        "mys-kul": { name: "Kuala Lumpur", coords: [3.1390, 101.6869], type: "Both", country: "Malaysia", region: "SE_ASIA" },
        "mys-pkg": { name: "Port Klang", coords: [3.0, 101.3667], type: "Sea", country: "Malaysia", region: "SE_ASIA" },
        "twn-tpe": { name: "Taipei", coords: [25.0330, 121.5654], type: "Both", country: "Taiwan", region: "NE_ASIA" },
        "twn-khh": { name: "Kaohsiung", coords: [22.6273, 120.3014], type: "Sea", country: "Taiwan", region: "NE_ASIA" },
        "phl-mnl": { name: "Manila", coords: [14.5995, 120.9842], type: "Both", country: "Philippines", region: "SE_ASIA" },
        "idn-jk": { name: "Jakarta", coords: [-6.2088, 106.8456], type: "Both", country: "Indonesia", region: "SE_ASIA" },
        "idn-sub": { name: "Surabaya", coords: [-7.2575, 112.7521], type: "Sea", country: "Indonesia", region: "SE_ASIA" },

        // --- EUROPE ---
        "nld-rot": { name: "Rotterdam", coords: [51.9225, 4.4792], type: "Both", country: "Netherlands", region: "EUROPE_NORTH" },
        "deu-ham": { name: "Hamburg", coords: [53.5511, 9.9937], type: "Both", country: "Germany", region: "EUROPE_NORTH" },
        "deu-fra": { name: "Frankfurt", coords: [50.1109, 8.6821], type: "Air", country: "Germany", region: "EUROPE_NORTH" },
        "deu-brv": { name: "Bremerhaven", coords: [53.5431, 8.5809], type: "Sea", country: "Germany", region: "EUROPE_NORTH" },
        "gbr-lhr": { name: "London", coords: [51.5074, -0.1278], type: "Both", country: "UK", region: "EUROPE_NORTH" },
        "gbr-fxt": { name: "Felixstowe", coords: [51.9620, 1.3510], type: "Sea", country: "UK", region: "EUROPE_NORTH" },
        "fra-cdg": { name: "Paris", coords: [48.8566, 2.3522], type: "Both", country: "France", region: "EUROPE_NORTH" },
        "fra-lhr": { name: "Le Havre", coords: [49.4938, 0.1077], type: "Sea", country: "France", region: "EUROPE_NORTH" },
        "fra-mrs": { name: "Marseille", coords: [43.2965, 5.3698], type: "Sea", country: "France", region: "EUROPE_SOUTH" },
        "bel-anr": { name: "Antwerp", coords: [51.2194, 4.4025], type: "Sea", country: "Belgium", region: "EUROPE_NORTH" },
        "ita-goa": { name: "Genoa", coords: [44.4056, 8.9463], type: "Sea", country: "Italy", region: "EUROPE_SOUTH" },
        "ita-tri": { name: "Trieste", coords: [45.6495, 13.7768], type: "Sea", country: "Italy", region: "EUROPE_SOUTH" },
        "esp-bcn": { name: "Barcelona", coords: [41.3851, 2.1734], type: "Both", country: "Spain", region: "EUROPE_SOUTH" },
        "esp-vlc": { name: "Valencia", coords: [39.4699, -0.3763], type: "Sea", country: "Spain", region: "EUROPE_SOUTH" },
        "tur-ist": { name: "Istanbul", coords: [41.0082, 28.9784], type: "Both", country: "Turkey", region: "EUROPE_SOUTH" },
        "grc-pir": { name: "Piraeus", coords: [37.9475, 23.6461], type: "Sea", country: "Greece", region: "EUROPE_SOUTH" },

        // --- NORTH AMERICA ---
        "usa-lax": { name: "Los Angeles", coords: [34.0522, -118.2437], type: "Both", country: "USA", region: "US_WEST" },
        "usa-oak": { name: "Oakland", coords: [37.8044, -122.2712], type: "Sea", country: "USA", region: "US_WEST" },
        "usa-sea": { name: "Seattle", coords: [47.6062, -122.3321], type: "Both", country: "USA", region: "US_WEST" },
        "usa-nyc": { name: "New York", coords: [40.7128, -74.0060], type: "Both", country: "USA", region: "US_EAST" },
        "usa-sav": { name: "Savannah", coords: [32.0809, -81.0912], type: "Sea", country: "USA", region: "US_EAST" },
        "usa-hou": { name: "Houston", coords: [29.7604, -95.3698], type: "Both", country: "USA", region: "US_EAST" },
        "usa-mia": { name: "Miami", coords: [25.7617, -80.1918], type: "Both", country: "USA", region: "US_EAST" },
        "usa-chi": { name: "Chicago", coords: [41.8781, -87.6298], type: "Air", country: "USA", region: "US_MID" },
        "can-yvr": { name: "Vancouver", coords: [49.2827, -123.1207], type: "Both", country: "Canada", region: "US_WEST" },
        "can-mon": { name: "Montreal", coords: [45.5017, -73.5673], type: "Both", country: "Canada", region: "US_EAST" },
        "mex-mex": { name: "Mexico City", coords: [19.4326, -99.1332], type: "Air", country: "Mexico", region: "MEXICO" },
        "mex-man": { name: "Manzanillo", coords: [19.0522, -104.3158], type: "Sea", country: "Mexico", region: "MEXICO" },
        "mex-ver": { name: "Veracruz", coords: [19.1738, -96.1342], type: "Sea", country: "Mexico", region: "MEXICO" },

        // --- SOUTH AMERICA ---
        "bra-sao": { name: "Santos", coords: [-23.9608, -46.3339], type: "Sea", country: "Brazil", region: "SA_EAST" },
        "bra-rio": { name: "Rio de Janeiro", coords: [-22.9068, -43.1729], type: "Both", country: "Brazil", region: "SA_EAST" },
        "bra-vcp": { name: "Campinas (VCP)", coords: [-23.0069, -47.1344], type: "Air", country: "Brazil", region: "SA_EAST" },
        "arg-bue": { name: "Buenos Aires", coords: [-34.6037, -58.3816], type: "Both", country: "Argentina", region: "SA_EAST" },
        "chl-val": { name: "Valparaiso", coords: [-33.0472, -71.6127], type: "Sea", country: "Chile", region: "SA_WEST" },
        "chl-scl": { name: "Santiago", coords: [-33.4489, -70.6693], type: "Air", country: "Chile", region: "SA_WEST" },
        "col-ctg": { name: "Cartagena", coords: [10.3910, -75.4794], type: "Sea", country: "Colombia", region: "SA_NORTH" },
        "per-cal": { name: "Callao (Lima)", coords: [-12.05, -77.15], type: "Sea", country: "Peru", region: "SA_WEST" },

        // --- MIDDLE EAST & AFRICA ---
        "uae-dxb": { name: "Dubai (DXB)", coords: [25.2048, 55.2708], type: "Both", country: "UAE", region: "MIDDLE_EAST" },
        "uae-jel": { name: "Jebel Ali", coords: [24.99, 55.07], type: "Sea", country: "UAE", region: "MIDDLE_EAST" },
        "sau-jed": { name: "Jeddah", coords: [21.5433, 39.1728], type: "Both", country: "Saudi Arabia", region: "MIDDLE_EAST" },
        "sau-ruh": { name: "Riyadh", coords: [24.7136, 46.6753], type: "Air", country: "Saudi Arabia", region: "MIDDLE_EAST" },
        "egy-psu": { name: "Port Said", coords: [31.2653, 32.3019], type: "Sea", country: "Egypt", region: "MIDDLE_EAST" },
        "egy-cai": { name: "Cairo", coords: [30.0444, 31.2357], type: "Air", country: "Egypt", region: "MIDDLE_EAST" },
        "zaf-cpt": { name: "Cape Town", coords: [-33.9249, 18.4241], type: "Both", country: "South Africa", region: "AFRICA" },
        "zaf-dur": { name: "Durban", coords: [-29.8587, 31.0218], type: "Both", country: "South Africa", region: "AFRICA" },
        "zaf-jnb": { name: "Johannesburg", coords: [-26.2041, 28.0473], type: "Air", country: "South Africa", region: "AFRICA" },
        "nga-lag": { name: "Lagos", coords: [6.4550, 3.3841], type: "Both", country: "Nigeria", region: "AFRICA" },
        "ken-mba": { name: "Mombasa", coords: [-4.0352, 39.6672], type: "Sea", country: "Kenya", region: "AFRICA" },
        "mar-cas": { name: "Casablanca", coords: [33.5731, -7.5898], type: "Both", country: "Morocco", region: "AFRICA" },

        // --- OCEANIA ---
        "aus-syd": { name: "Sydney", coords: [-33.8688, 151.2093], type: "Both", country: "Australia", region: "OCEANIA" },
        "aus-mel": { name: "Melbourne", coords: [-37.8136, 144.9631], type: "Both", country: "Australia", region: "OCEANIA" },
        "aus-bne": { name: "Brisbane", coords: [-27.4698, 153.0251], type: "Both", country: "Australia", region: "OCEANIA" },
        "nzl-akl": { name: "Auckland", coords: [-36.8485, 174.7633], type: "Both", country: "New Zealand", region: "OCEANIA" }
    };

    // --- Key Maritime Waypoints (The "Skeleton" for realistic paths) ---
    // Added intermediate "buffer" points to avoid land-cutting
    const nav = {
        "south_china_sea": [15.0, 115.0], // Buffer between NE Asia and Malacca
        "malacca": [1.2, 103.8],
        "south_of_india": [5.0, 80.0],    // Buffer between Malacca and Middle East
        "bab_el_mandeb": [12.6, 43.3],
        "suez_canal": [29.9, 32.5],
        "med_central": [35.0, 18.0],      // Buffer in Central Mediterranean
        "gibraltar": [35.9, -5.3],
        "portugal_off": [40.0, -12.0],    // Buffer off Portugal
        "english_channel": [50.0, -1.0],
        "panama_canal": [9.1, -79.7],
        "good_hope": [-35.0, 20.0],
        "cape_horn": [-56.0, -67.0],
        "pacific_mid": [20.0, -165.0],
        "atlantic_mid": [30.0, -40.0],
        "indian_mid": [-15.0, 75.0]
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
            .filter(([id, hub]) => mode === 'air' ? hub.type !== 'Sea' : hub.type !== 'Air')
            .sort((a, b) => a[1].name.localeCompare(b[1].name))
            .forEach(([id, hub]) => {
                const label = `${hub.name}, ${hub.country}`;
                originSelect.add(new Option(label, id));
                destinationSelect.add(new Option(label, id));
            });
        
        if (currentOrigin && hubs[currentOrigin]) originSelect.value = currentOrigin;
        if (currentDest && hubs[currentDest]) destinationSelect.value = currentDest;
    }

    modeSelect.onchange = populate;
    populate();

    const map = L.map('map', { worldCopyJump: true, minZoom: 2 }).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    function calculateAndDisplay() {
        const mode = modeSelect.value;
        const oId = originSelect.value;
        const dId = destinationSelect.value;
        const sandbox = {
            redSea: document.getElementById('risk-redsea').checked,
            panama: document.getElementById('risk-panama').checked,
            strike: document.getElementById('risk-strike').checked
        };

        if (!oId || !dId || oId === dId) return;
        const oHub = hubs[oId];
        const dHub = hubs[dId];
        
        const route = solveRoute(oHub, dHub, mode, sandbox);
        const t = translations[currentLang];

        resultContainer.innerHTML = `
            <div class="space-y-4 animate-fade-in">
                <div class="flex bg-gray-100 p-1 rounded-xl">
                    <button onclick="switchTab('overview')" id="tab-overview" class="flex-1 py-2 text-[9px] font-bold rounded-lg bg-white shadow-sm text-indigo-600">${t.tabOverview}</button>
                    <button onclick="switchTab('strategy')" id="tab-strategy" class="flex-1 py-2 text-[9px] font-bold rounded-lg text-gray-500">${t.tabStrategy}</button>
                </div>

                <div id="tab-content-overview" class="tab-pane space-y-4">
                    <div class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                        <p class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1">${t.totalLead}</p>
                        <p class="text-5xl font-black text-indigo-900">${Math.round(route.totalD)} <span class="text-lg font-bold text-gray-400">Days</span></p>
                        <p class="text-xs font-bold text-indigo-500 mt-1">${t.eta}: ${route.eta.toLocaleDateString()}</p>
                    </div>
                    ${route.risks.length > 0 ? `<div class="p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl shadow-sm"><p class="text-[10px] font-bold text-red-600 uppercase mb-1">Navigation Alerts</p><p class="text-xs font-semibold text-gray-700">${route.risks.join('<br>')}</p></div>` : ''}
                </div>

                <div id="tab-content-strategy" class="tab-pane hidden space-y-4">
                    <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Route Milestones</p>
                        <div class="space-y-3">
                            ${route.milestones.map(m => `
                                <div class="flex items-center gap-3">
                                    <div class="w-2 h-2 rounded-full bg-indigo-600"></div>
                                    <div class="flex-1 border-b border-gray-100 pb-1">
                                        <div class="flex justify-between text-[11px] font-bold">
                                            <span>${m.name}</span>
                                            <span class="text-indigo-600">+${m.days}d</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>`;

        executiveActions.classList.remove('hidden');
        renderMap(route.path, oHub, dHub);
    }

    function solveRoute(o, d, mode, sandbox) {
        let path = [o.coords];
        let risks = [];
        let milestones = [];

        if (mode === 'sea') {
            const r1 = o.region;
            const r2 = d.region;
            const match = (regA, regB) => (r1 === regA && r2 === regB) || (r1 === regB && r2 === regA);
            const from = (reg) => r1 === reg;
            const to = (reg) => r2 === reg;

            // --- REFINED MARITIME ROUTING WITH BUFFERS ---
            
            // Asia <-> Europe
            if (match('NE_ASIA', 'EUROPE_NORTH') || match('SE_ASIA', 'EUROPE_NORTH') || match('NE_ASIA', 'EUROPE_SOUTH') || match('SE_ASIA', 'EUROPE_SOUTH') || match('SOUTH_ASIA', 'EUROPE_NORTH') || match('SOUTH_ASIA', 'EUROPE_SOUTH')) {
                if (from('NE_ASIA') || to('NE_ASIA')) path.push(nav.south_china_sea);
                if (!from('SOUTH_ASIA') && !to('SOUTH_ASIA')) path.push(nav.malacca);
                
                if (sandbox.redSea) {
                    path.push(nav.good_hope);
                    risks.push("Red Sea Conflict: Rerouting via Good Hope");
                } else {
                    if (!from('SOUTH_ASIA') && !to('SOUTH_ASIA')) path.push(nav.south_of_india);
                    path.push(nav.bab_el_mandeb);
                    path.push(nav.suez_canal);
                    path.push(nav.med_central);
                }
                
                path.push(nav.gibraltar);
                if (r1.includes('NORTH') || r2.includes('NORTH')) {
                    path.push(nav.portugal_off);
                    path.push(nav.english_channel);
                }
            }
            // Asia <-> US East Coast
            else if ((from('NE_ASIA') || from('SE_ASIA')) && to('US_EAST')) {
                if (sandbox.panama) {
                    path.push(nav.south_china_sea);
                    path.push(nav.malacca);
                    path.push(nav.south_of_india);
                    path.push(nav.bab_el_mandeb);
                    path.push(nav.suez_canal);
                    path.push(nav.med_central);
                    path.push(nav.gibraltar);
                    path.push(nav.atlantic_mid);
                    risks.push("Panama Congestion: Optimized via Suez Canal");
                } else {
                    path.push(nav.pacific_mid);
                    path.push(nav.panama_canal);
                }
            }
            // Europe <-> US West Coast
            else if (r1.includes('EUROPE') && to('US_WEST')) {
                if (sandbox.panama) {
                    path.push(nav.gibraltar);
                    path.push(nav.cape_horn);
                    risks.push("Panama Closed: Detour via Cape Horn");
                } else {
                    path.push(nav.english_channel);
                    path.push(nav.portugal_off);
                    path.push(nav.gibraltar);
                    path.push(nav.atlantic_mid);
                    path.push(nav.panama_canal);
                }
            }
            // US East <-> US West (Sea)
            else if (match('US_EAST', 'US_WEST')) {
                path.push(nav.panama_canal);
            }
            // Asia <-> Australia
            else if ((from('NE_ASIA') || from('SE_ASIA')) && to('OCEANIA')) {
                if (from('NE_ASIA')) path.push(nav.south_china_sea);
            }
            // Default Fallback
            else {
                path.push(nav.indian_mid); 
            }
        } else {
            // Air: Direct
            path.push(d.coords);
        }
        
        path.push(d.coords);

        let totalDist = 0;
        for (let i = 0; i < path.length - 1; i++) totalDist += getDist(path[i], path[i+1]);

        const speed = mode === 'sea' ? 16 * 1.852 * 24 : 850 * 24; 
        let transitD = totalDist / speed;
        
        if (risks.some(r => r.includes("Good Hope"))) transitD += 12;
        if (risks.some(r => r.includes("Suez Canal") && r.includes("Panama"))) transitD += 8;
        if (sandbox.strike) transitD += 5;

        milestones.push({ name: "Port/Airport Handling", days: mode === 'sea' ? 4 : 1 });
        milestones.push({ name: "Transit", days: Math.max(1, Math.round(transitD)) });
        milestones.push({ name: "Distribution", days: mode === 'sea' ? 3 : 1 });

        let totalD = milestones.reduce((sum, m) => sum + m.days, 0);
        const eta = new Date(dateInput.value); eta.setDate(eta.getDate() + totalD);

        return { totalD, eta, path, risks, milestones };
    }

    function getDist(c1, c2) {
        const R = 6371;
        const dLat = (c2[0]-c1[0])*Math.PI/180;
        const dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function renderMap(path, oH, dH) {
        map.eachLayer(l => { if (l instanceof L.Marker || l instanceof L.Polyline || l instanceof L.Circle) map.removeLayer(l); });
        const dot = () => L.divIcon({ html: `<div class="w-3 h-3 rounded-full border-2 border-white shadow-md bg-indigo-600"></div>`, className: 'custom-div-icon', iconSize: [12, 12] });
        L.marker(oH.coords, {icon: dot()}).addTo(map).bindPopup(`<b>Origin:</b> ${oH.name}`);
        L.marker(dH.coords, {icon: dot()}).addTo(map).bindPopup(`<b>Dest:</b> ${dH.name}`);
        const latlngs = path.map(c => [c[0], c[1]]);
        L.polyline(latlngs, {color: '#4f46e5', weight: 4, className: 'leaflet-ant-path', lineJoin: 'round'}).addTo(map);
        map.fitBounds(latlngs, {padding: [50, 50]});
    }

    window.switchTab = (tab) => {
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
        document.getElementById(`tab-content-${tab}`).classList.remove('hidden');
        document.querySelectorAll('[id^="tab-"]').forEach(b => { b.classList.remove('bg-white', 'shadow-sm', 'text-indigo-600'); b.classList.add('text-gray-500'); });
        document.getElementById(`tab-${tab}`).classList.add('bg-white', 'shadow-sm', 'text-indigo-600');
    };

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
