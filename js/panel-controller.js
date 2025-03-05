/**
 * Panel ve Modal Kontrolleri
 * Kategoriler ve profil panelleri için ortak davranışları yönetir
 */

// Panel Controller modülünü oluştur
const PanelController = (function() {
    // Özel değişkenler
    let activePanels = [];
    let bodyScrollPosition = 0;
    
    // Scroll pozisyonunu kontrol eden yardımcı fonksiyonlar - TAMAMEN YENİLENDİ
    const disableScroll = () => {
        bodyScrollPosition = window.pageYOffset || window.scrollY;
        
        // ScrollFixer kullan (mevcutsa)
        if (window.ScrollFixer) {
            window.ScrollFixer.lockScroll();
        } else {
            // Kendi yöntemimizi kullan
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.top = `-${bodyScrollPosition}px`;
            document.body.style.width = '100%';
            document.body.classList.add('scroll-locked'); // Yardımcı sınıf
        }
    };
    
    // Scroll aktivasyonunu KRİTİK BİR ŞEKİLDE GÜÇLENDİRDİK
    const enableScroll = () => {
        // ScrollFixer kullan (mevcutsa)
        if (window.ScrollFixer) {
            window.ScrollFixer.unlockScroll();
            return;
        }
        
        // Kendi yöntemimizle devam et
        
        // Sayfanın orijinal konumunu kaydet
        const scrollY = parseFloat(document.body.style.top) * -1 || bodyScrollPosition || 0;
        
        // Tüm scroll engelleme stillerini temizle
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        document.body.style.height = '';
        document.body.classList.remove('scroll-locked');
        
        // Sayfayı orijinal konumuna kaydır - iOS için smooth scroll devre dışı
        window.scrollTo(0, scrollY);
        
        // iOS'ta scroll ek kontroller ve düzeltmeler
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.documentElement.style.height = 'auto';
            setTimeout(() => {
                window.scrollTo(0, scrollY);
                document.documentElement.style.height = '';
            }, 0);
        }
        
        // Ek kontrol - scroll durumunu bir daha kontrol et
        setTimeout(() => {
            if (document.body.style.overflow === 'hidden') {
                document.body.style.overflow = '';
            }
            
            // Scroll'un gerçekten düzeldiğinden emin ol
            document.body.classList.add('scroll-fix-needed');
            setTimeout(() => {
                document.body.classList.remove('scroll-fix-needed');
            }, 100);
        }, 10);
    };
    
    // Panel açma fonksiyonu
    const openPanel = (panelId) => {
        const panel = document.getElementById(panelId);
        if (!panel) return false;
        
        // Paneli aktifleştir
        panel.classList.add('active');
        
        // Sayfanın kaydırmasını devre dışı bırak
        disableScroll();
        
        // Body'ye panel-open sınıfı ekle
        document.body.classList.add('panel-open');
        
        // Aktif paneller listesine ekle
        if (!activePanels.includes(panelId)) {
            activePanels.push(panelId);
        }
        
        // Olay tetikle
        document.dispatchEvent(new CustomEvent('panelOpened', { 
            detail: { panelId: panelId }
        }));
        
        return true;
    };
    
    // Panel kapatma fonksiyonu - Scroll düzeltmesi ile
    const closePanel = (panelId, callback) => {
        const panel = document.getElementById(panelId);
        if (!panel) return false;
        
        // Paneli kapat
        panel.classList.remove('active');
        
        // Aktif paneller listesinden çıkar
        activePanels = activePanels.filter(id => id !== panelId);
        
        // Başka açık panel yoksa kaydırmayı etkinleştir
        if (activePanels.length === 0) {
            // BUG FIX: Kaydırma etkinleştirmeden önce biraz bekle
            setTimeout(() => {
                enableScroll();
                document.body.classList.remove('panel-open');
                
                // BUG FIX: Scroll'un etkin olduğundan emin ol
                document.body.style.overflow = '';
            }, 50);
        }
        
        // Olay tetikle
        document.dispatchEvent(new CustomEvent('panelClosed', { 
            detail: { panelId: panelId }
        }));
        
        // Geri çağırma fonksiyonu varsa çağır
        if (typeof callback === 'function') {
            setTimeout(() => {
                callback();
            }, 300); // Panel kapanma animasyonu için gecikme
        }
        
        return true;
    };
    
    // Tüm panelleri kapat - Scroll düzeltmesi ile
    const closeAllPanels = (callback) => {
        const allPanelIds = [...activePanels];
        
        if (allPanelIds.length === 0) {
            // Panel yoksa scroll'u etkinleştir ve callback'i çağır
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.classList.remove('panel-open');
            
            if (typeof callback === 'function') {
                setTimeout(callback, 50);
            }
            return;
        }
        
        // Her paneli kapat
        allPanelIds.forEach(panelId => {
            closePanel(panelId);
        });
        
        // BUG FIX: Scroll'u etkinleştir
        setTimeout(() => {
            enableScroll();
            document.body.classList.remove('panel-open');
            
            // Geri çağırma fonksiyonu varsa çağır
            if (typeof callback === 'function') {
                callback();
            }
        }, 300);
    };
    
    // Panel durumunu kontrol et
    const isPanelOpen = (panelId) => {
        return activePanels.includes(panelId);
    };
    
    // Modal açma fonksiyonu
    const openModal = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return false;
        
        // Modalı göster
        modal.style.display = 'flex';
        
        // Animasyon için timeout ekle
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
        
        // Sayfanın kaydırmasını devre dışı bırak
        disableScroll();
        
        // Olay tetikle
        document.dispatchEvent(new CustomEvent('modalOpened', { 
            detail: { modalId: modalId }
        }));
        
        return true;
    };
    
    // Modal kapatma fonksiyonu - Scroll düzeltmesi ile
    const closeModal = (modalId, callback) => {
        const modal = document.getElementById(modalId);
        if (!modal) return false;
        
        // Animasyonlu kapanma
        modal.classList.remove('active');
        
        // Animasyon bittikten sonra tamamla
        setTimeout(() => {
            modal.style.display = 'none';
            
            // Başka açık modal yoksa kaydırmayı etkinleştir
            if (!document.querySelector('.modal.active')) {
                // BUG FIX: Geliştirilmiş scroll aktivasyonu
                enableScroll();
                
                // İlave kontrol: body'nin overflow'unu temizle
                document.body.style.overflow = '';
            }
            
            // Olay tetikle
            document.dispatchEvent(new CustomEvent('modalClosed', { 
                detail: { modalId: modalId }
            }));
            
            // Geri çağırma fonksiyonu varsa çağır
            if (typeof callback === 'function') {
                callback();
            }
        }, 300);
        
        return true;
    };
    
    // Modal durumunu kontrol et
    const isModalOpen = (modalId) => {
        const modal = document.getElementById(modalId);
        if (!modal) return false;
        
        return modal.classList.contains('active');
    };
    
    // Dışa aktarılacak fonksiyonlar
    return {
        openPanel,
        closePanel,
        closeAllPanels,
        isPanelOpen,
        openModal,
        closeModal,
        isModalOpen,
        enableScroll, // Dışa açıkça aktardık
        disableScroll // Dışa açıkça aktardık
    };
})();

