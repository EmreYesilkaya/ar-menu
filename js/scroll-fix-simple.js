/**
 * BASİTLEŞTİRİLMİŞ SCROLL DÜZELTME SİSTEMİ (GELİŞTİRİLMİŞ)
 * Scroll sorunlarını minimum kod ile çözer
 */

(function() {
    // Sayfa yüklendiğinde inicialize et
    document.addEventListener('DOMContentLoaded', initialize);
    
    function initialize() {
        console.log('📜 Basit Scroll Düzeltme sistemi başlatıldı');
        
        // Modal açılıp kapanma olaylarını dinle
        document.addEventListener('categoriesModalClosed', enableScroll);
        
        // Tüm kategorilere tıklama olayını dinle - güçlü seçici kullan
        document.addEventListener('click', function(e) {
            const categoryItem = e.target.closest('.category-item');
            if (categoryItem) {
                console.log('Kategori öğesine tıklandı - scroll düzeltiliyor');
                // Kategori öğesine tıklandığında scroll'u düzelt
                enableScroll();
                
                // Gecikmeyle tekrar kontrol et
                setTimeout(enableScroll, 300);
                setTimeout(enableScroll, 800);
            }
        }, true); // Capture phase'de çalışsın - tıklamaları yakalamak için
        
        // Tüm butonlara tıklama olayını dinle
        document.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                console.log('Butona tıklandı - scroll kontrolü yapılıyor');
                checkScrollStatus();
            }
        }, true);
        
        // Periyodik kontroller
        setInterval(checkScrollStatus, 1000);
        
        // Bu sistem için global API oluştur
        window.ScrollFix = {
            enable: enableScroll,
            check: checkScrollStatus,
            forceEnable: forceEnableScroll,
            forceFixScroll: forceFixScroll
        };
        
        // Sayfada gezinme sırasında temizleme
        window.addEventListener('beforeunload', enableScroll);
        window.addEventListener('pageshow', function(e) {
            if (e.persisted) {
                // Sayfa önbellekten geri döndüğünde
                enableScroll();
            }
        });
        
        // İlk çalıştırma
        enableScroll();
    }
    
    // Scroll durumunu düzelt
    function enableScroll() {
        // Scroll stillerini düzelt
        document.documentElement.style.overflow = '';
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.paddingRight = '';
        
        // Scroll engelleme sınıflarını kaldır
        document.body.classList.remove('no-scroll', 'soft-no-scroll', 'modal-open', 'panel-open');
        
        return true;
    }
    
    // Scroll durumunu zorla etkinleştir
    function forceEnableScroll() {
        enableScroll();
        
        // Ek olarak !important kullanarak stil eklemek için
        const style = document.createElement('style');
        style.textContent = `
            html, body {
                overflow: auto !important;
                position: static !important;
                height: auto !important;
                width: auto !important;
            }
        `;
        document.head.appendChild(style);
        
        // Stil etki etmesi için kısa bir süre bekle, sonra kaldır
        setTimeout(() => {
            document.head.removeChild(style);
        }, 1000);
        
        return true;
    }
    
    // Scroll durumunu kontrol et
    function checkScrollStatus() {
        // Eğer overflow hidden ama açık modal yoksa düzelt
        if (getComputedStyle(document.body).overflow === 'hidden') {
            const hasOpenModal = document.querySelector('.modal.active, .categories-modal.active, .panel.active, .profile-panel.active');
            
            if (!hasOpenModal) {
                console.log('🔄 Scroll durumu kontrol ediliyor - scroll engelleme tespit edildi');
                enableScroll();
                return true; // Düzelme yapıldı
            }
        }
        
        return false; // Düzelme yapılmadı
    }
    
    // Scroll sorunlarını tamamen düzelt
    function forceFixScroll() {
        // Önce normal düzeltme dene
        enableScroll();
        
        // Tüm olası sorunlu stilleri temizle
        document.body.style = '';
        document.documentElement.style = '';
        
        // Tüm scroll engelleme sınıflarını kaldır
        document.body.className = document.body.className
            .replace(/no-scroll|soft-no-scroll|modal-open|panel-open|overflow-hidden/g, '')
            .trim();
        
        console.log('🛠 Scroll zorla düzeltildi');
        return true;
    }
})();
