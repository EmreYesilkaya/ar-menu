/**
 * Minimal Filtreleme Sistemi - Birden Fazla Filtre Seçilebilir
 * - Aktif filtrelerin renk değişimiyle gösterildiği basit versiyon
 * - Emoji destekli filtre butonları
 * - Aynı filtreye tıklayarak seçimi kaldırma (Toggle) 
 * - Birden fazla filtrenin aynı anda seçilebilmesi
 */

document.addEventListener('DOMContentLoaded', function() {
    // Öğeleri seç
    const showMoreBtn = document.getElementById('showMoreFilters');
    const expandedFilters = document.getElementById('expandedFilters');
    const allFilterBtns = document.querySelectorAll('.filter-btn');
    let filterUpdateDelay;
    
    // Aktif filtreleri sakla
    const activeFilters = new Set(['all']); // Varsayılan olarak 'all' filtresi aktif
    
    // Emoji-filtre eşleşmeleri
    const filterEmojis = {
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
    
    // Genişletilebilir filtreleri göster/gizle
    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (expandedFilters) {
                expandedFilters.classList.toggle('show');
                showMoreBtn.classList.toggle('expanded');
                
                // İkon değişimi
                const icon = showMoreBtn.querySelector('i');
                const text = showMoreBtn.querySelector('span');
                
                if (showMoreBtn.classList.contains('expanded')) {
                    icon.className = 'fas fa-sliders-h fa-rotate-90';
                    text.textContent = 'Kapat';
                } else {
                    icon.className = 'fas fa-sliders-h';
                    text.textContent = 'Daha Fazla';
                }
                
                // Haptic feedback
                if ('vibrate' in navigator) {
                    navigator.vibrate(40);
                }
            }
        });
    }
    
    // Filtrelere etkileşimlilik ekle
    allFilterBtns.forEach(btn => {
        // Emoji ekle (eğer yoksa)
        const filterType = btn.getAttribute('data-filter');
        if (filterType && filterEmojis[filterType] && !btn.innerHTML.includes(filterEmojis[filterType])) {
            btn.innerHTML = `<span class="filter-emoji">${filterEmojis[filterType]}</span> <span class="filter-text">${btn.textContent.trim()}</span>`;
        }
        
        // Tıklama olayı - BUG FIX: Doğrudan toggleFilter'ı çağıralım
        btn.addEventListener('click', function(e) {
            // Haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(30);
            }
            
            const filterValue = this.getAttribute('data-filter');
            
            // DÜZELTME: Mevcut durumu kontrol et
            const isCurrentlyActive = this.classList.contains('active');
            console.log(`Filtre ${filterValue} tıklandı, mevcut durum: ${isCurrentlyActive ? 'aktif' : 'pasif'}`);
            
            // "Tümü" için özel durum
            if (filterValue === 'all') {
                clearAllFilters();
                activeFilters.add('all');
                updateFilterButtons();
            }
            // Zaten aktif ise kaldır
            else if (isCurrentlyActive) {
                activeFilters.delete(filterValue);
                if (activeFilters.size === 0) {
                    activeFilters.add('all'); // Eğer hiç filtre kalmadıysa "Tümü" seç
                }
                updateFilterButtons();
            }
            // Aktif değilse ekle
            else {
                if (activeFilters.has('all')) {
                    activeFilters.delete('all'); // "Tümü" filtresini kaldır
                }
                activeFilters.add(filterValue);
                updateFilterButtons();
            }
            
            // Filtreleri uygula
            applyFilters();
        });
    });
    
    // CSS sınıflarını güncelleme - filtreyi alternatifli yapalım
    function updateFilterButtons() {
        allFilterBtns.forEach(btn => {
            const filterValue = btn.getAttribute('data-filter');
            const shouldBeActive = activeFilters.has(filterValue);
            
            // DOM'u gereksiz yere güncellemekten kaçınmak için mevcut durumu kontrol et
            const isCurrentlyActive = btn.classList.contains('active');
            
            if (shouldBeActive && !isCurrentlyActive) {
                btn.classList.add('active');
                // Dalga efekti ekle
                createRippleEffect(btn);
            } else if (!shouldBeActive && isCurrentlyActive) {
                btn.classList.remove('active');
            }
        });
        
        console.log("Aktif filtreler güncellendi:", Array.from(activeFilters));
    }

    // Tüm filtreleri temizle - güncellendi
    function clearAllFilters() {
        activeFilters.clear();
        allFilterBtns.forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    // Filtreleri uygula - tekrar düzenlenen filtre mantığı
    function applyFilters() {
        // Yükleme göstergesi
        showFilteringIndicator();
        
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            // "Tümü" filtresi seçiliyse tümünü göster
            if (activeFilters.has('all')) {
                showItem(item);
                return;
            }
            
            // Öğenin etiketlerini al
            const itemTags = getItemTags(item);
            
            // BİRDEN FAZLA FİLTRE SEÇİMİ: Aktif filtrelerden herhangi biri ile eşleşen ürünleri göster
            let shouldShow = false;
            for (const filter of activeFilters) {
                if (itemTags.includes(filter)) {
                    shouldShow = true;
                    break;
                }
            }
            
            if (shouldShow) {
                showItem(item);
            } else {
                hideItem(item);
            }
        });
        
        // Boş bölümleri kontrol et
        checkEmptySections();
        
        // Yükleme göstergesini kaldır
        setTimeout(hideFilteringIndicator, 400);
    }
    
    // Dalga efekti
    function createRippleEffect(button) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Yükleme göstergesi - sadeleştirildi
    function showFilteringIndicator() {
        // Basit bir animasyon için filtre butonlarına class ekle
        document.querySelectorAll('.filter-btn.active').forEach(btn => {
            btn.classList.add('filtering');
        });
    }
    
    function hideFilteringIndicator() {
        document.querySelectorAll('.filter-btn.filtering').forEach(btn => {
            btn.classList.remove('filtering');
        });
    }
    
    // Öğeyi göster/gizle fonksiyonları
    function showItem(item) {
        if (item.style.display !== 'none') return;
        
        item.style.display = '';
        item.animate([
            { opacity: 0, transform: 'translateY(15px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], {
            duration: 300,
            easing: 'ease-out',
            fill: 'forwards'
        });
    }
    
    function hideItem(item) {
        if (item.style.display === 'none') return;
        
        const animation = item.animate([
            { opacity: 1, transform: 'translateY(0)' },
            { opacity: 0, transform: 'translateY(10px)' }
        ], {
            duration: 250,
            easing: 'ease-out',
            fill: 'forwards'
        });
        
        animation.onfinish = () => {
            item.style.display = 'none';
        };
    }
    
    // Menü öğesinin etiketlerini al
    function getItemTags(item) {
        const tags = [];
        
        // Etiketler food-tag sınıfında olabilir
        const foodTags = item.querySelectorAll('.food-tag');
        
        foodTags.forEach(tag => {
            // tag-xxx formatındaki sınıf adından etiket türünü çıkar
            tag.classList.forEach(cls => {
                if (cls.startsWith('tag-') && cls !== 'tag-more' && cls !== 'food-tag') {
                    tags.push(cls.replace('tag-', ''));
                }
            });
        });
        
        // Alternatif olarak data-tags özelliğinde olabilir
        const dataTags = item.getAttribute('data-tags');
        if (dataTags) {
            dataTags.split(',').forEach(tag => {
                tags.push(tag.trim());
            });
        }
        
        return tags;
    }
    
    // Boş bölümleri kontrol et ve özelleştirilmiş mesajlarla doldur
    function checkEmptySections() {
        const sections = document.querySelectorAll('.menu-section');
        
        sections.forEach(section => {
            const items = section.querySelectorAll('.menu-item');
            let visibleItems = 0;
            
            items.forEach(item => {
                if (item.style.display !== 'none') {
                    visibleItems++;
                }
            });
            
            // Boş mesaj kontrolü
            const existingMessage = section.querySelector('.empty-section-message');
            
            if (visibleItems === 0) {
                // Boş mesajı göster
                if (!existingMessage) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-section-message';
                    
                    // Aktif filtrelere göre veri özniteliği ekle - boş sonuç emojisi için
                    if (activeFilters.size === 1) {
                        // Tek filtre varsa ona göre özelleştir
                        const activeFilter = Array.from(activeFilters)[0];
                        emptyMessage.setAttribute('data-filter', activeFilter);
                    }
                    
                    // İçeriği oluştur
                    emptyMessage.innerHTML = `
                        <div class="empty-message-icon">🔍</div>
                        <p>Bu filtrelere uygun ürün bulunamadı.</p>
                        <p style="font-size: 0.9rem; margin-top: 10px; opacity: 0.8;">Farklı bir filtre seçmeyi deneyin.</p>
                    `;
                    
                    const menuItems = section.querySelector('.menu-items');
                    if (menuItems) {
                        menuItems.appendChild(emptyMessage);
                    }
                }
            } else {
                // Boş mesajı kaldır
                if (existingMessage) {
                    existingMessage.remove();
                }
            }
        });
    }
    
    // Sayfa yüklendiğinde filtreleri başlat
    window.addEventListener('load', function() {
        // Arama giriş alanını ayarla
        setupSearchInput();
        
        // Tüm filtreleme butonlarını emoji ile güçlendir
        enhanceFilterButtons();
        
        // Filtreleri uygula
        applyFilters();
    });
    
    // Filtre butonlarını emoji ile güçlendir
    function enhanceFilterButtons() {
        allFilterBtns.forEach(btn => {
            // Emoji ekle (eğer yoksa)
            const filterType = btn.getAttribute('data-filter');
            if (filterType && filterEmojis[filterType] && !btn.querySelector('.filter-emoji')) {
                const btnText = btn.textContent.trim();
                btn.innerHTML = `<span class="filter-emoji">${filterEmojis[filterType]}</span> <span class="filter-text">${btnText}</span>`;
            }
        });
    }
    
    // Arama kutusuna temizleme butonu ekle
    function setupSearchInput() {
        const searchInput = document.getElementById('menuSearch');
        if (!searchInput) return;
        
        // Temizleme butonu
        const clearBtn = document.createElement('button');
        clearBtn.className = 'search-clear';
        clearBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
        clearBtn.style.display = 'none';
        
        // Temizleme fonksiyonu
        clearBtn.addEventListener('click', function() {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            searchInput.focus();
            applyFilters(); // Normal filtreleri geri yükle
        });
        
        // Butonu ekle
        searchInput.parentNode.appendChild(clearBtn);
        
        // Input değişikliklerini izle
        searchInput.addEventListener('input', function() {
            clearBtn.style.display = this.value ? 'block' : 'none';
            
            // Arama filtresi
            const searchTerm = this.value.toLowerCase().trim();
            if (searchTerm) {
                filterBySearchTerm(searchTerm);
            } else {
                applyFilters();
            }
        });
    }
    
    // Arama terimine göre filtrele
    function filterBySearchTerm(term) {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const title = item.querySelector('.menu-item-title')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.menu-item-description')?.textContent.toLowerCase() || '';
            const tags = getItemTags(item).join(' ').toLowerCase();
            
            // Arama terimi başlık, açıklama veya etiketlerde geçiyorsa göster
            if (title.includes(term) || description.includes(term) || tags.includes(term)) {
                showItem(item);
            } else {
                hideItem(item);
            }
        });
        
        // Boş bölümleri kontrol et
        checkEmptySections();
    }
    
    // Global erişim için dışa aktar - güncellendi
    window.applyFilters = applyFilters;
    window.activateSpecialFilter = function(filter, animated = true) {
        if (filter === 'all') {
            clearAllFilters();
            activeFilters.add('all');
        } else {
            if (activeFilters.has('all')) {
                activeFilters.delete('all');
            }
            activeFilters.add(filter);
        }
        
        // Butonları güncelle
        updateFilterButtons();
        
        // İstek üzerine filtreyi görünür yap
        if (animated) {
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
            if (filterBtn) {
                filterBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
        
        // Filtreleri uygula
        applyFilters();
    };
});