// DOM yüklendikten sonra event listener'ları ekle
document.addEventListener('DOMContentLoaded', function() {
    // Kategoriler modalı için global erişim
    if (typeof window.showCategoriesModal === 'function') {
        // Orijinal fonksiyonu sakla
        const originalShowCategories = window.showCategoriesModal;
        
        // Yeni geliştirilmiş fonksiyon
        window.showCategoriesModal = function() {
            // Önce tüm panelleri kapat
            PanelController.closeAllPanels();
            
            // Sonra orijinal fonksiyonu çağır
            return originalShowCategories.apply(this, arguments);
        };
    }
    
    // Kategoriler seçim fonksiyonu için gelişmiş sürüm
    if (typeof window.selectCategory === 'function') {
        // Orijinal fonksiyonu sakla
        const originalSelectCategory = window.selectCategory;
        
        // Yeni geliştirilmiş fonksiyon - Scroll düzeltmesi ile
        window.selectCategory = function(categoryId) {
            // Önce tüm panelleri ve modalları kapat
            PanelController.closeAllPanels(() => {
                // BUG FIX: Scroll'u etkinleştirdiğimizden emin ol
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                
                // Kategoriyi seç
                originalSelectCategory.call(this, categoryId);
                
                // BUG FIX: Bir sonraki çerçevede tekrar kontrol et
                requestAnimationFrame(() => {
                    if (document.body.style.overflow === 'hidden') {
                        document.body.style.overflow = '';
                    }
                });
            });
        };
    }
    
    // Olay dinleyicileri kur
    document.addEventListener('click', function(e) {
        // Panel dışına tıklama kontrolü
        if (document.body.classList.contains('panel-open')) {
            // Tıklanan şey bir panel içinde değilse ve bottom-nav-item değilse
            if (!e.target.closest('.categories-panel') && 
                !e.target.closest('.profile-panel') && 
                !e.target.closest('.bottom-nav-item') &&
                !e.target.closest('.modal')) {
                
                PanelController.closeAllPanels();
            }
        }
    });
    
    // Modallar için ESC tuşu ile kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.active');
            if (openModal) {
                const modalId = openModal.id;
                PanelController.closeModal(modalId);
            } else {
                PanelController.closeAllPanels();
            }
        }
    });
    
    // Sayfa yüklendiğinde panel durumunu sıfırla
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            // Sayfa önbellekten geliyorsa
            enableScroll();
            document.body.classList.remove('panel-open');
            activePanels = [];
        }
    });
    
    // BUG FIX: Global scroll düzeltme yardımcısı
    window.fixScroll = function() {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.classList.remove('panel-open');
    };
});

// Global erişim için panel controller'ı dışarı aktar
window.PanelController = PanelController;
