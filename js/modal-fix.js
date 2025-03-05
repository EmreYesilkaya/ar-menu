/**
 * Modal Dark Mode Fix - Kategoriler ve diğer modallar için düzeltme
 * Bu script tüm modalların dark mode desteğini düzeltir
 */

document.addEventListener('DOMContentLoaded', function() {
    // Modal içeriğinin dark mode'a doğru tepki vermesi için gözlemci
    const bodyObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const isDarkMode = document.body.classList.contains('dark-mode');
                updateModalStyles(isDarkMode);
            }
        });
    });
    
    // Body sınıfındaki değişimleri izle
    bodyObserver.observe(document.body, { attributes: true });
    
    // Modal gösterildiğinde dark mode stillerini uygula
    document.addEventListener('show.bs.modal', function(event) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            const modal = event.target;
            applyDarkModeToModal(modal);
        }
    });
    
    // Sayfa yüklendiğinde mevcut modalları kontrol et
    const isDarkMode = document.body.classList.contains('dark-mode');
    updateModalStyles(isDarkMode);
    
    // Dark mode durumuna göre tüm modalları güncelleme
    function updateModalStyles(isDarkMode) {
        // Tüm modal elemanlarını seç
        const modals = document.querySelectorAll('.modal, .modal-content, .modal-header, .modal-body, .modal-footer');
        
        modals.forEach(modal => {
            if (isDarkMode) {
                applyDarkModeToModal(modal);
            } else {
                removeDarkModeFromModal(modal);
            }
        });
        
        // Özellikle kategoriler modalını güncelle
        const categoriesModal = document.getElementById('categoriesModal');
        if (categoriesModal) {
            if (isDarkMode) {
                applyDarkModeToModal(categoriesModal);
                
                // Modal içindeki tüm alt elemanlara da dark mode stilini uygula
                const elements = categoriesModal.querySelectorAll('*');
                elements.forEach(el => {
                    if (el.classList.contains('modal-content') || 
                        el.classList.contains('modal-header') || 
                        el.classList.contains('modal-body') || 
                        el.classList.contains('modal-footer')) {
                        applyDarkModeToElement(el);
                    }
                    
                    // Kategori öğeleri
                    if (el.classList.contains('category-item')) {
                        el.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                        el.style.color = 'var(--text-dark)';
                    }
                    
                    // Kategori ikonu
                    if (el.classList.contains('category-icon')) {
                        el.style.color = 'var(--primary-light)';
                    }
                    
                    // Kategori adı
                    if (el.classList.contains('category-name')) {
                        el.style.color = 'var(--text-dark)';
                    }
                });
            } else {
                removeDarkModeFromModal(categoriesModal);
            }
        }
        
        // Tutorial modalını özel olarak güncelle
        const instructionsModal = document.getElementById('instructionsModal');
        if (instructionsModal) {
            if (isDarkMode) {
                applyDarkModeToModal(instructionsModal);
                
                // Tutorial navigasyonu için özel stil
                const tutorialNav = instructionsModal.querySelector('.tutorial-navigation');
                if (tutorialNav) {
                    tutorialNav.style.backgroundColor = 'var(--card-bg)';
                    tutorialNav.style.borderTopColor = 'rgba(255, 255, 255, 0.08)';
                    
                    // Butonları güncelle
                    tutorialNav.querySelectorAll('.tutorial-btn').forEach(btn => {
                        if (btn.classList.contains('next-btn') || btn.classList.contains('skip-btn')) {
                            btn.style.backgroundColor = 'var(--primary)';
                            btn.style.color = 'white';
                        } else {
                            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                            btn.style.color = 'var(--text-dark)';
                        }
                        
                        // Disabled buton
                        if (btn.disabled) {
                            btn.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                            btn.style.color = 'var(--text-light)';
                        }
                    });
                }
                
                // Tutorial ilerleme çubuğu ve noktaları
                const progressSection = instructionsModal.querySelector('.tutorial-progress');
                if (progressSection) {
                    progressSection.style.backgroundColor = 'var(--card-bg)';
                    progressSection.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
                    
                    // İlerleme konteyner arka planı
                    const progressContainer = progressSection.querySelector('.progress-container');
                    if (progressContainer) {
                        progressContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                    }
                    
                    // İlerleme çubuğu
                    const progressBar = progressSection.querySelector('.progress-bar');
                    if (progressBar) {
                        progressBar.style.backgroundColor = 'var(--primary)';
                    }
                    
                    // Adım noktaları
                    const stepDots = progressSection.querySelectorAll('.step-dot');
                    stepDots.forEach(dot => {
                        dot.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        dot.style.borderColor = 'transparent';
                        
                        // Aktif nokta
                        if (dot.classList.contains('active')) {
                            dot.style.backgroundColor = 'var(--primary-light)';
                            dot.style.boxShadow = '0 0 0 2px var(--card-bg), 0 0 0 3px var(--primary)';
                        }
                    });
                }
            } else {
                // Light mode - varsayılan stile dön
                const tutorialNav = instructionsModal.querySelector('.tutorial-navigation');
                if (tutorialNav) {
                    tutorialNav.style.backgroundColor = '';
                    tutorialNav.style.borderTopColor = '';
                    
                    tutorialNav.querySelectorAll('.tutorial-btn').forEach(btn => {
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    });
                }
                
                const progressSection = instructionsModal.querySelector('.tutorial-progress');
                if (progressSection) {
                    progressSection.style.backgroundColor = '';
                    progressSection.style.borderBottomColor = '';
                    
                    const progressContainer = progressSection.querySelector('.progress-container');
                    if (progressContainer) {
                        progressContainer.style.backgroundColor = '';
                    }
                    
                    const progressBar = progressSection.querySelector('.progress-bar');
                    if (progressBar) {
                        progressBar.style.backgroundColor = '';
                    }
                    
                    const stepDots = progressSection.querySelectorAll('.step-dot');
                    stepDots.forEach(dot => {
                        dot.style.backgroundColor = '';
                        dot.style.borderColor = '';
                        dot.style.boxShadow = '';
                    });
                }
            }
        }
    }
    
    // Bir modal elemanına dark mode stillerini uygulama
    function applyDarkModeToModal(modal) {
        if (!modal) return;
        
        modal.querySelectorAll('.modal-content, .modal-header, .modal-body, .modal-footer').forEach(el => {
            applyDarkModeToElement(el);
        });
        
        // Modal başlıkları ve butonlar
        const title = modal.querySelector('.modal-title');
        if (title) {
            title.style.color = 'var(--text-dark)';
        }
        
        const closeBtn = modal.querySelector('.close-modal, .close, .btn-close');
        if (closeBtn) {
            closeBtn.style.color = 'var(--text-medium)';
        }
    }
    
    // Bir elemana dark mode stillerini uygula
    function applyDarkModeToElement(el) {
        if (!el) return;
        
        el.style.backgroundColor = 'var(--card-bg)';
        el.style.color = 'var(--text-dark)';
        
        if (el.classList.contains('modal-header')) {
            el.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
        }
        
        if (el.classList.contains('modal-footer')) {
            el.style.borderTopColor = 'rgba(255, 255, 255, 0.08)';
        }
    }
    
    // Dark mode stillerini kaldır
    function removeDarkModeFromModal(modal) {
        if (!modal) return;
        
        modal.querySelectorAll('.modal-content, .modal-header, .modal-body, .modal-footer').forEach(el => {
            el.style.backgroundColor = '';
            el.style.color = '';
            el.style.borderBottomColor = '';
            el.style.borderTopColor = '';
        });
        
        const title = modal.querySelector('.modal-title');
        if (title) {
            title.style.color = '';
        }
        
        const closeBtn = modal.querySelector('.close-modal, .close, .btn-close');
        if (closeBtn) {
            closeBtn.style.color = '';
        }
        
        // Kategori öğelerini de temizle
        modal.querySelectorAll('.category-item').forEach(el => {
            el.style.backgroundColor = '';
            el.style.borderColor = '';
            el.style.color = '';
        });
        
        modal.querySelectorAll('.category-icon').forEach(el => {
            el.style.color = '';
        });
        
        modal.querySelectorAll('.category-name').forEach(el => {
            el.style.color = '';
        });
    }
    
    // Direkt olarak kategoriler modalını güncelle - var olduğundan emin olmak için
    const categoriesModal = document.getElementById('categoriesModal');
    if (categoriesModal) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            // Tüm modal içeriğine dark mode stilleri uygula
            categoriesModal.querySelectorAll('.modal-content, .modal-header, .modal-body, .modal-footer').forEach(el => {
                el.style.backgroundColor = 'var(--card-bg)';
                el.style.color = 'var(--text-dark)';
            });
        }
    }
});
