document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initRTL();
    initFishAnimation();
    renderHeader();
    renderFooter();
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) closeMobileMenu();
    });
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', newTheme);
}

// RTL Management
function initRTL() {
    const isRTL = localStorage.getItem('rtl') === 'true';
    if (isRTL) {
        document.documentElement.setAttribute('dir', 'rtl');
    }
}

function toggleRTL() {
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    const newDir = isRTL ? 'ltr' : 'rtl';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem('rtl', !isRTL);
}

// Ambient Animation: Animated Fish
function initFishAnimation() {
    const containers = document.querySelectorAll('.ambient-sea');
    containers.forEach(container => {
        for (let i = 0; i < 5; i++) {
            const fish = document.createElement('div');
            fish.className = 'swimming-fish';
            fish.style.top = `${Math.random() * 80 + 10}%`;
            fish.style.animationDelay = `${Math.random() * 10}s`;
            fish.style.animationDuration = `${10 + Math.random() * 10}s`;
            fish.innerHTML = `<svg viewBox="0 0 100 100" fill="currentColor" class="text-primary-dark opacity-40"><path d="M10,50 Q40,20 90,50 Q40,80 10,50 M80,50 L95,40 L95,60 Z"/></svg>`;
            container.appendChild(fish);
        }
    });
}

