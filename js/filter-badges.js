/**
 * Filtre Rozetleri Bileşeni
 * Açık filtreleri dinamik emoji rozetleri ile gösterir
 */

class FilterBadges {
    constructor(options = {}) {
        this.options = {
            container: document.getElementById('activeFilters'),
            badgeClass: 'filter-badge',
            activeClass: 'active',
            removeButtonClass: 'badge-remove',
            animationDuration: 300,
            emoji: true,
            maxVisible: 5,
            ...options
        };
        
        this.activeBadges = new Set();
        this.badgeElements = {};
        
        // Emoji kütüphanesini başlat
        this.emojiMap = this._initEmojiMap();
        
        // Olayları dinle
        this._initEventListeners();
    }
    
    /**
     * Emoji kütüphanesini başlat
     */
    _initEmojiMap() {
        return {
            'all': '🍽️',
            'vegan': '🌱',
            'vegetarian': '🥗',
            'spicy': '🌶️',
            'popular': '⭐',
            'meat': '🥩',
            'chicken': '🍗',
            'high-protein': '💪',
            'protein': '💪',
            'low-carb': '📉',
            'traditional': '📜',
            'hot': '🔥',
            'cold': '❄️',
            'fresh': '🌿',
            'sweet': '🍯',
            'breakfast': '🍳',
            'cheese': '🧀',
            'sharing': '🤝',
            'caffeine': '☕',
            'cultural': '🌍',
            'eggs': '🥚',
            'seafood': '🦐',
            'dessert': '🍰',
            'handcrafted': '🧶',
            'healthy': '💚',
            'gluten-free': '🌾',
            'dairy-free': '🥛',
            'sour': '🍋',
            'savory': '🧂',
            'nuts': '🥜',
            'refreshing': '🧊',
            'keto': '🥑'
        };
    }
    
