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

/**
 * Scroll Interactions - Enhanced Menu Navigation
 * This script handles scrolling interactions for menu tabs
 * when they are not in fixed position.
 */

document.addEventListener('DOMContentLoaded', function() {
    const menuTabs = document.querySelectorAll('.menu-tab');
    const menuTabsContainer = document.querySelector('.menu-tabs-container');
    
    // Function to smoothly scroll to a section
    function scrollToSection(targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            // Get the current scroll position
            const currentPosition = window.scrollY;
            
            // Calculate target position with offset for header
            const headerHeight = 70; // Adjust based on your header height
            const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - headerHeight;
            
            // Smooth scroll to target
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Add click event listeners to menu tabs
    menuTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active tab
            menuTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Get target section ID
            const targetId = this.getAttribute('data-target') + 'Section';
            
            // Special case for favorites
            if (targetId === 'favoritesSection') {
                // Additional animation for favorites if needed
                const favSection = document.getElementById('favoritesSection');
                if (favSection) {
                    favSection.classList.add('highlight-section');
                    setTimeout(() => {
                        favSection.classList.remove('highlight-section');
                    }, 2000);
                }
            }
            
            // Scroll to the target section
            scrollToSection(targetId);
            
            // Auto-scroll the tabs container to make active tab visible
            if (menuTabsContainer) {
                const tabRect = this.getBoundingClientRect();
                const containerRect = menuTabsContainer.getBoundingClientRect();
                
                // If tab is not fully visible, scroll the container
                if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
                    const scrollAmount = tabRect.left - containerRect.left - 
                                        (containerRect.width / 2) + (tabRect.width / 2);
                    menuTabsContainer.scrollLeft += scrollAmount;
                }
            }
        });
    });
    
    // Highlight the active tab based on scroll position (optional)
    function updateActiveTabOnScroll() {
        // Only run this if you want to highlight the tab as user scrolls through sections
        const sections = document.querySelectorAll('.menu-section');
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Add an offset for better UX
            const offset = 100;
            
            if (window.scrollY >= sectionTop - offset && 
                window.scrollY < sectionTop + sectionHeight - offset) {
                currentSectionId = section.id;
            }
        });
        
        if (currentSectionId) {
            const targetId = currentSectionId.replace('Section', '');
            menuTabs.forEach(tab => {
                if (tab.getAttribute('data-target') === targetId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        }
    }
    
    // Optional: Uncomment below if you want to highlight the tab while scrolling
    // window.addEventListener('scroll', updateActiveTabOnScroll);
});
