/**
 * Filtreleme Sistemi - Dokunmatik Ekran Optimizasyonları
 * Mobile cihazlar için kaydırma ve dokunma etkileşimlerini iyileştirir
 */

document.addEventListener('DOMContentLoaded', function() {
    // Filtre konteynerini seç
    const filterContainer = document.querySelector('.filter-container');
    if (!filterContainer) return;
    
    // Kaydırma kontrolü değişkenleri
    let isScrolling = false;
    let startX;
    let scrollLeft;
    
    // Dokunma olayları için kaydırma davranışını optimize et
    filterContainer.addEventListener('touchstart', function(e) {
        isScrolling = true;
        startX = e.touches[0].pageX - filterContainer.offsetLeft;
        scrollLeft = filterContainer.scrollLeft;
        
        // Dokunma sırasında yumuşak kaydırma için
        filterContainer.style.scrollBehavior = 'auto';
    });
    
    filterContainer.addEventListener('touchmove', function(e) {
        if (!isScrolling) return;
        
        // Touch hareketini hesapla
        const x = e.touches[0].pageX - filterContainer.offsetLeft;
        const walk = (x - startX) * 1.5; // Kaydırma hızını ayarla
        
        // Kaydırma uygula
        filterContainer.scrollLeft = scrollLeft - walk;
        
        // Kaydırma ucuna gelince scroll hint göster/gizle
        updateScrollHint();
    });
    
    filterContainer.addEventListener('touchend', function() {
        isScrolling = false;
        
        // Kaydırma bitince yumuşak kaydırma özelliğini geri aç
        setTimeout(() => {
            filterContainer.style.scrollBehavior = 'smooth';
        }, 50);
    });
    
    // Farede kaydırma için de benzer özellikleri uygula
    filterContainer.addEventListener('mousedown', function(e) {
        e.preventDefault(); // Metin seçimini önle
        isScrolling = true;
        startX = e.pageX - filterContainer.offsetLeft;
        scrollLeft = filterContainer.scrollLeft;
        
        // Sürükle sırasında yumuşak kaydırma için
        filterContainer.style.scrollBehavior = 'auto';
        
        // İmleç değiştir
        filterContainer.style.cursor = 'grabbing';
    });
    
    filterContainer.addEventListener('mousemove', function(e) {
        if (!isScrolling) return;
        
        // Mouse hareketini hesapla
        const x = e.pageX - filterContainer.offsetLeft;
        const walk = (x - startX) * 1.5;
        
        // Kaydırma uygula
        filterContainer.scrollLeft = scrollLeft - walk;
        
        // Kaydırma ucuna gelince scroll hint göster/gizle
        updateScrollHint();
    });
    
    filterContainer.addEventListener('mouseup', function() {
        isScrolling = false;
        filterContainer.style.cursor = 'grab';
        
        // Sürükleme bitince yumuşak kaydırma özelliğini geri aç
        setTimeout(() => {
            filterContainer.style.scrollBehavior = 'smooth';
        }, 50);
    });
    
    filterContainer.addEventListener('mouseleave', function() {
        if (isScrolling) {
            isScrolling = false;
            filterContainer.style.cursor = 'grab';
            
            // Fare çıktığında yumuşak kaydırma özelliğini geri aç
            setTimeout(() => {
                filterContainer.style.scrollBehavior = 'smooth';
            }, 50);
        }
    });
    
    // Fare tekerleğiyle yatay kaydırma
    filterContainer.addEventListener('wheel', function(e) {
        e.preventDefault();
        filterContainer.scrollLeft += e.deltaY;
        updateScrollHint();
    });
    
    // Kaydırma ipucunu güncelle - sağda daha fazla içerik var mı göster
    function updateScrollHint() {
        const scrollHint = document.querySelector('.filter-scroll-hint');
        if (!scrollHint) return;
        
        // Eğer en sağa ulaştıysak ipucunu gizle
        const isAtEnd = filterContainer.scrollLeft + filterContainer.clientWidth >= filterContainer.scrollWidth - 10;
        
        if (isAtEnd) {
            scrollHint.style.opacity = '0';
            filterContainer.classList.add('scrolled-to-end');
        } else {
            scrollHint.style.opacity = '1';
            filterContainer.classList.remove('scrolled-to-end');
        }
    }
    
    // Sayfa yüklendiğinde kaydırma ipucunu kontrol et
    window.addEventListener('load', function() {
        updateScrollHint();
        
        // İlk yüklendiğinde grab cursor ayarla
        filterContainer.style.cursor = 'grab';
    });
    
    // Ekran yeniden boyutlandığında kaydırma ipucunu güncelle
    window.addEventListener('resize', updateScrollHint);
    
    // Filtre butonları için tıklama/dokunma geri bildirimi
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        // Dalga efekti için tıklama olayı
        btn.addEventListener('click', function(e) {
            // Ripple (dalga) elementini oluştur
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Tıklama pozisyonunu al
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            
            // Dalga için pozisyon hesapla
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Dalga boyutu ve pozisyonunu ayarla
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Animasyon bitince elementı kaldır
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(15);
            }
        });
        
        // Dokunma etkileşimleri için ek gezinme kolaylıkları
        btn.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        btn.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });
    });
});
