const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
    'index.html', 'planner.html', 'news.html', 'about.html',
    'main.js', 'container3d.js', 'news.js', 'style.css'
];

const CHECKS = [
    {
        file: 'index.html',
        elements: ['map', 'summary-container', 'shipping-form', 'origin-search'],
        scripts: ['main.js']
    },
    {
        file: 'planner.html',
        elements: ['canvas-container', 'simulate-load-btn', 'cargo-items'],
        scripts: ['container3d.js', 'three.min.js']
    },
    {
        file: 'news.html',
        elements: ['news-items', 'category-filters'],
        scripts: ['news.js']
    }
];

let errors = [];

console.log("🔍 Starting Pre-Push Validation...\n");

// 1. Check for file existence
REQUIRED_FILES.forEach(f => {
    if (!fs.existsSync(f)) errors.push(`❌ Missing File: ${f}`);
});

// 2. Check for UI integrity and script linking
CHECKS.forEach(check => {
    if (!fs.existsSync(check.file)) return;
    const content = fs.readFileSync(check.file, 'utf8');
    
    check.elements.forEach(el => {
        if (!content.includes(`id="${el}"`) && !content.includes(`id='${el}'`)) {
            errors.push(`❌ Integrity Error in ${check.file}: Missing essential element ID "${el}"`);
        }
    });

    check.scripts.forEach(s => {
        if (!content.includes(s)) {
            errors.push(`❌ Linking Error in ${check.file}: Script "${s}" is not referenced`);
        }
    });
});

// 3. Check for leftover Korean in JS logic (Optional but relevant to your request)
const jsFiles = ['main.js', 'news.js', 'container3d.js'];
jsFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    const content = fs.readFileSync(f, 'utf8');
    if (content.includes('toLocaleDateString("ko-KR")') || content.includes("'ko'")) {
        // Warning only, as some comments might exist
        console.log(`⚠️ Warning in ${f}: Potential leftover Korean localization detected.`);
    }
});

if (errors.length > 0) {
    console.error("⛔ VALIDATION FAILED:");
    errors.forEach(err => console.error(err));
    process.exit(1);
} else {
    console.log("✅ ALL SYSTEMS OPERATIONAL. READY TO PUSH.");
    process.exit(0);
}
