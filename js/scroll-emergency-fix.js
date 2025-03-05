/**
 * ACİL SCROLL DÜZELTME SİSTEMİ
 * Kategori seçimi sonrası oluşan scroll kilitlenmesini kesin olarak çözer
 */

(function() {
    // Sayfa yüklenir yüklenmez çalışmaya başla
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollFix);
    } else {
        initScrollFix();
    }

    function initScrollFix() {
        console.log('🚑 Acil scroll düzeltme sistemi başlatıldı');

        // Scroll stillerini tamamen sıfırlayan fonksiyon
        function resetScrollStyles() {
            // Tüm scroll engelleme stillerini zorla sıfırla
            document.documentElement.style.cssText += 'overflow: auto !important; height: auto !important;';
            document.body.style.cssText += 'overflow: auto !important; position: static !important; height: auto !important; top: auto !important; left: auto !important; width: auto !important;';
            
            // Tüm scroll-blocking sınıflarını kaldır
            document.body.classList.remove('no-scroll', 'modal-open', 'panel-open', 'scroll-locked');
            
            console.log('🔧 Scroll düzeltmesi uygulandı');
        }

        // Kategori tıklamaları için özel dinleyici
        document.addEventListener('click', function(e) {
            // Kategori öğesine tıklandıysa
            if (e.target.closest('.category-item')) {
                console.log('📋 Kategori öğesine tıklandı, scroll kontrolü başlatılıyor');
                
                // Önce normal işlemi gerçekleştirsin diye kısa bir süre bekle
                setTimeout(resetScrollStyles, 300);
                // Gecikmeli kontrol (modal kapanma ve kategori geçişinden sonra)
                setTimeout(resetScrollStyles, 800);
                // Son kontrol
                setTimeout(resetScrollStyles, 1500);
            }
        });

        // Modal kapatıldığında da kontrol et
        document.addEventListener('modalClosed', function() {
            console.log('🚪 Modal kapandı, scroll durumunu kontrol ediyorum');
            setTimeout(resetScrollStyles, 100);
            setTimeout(resetScrollStyles, 500);
        });

        // Özel key kombinasyonu ile manuel scroll düzeltmesi (opsiyonel)
        document.addEventListener('keydown', function(e) {
            // Alt+S tuş kombinasyonu ile manuel scroll düzeltme
            if (e.altKey && e.key.toLowerCase() === 's') {
                console.log('⌨️ Manuel scroll düzeltme tetiklendi');
                resetScrollStyles();
                alert('Scroll düzeltildi! Sayfa artık kaydırılabilir olmalı.');
            }
        });

        // Periyodik scroll durum kontrolü (son çare)
        setInterval(function() {
            // Eğer overflow hidden ama açık modal yoksa düzelt
            if (getComputedStyle(document.body).overflow === 'hidden' && 
                !document.querySelector('.modal[style*="display: flex"]') && 
                !document.querySelector('.categories-panel.active')) {
                
                console.log('🔄 Scroll sorunu tespit edildi, otomatik düzeltiliyor');
                resetScrollStyles();
            }
        }, 2000); // Her 2 saniyede bir kontrol et

        // Kullanıcı etkileşiminde scroll durumunu kontrol et
        document.addEventListener('touchstart', function() {
            setTimeout(function() {
                if (getComputedStyle(document.body).overflow === 'hidden' && 
                    !document.querySelector('.modal[style*="display: flex"]') && 
                    !document.querySelector('.categories-panel.active')) {
                    resetScrollStyles();
                }
            }, 100);
        }, {passive: true});

        // Global API - herhangi bir yerden erişilebilir
        window.emergencyFixScroll = resetScrollStyles;

        // Sayfa yüklendiğinde ilk düzeltme
        resetScrollStyles();
        
        // Kategori seçim fonksiyonunu özelleştir (mevcutsa)
        if (typeof window.selectCategory === 'function') {
            const originalSelectCategory = window.selectCategory;
            window.selectCategory = function(categoryId) {
                // Scroll stillerini düzelt - önce
                resetScrollStyles();
                
                try {
                    // Orijinal fonksiyonu çağır
                    originalSelectCategory(categoryId);
                } finally {
                    // Kategoriye gitme işlemi sonrası scroll stillerini düzelt
                    setTimeout(resetScrollStyles, 100);  // Hemen
                    setTimeout(resetScrollStyles, 500);  // 0.5 saniye sonra
                    setTimeout(resetScrollStyles, 1000); // 1 saniye sonra
                }
            };
        }

        // Stil ekle - her zaman scrollu etkinleştiren CSS kuralı
        const scrollFixStyle = document.createElement('style');
        scrollFixStyle.textContent = `
            /* Özel scroll düzeltme stili */
            html.scroll-enabled, html.scroll-enabled body {
                overflow: auto !important;
                height: auto !important;
                position: static !important;
                width: auto !important;
                overscroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(scrollFixStyle);
        document.documentElement.classList.add('scroll-enabled');

        console.log('✅ Acil scroll düzeltme sistemi hazır');
    }
})();