// Components Rendering
function renderHeader() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    const navItems = [
        { name: 'Home', url: 'index.html' },
        { name: 'Home V2', url: 'index-v2.html' },
        { name: 'Packages', url: 'packages.html' },
        { name: 'Fish Guide', url: 'fish-guide.html' },
        { name: 'Gallery', url: 'gallery.html' },
        { name: 'Reports', url: 'reports.html' },
        { name: 'Contact', url: 'contact.html' }
    ];

    const desktopNavHtml = navItems.map(item => {
        const isActive = currentPath === item.url;
        return `<a href="${item.url}" class="font-medium transform transition-all duration-300 ${isActive ? 'text-secondary scale-110 border-b-2 border-secondary' : 'text-slate-700 dark:text-accent hover:text-primary hover:scale-105'}">${item.name}</a>`;
    }).join('');

    const mobileNavHtml = navItems.map(item => {
        const isActive = currentPath === item.url;
        return `
            <a href="${item.url}" class="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}">
                <i class="fas fa-chevron-right text-[10px] opacity-40"></i>
                ${item.name}
            </a>
        `;
    }).join('');

    header.className = 'fixed top-0 w-full z-50 glass transition-all duration-300';
    header.innerHTML = `
        <div class="container max-w-[1400px] mx-auto px-6 py-2.5 flex items-center justify-between">
            <a href="index.html" class="flex items-center gap-3 group flex-shrink-0">
                <div class="bg-primary p-2 rounded-full text-white transform group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                    <i class="fas fa-anchor text-lg"></i>
                </div>
                <span class="text-2xl font-bold tracking-tighter uppercase">
                    <span class="text-accent dark:text-white">OCEAN</span><span class="text-secondary">BOUND</span>
                </span>
            </a>

            <!-- Desktop Navigation -->
            <nav class="desktop-only items-center gap-5 mx-8 flex-nowrap">
                ${desktopNavHtml}
            </nav>

            <div class="flex items-center gap-3 flex-shrink-0">
                <!-- Desktop Tools -->
                <div class="desktop-only items-center gap-3">
                    <button onclick="toggleTheme()" class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-slate-700 dark:text-accent" title="Toggle Theme">
                        <i class="fas fa-moon dark:hidden"></i>
                        <i class="fas fa-sun hidden dark:block"></i>
                    </button>

                    <button onclick="toggleRTL()" class="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-xs font-bold text-slate-700 dark:text-accent" title="Toggle RTL">
                        RTL
                    </button>

                    <a href="login.html" class="border-2 border-slate-700 dark:border-accent text-slate-700 dark:text-accent px-4 py-1.5 rounded-full font-bold hover:bg-accent hover:text-white dark:hover:bg-white dark:hover:text-accent transition-all uppercase text-[12px]">
                        Login
                    </a>

                    <a href="register.html" class="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-full font-bold shadow-lg transition-all uppercase text-[12px]">
                        Register
                    </a>

                    <a href="dashboard.html" class="bg-secondary hover:bg-secondary-dark text-white px-5 py-2 rounded-full font-bold shadow-lg shadow-orange-500/20 transition-all uppercase text-[12px]">
                        Dashboard
                    </a>
                </div>

                <!-- Hamburger Button (Mobile/Tablet Only) -->
                <button onclick="toggleMobileMenu()" class="mobile-only p-2 text-accent dark:text-white">
                    <i class="fas fa-bars text-3xl"></i>
                </button>
            </div>
        </div>

        <!-- Mobile Drawer Overlay -->
        <div id="drawer-overlay" class="fixed inset-0 bg-black/60 z-[60] opacity-0 pointer-events-none transition-opacity duration-300" onclick="toggleMobileMenu()"></div>

        <!-- Mobile Drawer (Fixed Format) -->
        <div id="mobile-drawer" class="fixed top-0 right-0 w-[320px] h-screen bg-white dark:bg-slate-900 z-[70] translate-x-full transition-transform duration-500 ease-in-out shadow-3xl flex flex-col overflow-hidden">
            <!-- Header Section -->
            <div class="h-20 flex-shrink-0 px-6 flex items-center justify-between border-b dark:border-slate-800">
                <div class="flex items-center gap-2">
                    <i class="fas fa-anchor text-xl text-primary"></i>
                    <span class="text-xl font-bold tracking-tighter text-blue-900 dark:text-blue-100 uppercase">Menu</span>
                </div>
                <button onclick="toggleMobileMenu()" class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-red-500 transition-colors">
                    <i class="fas fa-times text-xl"></i>
                </button>
            </div>
            
            <!-- Main Navigation Content -->
            <div class="flex-grow flex flex-col justify-between py-4">
                <nav class="px-6 space-y-1">
                    ${mobileNavHtml}
                    
                    <div class="mt-4 pt-4 border-t dark:border-slate-800">
                        <button onclick="toggleRTL()" class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left">
                            <i class="fas fa-language text-lg opacity-60"></i>
                            RTL Mode
                        </button>

                        <button onclick="toggleTheme()" class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-left">
                            <i class="fas fa-moon dark:hidden opacity-60"></i>
                            <i class="fas fa-sun hidden dark:block opacity-60"></i>
                            Contrast Mode
                        </button>
                    </div>
                </nav>

                <!-- Fixed Bottom Section -->
                <div class="px-6 pb-8 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <a href="login.html" class="flex items-center justify-center py-4 border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-700 dark:text-white text-sm hover:bg-white dark:hover:bg-slate-800 transition-colors uppercase">Login</a>
                        <a href="register.html" class="flex items-center justify-center py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 text-sm hover:bg-primary-dark transition-colors uppercase">Register</a>
                    </div>
                    <a href="dashboard.html" class="flex items-center justify-center gap-3 py-5 bg-secondary text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 text-base hover:bg-secondary-dark transition-colors uppercase tracking-widest">
                        <i class="fas fa-columns text-lg"></i>
                        Dashboard
                    </a>
                </div>
            </div>
        </div>
    `;
}

function toggleMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (!drawer || !overlay) return;

    const isOpen = drawer.classList.contains('translate-x-0');

    if (isOpen) {
        closeMobileMenu();
    } else {
        drawer.classList.remove('translate-x-full');
        drawer.classList.add('translate-x-0');
        overlay.classList.remove('opacity-0', 'pointer-events-none');
        overlay.classList.add('opacity-100');
        document.body.classList.add('overflow-hidden');
    }
}

function closeMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');

    if (drawer) {
        drawer.classList.remove('translate-x-0');
        drawer.classList.add('translate-x-full');
    }
    if (overlay) {
        overlay.classList.remove('opacity-100');
        overlay.classList.add('opacity-0', 'pointer-events-none');
    }
    document.body.classList.remove('overflow-hidden');
}

function renderFooter() {
    const footer = document.getElementById('main-footer');
    if (!footer) return;

    footer.className = 'bg-accent text-white py-16 relative overflow-hidden';
    footer.innerHTML = `
        <div class="container mx-auto px-4 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
                <div class="flex items-center gap-3 mb-6">
                    <div class="bg-primary p-2 rounded-full text-white shadow-lg shadow-primary/20">
                        <i class="fas fa-anchor text-lg"></i>
                    </div>
                    <span class="text-2xl font-bold tracking-tighter uppercase">
                        <span class="text-white">OCEAN</span><span class="text-secondary">BOUND</span>
                    </span>
                </div>
                <p class="text-blue-200 mb-6 leading-relaxed">
                    Florida's premier fishing charter service. From deep-sea monsters to inshore adventures, we bring you the ultimate maritime experience since 1998.
                </p>
                <div class="flex gap-4">
                    <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"><i class="fab fa-instagram"></i></a>
                    <a href="#" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-secondary transition-colors"><i class="fab fa-youtube"></i></a>
                </div>
            </div>

            <div>
                <h3 class="text-xl mb-6 uppercase">Quick Links</h3>
                <ul class="space-y-4 text-blue-200">
                    <li><a href="packages.html" class="hover:text-secondary transition-colors">Charter Packages</a></li>
                    <li><a href="rates.html" class="hover:text-secondary transition-colors">Rates & Policies</a></li>
                    <li><a href="fleet.html" class="hover:text-secondary transition-colors">Our Fleet</a></li>
                    <li><a href="captains.html" class="hover:text-secondary transition-colors">Meet the Captains</a></li>
                    <li><a href="faq.html" class="hover:text-secondary transition-colors">Frequently Asked Questions</a></li>
                </ul>
            </div>

            <div>
                <h3 class="text-xl mb-6 uppercase">Marina Location</h3>
                <div class="space-y-4 text-blue-200">
                    <div class="flex gap-3">
                        <i class="fas fa-map-marker-alt text-secondary"></i>
                        <p>Pier 22, Marina One South<br>Jupiter, FL 33458</p>
                    </div>
                    <div class="flex gap-3">
                        <i class="fas fa-phone-alt text-secondary"></i>
                        <p>(561) 555-FISH</p>
                    </div>
                    <div class="flex gap-3 text-alert font-bold">
                        <i class="fas fa-life-ring"></i>
                        <p>Emergency: (561) 555-0911</p>
                    </div>
                </div>
            </div>

            <div>
                <h3 class="text-xl mb-6 uppercase">Join the Crew</h3>
                <p class="text-blue-200 mb-6">Sign up for fishing reports and exclusive seasonal offers.</p>
                <form class="flex flex-col gap-3">
                    <input type="email" placeholder="Your Email" class="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-secondary transition-colors">
                    <button class="bg-secondary hover:bg-secondary-dark text-white font-bold py-3 rounded-lg transition-colors uppercase">SET SAIL</button>
                </form>
            </div>
        </div>
        <div class="container mx-auto px-4 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-blue-300 text-sm">
            <p>&copy; 2026 OceanBound Fishing Charters. USCG Licensed & Fully Insured.</p>
            <div class="flex gap-6 mt-4 md:mt-0">
                <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
            </div>
        </div>
        <!-- Decorative SVG wave -->
        <div class="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                <path fill="#ffffff" fill-opacity="1" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,138.7C960,160,1056,224,1152,224C1248,224,1344,160,1392,128L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
        </div>
    `;
}
