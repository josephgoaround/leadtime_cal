// container3d.js - Professional Load Packing Engine
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIG & UI ---
    const cargoContainer = document.getElementById('cargo-items');
    const addBtn = document.getElementById('add-cargo-btn');
    const simBtn = document.getElementById('simulate-load-btn');
    const canvasContainer = document.getElementById('canvas-container');
    const placeholder = document.getElementById('canvas-placeholder');
    
    let cargoId = 0;
    const colors = [0x6366f1, 0x10b981, 0xf59e0b, 0xef4444, 0x8b5cf6, 0xec4899, 0x06b6d4];

    function addCargoRow() {
        const id = cargoId++;
        const div = document.createElement('div');
        div.className = 'bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 animate-fade-in relative group';
        div.innerHTML = `
            <button class="absolute -top-2 -right-2 w-6 h-6 bg-white shadow-md rounded-full text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center border border-slate-100" onclick="this.parentElement.remove()">×</button>
            <div class="flex items-center justify-between gap-2">
                <input type="text" class="flex-1 text-[11px] font-bold bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none pb-1" value="Item ${id+1}" id="c-name-${id}">
                <select id="c-group-${id}" class="text-[9px] bg-white border border-slate-200 rounded px-1 font-bold text-slate-500">
                    <option value="A">Group A</option>
                    <option value="B">Group B</option>
                </select>
            </div>
            <div class="grid grid-cols-6 gap-2">
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">L (cm)</p><input type="number" value="120" class="w-full p-2 bg-white rounded-lg text-xs font-bold shadow-sm outline-none" id="c-l-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">W (cm)</p><input type="number" value="100" class="w-full p-2 bg-white rounded-lg text-xs font-bold shadow-sm outline-none" id="c-w-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">H (cm)</p><input type="number" value="100" class="w-full p-2 bg-white rounded-lg text-xs font-bold shadow-sm outline-none" id="c-h-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">Wt (kg)</p><input type="number" value="500" class="w-full p-2 bg-white rounded-lg text-xs font-bold shadow-sm outline-none" id="c-wt-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">QTY</p><input type="number" value="5" class="w-full p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black shadow-sm outline-none" id="c-q-${id}"></div>
                <div class="space-y-1 flex flex-col items-center justify-end pb-1">
                    <input type="checkbox" checked class="w-4 h-4 rounded border-slate-200 text-indigo-600" id="c-s-${id}">
                </div>
            </div>
        `;
        cargoContainer.appendChild(div);
    }
    
    if(addBtn) addBtn.addEventListener('click', addCargoRow);
    for(let i=0; i<3; i++) addCargoRow(); 

    // --- 2. THREE.JS ENGINE ---
    let scene, camera, renderer, controls;
    let isInitialized = false;
    let containerGroup = new THREE.Group();
    let cargoMeshes = [];

    function initThreeJS() {
        if (isInitialized || !canvasContainer) return;
        const width = canvasContainer.clientWidth;
        const height = canvasContainer.clientHeight;
        if (width <= 0 || height <= 0) return;

        try {
            if(placeholder) placeholder.style.display = 'none';
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, width / height, 1, 100000);
            camera.position.set(2000, 1500, 2500);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            canvasContainer.appendChild(renderer.domElement);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;

            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            const light = new THREE.DirectionalLight(0xffffff, 0.5);
            light.position.set(1000, 2000, 1000);
            scene.add(light);

            scene.add(new THREE.GridHelper(5000, 50, 0x334155, 0x1e293b));
            scene.add(containerGroup);

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };
            animate();
            
            isInitialized = true;
            drawContainer(590, 235, 239); // 20ft default
            console.log("3D Engine Initialized");
        } catch (e) {
            console.error("Three.js Init Error:", e);
        }
    }

    function drawContainer(L, W, H) {
        while(containerGroup.children.length > 0) containerGroup.remove(containerGroup.children[0]);
        cargoMeshes.forEach(m => scene.remove(m));
        cargoMeshes = [];

        const geometry = new THREE.BoxGeometry(L, H, W);
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.5 }));
        
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(L, W), new THREE.MeshPhongMaterial({ color: 0x1e1b4b, side: THREE.DoubleSide, transparent: true, opacity: 0.2 }));
        floor.rotation.x = Math.PI / 2;
        floor.position.y = -H/2;
        
        line.add(floor);
        line.position.set(0, H/2, 0);
        containerGroup.add(line);
    }

    function addBox(x, y, z, l, h, w, colorCode, contL, contW, contH) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(l, h, w), new THREE.MeshStandardMaterial({ color: colorCode, transparent: true, opacity: 0.9, roughness: 0.4 }));
        const wire = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.1 }));
        mesh.add(wire);
        mesh.position.set(-contL/2 + x + l/2, y + h/2, -contW/2 + z + w/2);
        scene.add(mesh);
        cargoMeshes.push(mesh);
    }

    // --- 3. LOGIC ---
    if(simBtn) simBtn.addEventListener('click', () => {
        const type = document.getElementById('container-type').value;
        let L=590, W=235, H=239;
        if(type === '40ft') L=1200;
        if(type === '40hc') { L=1200; H=269; }
        drawContainer(L, W, H);

        let items = [];
        cargoContainer.querySelectorAll('.group').forEach((row, i) => {
            const l = parseFloat(row.querySelector('[id^="c-l-"]').value) || 0;
            const w = parseFloat(row.querySelector('[id^="c-w-"]').value) || 0;
            const h = parseFloat(row.querySelector('[id^="c-h-"]').value) || 0;
            const wt = parseFloat(row.querySelector('[id^="c-wt-"]').value) || 0;
            const q = parseInt(row.querySelector('[id^="c-q-"]').value) || 0;
            if(l>0 && w>0 && h>0 && q>0) {
                for(let j=0; j<q; j++) items.push({ l, w, h, weight: wt, color: colors[i % colors.length] });
            }
        });

        items.sort((a,b) => b.weight - a.weight);

        let x=0, y=0, z=0, maxH=0, rowW=0;
        let packedCount = 0;
        items.forEach(item => {
            if(x + item.l > L) { x=0; z += rowW; rowW=0; }
            if(z + item.w > W) { z=0; x=0; y += maxH; maxH=0; }
            if(y + item.h <= H) {
                addBox(x, y, z, item.l, item.h, item.w, item.color, L, W, H);
                x += item.l;
                rowW = Math.max(rowW, item.w);
                maxH = Math.max(maxH, item.h);
                packedCount++;
            }
        });

        document.getElementById('vol-util').innerText = Math.round((packedCount/items.length)*100) + '%';
        document.getElementById('packed-count').innerText = `${packedCount}/${items.length}`;
    });

    // Forced init check
    const checkInit = setInterval(() => {
        if(canvasContainer.clientWidth > 0) {
            initThreeJS();
            clearInterval(checkInit);
        }
    }, 500);
});