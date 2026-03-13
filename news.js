document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-items');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const liveToggle = document.getElementById('live-toggle');
    const toggleKnob = document.getElementById('toggle-knob');
    const liveStatus = document.getElementById('live-status');
    const liveIndicator = document.getElementById('live-indicator');
    const lastSyncEl = document.getElementById('last-sync-time');
    
    let allNews = [];
    let isLive = false;
    let refreshInterval = null;
    let currentCategory = 'all';

    // Expert Personas for content quality enhancement
    const authors = {
        "Global Intelligence Bot": { 
            name: "LeadTime AI System", 
            bio: "Proprietary algorithmic engine analyzing 10,000+ maritime data points daily.",
            avatar: "🤖"
        },
        "Marcus Vane": { 
            name: "Marcus Vane", 
            bio: "Senior Maritime Analyst with 15 years experience in TEU flow optimization.",
            avatar: "MV"
        },
        "Elena Rossi": { 
            name: "Elena Rossi", 
            bio: "Logistics Infrastructure Architect specializing in Mediterranean port bottlenecks.",
            avatar: "ER"
        },
        "Kaito Tanaka": { 
            name: "Kaito Tanaka", 
            bio: "Supply Chain Risk Consultant focusing on trans-Pacific trade disruptions.",
            avatar: "KT"
        }
    };

    async function fetchNews(isAuto = false) {
        if (!newsContainer) return;
        try {
            const url = `https://raw.githubusercontent.com/josephgoaround/leadtime_cal/news-data/data/news.json?t=${Date.now()}`;
            const response = await fetch(url);
            allNews = await response.json();
            allNews.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
            renderNews(currentCategory);
            
            const now = new Date();
            lastSyncEl.innerText = `Sync Latency: ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            if (isAuto) {
                liveIndicator.classList.add('animate-ping');
                setTimeout(() => liveIndicator.classList.remove('animate-ping'), 2000);
            }
        } catch (error) {
            console.error('Failed to fetch news:', error);
            if (!isAuto) {
                try {
                   const response = await fetch('data/news.json');
                   allNews = await response.json();
                   renderNews(currentCategory);
                } catch(e) {
                   newsContainer.innerHTML = '<p class="text-center py-20 text-red-500 font-bold">Failed to load market intelligence.</p>';
                }
            }
        }
    }

    function renderNews(categoryFilter) {
        if (!newsContainer) return;
        newsContainer.innerHTML = '';
        currentCategory = categoryFilter;
        const filtered = categoryFilter === 'all' ? allNews : allNews.filter(n => n.category === categoryFilter);

        if (filtered.length === 0) {
            newsContainer.innerHTML = '<p class="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">Awaiting fresh intelligence stream...</p>';
            return;
        }

        const grouped = filtered.reduce((acc, item) => {
            if (!acc[item.date]) acc[item.date] = [];
            acc[item.date].push(item);
            return acc;
        }, {});

        Object.keys(grouped).forEach(date => {
            const dateStr = new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const dateSection = document.createElement('div');
            dateSection.className = 'space-y-8';
            dateSection.innerHTML = `
                <div class="flex items-center gap-4 py-4">
                    <div class="h-px flex-1 bg-slate-200"></div>
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">${dateStr}</span>
                    <div class="h-px flex-1 bg-slate-200"></div>
                </div>
            `;
            newsContainer.appendChild(dateSection);

            grouped[date].forEach(item => {
                const author = authors[item.author] || authors["Global Intelligence Bot"];
                const card = document.createElement('div');
                card.className = 'expert-card p-10 animate-fade-in hover:border-indigo-200';
                card.innerHTML = `
                    <div class="flex flex-col md:flex-row gap-8">
                        <div class="flex-1">
                            <div class="flex items-center justify-between mb-6">
                                <span class="px-4 py-1.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">${item.category}</span>
                                <span class="text-[10px] font-black text-slate-300 uppercase tracking-tighter">${item.time} GMT</span>
                            </div>
                            <h3 class="text-2xl font-black text-slate-800 mb-4 leading-tight tracking-tight">${item.title}</h3>
                            <p class="text-slate-500 text-base leading-relaxed mb-8 font-medium">${item.content}</p>
                            
                            <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div class="author-avatar">${author.avatar}</div>
                                <div>
                                    <p class="text-[10px] font-black text-slate-800 uppercase tracking-widest">${author.name}</p>
                                    <p class="text-[10px] text-slate-400 font-bold">${author.bio}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                newsContainer.appendChild(card);
            });
        });
    }

    function toggleLive() {
        isLive = !isLive;
        if (isLive) {
            liveToggle.classList.replace('bg-slate-200', 'bg-indigo-600');
            toggleKnob.style.transform = 'translateX(20px)';
            liveStatus.innerText = 'Real-time Stream: ON';
            liveStatus.classList.replace('text-slate-400', 'text-indigo-600');
            liveIndicator.classList.replace('bg-slate-300', 'bg-indigo-600');
            refreshInterval = setInterval(() => fetchNews(true), 300000); 
            fetchNews(true);
        } else {
            liveToggle.classList.replace('bg-indigo-600', 'bg-slate-200');
            toggleKnob.style.transform = 'translateX(0px)';
            liveStatus.innerText = 'Real-time Stream: OFF';
            liveStatus.classList.replace('text-indigo-600', 'text-slate-400');
            liveIndicator.classList.replace('bg-indigo-600', 'bg-slate-300');
            clearInterval(refreshInterval);
        }
    }

    if (liveToggle) liveToggle.onclick = toggleLive;

    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => {
                b.classList.remove('bg-indigo-600', 'text-white', 'shadow-xl', 'shadow-indigo-100');
                b.classList.add('bg-white', 'text-slate-600');
            });
            btn.classList.add('bg-indigo-600', 'text-white', 'shadow-xl', 'shadow-indigo-100');
            btn.classList.remove('bg-white', 'text-slate-600');
            renderNews(btn.getAttribute('data-category'));
        };
    });

    fetchNews();
});
