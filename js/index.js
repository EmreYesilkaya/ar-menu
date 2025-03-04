/**
 * AR Menü Uygulaması - Modüler Ana JavaScript Dosyası
 * AR işlevleri ar-module.js'e taşındı
 * Sadece temel menü ve sayfa işlevlerini içerir
 */

// DOM Elements 
const loadingScreen = document.getElementById('loadingScreen');
const statusMessage = document.getElementById('statusMessage');
const mainDishesContainer = document.getElementById('mainDishes');
const dessertsContainer = document.getElementById('desserts');
const drinksContainer = document.getElementById('drinks');
const showInstructionsBtn = document.getElementById('showInstructionsBtn');
const instructionsModal = document.getElementById('instructionsModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Menu data - Path correction for kofte.glb file
const menuData = {
    mainDishes: [
        { 
          id: 1, 
          name: 'Izgara Köfte', 
          price: '120 TL', 
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Köfte', 
          modelPath: 'models/kofte.glb',  
          usdz: 'models/kofte.usdz',
          modelAlternates: ['models/kofte.glb', './models/kofte.glb', '/models/kofte.glb', 'assets/models/kofte.glb']
        },
        { 
          id: 2, 
          name: 'Karışık Izgara', 
          price: '180 TL', 
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Karışık', 
          modelPath: './models/karisik.glb', 
          usdz: './models/karisik.usdz'
        },
        { 
          id: 3, 
          name: 'Tavuk Şiş', 
          price: '140 TL', 
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Tavuk+Şiş', 
          modelPath: './models/tavuk_sis.glb',
          usdz: './models/tavuk_sis.usdz'
        }
    ],
    desserts: [
        {
          id: 4,
          name: 'Künefe',
          price: '65 TL',
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Künefe',
          modelPath: './assets/models/kunefe.glb',
          usdz: './assets/models/kunefe.usdz'
        },
        {
          id: 5,
          name: 'Baklava',
          price: '75 TL',
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Baklava',
          modelPath: './assets/models/baklava.glb',
          usdz: './assets/models/baklava.usdz'
        }
    ],
    drinks: [
        {
          id: 6,
          name: 'Ayran',
          price: '15 TL',
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Ayran',
          modelPath: './assets/models/ayran.glb',
          usdz: './assets/models/ayran.usdz'
        },
        {
          id: 7,
          name: 'Türk Kahvesi',
          price: '30 TL',
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Türk+Kahvesi',
          modelPath: './assets/models/kahve.glb',
          usdz: './assets/models/kahve.usdz'
        }
    ]
};

// Initialize the application
function init() {
    console.log("AR Menü başlatılıyor...");
    
    // Önce DOM'un hazır olduğundan emin olalım
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAfterDOMLoaded);
    } else {
        initAfterDOMLoaded();
    }
}

// DOM yüklendikten sonra başlatma işlemi
function initAfterDOMLoaded() {
    console.log("DOM yüklendi, AR desteği kontrol ediliyor...");
    
    // Tutorial gösterimi kontrolü
    ensureTutorialCheck();
    
    // AR modülünü başlat
    if (window.ARModule) {
        ARModule.init().then(support => {
            console.log(`AR desteği: ${support}`);
            
            // Durum bildirimlerini AR modülüne bağla
            ARModule.setStatusCallback((message, isLoading) => {
                if (message === null) {
                    if (statusMessage) statusMessage.style.display = 'none';
                    return;
                }
                
                showStatusMessage(message, isLoading ? 0 : 3000);
            });
            
            // Tüm kategorilerin içeriğini yükle
            loadMenuItems();
            
            // Olay dinleyicilerini ayarla
            setupEventListeners();
            
            // Yükleme ekranını kaldır
            hideLoadingScreen();
            
            // AR desteği kontrol edildi, uygun bilgilendirmeyi göster
            updateARInstructions(support);
        }).catch(error => {
            console.error("AR modülü başlatılamadı:", error);
            // AR desteği olmadan devam et
            loadMenuItems();
            setupEventListeners();
            hideLoadingScreen();
        });
    } else {
        console.error("AR modülü bulunamadı!");
        // AR modülü olmadan devam et
        loadMenuItems();
        setupEventListeners();
        hideLoadingScreen();
    }
}

