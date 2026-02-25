document.addEventListener('DOMContentLoaded', () => {
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

    // Categorized Locations - Expanded
    const portCities = {
        "Port of New York": { coords: [40.7128, -74.0060], hub: "usa-nyc", country: "USA", scmIssues: "Port labor negotiations." },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", scmIssues: "Warehouse capacity limits." },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China", scmIssues: "Strict export inspections." },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands", scmIssues: "Customs clearance backlogs." },
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea", scmIssues: "Labor union strikes." },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore", scmIssues: "Vessel bunching at hub." },
        "Port of Hamburg": { coords: [53.5511, 9.9937], hub: "deu-ham", country: "Germany", scmIssues: "Rail capacity constraints." },
        "Port of Jebel Ali": { coords: [25.0112, 55.0617], hub: "are-dxb-sea", country: "UAE", scmIssues: "Geopolitical tensions." },
        "Port of Mumbai": { coords: [18.9647, 72.8347], hub: "ind-bom", country: "India", scmIssues: "Infrastructure bottlenecks." },
        "Port of Santos": { coords: [-23.9608, -46.3331], hub: "bra-ssz", country: "Brazil", scmIssues: "Heavy bureaucracy." },
        "Port of Vancouver": { coords: [49.2827, -123.1207], hub: "can-van", country: "Canada", scmIssues: "Wildfire risk to rail." },
        "Port of Barcelona": { coords: [41.3851, 2.1734], hub: "esp-bcn", country: "Spain", scmIssues: "Regional port strike risk." }
    };

    const airportCities = {
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA", scmIssues: "Terminal modernization." },
        "LAX (Los Angeles)": { coords: [33.9416, -118.4085], hub: "usa-lax-air", country: "USA", scmIssues: "High storage fees." },
        "PVG (Shanghai)": { coords: [31.1444, 121.8053], hub: "chn-pvg", country: "China", scmIssues: "Flight cancellations." },
        "AMS (Amsterdam)": { coords: [52.3105, 4.7683], hub: "nld-ams", country: "Netherlands", scmIssues: "Environmental flight caps." },
        "ICN (Seoul)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", scmIssues: "Peak season peak." },
        "SIN (Singapore)": { coords: [1.3644, 103.9915], hub: "sgp-sin-air", country: "Singapore", scmIssues: "Cold-chain space tight." },
        "LHR (London)": { coords: [51.4700, -0.4543], hub: "gbr-lhr", country: "UK", scmIssues: "Post-Brexit documentation." },
        "DXB (Dubai)": { coords: [25.2532, 55.3657], hub: "are-dxb-air", country: "UAE", scmIssues: "Transshipment backlog." },
        "BOM (Mumbai)": { coords: [19.0896, 72.8656], hub: "ind-bom-air", country: "India", scmIssues: "Ground handling delays." },
        "GRU (Sao Paulo)": { coords: [-23.4356, -46.4731], hub: "bra-sao-air", country: "Brazil", scmIssues: "Customs processing." },
        "IST (Istanbul)": { coords: [41.2753, 28.7519], hub: "tur-ist", country: "Turkey", scmIssues: "High cargo volume." },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", country: "Germany", scmIssues: "Cargo staff shortages." }
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
        "sgp-sin": { name: "Singapore Port", coords: [1.2644, 103.8398] },
        "sgp-sin-air": { name: "Changi Airport", coords: [1.3644, 103.9915] },
        "deu-ham": { name: "Hamburg Port", coords: [53.5468, 9.9703] },
        "gbr-lhr": { name: "London Heathrow", coords: [51.4700, -0.4543] },
        "are-dxb-sea": { name: "Jebel Ali Port", coords: [25.0112, 55.0617] },
        "are-dxb-air": { name: "Dubai Intl", coords: [25.2532, 55.3657] },
        "ind-bom": { name: "Mumbai Port", coords: [18.9647, 72.8347] },
        "ind-bom-air": { name: "Mumbai Airport", coords: [19.0896, 72.8656] },
        "bra-ssz": { name: "Santos Port", coords: [-23.9883, -46.3089] },
        "bra-sao-air": { name: "Guarulhos Airport", coords: [-23.4356, -46.4731] },
        "can-van": { name: "Port of Vancouver", coords: [49.2827, -123.1207] },
        "esp-bcn": { name: "Port of Barcelona", coords: [41.3462, 2.1672] },
        "tur-ist": { name: "Istanbul Airport", coords: [41.2753, 28.7519] },
        "deu-fra": { name: "Frankfurt Airport", coords: [50.0379, 8.5622] }
    };

    const waypoints = {
        "suez": [30.5852, 32.2654], "panama": [9.352, -79.920], "malacca": [1.2, 103.8], "gibraltar": [35.9, -5.5],
        "cape": [-34.35, 18.47], "bab_el_mandeb": [12.6, 43.3], "south_tip_india": [5.9, 80.5], "pacific_mid": [20.0, -160.0],
        "good_hope": [-34.35, 18.47], "cape_verde": [15.0, -25.0], "english_channel": [50.5, -0.5]
    };

    function getCustomsIntelligence(originCountry, destCountry) {
        const commonDocs = ["Bill of Lading", "Invoice", "Packing List"];
        if (originCountry === destCountry) return { level: "Low", delay: 1, color: "text-green-600 bg-green-50", docs: commonDocs };
        if (destCountry === "China") return { level: "High", delay: 5, color: "text-red-600 bg-red-50", docs: [...commonDocs, "CCC", "License"] };
        if (destCountry === "USA") return { level: "Medium", delay: 3, color: "text-yellow-600 bg-yellow-50", docs: [...commonDocs, "ISF", "Bond"] };
        return { level: "Medium", delay: 2, color: "text-blue-600 bg-blue-50", docs: [...commonDocs, "COO"] };
    }

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
        const cargoType = document.getElementById('cargo-type').value;
        const originName = originSelect.value;
        const destName = destinationSelect.value;
        const resultDiv = document.getElementById('result');

        if (originName === destName) { resultDiv.innerHTML = `<p class="text-red-500">Error: Same origin/destination.</p>`; return; }

        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originName];
        const dest = cityData[destName];
        const originHub = hubs[origin.hub];
        const destHub = hubs[dest.hub];

        let activeRisks = [];
        let middleMilePath = (mode === 'sea') ? getSeaRoute(originHub.coords, destHub.coords, activeRisks) : getAirRoute(originHub.coords, destHub.coords, activeRisks);
        
        let middleMileDist = 0;
        for (let i = 0; i < middleMilePath.length - 1; i++) middleMileDist += calculateDistance(middleMilePath[i], middleMilePath[i+1]);

        const firstMileDist = calculateDistance(origin.coords, originHub.coords);
        const lastMileDist = calculateDistance(destHub.coords, dest.coords);
        
        const speeds = { sea: 711, air: 20000, land: 500 };
        let transitDays = middleMileDist / speeds[mode];
        let inlandDays = (firstMileDist + lastMileDist) / speeds.land;
        let handlingDays = (mode === 'sea' ? 5 : 2);
        
        if (subMode.includes("LCL")) handlingDays += 4;
        if (subMode.includes("Express")) handlingDays -= 1;

        activeRisks.forEach(risk => {
            if (risk.description.includes("Red Sea")) transitDays += 12;
            if (risk.description.includes("Panama")) handlingDays += 5;
            if (risk.description.includes("Russia")) transitDays += 1;
        });

        const customsInfo = getCustomsIntelligence(origin.country, dest.country);
        const totalDays = transitDays + inlandDays + handlingDays + customsInfo.delay;
        const totalDist = Math.round(middleMileDist + firstMileDist + lastMileDist);
        const totalCO2 = Math.round((totalDist * (mode === 'sea' ? 25 : 500)) / 1000);

        // --- Mock Cost Estimation ---
        const ratePerKm = { sea: 0.15, air: 4.50 };
        let costBase = totalDist * ratePerKm[mode];
        if (subMode.includes("Express")) costBase *= 1.5;
        if (cargoType.includes("Refrigerated")) costBase *= 1.3;
        if (cargoType.includes("Dangerous")) costBase *= 1.8;
        const estimatedCost = Math.round(costBase);

        const pInland = (inlandDays / totalDays) * 100;
        const pTransit = (transitDays / totalDays) * 100;
        const pHandling = (handlingDays / totalDays) * 100;
        const pCustoms = (customsInfo.delay / totalDays) * 100;

        let riskAlertHtml = '';
        if (activeRisks.length > 0) {
            riskAlertHtml = `<div class="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-sm text-red-700">
                <h4 class="font-bold flex items-center mb-1"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>Risk Factors</h4>
                ${activeRisks.map(r => `• ${r.description}`).join('<br>')}</div>`;
        }

        resultDiv.innerHTML = `
            <div class="space-y-6 animate-fade-in">
                ${riskAlertHtml}
                <div class="p-5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <p class="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Est. Lead Time</p>
                            <p class="text-5xl font-black text-indigo-900">${Math.round(totalDays)} <span class="text-xl font-normal text-indigo-400">Days</span></p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs font-bold text-indigo-400 uppercase">${totalDist.toLocaleString()} km</p>
                            <p class="text-sm font-bold text-gray-700 mt-1">Est. $${estimatedCost.toLocaleString()} USD/tonne</p>
                        </div>
                    </div>
                    
                    <div class="h-3 w-full bg-gray-200 rounded-full flex overflow-hidden">
                        <div style="width: ${pInland}%" class="bg-green-400 shadow-inner" title="Inland: ${Math.round(inlandDays)}d"></div>
                        <div style="width: ${pTransit}%" class="bg-indigo-500 shadow-inner" title="Transit: ${Math.round(transitDays)}d"></div>
                        <div style="width: ${pHandling}%" class="bg-blue-400 shadow-inner" title="Handling: ${Math.round(handlingDays)}d"></div>
                        <div style="width: ${pCustoms}%" class="bg-red-400 shadow-inner" title="Customs: ${Math.round(customsInfo.delay)}d"></div>
                    </div>
                    <div class="flex justify-between text-[8px] mt-2 font-bold text-indigo-300 uppercase">
                        <span>Inland</span><span>Ocean/Air</span><span>Handling</span><span>Customs</span>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="p-3 bg-white rounded border border-gray-100 shadow-sm">
                        <div class="font-bold text-gray-700 text-xs mb-1 border-b pb-1">Node Risk Feed</div>
                        <p class="text-[11px] text-gray-500 italic mt-1">Origin: ${origin.scmIssues}</p>
                        <p class="text-[11px] text-gray-500 italic">Dest: ${dest.scmIssues}</p>
                    </div>
                    <div class="p-3 bg-white rounded border border-gray-100 shadow-sm">
                        <div class="flex justify-between items-center mb-1">
                            <h4 class="font-bold text-gray-700 text-xs">Customs Status</h4>
                            <span class="px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase ${customsInfo.color}">${customsInfo.level} Risk</span>
                        </div>
                        <div class="flex flex-wrap gap-1">${customsInfo.docs.map(doc => `<span class="bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded text-[9px] border border-gray-100">${doc}</span>`).join('')}</div>
                    </div>
                </div>

                <button id="share-btn" class="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg shadow-sm font-bold hover:bg-gray-50 transition-all flex items-center justify-center text-sm">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                    Copy Intelligence Report
                </button>
            </div>`;

        document.getElementById('share-btn').onclick = () => {
            const url = new URL(window.location);
            url.searchParams.set('mode', mode); url.searchParams.set('origin', originName); url.searchParams.set('dest', destName);
            navigator.clipboard.writeText(url.href).then(() => alert('Report link copied to clipboard!'));
        };

        map.eachLayer(layer => { if (layer instanceof L.Marker || layer instanceof L.Polyline) map.removeLayer(layer); });
        L.marker(origin.coords).addTo(map).bindPopup(`<b>Origin:</b> ${originName}`);
        L.marker(dest.coords).addTo(map).bindPopup(`<b>Destination:</b> ${destName}`);
        const hubIcon = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41] });
        L.marker(originHub.coords, { icon: hubIcon }).addTo(map).bindPopup(`<b>Hub:</b> ${originHub.name}`);
        L.marker(destHub.coords, { icon: hubIcon }).addTo(map).bindPopup(`<b>Hub:</b> ${destHub.name}`);
        
        L.polyline([origin.coords, originHub.coords], { color: '#ef4444', weight: 2, dashArray: '5, 5' }).addTo(map).bindTooltip("First Mile (Inland)");
        middleMilePath.forEach((p, i) => { 
            if(i > 0 && Math.abs(middleMilePath[i-1][1]-p[1]) < 180) {
                const line = L.polyline([middleMilePath[i-1], p], {color: '#dc2626', weight: 5, opacity: 0.9}).addTo(map);
                line.bindTooltip(`${mode.toUpperCase()} Transit Segment: ${Math.round(calculateDistance(middleMilePath[i-1], p)).toLocaleString()} km`);
            }
        });
        L.polyline([destHub.coords, dest.coords], { color: '#ef4444', weight: 2, dashArray: '5, 5' }).addTo(map).bindTooltip("Last Mile (Inland)");
        map.fitBounds([origin.coords, dest.coords], { padding: [50, 50] });
    }

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };

    function getSeaRoute(o, d, r) {
        let p = [o];
        if (Math.abs(o[1]-d[1]) > 180) p.push(waypoints.pacific_mid);
        else if ((o[1]>60 && d[1]<20) || (o[1]<20 && d[1]>60)) {
            if (globalRisks.redSeaCrisis.active) { p.push(waypoints.good_hope, waypoints.cape_verde); r.push(globalRisks.redSeaCrisis); }
            else p.push(waypoints.malacca, waypoints.bab_el_mandeb, waypoints.suez, waypoints.gibraltar);
        }
        p.push(d); return p;
    }

    function getAirRoute(o, d, r) {
        const p = []; const steps = 20; let sL = o[1], eL = d[1];
        if (Math.abs(sL-eL) > 180) { if (sL>0) eL+=360; else eL-=360; }
        for (let i=0; i<=steps; i++) {
            const f = i/steps; let lat = o[0]+(d[0]-o[0])*f; const lon = sL+(eL-sL)*f;
            const dist = calculateDistance(o, d); let off = Math.sin(Math.PI*f)*(dist/12000)*15;
            if (globalRisks.russiaAirspace.active && lat > 45) { off -= 20; r.push(globalRisks.russiaAirspace); }
            p.push([lat+off, lon]);
        }
        return p;
    }

    function calculateDistance(c1, c2) {
        const R = 6371; const dLat = (c2[0]-c1[0])*Math.PI/180; let dLon = (c2[1]-c1[1])*Math.PI/180;
        const a = Math.sin(dLat/2)**2 + Math.cos(c1[0]*Math.PI/180)*Math.cos(c2[0]*Math.PI/180)*Math.sin(dLon/2)**2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
});
