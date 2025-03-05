/**
 * ACİL ETKİLEŞİM SORUNLARI DÜZELTME
 * Sayfadaki tıklama, dokunma ve etkileşim sorunlarını düzeltir
 */

(function() {
    console.log('🔧 Etkileşim düzeltme sistemi başlatıldı');

    // Sayfa yüklenir yüklenmez çalıştır
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFixes);
    } else {
        initFixes();
    }

    // Ayrıca tam sayfa yüklendikten sonra tekrar çalıştır
    window.addEventListener('load', initFixes);

    function initFixes() {
        console.log('🔍 Etkileşim sorunları taranıyor...');
        
        // 1. Görünmez katmanları temizle
        removeBlockingOverlays();
        
        // 2. z-index sorunlarını düzelt
        fixZIndexIssues();
        
        // 3. Tıklama/dokunma olayları için olay dinleyicileri ekle
        setupClickHandlers();
        
        // 4. Tarayıcıya özel düzeltmeler
        applyBrowserSpecificFixes();
        
        // Düzeltmeleri periyodik olarak uygula
        setInterval(performPeriodicFixes, 2000);
        
        console.log('✅ Etkileşim düzeltmeleri uygulandı');
    }

    // Potansiyel engelleyici katmanları bul ve kaldır
    function removeBlockingOverlays() {
        // Sayfayı kaplayan ve görünmez tüm öğeleri kontrol et
        const potentialBlockers = document.querySelectorAll('body > div:not(.main-container):not(.header):not(.bottom-nav):not(#categoriesModal):not(.modal):not(.ar-container):not(.loading-screen):not(.status-message):not(#arTroubleshootStatus):not(.back-to-top)');
        
        potentialBlockers.forEach(element => {
            const styles = window.getComputedStyle(element);
            
            // Tıklamaları engelleyebilecek özelliklere sahip mi kontrol et
            if (
                (styles.position === 'fixed' || styles.position === 'absolute') &&
                (parseFloat(styles.opacity) === 0 || styles.visibility === 'hidden') &&
                (parseInt(styles.zIndex) > 10)
            ) {
                console.warn('⚠️ Potansiyel engelleyici katman bulundu ve kaldırıldı:', element);
                element.style.display = 'none';
                element.style.pointerEvents = 'none';
            }
        });
        
        // Body'deki engelleme stillerini kaldır
        document.body.style.pointerEvents = '';
        
        // Tüm modaller kapandığında scrollu etkinleştir
        const modals = document.querySelectorAll('.modal, .categories-modal');
        let anyModalActive = false;
        
        modals.forEach(modal => {
            if (modal.style.display !== 'none' && modal.classList.contains('active')) {
                anyModalActive = true;
            }
        });
        
        if (!anyModalActive) {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
        }
    }

    // z-index sorunlarını düzelt
    function fixZIndexIssues() {
        // Başlık ve navigasyon çubukları için doğru z-index değerleri
        const header = document.querySelector('.header');
        if (header) header.style.zIndex = '100';
        
        const bottomNav = document.querySelector('.bottom-nav');
        if (bottomNav) bottomNav.style.zIndex = '90';
        
        // Menu-tabs için z-index düzeltmesi
        const menuTabs = document.querySelector('.menu-tabs-container');
        if (menuTabs) menuTabs.style.zIndex = '80';
        
        // Ana içerik alanının üst katmanlara göre konumlandırılması
        const mainContainer = document.querySelector('.main-container');
        if (mainContainer) mainContainer.style.position = 'relative';
        
        // Potansiyel olarak etkileşimi engelleyen yüksek z-index'leri düzelt
        document.querySelectorAll('[style*="z-index"]').forEach(element => {
            const zIndex = parseInt(window.getComputedStyle(element).zIndex);
            if (zIndex > 1000 && !element.classList.contains('modal') && !element.classList.contains('categories-modal')) {
                console.warn('⚠️ Çok yüksek z-index değeri düzeltildi:', element);
                element.style.zIndex = '50';
            }
        });
    }

    // Tıklama ve dokunma olaylarını iyileştir
    function setupClickHandlers() {
        // Tıklama ve dokunma olaylarının düzgün çalışması için dinleyiciler ekle
        document.body.addEventListener('click', function(e) {
            // Doğrudan "debugger" çağrısı koyarak tarayıcı geliştirici araçlarında tıklama sorunlarını izleyebilirsiniz
            // debugger; // Geliştirme sırasında yorumunu kaldırın
            
            // Kategori butonları için özel kontrol
            if (e.target.closest('.category-item')) {
                const categoryItem = e.target.closest('.category-item');
                const categoryId = categoryItem.getAttribute('data-category');
                console.log('Kategori tıklandı:', categoryId);
                
                if (window.Categories && window.Categories.select) {
                    // Önce modalı kapat, sonra kategoriyi seç
                    if (window.Categories.closeModal) {
                        window.Categories.closeModal(() => {
                            window.Categories.select(categoryId);
                        });
                    } else {
                        window.Categories.select(categoryId);
                    }
                }
            }
            
            // Menü sekmeleri için özel kontrol
            if (e.target.closest('.menu-tab')) {
                const menuTab = e.target.closest('.menu-tab');
                const target = menuTab.getAttribute('data-target');
                console.log('Menü sekmesi tıklandı:', target);
                
                // Aktif sekme sınıfını güncelle
                document.querySelectorAll('.menu-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                menuTab.classList.add('active');
                
                // İlgili bölüme kaydır
                const sectionId = target + 'Section';
                const section = document.getElementById(sectionId);
                
                if (section) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const tabsHeight = document.querySelector('.menu-tabs-container')?.offsetHeight || 0;
                    const offset = headerHeight + tabsHeight + 10;
                    
                    window.scrollTo({
                        top: section.offsetTop - offset,
                        behavior: 'smooth'
                    });
                }
            }
            
            // Filtre butonları için özel kontrol
            if (e.target.closest('.filter-btn')) {
                const filterBtn = e.target.closest('.filter-btn');
                const filter = filterBtn.getAttribute('data-filter');
                console.log('Filtre butonu tıklandı:', filter);
                
                // Aktif filtre sınıfını güncelle
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                filterBtn.classList.add('active');
            }
        }, true); // Capture phase'de çalışsın - tıklamaları yakalamak için
        
        // Mobil cihazlar için dokunma olayları
        document.body.addEventListener('touchstart', function(e) {
            // Doğrudan eylemi engelleme, ancak dokunma olayını izleme
            // console.log('Touch start:', e.target);
        }, { passive: true });
    }

    // Tarayıcıya özel düzeltmeler
    function applyBrowserSpecificFixes() {
        // iOS için
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.documentElement.style.cursor = 'pointer';
            
            // iOS'ta dokunma olaylarının daha iyi çalışması için
            document.querySelectorAll('button, a, .menu-tab, .filter-btn, .category-item').forEach(element => {
                element.style.cursor = 'pointer';
            });
        }
        
        // Android için
        if (/Android/.test(navigator.userAgent)) {
            // Bazen Android'de dokunma olayları için fazladan alan yardımcı olur
            document.querySelectorAll('button, a, .menu-tab, .filter-btn, .category-item').forEach(element => {
                const currentPadding = window.getComputedStyle(element).padding;
                if (parseInt(currentPadding) < 10) {
                    element.style.padding = '10px';
                }
            });
        }
    }

    // Periyodik olarak sorunları düzeltme
    function performPeriodicFixes() {
        // Scroll durumu kontrolü ve düzeltme
        document.querySelectorAll('.modal, .categories-modal').forEach(modal => {
            if (modal.style.display === 'none' || !modal.classList.contains('active')) {
                document.body.style.overflow = '';
                document.body.style.position = '';
            }
        });
        
        // Aktif butonlar ve etkileşim kontrolü
        document.querySelectorAll('button, a, .menu-tab, .filter-btn, .category-item').forEach(element => {
            element.style.pointerEvents = 'auto';
        });
    }
})();
