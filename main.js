/**
 * LEADTIME INTELLIGENCE - CORE SYSTEM FILE
 * Strictly English - en-US Locale Fixed
 */

document.addEventListener('DOMContentLoaded', () => {
    const hubs = {
        "sea-sha": { name: "Shanghai", coords: [31.23, 121.47], type: "sea", exit: "shanghai_gate", country: "China" },
        "sea-sin": { name: "Singapore", coords: [1.26, 103.83], type: "sea", exit: "singapore_gate", country: "Singapore" },
        "sea-pus": { name: "Busan", coords: [35.10, 129.04], type: "sea", exit: "pusan_gate", country: "South Korea" },
        "sea-rot": { name: "Rotterdam", coords: [51.92, 4.47], type: "sea", exit: "rotterdam_exit", country: "Netherlands" },
        "sea-lax": { name: "Los Angeles", coords: [33.75, -118.27], type: "sea", exit: "lax_gate", country: "USA" },
        "sea-dxb": { name: "Jebel Ali (Dubai)", coords: [25.01, 55.06], type: "sea", exit: "jebel_ali_gate", country: "UAE" },
        "air-icn": { name: "Incheon (ICN)", coords: [37.46, 126.44], type: "air", country: "South Korea" },
        "air-fra": { name: "Frankfurt (FRA)", coords: [50.03, 8.57], type: "air", country: "Germany" },
        "air-jfk": { name: "New York (JFK)", coords: [40.64, -73.77], type: "air", country: "USA" }
    };

    const seaNodes = { "pusan_gate": [35.0, 129.1], "shanghai_gate": [31.2, 122.5], "singapore_gate": [1.2, 103.8], "rotterdam_exit": [52.0, 3.8], "lax_gate": [32.5, -120.0], "jebel_ali_gate": [25.5, 55.5], "panama_e": [9.5, -79.8], "suez_n": [31.3, 32.3] };
    const seaEdges = [["pusan_gate", "shanghai_gate"], ["shanghai_gate", "singapore_gate"], ["singapore_gate", "jebel_ali_gate"], ["singapore_gate", "suez_n"], ["suez_n", "rotterdam_exit"], ["shanghai_gate", "lax_gate"], ["lax_gate", "panama_e"]];

    const map = L.map('map', { worldCopyJump: true }).setView([20, 0], 2);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', { attribution: 'Esri', maxZoom: 18 }).addTo(map);

    const originSelect = document.getElementById('origin'), 
          destinationSelect = document.getElementById('destination'), 
          modeSelect = document.getElementById('transport-mode'), 
          hscodeSelect = document.getElementById('hscode'), 
          summaryContainer = document.getElementById('summary-container'),
          feedContainer = document.getElementById('feed-container');
    const newsTicker = document.getElementById('news-ticker');

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
                .forEach(([id,h]) => { select.add(new Option(`${h.name} (${h.country})`, id)); });
            if(currentVal && hubs[currentVal] && hubs[currentVal].type === mode) select.value = currentVal;
        };
        updateSelect(originSelect, filterO);
        updateSelect(destinationSelect, filterD);
    }

    async function calculateAndDisplay() {
        const oId = originSelect.value, dId = destinationSelect.value;
        if(!oId || !dId || oId === dId || !summaryContainer) return;
        
        const transitDays = modeSelect.value === 'sea' ? 22 : 3;
        const eta = new Date(); eta.setDate(eta.getDate() + transitDays);
        const symbols = { USD: "$", KRW: "₩", EUR: "€" };
        const currency = localStorage.getItem('selectedCurrency') || 'USD';

        summaryContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" id="analysis-results">
                <div class="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <p class="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Total Lead Time</p>
                    <p class="text-3xl font-black text-indigo-900">${transitDays} Days</p>
                    <p class="text-[9px] font-bold text-indigo-400 mt-1">Estimated ETA: ${eta.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div class="p-6 bg-green-50 rounded-[2rem] border border-green-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <p class="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Estimated Cost</p>
                    <p class="text-3xl font-black text-green-900 leading-none"><span class="text-sm mr-1">${symbols[currency]}</span>${(modeSelect.value === 'sea' ? '1,250' : '4,800')}</p>
                    <p class="text-[9px] font-bold text-green-400 mt-1 uppercase">Market Benchmark Rate</p>
                </div>
                <div class="p-6 bg-orange-50 rounded-[2rem] border border-orange-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <p class="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">Comparison</p>
                    <p class="text-[11px] font-black text-slate-700 leading-tight">vs ${modeSelect.value === 'sea' ? 'Air' : 'Sea'}: <span class="text-blue-600">${modeSelect.value === 'sea' ? '-19 Days' : 'Save $3,550'}</span></p>
                </div>
            </div>`;
        
        // Simple map update
        map.eachLayer(l => { if (l instanceof L.Polyline || l instanceof L.Marker) map.removeLayer(l); });
        const path = [hubs[oId].coords, hubs[dId].coords];
        L.polyline(path, { color: modeSelect.value === 'sea' ? '#4f46e5' : '#f59e0b', weight: 4 }).addTo(map);
        L.marker(path[0]).addTo(map); L.marker(path[1]).addTo(map);
        map.fitBounds(L.polyline(path).getBounds(), { padding: [30, 30] });
    }

    if(document.getElementById('shipping-form')) document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };
    populate();
});