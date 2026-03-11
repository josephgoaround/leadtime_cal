// news.js - Specialized Engine for Logistics News Feed
document.addEventListener('DOMContentLoaded', () => {
    const translations = {
        en: {
            navAnalyzer: "Analyzer", navPlanner: "3D Load Planner", navNews: "Logistics News", navAbout: "About",
            pageTitle: "Logistics Risk & News",
            pageDesc: "Real-time updates on global maritime bottlenecks and SCM intelligence.",
            readMore: "Read Original Article",
            sourceLabel: "Source",
            allCategories: "All Categories",
            maritime: "Maritime",
            customs: "Customs",
            disruption: "Disruption",
            noNews: "No news found for the selected category."
        },
        ko: {
            navAnalyzer: "분석기", navPlanner: "3D 적재 플래너", navNews: "물류 뉴스", navAbout: "소개",
            pageTitle: "물류 리스크 및 뉴스",
            pageDesc: "글로벌 해운 병목 현상 및 SCM 인텔리전스 실시간 업데이트.",
            readMore: "원문 기사 읽기",
            sourceLabel: "출처",
            allCategories: "모든 카테고리",
            maritime: "해운",
            customs: "통관",
            disruption: "운항 지연",
            noNews: "선택한 카테고리에 뉴스가 없습니다."
        }
    };

    let currentLang = localStorage.getItem('selectedLang') || 'en';
    const newsGrid = document.getElementById('news-grid');
    const categoryFilters = document.getElementById('category-filters');

    function updateLanguageUI() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
        });
        
        // Sync with buttons
        document.getElementById('lang-ko').className = currentLang === 'ko' ? "px-3 py-1.5 rounded-md text-xs font-bold bg-indigo-600 text-white shadow-sm" : "px-3 py-1.5 rounded-md text-xs font-bold bg-white border border-slate-200 text-slate-600";
        document.getElementById('lang-en').className = currentLang === 'en' ? "px-3 py-1.5 rounded-md text-xs font-bold bg-indigo-600 text-white shadow-sm" : "px-3 py-1.5 rounded-md text-xs font-bold bg-white border border-slate-200 text-slate-600";
        
        loadNews(); // Re-render news with new language
    }

    async function loadNews(category = 'all') {
        if (!newsGrid) return;
        newsGrid.innerHTML = '<div class="col-span-full text-center py-20 animate-pulse text-slate-400 font-bold">Loading Intelligence...</div>';

        try {
            const response = await fetch('data/news.json');
            const news = await response.json();
            
            const filteredNews = category === 'all' ? news : news.filter(n => n.category === category);
            
            if (filteredNews.length === 0) {
                newsGrid.innerHTML = `<div class="col-span-full text-center py-20 text-slate-400 font-bold">${translations[currentLang].noNews}</div>`;
                return;
            }

            newsGrid.innerHTML = filteredNews.map(item => `
                <article class="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-indigo-50/50 overflow-hidden group hover:border-indigo-200 transition-all flex flex-col">
                    <div class="p-8 flex-1">
                        <div class="flex items-center justify-between mb-4">
                            <span class="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">${currentLang === 'ko' ? (translations.ko[item.category] || item.category) : item.category}</span>
                            <span class="text-[10px] font-bold text-slate-300 uppercase">${item.date}</span>
                        </div>
                        <h3 class="text-xl font-black text-slate-800 mb-4 leading-tight group-hover:text-indigo-600 transition-colors">
                            ${currentLang === 'ko' && item.titleKo ? item.titleKo : item.title}
                        </h3>
                        <p class="text-sm text-slate-500 leading-relaxed font-medium mb-6">
                            ${currentLang === 'ko' && item.summaryKo ? item.summaryKo : item.summary}
                        </p>
                    </div>
                    <div class="px-8 pb-8">
                        <div class="flex items-center justify-between pt-6 border-t border-slate-50">
                            <div class="flex flex-col">
                                <span class="text-[9px] font-black text-slate-300 uppercase tracking-tighter">${translations[currentLang].sourceLabel}</span>
                                <span class="text-xs font-bold text-slate-700">${item.source}</span>
                            </div>
                            <a href="${item.url}" target="_blank" class="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </a>
                        </div>
                    </div>
                </article>
            `).join('');
        } catch (e) {
            console.error("News Load Failed:", e);
        }
    }

    // EVENT LISTENERS
    if(document.getElementById('lang-ko')) document.getElementById('lang-ko').onclick = () => { currentLang='ko'; localStorage.setItem('selectedLang', 'ko'); updateLanguageUI(); };
    if(document.getElementById('lang-en')) document.getElementById('lang-en').onclick = () => { currentLang='en'; localStorage.setItem('selectedLang', 'en'); updateLanguageUI(); };

    if(categoryFilters) {
        categoryFilters.querySelectorAll('button').forEach(btn => {
            btn.onclick = () => {
                categoryFilters.querySelectorAll('button').forEach(b => b.classList.replace('bg-indigo-600', 'bg-white'));
                categoryFilters.querySelectorAll('button').forEach(b => b.classList.replace('text-white', 'text-slate-600'));
                btn.classList.replace('bg-white', 'bg-indigo-600');
                btn.classList.replace('text-slate-600', 'text-white');
                loadNews(btn.getAttribute('data-category'));
            };
        });
    }

    updateLanguageUI();
});