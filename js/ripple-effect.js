/**
 * Ripple Effect (Dalga Efekti)
 * Tüm tıklanabilir elemanlara dalga efekti ekler
 * Material Design tarzı görsel geri bildirim sağlar
 */

document.addEventListener('DOMContentLoaded', function() {
    // Dalga efekti eklenecek elementler
    const rippleSelectors = [
        '.food-tag',
        '.filter-btn',
        '.button',
        '.btn',
        '.cta-button',
        '.menu-tab',
        '.nav-item'
    ];
    
    // Tüm tıklanabilir elemanlara ripple ekle
    function addRippleEffect() {
        const elements = document.querySelectorAll(rippleSelectors.join(', '));
        
        elements.forEach(element => {
            // Sadece henüz ripple eklenmemiş elementlere ekle
            if (!element.hasAttribute('data-has-ripple')) {
                element.setAttribute('data-has-ripple', 'true');
                element.addEventListener('click', createRipple);
                
                // Pozisyon özelliğini kontrol et
                const position = getComputedStyle(element).position;
                if (position === 'static') {
                    element.style.position = 'relative';
                }
                
                // Overflow özelliğini kontrol et
                element.style.overflow = 'hidden';
            }
        });
    }
    
    // Tıklama olayı için ripple oluşturma
    function createRipple(event) {
        const element = event.currentTarget;
        
        // Element devre dışı veya ripple zaten varsa çıkış yap
        if (element.disabled || element.getAttribute('disabled') === 'true') {
            return;
        }
        
        // Var olan ripple elementlerini temizle
        const ripples = element.querySelectorAll('.ripple');
        ripples.forEach(ripple => ripple.remove());
        
        // Yeni ripple elementi oluştur
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        element.appendChild(ripple);
        
        // Ripple pozisyonunu ve boyutunu hesapla
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        // Tıklama noktasını al
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        // Ripple stilini ayarla
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Animasyon bittiğinde ripple elementini kaldır
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Dokunma olayları için özel işleme
    function setupTouchEvents() {
        const elements = document.querySelectorAll(rippleSelectors.join(', '));
        
        elements.forEach(element => {
            // Dokunma başladığında
            element.addEventListener('touchstart', function(e) {
                this.classList.add('touch-active');
                
                // Touch pozisyonu için özel ripple oluştur
                const touch = e.touches[0];
                const element = e.currentTarget;
                
                // Element devre dışı veya ripple zaten varsa çıkış yap
                if (element.disabled || element.getAttribute('disabled') === 'true') {
                    return;
                }
                
                // Yeni ripple elementi oluştur
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                element.appendChild(ripple);
                
                // Ripple pozisyonunu ve boyutunu hesapla
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                // Dokunma noktasını al
                const x = touch.clientX - rect.left - size / 2;
                const y = touch.clientY - rect.top - size / 2;
                
                // Ripple stilini ayarla
                ripple.style.width = ripple.style.height = `${size}px`;
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                // Animasyon bittiğinde ripple elementini kaldır
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            // Dokunma bittiğinde
            element.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            });
        });
    }
    
    // Sayfa ilk yüklendiğinde ripple efektini ekle
    addRippleEffect();
    setupTouchEvents();
    
    // DOM değişikliklerini izle ve yeni elemanlara da ripple efekti ekle
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
            }
        });
        
        if (shouldUpdate) {
            addRippleEffect();
            setupTouchEvents();
        }
    });
    
    // Tüm DOM değişikliklerini izle
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Sayfa tamamen yüklendikten sonra tekrar kontrol et
    window.addEventListener('load', function() {
        addRippleEffect();
        setupTouchEvents();
    });
});

/**
 * Ripple Effect (Dalga Efekti)
 * Tüm tıklanabilir elemanlara dalga efekti ekler
 * Özellikle tag-more butonlarına odaklanır
 */

document.addEventListener('DOMContentLoaded', function() {
    // İlk çalıştırma
    addRippleToTagButtons();
    
    // MutationObserver ile DOM değişikliklerini izle
    const observer = new MutationObserver((mutations) => {
        // Herhangi bir DOM değişikliği olduğunda çalıştır
        addRippleToTagButtons();
    });
    
    // Tüm DOM'u izle
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Sayfa tamamen yüklendiğinde tekrar kontrol et
    window.addEventListener('load', function() {
        addRippleToTagButtons();
    });
});

// Tag butonlarına ripple efekti ekle
function addRippleToTagButtons() {
    // Tüm tag-more butonlarını seç
    document.querySelectorAll('.tag-more:not([data-has-ripple])').forEach(btn => {
        // Sadece bir kez ekle
        btn.setAttribute('data-has-ripple', 'true');
        
        // Click event listener ekle
        btn.addEventListener('click', function(e) {
            // Dalga animasyonu için element oluştur
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            
            // Tıklama pozisyonunu hesapla
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            // Ripple stilini ayarla
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Animasyon bitiminde kaldır
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Dokunma geri bildirimi
            if ('vibrate' in navigator) {
                navigator.vibrate(15);
            }
            
            // Expanded durumunu kontrol et
            const container = this.closest('.food-tags');
            if (container) {
                // Tüm sayfadaki tag emojilerini güncelle
                setTimeout(() => {
                    if (window.initEmojiTags) {
                        window.initEmojiTags();
                    }
                }, 100);
            }
        });
    });
}

// Global erişim için
window.addRippleToTagButtons = addRippleToTagButtons;
