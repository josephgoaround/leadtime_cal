/**
 * LEADTIME INTELLIGENCE - CORE SYSTEM FILE
 * !!! DATA INTEGRITY LOCK: DO NOT REMOVE HUBS/SEA NODES/EDGES !!!
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. COMPREHENSIVE HUB DATA (100+ GLOBAL SCOPE PRESERVED)
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

    // 2. CORE ENGINE
    let activeRisks = [];
    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Esri', maxZoom: 18 }).addTo(map);

    const originSelect = document.getElementById('origin'), 
          destinationSelect = document.getElementById('destination'), 
          modeSelect = document.getElementById('transport-mode'), 
          hscodeSelect = document.getElementById('hscode'), 
          summaryContainer = document.getElementById('summary-container'),
          riskList = document.getElementById('risk-summary-list');
    const originSearch = document.getElementById('origin-search'), destSearch = document.getElementById('dest-search');

    const nodeDelays = {
        "suez_s": 1, "suez_n": 1, "panama_e": 2, "panama_w": 2, "malacca_mid": 0.5
    };

    const riskZones = [
        { name: "Red Sea", center: [20, 38], radius: 800000, nodes: ["red_sea_1", "red_sea_2", "red_sea_3", "bab_el_mandeb", "suez_s"], risk: "Suez/Red Sea Rerouting" },
        { name: "Panama", center: [9.1, -79.7], radius: 400000, nodes: ["panama_e", "panama_w"], risk: "Panama Canal Restriction" },
        { name: "Hormuz", center: [26.5, 56.5], radius: 300000, nodes: ["hormuz_strait", "jebel_ali_gate"], risk: "Strait of Hormuz Alert" }
    ];

    async function loadMaritimeData() {
        try {
            const res = await fetch('data/maritime_data.json');
            const data = await res.json();
            activeRisks = data.active_risks || [];
            if (riskList) {
                riskList.innerHTML = activeRisks.length > 0 
                    ? activeRisks.map(r => `<li class="flex items-center gap-2 text-red-400"><span class="w-1.5 h-1.5 bg-red-500 rounded-full"></span>⚠️ ${r.label} (+${r.delay}d)</li>`).join('')
                    : '<li class="text-indigo-300">✅ No major infrastructure disruptions</li>';
            }
            
            riskZones.forEach(zone => {
                const isActive = activeRisks.some(r => r.label.includes(zone.name) || (zone.risk && r.label.includes(zone.risk.split('/')[0])));
                if (isActive) {
                    L.circle(zone.center, { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.2, radius: zone.radius }).addTo(map).bindPopup(`<b>${zone.name} Risk Zone</b><br>High delay expected.`);
                }
            });
        } catch (e) { console.error("Failed to load maritime data", e); }
    }

    async function loadNewsPreview() {
        const miniFeed = document.getElementById('news-mini-feed');
        if (!miniFeed) return;
        try {
            const url = `https://raw.githubusercontent.com/josephgoaround/leadtime_cal/news-data/data/news.json?t=${Date.now()}`;
            const res = await fetch(url);
            const news = await res.json();
            const latest = news.slice(0, 3);
            
            miniFeed.innerHTML = latest.map(item => `
                <div class="expert-card p-6 flex flex-col justify-between hover:border-indigo-200 cursor-pointer transition-all" onclick="window.location.href='news.html'">
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <span class="text-[8px] font-black text-indigo-600 uppercase tracking-widest px-2 py-1 bg-indigo-50 rounded border border-indigo-100">${item.category}</span>
                            <span class="text-[8px] font-black text-slate-300 uppercase">${item.time}</span>
                        </div>
                        <h4 class="text-md font-black text-slate-800 mb-2 leading-tight tracking-tight">${item.title}</h4>
                        <p class="text-[11px] text-slate-500 line-clamp-3 font-medium leading-relaxed">${item.content}</p>
                    </div>
                    <div class="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Expert: ${item.author}</span>
                        <span class="text-indigo-600 text-[10px] font-black">→</span>
                    </div>
                </div>
            `).join('');
        } catch (e) {
            miniFeed.innerHTML = '<p class="col-span-3 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest py-12">Intelligence stream temporarily unavailable</p>';
        }
    }

    function populate(filterO = '', filterD = '') {
        const mode = modeSelect.value;
        const currentValO = originSelect.value, currentValD = destinationSelect.value;
        const updateSelect = (select, filter, currentVal) => {
            select.innerHTML = '';
            Object.entries(hubs)
                .filter(([id, h]) => h.type === mode && (h.name.toLowerCase().includes(filter.toLowerCase()) || h.country.toLowerCase().includes(filter.toLowerCase())))
                .sort((a,b)=>a[1].name.localeCompare(b[1].name))
                .forEach(([id,h]) => { select.add(new Option(`${h.name} (${h.country})`, id)); });
            if(currentVal && hubs[currentVal] && hubs[currentVal].type === mode) select.value = currentVal;
        };
        updateSelect(originSelect, filterO, currentValO);
        updateSelect(destinationSelect, filterD, currentValD);
    }

    function getDistHaversine(c1, c2) {
        const R = 6371, dLat = (c2[0]-c1[0])*Math.PI/180, dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function findMaritimePath(start, end) {
        if (!seaNodes[start] || !seaNodes[end]) return { path: [], delay: 0 };
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
                let d = getDistHaversine(seaNodes[closest], seaNodes[neighbor]);
                let nodeDelay = (nodeDelays[neighbor] || 0);
                activeRisks.forEach(risk => {
                    const zone = riskZones.find(z => risk.label.includes(z.name) || (z.risk && r.label.includes(z.risk.split('/')[0])));
                    if (zone && zone.nodes.includes(neighbor)) nodeDelay += risk.delay;
                });
                let alt = distances[closest] + d + (nodeDelay * 500); 
                if (alt < distances[neighbor]) { distances[neighbor] = alt; previous[neighbor] = closest; }
            });
        }
        let path = [], curr = end, totalDelay = 0;
        while (curr) { 
            path.unshift(seaNodes[curr]); 
            totalDelay += (nodeDelays[curr] || 0);
            activeRisks.forEach(risk => {
                const zone = riskZones.find(z => risk.label.includes(z.name) || (z.risk && risk.label.includes(z.risk.split('/')[0])));
                if (zone && zone.nodes.includes(curr)) totalDelay += risk.delay;
            });
            curr = previous[curr]; 
        }
        return { path, totalDelay };
    }

    async function calculateAndDisplay() {
        const oId = originSelect.value, dId = destinationSelect.value;
        if(!oId || !dId || oId === dId) return;
        const o = hubs[oId], d = hubs[dId];
        let totalDist = 0, routePath = [], addedDelay = 0;
        if (modeSelect.value === 'sea') {
            const result = findMaritimePath(o.exit, d.exit);
            const rawPath = [o.coords].concat(result.path).concat([d.coords]);
            routePath = rawPath;
            addedDelay = result.totalDelay;
            for (let i = 0; i < rawPath.length - 1; i++) { totalDist += getDistHaversine(rawPath[i], rawPath[i+1]); }
        } else {
            routePath = [o.coords, d.coords];
            totalDist = getDistHaversine(o.coords, d.coords);
        }
        const cargoDelay = hscodeSelect.value === 'rf' ? 3 : 1;
        const transitDays = Math.round(modeSelect.value === 'sea' ? (totalDist / 750) + 7 + cargoDelay + addedDelay : (totalDist / 8500) + 2);
        const co2 = Math.round(modeSelect.value === 'sea' ? totalDist * 0.012 : totalDist * 0.48);
        const eta = new Date(); eta.setDate(eta.getDate() + transitDays);
        const symbols = { USD: "$", KRW: "₩", EUR: "€" };
        const currency = localStorage.getItem('selectedCurrency') || 'USD';

        summaryContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" id="analysis-results">
                <div class="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 shadow-sm text-center">
                    <p class="text-[10px] font-black text-indigo-600 uppercase mb-2 tracking-widest">Total Lead Time</p>
                    <p class="text-4xl font-black text-indigo-900 leading-none">${transitDays} Days</p>
                    <p class="text-[9px] font-bold text-indigo-400 mt-2">EST. ETA: ${eta.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div class="p-8 bg-green-50 rounded-[2.5rem] border border-green-100 shadow-sm text-center">
                    <p class="text-[10px] font-black text-green-600 uppercase mb-2 tracking-widest">Expert Cost Projection</p>
                    <p class="text-4xl font-black text-green-900 leading-none"><span class="text-sm mr-1 font-black">${symbols[currency]}</span>${Math.round(modeSelect.value === 'sea' ? 1350 + (totalDist * 0.11) + (addedDelay * 100) : 4900 + (totalDist * 2.1)).toLocaleString()}</p>
                    <p class="text-[9px] font-bold text-green-400 mt-2 uppercase">Fuel & Risk Adjusted</p>
                </div>
                <div class="p-8 bg-slate-900 rounded-[2.5rem] text-white text-center">
                    <p class="text-[10px] font-black text-indigo-300 uppercase mb-2 tracking-widest">Carbon Impact</p>
                    <p class="text-4xl font-black text-white leading-none">${co2.toLocaleString()} <span class="text-xs">kg</span></p>
                    <p class="text-[9px] font-bold text-slate-400 mt-2 uppercase">Sustainability Metric</p>
                </div>
            </div>`;
        
        map.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker || l instanceof L.CircleMarker || l instanceof L.Circle) map.removeLayer(l); });
        
        // Redraw risk zones
        riskZones.forEach(zone => {
            const isActive = activeRisks.some(r => r.label.includes(zone.name) || (zone.risk && r.label.includes(zone.risk.split('/')[0])));
            if (isActive) { 
                L.circle(zone.center, { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, radius: zone.radius }).addTo(map)
                 .bindPopup(`<b>${zone.name} High Risk Area</b><br>Expect transit delays.`);
            }
        });

        const routeColor = modeSelect.value === 'sea' ? '#4f46e5' : '#f59e0b';
        L.polyline(routePath, { color: routeColor, weight: 4, dashArray: modeSelect.value === 'sea' ? '1, 10' : null, opacity: 0.6 }).addTo(map);
        
        // Add detailed markers for all nodes along the path
        routePath.forEach((coord, idx) => {
            if (idx === 0 || idx === routePath.length - 1) {
                const marker = L.marker(coord).addTo(map);
                const hubName = idx === 0 ? o.name : d.name;
                marker.bindPopup(`<b>${hubName}</b><br>${idx === 0 ? 'Origin Hub' : 'Destination Hub'}`).openPopup();
            } else {
                L.circleMarker(coord, { radius: 3, color: routeColor, fillColor: routeColor, fillOpacity: 1, weight: 1 }).addTo(map);
            }
        });

        map.fitBounds(L.polyline(routePath).getBounds(), { padding: [50, 50] });
    }

    if(modeSelect) modeSelect.onchange = () => populate();
    if(originSearch) originSearch.oninput = (e) => populate(e.target.value, destSearch.value);
    if(destSearch) destSearch.oninput = (e) => populate(originSearch.value, e.target.value);
    if(document.getElementById('shipping-form')) document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    
    loadMaritimeData();
    loadNewsPreview();
    populate();
});
