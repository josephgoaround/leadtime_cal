/* components.js - Shared UI Components for LeadTime Intelligence */

class MainHeader extends HTMLElement {
    connectedCallback() {
        const activePage = this.getAttribute('active') || '';
        this.innerHTML = `
        <header class="bg-white/80 border-b border-slate-200 sticky top-0 z-[3000] backdrop-blur-md">
            <div class="container mx-auto px-4 max-w-7xl flex justify-between items-center py-4">
                <div class="flex items-center gap-8">
                    <a href="index.html" class="block">
                        <h1 class="logo-brand text-xl font-extrabold tracking-tight text-slate-800">LeadTime<span class="text-indigo-600">Intelligence</span></h1>
                    </a>
                    <nav class="hidden md:flex items-center gap-6">
                        <a href="index.html" class="text-sm font-bold ${activePage === 'analyzer' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-slate-600 hover:text-indigo-600 transition-colors'}">Analyzer</a>
                        <a href="planner.html" class="text-sm font-bold ${activePage === 'planner' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-slate-600 hover:text-indigo-600 transition-colors'}">3D Load Planner</a>
                        <a href="news.html" class="text-sm font-bold ${activePage === 'news' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-slate-600 hover:text-indigo-600 transition-colors'}">Logistics News</a>
                        <a href="about.html" class="text-sm font-bold ${activePage === 'about' ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-slate-600 hover:text-indigo-600 transition-colors'}">About</a>
                    </nav>
                </div>
                <div class="flex items-center gap-4">
                    <a href="contact.html" class="hidden md:block text-[10px] font-black bg-slate-900 text-white px-4 py-2 rounded-full uppercase tracking-widest hover:bg-indigo-600 transition-all">Contact Us</a>
                    <button class="md:hidden text-slate-800" id="mobile-menu-btn">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                    </button>
                </div>
            </div>
        </header>
        `;
    }
}

class MainFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <footer class="bg-slate-900 py-16 text-white mt-20">
            <div class="container mx-auto px-4 max-w-7xl">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div class="md:col-span-2">
                        <h2 class="logo-brand text-2xl font-black mb-6">LeadTime<span class="text-indigo-400">Intelligence</span></h2>
                        <p class="text-slate-400 text-sm max-w-md font-medium leading-relaxed">
                            Empowering global trade with precision lead-time analytics and advanced load planning visualization. 
                            Our mission is to bring transparency to the maritime highway.
                        </p>
                    </div>
                    <div>
                        <h4 class="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">Expert Tools</h4>
                        <ul class="space-y-4 text-sm font-bold text-slate-300">
                            <li><a href="index.html" class="hover:text-white transition-colors">Route Analyzer</a></li>
                            <li><a href="planner.html" class="hover:text-white transition-colors">3D Container Planner</a></li>
                            <li><a href="news.html" class="hover:text-white transition-colors">Market Intelligence</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">Company</h4>
                        <ul class="space-y-4 text-sm font-bold text-slate-300">
                            <li><a href="about.html" class="hover:text-white transition-colors">Our Vision</a></li>
                            <li><a href="contact.html" class="hover:text-white transition-colors">Contact Expert</a></li>
                            <li><a href="privacy.html" class="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="terms.html" class="hover:text-white transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>
                <div class="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">© 2026 LeadTime Intelligence. All rights reserved.</p>
                    <div class="flex gap-4">
                        <div class="px-3 py-1 bg-slate-800 rounded-md text-[9px] font-black text-slate-400 border border-slate-700 uppercase">System Status: Optimal</div>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }
}

class CookieBanner extends HTMLElement {
    connectedCallback() {
        if (localStorage.getItem('cookie-consent')) return;
        this.innerHTML = `
        <div id="cookie-banner" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[5000] w-[90%] max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 animate-fade-in-up">
            <div class="flex flex-col md:flex-row items-center gap-6">
                <div class="bg-indigo-50 p-3 rounded-2xl text-indigo-600">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div class="flex-1 text-center md:text-left">
                    <h3 class="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">Privacy & Expert Experience</h3>
                    <p class="text-[11px] text-slate-500 font-medium">We use cookies to enhance our analytics engine and provide professional grade lead-time simulations.</p>
                </div>
                <div class="flex gap-2">
                    <button id="accept-cookies" class="px-6 py-2 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">Accept</button>
                    <button id="decline-cookies" class="px-6 py-2 bg-slate-100 text-slate-600 text-[10px] font-black rounded-full uppercase tracking-widest hover:bg-slate-200 transition-all">Decline</button>
                </div>
            </div>
        </div>
        `;
        this.querySelector('#accept-cookies').onclick = () => {
            localStorage.setItem('cookie-consent', 'true');
            this.querySelector('#cookie-banner').remove();
        };
        this.querySelector('#decline-cookies').onclick = () => {
            this.querySelector('#cookie-banner').remove();
        };
    }
}

customElements.define('main-header', MainHeader);
customElements.define('main-footer', MainFooter);
customElements.define('cookie-banner', CookieBanner);
