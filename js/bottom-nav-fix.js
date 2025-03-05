/**
 * Bottom Navigation Dark Mode Düzeltmesi
 * Profil ve kategoriler butonları için özel stil düzeltmeleri
 */

document.addEventListener('DOMContentLoaded', function() {
    // NOT: Kategoriler butonu tıklama olayını categories.js'e taşıdık,
    // Bu dosyada sadece dark mode için stil düzeltmeleri kalıyor
    
    // Dark mode değişimini izle
    const bodyObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const isDarkMode = document.body.classList.contains('dark-mode');
                applyNavStyles(isDarkMode);
            }
        });
    });
    
    // Body elemanını izle
    bodyObserver.observe(document.body, { attributes: true });
    
    // İlk yüklemede stilleri uygula
    const isDarkMode = document.body.classList.contains('dark-mode');
    applyNavStyles(isDarkMode);
    
    // Dark mode değişiminde çağrılacak fonksiyonlar
    function applyNavStyles(isDarkMode) {
        const profileBtn = document.querySelector('.bottom-nav-item[data-action="profile"]');
        const categoriesBtn = document.querySelector('.bottom-nav-item[data-action="categories"]');
        
        if (profileBtn && categoriesBtn) {
            if (isDarkMode) {
                // Dark mode stilleri uygula
                profileBtn.querySelectorAll('.bottom-nav-icon, .bottom-nav-label').forEach(el => {
                    el.style.color = 'var(--text-medium)';
                });
                
                categoriesBtn.querySelectorAll('.bottom-nav-icon, .bottom-nav-label').forEach(el => {
                    el.style.color = 'var(--text-medium)';
                });
            } else {
                // Light mode - stilleri temizle
                profileBtn.querySelectorAll('.bottom-nav-icon, .bottom-nav-label').forEach(el => {
                    el.style.color = '';
                });
                
                categoriesBtn.querySelectorAll('.bottom-nav-icon, .bottom-nav-label').forEach(el => {
                    el.style.color = '';
                });
            }
        }
    }
});
