/**
 * Modal ve Dialog Yöneticisi
 * Tüm modalleri, tutorialları ve paylaşım dialoglarını yönetir
 * Dark mode adaptasyonunu otomatik yapar
 */

// Modal Yönetici Singleton
const ModalManager = {
    // Aktif modallar
    activeModals: [],
    
    // DOM yüklendiğinde başla
    init: function() {
        console.log('Modal Manager başlatılıyor...');
        this.setupEventListeners();
        this.applyDarkModeToAllModals();
    },
    
    // Olay dinleyicileri
    setupEventListeners: function() {
        // Dark mode değişimlerini izle
        const bodyObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    const isDarkMode = document.body.classList.contains('dark-mode');
                    this.applyDarkModeToAllModals();
                }
            });
        });
        
        bodyObserver.observe(document.body, { attributes: true });
        
        // Modal açma olayı
        document.addEventListener('show.modal', (event) => {
            if (event.detail && event.detail.modalId) {
                this.showModal(event.detail.modalId);
            }
        });
        
        // Kapatma butonlarına olay ekle
        document.querySelectorAll('.close-modal, [data-close-modal]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    this.hideModal(modal.id);
                }
            });
        });
        
        // Dışa tıklama ile kapatma
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                // Etiket butonları için kontrol ekle
                if (e.target === modal && 
                    !e.target.closest('.food-tag') && 
                    !e.target.closest('.tag-more')) {
                    this.hideModal(modal.id);
                }
            });
        });
    },
    
    // Modal gösterme
    showModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return false;
        
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Animasyon ekle
        if (modal.querySelector('.modal-content')) {
            modal.querySelector('.modal-content').classList.add('modal-enter');
            setTimeout(() => {
                modal.querySelector('.modal-content').classList.remove('modal-enter');
            }, 300);
        }
        
        // Dark mode uygulanır
        this.applyDarkModeToModal(modal);
        
        // Aktif modallara ekle
        this.activeModals.push(modalId);
        
        return true;
    },
    
    // Modal gizleme
    hideModal: function(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return false;
        
        // Animasyon ekle
        if (modal.querySelector('.modal-content')) {
            modal.querySelector('.modal-content').classList.add('modal-leave');
            
            setTimeout(() => {
                modal.style.display = 'none';
                modal.querySelector('.modal-content').classList.remove('modal-leave');
                
                // Aktif listeden çıkar
                this.activeModals = this.activeModals.filter(id => id !== modalId);
                
                // Eğer başka modal yoksa body'i düzelt
                if (this.activeModals.length === 0) {
                    document.body.classList.remove('modal-open');
                }
            }, 300);
        } else {
            modal.style.display = 'none';
            this.activeModals = this.activeModals.filter(id => id !== modalId);
            
            if (this.activeModals.length === 0) {
                document.body.classList.remove('modal-open');
            }
        }
        
        return true;
    },
    
    // Tüm modallara dark mode uygula
    applyDarkModeToAllModals: function() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        document.querySelectorAll('.modal').forEach(modal => {
            this.applyDarkModeToModal(modal, isDarkMode);
        });
    },
    
    // Tek bir modala dark mode uygula
    applyDarkModeToModal: function(modal, forceDarkMode = null) {
        const isDarkMode = forceDarkMode !== null ? forceDarkMode : document.body.classList.contains('dark-mode');
        
        // CSS sınıfları ile halledildi, ek gereksinimler için buraya kod eklenebilir
    }
};

// DOM hazır olduğunda başlat
document.addEventListener('DOMContentLoaded', () => {
    ModalManager.init();
});
