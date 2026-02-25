
document.addEventListener('DOMContentLoaded', () => {
    // Global Risk Scenarios (Simulating Real-time Intelligence for 2026)
    const globalRisks = {
        redSeaCrisis: {
            active: true,
            description: "Red Sea/Suez Canal Avoidance due to geopolitical instability.",
            impact: "Route deviated via Cape of Good Hope (+10-14 days)."
        },
        panamaDrought: {
            active: true,
            description: "Severe drought conditions at Panama Canal.",
            impact: "Transit capacity reduced; extended waiting times applied (+5 days)."
        },
        russiaAirspace: {
            active: true,
            description: "Russian Airspace Closure for Western carriers.",
            impact: "Flight paths rerouted via Southern Corridor or Polar/Alaska routes."
        }
    };

    const locations = {
        "New York": { coords: [40.7128, -74.0060], country: "USA", hubs: { sea: "usa-nyc", air: "usa-jfk" }, scmIssues: "Port labor negotiations on East Coast; Driver shortages in regional trucking." },
        "Los Angeles": { coords: [34.0522, -118.2437], country: "USA", hubs: { sea: "usa-lax", air: "usa-lax-air" }, scmIssues: "Ongoing congestion at San Pedro Bay; Warehouse capacity limits." },
        "London": { coords: [51.5074, -0.1278], country: "UK", hubs: { sea: "gbr-lon", air: "gbr-lhr" }, scmIssues: "Post-Brexit customs complexities; Shortage of HGV drivers." },
        "Shanghai": { coords: [31.2304, 121.4737], country: "China", hubs: { sea: "chn-sha", air: "chn-pvg" }, scmIssues: "Strict export inspections; Occasional weather-related port closures." },
        "Hamburg": { coords: [53.5511, 9.9937], country: "Germany", hubs: { sea: "deu-ham", air: "deu-ham-air" }, scmIssues: "Rail capacity constraints; Inland waterway water level fluctuations." },
        "Tokyo": { coords: [35.6895, 139.6917], country: "Japan", hubs: { sea: "jpn-tyo", air: "jpn-nrt" }, scmIssues: "High demand for specialized electronics packaging; Strict import regulations." },
        "Busan": { coords: [35.1796, 129.0756], country: "South Korea", hubs: { sea: "kor-pus", air: "kor-pus-air" }, scmIssues: "Port equipment modernization projects; Occasional labor union strikes." },
        "Singapore": { coords: [1.3521, 103.8198], country: "Singapore", hubs: { sea: "sgp-sin", air: "sgp-sin-air" }, scmIssues: "Vessel bunching at transshipment hub; Tight labor market for logistics services." },
        "Rotterdam": { coords: [51.9225, 4.4792], country: "Netherlands", hubs: { sea: "nld-rot", air: "nld-ams" }, scmIssues: "Customs clearance backlogs; Congestion on main hinterland corridors." },
        "Dubai": { coords: [25.2048, 55.2708], country: "UAE", hubs: { sea: "are-dxb-sea", air: "are-dxb-air" }, scmIssues: "Regional geopolitical tensions; High energy costs for temperature-controlled cargo." },
        "Mumbai": { coords: [19.0760, 72.8777], country: "India", hubs: { sea: "ind-bom", air: "ind-bom-air" }, scmIssues: "Infrastructure bottlenecks; Complex GST-related documentation." },
        "Sydney": { coords: [-33.8688, 151.2093], country: "Australia", hubs: { sea: "aus-syd", air: "aus-syd-air" }, scmIssues: "Biosecurity clearance delays; Coastal shipping capacity limits." },
        "Santos": { coords: [-23.9608, -46.3331], country: "Brazil", hubs: { sea: "bra-ssz", air: "bra-sao-air" }, scmIssues: "Heavy bureaucratic processes; Road infrastructure challenges in rain season." }
    };

    const hubs = {
        "usa-nyc": { name: "Port of New York", coords: [40.6892, -74.0445], type: "sea" },
        "usa-jfk": { name: "JFK Airport", coords: [40.6413, -73.7781], type: "air" },
        "usa-lax": { name: "Port of Los Angeles", coords: [33.7542, -118.2764], type: "sea" },
        "usa-lax-air": { name: "LAX Airport", coords: [33.9416, -118.4085], type: "air" },
        "gbr-lon": { name: "Port of London (Tilbury)", coords: [51.4594, 0.3544], type: "sea" },
        "gbr-lhr": { name: "London Heathrow Airport", coords: [51.4700, -0.4543], type: "air" },
        "chn-sha": { name: "Port of Shanghai", coords: [31.3833, 121.5833], type: "sea" },
        "chn-pvg": { name: "Pudong Airport", coords: [31.1444, 121.8053], type: "air" },
        "deu-ham": { name: "Port of Hamburg", coords: [53.5468, 9.9703], type: "sea" },
        "deu-ham-air": { name: "Hamburg Airport", coords: [53.6304, 9.9882], type: "air" },
        "jpn-tyo": { name: "Port of Tokyo", coords: [35.6333, 139.7833], type: "sea" },
        "jpn-nrt": { name: "Narita Airport", coords: [35.7647, 140.3864], type: "air" },
        "kor-pus": { name: "Port of Busan", coords: [35.1069, 129.0453], type: "sea" },
        "kor-pus-air": { name: "Gimhae Airport", coords: [35.1794, 128.9383], type: "air" },
        "sgp-sin": { name: "Port of Singapore", coords: [1.2644, 103.8398], type: "sea" },
        "sgp-sin-air": { name: "Changi Airport", coords: [1.3644, 103.9915], type: "air" },
        "nld-rot": { name: "Port of Rotterdam", coords: [51.9490, 4.1450], type: "sea" },
        "nld-ams": { name: "Schiphol Airport", coords: [52.3105, 4.7683], type: "air" },
        "are-dxb-sea": { name: "Jebel Ali Port", coords: [25.0112, 55.0617], type: "sea" },
        "are-dxb-air": { name: "Dubai International Airport", coords: [25.2532, 55.3657], type: "air" },
        "bra-ssz": { name: "Port of Santos", coords: [-23.9883, -46.3089], type: "sea" },
        "bra-sao-air": { name: "GRU Airport", coords: [-23.4356, -46.4731], type: "air" },
        "ind-bom": { name: "Port of Mumbai", coords: [18.9647, 72.8347], type: "sea" },
        "ind-bom-air": { name: "Mumbai Airport", coords: [19.0896, 72.8656], type: "air" },
        "aus-syd": { name: "Port of Sydney", coords: [-33.8568, 151.2421], type: "sea" },
        "aus-syd-air": { name: "Sydney Airport", coords: [-33.9461, 151.1772], type: "air" }
    };

    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');

    for (const city in locations) {
        const option1 = document.createElement('option');
        option1.value = city;
        option1.textContent = city;
        originSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = city;
        option2.textContent = city;
        destinationSelect.appendChild(option2);
    }

    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const waypoints = {
        "suez": [30.5852, 32.2654],
        "panama": [9.352, -79.920],
        "malacca": [2.2, 102.2],
        "gibraltar": [35.9, -5.5],
        "cape": [-34.35, 18.47],
        "bab_el_mandeb": [12.6, 43.3],
        "south_tip_india": [5.9, 80.5],
        "pacific_mid": [20.0, -160.0],
        // Air Waypoints to avoid Russia
        "turkey_air": [39.0, 35.0], 
        "alaska_air": [64.0, -150.0] 
    };

    function getSeaRoute(originHub, destHub, activeRisks) {
        let path = [originHub.coords];
        const oLon = originHub.coords[1];
        const dLon = destHub.coords[1];
        const oLat = originHub.coords[0];
        const dLat = destHub.coords[0];

        // Trans-Pacific Check (LAX to Asia/Oceania)
        if (oLon < -100 && dLon > 100) {
             path.push(waypoints.pacific_mid);
        } 
        else if (oLon > 100 && dLon < -100) {
             path.push(waypoints.pacific_mid);
        }
        // Asia to Europe
        else if ((oLon > 60 && dLon < 20) || (oLon < 20 && dLon > 60)) {
            // Check Red Sea Risk
            const useCape = globalRisks.redSeaCrisis.active;
            
            if (oLon > 60) { // East to West (Asia -> Europe)
                path.push(waypoints.malacca);
                if (useCape) {
                    path.push(waypoints.south_tip_india);
                    path.push(waypoints.cape); // Reroute via Cape
                    activeRisks.push(globalRisks.redSeaCrisis);
                } else {
                    path.push(waypoints.south_tip_india);
                    path.push(waypoints.bab_el_mandeb);
                    path.push(waypoints.suez);
                }
                path.push(waypoints.gibraltar);
            } else { // West to East (Europe -> Asia)
                path.push(waypoints.gibraltar);
                if (useCape) {
                    path.push(waypoints.cape); // Reroute via Cape
                    path.push(waypoints.south_tip_india);
                    activeRisks.push(globalRisks.redSeaCrisis);
                } else {
                    path.push(waypoints.suez);
                    path.push(waypoints.bab_el_mandeb);
                    path.push(waypoints.south_tip_india);
                }
                path.push(waypoints.malacca);
            }
        }
        // US East Coast to Asia via Panama
        else if (oLon > -80 && oLon < -60 && dLon > 100) {
            path.push(waypoints.panama);
            if (globalRisks.panamaDrought.active) activeRisks.push(globalRisks.panamaDrought);
            path.push(waypoints.pacific_mid);
        }
        // Asia to US East Coast via Panama
        else if (oLon > 100 && dLon > -80 && dLon < -60) {
            path.push(waypoints.pacific_mid);
            path.push(waypoints.panama);
            if (globalRisks.panamaDrought.active) activeRisks.push(globalRisks.panamaDrought);
        }
        // Europe to South America
        else if (oLon < 20 && oLon > -10 && dLat < -10 && dLon < -30) {
            path.push(waypoints.gibraltar);
        }

        path.push(destHub.coords);
        return path;
    }

    function getAirRoute(originCoords, destCoords, activeRisks) {
        const path = [];
        const steps = 30;
        
        let startLon = originCoords[1];
        let endLon = destCoords[1];
        let startLat = originCoords[0];
        let endLat = destCoords[0];

        // Check for Russia Airspace Avoidance (Europe <-> East Asia)
        let avoidRussia = false;
        if (globalRisks.russiaAirspace.active) {
            // Simple heuristic: if flying between Europe (Lon -10 to 30) and East Asia (Lon 100+), risk applies
            const isEurope = (startLon > -10 && startLon < 30) || (endLon > -10 && endLon < 30);
            const isEastAsia = (startLon > 100) || (endLon > 100);
            if (isEurope && isEastAsia) {
                avoidRussia = true;
                activeRisks.push(globalRisks.russiaAirspace);
            }
        }
        
        if (Math.abs(startLon - endLon) > 180) {
            if (startLon > 0) endLon += 360;
            else endLon -= 360;
        }

        for (let i = 0; i <= steps; i++) {
            const f = i / steps;
            let lat = startLat + (endLat - startLat) * f;
            const lon = startLon + (endLon - startLon) * f;
            
            // Standard Great Circle Arc
            const dist = calculateDistance(originCoords, destCoords);
            let offset = Math.sin(Math.PI * f) * (dist / 12000) * 15;

            // Apply Russia Avoidance Logic
            if (avoidRussia) {
                // If the path tries to go too high north (into Russia), push it south
                // Very rough approximation for visualization
                if (lat > 45) {
                    offset -= 20; // Push south significantly
                }
            }
            
            path.push([lat + offset, lon]);
        }
        return path;
    }

    document.getElementById('shipping-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const transportMode = document.getElementById('transport-mode').value;
        const cargoType = document.getElementById('cargo-type').value;
        const originCity = document.getElementById('origin').value;
        const destinationCity = document.getElementById('destination').value;
        const resultDiv = document.getElementById('result');

        if (originCity === destinationCity) {
            resultDiv.innerHTML = `<p class="text-red-500">Origin and destination cannot be the same.</p>`;
            return;
        }

        const origin = locations[originCity];
        const destination = locations[destinationCity];
        const originHub = hubs[origin.hubs[transportMode]];
        const destHub = hubs[destination.hubs[transportMode]];

        let middleMilePath = [];
        let middleMileDist = 0;
        let activeRisks = []; // Track risks triggered by this specific route

        if (transportMode === 'sea') {
            middleMilePath = getSeaRoute(originHub, destHub, activeRisks);
            for (let i = 0; i < middleMilePath.length - 1; i++) {
                middleMileDist += calculateDistance(middleMilePath[i], middleMilePath[i+1]);
            }
        } else {
            middleMilePath = getAirRoute(originHub.coords, destHub.coords, activeRisks);
            // Re-calculate distance roughly from path for air to include detour
            for (let i = 0; i < middleMilePath.length - 1; i++) {
                middleMileDist += calculateDistance(middleMilePath[i], middleMilePath[i+1]);
            }
        }

        const firstMileDist = calculateDistance(origin.coords, originHub.coords);
        const lastMileDist = calculateDistance(destHub.coords, destination.coords);

        const speeds = { sea: 700, air: 20000, land: 500 }; 
        let leadTime = (firstMileDist / speeds.land) + (middleMileDist / speeds[transportMode]) + (lastMileDist / speeds.land);

        const handlingTime = { sea: 5, air: 2 }; 
        leadTime += handlingTime[transportMode];

        // Apply Time Penalties from Risks
        activeRisks.forEach(risk => {
            if (risk === globalRisks.redSeaCrisis) leadTime += 12; // Extra days for Cape route
            if (risk === globalRisks.panamaDrought) leadTime += 5; // Waiting time
            if (risk === globalRisks.russiaAirspace) leadTime += 1; // Slight delay for air detour
        });

        switch (cargoType) {
            case 'Refrigerated': leadTime *= 1.1; break;
            case 'Dangerous Goods': leadTime *= 1.3; break;
        }

        // Generate Risk Alert HTML
        let riskAlertHtml = '';
        if (activeRisks.length > 0) {
            riskAlertHtml = `
                <div class="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                    <h4 class="font-bold text-red-700 flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Critical Route Adjustments Applied
                    </h4>
                    <ul class="mt-2 space-y-1 text-sm text-red-700">
                        ${activeRisks.map(risk => `<li>• <strong>${risk.description}</strong>: ${risk.impact}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        resultDiv.innerHTML = `
            <div class="space-y-4">
                ${riskAlertHtml}
                <p class="text-2xl font-bold text-blue-600">Estimated Lead Time: ${Math.round(leadTime)} days</p>
                <div class="text-sm text-gray-500 mb-2">Total Distance: ${Math.round(middleMileDist + firstMileDist + lastMileDist).toLocaleString()} km</div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                        <h4 class="font-bold text-gray-700">Origin Node SCM Issues (${originCity}):</h4>
                        <p class="text-sm text-gray-600">${origin.scmIssues}</p>
                    </div>
                    <div class="p-4 bg-gray-50 rounded-lg border-l-4 border-orange-500">
                        <h4 class="font-bold text-gray-700">Destination Node SCM Issues (${destinationCity}):</h4>
                        <p class="text-sm text-gray-600">${destination.scmIssues}</p>
                    </div>
                </div>
            </div>
        `;

        map.eachLayer(layer => { if (layer instanceof L.Marker || layer instanceof L.Polyline) map.removeLayer(layer); });

        L.marker(origin.coords).addTo(map).bindPopup(`<b>Origin:</b> ${originCity}`);
        L.marker(destination.coords).addTo(map).bindPopup(`<b>Destination:</b> ${destinationCity}`);
        
        const hubIcon = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
        L.marker(originHub.coords, { icon: hubIcon }).addTo(map).bindPopup(`<b>${transportMode.toUpperCase()} Hub:</b> ${originHub.name}`);
        L.marker(destHub.coords, { icon: hubIcon }).addTo(map).bindPopup(`<b>${transportMode.toUpperCase()} Hub:</b> ${destHub.name}`);

        L.polyline([origin.coords, originHub.coords], { color: 'green', weight: 2, dashArray: '5, 5' }).addTo(map); 
        
        if (transportMode === 'sea') {
            // Split polyline if it crosses the antimeridian
            drawSeaPath(middleMilePath);
        } else {
            L.polyline(middleMilePath, { color: '#ef4444', weight: 3, opacity: 0.7, dashArray: '1, 10' }).addTo(map); 
        }

        L.polyline([destHub.coords, destination.coords], { color: 'orange', weight: 2, dashArray: '5, 5' }).addTo(map); 

        map.fitBounds([origin.coords, destination.coords, ...middleMilePath], { padding: [50, 50] });
    });

    function drawSeaPath(path) {
        let segments = [[]];
        let currentSegment = 0;

        for (let i = 0; i < path.length; i++) {
            if (i > 0) {
                const prevLon = path[i-1][1];
                const currLon = path[i][1];
                if (Math.abs(prevLon - currLon) > 180) {
                    segments.push([]);
                    currentSegment++;
                }
            }
            segments[currentSegment].push(path[i]);
        }

        segments.forEach(seg => {
            L.polyline(seg, { color: '#2563eb', weight: 4, opacity: 0.8 }).addTo(map);
        });
    }

    function calculateDistance(coords1, coords2) {
        const R = 6371; 
        const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
        const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
        if (Math.abs(dLon) > Math.PI) {
            // handle wrap around
        }
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

});
