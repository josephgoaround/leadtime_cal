// container3d.js - Absolute Engine for 3D Load Planner
document.addEventListener('DOMContentLoaded', () => {
    
    // UI ELEMENTS
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
        div.className = 'cargo-row bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 relative group';
        div.innerHTML = `
            <button class="absolute -top-2 -right-2 w-6 h-6 bg-white shadow-md rounded-full text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center border border-slate-100" onclick="this.parentElement.remove()">×</button>
            <div class="flex items-center justify-between gap-2">
                <input type="text" class="flex-1 text-[11px] font-bold bg-transparent border-b border-slate-200 outline-none" value="Item ${id+1}" id="c-name-${id}">
            </div>
            <div class="grid grid-cols-5 gap-2">
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">L</p><input type="number" value="120" class="w-full p-2 bg-white rounded-lg text-xs font-bold" id="c-l-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">W</p><input type="number" value="100" class="w-full p-2 bg-white rounded-lg text-xs font-bold" id="c-w-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">H</p><input type="number" value="100" class="w-full p-2 bg-white rounded-lg text-xs font-bold" id="c-h-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">QTY</p><input type="number" value="5" class="w-full p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black" id="c-q-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">Wt</p><input type="number" value="500" class="w-full p-2 bg-white rounded-lg text-xs font-bold" id="c-wt-${id}"></div>
            </div>`;
        cargoContainer.appendChild(div);
    }
    
    if(addBtn) addBtn.onclick = addCargoRow;
    for(let i=0; i<3; i++) addCargoRow(); 

    // THREE.JS ENGINE
    let scene, camera, renderer, controls;
    let isInitialized = false;
    let cargoMeshes = [];
    let containerBox = null;

    function initThreeJS() {
        if (isInitialized || !canvasContainer) return;
        const w = canvasContainer.clientWidth || 800;
        const h = canvasContainer.clientHeight || 600;

        try {
            if(placeholder) placeholder.style.display = 'none';
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, w / h, 1, 100000);
            camera.position.set(2000, 1500, 2500);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(w, h);
            renderer.setPixelRatio(window.devicePixelRatio);
            canvasContainer.appendChild(renderer.domElement);

            controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;

            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            const light = new THREE.DirectionalLight(0xffffff, 0.5);
            light.position.set(1000, 2000, 1000);
            scene.add(light);

            scene.add(new THREE.GridHelper(5000, 50, 0x334155, 0x1e293b));
            
            const animate = () => {
                requestAnimationFrame(animate);
                controls.update();
                renderer.render(scene, camera);
            };
            animate();
            
            isInitialized = true;
            updateContainer(590, 235, 239);
            console.log("3D Engine Operational");
        } catch (e) {
            console.error("3D Init Error:", e);
        }
    }

    function updateContainer(L, W, H) {
        if(!scene) return;
        if(containerBox) scene.remove(containerBox);
        cargoMeshes.forEach(m => scene.remove(m));
        cargoMeshes = [];

        const geo = new THREE.BoxGeometry(L, H, W);
        const edges = new THREE.EdgesGeometry(geo);
        containerBox = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.5 }));
        
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(L, W), new THREE.MeshPhongMaterial({ color: 0x1e1b4b, side: THREE.DoubleSide, transparent: true, opacity: 0.2 }));
        floor.rotation.x = Math.PI / 2;
        floor.position.y = -H/2;
        containerBox.add(floor);

        containerBox.position.set(0, H/2, 0);
        scene.add(containerBox);
    }

    function addBox(x, y, z, l, h, w, color, contL, contW, contH) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(l, h, w), new THREE.MeshStandardMaterial({ color: color, transparent: true, opacity: 0.9, roughness: 0.4 }));
        mesh.position.set(-contL/2 + x + l/2, y + h/2, -contW/2 + z + w/2);
        scene.add(mesh);
        cargoMeshes.push(mesh);
    }

    if(simBtn) simBtn.onclick = () => {
        if(!isInitialized) initThreeJS();
        const type = document.getElementById('container-type').value;
        let L=590, W=235, H=239;
        if(type === '40ft') L=1200;
        if(type === '40hc') { L=1200; H=269; }
        updateContainer(L, W, H);

        let items = [];
        document.querySelectorAll('.cargo-row').forEach((row, i) => {
            const l = parseFloat(row.querySelector('[id^="c-l-"]').value) || 0;
            const w = parseFloat(row.querySelector('[id^="c-w-"]').value) || 0;
            const h = parseFloat(row.querySelector('[id^="c-h-"]').value) || 0;
            const q = parseInt(row.querySelector('[id^="c-q-"]').value) || 0;
            const wt = parseFloat(row.querySelector('[id^="c-wt-"]').value) || 0;
            if(l>0 && w>0 && h>0 && q>0) {
                for(let j=0; j<q; j++) items.push({ l, w, h, weight: wt, color: colors[i % colors.length] });
            }
        });

        items.sort((a,b) => b.weight - a.weight);

        let x=0, y=0, z=0, maxH=0, rowW=0, packed=0;
        items.forEach(item => {
            if(x + item.l > L) { x=0; z += rowW; rowW=0; }
            if(z + item.w > W) { z=0; x=0; y += maxH; maxH=0; }
            if(y + item.h <= H) {
                addBox(x, y, z, item.l, item.h, item.w, item.color, L, W, H);
                x += item.l;
                rowW = Math.max(rowW, item.w);
                maxH = Math.max(maxH, item.h);
                packed++;
            }
        });

        document.getElementById('vol-util').innerText = Math.round((packed/items.length)*100) + '%';
        document.getElementById('packed-count').innerText = `${packed}/${items.length}`;
    };

    // Auto-init Loop
    const retry = setInterval(() => {
        if(canvasContainer && canvasContainer.clientWidth > 0) {
            initThreeJS();
            clearInterval(retry);
        }
    }, 200);
});