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

    // Categorized Locations - Expanded Database
    const portCities = {
        "Port of New York": { coords: [40.7128, -74.0060], hub: "usa-nyc", scmIssues: "Port labor negotiations; Driver shortages." },
        "Port of Los Angeles": { coords: [34.0522, -118.2437], hub: "usa-lax", scmIssues: "San Pedro Bay congestion." },
        "Port of Shanghai": { coords: [31.2304, 121.4737], hub: "chn-sha", scmIssues: "Strict export inspections." },
        "Port of Rotterdam": { coords: [51.9225, 4.4792], hub: "nld-rot", scmIssues: "Customs clearance backlogs." },
        "Port of Busan": { coords: [35.1796, 129.0756], hub: "kor-pus", scmIssues: "Labor union strikes." },
        "Port of Singapore": { coords: [1.3521, 103.8198], hub: "sgp-sin", scmIssues: "Vessel bunching at hub." },
        "Port of Hamburg": { coords: [53.5511, 9.9937], hub: "deu-ham", scmIssues: "Rail capacity constraints." },
        "Port of Jebel Ali (Dubai)": { coords: [25.0112, 55.0617], hub: "are-dxb-sea", scmIssues: "Geopolitical tensions." },
        "Port of Mumbai": { coords: [18.9647, 72.8347], hub: "ind-bom", scmIssues: "Infrastructure bottlenecks." },
        "Port of Santos": { coords: [-23.9608, -46.3331], hub: "bra-ssz", scmIssues: "Heavy bureaucracy." },
        "Port of Tokyo": { coords: [35.6895, 139.6917], hub: "jpn-tyo", scmIssues: "High storage costs." },
        "Port of Hong Kong": { coords: [22.3193, 114.1694], hub: "hkg-hkg-sea", scmIssues: "Transshipment delays." },
        "Port of Savannah": { coords: [32.0835, -81.0998], hub: "usa-sav", scmIssues: "Intermodal rail backlog." }
    };

    const airportCities = {
        "JFK (New York)": { coords: [40.6413, -73.7781], hub: "usa-jfk", scmIssues: "Cargo terminal modernization." },
        "LAX (Los Angeles)": { coords: [33.9416, -118.4085], hub: "usa-lax-air", scmIssues: "Tight warehouse capacity." },
        "PVG (Shanghai)": { coords: [31.1444, 121.8053], hub: "chn-pvg", scmIssues: "Frequent flight cancellations." },
        "AMS (Amsterdam)": { coords: [52.3105, 4.7683], hub: "nld-ams", scmIssues: "Schiphol flight caps." },
        "ICN (Seoul)": { coords: [37.4602, 126.4407], hub: "kor-icn", scmIssues: "E-commerce volume spikes." },
        "SIN (Singapore)": { coords: [1.3644, 103.9915], hub: "sgp-sin-air", scmIssues: "Tight cold-chain space." },
        "LHR (London)": { coords: [51.4700, -0.4543], hub: "gbr-lhr", scmIssues: "Post-Brexit customs delays." },
        "DXB (Dubai)": { coords: [25.2532, 55.3657], hub: "are-dxb-air", scmIssues: "High transshipment volume." },
        "BOM (Mumbai)": { coords: [19.0896, 72.8656], hub: "ind-bom-air", scmIssues: "Documentation backlogs." },
        "GRU (Sao Paulo)": { coords: [-23.4356, -46.4731], hub: "bra-sao-air", scmIssues: "Customs strike risk." },
        "CDG (Paris)": { coords: [49.0097, 2.5479], hub: "fra-cdg", scmIssues: "Labor unrest potential." },
        "FRA (Frankfurt)": { coords: [50.0379, 8.5622], hub: "deu-fra", scmIssues: "Night flight restrictions." },
        "HKG (Hong Kong)": { coords: [22.3080, 113.9185], hub: "hkg-hkg-air", scmIssues: "Security screening peaks." }
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
        "jpn-tyo": { name: "Tokyo Port", coords: [35.6333, 139.7833] },
        "hkg-hkg-sea": { name: "Hong Kong Port", coords: [22.3193, 114.1694] },
        "hkg-hkg-air": { name: "Hong Kong Intl", coords: [22.3080, 113.9185] },
        "usa-sav": { name: "Port of Savannah", coords: [32.1202, -81.1315] },
        "fra-cdg": { name: "Paris CDG Airport", coords: [49.0097, 2.5479] },
        "deu-fra": { name: "Frankfurt Airport", coords: [50.0379, 8.5622] }
    };

    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    const modeSelect = document.getElementById('transport-mode');

    function populateCities() {
        const mode = modeSelect.value;
        const currentCities = mode === 'sea' ? portCities : airportCities;
        
        originSelect.innerHTML = '';
        destinationSelect.innerHTML = '';

        Object.keys(currentCities).sort().forEach(city => {
            const opt1 = document.createElement('option');
            opt1.value = city;
            opt1.textContent = city;
            originSelect.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = city;
            opt2.textContent = city;
            destinationSelect.appendChild(opt2);
        });
    }

    modeSelect.addEventListener('change', populateCities);
    populateCities(); // Initial load

    const map = L.map('map').setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    const waypoints = {
        "suez": [30.5852, 32.2654],
        "panama": [9.352, -79.920],
        "malacca": [1.2, 103.8],
        "gibraltar": [35.9, -5.5],
        "cape": [-34.35, 18.47],
        "bab_el_mandeb": [12.6, 43.3],
        "south_tip_india": [5.9, 80.5],
        "pacific_mid": [20.0, -160.0],
        "good_hope": [-34.35, 18.47],
        "cape_verde": [15.0, -25.0],
        "english_channel": [50.5, -0.5]
    };

    function getSeaRoute(originHubCoords, destHubCoords, activeRisks) {
        let path = [originHubCoords];
        const oLon = originHubCoords[1];
        const dLon = destHubCoords[1];

        if ((oLon < -100 && dLon > 100) || (oLon > 100 && dLon < -100)) {
             path.push(waypoints.pacific_mid);
        }
        else if ((oLon > 60 && dLon < 20) || (oLon < 20 && dLon > 60)) {
            const useCape = globalRisks.redSeaCrisis.active;
            if (oLon > 60) {
                path.push(waypoints.malacca);
                path.push(waypoints.south_tip_india);
                if (useCape) {
                    path.push(waypoints.good_hope);
                    path.push(waypoints.cape_verde);
                    activeRisks.push(globalRisks.redSeaCrisis);
                } else {
                    path.push(waypoints.bab_el_mandeb);
                    path.push(waypoints.suez);
                }
                path.push(waypoints.gibraltar);
                path.push(waypoints.english_channel);
            } else {
                path.push(waypoints.english_channel);
                path.push(waypoints.gibraltar);
                if (useCape) {
                    path.push(waypoints.cape_verde);
                    path.push(waypoints.good_hope);
                    activeRisks.push(globalRisks.redSeaCrisis);
                } else {
                    path.push(waypoints.suez);
                    path.push(waypoints.bab_el_mandeb);
                }
                path.push(waypoints.south_tip_india);
                path.push(waypoints.malacca);
            }
        }
        else if ((oLon > -80 && oLon < -60 && dLon > 100) || (oLon > 100 && dLon > -80 && dLon < -60)) {
            if (oLon < 0) { path.push(waypoints.panama); path.push(waypoints.pacific_mid); }
            else { path.push(waypoints.pacific_mid); path.push(waypoints.panama); }
            if (globalRisks.panamaDrought.active) activeRisks.push(globalRisks.panamaDrought);
        }
        else if (oLon < 20 && oLon > -10 && dLon < -60 && dLon > -80) {
            path.push(waypoints.english_channel);
        }

        path.push(destHubCoords);
        return path;
    }

    function getAirRoute(originCoords, destCoords, activeRisks) {
        const path = [];
        const steps = 30;
        let startLon = originCoords[1];
        let endLon = destCoords[1];
        let avoidRussia = false;

        if (globalRisks.russiaAirspace.active) {
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
            let lat = originCoords[0] + (destCoords[0] - originCoords[0]) * f;
            const lon = startLon + (endLon - startLon) * f;
            const dist = calculateDistance(originCoords, destCoords);
            let offset = Math.sin(Math.PI * f) * (dist / 12000) * 15;
            if (avoidRussia && lat > 45) offset -= 20; 
            path.push([lat + offset, lon]);
        }
        return path;
    }

    document.getElementById('shipping-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const mode = modeSelect.value;
        const cargoType = document.getElementById('cargo-type').value;
        const originCityName = originSelect.value;
        const destCityName = destinationSelect.value;
        const resultDiv = document.getElementById('result');

        if (originCityName === destCityName) {
            resultDiv.innerHTML = `<p class="text-red-500">Origin and destination cannot be the same.</p>`;
            return;
        }

        const cityData = mode === 'sea' ? portCities : airportCities;
        const origin = cityData[originCityName];
        const dest = cityData[destCityName];
        const originHub = hubs[origin.hub];
        const destHub = hubs[dest.hub];

        let middleMilePath = [];
        let middleMileDist = 0;
        let activeRisks = []; 

        if (mode === 'sea') {
            middleMilePath = getSeaRoute(originHub.coords, destHub.coords, activeRisks);
            for (let i = 0; i < middleMilePath.length - 1; i++) {
                middleMileDist += calculateDistance(middleMilePath[i], middleMilePath[i+1]);
            }
        } else {
            middleMilePath = getAirRoute(originHub.coords, destHub.coords, activeRisks);
            for (let i = 0; i < middleMilePath.length - 1; i++) {
                middleMileDist += calculateDistance(middleMilePath[i], middleMilePath[i+1]);
            }
        }

        const firstMileDist = calculateDistance(origin.coords, originHub.coords);
        const lastMileDist = calculateDistance(destHub.coords, dest.coords);

        const speeds = { sea: 711, air: 20000, land: 500 }; 
        let leadTime = (firstMileDist / speeds.land) + (middleMileDist / speeds[mode]) + (lastMileDist / speeds.land);
        leadTime += (mode === 'sea' ? 5 : 2);

        activeRisks.forEach(risk => {
            if (risk === globalRisks.redSeaCrisis) leadTime += 12; 
            if (risk === globalRisks.panamaDrought) leadTime += 5; 
            if (risk === globalRisks.russiaAirspace) leadTime += 1; 
        });

        if (cargoType === 'Refrigerated') leadTime *= 1.1;
        if (cargoType === 'Dangerous Goods') leadTime *= 1.3;

        const totalDist = Math.round(middleMileDist + firstMileDist + lastMileDist);

        let riskAlertHtml = '';
        if (activeRisks.length > 0) {
            riskAlertHtml = `
                <div class="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-sm text-red-700">
                    <h4 class="font-bold flex items-center mb-1"><svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>Risk Factors</h4>
                    ${activeRisks.map(r => `• ${r.description}`).join('<br>')}
                </div>
            `;
        }

        resultDiv.innerHTML = `
            <div class="space-y-4">
                ${riskAlertHtml}
                <div class="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p class="text-3xl font-bold text-blue-700">${Math.round(leadTime)} Days</p>
                    <p class="text-lg font-semibold text-blue-600 mt-1">Total Distance: ${totalDist.toLocaleString()} km</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div class="p-3 bg-white rounded border border-gray-200 shadow-sm">
                        <div class="font-bold text-gray-700 mb-1 border-b pb-1">Origin (${originCityName})</div>
                        <p class="text-gray-600">${origin.scmIssues}</p>
                    </div>
                    <div class="p-3 bg-white rounded border border-gray-200 shadow-sm">
                        <div class="font-bold text-gray-700 mb-1 border-b pb-1">Destination (${destCityName})</div>
                        <p class="text-gray-600">${dest.scmIssues}</p>
                    </div>
                </div>

                <div class="text-[11px] text-gray-500 leading-relaxed space-y-1 mt-4 border-t pt-3">
                    <p>• 운송 날짜는 컨테이너선종에 따른 평균 속력(16knot)을 기준으로 계산되었습니다.</p>
                    <p>• 면책 고지: 예상 소요 날짜는 기상 악화, 천재지변 및 항만 혼잡 상황에 따라 변동될 수 있습니다.</p>
                </div>
            </div>
        `;

        map.eachLayer(layer => { if (layer instanceof L.Marker || layer instanceof L.Polyline) map.removeLayer(layer); });

        L.marker(origin.coords).addTo(map).bindPopup(originCityName);
        L.marker(dest.coords).addTo(map).bindPopup(destCityName);
        
        const hubIcon = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41], iconAnchor: [12, 41] });
        L.marker(originHub.coords, { icon: hubIcon }).addTo(map).bindPopup(originHub.name);
        L.marker(destHub.coords, { icon: hubIcon }).addTo(map).bindPopup(destHub.name);

        L.polyline([origin.coords, originHub.coords], { color: '#ef4444', weight: 2, dashArray: '5, 5', opacity: 0.6 }).addTo(map); 
        if (mode === 'sea') drawSeaPath(middleMilePath);
        else L.polyline(middleMilePath, { color: '#ef4444', weight: 4, opacity: 0.8 }).addTo(map); 
        L.polyline([destHub.coords, dest.coords], { color: '#ef4444', weight: 2, dashArray: '5, 5', opacity: 0.6 }).addTo(map); 

        map.fitBounds([origin.coords, dest.coords, ...middleMilePath], { padding: [50, 50] });
    });

    function drawSeaPath(path) {
        let segments = [[]];
        let currentSegment = 0;
        for (let i = 0; i < path.length; i++) {
            if (i > 0 && Math.abs(path[i-1][1] - path[i][1]) > 180) {
                segments.push([]);
                currentSegment++;
            }
            segments[currentSegment].push(path[i]);
        }
        segments.forEach(seg => L.polyline(seg, { color: '#dc2626', weight: 5, opacity: 0.9 }).addTo(map));
    }

    function calculateDistance(coords1, coords2) {
        const R = 6371; 
        const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
        let dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
});
