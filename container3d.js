// container3d.js
document.addEventListener('DOMContentLoaded', () => {
    // 1. Tab Switching Logic
    const tabAnalyzer = document.getElementById('tab-analyzer');
    const tabPlanner = document.getElementById('tab-planner');
    const viewAnalyzer = document.getElementById('analyzer');
    const viewPlanner = document.getElementById('planner');
    const howItWorks = document.getElementById('how-it-works');

    if(!tabAnalyzer || !tabPlanner) return;

    tabAnalyzer.addEventListener('click', (e) => {
        e.preventDefault();
        viewAnalyzer.style.display = 'block';
        if(howItWorks) howItWorks.style.display = 'block';
        viewPlanner.style.display = 'none';
        tabAnalyzer.className = "text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1";
        tabPlanner.className = "text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors pb-1";
    });

    tabPlanner.addEventListener('click', (e) => {
        e.preventDefault();
        viewAnalyzer.style.display = 'none';
        if(howItWorks) howItWorks.style.display = 'none';
        viewPlanner.style.display = 'block';
        tabPlanner.className = "text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1";
        tabAnalyzer.className = "text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors pb-1";
        initThreeJS(); // Initialize on first show
    });

    // 2. Cargo Items UI Logic
    const cargoContainer = document.getElementById('cargo-items');
    const addBtn = document.getElementById('add-cargo-btn');
    const simBtn = document.getElementById('simulate-load-btn');
    
    let cargoId = 0;
    const colors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0x8b5cf6, 0xec4899, 0x14b8a6];

    function addCargoRow() {
        const id = cargoId++;
        const div = document.createElement('div');
        div.className = 'grid grid-cols-6 gap-2 items-center bg-gray-50 p-2 rounded-lg border border-gray-100';
        div.innerHTML = `
            <input type="text" placeholder="Item" class="col-span-2 text-xs py-1 px-2 border rounded border-gray-200" value="Cargo ${id+1}" id="c-name-${id}">
            <input type="number" placeholder="L(cm)" class="col-span-1 text-xs py-1 px-1 border rounded border-gray-200" value="100" id="c-l-${id}">
            <input type="number" placeholder="W(cm)" class="col-span-1 text-xs py-1 px-1 border rounded border-gray-200" value="100" id="c-w-${id}">
            <input type="number" placeholder="H(cm)" class="col-span-1 text-xs py-1 px-1 border rounded border-gray-200" value="100" id="c-h-${id}">
            <div class="col-span-1 flex gap-1">
                <input type="number" placeholder="Qty" class="w-full text-xs py-1 px-1 border rounded border-gray-200" value="10" id="c-q-${id}">
                <button class="text-red-500 font-bold px-1 hover:text-red-700" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        cargoContainer.appendChild(div);
    }
    
    if(addBtn) addBtn.addEventListener('click', addCargoRow);
    if(cargoContainer) addCargoRow(); // Add first row default

    // 3. Three.js Setup & Simulation
    let scene, camera, renderer, controls;
    let isInitialized = false;

    function initThreeJS() {
        if (isInitialized) return;
        const container = document.getElementById('canvas-container');
        if(!container) return;
        document.getElementById('canvas-placeholder').style.display = 'none';
        
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111827); // Dark background for better visibility

        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 20000);
        camera.position.set(1200, 800, 1500);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
        dirLight.position.set(1000, 2000, 1000);
        scene.add(dirLight);

        // Add Grid
        const gridHelper = new THREE.GridHelper(3000, 30, 0x444444, 0x222222);
        gridHelper.position.y = -1; // slightly below container bottom
        scene.add(gridHelper);

        window.addEventListener('resize', () => {
            if(!container || viewPlanner.style.display === 'none') return;
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        const animate = function () {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        animate();
        isInitialized = true;
        
        drawEmptyContainer(1200, 235, 239); // Default 40ft
    }
    
    let containerBox = null;
    let cargoMeshes = [];

    function drawEmptyContainer(L, W, H) {
        if(containerBox) scene.remove(containerBox);
        cargoMeshes.forEach(m => scene.remove(m));
        cargoMeshes = [];

        const geometry = new THREE.BoxGeometry(L, H, W);
        const edges = new THREE.EdgesGeometry(geometry);
        containerBox = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x6366f1, linewidth: 2 }));
        
        // Position so bottom center is at 0,0,0
        containerBox.position.set(0, H/2, 0);
        scene.add(containerBox);
    }

    function addBox(x, y, z, l, h, w, colorCode, contL, contW, contH) {
        const geo = new THREE.BoxGeometry(l, h, w);
        const mat = new THREE.MeshLambertMaterial({ color: colorCode, transparent: true, opacity: 0.95 });
        const mesh = new THREE.Mesh(geo, mat);
        
        // Edge lines for the box
        const edgeGeo = new THREE.EdgesGeometry(geo);
        const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
        const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
        mesh.add(wireframe);

        // Transform coordinates (packer uses bottom-back-left = 0,0,0)
        // ThreeJS Box is centered.
        // Container center is at 0, H/2, 0. Bottom-back-left is at -L/2, 0, -W/2.
        
        mesh.position.set(
            -contL/2 + x + l/2,
            y + h/2,
            -contW/2 + z + w/2
        );

        scene.add(mesh);
        cargoMeshes.push(mesh);
    }

    if(simBtn) simBtn.addEventListener('click', () => {
        if(!isInitialized) initThreeJS();
        
        const contType = document.getElementById('container-type').value;
        // L, W, H in cm
        let C_L = 590, C_W = 235, C_H = 239; // 20ft default
        if(contType === '40ft') { C_L = 1200; C_W = 235; C_H = 239; }
        if(contType === '40hc') { C_L = 1200; C_W = 235; C_H = 269; }

        drawEmptyContainer(C_L, C_W, C_H);

        // Gather Items
        let itemsToPack = [];
        for(let i=0; i<cargoId; i++) {
            const nameEl = document.getElementById(`c-name-${i}`);
            if(!nameEl) continue; // row was deleted
            const l = parseFloat(document.getElementById(`c-l-${i}`).value) || 0;
            const w = parseFloat(document.getElementById(`c-w-${i}`).value) || 0;
            const h = parseFloat(document.getElementById(`c-h-${i}`).value) || 0;
            const q = parseInt(document.getElementById(`c-q-${i}`).value) || 0;
            const color = colors[i % colors.length];

            if(l > 0 && w > 0 && h > 0 && q > 0) {
                for(let j=0; j<q; j++) {
                    itemsToPack.push({ label: nameEl.value, l, w, h, color, vol: l*w*h });
                }
            }
        }

        // Sort by Volume descending
        itemsToPack.sort((a,b) => b.vol - a.vol);

        class Packer {
            constructor(L, W, H) {
                this.spaces = [{x:0, y:0, z:0, l:L, w:W, h:H}];
                this.packed = [];
            }
            pack(box) {
                // Sort spaces to favor bottom, then back, then left
                this.spaces.sort((a, b) => {
                    if (Math.abs(a.y - b.y) > 0.1) return a.y - b.y; 
                    if (Math.abs(a.z - b.z) > 0.1) return a.z - b.z; 
                    return a.x - b.x; 
                });

                for (let i = 0; i < this.spaces.length; i++) {
                    let space = this.spaces[i];
                    // Try orientations (keeping H upright)
                    let rots = [
                        {l: box.l, w: box.w, h: box.h}, // Normal
                        {l: box.w, w: box.l, h: box.h}, // Rotated
                    ];
                    
                    for (let rot of rots) {
                        if (rot.l <= space.l && rot.w <= space.w && rot.h <= space.h) {
                            let node = {x: space.x, y: space.y, z: space.z, l: rot.l, w: rot.w, h: rot.h, color: box.color};
                            this.packed.push(node);
                            this.spaces.splice(i, 1); // remove used space
                            
                            // Guillotine split (3 new spaces)
                            if (space.h - rot.h > 0) {
                                this.spaces.push({x: space.x, y: space.y + rot.h, z: space.z, l: rot.l, w: rot.w, h: space.h - rot.h});
                            }
                            if (space.l - rot.l > 0) {
                                this.spaces.push({x: space.x + rot.l, y: space.y, z: space.z, l: space.l - rot.l, w: space.w, h: space.h});
                            }
                            if (space.w - rot.w > 0) {
                                this.spaces.push({x: space.x, y: space.y, z: space.z + rot.w, l: rot.l, w: space.w - rot.w, h: space.h});
                            }
                            
                            return true; // successfully packed
                        }
                    }
                }
                return false; // could not pack
            }
        }

        const packer = new Packer(C_L, C_W, C_H);
        let packedCount = 0;
        let totalVolPacked = 0;

        itemsToPack.forEach(item => {
            if(packer.pack(item)) {
                packedCount++;
                totalVolPacked += item.vol;
            }
        });

        // Render packed
        packer.packed.forEach(p => {
            addBox(p.x, p.y, p.z, p.l, p.h, p.w, p.color, C_L, C_W, C_H);
        });

        // Update UI
        const summary = document.getElementById('packing-summary');
        if(summary) {
            summary.style.display = 'block';
            const contVol = C_L * C_W * C_H;
            document.getElementById('vol-util').innerText = ((totalVolPacked / contVol) * 100).toFixed(1) + '%';
            document.getElementById('packed-count').innerText = `${packedCount} / ${itemsToPack.length}`;
            
            if(packedCount < itemsToPack.length) {
                document.getElementById('packed-count').classList.add('text-red-500');
            } else {
                document.getElementById('packed-count').classList.remove('text-red-500');
            }
        }
        
        // Reset Camera
        camera.position.set(C_L * 0.8, C_H + 800, C_W + 1200);
        controls.target.set(0, C_H/2, 0);
        controls.update();
    });
});