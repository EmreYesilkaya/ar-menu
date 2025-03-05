/**
 * Modal ve Kategori Scroll Yardımcısı
 * Kategori ve modal geçişlerindeki scroll sorunlarını düzelten çok basit yardımcı script
 */

document.addEventListener('DOMContentLoaded', function() {
    // Scroll davranışını gözlemle
    let isProcessingCategorySelection = false;
    
    // Kategori seçimine özel iyileştirme
    const originalSelectCategory = window.selectCategory;
    if (originalSelectCategory) {
        window.selectCategory = function(categoryId) {
            // Çift çağrıları önle
            if (isProcessingCategorySelection) return;
            isProcessingCategorySelection = true;
            
            console.log('🔍 Kategori seçimi iyileştirmesi çalışıyor:', categoryId);
            
            // Scroll kilidini temizle - çok basit ve direkt yaklaşım
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            
            // Orijinal işlemi çağır
            originalSelectCategory(categoryId);
            
            // Kategori seçimi ve kaydırma sonrası bir daha kontrol et
            setTimeout(() => {
                document.body.style.overflow = '';
                document.body.style.position = '';
                isProcessingCategorySelection = false;
            }, 500);
        };
    }
    
    // Tıklama olaylarını dinleyerek scroll sorunlarını düzelt
    document.addEventListener('click', function(e) {
        // Kategori öğesine tıklandığında
        if (e.target.closest('.category-item')) {
            // Kategoriler modalında bir öğeye tıklandığında
            console.log('📌 Kategori öğesine tıklandı, scroll kontrolü yapılıyor');
            
            // Scroll kontrolü ve düzeltme
            setTimeout(() => {
                if (document.body.style.overflow === 'hidden') {
                    console.log('🛠️ Modal kapanışı sonrası scroll sorunu tespit edildi');
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                }
            }, 400); // Modal kapanma animasyonu sonrası
        }
    });
    
    // Modal kapatıldığında scroll kontrolü
    document.addEventListener('modalClosed', function(event) {
        if (event.detail.modalId === 'categoriesModal') {
            console.log('🔔 Kategoriler modalı kapandı, scroll kontrolü yapılıyor');
            
            // Modal animasyonu sonrası scroll kontrolü
            setTimeout(() => {
                if (document.body.style.overflow === 'hidden') {
                    document.body.style.overflow = '';
                    document.body.style.position = '';
                    document.body.style.top = '';
                    document.body.style.width = '';
                    console.log('🔓 Modal kapanışı sonrası scroll engeli kaldırıldı');
                }
            }, 350);
        }
    });
    
    // Sağlık kontrolü
    console.log('📱 Modal Scroll Yardımcısı hazır');
});
