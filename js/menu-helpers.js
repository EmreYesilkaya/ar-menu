/**
 * Menü ve Kategoriler Yardımcısı
 * Menü sekmeleri ve kategoriler arasındaki geçişleri düzenler
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 Menü yardımcısı başlatıldı');
    
    // Menü sekmeleri için olay dinleyici ekle
    const menuTabs = document.querySelectorAll('.menu-tab');
    if (menuTabs.length > 0) {
        menuTabs.forEach(tab => {
            // Orijinal olay dinleyicisini koru ama scroll durumunu düzelt
            const originalClickHandler = tab.onclick;
            
            tab.onclick = function(e) {
                // Sayfanın scrollunu düzelt
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                
                // Varsa orijinal click işleyicisini çağır
                if (typeof originalClickHandler === 'function') {
                    originalClickHandler.call(this, e);
                }
                
                // Sekmeler arasında geçiş yap
                const targetId = this.getAttribute('data-target');
                if (!targetId) return;
                
                // Tüm sekmeleri pasif yap
                menuTabs.forEach(tab => tab.classList.remove('active'));
                
                // Bu sekmeyi aktif yap
                this.classList.add('active');
                
                // Gecikmeyle tekrar scroll kontrolü
                setTimeout(() => {
                    document.body.style.overflow = '';
                    
                    // Acil durum düzeltici varsa kullan
                    if (typeof window.emergencyScrollFix === 'function') {
                        window.emergencyScrollFix();
                    }
                }, 100);
            };
        });
    }
    
    // Kategoriler için global kontrol
    if (typeof window.selectCategory === 'function') {
        // Orijinal kategori seçim fonksiyonu
        const originalSelectCategory = window.selectCategory;
        
        // Kategori seçimi için iyileştirilmiş fonksiyon - scroll düzeltme ekler
        window.selectCategory = function(categoryId) {
            // Scrollu düzelt
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            
            try {
                // Orijinal kategori seçimini çağır
                originalSelectCategory(categoryId);
            } catch (err) {
                console.error('Kategori seçim hatası:', err);
            }
            
            // Gecikmeyle scrollu tekrar kontrol et
            setTimeout(() => {
                document.body.style.overflow = '';
                document.body.style.position = '';
                
                // Acil durum düzeltici varsa kullan
                if (typeof window.emergencyScrollFix === 'function') {
                    window.emergencyScrollFix();
                }
            }, 500);
        };
    }
    
    // Kategorilere tıklandığında scroll kontrolü ekleyici
    document.addEventListener('click', function(e) {
        // Kategori öğesine tıklandığında
        if (e.target.closest('.category-item')) {
            setTimeout(() => {
                document.body.style.overflow = '';
                document.body.style.position = '';
                
                // Acil durum düzeltici varsa kullan
                if (typeof window.emergencyScrollFix === 'function') {
                    window.emergencyScrollFix();
                }
            }, 600);
        }
    });
    
    console.log('📋 Menü yardımcısı hazır');
});
