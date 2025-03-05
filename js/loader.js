/**
 * Script ve CSS Yükleyici
 * Tüm gerekli dosyaları doğru sırada yükler
 */

// CSS dosyalarını yükle
function loadCSS(href) {
    return new Promise((resolve, reject) => {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        
        link.onload = () => resolve(href);
        link.onerror = () => reject(new Error(`CSS yüklenemedi: ${href}`));
        
        document.head.appendChild(link);
    });
}

// JS dosyalarını yükle
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = false; // Sırayla yükleme için
        
        script.onload = () => resolve(src);
        script.onerror = () => reject(new Error(`Script yüklenemedi: ${src}`));
        
        document.body.appendChild(script);
    });
}

// CSS dosyalarını yükle - CATEGORIES-NEW EKLENDİ
Promise.all([
    loadCSS('css/main.css'),
    loadCSS('css/bottom-nav.css'),
    loadCSS('css/categories-new.css'),  // YENİ: Kategori stilleri
    loadCSS('css/section-title.css') // YENİ: Bölüm başlıkları için basit stil
]).then(() => {
    console.log('CSS dosyaları yüklendi');
}).catch(error => {
    console.error('CSS yükleme hatası:', error);
});

// İlk gerekli JS dosyalarını yükle - YENİ SİRALAMA
Promise.resolve()
    .then(() => loadScript('js/scroll-fix-simple.js'))   // YENİ: Basitleştirilmiş scroll fix
    .then(() => loadScript('js/categories.js'))          // YENİ: Yeniden yazılmış kategoriler
    .then(() => loadScript('js/panel-controller.js'))
    .then(() => loadScript('js/profile-panel.js'))
    .then(() => loadScript('js/bottom-nav-fix.js'))
    .then(() => {
        console.log('Temel JS dosyaları yüklendi');
        
        // İkincil JS dosyalarını yükle
        return Promise.all([
            loadScript('js/resolveAssetPath.js'),
            loadScript('js/index.js')
        ]);
    })
    .then(() => {
        console.log('Tüm JS dosyaları yüklendi');
        // Sayfa tamamen yüklendikten sonra yapılacak işlemler
        if (document.readyState === 'complete') {
            initApp();
        } else {
            window.addEventListener('load', initApp);
        }
    })
    .catch(error => {
        console.error('JS yükleme hatası:', error);
    });

// Uygulama başlatma fonksiyonu
function initApp() {
    console.log('Uygulama başlatılıyor...');
    
    // BUG FIX: Herhangi bir scroll kilitlenmesini temizle - ScrollFixer kullan
    setTimeout(() => {
        if (window.ScrollFixer) {
            window.ScrollFixer.forceFixScroll();
        } else {
            // Fallback çözüm
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        }
    }, 100);
    
    // Kategoriler paneli için üst düzey olay dinleyicileri
    document.addEventListener('modalClosed', function(e) {
        if (e.detail.modalId === 'categoriesModal') {
            console.log('Kategoriler modalı kapatıldı, sayfa kaydırması düzeltiliyor');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        }
    });
    
    // Sayfa scroll sorunları için ek event listener
    document.querySelectorAll('.menu-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Herhangi bir açık paneli kapat
            if (window.PanelController) {
                window.PanelController.closeAllPanels();
            }
            
            // Scroll'u etkinleştir - geliştirilmiş
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.classList.remove('panel-open');
            document.body.classList.remove('no-scroll');
            
            // Global düzeltme fonksiyonunu çağır
            if (window.ScrollFix) {
                window.ScrollFix.forceEnable();
            }
        });
    });
    
    console.log('Uygulama başlatıldı');
}
