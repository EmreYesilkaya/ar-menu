
/**
 * AR Menü Uygulaması - Debug Araçları
 * Uygulamanın sorunlarının tespit edilmesi ve giderilmesi için yardımcı fonksiyonlar
 */

// Bileşenlerin durumunu konsola yazdırmak için
const MenuDebug = {
    // Etiket sistemini kontrol et
    checkTags: function() {
        console.group('🏷️ Etiket Sistemi Kontrolü');
        
        // Tüm etiket konteynerlerini bul
        const tagContainers = document.querySelectorAll('.food-tags');
        console.log(`${tagContainers.length} adet etiket konteyneri bulundu.`);
        
        let moreButtonCount = 0;
        let hiddenTagsCount = 0;
        
        // Her konteyner için bilgi al
        tagContainers.forEach((container, index) => {
            // Daha fazla butonu var mı?
            const moreBtn = container.querySelector('.tag-more');
            
            // Gizli etiketler var mı?
            const hiddenTags = container.querySelectorAll('.hidden-tag');
            
            if (moreBtn) moreButtonCount++;
            hiddenTagsCount += hiddenTags.length;
            
            // Sorunlu konteyner varsa bilgi ver
            if (moreBtn && hiddenTags.length === 0) {
                console.warn(`⚠️ Konteyner #${index+1}: 'Daha fazla' butonu var ama gizli etiket yok.`);
            } else if (!moreBtn && hiddenTags.length > 0) {
                console.warn(`⚠️ Konteyner #${index+1}: Gizli etiket var ama 'Daha fazla' butonu yok.`);
            }
        });
        
        console.log(`Toplam ${moreButtonCount} daha fazla butonu var.`);
        console.log(`Toplam ${hiddenTagsCount} gizli etiket var.`);
        
        // Etiket butonlarına tıklama olayı eklenmiş mi kontrol et
        console.log('\n🔍 Etiket butonlarının işlevleri kontrol ediliyor...');
        const moreBtns = document.querySelectorAll('.tag-more');
        
        moreBtns.forEach((btn, i) => {
            const hasClickHandler = btn.onclick || getEventListeners(btn, 'click')?.length > 0;
            
            if (!hasClickHandler) {
                console.error(`❌ #${i+1} 'Daha fazla' butonuna tıklama olayı eklenmemiş!`);
            }
        });
        
        console.groupEnd();
    },
    
    // Etiketleri manuel olarak açma işlevi
    forceExpandTags: function() {
        // Tüm daha fazla butonlarını bul
        const moreBtns = document.querySelectorAll('.tag-more');
        console.log(`${moreBtns.length} adet 'Daha fazla' butonu bulundu, zorla açılıyor...`);
        
        moreBtns.forEach((btn) => {
            // Her butona otomatik tıklama tetikle
            const container = btn.closest('.food-tags');
            const hiddenTags = container ? container.querySelectorAll('.hidden-tag') : [];
            
            if (container && hiddenTags.length > 0) {
                hiddenTags.forEach(tag => {
                    tag.classList.remove('hidden');
                    tag.style.display = 'inline-flex';
                });
                
                // Buton metnini güncelle
                btn.textContent = 'Daha az göster';
                btn.style.backgroundColor = '#e0e0e0';
            }
        });
        
        return `${moreBtns.length} adet etiket açıldı.`;
    },
    
    // Tüm bileşenlerin durumunu göster
    status: function() {
        console.group('📊 Menü Uygulaması Durumu');
        
        // Kategorileri ve öğeleri say
        const categories = document.querySelectorAll('.menu-section');
        let itemCount = 0;
        categories.forEach(cat => {
            const items = cat.querySelectorAll('.menu-item');
            console.log(`${cat.id}: ${items.length} öğe`);
            itemCount += items.length;
        });
        
        console.log(`Toplam: ${categories.length} kategori, ${itemCount} menü öğesi`);
        
        // Tarayıcı bilgileri
        console.log(`Tarayıcı: ${navigator.userAgent}`);
        console.log(`Ekran boyutu: ${window.innerWidth}x${window.innerHeight}`);
        
        // Yüklü modülleri kontrol et
        console.log('\n📚 Yüklü modüller:');
        const modules = [
            'MenuRenderer', 'setupExpandableTags', 'toggleFavorite',
            'applyFilters', 'showARModel', 'enhanceTagsWithEmojis'
        ];
        
        modules.forEach(module => {
            console.log(`${module}: ${typeof window[module] !== 'undefined' ? '✅' : '❌'}`);
        });
        
        console.groupEnd();
    }
};

// Sayfa yüklendikten sonra Debug araçlarını global olarak tanımla
window.addEventListener('load', function() {
    console.log('🛠️ Debug araçları yüklendi. MenuDebug objesi ile kullanabilirsiniz.');
    window.MenuDebug = MenuDebug;
    
    // Sayfa sorunu gösteriyorsa 2 saniye sonra otomatik kontrol et
    setTimeout(function() {
        MenuDebug.checkTags();
    }, 2000);
});

// Etiket işlevi sorunlarını düzeltmek için ek işlevler
document.addEventListener('DOMContentLoaded', function() {
    // Daha fazla butonu için doğrudan tıklama işlevi
    window.expandTag = function(selector) {
        const moreBtn = document.querySelector(selector);
        if (moreBtn) {
            console.log('Daha fazla butonuna tıklama tetikleniyor...');
            moreBtn.click();
            return 'Tıklama tetiklendi.';
        } else {
            return 'Buton bulunamadı! Doğru seçici kullandığınızdan emin olun.';
        }
    };
    
    // Tüm daha fazla butonlarını direkt açma işlevi
    window.expandAllTags = function() {
        document.querySelectorAll('.tag-more').forEach(btn => btn.click());
        return 'Tüm etiketler için tıklama tetiklendi.';
    };
});

// "+" butonlarının işlevini doğrudan DOM üzerinden düzeltmek için acil durum fonksiyonu
function fixMoreTagButtons() {
    console.log('Artı düğmelerini tamir ediyorum...');
    
    document.querySelectorAll('.tag-more').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Etiket konteynerini bul
            const container = this.closest('.food-tags');
            if (!container) return;
            
            // Gizli etiketleri bul
            const hiddenTags = container.querySelectorAll('.hidden-tag');
            
            // Hepsinin görünürlüğünü tersine çevir
            hiddenTags.forEach(tag => {
                if (tag.style.display === 'none' || tag.classList.contains('hidden')) {
                    tag.style.display = 'inline-flex';
                    tag.classList.remove('hidden');
                    this.textContent = 'Daha az göster';
                } else {
                    tag.style.display = 'none';
                    tag.classList.add('hidden');
                    this.textContent = `+${hiddenTags.length} daha`;
                }
            });
        });
    });
}

// Sayfa yüklendiğinde acil düzeltmeyi uygula
window.addEventListener('load', () => setTimeout(fixMoreTagButtons, 1500));
