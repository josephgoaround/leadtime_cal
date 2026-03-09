// container3d.js
document.addEventListener('DOMContentLoaded', () => {
    const tabAnalyzer = document.getElementById('tab-analyzer');
    const tabPlanner = document.getElementById('tab-planner');
    const viewAnalyzer = document.getElementById('analyzer');
    const viewPlanner = document.getElementById('planner');

    if(!tabAnalyzer || !tabPlanner) return;

    function switchTab(showPlanner) {
        if (showPlanner) {
            viewAnalyzer.classList.add('hidden');
            viewPlanner.classList.remove('hidden');
            tabPlanner.className = "text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1";
            tabAnalyzer.className = "text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors pb-1";
            
            // Give browser time to paint layout
            setTimeout(() => {
                if (!isInitialized) {
                    initThreeJS();
                } else {
                    onWindowResize();
                }
            }, 300);
        } else {
            viewPlanner.classList.add('hidden');
            viewAnalyzer.classList.remove('hidden');
            tabAnalyzer.className = "text-sm font-bold text-indigo-600 border-b-2 border-indigo-600 pb-1";
            tabPlanner.className = "text-sm font-bold text-gray-500 hover:text-indigo-600 transition-colors pb-1";
        }
    }

    tabAnalyzer.addEventListener('click', (e) => { e.preventDefault(); switchTab(false); });
    tabPlanner.addEventListener('click', (e) => { e.preventDefault(); switchTab(true); });

    // Cargo Input Logic
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
            <input type="text" placeholder="Name" class="col-span-2 text-[10px] py-1 px-2 border rounded border-gray-200" value="Item ${id+1}" id="c-name-${id}">
            <input type="number" placeholder="L" class="col-span-1 text-[10px] py-1 px-1 border rounded border-gray-200" value="100" id="c-l-${id}">
            <input type="number" placeholder="W" class="col-span-1 text-[10px] py-1 px-1 border rounded border-gray-200" value="100" id="c-w-${id}">
            <input type="number" placeholder="H" class="col-span-1 text-[10px] py-1 px-1 border rounded border-gray-200" value="100" id="c-h-${id}">
            <div class="col-span-1 flex gap-1">
                <input type="number" placeholder="Q" class="w-full text-[10px] py-1 px-1 border rounded border-gray-200" value="10" id="c-q-${id}">
                <button class="text-red-500 font-bold px-1" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        cargoContainer.appendChild(div);
    }
    
    if(addBtn) addBtn.addEventListener('click', addCargoRow);
    addCargoRow();

    // Three.js Engine
    let scene, camera, renderer, controls;
    let isInitialized = false;

    function initThreeJS() {
        const container = document.getElementById('canvas-container');
        if(!container || container.clientWidth <= 0) return;
        
        try {
            const placeholder = document.getElementById('canvas-placeholder');
            if(placeholder) placeholder.style.display = 'none';
            
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0f172a);

            camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 20000);
            camera.position.set(2500, 1800, 3000);

            renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            container.appendChild(renderer.domElement);

            if (THREE.OrbitControls) {
                controls = new THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
            }

            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            const light = new THREE.DirectionalLight(0xffffff, 0.6);
            light.position.set(2000, 3000, 1000);
            scene.add(light);

            const grid = new THREE.GridHelper(5000, 50, 0x334155, 0x1e293b);
            grid.position.y = -1;
            scene.add(grid);

            window.addEventListener('resize', onWindowResize);

            const animate = function () {
                requestAnimationFrame(animate);
                if (controls) controls.update();
                renderer.render(scene, camera);
            };
            animate();
            isInitialized = true;
            
            drawEmptyContainer(1200, 235, 239);
            console.log("3D Engine Ready");
        } catch (e) {
            console.error("3D Error:", e);
            alert("WebGL is not supported or encountered an error.");
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
        const wireframe = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 }));
        mesh.add(wireframe);

        mesh.position.set(-contL/2 + x + l/2, y + h/2, -contW/2 + z + w/2);
        scene.add(mesh);
        cargoMeshes.push(mesh);
    }

    if(simBtn) simBtn.addEventListener('click', () => {
        if(!isInitialized) initThreeJS();
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
            const l = parseFloat(document.getElementById(`c-l-${i}`).value) || 0;
            const w = parseFloat(document.getElementById(`c-w-${i}`).value) || 0;
            const h = parseFloat(document.getElementById(`c-h-${i}`).value) || 0;
            const q = parseInt(document.getElementById(`c-q-${i}`).value) || 0;
            if(l > 0 && w > 0 && h > 0 && q > 0) {
                for(let j=0; j<q; j++) itemsToPack.push({ l, w, h, color: colors[i % colors.length] });
            }
        }

        itemsToPack.sort((a,b) => (b.l*b.w*b.h) - (a.l*a.w*a.h));

        class Packer {
            constructor(L, W, H) {
                this.spaces = [{x:0, y:0, z:0, l:L, w:W, h:H}];
                this.packed = [];
            }
            pack(box) {
                this.spaces.sort((a, b) => (a.y - b.y) || (a.z - b.z) || (a.x - b.x));
                for (let i = 0; i < this.spaces.length; i++) {
                    let s = this.spaces[i];
                    if (box.l <= s.l && box.w <= s.w && box.h <= s.h) {
                        this.packed.push({x:s.x, y:s.y, z:s.z, l:box.l, w:box.w, h:box.h, color:box.color});
                        this.spaces.splice(i, 1);
                        if (s.h - box.h > 0) this.spaces.push({x:s.x, y:s.y + box.h, z:s.z, l:box.l, w:box.w, h:s.h - box.h});
                        if (s.l - box.l > 0) this.spaces.push({x:s.x + box.l, y:s.y, z:s.z, l:s.l - box.l, w:s.w, h:s.h});
                        if (s.w - box.w > 0) this.spaces.push({x:s.x, y:s.y, z:s.z + box.w, l:box.l, w:s.w - box.w, h:s.h});
                        return true;
                    }
                }
                return false;
            }
        }

        const packer = new Packer(C_L, C_W, C_H);
        let totalPackedVol = 0;
        itemsToPack.forEach(item => { if(packer.pack(item)) totalPackedVol += (item.l*item.w*item.h); });

        packer.packed.forEach(p => addBox(p.x, p.y, p.z, p.l, p.h, p.w, p.color, C_L, C_W, C_H));

        const summary = document.getElementById('packing-summary');
        if(summary) {
            summary.classList.remove('hidden');
            document.getElementById('vol-util').innerText = ((totalPackedVol / (C_L*C_W*C_H)) * 100).toFixed(1) + '%';
            document.getElementById('packed-count').innerText = `${packer.packed.length} / ${itemsToPack.length}`;
        }
        
        camera.position.set(C_L * 1.5, C_H + 1500, C_W + 2000);
        controls.target.set(0, C_H/2, 0);
        controls.update();
    });
});