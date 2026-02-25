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

    // Hub Intelligence (Mocked Real-time Metrics)
    const hubStats = {
        "Port of NY/NJ": { congestion: "Moderate", turnaround: "2.4 days", efficiency: "88%" },
        "Port of LA": { congestion: "High", turnaround: "4.1 days", efficiency: "72%" },
        "Shanghai Port": { congestion: "High", turnaround: "1.8 days", efficiency: "95%" },
        "Busan Port": { congestion: "Low", turnaround: "1.2 days", efficiency: "98%" },
        "Rotterdam Port": { congestion: "Moderate", turnaround: "2.1 days", efficiency: "91%" },
        "Incheon Intl Airport": { congestion: "Low", turnaround: "4 hours", efficiency: "99%" },
        "John F. Kennedy Intl": { congestion: "Moderate", turnaround: "8 hours", efficiency: "85%" }
    };

    // Categorized Locations
    const portCities = {
        "Port of New York": { coords: [40.7128, -74.0060], hub: "usa-nyc", country: "USA", scmIssues: "Port labor negotiations." },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", country: "USA", scmIssues: "Warehouse capacity limits." },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", country: "China", scmIssues: "Strict export inspections." },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", country: "Netherlands", scmIssues: "Customs clearance backlogs." },
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", country: "South Korea", scmIssues: "Modernization projects." },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", country: "Singapore", scmIssues: "Vessel bunching at hub." },
        "Port of Jebel Ali": { coords: [25.0112, 55.0617], hub: "are-dxb-sea", country: "UAE", scmIssues: "Geopolitical tensions." }
    };

    const airportCities = {
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", country: "USA", scmIssues: "Terminal upgrades." },
        "LAX (Los Angeles)": { coords: [33.9416, -118.4085], hub: "usa-lax-air", country: "USA", scmIssues: "High storage fees." },
        "PVG (Shanghai)": { coords: [31.1444, 121.8053], hub: "chn-pvg", country: "China", scmIssues: "Peak season volume." },
        "AMS (Amsterdam)": { coords: [52.3105, 4.7683], hub: "nld-ams", country: "Netherlands", scmIssues: "Flight cap restrictions." },
        "ICN (Seoul)": { coords: [37.4602, 126.4407], hub: "kor-icn", country: "South Korea", scmIssues: "E-commerce surges." }
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
        "are-dxb-sea": { name: "Jebel Ali Port", coords: [25.0112, 55.0617] }
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

    function getCalculation(mode, subMode, originCity, destCity) {
        const originHub = hubs[originCity.hub];
        const destHub = hubs[destCity.hub];
        let risks = [];
        let path = (mode === 'sea') ? getSeaRoute(originHub.coords, destHub.coords, risks) : getAirRoute(originHub.coords, destHub.coords, risks);
        let dist = 0;
        for (let i = 0; i < path.length - 1; i++) dist += calculateDistance(path[i], path[i+1]);
        const fDist = calculateDistance(originCity.coords, originHub.coords);
        const lDist = calculateDistance(destHub.coords, destCity.coords);
        const totalDist = dist + fDist + lDist;
        
        const speeds = { sea: 711, air: 20000, land: 500 };
        let transitD = dist / speeds[mode];
        let inlandD = (fDist + lDist) / speeds.land;
        let handlingD = (mode === 'sea' ? 5 : 2);
        if (subMode.includes("LCL")) handlingD += 4;
        risks.forEach(r => { if (r.description.includes("Red Sea")) transitD += 12; if (r.description.includes("Panama")) handlingD += 5; });
        
        const cInfo = getCustomsIntelligence(originCity.country, destCity.country);
        const totalD = transitD + inlandD + handlingD + cInfo.delay;
        const cost = Math.round(totalDist * (mode === 'sea' ? 0.15 : 4.5) * (subMode.includes("Express") ? 1.5 : 1));
        const co2 = Math.round((totalDist * (mode === 'sea' ? 25 : 500)) / 1000);

        return { totalD, totalDist, cost, co2, risks, path, cInfo, inlandD, transitD, handlingD };
    }

    function calculateAndDisplay() {
        const mode = modeSelect.value;
        const subMode = subModeSelect.value;
        const originName = originSelect.value;
        const destName = destinationSelect.value;
        const cityData = mode === 'sea' ? portCities : airportCities;
        
        if (originName === destName) return;

        const result = getCalculation(mode, subMode, cityData[originName], cityData[destName]);
        
        // Render Result UI
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <div class="space-y-6 animate-fade-in">
                <div class="p-5 bg-indigo-50 rounded-xl border border-indigo-100 shadow-sm relative overflow-hidden">
                    <div class="flex justify-between items-start relative z-10">
                        <div>
                            <p class="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Est. Lead Time</p>
                            <p class="text-5xl font-black text-indigo-900">${Math.round(result.totalD)} <span class="text-xl font-normal text-indigo-400">Days</span></p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs font-bold text-indigo-400 uppercase">${Math.round(result.totalDist).toLocaleString()} km</p>
                            <p class="text-sm font-bold text-gray-700 mt-1">$${result.cost.toLocaleString()} USD/t</p>
                        </div>
                    </div>
                    <div class="h-2 w-full bg-gray-200 rounded-full flex mt-4 overflow-hidden">
                        <div style="width: ${(result.inlandD/result.totalD)*100}%" class="bg-green-400"></div>
                        <div style="width: ${(result.transitD/result.totalD)*100}%" class="bg-indigo-500"></div>
                        <div style="width: ${(result.handlingD/result.totalD)*100}%" class="bg-blue-400"></div>
                        <div style="width: ${(result.cInfo.delay/result.totalD)*100}%" class="bg-red-400"></div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 text-center">
                    <div class="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase">CO2 Impact</p>
                        <p class="text-lg font-bold text-green-600">${result.co2.toLocaleString()} <span class="text-xs">kg</span></p>
                    </div>
                    <div class="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <p class="text-[10px] font-bold text-gray-400 uppercase">Customs Risk</p>
                        <p class="text-lg font-bold ${result.cInfo.color.split(' ')[0]}">${result.cInfo.level}</p>
                    </div>
                </div>

                <div class="text-[10px] text-gray-400 leading-tight border-t pt-3">
                    • 16kts avg. speed (Sea) / 850kmh (Air) applied.<br>
                    • Disclaimer: Weather and terminal congestion may affect results.
                </div>
            </div>`;

        updateMap(result, mode, cityData[originName], cityData[destName], originName, destName);
    }

    function updateMap(res, mode, oCity, dCity, oName, dName) {
        map.eachLayer(layer => { if (layer instanceof L.Marker || layer instanceof L.Polyline) map.removeLayer(layer); });
        const hubIcon = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41] });
        
        [oCity, dCity].forEach((c, i) => {
            const marker = L.marker(c.coords).addTo(map).bindPopup(`<b>${i===0?oName:dName}</b><br>${c.scmIssues}`);
            const hub = hubs[c.hub];
            const hubMarker = L.marker(hub.coords, { icon: hubIcon }).addTo(map);
            const stats = hubStats[hub.name] || { congestion: "Normal", turnaround: "Unknown", efficiency: "N/A" };
            hubMarker.bindPopup(`
                <div class="p-1">
                    <p class="font-bold border-b mb-1">${hub.name}</p>
                    <p class="text-xs">Congestion: <span class="font-bold ${stats.congestion==='High'?'text-red-500':'text-green-500'}">${stats.congestion}</span></p>
                    <p class="text-xs">Processing: ${stats.turnaround}</p>
                    <p class="text-xs">Efficiency: ${stats.efficiency}</p>
                </div>
            `);
        });

        const oHub = hubs[oCity.hub]; const dHub = hubs[dCity.hub];
        L.polyline([oCity.coords, oHub.coords], { color: '#ef4444', weight: 2, dashArray: '5, 5' }).addTo(map);
        res.path.forEach((p, i) => { 
            if(i > 0 && Math.abs(res.path[i-1][1]-p[1]) < 180) L.polyline([res.path[i-1], p], {color: '#dc2626', weight: 5}).addTo(map); 
        });
        L.polyline([dHub.coords, dCity.coords], { color: '#ef4444', weight: 2, dashArray: '5, 5' }).addTo(map);
        map.fitBounds([oCity.coords, dCity.coords], { padding: [50, 50] });
    }

    document.getElementById('shipping-form').onsubmit = (e) => { e.preventDefault(); calculateAndDisplay(); };

    function getSeaRoute(o, d, r) {
        let p = [o];
        if (Math.abs(o[1]-d[1]) > 180) p.push(waypoints.pacific_mid);
        else if ((o[1]>60 && d[1]<20) || (o[1]<20 && d[1]>60)) {
            if (globalRisks.redSeaCrisis.active) { p.push(waypoints.good_hope, waypoints.cape_verde); r.push(globalRisks.redSeaCrisis); }
            else p.push(waypoints.malacca, waypoints.suez);
        }
        p.push(d); return p;
    }

    function getAirRoute(o, d, r) {
        const p = []; const steps = 20; let sL = o[1], eL = d[1];
        if (Math.abs(sL-eL) > 180) { if (sL>0) eL+=360; else eL-=360; }
        for (let i=0; i<=steps; i++) {
            const f = i/steps; const lat = o[0]+(d[0]-o[0])*f; const lon = sL+(eL-sL)*f;
            const dist = calculateDistance(o, d); let off = Math.sin(Math.PI*f)*(dist/12000)*15;
            if (globalRisks.russiaAirspace.active && lat > 45) { off -= 20; r.push(globalRisks.russiaAirspace); }
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
        const docs = ["B/L", "Invoice", "Packing List"];
        if (oC === dC) return { level: "Low", delay: 1, color: "text-green-600 bg-green-50", docs };
        if (dC === "China") return { level: "High", delay: 5, color: "text-red-600 bg-red-50", docs: [...docs, "CCC"] };
        return { level: "Medium", delay: 3, color: "text-blue-600 bg-blue-50", docs: [...docs, "COO"] };
    }
});
