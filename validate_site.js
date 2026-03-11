const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
    'index.html', 'planner.html', 'news.html', 'about.html',
    'main.js', 'container3d.js', 'news.js', 'style.css'
];

const CHECKS = [
    {
        file: 'index.html',
        elements: ['map', 'summary-container', 'shipping-form'],
        scripts: ['main.js']
    },
    {
        file: 'planner.html',
        elements: ['canvas-container', 'simulate-load-btn'],
        scripts: ['container3d.js']
    }
];

let errors = [];

console.log("🔍 Running Strict Integrity Validation...\n");

// 1. Check for file existence
REQUIRED_FILES.forEach(f => {
    if (!fs.existsSync(f)) errors.push(`❌ Missing File: ${f}`);
});

// 2. DATA INTEGRITY LOCK CHECK (Critical for Hubs/Nodes)
if (fs.existsSync('main.js')) {
    const mainContent = fs.readFileSync('main.js', 'utf8');
    
    // Check for Hub counts (Must be 100+)
    const hubCount = (mainContent.match(/"sea-/g) || []).length + (mainContent.match(/"air-/g) || []).length;
    if (hubCount < 80) { // Safety margin
        errors.push(`❌ Data Integrity Failure: main.js Hub list has been truncated (${hubCount} found)`);
    }

    // Check for advanced routing logic
    if (!mainContent.includes('findMaritimePath') || !mainContent.includes('getDistHaversine')) {
        errors.push(`❌ Logic Integrity Failure: Advanced Dijkstra routing components are missing in main.js`);
    }

    // Check for English only dates
    if (mainContent.includes("'ko-KR'")) {
        errors.push(`❌ Localization Error: Korean locale detected in main.js`);
    }
}

// 3. UI Integrity
CHECKS.forEach(check => {
    if (!fs.existsSync(check.file)) return;
    const content = fs.readFileSync(check.file, 'utf8');
    check.elements.forEach(el => {
        if (!content.includes(`id="${el}"`)) errors.push(`❌ Missing Element "${el}" in ${check.file}`);
    });
});

if (errors.length > 0) {
    console.error("⛔ VALIDATION FAILED:");
    errors.forEach(err => console.error(err));
    process.exit(1);
} else {
    console.log("✅ DATA & LOGIC INTEGRITY VERIFIED. READY TO PUSH.");
    process.exit(0);
}
