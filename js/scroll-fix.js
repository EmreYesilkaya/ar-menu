/**
 * Acil Durum Scroll Düzeltici
 * Kategoriler seçiminde sayfanın kilitlenmesi sorununu çözer
 */

// Kaçış planı - tüm scroll sorunlarını çözecek acil müdahale sistemi
(function() {
    // Scroll stillerini zorla temizleyen fonksiyon
    function emergencyScrollFix() {
        console.log('🚨 Acil durum scroll düzeltme çalıştı');
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.paddingRight = '';
        document.documentElement.style.overflow = '';
        
        // Tüm scroll engelleme class'larını kaldır
        document.body.classList.remove('modal-open');
        document.body.classList.remove('no-scroll');
        document.body.classList.remove('panel-open');
        document.body.classList.remove('scroll-locked');
        
        // Ek güvenlik: Tüm stilleri inline olarak geçersiz kıl
        document.body.setAttribute('style', 'overflow: auto !important');
        setTimeout(() => {
            document.body.removeAttribute('style');
        }, 100);
    }
    
    // Sayfanın yüklenmesi tamamlandığında
    window.addEventListener('DOMContentLoaded', function() {
        console.log('🔧 Acil durum scroll düzeltici hazır');
        
        // Modal kapatılması ve kategori seçimi olaylarını izle
        document.addEventListener('modalClosed', function(e) {
            console.log('Modal kapandı, acil scroll düzeltme yapılıyor');
            emergencyScrollFix();
        });
        
        // Tüm kategorilere tıklama olayını izle
        document.addEventListener('click', function(e) {
            // Kategoriye tıklandığında
            if (e.target.closest('.category-item')) {
                console.log('Kategori öğesine tıklandı, scroll düzeltiliyor');
                // İki kez çalıştır - biri hemen, diğeri gecikmeli
                emergencyScrollFix();
                setTimeout(emergencyScrollFix, 500);
            }
            
            // Kategoriler butonuna tıklandığında
            if (e.target.closest('[data-action="categories"]')) {
                console.log('Kategoriler butonuna tıklandı, modal açılıyor');
                // Modaldan önce scroll durumunu temizle
                setTimeout(emergencyScrollFix, 2000);
            }
        });
        
        // Acil durum scroll düzeltme tuşu - test için
        // Klavyede S tuşuna basınca scroll düzeltir
        document.addEventListener('keydown', function(e) {
            if (e.key === 's' || e.key === 'S') {
                console.log('❗ Manuel scroll düzeltme çağrıldı (S tuşu)');
                emergencyScrollFix();
            }
        });
        
        // Sürekli scroll kontrolü
        let scrollStuckDetector = 0;
        window.addEventListener('scroll', function() {
            // Scroll çalıştığında sayacı sıfırla
            scrollStuckDetector = 0;
        }, { passive: true });
        
        // Scroll kilitlenme kontrolü - her 3 saniyede
        setInterval(function() {
            scrollStuckDetector++;
            
            // 2 kontrol süresince hiç scroll olayı tetiklenmediyse ve body'de overflow:hidden varsa
            if (scrollStuckDetector >= 2 && document.body.style.overflow === 'hidden') {
                console.log('⚠️ Scroll kilitlenmesi tespit edildi, düzeltiliyor...');
                emergencyScrollFix();
            }
        }, 3000);
        
        // Global erişim için ekle
        window.emergencyScrollFix = emergencyScrollFix;
        
        // İlk çalıştırma
        setTimeout(emergencyScrollFix, 500);
    });
    
    // Sayfa yeniden görüntülendiğinde scroll durumunu düzelt
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            console.log('Sayfa cache\'den yüklendi, scroll düzeltiliyor');
            setTimeout(emergencyScrollFix, 200);
        }
    });
})();
