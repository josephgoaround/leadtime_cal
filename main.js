
document.addEventListener('DOMContentLoaded', () => {
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
        "suez": { name: "Suez Canal", coords: [30.5852, 32.2654] },
        "panama": { name: "Panama Canal", coords: [9.352, -79.920] },
        "malacca": { name: "Strait of Malacca", coords: [2.2, 102.2] },
        "gibraltar": { name: "Strait of Gibraltar", coords: [35.9, -5.5] },
        "cape": { name: "Cape of Good Hope", coords: [-34.35, 18.47] },
        "bab_el_mandeb": { name: "Bab-el-Mandeb", coords: [12.6, 43.3] }
    };

    function getSeaRoute(originHub, destHub) {
        const path = [originHub.coords];
        const oLat = originHub.coords[0];
        const oLon = originHub.coords[1];
        const dLat = destHub.coords[0];
        const dLon = destHub.coords[1];

        // Logic to decide waypoints (simplified routing engine)
        // Asia to Europe
        if ((oLon > 60 && dLon < 20) || (oLon < 20 && dLon > 60)) {
            if (oLon > 60) { // East to West
                path.push(waypoints.malacca.coords);
                path.push(waypoints.bab_el_mandeb.coords);
                path.push(waypoints.suez.coords);
                path.push(waypoints.gibraltar.coords);
            } else { // West to East
                path.push(waypoints.gibraltar.coords);
                path.push(waypoints.suez.coords);
                path.push(waypoints.bab_el_mandeb.coords);
                path.push(waypoints.malacca.coords);
            }
        }
        // US East to US West / Asia via Panama
        else if ((oLon < -40 && oLon > -100 && dLon > 100) || (oLon > 100 && dLon < -40 && dLon > -100)) {
            path.push(waypoints.panama.coords);
        }
        // Europe to US East
        else if (oLon < 20 && oLon > -10 && dLon < -40) {
            path.push(waypoints.gibraltar.coords);
        }

        path.push(destHub.coords);
        return path;
    }

    function getAirRoute(originCoords, destCoords) {
        // Create a curved path (simple arc) to simulate Great Circle
        const path = [];
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
            const f = i / steps;
            const lat = originCoords[0] + (destCoords[0] - originCoords[0]) * f;
            const lon = originCoords[1] + (destCoords[1] - originCoords[1]) * f;
            
            // Add a slight arc height based on distance
            const dist = calculateDistance(originCoords, destCoords);
            const offset = Math.sin(Math.PI * f) * (dist / 10000) * 10; 
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

        // Calculate total distance through waypoints for sea, or curved for air
        let middleMilePath = [];
        let middleMileDist = 0;

        if (transportMode === 'sea') {
            middleMilePath = getSeaRoute(originHub, destHub);
            for (let i = 0; i < middleMilePath.length - 1; i++) {
                middleMileDist += calculateDistance(middleMilePath[i], middleMilePath[i+1]);
            }
        } else {
            middleMilePath = getAirRoute(originHub.coords, destHub.coords);
            middleMileDist = calculateDistance(originHub.coords, destHub.coords);
        }

        const firstMileDist = calculateDistance(origin.coords, originHub.coords);
        const lastMileDist = calculateDistance(destHub.coords, destination.coords);

        // Calculate lead time based on mode
        const speeds = { sea: 600, air: 20000, land: 500 }; // km/day (adjusted for more realism)
        let leadTime = (firstMileDist / speeds.land) + (middleMileDist / speeds[transportMode]) + (lastMileDist / speeds.land);

        // Add buffer for port/airport handling
        const handlingTime = { sea: 5, air: 2 }; 
        leadTime += handlingTime[transportMode];

        switch (cargoType) {
            case 'Refrigerated': leadTime *= 1.1; break;
            case 'Dangerous Goods': leadTime *= 1.3; break;
        }

        resultDiv.innerHTML = `
            <div class="space-y-4">
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

        // Clear map and draw new route
        map.eachLayer(layer => { if (layer instanceof L.Marker || layer instanceof L.Polyline) map.removeLayer(layer); });

        // Draw locations
        L.marker(origin.coords).addTo(map).bindPopup(`<b>Origin:</b> ${originCity}`);
        L.marker(destination.coords).addTo(map).bindPopup(`<b>Destination:</b> ${destinationCity}`);
        
        // Draw Hubs
        const hubIcon = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41] });
        L.marker(originHub.coords, { icon: hubIcon }).addTo(map).bindPopup(`<b>${transportMode.toUpperCase()} Hub:</b> ${originHub.name}`);
        L.marker(destHub.coords, { icon: hubIcon }).addTo(map).bindPopup(`<b>${transportMode.toUpperCase()} Hub:</b> ${destHub.name}`);

        // Draw route segments
        L.polyline([origin.coords, originHub.coords], { color: 'green', weight: 2, dashArray: '5, 5' }).addTo(map); // First mile
        
        if (transportMode === 'sea') {
            L.polyline(middleMilePath, { color: '#2563eb', weight: 4, opacity: 0.8 }).addTo(map); // Sea route
        } else {
            L.polyline(middleMilePath, { color: '#ef4444', weight: 3, opacity: 0.7, dashArray: '1, 10' }).addTo(map); // Air route (dotted arc)
        }

        L.polyline([destHub.coords, destination.coords], { color: 'orange', weight: 2, dashArray: '5, 5' }).addTo(map); // Last mile

        map.fitBounds([origin.coords, destination.coords, ...middleMilePath], { padding: [50, 50] });
    });

    function calculateDistance(coords1, coords2) {
        const R = 6371; // km
        const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
        const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

});
