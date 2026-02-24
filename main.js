
document.addEventListener('DOMContentLoaded', () => {
    const locations = {
        "New York": { coords: [40.7128, -74.0060], country: "USA", hubs: { sea: "usa-nyc", air: "usa-jfk" } },
        "Los Angeles": { coords: [34.0522, -118.2437], country: "USA", hubs: { sea: "usa-lax", air: "usa-lax-air" } },
        "Shanghai": { coords: [31.2304, 121.4737], country: "China", hubs: { sea: "chn-sha", air: "chn-pvg" } },
        "Hamburg": { coords: [53.5511, 9.9937], country: "Germany", hubs: { sea: "deu-ham", air: "deu-ham-air" } },
        "Tokyo": { coords: [35.6895, 139.6917], country: "Japan", hubs: { sea: "jpn-tyo", air: "jpn-nrt" } },
        "Busan": { coords: [35.1796, 129.0756], country: "South Korea", hubs: { sea: "kor-pus", air: "kor-pus-air" } },
        "Santos": { coords: [-23.9608, -46.3331], country: "Brazil", hubs: { sea: "bra-ssz", air: "bra-sao-air" } },
        "Mumbai": { coords: [19.0760, 72.8777], country: "India", hubs: { sea: "ind-bom", air: "ind-bom-air" } },
        "Sydney": { coords: [-33.8688, 151.2093], country: "Australia", hubs: { sea: "aus-syd", air: "aus-syd-air" } }
    };

    const hubs = {
        "usa-nyc": { name: "Port of New York", coords: [40.6892, -74.0445], type: "sea" },
        "usa-jfk": { name: "JFK Airport", coords: [40.6413, -73.7781], type: "air" },
        "usa-lax": { name: "Port of Los Angeles", coords: [33.7542, -118.2764], type: "sea" },
        "usa-lax-air": { name: "LAX Airport", coords: [33.9416, -118.4085], type: "air" },
        "chn-sha": { name: "Port of Shanghai", coords: [31.3833, 121.5833], type: "sea" },
        "chn-pvg": { name: "Pudong Airport", coords: [31.1444, 121.8053], type: "air" },
        "deu-ham": { name: "Port of Hamburg", coords: [53.5468, 9.9703], type: "sea" },
        "deu-ham-air": { name: "Hamburg Airport", coords: [53.6304, 9.9882], type: "air" },
        "jpn-tyo": { name: "Port of Tokyo", coords: [35.6333, 139.7833], type: "sea" },
        "jpn-nrt": { name: "Narita Airport", coords: [35.7647, 140.3864], type: "air" },
        "kor-pus": { name: "Port of Busan", coords: [35.1069, 129.0453], type: "sea" },
        "kor-pus-air": { name: "Gimhae Airport", coords: [35.1794, 128.9383], type: "air" },
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

        // Calculate distances for each leg
        const firstMileDist = calculateDistance(origin.coords, originHub.coords);
        const middleMileDist = calculateDistance(originHub.coords, destHub.coords);
        const lastMileDist = calculateDistance(destHub.coords, destination.coords);

        // Calculate lead time based on mode
        const speeds = { sea: 500, air: 1000, land: 100 }; // km/day
        let leadTime = (firstMileDist / speeds.land) + (middleMileDist / speeds[transportMode]) + (lastMileDist / speeds.land);

        switch (cargoType) {
            case 'Refrigerated': leadTime *= 1.2; break;
            case 'Dangerous Goods': leadTime *= 1.5; break;
        }

        resultDiv.innerHTML = `<p class="text-lg font-semibold">Estimated Lead Time: ${Math.round(leadTime)} days</p>`;

        // Clear map and draw new route
        map.eachLayer(layer => { if (layer instanceof L.Marker || layer instanceof L.Polyline) map.removeLayer(layer); });

        L.marker(origin.coords).addTo(map).bindPopup(`<b>Origin:</b> ${originCity}`);
        L.marker(destination.coords).addTo(map).bindPopup(`<b>Destination:</b> ${destinationCity}`);
        L.marker(originHub.coords, { icon: L.icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-red.png', iconSize: [25, 41] }) }).addTo(map).bindPopup(originHub.name);
        L.marker(destHub.coords, { icon: L.icon({ iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x-red.png', iconSize: [25, 41] }) }).addTo(map).bindPopup(destHub.name);

        // Draw route segments
        L.polyline([origin.coords, originHub.coords], { color: 'green', dashArray: '5, 5' }).addTo(map); // First mile
        L.polyline([originHub.coords, destHub.coords], { color: 'blue' }).addTo(map); // Middle mile
        L.polyline([destHub.coords, destination.coords], { color: 'orange', dashArray: '5, 5' }).addTo(map); // Last mile

        map.fitBounds([origin.coords, destination.coords, originHub.coords, destHub.coords], { padding: [50, 50] });
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
asd    }
});
