document.addEventListener('DOMContentLoaded', () => {
    const newsItemsContainer = document.getElementById('news-items');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let allNews = [];

    // Fetch news data
    async function fetchNews() {
        try {
            const response = await fetch('data/news.json');
            allNews = await response.json();
            // Sort by date and time (newest first)
            allNews.sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`));
            renderNews('all');
        } catch (error) {
            console.error('Failed to fetch news:', error);
            newsItemsContainer.innerHTML = `
                <div class="text-center py-20">
                    <p class="text-red-500 font-bold">뉴스 데이터를 불러오는 데 실패했습니다.</p>
                </div>
            `;
        }
    }

    function renderNews(categoryFilter) {
        newsItemsContainer.innerHTML = '';
        
        const filteredNews = categoryFilter === 'all' 
            ? allNews 
            : allNews.filter(item => item.category === categoryFilter);

        if (filteredNews.length === 0) {
            newsItemsContainer.innerHTML = '<p class="text-center text-slate-400 py-20 font-bold uppercase tracking-widest text-xs">No news found in this category</p>';
            return;
        }

        // Group by date
        const grouped = filteredNews.reduce((acc, item) => {
            if (!acc[item.date]) acc[item.date] = [];
            acc[item.date].push(item);
            return acc;
        }, {});

        Object.keys(grouped).forEach(date => {
            // Date Header
            const dateHeader = document.createElement('div');
            dateHeader.className = 'relative flex justify-center mb-8';
            dateHeader.innerHTML = `
                <div class="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-full text-xs font-black shadow-sm relative z-20 border border-indigo-100 uppercase tracking-tighter">
                    ${formatDate(date)}
                </div>
            `;
            newsItemsContainer.appendChild(dateHeader);

            // News Cards for this date
            grouped[date].forEach((item, index) => {
                const isEven = index % 2 === 0;
                const card = document.createElement('div');
                card.className = `flex flex-col md:flex-row items-center gap-8 mb-12 relative w-full`;
                
                const categoryColor = getCategoryColor(item.category);
                
                card.innerHTML = `
                    <div class="hidden md:block w-1/2 ${isEven ? 'order-1 text-right' : 'order-3 text-left'} px-8">
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">${item.time}</span>
                    </div>
                    
                    <div class="absolute left-[20px] md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 flex items-center justify-center z-30">
                        <div class="w-4 h-4 rounded-full bg-white border-4 ${categoryColor.border} shadow-sm"></div>
                    </div>

                    <div class="w-full md:w-1/2 ${isEven ? 'md:order-3' : 'md:order-1'} pl-12 md:px-8">
                        <div class="news-card bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <div class="flex items-center justify-between mb-4">
                                <span class="category-badge ${categoryColor.bg} ${categoryColor.text}">${item.category}</span>
                                <span class="md:hidden text-[10px] font-black text-slate-400 uppercase tracking-widest">${item.time}</span>
                            </div>
                            <h3 class="text-lg font-black text-slate-800 mb-3 leading-tight">${item.title}</h3>
                            <p class="text-slate-500 text-sm leading-relaxed mb-6 font-medium">${item.content}</p>
                            <div class="flex flex-wrap gap-2 mb-6">
                                ${item.tags.map(tag => `<span class="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">#${tag}</span>`).join('')}
                            </div>
                            <div class="flex items-center gap-3 pt-4 border-t border-slate-50">
                                <div class="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-[10px] font-black text-indigo-600">
                                    ${item.author.charAt(0)}
                                </div>
                                <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">${item.author}</span>
                            </div>
                        </div>
                    </div>
                `;
                newsItemsContainer.appendChild(card);
            });
        });
    }

    function formatDate(dateStr) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' };
        return new Date(dateStr).toLocaleDateString('ko-KR', options);
    }

    function getCategoryColor(category) {
        switch(category) {
            case 'Liner News': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' };
            case 'Port Status': return { bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-500' };
            case 'Logistics Technology': return { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' };
            default: return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-500' };
        }
    }

    // Filter Logic
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-indigo-600', 'text-white');
                b.classList.add('bg-white', 'text-slate-600');
            });
            btn.classList.add('active', 'bg-indigo-600', 'text-white');
            btn.classList.remove('bg-white', 'text-slate-600');
            renderNews(btn.dataset.category);
        });
    });

    fetchNews();
});