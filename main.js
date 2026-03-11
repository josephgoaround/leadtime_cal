/**
 * LEADTIME INTELLIGENCE - CORE SYSTEM FILE
 * Strictly English - Standard Routing Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. DATA HUB (COMPREHENSIVE LIST)
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
        "air-lhr": { name: "London (LHR)", coords: [51.47, -0.45], type: "air", country: "UK" }
    };

    const seaNodes = {
        "pusan_gate": [35.0, 129.1], "namhae_s": [34.2, 128.0], "jeju_s": [32.5, 126.5], "shanghai_gate": [31.2, 122.5],
        "singapore_gate": [1.2, 103.8], "malacca_mid": [2.8, 101.0], "srilanka_s": [5.5, 80.5], "jebel_ali_gate": [25.5, 55.5],
        "bab_el_mandeb": [12.6, 43.3], "suez_s": [29.8, 32.6], "suez_n": [31.3, 32.3], "gibraltar": [35.9, -5.8],
        "rotterdam_exit": [52.0, 3.8], "hamburg_exit": [54.0, 8.2], "panama_e": [9.5, -79.8], "panama_w": [8.8, -79.6],
        "lax_gate": [32.5, -120.0], "nyc_gate": [40.2, -73.5], "good_hope": [-36.0, 20.0], "brazil_e": [-6.0, -34.0],
        "pacific_mid_w": [30.0, 175.0], "pacific_mid_e": [30.0, -175.0]
    };

    const seaEdges = [
        ["pusan_gate", "namhae_s"], ["namhae_s", "jeju_s"], ["jeju_s", "shanghai_gate"], ["shanghai_gate", "singapore_gate"],
        ["singapore_gate", "malacca_mid"], ["malacca_mid", "srilanka_s"], ["srilanka_s", "bab_el_mandeb"],
        ["bab_el_mandeb", "suez_s"], ["suez_s", "suez_n"], ["suez_n", "gibraltar"], ["gibraltar", "rotterdam_exit"],
        ["rotterdam_exit", "hamburg_exit"], ["shanghai_gate", "pacific_mid_w"], ["pacific_mid_w", "pacific_mid_e"],
        ["pacific_mid_e", "lax_gate"], ["lax_gate", "panama_w"], ["panama_w", "panama_e"], ["panama_e", "nyc_gate"],
        ["srilanka_s", "good_hope"], ["good_hope", "brazil_e"], ["brazil_e", "nyc_gate"]
    ];

    // 2. CORE ENGINE
    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Esri', maxZoom: 18 }).addTo(map);

    const originSelect = document.getElementById('origin'), 
          destinationSelect = document.getElementById('destination'), 
          modeSelect = document.getElementById('transport-mode'), 
          hscodeSelect = document.getElementById('hscode'), 
          summaryContainer = document.getElementById('summary-container'),
          feedContainer = document.getElementById('feed-container');
    const originSearch = document.getElementById('origin-search'), destSearch = document.getElementById('dest-search');

    function populate(filterO = '', filterD = '') {
        const mode = modeSelect.value;
        const curO = originSelect.value, curD = destinationSelect.value;
        const updateSelect = (select, filter) => {
            const currentVal = select.value;
            select.innerHTML = '';
            Object.entries(hubs)
                .filter(([id, h]) => h.type === mode && (h.name.toLowerCase().includes(filter.toLowerCase()) || h.country.toLowerCase().includes(filter.toLowerCase())))
                .sort((a,b)=>a[1].name.localeCompare(b[1].name))
                .forEach(([id,h]) => { select.add(new Option(`${h.name} (${h.country})`, id)); });
            if(currentVal && hubs[currentVal] && hubs[currentVal].type === mode) select.value = currentVal;
        };
        updateSelect(originSelect, filterO);
        updateSelect(destinationSelect, filterD);
    }

    function getDist(c1, c2) {
        const R = 6371, dLat = (c2[0]-c1[0])*Math.PI/180, dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R*2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    async function calculateAndDisplay() {
        const oId = originSelect.value, dId = destinationSelect.value;
        if(!oId || !dId || oId === dId) return;
        
        const o = hubs[oId], d = hubs[dId];
        const dist = getDist(o.coords, d.coords);
        const transitDays = Math.round(modeSelect.value === 'sea' ? (dist / 700) + 5 : (dist / 8000) + 1.5);
        const eta = new Date(); eta.setDate(eta.getDate() + transitDays);
        const currency = localStorage.getItem('selectedCurrency') || 'USD';
        const symbols = { USD: "$", KRW: "₩", EUR: "€" };

        summaryContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" id="analysis-results">
                <div class="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 shadow-sm text-center">
                    <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Total Lead Time</p>
                    <p class="text-3xl font-black text-indigo-900">${transitDays} Days</p>
                    <p class="text-[9px] font-bold text-indigo-400 mt-1">Estimated ETA: ${eta.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div class="p-6 bg-green-50 rounded-[2rem] border border-green-100 shadow-sm text-center">
                    <p class="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Estimated Cost</p>
                    <p class="text-3xl font-black text-green-900 leading-none"><span class="text-sm mr-1">${symbols[currency]}</span>${(modeSelect.value === 'sea' ? '1,250' : '4,850')}</p>
                    <p class="text-[9px] font-bold text-green-400 mt-1 uppercase">Market Benchmark Rate</p>
                </div>
                <div class="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 shadow-sm text-center">
                    <p class="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Comparison</p>
                    <p class="text-[11px] font-black text-slate-700 leading-tight">vs ${modeSelect.value === 'sea' ? 'Air' : 'Sea'}: <span class="text-blue-600">${modeSelect.value === 'sea' ? '-18 Days' : 'Save $3,600'}</span></p>
                </div>
            </div>`;
        
        map.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker) map.removeLayer(l); });
        const path = [o.coords, d.coords];
        L.polyline(path, { color: modeSelect.value === 'sea' ? '#4f46e5' : '#f59e0b', weight: 4 }).addTo(map);
        L.marker(path[0]).addTo(map); L.marker(path[1]).addTo(map);
        map.fitBounds(L.polyline(path).getBounds(), { padding: [30, 30] });
    }

    if(modeSelect) modeSelect.onchange = () => populate();
    if(originSearch) originSearch.oninput = (e) => populate(e.target.value, destSearch.value);
    if(destSearch) destSearch.oninput = (e) => populate(originSearch.value, e.target.value);
    if(document.getElementById('shipping-form')) document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    
    ['usd', 'krw', 'eur'].forEach(curr => { 
        const btn = document.getElementById(`curr-${curr}`);
        if(btn) btn.onclick = () => { localStorage.setItem('selectedCurrency', curr.toUpperCase()); location.reload(); }; 
    });

    populate();
});