// container3d.js - Dedicated Engine for 3D Load Planner (Standalone Page)
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. UI CORE ELEMENTS ---
    const cargoContainer = document.getElementById('cargo-items');
    const addBtn = document.getElementById('add-cargo-btn');
    const simBtn = document.getElementById('simulate-load-btn');
    
    let cargoId = 0;
    const colors = [0x6366f1, 0x10b981, 0xf59e0b, 0xef4444, 0x8b5cf6, 0xec4899, 0x06b6d4];

    function addCargoRow() {
        const id = cargoId++;
        const div = document.createElement('div');
        div.className = 'bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3 animate-fade-in relative group';
        div.innerHTML = `
            <button class="absolute -top-2 -right-2 w-6 h-6 bg-white shadow-md rounded-full text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center border border-slate-100" onclick="this.parentElement.remove()">×</button>
            <div class="flex items-center justify-between gap-2">
                <input type="text" placeholder="Description" class="flex-1 text-[11px] font-bold bg-transparent border-b border-slate-200 focus:border-indigo-500 outline-none pb-1" value="Unit ${id+1}" id="c-name-${id}">
                <select id="c-group-${id}" class="text-[9px] bg-white border border-slate-200 rounded px-1 font-bold text-slate-500">
                    <option value="A">Group A</option>
                    <option value="B">Group B</option>
                    <option value="C">Group C</option>
                </select>
            </div>
            <div class="grid grid-cols-6 gap-2">
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">L (cm)</p><input type="number" value="120" class="w-full p-2 bg-white rounded-lg text-xs font-bold shadow-sm focus:ring-1 focus:ring-indigo-500 outline-none" id="c-l-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">W (cm)</p><input type="number" value="100" class="w-full p-2 bg-white rounded-lg text-xs font-bold shadow-sm focus:ring-1 focus:ring-indigo-500 outline-none" id="c-w-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">H (cm)</p><input type="number" value="100" class="w-full p-2 bg-white rounded-lg text-xs font-bold shadow-sm focus:ring-1 focus:ring-indigo-500 outline-none" id="c-h-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">Wt (kg)</p><input type="number" value="500" class="w-full p-2 bg-white rounded-lg text-xs font-bold shadow-sm focus:ring-1 focus:ring-indigo-500 outline-none" id="c-wt-${id}"></div>
                <div class="space-y-1"><p class="text-[8px] font-black text-slate-400 uppercase">QTY</p><input type="number" value="5" class="w-full p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black shadow-sm focus:ring-1 focus:ring-indigo-500 outline-none" id="c-q-${id}"></div>
                <div class="space-y-1 flex flex-col items-center justify-end pb-1">
                    <p class="text-[8px] font-black text-slate-400 uppercase mb-1">Stack</p>
                    <input type="checkbox" checked class="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500" id="c-s-${id}">
                </div>
            </div>
        `;
        cargoContainer.appendChild(div);
        cargoContainer.scrollTop = cargoContainer.scrollHeight;
    }
    
    if(addBtn) addBtn.addEventListener('click', addCargoRow);
    addCargoRow(); addCargoRow(); 

    // --- 2. THREE.JS RENDERING ENGINE ---
    let scene, camera, renderer, controls;
    let isInitialized = false;
    let containerBox = null;
    let cargoMeshes = [];

    const canvasContainer = document.getElementById('canvas-container');
    const placeholder = document.getElementById('canvas-placeholder');

    function initThreeJS() {
        if (isInitialized) return;
        const width = canvasContainer.clientWidth;
        const height = canvasContainer.clientHeight;
        if (width <= 0 || height <= 0) return;

        try {
            if(placeholder) placeholder.style.display = 'none';
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(45, width / height, 1, 50000);
            camera.position.set(2500, 2000, 3500);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            canvasContainer.appendChild(renderer.domElement);

            if (window.THREE.OrbitControls) {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
            }

            scene.add(new THREE.AmbientLight(0xffffff, 0.7));
            const light = new THREE.DirectionalLight(0xffffff, 0.8);
            light.position.set(2000, 5000, 3000);
            scene.add(light);

            const grid = new THREE.GridHelper(10000, 100, 0x334155, 0x1e293b);
            grid.position.y = -2;
            scene.add(grid);

            const animate = () => {
                requestAnimationFrame(animate);
                if (controls) controls.update();
                renderer.render(scene, camera);
            };
            animate();
            
            isInitialized = true;
            drawEmptyContainer(590, 235, 239); 
            console.log("3D Engine Operational");
        } catch (e) {
            console.error("3D Init Failed:", e);
        }
    }

    // Direct init attempt
    setTimeout(initThreeJS, 100);

    if (window.ResizeObserver) {
        new ResizeObserver(entries => {
            const w = entries[0].contentRect.width, h = entries[0].contentRect.height;
            if (w > 0 && h > 0) {
                if (!isInitialized) initThreeJS();
                else if (camera && renderer) {
                    camera.aspect = w / h;
                    camera.updateProjectionMatrix();
                    renderer.setSize(w, h);
                }
            }
        }).observe(canvasContainer);
    }

    function drawEmptyContainer(L, W, H) {
        if (!scene) return;
        if(containerBox) scene.remove(containerBox);
        cargoMeshes.forEach(m => scene.remove(m));
        cargoMeshes = [];

        const geometry = new THREE.BoxGeometry(L, H, W);
        containerBox = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2, transparent: true, opacity: 0.4 })
        );
        
        const floorGeo = new THREE.PlaneGeometry(L, W);
        const floor = new THREE.Mesh(floorGeo, new THREE.MeshPhongMaterial({ color: 0x1e1b4b, side: THREE.DoubleSide, transparent: true, opacity: 0.2 }));
        floor.rotation.x = Math.PI / 2; floor.position.y = -H/2;
        containerBox.add(floor);

        containerBox.position.set(0, H/2, 0);
        scene.add(containerBox);
    }

    function addBox(x, y, z, l, h, w, colorCode, contL, contW, contH) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(l, h, w), new THREE.MeshStandardMaterial({ color: colorCode, transparent: true, opacity: 0.9, roughness: 0.3 }));
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 }));
        mesh.add(edges);
        mesh.position.set(-contL/2 + x + l/2, y + h/2, -contW/2 + z + w/2);
        scene.add(mesh);
        cargoMeshes.push(mesh);
    }

    // --- 3. BIN PACKING ALGORITHM ---
    if(simBtn) simBtn.addEventListener('click', () => {
        if(!isInitialized) return;

        const contType = document.getElementById('container-type').value;
        let C_L = 590, C_W = 235, C_H = 239; 
        if(contType === '40ft') { C_L = 1200; C_W = 235; C_H = 239; }
        if(contType === '40hc') { C_L = 1200; C_W = 235; C_H = 269; }

        drawEmptyContainer(C_L, C_W, C_H);

        let itemsToPack = [];
        const rows = cargoContainer.querySelectorAll('.bg-slate-50');
        rows.forEach((row, i) => {
            const l = parseFloat(row.querySelector('[id^="c-l-"]').value) || 0;
            const w = parseFloat(row.querySelector('[id^="c-w-"]').value) || 0;
            const h = parseFloat(row.querySelector('[id^="c-h-"]').value) || 0;
            const wt = parseFloat(row.querySelector('[id^="c-wt-"]').value) || 0;
            const q = parseInt(row.querySelector('[id^="c-q-"]').value) || 0;
            const s = row.querySelector('[id^="c-s-"]').checked;
            const g = row.querySelector('[id^="c-group-"]').value;
            if(l > 0 && w > 0 && h > 0 && q > 0) {
                for(let j=0; j<q; j++) itemsToPack.push({ l, w, h, weight: wt, group: g, stackable: s, color: colors[i % colors.length] });
            }
        });

        itemsToPack.sort((a,b) => (b.weight - a.weight) || (b.l*b.w*b.h) - (a.l*a.w*a.h));

        class Packer {
            constructor(L, W, H) { 
                this.spaces = [{x:0, y:0, z:0, l:L, w:W, h:H, allowedGroups: []}]; 
                this.packed = []; 
            }
            pack(box) {
                this.spaces.sort((a, b) => (a.y - b.y) || (a.z - b.z) || (a.x - b.x));
                for (let i = 0; i < this.spaces.length; i++) {
                    let s = this.spaces[i];
                    if (s.allowedGroups.length > 0 && !s.allowedGroups.includes(box.group)) continue;
                    const orientations = [{ l: box.l, w: box.w, h: box.h }, { l: box.w, w: box.l, h: box.h }];
                    for (let orient of orientations) {
                        if (orient.l <= s.l && orient.w <= s.w && orient.h <= s.h) {
                            this.packed.push({ x: s.x, y: s.y, z: s.z, l: orient.l, w: orient.w, h: orient.h, color: box.color, group: box.group });
                            this.spaces.splice(i, 1);
                            const childAllowedGroups = [box.group];
                            if (box.stackable && s.h - orient.h > 0) {
                                this.spaces.push({ x: s.x, y: s.y + orient.h, z: s.z, l: orient.l, w: orient.w, h: s.h - orient.h, allowedGroups: childAllowedGroups });
                            }
                            if (s.l - orient.l > (s.w - orient.w)) {
                                if (s.l - orient.l > 0) this.spaces.push({x: s.x + orient.l, y: s.y, z: s.z, l: s.l - orient.l, w: s.w, h: s.h, allowedGroups: []});
                                if (s.w - orient.w > 0) this.spaces.push({x: s.x, y: s.y, z: s.z + orient.w, l: orient.l, w: s.w - orient.w, h: s.h, allowedGroups: []});
                            } else {
                                if (s.w - orient.w > 0) this.spaces.push({x: s.x, y: s.y, z: s.z + orient.w, l: s.l, w: s.w - orient.w, h: s.h, allowedGroups: []});
                                if (s.l - orient.l > 0) this.spaces.push({x: s.x + orient.l, y: s.y, z: s.z, l: s.l - orient.l, w: orient.w, h: s.h, allowedGroups: []});
                            }
                            return true;
                        }
                    }
                }
                return false;
            }
        }

        const packer = new Packer(C_L, C_W, C_H);
        let totalVol = 0;
        itemsToPack.forEach(item => { if(packer.pack(item)) totalVol += (item.l*item.w*item.h); });

        packer.packed.forEach((p, idx) => {
            setTimeout(() => addBox(p.x, p.y, p.z, p.l, p.h, p.w, p.color, C_L, C_W, C_H), idx * 15);
        });

        const efficiency = (totalVol / (C_L*C_W*C_H)) * 100;
        const volUtil = document.getElementById('vol-util');
        const volBar = document.getElementById('vol-bar');
        const packedCount = document.getElementById('packed-count');
        if(volUtil) volUtil.innerText = efficiency.toFixed(1) + '%';
        if(volBar) volBar.style.width = efficiency + '%';
        if(packedCount) packedCount.innerText = `${packer.packed.length}/${itemsToPack.length}`;
        camera.position.set(C_L * 1.3, C_H + 1200, C_W + 1800);
        controls.target.set(0, C_H/2, 0);
        controls.update();
    });
});