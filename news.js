document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-items');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let allNews = [];

    async function fetchNews() {
        if (!newsContainer) return;
        try {
            const response = await fetch('data/news.json');
            allNews = await response.json();
            allNews.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
            renderNews('all');
        } catch (error) {
            console.error('Failed to fetch news:', error);
            newsContainer.innerHTML = '<p class="text-center py-20 text-red-500 font-bold">Failed to load news.</p>';
        }
    }

    function renderNews(categoryFilter) {
        if (!newsContainer) return;
        newsContainer.innerHTML = '';
        const filtered = categoryFilter === 'all' ? allNews : allNews.filter(n => n.category === categoryFilter);

        if (filtered.length === 0) {
            newsContainer.innerHTML = '<p class="text-center py-20 text-slate-400 font-bold uppercase tracking-widest text-xs">No news found</p>';
            return;
        }

        const grouped = filtered.reduce((acc, item) => {
            if (!acc[item.date]) acc[item.date] = [];
            acc[item.date].push(item);
            return acc;
        }, {});

        Object.keys(grouped).forEach(date => {
            const header = document.createElement('div');
            header.className = 'flex justify-center mb-8';
            header.innerHTML = `<div class="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full text-xs font-black border border-indigo-100 uppercase tracking-tighter">${new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>`;
            newsContainer.appendChild(header);

            grouped[date].forEach(item => {
                const card = document.createElement('div');
                card.className = 'news-card bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-8';
                card.innerHTML = `
                    <div class="flex items-center justify-between mb-4">
                        <span class="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">${item.category}</span>
                        <span class="text-[10px] font-black text-slate-300 uppercase">${item.time}</span>
                    </div>
                    <h3 class="text-xl font-black text-slate-800 mb-4 leading-tight">${item.title}</h3>
                    <p class="text-slate-500 text-sm leading-relaxed mb-6 font-medium">${item.content}</p>
                    <div class="flex items-center gap-3 pt-4 border-t border-slate-50">
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source: ${item.author}</span>
                    </div>`;
                newsContainer.appendChild(card);
            });
        });
    }

    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.replace('bg-indigo-600', 'bg-white'));
            filterBtns.forEach(b => b.classList.replace('text-white', 'text-slate-600'));
            btn.classList.replace('bg-white', 'bg-indigo-600');
            btn.classList.replace('text-slate-600', 'text-white');
            renderNews(btn.getAttribute('data-category'));
        };
    });

    fetchNews();
});