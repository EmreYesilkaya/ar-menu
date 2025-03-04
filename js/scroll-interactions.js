/**
 * Sayfa kaydırma etkileşimleri için JavaScript
 * - Header'ın görünürlüğünü kontrol eder
 * - Yukarı çık butonunu yönetir
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elemanlar
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('backToTop');
    
    // Son kaydırma pozisyonu
    let lastScrollTop = 0;
    
    // Kaydırma olayını dinle
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Yukarı çık butonunun görünürlüğü
        if (scrollTop > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
        
        // Header için kaydırma davranışı
        if (scrollTop > 100) {
            // Aşağı kaydırma - header'ı gizle
            if (scrollTop > lastScrollTop) {
                header.classList.add('header-hidden');
            } 
            // Yukarı kaydırma - header'ı göster
            else {
                header.classList.remove('header-hidden');
            }
            
            // Küçük header stilini uygula
            header.classList.add('header-scrolled');
        } else {
            // Sayfa tepesine yakınsa normal boyutta göster
            header.classList.remove('header-scrolled');
            header.classList.remove('header-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Negatif değerlerle uğraşmayalım
    }, { passive: true }); // Performans için passive true
    
    // Yukarı çık butonuna tıklama olayı
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            // Sayfanın en üstüne yumuşak kaydırma
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Dokunmatik geri bildirim (titreşim)
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });
    }
});
