// container3d.js - Dedicated for planner.html
document.addEventListener('DOMContentLoaded', () => {
    // Cargo Input UI Logic
    const cargoContainer = document.getElementById('cargo-items');
    const addBtn = document.getElementById('add-cargo-btn');
    const simBtn = document.getElementById('simulate-load-btn');
    
    let cargoId = 0;
    const colors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xec4899, 0x14b8a6];

    function addCargoRow() {
        const id = cargoId++;
        const div = document.createElement('div');
        div.className = 'grid grid-cols-12 gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-100 animate-fade-in';
        div.innerHTML = `
            <input type="text" placeholder="Name" class="col-span-4 text-[10px] py-1.5 px-2 border-transparent bg-white rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500" value="Item ${id+1}" id="c-name-${id}">
            <input type="number" placeholder="L" title="Length (cm)" class="col-span-2 text-[10px] py-1.5 px-1 text-center border-transparent bg-white rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500" value="100" id="c-l-${id}">
            <input type="number" placeholder="W" title="Width (cm)" class="col-span-2 text-[10px] py-1.5 px-1 text-center border-transparent bg-white rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500" value="100" id="c-w-${id}">
            <input type="number" placeholder="H" title="Height (cm)" class="col-span-2 text-[10px] py-1.5 px-1 text-center border-transparent bg-white rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500" value="100" id="c-h-${id}">
            <div class="col-span-2 flex gap-1 items-center">
                <input type="number" placeholder="Q" title="Quantity" class="w-full text-[10px] py-1.5 px-1 text-center border-transparent bg-white rounded-lg shadow-sm focus:ring-1 focus:ring-indigo-500" value="10" id="c-q-${id}">
                <button class="text-slate-400 hover:text-red-500 transition-colors font-bold px-1" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        cargoContainer.appendChild(div);
        cargoContainer.parentElement.scrollTop = cargoContainer.parentElement.scrollHeight;
    }
    
    if(addBtn) addBtn.addEventListener('click', addCargoRow);
    addCargoRow(); addCargoRow(); // Initial items

    // Three.js Engine
    let scene, camera, renderer, controls;
    let isInitialized = false;
    let containerBox = null;
    let cargoMeshes = [];

    const canvasContainer = document.getElementById('canvas-container');
    const placeholder = document.getElementById('canvas-placeholder');

    function initThreeJS(width, height) {
        if (isInitialized) return;
        try {
            if(placeholder) placeholder.style.display = 'none';
            scene = new THREE.Scene();
            scene.background = null;

            camera = new THREE.PerspectiveCamera(45, width / height, 1, 20000);
            camera.position.set(2500, 1800, 3000);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            canvasContainer.appendChild(renderer.domElement);

            if (window.THREE && THREE.OrbitControls) {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
            }

            scene.add(new THREE.AmbientLight(0xffffff, 0.7));
            const light = new THREE.DirectionalLight(0xffffff, 0.8);
            light.position.set(2000, 3000, 2000);
            scene.add(light);

            const grid = new THREE.GridHelper(5000, 50, 0x475569, 0x1e293b);
            grid.position.y = -1;
            scene.add(grid);

            const animate = function () {
                requestAnimationFrame(animate);
                if (controls) controls.update();
                renderer.render(scene, camera);
            };
            animate();
            
            isInitialized = true;
            drawEmptyContainer(1200, 235, 239);
            console.log("3D Planner Engine Active");
        } catch (e) {
            console.error("3D Init Error:", e);
        }
    }

    // Handle resizing & initial load
    if (canvasContainer && window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const w = entry.contentRect.width, h = entry.contentRect.height;
                if (w > 0 && h > 0) {
                    if (!isInitialized) initThreeJS(w, h);
                    else if (camera && renderer) {
                        camera.aspect = w / h;
                        camera.updateProjectionMatrix();
                        renderer.setSize(w, h);
                    }
                }
            }
        });
        resizeObserver.observe(canvasContainer);
    }

    function drawEmptyContainer(L, W, H) {
        if (!scene) return;
        if(containerBox) scene.remove(containerBox);
        cargoMeshes.forEach(m => scene.remove(m));
        cargoMeshes = [];

        const geometry = new THREE.BoxGeometry(L, H, W);
        const edges = new THREE.EdgesGeometry(geometry);
        containerBox = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x6366f1, linewidth: 2, transparent: true, opacity: 0.5 }));
        
        const floorGeo = new THREE.PlaneGeometry(L, W);
        const floorMesh = new THREE.Mesh(floorGeo, new THREE.MeshBasicMaterial({ color: 0x312e81, side: THREE.DoubleSide, transparent: true, opacity: 0.2 }));
        floorMesh.rotation.x = Math.PI / 2; floorMesh.position.y = -H/2;
        containerBox.add(floorMesh);

        containerBox.position.set(0, H/2, 0);
        scene.add(containerBox);
    }

    function addBox(x, y, z, l, h, w, colorCode, contL, contW, contH) {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(l, h, w), new THREE.MeshLambertMaterial({ color: colorCode, transparent: true, opacity: 0.95 }));
        const wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 }));
        mesh.add(wireframe);
        mesh.position.set(-contL/2 + x + l/2, y + h/2, -contW/2 + z + w/2);
        scene.add(mesh);
        cargoMeshes.push(mesh);
    }

    if(simBtn) simBtn.addEventListener('click', () => {
        if(!isInitialized) return;
        const contType = document.getElementById('container-type').value;
        let C_L = 590, C_W = 235, C_H = 239;
        if(contType === '40ft') { C_L = 1200; C_W = 235; C_H = 239; }
        if(contType === '40hc') { C_L = 1200; C_W = 235; C_H = 269; }

        drawEmptyContainer(C_L, C_W, C_H);

        let itemsToPack = [];
        for(let i=0; i<cargoId; i++) {
            const nameEl = document.getElementById(`c-name-${i}`);
            if(!nameEl) continue;
            const l = parseFloat(document.getElementById(`c-l-${i}`).value) || 0, w = parseFloat(document.getElementById(`c-w-${i}`).value) || 0, h = parseFloat(document.getElementById(`c-h-${i}`).value) || 0, q = parseInt(document.getElementById(`c-q-${i}`).value) || 0;
            if(l > 0 && w > 0 && h > 0 && q > 0) {
                for(let j=0; j<q; j++) itemsToPack.push({ l, w, h, color: colors[i % colors.length] });
            }
        }

        itemsToPack.sort((a,b) => (b.l*b.w*b.h) - (a.l*a.w*a.h));

        class Packer {
            constructor(L, W, H) { this.spaces = [{x:0, y:0, z:0, l:L, w:W, h:H}]; this.packed = []; }
            pack(box) {
                this.spaces.sort((a, b) => (a.y - b.y) || (a.z - b.z) || (a.x - b.x));
                for (let i = 0; i < this.spaces.length; i++) {
                    let s = this.spaces[i];
                    let rots = [{l: box.l, w: box.w, h: box.h}, {l: box.w, w: box.l, h: box.h}];
                    for (let rot of rots) {
                        if (rot.l <= s.l && rot.w <= s.w && rot.h <= s.h) {
                            this.packed.push({x:s.x, y:s.y, z:s.z, l:rot.l, w:rot.w, h:rot.h, color:box.color});
                            this.spaces.splice(i, 1);
                            if (s.h - rot.h > 0) this.spaces.push({x:s.x, y:s.y + rot.h, z:s.z, l:rot.l, w:rot.w, h:s.h - rot.h});
                            if (s.l - rot.l > 0) this.spaces.push({x:s.x + rot.l, y:s.y, z:s.z, l:s.l - rot.l, w:s.w, h:s.h});
                            if (s.w - rot.w > 0) this.spaces.push({x:s.x, y:s.y, z:s.z + rot.w, l:rot.l, w:s.w - rot.w, h:s.h});
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

        packer.packed.forEach((p, idx) => setTimeout(() => addBox(p.x, p.y, p.z, p.l, p.h, p.w, p.color, C_L, C_W, C_H), idx * 20));

        const summary = document.getElementById('packing-summary');
        if(summary) {
            summary.classList.remove('hidden');
            document.getElementById('vol-util').innerText = ((totalVol / (C_L*C_W*C_H)) * 100).toFixed(1) + '%';
            document.getElementById('packed-count').innerText = `${packer.packed.length}/${itemsToPack.length}`;
        }
        
        camera.position.set(C_L * 1.2, C_H + 1000, C_W + 1500);
        controls.target.set(0, C_H/2, 0);
        controls.update();
    });
});