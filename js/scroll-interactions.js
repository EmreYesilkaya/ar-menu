/**
 * Scroll İşlemleri - Back to Top Butonu
 * Responsive ve mobil uyumlu çözüm sağlar
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Scroll interactions başlatılıyor...');
    
    // Back to top butonu
    let backToTopBtn = document.getElementById('backToTop');
    
    // Buton yoksa oluştur (sayfada zaten varsa kullanır)
    if (!backToTopBtn) {
        console.log('Back to top butonu oluşturuluyor...');
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTop';
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.setAttribute('aria-label', 'Sayfanın başına dön');
        backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    } else {
        console.log('Mevcut back to top butonu bulundu');
    }
    
    // Kaydırma olayını dinle
    window.addEventListener('scroll', function() {
        // 300px'den fazla kaydırma varsa butonu göster
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
            
            // Bottom nav yüksekliğini hesapla (varsa)
            const bottomNav = document.querySelector('.bottom-nav');
            const bottomNavHeight = bottomNav ? bottomNav.offsetHeight : 0;
            
            // Buton pozisyonunu ayarla
            backToTopBtn.style.bottom = (bottomNavHeight + 15) + 'px';
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Tıklama olayını ekle
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Back to top butonuna tıklandı');
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Haptik geribildirim (titreşim) - destekleniyorsa
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }
    });
    
    // Sayfa yüklendiğinde scroll pozisyonunu kontrol et
    if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
        
        // Bottom nav yüksekliğini hesapla (varsa)
        const bottomNav = document.querySelector('.bottom-nav');
        const bottomNavHeight = bottomNav ? bottomNav.offsetHeight : 0;
        
        // Buton pozisyonunu ayarla
        backToTopBtn.style.bottom = (bottomNavHeight + 15) + 'px';
    }
    
    // Pencere yeniden boyutlandırıldığında buton pozisyonunu güncelle
    window.addEventListener('resize', function() {
        if (backToTopBtn.classList.contains('visible')) {
            // Bottom nav yüksekliğini hesapla (varsa)
            const bottomNav = document.querySelector('.bottom-nav');
            const bottomNavHeight = bottomNav ? bottomNav.offsetHeight : 0;
            
            // Buton pozisyonunu ayarla
            backToTopBtn.style.bottom = (bottomNavHeight + 15) + 'px';
        }
    });
});