    /**
     * İlgili olayları dinlemeye başla
     */
    _initEventListeners() {
        // Filtre butonlarına tıklandığında
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', e => {
                const filterType = btn.getAttribute('data-filter');
                
                // "Tümü" filtresi seçildiyse tüm rozetleri temizle
                if (filterType === 'all') {
                    this.clear();
                    return;
                }
                
                // Bu filtre rozeti aktif mi kontrol et
                if (btn.classList.contains(this.options.activeClass)) {
                    this.add(filterType);
                } else {
                    this.remove(filterType);
                }
            });
        });
        
        // Temizle butonuna tıklandığında
        const clearBtn = document.getElementById('clearFilters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clear();
            });
        }
        
        // Sayfa yüklendiğinde aktif filtreleri göster
        window.addEventListener('load', () => {
            document.querySelectorAll(`.filter-btn.${this.options.activeClass}`).forEach(btn => {
                const filterType = btn.getAttribute('data-filter');
                if (filterType && filterType !== 'all') {
                    this.add(filterType);
                }
            });
        });
    }
    
    /**
     * Filtre rozeti ekle
     * @param {string} type - Filtre tipi
     */
    add(type) {
        if (type === 'all' || this.activeBadges.has(type)) return;
        
        // Rozeti aktif listeye ekle
        this.activeBadges.add(type);
        
        // Eğer zaten bir element varsa, sadece görünür yap
        if (this.badgeElements[type]) {
            this._showBadge(this.badgeElements[type]);
            return;
        }
        
        // Yeni bir rozet elementi oluştur
        const badge = document.createElement('span');
        badge.className = this.options.badgeClass;
        badge.setAttribute('data-filter', type);
        
        // Rozet içeriği
        const emoji = this.options.emoji && this.emojiMap[type] ? this.emojiMap[type] : '';
        const name = this._getFilterName(type);
        
        badge.innerHTML = `
            ${emoji} ${name}
            <button class="${this.options.removeButtonClass}" aria-label="Filtre kaldır">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Kaldırma butonuna olay ekle
        const removeBtn = badge.querySelector(`.${this.options.removeButtonClass}`);
        if (removeBtn) {
            removeBtn.addEventListener('click', e => {
                e.stopPropagation();
                
                // Haptic feedback - dokunsal geri bildirim
                if ('vibrate' in navigator) {
                    navigator.vibrate(20);
                }
                
                this.remove(type);
                
                // İlgili filtre butonunu da güncelle
                const filterBtn = document.querySelector(`.filter-btn[data-filter="${type}"]`);
                if (filterBtn && filterBtn.classList.contains(this.options.activeClass)) {
                    filterBtn.click();
                }
            });
        }
        
        // Rozeti kaydet ve göster
        this.badgeElements[type] = badge;
        
        // Konteyner içine ekle ve göster
        this.options.container.appendChild(badge);
        this._showBadge(badge);
        
        // Gösterilen rozet sayısını kontrol et
        this._checkVisibleBadges();
    }
    
    /**
     * Filtre rozetini kaldır
     * @param {string} type - Filtre tipi
     */
    remove(type) {
        if (!this.activeBadges.has(type)) return;
        
        // Rozeti aktif listeden kaldır
        this.activeBadges.delete(type);
        
        // Rozet elementini bul ve gizle
        const badge = this.badgeElements[type];
        if (badge) {
            this._hideBadge(badge);
            
            // Animasyon bittikten sonra elementi kaldır
            setTimeout(() => {
                if (badge.parentNode) {
                    badge.parentNode.removeChild(badge);
                    delete this.badgeElements[type];
                }
            }, this.options.animationDuration);
        }
        
        // Gösterilen rozet sayısını kontrol et
        this._checkVisibleBadges();
    }
    
    /**
     * Tüm rozetleri temizle
     */
    clear() {
        // Tüm aktif rozetleri kaldır
        [...this.activeBadges].forEach(type => {
            this.remove(type);
        });
        
        // Animasyon bittikten sonra tüm elementleri konteynerden kaldır
        setTimeout(() => {
            this.options.container.innerHTML = '';
            this.badgeElements = {};
        }, this.options.animationDuration);
    }
    
    /**
     * Rozeti göster (animasyonlu)
     * @param {HTMLElement} badge - Rozet elementi
     */
    _showBadge(badge) {
        // FLIP animasyon tekniği kullan
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(10px)';
        
        // Force reflow
        badge.offsetHeight;
        
        badge.style.transition = `opacity ${this.options.animationDuration}ms ease, transform ${this.options.animationDuration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
        badge.style.opacity = '1';
        badge.style.transform = 'translateY(0)';
    }
    
    /**
     * Rozeti gizle (animasyonlu)
     * @param {HTMLElement} badge - Rozet elementi
     */
    _hideBadge(badge) {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(10px)';
    }
    
    /**
     * Gösterilen rozet sayısını kontrol et ve "daha fazla" göster gerekirse
     */
    _checkVisibleBadges() {
        if (this.activeBadges.size <= this.options.maxVisible) return;
        
        // Fazla rozetleri gizle ve "+X more" göster
        const visibleBadges = Array.from(this.activeBadges).slice(0, this.options.maxVisible);
        const hiddenCount = this.activeBadges.size - this.options.maxVisible;
        
        // Tüm rozetleri geçici olarak gizle
        Object.values(this.badgeElements).forEach(badge => {
            badge.style.display = 'none';
        });
        
        // Görünecek rozetleri göster
        visibleBadges.forEach(type => {
            if (this.badgeElements[type]) {
                this.badgeElements[type].style.display = '';
            }
        });
        
        // "Daha fazla" rozeti oluştur (yoksa)
        const moreId = 'more-badge';
        let moreBadge = this.badgeElements[moreId];
        
        if (!moreBadge) {
            moreBadge = document.createElement('span');
            moreBadge.className = `${this.options.badgeClass} more-badge`;
            moreBadge.innerHTML = `+ ${hiddenCount} daha`;
            
            moreBadge.addEventListener('click', () => {
                // Tüm rozetleri göster
                Object.values(this.badgeElements).forEach(badge => {
                    if (badge !== moreBadge) {
                        badge.style.display = '';
                    }
                });
                
                // "Daha fazla" rozetini kaldır
                moreBadge.style.display = 'none';
            });
            
            this.badgeElements[moreId] = moreBadge;
            this.options.container.appendChild(moreBadge);
            this._showBadge(moreBadge);
        } else {
            // "Daha fazla" rozetini güncelle ve göster
            moreBadge.innerHTML = `+ ${hiddenCount} daha`;
            moreBadge.style.display = '';
        }
    }
    
    /**
     * Filtre tipine göre lokalize isim al
     * @param {string} type - Filtre tipi
     * @return {string} - Filtre ismi
     */
    _getFilterName(type) {
        const filterNames = {
            'all': 'Tümü',
            'vegan': 'Vegan',
            'vegetarian': 'Vejetaryen',
            'spicy': 'Acılı',
            'popular': 'Popüler',
            'meat': 'Et',
            'chicken': 'Tavuk',
            'high-protein': 'Proteinli',
            'protein': 'Proteinli',
            'low-carb': 'Düşük Karb',
            'traditional': 'Geleneksel',
            'hot': 'Sıcak',
            'cold': 'Soğuk',
            'fresh': 'Taze',
            'sweet': 'Tatlı',
            'breakfast': 'Kahvaltı',
            'cheese': 'Peynir',
            'sharing': 'Paylaşımlık',
            'caffeine': 'Kafeinli',
            'cultural': 'Kültürel',
            'eggs': 'Yumurta',
            'seafood': 'Deniz Ürünleri',
            'dessert': 'Tatlı',
            'handcrafted': 'El Yapımı',
            'healthy': 'Sağlıklı',
            'gluten-free': 'Glutensiz',
            'dairy-free': 'Sütsüz',
            'sour': 'Ekşi',
            'savory': 'Tuzlu',
            'nuts': 'Kuruyemiş',
            'refreshing': 'Ferahlatıcı',
            'keto': 'Keto'
        };
        
        return filterNames[type] || type;
    }
}

