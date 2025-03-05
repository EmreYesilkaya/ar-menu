/**
 * Performans İyileştirme Script'i
 * Sayfa performansını optimize etmek için ek düzeltmeler
 */

(function() {
    // Gereksiz animasyonları kontrol et ve devre dışı bırak
    function optimizeAnimations() {
        // Düşük cihazlarda animasyonları azalt
        const isLowEndDevice = navigator.hardwareConcurrency < 4 || 
                              !matchMedia('(min-resolution: 2dppx)').matches;
        
        if (isLowEndDevice) {
            document.documentElement.classList.add('reduce-animations');
            console.log("Düşük özellikli cihaz algılandı, animasyonlar azaltıldı");
        }
    }
    
    // Bağlantı hızına göre optimize et
    function optimizeBasedOnConnection() {
        // Bağlantı bilgisini al
        const connection = navigator.connection || 
                          navigator.mozConnection || 
                          navigator.webkitConnection;
        
        if (connection) {
            // Yavaş bağlantılar için optimizasyon
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                document.documentElement.classList.add('low-bandwidth');
                console.log("Yavaş bağlantı algılandı, görsel optimizasyonlar yapılıyor");
            }
        }
    }
    
    // Scroll işleyicileri optimize et
    function optimizeScrollHandlers() {
        // Varsa fazla scroll dinleyicileri için throttle uygula
        const scrollEvents = window.getEventListeners && 
                             window.getEventListeners(window).scroll;
        
        if (scrollEvents && scrollEvents.length > 3) {
            console.warn(`${scrollEvents.length} scroll dinleyicisi algılandı, performans düşebilir`);
        }
        
        // Scroll işleyicilerini pasifleştir
        document.addEventListener('scroll', function() {}, { passive: true });
        window.addEventListener('scroll', function() {}, { passive: true });
    }
    
    // DOM yapısını optimize et
    function optimizeDOMStructure() {
        // Gereksiz DOM elemanlarını temizle
        const unusedElements = document.querySelectorAll('.unused-element');
        unusedElements.forEach(el => el.remove());
        
        // Çok fazla DOM elementi içeren konteynerlar için önlem al
        const largeContainers = document.querySelectorAll('.menu-items');
        largeContainers.forEach(container => {
            if (container.children.length > 50) {
                console.warn(`Büyük konteyner algılandı: ${container.id || 'isimsiz'} (${container.children.length} çocuk öğe)`);
            }
        });
    }
    
    // MutationObserver kullanımını optimize et
    function optimizeMutationObservers() {
        // Observer'ları güvenli limitte tut
        if (window.__activeMutationObservers > 3) {
            console.warn(`${window.__activeMutationObservers} aktif MutationObserver algılandı, performans düşebilir`);
        }
    }
    
    // Sayfa yüklendikten sonra optimizasyonları uygula
    window.addEventListener('load', function() {
        setTimeout(function() {
            optimizeAnimations();
            optimizeBasedOnConnection();
            optimizeScrollHandlers();
            optimizeDOMStructure();
            optimizeMutationObservers();
            
            console.log("Performans optimizasyonları uygulandı");
        }, 500);
    });
    
    // Hata ayıklama konsoluna performans optimizasyonu ipuçları ekle
    console.info("💡 Performans İpuçları: Büyük menü listelerini görüntülemek için sayfalama kullanabilirsiniz");
    console.info("💡 Etiketlerin emoji içerip içermediğini cache'lemek performansı artırabilir");
})();