// Tutorial gösteriminin kontrol edildiğinden emin ol
function ensureTutorialCheck() {
    if (typeof window.checkFirstVisit === 'function') {
        console.log('Tutorial fonksiyonu bulundu, çağrılıyor...');
        window.checkFirstVisit();
    } else {
        console.log('Tutorial fonksiyonu bulunamadı, alternatif yükleme deneniyor...');
        
        // Tutorial.js yüklenmediyse veya fonksiyona erişilemiyorsa
        if (document.getElementById('instructionsModal')) {
            const tutorialShown = localStorage.getItem('ar_tutorial_shown');
            if (!tutorialShown) {
                console.log('Tutorial manuel olarak gösteriliyor');
                document.getElementById('instructionsModal').style.display = 'flex';
                localStorage.setItem('ar_tutorial_shown', 'true');
            }
        }
    }
}

// Yükleme ekranını gizle
function hideLoadingScreen() {
    if (window.PopupManager) {
        window.PopupManager.hideLoading();
    } else {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = '';
            console.log("Yükleme ekranı kapatıldı");
        }
    }
}

// Status mesajını göster
function showStatusMessage(message, duration = 3000) {
    if (window.PopupManager) {
        window.PopupManager.showStatusMessage(message, duration);
    } else if (statusMessage) {
        let icon = 'ℹ️';
        let className = 'info';
        
        if (message.toLowerCase().includes('hata') || message.toLowerCase().includes('bulunamadı')) {
            icon = '⚠️';
            className = 'warning';
        } else if (message.toLowerCase().includes('başarı') || message.toLowerCase().includes('yüklendi')) {
            icon = '✅';
            className = 'success';
        } else if (message.toLowerCase().includes('kamera')) {
            icon = '📷';
            className = 'info';
        }
        
        statusMessage.innerHTML = `<div class="alert alert-${className}"><div class="alert-emoji">${icon}</div><div>${message}</div></div>`;
        statusMessage.style.display = 'block';
        
        if (duration > 0) {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, duration);
        }
    }
}

// AR desteği bilgi mesajını güncelle
function updateARInstructions(support) {
    const arInstructions = document.getElementById('arInstructions');
    if (!arInstructions) return;
    
    if (support === 'none') {
        arInstructions.className = 'alert alert-warning';
        arInstructions.innerHTML = '<div class="alert-emoji">⚠️</div><div><strong>Uyarı:</strong> Cihazınızda AR desteği bulunamadı. Basit 3D görüntüleme kullanılacak. En iyi deneyim için iOS 12+ veya ARCore destekleyen Android 8+ cihaz kullanın.</div>';
    } else if (support === 'quicklook') {
        arInstructions.innerHTML = '<div class="alert-emoji">📱</div><div><strong>iOS AR Hazır:</strong> Yemek görsellerine tıklayarak gerçek boyutlarında görün. <a href="#" id="showInstructionsBtn" style="color: var(--primary); font-weight: 600;">Nasıl kullanılır?</a></div>';
        
        // Reattach event listener as we changed the HTML
        document.getElementById('showInstructionsBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (instructionsModal) instructionsModal.style.display = 'flex';
        });
    } else if (support === 'webxr') {
        arInstructions.innerHTML = '<div class="alert-emoji">📱</div><div><strong>AR Hazır:</strong> Kameranızı kullanarak yemekleri gerçek ortamınızda görüntüleyin. <a href="#" id="showInstructionsBtn" style="color: var(--primary); font-weight: 600;">Nasıl kullanılır?</a></div>';
        
        // Reattach event listener as we changed the HTML
        document.getElementById('showInstructionsBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (instructionsModal) instructionsModal.style.display = 'flex';
        });
    }
}

