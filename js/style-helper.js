/**
 * Stil Yardımcısı
 * Kategoriler ve scroll ile ilgili stil sorunlarını çözer
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('⚙️ Stil yardımcısı çalışıyor');
    
    // Orijinal smooth-scroll davranışını devre dışı bırak
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    
    // Sayfa scroll davranışını düzelt - sayfanın takılmasına neden olabilecek özellikleri kaldır
    function fixScrollStyle() {
        // Smooth-scroll davranışını kaldır
        document.documentElement.style.scrollBehavior = 'auto';
        document.body.style.scrollBehavior = 'auto';
        
        // Body stillerini temizle
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
    }
    
    // API - Global erişim
    window.fixScrollStyle = fixScrollStyle;
    
    // Kategori seçildiğinde scroll stillerini düzelt
    document.addEventListener('click', function(e) {
        if (e.target.closest('.category-item')) {
            console.log('👆 Kategori öğesine tıklandı - scroll stillerini düzeltme');
            fixScrollStyle();
            
            // Biraz gecikmeyle tekrar kontrol et
            setTimeout(fixScrollStyle, 500);
        }
    });
    
    // Sayfa scroll olayını dinle - herhangi bir problem olursa düzelt
    document.addEventListener('scroll', function() {
        // Eğer body üzerinde overflow:hidden varsa düzelt
        if (document.body.style.overflow === 'hidden') {
            console.log('🛑 Scroll olayı sırasında overflow:hidden tespit edildi - düzeltiliyor');
            fixScrollStyle();
        }
    }, { passive: true });
    
    // Sayfa ilk yüklendiğinde stilleri düzelt
    fixScrollStyle();
    
    // Sayfada gezinirken belirli aralıklarla kontrol et
    setInterval(fixScrollStyle, 2000);
});
