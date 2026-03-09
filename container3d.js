// container3d.js
document.addEventListener('DOMContentLoaded', () => {
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
        viewPlanner.classList.add('hidden');
        tabAnalyzer.className = "text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1";
        tabPlanner.className = "text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors pb-1";
    });

    tabPlanner.addEventListener('click', (e) => {
        e.preventDefault();
        viewAnalyzer.style.display = 'none';
        if(howItWorks) howItWorks.style.display = 'none';
        viewPlanner.classList.remove('hidden');
        tabPlanner.className = "text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1";
        tabAnalyzer.className = "text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors pb-1";
        
        // CRITICAL: Wait for CSS display:block to take effect so clientWidth/Height are not 0
        setTimeout(() => {
            if (!isInitialized) {
                initThreeJS();
            } else {
                onWindowResize(); // Force resize to match the newly visible container
            }
        }, 200);
    });

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
            <input type="text" placeholder="Item" class="col-span-2 text-[10px] py-1 px-2 border rounded border-gray-200" value="Item ${id+1}" id="c-name-${id}">
            <input type="number" placeholder="L" class="col-span-1 text-[10px] py-1 px-1 border rounded border-gray-200" value="100" id="c-l-${id}">
            <input type="number" placeholder="W" class="col-span-1 text-[10px] py-1 px-1 border rounded border-gray-200" value="100" id="c-w-${id}">
            <input type="number" placeholder="H" class="col-span-1 text-[10px] py-1 px-1 border rounded border-gray-200" value="100" id="c-h-${id}">
            <div class="col-span-1 flex gap-1">
                <input type="number" placeholder="Q" class="w-full text-[10px] py-1 px-1 border rounded border-gray-200" value="10" id="c-q-${id}">
                <button class="text-red-500 font-bold px-1 hover:text-red-700" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        cargoContainer.appendChild(div);
    }
    
    if(addBtn) addBtn.addEventListener('click', addCargoRow);
    if(cargoContainer) addCargoRow();

    let scene, camera, renderer, controls;
    let isInitialized = false;

    function initThreeJS() {
        const container = document.getElementById('canvas-container');
        if(!container || container.clientWidth === 0) {
            console.warn("Container not ready, retrying...");
            return;
        }
        
        try {
            const placeholder = document.getElementById('canvas-placeholder');
            if(placeholder) placeholder.style.display = 'none';
            
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0f172a);

            const aspect = container.clientWidth / container.clientHeight;
            camera = new THREE.PerspectiveCamera(45, aspect, 1, 20000);
            camera.position.set(2000, 1500, 2500);

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            // OrbitControls might be attached to THREE or global
            const OrbitControls = window.THREE.OrbitControls || THREE.OrbitControls;
            if (OrbitControls) {
                controls = new OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
            }

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            scene.add(ambientLight);
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
            dirLight.position.set(2000, 3000, 1000);
            scene.add(dirLight);

            const gridHelper = new THREE.GridHelper(5000, 50, 0x334155, 0x1e293b);
            gridHelper.position.y = -1;
            scene.add(gridHelper);

            window.addEventListener('resize', onWindowResize);

            const animate = function () {
                requestAnimationFrame(animate);
                if (controls) controls.update();
                renderer.render(scene, camera);
            };
            animate();
            isInitialized = true;
            
            drawEmptyContainer(1200, 235, 239); // 40ft initial
            console.log("3D Engine Initialized Successfully");
        } catch (e) {
            console.error("Three.js Init Error:", e);
            document.getElementById('canvas-placeholder').innerHTML = `<p class="text-red-500 font-bold">Failed to load 3D Engine: ${e.message}</p>`;
        }
    }

    function onWindowResize() {
        const container = document.getElementById('canvas-container');
        if(!container || !isInitialized) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }
    
    let containerBox = null;
    let cargoMeshes = [];

    function drawEmptyContainer(L, W, H) {
        if(containerBox) scene.remove(containerBox);
        cargoMeshes.forEach(m => scene.remove(m));
        cargoMeshes = [];

        const geometry = new THREE.BoxGeometry(L, H, W);
        const edges = new THREE.EdgesGeometry(geometry);
        containerBox = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2 }));
        containerBox.position.set(0, H/2, 0);
        scene.add(containerBox);
    }

    function addBox(x, y, z, l, h, w, colorCode, contL, contW, contH) {
        const geo = new THREE.BoxGeometry(l, h, w);
        const mat = new THREE.MeshLambertMaterial({ color: colorCode, transparent: true, opacity: 0.85 });
        const mesh = new THREE.Mesh(geo, mat);
        
        const edgeGeo = new THREE.EdgesGeometry(geo);
        const edgeMat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1, transparent: true, opacity: 0.2 });
        const wireframe = new THREE.LineSegments(edgeGeo, edgeMat);
        mesh.add(wireframe);

        mesh.position.set(-contL/2 + x + l/2, y + h/2, -contW/2 + z + w/2);
        scene.add(mesh);
        cargoMeshes.push(mesh);
    }

    if(simBtn) simBtn.addEventListener('click', () => {
        if(!isInitialized) {
            initThreeJS();
            if(!isInitialized) {
                alert("Please click the tab first to initialize the 3D view.");
                return;
            }
        }
        
        const contType = document.getElementById('container-type').value;
        let C_L = 590, C_W = 235, C_H = 239; 
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
            const color = colors[i % colors.length];

            if(l > 0 && w > 0 && h > 0 && q > 0) {
                for(let j=0; j<q; j++) {
                    itemsToPack.push({ label: nameEl.value, l, w, h, color, vol: l*w*h });
                }
            }
        }

        itemsToPack.sort((a,b) => b.vol - a.vol);

        class Packer {
            constructor(L, W, H) {
                this.spaces = [{x:0, y:0, z:0, l:L, w:W, h:H}];
                this.packed = [];
            }
            pack(box) {
                this.spaces.sort((a, b) => (a.y - b.y) || (a.z - b.z) || (a.x - b.x));
                for (let i = 0; i < this.spaces.length; i++) {
                    let space = this.spaces[i];
                    let rots = [{l: box.l, w: box.w, h: box.h}, {l: box.w, w: box.l, h: box.h}];
                    for (let rot of rots) {
                        if (rot.l <= space.l && rot.w <= space.w && rot.h <= space.h) {
                            let node = {x: space.x, y: space.y, z: space.z, l: rot.l, w: rot.w, h: rot.h, color: box.color};
                            this.packed.push(node);
                            this.spaces.splice(i, 1);
                            if (space.h - rot.h > 0) this.spaces.push({x: space.x, y: space.y + rot.h, z: space.z, l: rot.l, w: rot.w, h: space.h - rot.h});
                            if (space.l - rot.l > 0) this.spaces.push({x: space.x + rot.l, y: space.y, z: space.z, l: space.l - rot.l, w: space.w, h: space.h});
                            if (space.w - rot.w > 0) this.spaces.push({x: space.x, y: space.y, z: space.z + rot.w, l: rot.l, w: space.w - rot.w, h: space.h});
                            return true;
                        }
                    }
                }
                return false;
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

        packer.packed.forEach(p => {
            addBox(p.x, p.y, p.z, p.l, p.h, p.w, p.color, C_L, C_W, C_H);
        });

        const summary = document.getElementById('packing-summary');
        if(summary) {
            summary.classList.remove('hidden');
            const contVol = C_L * C_W * C_H;
            document.getElementById('vol-util').innerText = ((totalVolPacked / contVol) * 100).toFixed(1) + '%';
            document.getElementById('packed-count').innerText = `${packedCount} / ${itemsToPack.length}`;
        }
        
        camera.position.set(C_L * 1.5, C_H + 1500, C_W + 2000);
        controls.target.set(0, C_H/2, 0);
        controls.update();
    });
});