// Load menu items
function loadMenuItems() {
    // Load main dishes
    if (mainDishesContainer) {
        menuData.mainDishes.forEach(dish => {
            const dishElement = createMenuItemElement(dish);
            mainDishesContainer.appendChild(dishElement);
        });
    }

    // Load desserts
    if (dessertsContainer) {
        menuData.desserts.forEach(dessert => {
            const dessertElement = createMenuItemElement(dessert);
            dessertsContainer.appendChild(dessertElement);
        });
    }

    // Load drinks
    if (drinksContainer) {
        menuData.drinks.forEach(drink => {
            const drinkElement = createMenuItemElement(drink);
            drinksContainer.appendChild(drinkElement);
        });
    }
    
    // Popüler ürünleri yükle
    loadPopularItems();
}

// Popüler ürünleri yükle
function loadPopularItems() {
    const popularItemsContainer = document.getElementById('popularItems');
    if (!popularItemsContainer) return;
    
    // Tüm kategorilerden popüler öğeleri topla
    const allPopularItems = [];
    
    // Her kategoriden bir örnek ekle
    if (menuData.mainDishes && menuData.mainDishes.length > 0) {
        allPopularItems.push(menuData.mainDishes[0]);
    }
    
    if (menuData.desserts && menuData.desserts.length > 0) {
        allPopularItems.push(menuData.desserts[0]);
    }
    
    if (menuData.drinks && menuData.drinks.length > 0) {
        allPopularItems.push(menuData.drinks[0]);
    }
    
    // Popüler öğeleri konteynere ekle
    allPopularItems.forEach(item => {
        const itemElement = createMenuItemElement(item);
        popularItemsContainer.appendChild(itemElement);
    });
}