// Sayfa yüklendiğinde filtre rozetleri bileşenini başlat
document.addEventListener('DOMContentLoaded', function() {
    // Filtre rozetleri için konfigürasyon
    const badgesConfig = {
        container: document.getElementById('activeFilters'),
        badgeClass: 'filter-badge',
        activeClass: 'active',
        removeButtonClass: 'badge-remove',
        animationDuration: 300,
        emoji: true,
        maxVisible: 4
    };
    
    // Filtre rozetleri bileşenini başlat
    window.filterBadges = new FilterBadges(badgesConfig);
    
    // ActiveFilters olaylarını kurulumunu ekle
    setupActiveFiltersContainer();
});

// ActiveFilters Container için ek kurulum
function setupActiveFiltersContainer() {
    const container = document.getElementById('activeFilters');
    if (!container) return;
    
    // Boşsa gizle, içerik varsa göster
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const hasChildren = container.children.length > 0;
                container.style.display = hasChildren ? 'flex' : 'none';
                container.style.marginTop = hasChildren ? '15px' : '0';
                container.style.paddingTop = hasChildren ? '15px' : '0';
                
                // Sınır ekle veya kaldır
                container.classList.toggle('with-border', hasChildren);
            }
        }
    });
    
    // Observer'ı başlat
    observer.observe(container, { childList: true });
    
    // İlk durumu kontrol et
    const hasChildren = container.children.length > 0;
    container.style.display = hasChildren ? 'flex' : 'none';
    container.style.marginTop = hasChildren ? '15px' : '0';
    container.style.paddingTop = hasChildren ? '15px' : '0';
    container.classList.toggle('with-border', hasChildren);
}

// Filter Badge CSS Stilini ekle
function injectFilterBadgeStyles() {
    const styles = `
    .filter-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        background-color: var(--primary);
        color: white;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 500;
        margin-right: 8px;
        margin-bottom: 8px;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        animation: filterBadgeFadeIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    .filter-badge:hover {
        transform: translateY(-2px);
        box-shadow: 0 3px 8px rgba(106, 90, 224, 0.2);
    }
    
    .filter-badge.more-badge {
        background-color: #f0f0f5;
        color: var(--text-medium);
        cursor: pointer;
    }
    
    .filter-badge.more-badge:hover {
        background-color: #e5e5ef;
    }
    
    .badge-remove {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 12px;
        width: 16px;
        height: 16px;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.25);
        transition: all 0.2s ease;
    }
    
    .badge-remove:hover {
        background-color: rgba(255, 255, 255, 0.4);
        transform: scale(1.15);
    }
    
    .badge-remove:active {
        transform: scale(0.9);
    }
    
    @keyframes filterBadgeFadeIn {
        from { 
            opacity: 0;
            transform: translateY(8px) scale(0.9);
        }
        to { 
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    body.dark-mode .filter-badge.more-badge {
        background-color: rgba(255, 255, 255, 0.1);
        color: var(--text-light);
    }
    
    body.dark-mode .filter-badge.more-badge:hover {
        background-color: rgba(255, 255, 255, 0.15);
    }
    
    .filter-badge .filter-emoji {
        font-size: 1.1em;
    }
    
    #activeFilters.with-border {
        border-top: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    body.dark-mode #activeFilters.with-border {
        border-top-color: rgba(255, 255, 255, 0.05);
    }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
}

// Stilleri ekle
injectFilterBadgeStyles();