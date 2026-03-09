// container3d.js
document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching Logic
    const tabAnalyzer = document.getElementById('tab-analyzer');
    const tabPlanner = document.getElementById('tab-planner');
    const viewAnalyzer = document.getElementById('view-analyzer');
    const viewPlanner = document.getElementById('view-planner');

    if(!tabAnalyzer || !tabPlanner) return;

    tabAnalyzer.addEventListener('click', (e) => {
        e.preventDefault();
        viewAnalyzer.classList.remove('hidden');
        viewPlanner.classList.add('hidden');
        viewPlanner.classList.remove('opacity-100');
        viewPlanner.classList.add('opacity-0');
        
        tabAnalyzer.className = "px-6 py-1.5 rounded-full text-xs font-bold transition-all bg-white shadow-sm text-indigo-600 border border-slate-200/50";
        tabPlanner.className = "px-6 py-1.5 rounded-full text-xs font-bold transition-all text-slate-500 hover:text-slate-800";
    });

    tabPlanner.addEventListener('click', (e) => {
        e.preventDefault();
        viewAnalyzer.classList.add('hidden');
        viewPlanner.classList.remove('hidden');
        
        // Slight delay for opacity transition
        setTimeout(() => {
            viewPlanner.classList.remove('opacity-0');
            viewPlanner.classList.add('opacity-100');
        }, 10);
        
        tabPlanner.className = "px-6 py-1.5 rounded-full text-xs font-bold transition-all bg-white shadow-sm text-indigo-600 border border-slate-200/50";
        tabAnalyzer.className = "px-6 py-1.5 rounded-full text-xs font-bold transition-all text-slate-500 hover:text-slate-800";
    });

    // Cargo Input UI
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
        
        // Scroll to bottom
        cargoContainer.parentElement.scrollTop = cargoContainer.parentElement.scrollHeight;
    }
    
    if(addBtn) addBtn.addEventListener('click', addCargoRow);
    
    // Initial rows
    addCargoRow();
    addCargoRow();

    // Three.js Engine with ResizeObserver (FOOLPROOF)
    let scene, camera, renderer, controls;
    let isInitialized = false;
    let containerBox = null;
    let cargoMeshes = [];

    const container = document.getElementById('canvas-container');
    const placeholder = document.getElementById('canvas-placeholder');

    function initThreeJS(width, height) {
        if (isInitialized) return;
        
        try {
            if(placeholder) placeholder.style.display = 'none';
            
            scene = new THREE.Scene();
            // Transparent background to show the CSS slate-900
            scene.background = null;

            camera = new THREE.PerspectiveCamera(45, width / height, 1, 20000);
            camera.position.set(2500, 1800, 3000);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            
            // Append canvas
            container.appendChild(renderer.domElement);

            // Controls
            if (window.THREE && THREE.OrbitControls) {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't allow going too far under the floor
            }

            // Lighting
            scene.add(new THREE.AmbientLight(0xffffff, 0.7));
            const light = new THREE.DirectionalLight(0xffffff, 0.8);
            light.position.set(2000, 3000, 2000);
            scene.add(light);

            const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
            light2.position.set(-2000, 1000, -2000);
            scene.add(light2);

            // Floor Grid
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
            drawEmptyContainer(1200, 235, 239); // Render default 40ft container
            console.log("3D WebGL Engine Successfully Initialized");

        } catch (e) {
            console.error("WebGL Error:", e);
            if(placeholder) placeholder.innerHTML = `<p class="text-red-400 font-bold">Failed to load 3D Engine: ${e.message}</p>`;
        }
    }

    // Auto-Resize and Auto-Init Trigger
    if (container && window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                const height = entry.contentRect.height;
                
                // Only act if the container has actual dimensions (i.e. tab is visible)
                if (width > 0 && height > 0) {
                    if (!isInitialized) {
                        initThreeJS(width, height);
                    } else if (camera && renderer) {
                        camera.aspect = width / height;
                        camera.updateProjectionMatrix();
                        renderer.setSize(width, height);
                    }
                }
            }
        });
        resizeObserver.observe(container);
    }

    function drawEmptyContainer(L, W, H) {
        if (!scene) return;
        if(containerBox) scene.remove(containerBox);
        cargoMeshes.forEach(m => scene.remove(m));
        cargoMeshes = [];

        // Inner Volume visualization
        const geometry = new THREE.BoxGeometry(L, H, W);
        const edges = new THREE.EdgesGeometry(geometry);
        containerBox = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x6366f1, linewidth: 2, transparent: true, opacity: 0.5 }));
        
        // Add faint floor for the container
        const floorGeo = new THREE.PlaneGeometry(L, W);
        const floorMat = new THREE.MeshBasicMaterial({ color: 0x312e81, side: THREE.DoubleSide, transparent: true, opacity: 0.2 });
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.rotation.x = Math.PI / 2;
        floorMesh.position.y = -H/2;
        containerBox.add(floorMesh);

        containerBox.position.set(0, H/2, 0);
        scene.add(containerBox);
    }

    function addBox(x, y, z, l, h, w, colorCode, contL, contW, contH) {
        if (!scene) return;
        const geo = new THREE.BoxGeometry(l, h, w);
        const mat = new THREE.MeshLambertMaterial({ color: colorCode, transparent: true, opacity: 0.95 });
        const mesh = new THREE.Mesh(geo, mat);
        
        const edgeGeo = new THREE.EdgesGeometry(geo);
        const wireframe = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3 }));
        mesh.add(wireframe);

        // Center transformation
        mesh.position.set(-contL/2 + x + l/2, y + h/2, -contW/2 + z + w/2);
        scene.add(mesh);
        cargoMeshes.push(mesh);
    }

    // Packing Algorithm & Trigger
    if(simBtn) simBtn.addEventListener('click', () => {
        if(!isInitialized) {
            alert("WebGL Engine is still initializing. Please wait a moment.");
            return;
        }

        simBtn.innerHTML = `<div class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> Calculating...`;
        
        setTimeout(() => {
            const contType = document.getElementById('container-type').value;
            let C_L = 590, C_W = 235, C_H = 239; // 20ft
            if(contType === '40ft') { C_L = 1200; C_W = 235; C_H = 239; }
            if(contType === '40hc') { C_L = 1200; C_W = 235; C_H = 269; }

            drawEmptyContainer(C_L, C_W, C_H);

            let itemsToPack = [];
            for(let i=0; i<cargoId; i++) {
                const nameEl = document.getElementById(`c-name-${i}`);
                if(!nameEl) continue;
                const l = parseFloat(document.getElementById(`c-l-${i}`).value) || 0;
                const w = parseFloat(document.getElementById(`c-w-${i}`).value) || 0;
                const h = parseFloat(document.getElementById(`c-h-${i}`).value) || 0;
                const q = parseInt(document.getElementById(`c-q-${i}`).value) || 0;
                
                if(l > 0 && w > 0 && h > 0 && q > 0) {
                    for(let j=0; j<q; j++) {
                        itemsToPack.push({ label: nameEl.value, l, w, h, color: colors[i % colors.length] });
                    }
                }
            }

            // Sort by largest volume first (Heuristic)
            itemsToPack.sort((a,b) => (b.l*b.w*b.h) - (a.l*a.w*a.h));

            class Packer {
                constructor(L, W, H) {
                    this.spaces = [{x:0, y:0, z:0, l:L, w:W, h:H}];
                    this.packed = [];
                }
                pack(box) {
                    // Try to pack as low, deep, and left as possible
                    this.spaces.sort((a, b) => (a.y - b.y) || (a.z - b.z) || (a.x - b.x));
                    
                    for (let i = 0; i < this.spaces.length; i++) {
                        let s = this.spaces[i];
                        
                        // Allowed rotations (upright)
                        let rots = [
                            {l: box.l, w: box.w, h: box.h},
                            {l: box.w, w: box.l, h: box.h}
                        ];
                        
                        for (let rot of rots) {
                            if (rot.l <= s.l && rot.w <= s.w && rot.h <= s.h) {
                                this.packed.push({x:s.x, y:s.y, z:s.z, l:rot.l, w:rot.w, h:rot.h, color:box.color});
                                this.spaces.splice(i, 1);
                                
                                // Guillotine split
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
            let totalPackedVol = 0;
            
            itemsToPack.forEach(item => { 
                if(packer.pack(item)) totalPackedVol += (item.l*item.w*item.h); 
            });

            // Animate packing presentation
            packer.packed.forEach((p, index) => {
                setTimeout(() => {
                    addBox(p.x, p.y, p.z, p.l, p.h, p.w, p.color, C_L, C_W, C_H);
                }, index * 20); // 20ms delay per box for satisfying visual effect
            });

            const summary = document.getElementById('packing-summary');
            if(summary) {
                summary.classList.remove('hidden');
                document.getElementById('vol-util').innerText = ((totalPackedVol / (C_L*C_W*C_H)) * 100).toFixed(1) + '%';
                const countEl = document.getElementById('packed-count');
                countEl.innerText = `${packer.packed.length}/${itemsToPack.length}`;
                if(packer.packed.length < itemsToPack.length) {
                    countEl.classList.add('text-red-500');
                    countEl.classList.remove('text-emerald-600');
                } else {
                    countEl.classList.remove('text-red-500');
                    countEl.classList.add('text-emerald-600');
                }
            }
            
            // Reset Camera optimally based on container
            camera.position.set(C_L * 1.2, C_H + 1000, C_W + 1500);
            controls.target.set(0, C_H/2, 0);
            controls.update();

            simBtn.innerHTML = `<span>Execute Simulation</span><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>`;

        }, 50); // slight delay to allow UI spinner to show
    });
});