// Create menu item element
function createMenuItemElement(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
        <div class="menu-item-img-container">
            <img src="${item.image}" alt="${item.name}" class="menu-item-img" 
                onerror="this.src='https://placehold.co/220x140/eee/999?text=${encodeURIComponent(item.name)}'">
        </div>
        <div class="menu-item-info">
            <div class="menu-item-title">${item.name}</div>
            <div class="menu-item-price">${item.price}</div>
            <button class="menu-item-ar" 
                    data-model="${item.modelPath}" 
                    data-usdz="${item.usdz || ''}">
                <i class="fas fa-cube"></i> AR'da Gör
            </button>
        </div>
    `;
    
    // Add click event to open AR view - use AR module
    const arButton = menuItem.querySelector('.menu-item-ar');
    arButton.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (window.ARModule) {
            // Menü öğesinin bilgilerini al
            const menuItem = {
                name: item.name,
                modelPath: item.modelPath,
                usdz: item.usdz,
                image: item.image,
                id: item.id,
                modelAlternates: item.modelAlternates || []
            };
            
            // AR modülü ile göster
            ARModule.showAR(menuItem);
        } else {
            showStatusMessage("AR modülü yüklenemedi. Sayfayı yenileyin veya başka bir tarayıcı deneyin.", 4000);
        }
    });
    
    return menuItem;
}

// Setup event listeners
function setupEventListeners() {
    // Show instructions modal
    if (showInstructionsBtn) {
        showInstructionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (instructionsModal) instructionsModal.style.display = 'flex';
        });
    }
    
    // Close instructions modal
    if (closeModalBtn && instructionsModal) {
        closeModalBtn.addEventListener('click', () => {
            instructionsModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        instructionsModal.addEventListener('click', (e) => {
            if (e.target === instructionsModal) {
                instructionsModal.style.display = 'none';
            }
        });
    }
    
    // Menü sekmeleri için tıklama olayları - TEK SAYFA KAYDIRMA
    const menuTabs = document.querySelectorAll('.menu-tab');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Standart link davranışını engelle
            e.preventDefault();
            
            const targetId = tab.getAttribute('data-target');
            console.log("Tıklanan sekme:", targetId);
            
            // Tüm sekmelerde active class'ı kaldır
            menuTabs.forEach(t => t.classList.remove('active'));
            
            // Tıklanan sekmeye active class'ı ekle
            tab.classList.add('active');
            
            // Hedef bölümü bul
            const targetSection = document.getElementById(targetId + 'Section');
            
            if (targetSection) {
                // Hiçbir şeyi gizleme - sadece kaydır
                
                // Popüler için özel durum - ilk kez tıklandıysa doldur
                if (targetId === 'popular') {
                    const popularItems = document.getElementById('popularItems');
                    if (popularItems && popularItems.children.length === 0) {
                        loadPopularItems();
                    }
                }
                
                // Smooth scroll ile bölüme kaydır
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                console.error("Hedef bölüm bulunamadı:", targetId + 'Section');
            }
        });
    });
    
    // Yukarı çık butonu oluştur ve ekle
    createBackToTopButton();
    
    // Sayfa kaydırma olayını dinle
    window.addEventListener('scroll', handleScroll);
}

// Yukarı çık butonu oluştur
function createBackToTopButton() {
    // Eğer buton zaten varsa, tekrar oluşturma
    if (document.getElementById('backToTop')) return;
    
    // Yukarı çık butonu oluştur
    const backToTopBtn = document.createElement('div');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    
    // HTML'e ekle
    document.body.appendChild(backToTopBtn);
    
    // Tıklama olayı
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Sayfa kaydırıldığında çalışacak işlev
function handleScroll() {
    const backToTopButton = document.getElementById('backToTop');
    
    // 300px'den fazla aşağı kaydırıldığında yukarı çıkma butonunu göster
    if (backToTopButton) {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    // Menü sekmeleri sabit olduğu için kaydırmada güncelleme yapmak gerekir
    // Performans için throttle mekanizması
    if (!handleScroll.ticking) {
        window.requestAnimationFrame(() => {
            updateActiveTabOnScroll();
            handleScroll.ticking = false;
        });
        handleScroll.ticking = true;
    }
}

// Kaydırma pozisyonuna göre aktif sekmeleri güncelle - Fixed tabs için düzeltildi
function updateActiveTabOnScroll() {
    const sections = document.querySelectorAll('.menu-section');
    const menuTabs = document.querySelectorAll('.menu-tab');
    
    // Sabit menü sekmelerinin yüksekliğini hesaba katmak için offset değeri
    const menuTabsHeight = document.querySelector('.menu-tabs-container')?.offsetHeight || 0;
    const headerHeight = 70; // Header yüksekliği
    const totalOffset = headerHeight + menuTabsHeight;
    
    // Viewport yüksekliği
    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    // Hangi bölümün en iyi şekilde görünür olduğunu hesapla
    let maxVisibleSection = null;
    let maxVisiblePercentage = 0;
    
    sections.forEach(section => {
        // Bölümün pozisyon ve boyutu
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Viewport'un altı ve üstü
        const viewportTop = scrollPosition;
        const viewportBottom = scrollPosition + viewportHeight;
        
        // Bölüm başlangıcı daha fazla önceliğe sahip olması için
        // bölümün üst kısmına daha fazla ağırlık verelim
        const visibleTop = Math.max(sectionTop, viewportTop);
        const visibleBottom = Math.min(sectionBottom, viewportBottom);
        
        // Görünür yükseklik
        let visibleHeight = visibleBottom - visibleTop;
        
        // Negatif değer olmamalı
        visibleHeight = Math.max(0, visibleHeight);
        
        // Fixed header ve tabs'a göre pozisyonu düzenleyen ek hesaplamalar
        const adjustedSectionTop = sectionTop - totalOffset;
        const isSectionTopVisible = (adjustedSectionTop >= 0 && adjustedSectionTop <= viewportHeight);
        const headerBonus = isSectionTopVisible ? viewportHeight * 0.3 : 0;
        
        // Görünürlük yüzdesi (bölüm başlangıcına bonus ekle)
        const visiblePercentage = (visibleHeight + headerBonus) / sectionHeight;
        
        // En fazla görünür olan bölümü bul
        if (visiblePercentage > maxVisiblePercentage) {
            maxVisiblePercentage = visiblePercentage;
            maxVisibleSection = section;
        }
    });
    
    // En çok görünür olan bölüme göre sekmeleri aktifleştir
    if (maxVisibleSection) {
        const categoryId = maxVisibleSection.id.replace('Section', '');
        
        menuTabs.forEach(tab => {
            if (tab.getAttribute('data-target') === categoryId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
}

// Run the initialization when page is loaded
init();