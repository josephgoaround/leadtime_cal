/**
 * LEADTIME INTELLIGENCE - CORE SYSTEM FILE
 * 
 * !!! MANDATORY COMPLIANCE HEADER !!!
 * 1. DATA INTEGRITY: NEVER truncate or remove ports/airports from the 'hubs' object.
 * 2. ROUTING PRECISION: NEVER simplify 'seaNodes' or 'seaEdges'.
 * 3. LANGUAGE: Strictly English only.
 */

document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            navAnalyzer: "Analyzer", navPlanner: "3D Load Planner", navNews: "Logistics News", navAbout: "About",
            subtitle: "Global Container Logistics AI Pathfinder",
            formTitle: "Route Config",
            labelMode: "Transport Mode", labelDate: "Departure Date", labelOrigin: "Departure City", labelDest: "Arrival City", labelHSCode: "Cargo Type",
            btnAnalyze: "RUN ROUTE ANALYSIS",
            totalLead: "Total Lead Time", totalDist: "Voyage Distance", eta: "Estimated ETA", labelCost: "Estimated Cost",
            unitDays: "Days", unitNM: "NM", marketRateLabel: "Market Benchmark Rate",
            compareTitle: "Comparison", compareSea: "Container Shipping", compareAir: "Air Alternative",
            newsTitle: "Country-Specific SCM & Customs Intel",
            autoRiskLabel: "Automated Risk Intelligence Active",
            disclaimerSpeed: "• Lead times based on avg. container vessel speed (17kts) and air cargo (850km/h).",
            feedPlaceholder: "Select a route to generate deep-dive intelligence briefing.",
            waitingAnalysis: "Waiting for Analysis...",
            finalDisclaimer: "NOTICE: Results are for reference only. For actual logistics operations, please verify all data with your carrier for absolute precision.",
            activeRisksLabel: "Active Risks"
        }
    };

    let currentCurrency = localStorage.getItem('selectedCurrency') || 'USD';
    const rates = { USD: 1, KRW: 1350, EUR: 0.92 };
    const symbols = { USD: "$", KRW: "₩", EUR: "€" };

    let activeRisks = []; 

    const hubs = {
        "sea-sha": { name: "Shanghai", coords: [31.23, 121.47], type: "sea", exit: "shanghai_gate", country: "China" },
        "sea-sin": { name: "Singapore", coords: [1.26, 103.83], type: "sea", exit: "singapore_gate", country: "Singapore" },
        "sea-nbo": { name: "Ningbo-Zhoushan", coords: [29.86, 121.54], type: "sea", exit: "shanghai_gate", country: "China" },
        "sea-szx": { name: "Shenzhen", coords: [22.54, 114.05], type: "sea", exit: "hongkong_outer", country: "China" },
        "sea-can": { name: "Guangzhou", coords: [23.13, 113.26], type: "sea", exit: "hongkong_outer", country: "China" },
        "sea-pus": { name: "Busan", coords: [35.10, 129.04], type: "sea", exit: "pusan_gate", country: "South Korea" },
        "sea-tao": { name: "Qingdao", coords: [36.07, 120.38], type: "sea", exit: "jeju_s", country: "China" },
        "sea-hkg": { name: "Hong Kong", coords: [22.31, 114.16], type: "sea", exit: "hongkong_outer", country: "Hong Kong" },
        "sea-tjn": { name: "Tianjin", coords: [38.96, 117.78], type: "sea", exit: "jeju_s", country: "China" },
        "sea-dxb": { name: "Jebel Ali (Dubai)", coords: [25.01, 55.06], type: "sea", exit: "jebel_ali_gate", country: "UAE" },
        "sea-rot": { name: "Rotterdam", coords: [51.92, 4.47], type: "sea", exit: "rotterdam_exit", country: "Netherlands" },
        "sea-pkg": { name: "Port Klang", coords: [2.99, 101.39], type: "sea", exit: "malacca_mid", country: "Malaysia" },
        "sea-ant": { name: "Antwerp", coords: [51.24, 4.41], type: "sea", exit: "antwerp_exit", country: "Belgium" },
        "sea-khh": { name: "Kaohsiung", coords: [22.62, 120.30], type: "sea", exit: "taipei_outer", country: "Taiwan" },
        "sea-ham": { name: "Hamburg", coords: [53.55, 9.99], type: "sea", exit: "hamburg_exit", country: "Germany" },
        "sea-lax": { name: "Los Angeles", coords: [33.75, -118.27], type: "sea", exit: "lax_gate", country: "USA" },
        "sea-lgb": { name: "Long Beach", coords: [33.77, -118.19], type: "sea", exit: "lax_gate", country: "USA" },
        "sea-tan": { name: "Tanjung Pelepas", coords: [1.36, 103.54], type: "sea", exit: "singapore_gate", country: "Malaysia" },
        "sea-lae": { name: "Laem Chabang", coords: [13.08, 100.91], type: "sea", exit: "vietnam_s", country: "Thailand" },
        "sea-yok": { name: "Yokohama", coords: [35.44, 139.64], type: "sea", exit: "tokyo_outer", country: "Japan" },
        "sea-col": { name: "Colombo", coords: [6.92, 79.86], type: "sea", exit: "srilanka_s", country: "Sri Lanka" },
        "sea-tjp": { name: "Tanjung Priok", coords: [-6.10, 106.88], type: "sea", exit: "malacca_mid", country: "Indonesia" },
        "sea-hcm": { name: "Ho Chi Minh City", coords: [10.76, 106.66], type: "sea", exit: "vietnam_s", country: "Vietnam" },
        "sea-sav": { name: "Savannah", coords: [32.12, -81.12], type: "sea", exit: "savannah_exit", country: "USA" },
        "sea-mun": { name: "Mundra", coords: [22.83, 69.70], type: "sea", exit: "arabian_sea_mid", country: "India" },
        "sea-val": { name: "Valencia", coords: [39.45, -0.32], type: "sea", exit: "med_mid", country: "Spain" },
        "sea-pir": { name: "Piraeus", coords: [37.94, 23.64], type: "sea", exit: "suez_n", country: "Greece" },
        "sea-alg": { name: "Algeciras", coords: [36.13, -5.45], type: "sea", exit: "gibraltar", country: "Spain" },
        "sea-ssz": { name: "Santos", coords: [-23.96, -46.33], type: "sea", exit: "brazil_e", country: "Brazil" },
        "sea-dur": { name: "Durban", coords: [-29.87, 31.02], type: "sea", exit: "good_hope", country: "South Africa" },
        "sea-syd": { name: "Sydney (Botany)", coords: [-33.97, 151.22], type: "sea", exit: "sydney_outer", country: "Australia" },
        "sea-mel": { name: "Melbourne", coords: [-37.84, 144.92], type: "sea", exit: "sydney_outer", country: "Australia" },
        "sea-pnm": { name: "Panama City", coords: [8.95, -79.56], type: "sea", exit: "panama_e", country: "Panama" },
        "sea-nyc": { name: "New York", coords: [40.71, -74.00], type: "sea", exit: "nyc_gate", country: "USA" },
        "sea-hou": { name: "Houston", coords: [29.76, -95.36], type: "sea", exit: "panama_e", country: "USA" },
        "sea-feli": { name: "Felixstowe", coords: [51.96, 1.35], type: "sea", exit: "rotterdam_exit", country: "UK" },
        "sea-leh": { name: "Le Havre", coords: [49.49, 0.10], type: "sea", exit: "rotterdam_exit", country: "France" },
        "sea-ba": { name: "Buenos Aires", coords: [-34.60, -58.38], type: "sea", exit: "brazil_e", country: "Argentina" },
        "sea-van": { name: "Vancouver", coords: [49.28, -123.12], type: "sea", exit: "lax_gate", country: "Canada" },
        "sea-jed": { name: "Jeddah", coords: [21.54, 39.17], type: "sea", exit: "red_sea_2", country: "Saudi Arabia" },
        "sea-psd": { name: "Port Said", coords: [31.26, 32.30], type: "sea", exit: "suez_n", country: "Egypt" },
        "sea-oak": { name: "Oakland", coords: [37.80, -122.27], type: "sea", exit: "lax_gate", country: "USA" },
        "sea-sea": { name: "Seattle", coords: [47.60, -122.33], type: "sea", exit: "lax_gate", country: "USA" },
        "sea-phead": { name: "Port Hedland", coords: [-20.31, 118.57], type: "sea", exit: "indonesia_s", country: "Australia" },
        "sea-tuba": { name: "Tubarao", coords: [-20.28, -40.24], type: "sea", exit: "brazil_e", country: "Brazil" },
        "sea-qatar": { name: "Ras Laffan", coords: [25.90, 51.53], type: "sea", exit: "hormuz_strait", country: "Qatar" },
        "sea-uls": { name: "Ulsan", coords: [35.53, 129.31], type: "sea", exit: "pusan_gate", country: "South Korea" },
        "sea-gwa": { name: "Gwangyang", coords: [34.94, 127.69], type: "sea", exit: "pusan_gate", country: "South Korea" },
        "sea-poh": { name: "Pohang", coords: [36.01, 129.38], type: "sea", exit: "pusan_gate", country: "South Korea" },
        "sea-yamal": { name: "Sabetta (Yamal)", coords: [71.27, 72.07], type: "sea", exit: "arctic_n", country: "Russia" },
        "sea-sabine": { name: "Sabine Pass", coords: [29.73, -93.87], type: "sea", exit: "panama_e", country: "USA" },
        "sea-tger": { name: "Tanger Med", coords: [35.88, -5.50], type: "sea", exit: "gibraltar", country: "Morocco" },
        "sea-mom": { name: "Mombasa", coords: [-4.04, 39.66], type: "sea", exit: "madagascar_nw", country: "Kenya" },
        "sea-dji": { name: "Djibouti", coords: [11.58, 43.14], type: "sea", exit: "bab_el_mandeb", country: "Djibouti" },
        "sea-chan": { name: "Chancay", coords: [-11.58, -77.27], type: "sea", exit: "chancay_exit", country: "Peru" },
        "air-icn": { name: "Incheon (ICN)", coords: [37.46, 126.44], type: "air", country: "South Korea" },
        "air-hkg": { name: "Hong Kong (HKG)", coords: [22.31, 113.91], type: "air", country: "HK" },
        "air-fra": { name: "Frankfurt (FRA)", coords: [50.03, 8.57], type: "air", country: "Germany" },
        "air-pvg": { name: "Shanghai (PVG)", coords: [31.14, 121.80], type: "air", country: "China" },
        "air-mem": { name: "Memphis (MEM)", coords: [35.04, -89.97], type: "air", country: "USA" },
        "air-anc": { name: "Anchorage (ANC)", coords: [61.17, -149.99], type: "air", country: "USA" },
        "air-dxb": { name: "Dubai (DXB)", coords: [25.25, 55.36], type: "air", country: "UAE" },
        "air-sdf": { name: "Louisville (SDF)", coords: [38.17, -85.73], type: "air", country: "USA" },
        "air-tpe": { name: "Taipei (TPE)", coords: [25.07, 121.23], type: "air", country: "Taiwan" },
        "air-nrt": { name: "Tokyo (NRT)", coords: [35.77, 140.39], type: "air", country: "Japan" },
        "air-cdg": { name: "Paris (CDG)", coords: [49.00, 2.55], type: "air", country: "France" },
        "air-ams": { name: "Amsterdam (AMS)", coords: [52.31, 4.76], type: "air", country: "Netherlands" },
        "air-mia": { name: "Miami (MIA)", coords: [25.79, -80.28], type: "air", country: "USA" },
        "air-ord": { name: "Chicago (ORD)", coords: [41.97, -87.90], type: "air", country: "USA" },
        "air-lhr": { name: "London (LHR)", coords: [51.47, -0.45], type: "air", country: "UK" },
        "air-sin": { name: "Singapore (SIN)", coords: [1.36, 103.99], type: "air", country: "Singapore" },
        "air-bkk": { name: "Bangkok (BKK)", coords: [13.69, 100.75], type: "air", country: "Thailand" },
        "air-del": { name: "Delhi (DEL)", coords: [28.55, 77.10], type: "air", country: "India" },
        "air-bom": { name: "Mumbai (BOM)", coords: [19.08, 72.86], type: "air", country: "India" },
        "air-syd": { name: "Sydney (SYD)", coords: [-33.94, 151.17], type: "air", country: "Australia" },
        "air-gru": { name: "Sao Paulo (GRU)", coords: [-23.43, -46.47], type: "air", country: "Brazil" },
        "air-jnb": { name: "Johannesburg (JNB)", coords: [-26.13, 28.24], type: "air", country: "South Africa" },
        "air-lux": { name: "Luxembourg (LUX)", coords: [49.62, 6.21], type: "air", country: "LUX" },
        "air-lej": { name: "Leipzig (LEJ)", coords: [51.42, 12.23], type: "air", country: "Germany" },
        "air-can": { name: "Guangzhou (CAN)", coords: [23.39, 113.29], type: "air", country: "China" },
        "air-szx": { name: "Shenzhen (SZX)", coords: [22.63, 113.81], type: "air", country: "China" },
        "air-cgk": { name: "Jakarta (CGK)", coords: [-6.12, 106.65], type: "air", country: "Indonesia" },
        "air-kul": { name: "Kuala Lumpur (KUL)", coords: [2.74, 101.70], type: "air", country: "Malaysia" },
        "air-mad": { name: "Madrid (MAD)", coords: [40.49, -3.56], type: "air", country: "Spain" },
        "air-mxp": { name: "Milan (MXP)", coords: [45.63, 8.72], type: "air", country: "Italy" },
        "air-jfk": { name: "New York (JFK)", coords: [40.64, -73.77], type: "air", country: "USA" }
    };

    const seaNodes = {
        "pusan_gate": [35.0, 129.1], "namhae_s": [34.2, 128.0], "jeju_s": [32.5, 126.5], "incheon_gate": [37.2, 126.1],
        "shanghai_gate": [31.2, 122.5], "ningbo_exit": [29.8, 122.5], "taipei_outer": [25.5, 123.0], "hongkong_outer": [21.5, 115.0], "luzon_strait": [20.0, 121.5],
        "vietnam_s": [9.0, 108.0], "vietnam_tip": [8.2, 105.0], "malacca_e": [1.5, 104.8], "singapore_gate": [1.2, 103.8], "malacca_mid": [2.8, 101.0], "malacca_west": [5.2, 97.5], "andaman_sea": [6.5, 94.0],
        "srilanka_s": [5.5, 80.5], "arabian_sea_mid": [15.0, 62.0], "jebel_ali_gate": [25.5, 55.5], "hormuz_strait": [26.5, 56.5],
        "bab_el_mandeb": [12.6, 43.3], "red_sea_1": [17.0, 40.5], "red_sea_2": [21.0, 38.0], "red_sea_3": [25.0, 36.0], "suez_s": [29.8, 32.6], "suez_n": [31.3, 32.3],
        "med_mid": [34.5, 18.0], "gibraltar": [35.9, -5.8], "portugal_w": [39.0, -11.0], "rotterdam_exit": [52.0, 3.8], "hamburg_exit": [54.0, 8.2], "antwerp_exit": [51.3, 4.3],
        "good_hope": [-36.0, 20.0], "west_africa_1": [15.0, -19.0],
        "madagascar_ne": [-10.0, 55.0], "madagascar_se": [-30.0, 52.0], "madagascar_nw": [-10.0, 42.0], "madagascar_sw": [-30.0, 40.0],
        "panama_e": [9.5, -79.8], "panama_w": [8.8, -79.6], "lax_gate": [32.5, -120.0], "nyc_gate": [40.2, -73.5], "savannah_exit": [31.5, -80.5], "brazil_e": [-6.0, -34.0],
        "pacific_mid_w": [30.0, 175.0], "pacific_mid_e": [30.0, -175.0], "sydney_outer": [-35.0, 153.0], "tokyo_outer": [34.0, 141.5],
        "atlantic_mid_n": [45.0, -40.0], "atlantic_mid_s": [20.0, -35.0], "english_channel": [50.0, -2.0], "azores": [38.0, -28.0],
        "tasman_sea": [-40.0, 160.0],
        "arctic_n": [75.0, 70.0], "bering_strait": [66.0, -169.0], "indonesia_s": [-10.0, 115.0], "chancay_exit": [-12.0, -85.0]
    };

    const seaEdges = [
        ["pusan_gate", "namhae_s"], ["namhae_s", "jeju_s"], ["jeju_s", "shanghai_gate"], ["incheon_gate", "jeju_s"],
        ["shanghai_gate", "ningbo_exit"], ["ningbo_exit", "taipei_outer"], ["taipei_outer", "hongkong_outer"], ["hongkong_outer", "luzon_strait"], ["hongkong_outer", "vietnam_s"], ["vietnam_s", "vietnam_tip"], ["vietnam_tip", "malacca_e"], ["malacca_e", "singapore_gate"], ["singapore_gate", "malacca_mid"], ["malacca_mid", "malacca_west"], ["malacca_west", "andaman_sea"], ["andaman_sea", "srilanka_s"],
        ["srilanka_s", "arabian_sea_mid"], ["arabian_sea_mid", "hormuz_strait"], ["hormuz_strait", "jebel_ali_gate"], ["arabian_sea_mid", "bab_el_mandeb"], ["bab_el_mandeb", "red_sea_1"], ["red_sea_1", "red_sea_2"], ["red_sea_2", "red_sea_3"], ["red_sea_3", "suez_s"], ["suez_s", "suez_n"], ["suez_n", "med_mid"], ["med_mid", "gibraltar"], ["gibraltar", "portugal_w"], ["portugal_w", "rotterdam_exit"], ["rotterdam_exit", "hamburg_exit"], ["rotterdam_exit", "antwerp_exit"],
        ["taipei_outer", "pacific_mid_w"], ["pacific_mid_w", "pacific_mid_e"], ["pacific_mid_e", "lax_gate"], ["tokyo_outer", "pacific_mid_w"], ["lax_gate", "panama_w"],
        ["portugal_w", "nyc_gate"], ["english_channel", "atlantic_mid_n"], ["atlantic_mid_n", "nyc_gate"], ["hamburg_exit", "english_channel"], ["rotterdam_exit", "english_channel"], ["antwerp_exit", "english_channel"], ["gibraltar", "azores"], ["azores", "atlantic_mid_n"], ["atlantic_mid_n", "savannah_exit"],
        ["brazil_e", "portugal_w"], ["brazil_e", "good_hope"], ["good_hope", "west_africa_1"], ["west_africa_1", "portugal_w"], ["srilanka_s", "madagascar_ne"], ["madagascar_ne", "madagascar_se"], ["madagascar_se", "good_hope"], ["srilanka_s", "madagascar_nw"], ["madagascar_nw", "madagascar_sw"], ["madagascar_sw", "good_hope"],
        ["panama_e", "brazil_e"], ["panama_e", "nyc_gate"], ["panama_e", "savannah_exit"], ["savannah_exit", "nyc_gate"],
        ["singapore_gate", "sydney_outer"], ["sydney_outer", "tasman_sea"], ["tasman_sea", "pacific_mid_e"],
        ["arctic_n", "rotterdam_exit"], ["arctic_n", "bering_strait"], ["bering_strait", "pacific_mid_w"],
        ["indonesia_s", "singapore_gate"], ["indonesia_s", "sydney_outer"],
        ["chancay_exit", "pacific_mid_e"], ["chancay_exit", "lax_gate"]
    ];

    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Esri', maxZoom: 18 }).addTo(map);

    const originSelect = document.getElementById('origin'), 
          destinationSelect = document.getElementById('destination'), 
          modeSelect = document.getElementById('transport-mode'), 
          hscodeSelect = document.getElementById('hscode'), 
          summaryContainer = document.getElementById('summary-container'),
          feedContainer = document.getElementById('feed-container');
    const newsTicker = document.getElementById('news-ticker');
    const originSearch = document.getElementById('origin-search'), destSearch = document.getElementById('dest-search');

    function renderRiskMarkers() {
        map.eachLayer(l => { if (l instanceof L.Circle) map.removeLayer(l); });
        const riskPoints = {
            "suez_disruption": [12.6, 43.3],
            "panama_disruption": [9.0, -79.6],
            "hormuz_disruption": [26.5, 56.5]
        };
        activeRisks.forEach(risk => {
            if (riskPoints[risk.id]) {
                L.circle(riskPoints[risk.id], {
                    color: '#ef4444',
                    fillColor: '#ef4444',
                    fillOpacity: 0.4,
                    radius: 800000,
                    weight: 2
                }).addTo(map).bindPopup(`<b>RISK ALERT: ${risk.label}</b><br>${risk.source_news}`);
            }
        });
    }

    async function loadLiveNews() {
        try {
            const response = await fetch('data/maritime_data.json');
            if (!response.ok) return;
            const data = await response.json();
            activeRisks = data.active_risks || [];
            const riskSummaryList = document.getElementById('risk-summary-list');
            renderRiskMarkers();
            if (data.alerts && data.alerts.length > 0 && newsTicker) {
                newsTicker.innerHTML = data.alerts.map(a => `<span class="mx-4">${a.msg}</span>`).join('');
            }
            if (activeRisks.length > 0 && riskSummaryList) {
                riskSummaryList.innerHTML = activeRisks.map(r => `<li>${r.label} (+${r.delay}d)</li>`).join('');
            }
        } catch (e) { console.error("Failed to load live news:", e); }
    }

    loadLiveNews();

    function populate(filterO = '', filterD = '') {
        if(!originSelect || !destinationSelect) return;
        const mode = modeSelect.value;
        const curO = originSelect.value, curD = destinationSelect.value;
        const updateSelect = (select, filter) => {
            const currentVal = select.value;
            select.innerHTML = '';
            Object.entries(hubs)
                .filter(([id, h]) => h.type === mode && (h.name.toLowerCase().includes(filter.toLowerCase()) || h.country.toLowerCase().includes(filter.toLowerCase())))
                .sort((a,b)=>a[1].name.localeCompare(b[1].name))
                .forEach(([id,h]) => { 
                    select.add(new Option(`${h.name} (${h.country})`, id)); 
                });
            if(currentVal && hubs[currentVal] && hubs[currentVal].type === mode) select.value = currentVal;
        };
        updateSelect(originSelect, filterO);
        updateSelect(destinationSelect, filterD);
    }

    if(modeSelect) modeSelect.onchange = () => populate();
    if(originSearch) originSearch.oninput = (e) => populate(e.target.value, destSearch ? destSearch.value : '');
    if(destSearch) destSearch.oninput = (e) => populate(originSearch ? originSearch.value : '', e.target.value);
    populate();

    function getOptimizedPath(start, end, points = 50) {
        const path = [];
        const lat1 = start[0] * Math.PI / 180, lon1 = start[1] * Math.PI / 180;
        const lat2 = end[0] * Math.PI / 180, lon2 = end[1] * Math.PI / 180;
        const d = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin((lat1 - lat2) / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)));
        let lastLon = start[1];
        for (let i = 0; i <= points; i++) {
            const f = i / points;
            const A = Math.sin((1 - f) * d) / Math.sin(d), B = Math.sin(f * d) / Math.sin(d);
            const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
            const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
            const z = A * Math.sin(lat1) + B * Math.sin(lat2);
            const lat = Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) * 180 / Math.PI;
            let lon = Math.atan2(y, x) * 180 / Math.PI;
            if (Math.abs(lon - lastLon) > 180) lon += (lon > lastLon) ? -360 : 360;
            path.push([lat, lon]); lastLon = lon;
        }
        return path;
    }

    function findMaritimePath(start, end, isRiskActive) {
        if (!seaNodes[start] || !seaNodes[end]) return [];
        let distances = {}, previous = {}, nodes = new Set();
        Object.keys(seaNodes).forEach(node => { distances[node] = Infinity; nodes.add(node); });
        distances[start] = 0;
        while (nodes.size > 0) {
            let closest = Array.from(nodes).reduce((min, n) => distances[n] < distances[min] ? n : min);
            if (closest === end || distances[closest] === Infinity) break;
            nodes.delete(closest);
            seaEdges.forEach(([u, v]) => {
                if (u !== closest && v !== closest) return;
                let neighbor = u === closest ? v : u;
                if (!nodes.has(neighbor)) return;
                let weightMultiplier = 1;
                if (isRiskActive && ["bab_el_mandeb", "suez_s", "red_sea_1", "red_sea_2", "red_sea_3"].includes(neighbor)) weightMultiplier = 100;
                activeRisks.forEach(risk => {
                    if (risk.id === 'panama_disruption' && ["panama_e", "panama_w"].includes(neighbor)) weightMultiplier = 2;
                    if (risk.id === 'hormuz_disruption' && ["hormuz_strait"].includes(neighbor)) weightMultiplier = 5;
                });
                let d = getDistHaversine(seaNodes[closest], seaNodes[neighbor]) * weightMultiplier;
                let alt = distances[closest] + d;
                if (alt < distances[neighbor]) { distances[neighbor] = alt; previous[neighbor] = closest; }
            });
        }
        let path = [], curr = end;
        while (curr) { path.unshift(seaNodes[curr]); curr = previous[curr]; }
        return path;
    }

    function getDistHaversine(c1, c2) {
        const R = 6371, dLat = (c2[0]-c1[0])*Math.PI/180, dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    async function fetchSummarizedNews(oHub, dHub) {
        const hs = hscodeSelect ? hscodeSelect.value : 'general';
        let newsHtml = `<div class="mt-12 border-t pt-8 animate-fade-in"><h4 class="text-sm font-black text-gray-700 uppercase tracking-widest mb-6">Country-Specific SCM & Customs Intel</h4><div class="grid grid-cols-1 md:grid-cols-2 gap-6">`;
        const insights = [
            { title: `${oHub.country} Terminal Pulse`, content: `Operational efficiency at ${oHub.name} is currently high. Average vessel turnaround is 24-36 hours.` },
            { title: `${dHub.country} Customs Alert`, content: `Standard clearance for ${hs} cargo. Ensure all digital manifests are pre-lodged.` },
            { title: `Global SCM Trend`, content: `Trade corridor between ${oHub.country} and ${dHub.country} shows stable container flow with minor seasonal fluctuations.` }
        ];
        insights.forEach(item => {
            newsHtml += `<div class="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:border-indigo-300 transition-all"><div class="flex items-center gap-2 mb-2"><span class="w-2 h-2 bg-indigo-500 rounded-full"></span><h5 class="text-xs font-bold text-indigo-600 uppercase">${item.title}</h5></div><p class="text-[11px] text-gray-500 leading-relaxed">${item.content}</p></div>`;
        });
        newsHtml += `</div></div>`;
        if (feedContainer) feedContainer.innerHTML = newsHtml;
    }

    const cargoDelays = { general: 1, rf: 3, dg: 5, electronics: 2, pharma: 4 };

    function solveRoute(oId, dId, mode, cargo) {
        const o = hubs[oId], d = hubs[dId];
        let routePath = [], totalDist = 0;
        const inlandDist = 150, inlandDays = mode === 'sea' ? 1.5 : 0.5;
        let appliedRisks = [];
        if (mode === 'sea') {
            activeRisks.forEach(risk => {
                if (risk.id === 'suez_disruption' && ((o.exit === 'suez_n' || d.exit === 'suez_n') || (o.country === 'China' || o.country === 'Singapore' || o.country === 'South Korea') && (d.country === 'Netherlands' || d.country === 'Germany' || d.country === 'Belgium'))) appliedRisks.push(risk);
                if (risk.id === 'panama_disruption' && (o.name.includes('Panama') || d.name.includes('Panama') || o.exit === 'panama_e' || d.exit === 'panama_e')) appliedRisks.push(risk);
                if (risk.id === 'hormuz_disruption' && (o.exit === 'hormuz_strait' || d.exit === 'hormuz_strait')) appliedRisks.push(risk);
            });
        }
        const riskDelay = appliedRisks.reduce((sum, r) => sum + r.delay, 0);
        const riskCost = appliedRisks.reduce((sum, r) => sum + r.cost, 0);
        if (mode === 'sea') {
            const isSuezDisrupted = appliedRisks.some(r => r.id === 'suez_disruption');
            const maritimeNodes = findMaritimePath(o.exit, d.exit, isSuezDisrupted);
            const rawPath = [o.coords].concat(maritimeNodes).concat([d.coords]);
            for (let i = 0; i < rawPath.length - 1; i++) {
                const seg = getOptimizedPath(rawPath[i], rawPath[i+1], 10);
                if (i === 0) routePath = seg;
                else {
                    const lastPoint = routePath[routePath.length - 1];
                    const normalizedSeg = seg.map(p => {
                        let lon = p[1];
                        while (lon - lastPoint[1] > 180) lon -= 360;
                        while (lon - lastPoint[1] < -180) lon += 360;
                        return [p[0], lon];
                    });
                    routePath = routePath.concat(normalizedSeg.slice(1));
                }
                totalDist += getDistHaversine(rawPath[i], rawPath[i+1]);
            }
        } else {
            routePath = getOptimizedPath(o.coords, d.coords, 100);
            totalDist = getDistHaversine(o.coords, d.coords);
        }
        const transitDays = (totalDist / ((mode === 'sea' ? 17 : 850) * 1.852 * 24)) + (mode === 'sea' ? 7 : 2) + (cargoDelays[cargo] || 1) + riskDelay + inlandDays;
        const costUSD = (mode === 'sea' ? 1200 + (totalDist * 0.15) : 4000 + (totalDist * 2.8)) + riskCost + (inlandDist * 0.5);
        const eta = new Date(); eta.setDate(eta.getDate() + transitDays);
        return { transitDays, eta, routePath, totalDist, costUSD, appliedRisks };
    }

    async function calculateAndDisplay() {
        const oId = originSelect.value, dId = destinationSelect.value;
        if(!oId || !dId || oId === dId || !summaryContainer) return;
        const currentRoute = solveRoute(oId, dId, modeSelect.value, hscodeSelect.value);
        const costConverted = currentRoute.costUSD * rates[currentCurrency];
        
        const comparisonHTML = modeSelect.value === 'sea' 
            ? `<p class="text-[10px] font-black text-orange-600 uppercase mb-1">vs Air Cargo</p><p class="text-[11px] font-black text-slate-700 leading-tight">Save <span class="text-blue-600">${Math.round(currentRoute.transitDays - 3)} Days</span></p>`
            : `<p class="text-[10px] font-black text-orange-600 uppercase mb-1">vs Container</p><p class="text-[11px] font-black text-slate-700 leading-tight">Save <span class="text-blue-600">${symbols[currentCurrency]}${Math.round(currentRoute.costUSD * 0.3)}</span></p>`;

        summaryContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" id="analysis-results">
                <div class="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Total Lead Time</p>
                    <p class="text-3xl font-black text-indigo-900">${Math.round(currentRoute.transitDays)} Days</p>
                    <p class="text-[9px] font-bold text-indigo-400 mt-1">Estimated ETA: ${currentRoute.eta.toLocaleDateString('en-US')}</p>
                </div>
                <div class="p-6 bg-green-50 rounded-[2rem] border border-green-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <p class="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Estimated Cost</p>
                    <p class="text-3xl font-black text-green-900 leading-none"><span class="text-sm mr-1">${symbols[currentCurrency]}</span>${Math.round(costConverted).toLocaleString()}</p>
                    <p class="text-[9px] font-bold text-green-400 mt-1 uppercase">Market Benchmark Rate</p>
                </div>
                <div class="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <p class="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Comparison</p>
                    ${comparisonHTML}
                </div>
            </div>`;
        
        renderMap(currentRoute.routePath, modeSelect.value);
        await fetchSummarizedNews(hubs[oId], hubs[dId]);
    }

    function renderMap(path, mode) {
        map.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker) map.removeLayer(l); });
        L.polyline(path, { color: mode === 'sea' ? '#4f46e5' : '#f59e0b', weight: 4 }).addTo(map);
        L.marker(path[0]).addTo(map); L.marker(path[path.length - 1]).addTo(map);
        map.fitBounds(L.polyline(path).getBounds(), { padding: [30, 30] });
    }

    if(document.getElementById('shipping-form')) document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    ['usd', 'krw', 'eur'].forEach(curr => { 
        const btn = document.getElementById(`curr-${curr}`);
        if(btn) btn.onclick = () => { currentCurrency = curr.toUpperCase(); localStorage.setItem('selectedCurrency', currentCurrency); location.reload(); }; 
    });

    populate();
});