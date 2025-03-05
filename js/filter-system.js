/**
 * Gelişmiş Filtreleme Sistemi - iOS Tarzında Tasarım
 * - Tek tıklamada filtreleme
 * - Sadece buton rengi değişimi ile seçilenler gösteriliyor
 */

document.addEventListener('DOMContentLoaded', function() {
    // Öğeleri seç
    const showMoreBtn = document.getElementById('showMoreFilters');
    const expandedFilters = document.getElementById('expandedFilters');
    const activeFiltersContainer = document.getElementById('activeFilters');
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
    
    // Filtre isim eşleşmeleri (Türkçe gösterim için)
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
    
    // Genişletilebilir filtreleri göster/gizle - Daha yumuşak animasyonlu
    showMoreBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // Belgenin geri kalanına tıklamada kapanma davranışını önle
        
        expandedFilters.classList.toggle('show');
        showMoreBtn.classList.toggle('expanded');
        
        // İkon ve animasyon
        const icon = showMoreBtn.querySelector('i');
        
        if (showMoreBtn.classList.contains('expanded')) {
            icon.className = 'fas fa-sliders-h fa-rotate-90';
            showMoreBtn.querySelector('span').textContent = 'Kapat';
        } else {
            icon.className = 'fas fa-sliders-h';
            showMoreBtn.querySelector('span').textContent = 'Daha Fazla';
        }
        
        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(40);
        }
    });
    
    // Filtrelere etkileşimlilik ekle - doğrudan uygular
    allFilterBtns.forEach(btn => {
        // Filtre butonlarına emoji ekle
        const filterType = btn.getAttribute('data-filter');
        if (filterType && filterEmojis[filterType] && !btn.innerHTML.includes(filterEmojis[filterType])) {
            btn.innerHTML = `<span class="filter-emoji">${filterEmojis[filterType]}</span> <span class="filter-text">${btn.textContent.trim()}</span>`;
        }
        
        // Tıklama olayı ekle
        btn.addEventListener('click', function(e) {
            // Haptic feedback
            if ('vibrate' in navigator) {
                navigator.vibrate(30);
            }
            
            const filterValue = this.getAttribute('data-filter');
            toggleFilter(filterValue, this);
            
            // Filtre değiştiğinde hemen uygula
            clearTimeout(filterUpdateDelay);
            filterUpdateDelay = setTimeout(() => {
                applyFilters();
            }, 100); // Biraz bekleme süresi ekleyin, arka arkaya çoklu tıklamalarda optimizasyon için
        });
    });
    
    // Filtre durumunu değiştir
    function toggleFilter(filterValue, buttonElement) {
        if (filterValue === 'all') {
            // "Tümü" seçildiğinde diğer tüm filtreleri temizle
            clearAllFilters();
            activeFilters.add('all');
            updateActiveFilterButtons();
            updateActiveFilterTags();
            return;
        }
        
        // "Tümü" filtresi aktifse ve başka bir filtre seçiliyorsa, "Tümü" filtresini kaldır
        if (activeFilters.has('all')) {
            activeFilters.delete('all');
            document.querySelector('.filter-btn[data-filter="all"]').classList.remove('active');
        }
        
        // Filtre durumunu tersine çevir
        if (activeFilters.has(filterValue)) {
            activeFilters.delete(filterValue);
            buttonElement.classList.remove('active');
            
            // Animasyonlu geçiş
            buttonElement.style.transition = "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        } else {
            activeFilters.add(filterValue);
            buttonElement.classList.add('active');
            
            // Animasyonlu geçiş ve buton vurgusu
            buttonElement.style.transition = "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
            
            // Hafif titreşim efekti
            if ('vibrate' in navigator) {
                navigator.vibrate([15, 30, 15]);
            }
        }
        
        // Hiçbir filtre seçili değilse "Tümü" filtresine geri dön
        if (activeFilters.size === 0) {
            activeFilters.add('all');
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        }
        
        // Filtreleri güncelle
        updateActiveFilterButtons();
        updateActiveFilterTags();
    }
    
    // Tüm filtreleri temizle
    function clearAllFilters() {
        activeFilters.clear();
        activeFilters.add('all');
        updateActiveFilterButtons();
        updateActiveFilterTags();
    }
    
    // Aktif filtre butonlarını güncelle
    function updateActiveFilterButtons() {
        allFilterBtns.forEach(btn => {
            const filterValue = btn.getAttribute('data-filter');
            if (activeFilters.has(filterValue)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Aktif filtre etiketlerini oluştur ve güncelle - iOS tarzı
    function updateActiveFilterTags() {
        // Mevcut etiketleri kaydet ve silinecekleri işaretle
        const currentTags = Array.from(activeFiltersContainer.children);
        const tagsToRemove = new Map();
        
        currentTags.forEach(tag => {
            const filterValue = tag.getAttribute('data-filter');
            tagsToRemove.set(filterValue, tag);
        });
        
        // Eğer sadece "Tümü" filtresi aktifse tüm etiketleri kaldır
        if (activeFilters.has('all') && activeFilters.size === 1) {
            currentTags.forEach(tag => {
                tag.style.animation = 'tagFadeOut 0.2s forwards';
                setTimeout(() => tag.remove(), 200);
            });
            return;
        }
        
        // Aktif filtrelere göre etiketleri güncelle
        activeFilters.forEach(filter => {
            if (filter === 'all') return; // "Tümü" filtresi için etiket gösterme
            
            // Eğer etiket zaten varsa, silme işaretini kaldır
            if (tagsToRemove.has(filter)) {
                tagsToRemove.delete(filter);
            } else {
                // Yoksa yeni etiket ekle
                const emoji = filterEmojis[filter] || '';
                const name = filterNames[filter] || filter;
                
                const tagElement = document.createElement('div');
                tagElement.className = 'active-filter-tag';
                tagElement.setAttribute('data-filter', filter);
                
                // Tag içeriğini oluştur
                tagElement.innerHTML = `
                    ${emoji} ${name}
                    <button class="remove-filter" aria-label="Filtre kaldır">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                
                // Kaldırma butonuna tıklama olayı ekle
                const removeBtn = tagElement.querySelector('.remove-filter');
                removeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    // Haptic feedback
                    if ('vibrate' in navigator) {
                        navigator.vibrate(20);
                    }
                    
                    const filterToRemove = tagElement.getAttribute('data-filter');
                    removeFilter(filterToRemove);
                    
                    // Etiketi animasyonla kaldır
                    tagElement.style.animation = 'tagFadeOut 0.2s forwards';
                    setTimeout(() => {
                        if (tagElement.parentNode) {
                            tagElement.remove();
                        }
                    }, 200);
                });
                
                activeFiltersContainer.appendChild(tagElement);
            }
        });
        
        // İşaretlenmiş etiketleri kaldır
        tagsToRemove.forEach((tag, filter) => {
            tag.style.animation = 'tagFadeOut 0.2s forwards';
            setTimeout(() => tag.remove(), 200);
        });
    }
    
    // Filtreyi kaldır
    function removeFilter(filter) {
        activeFilters.delete(filter);
        
        // Filtre butonunu güncelle
        const filterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (filterBtn) {
            filterBtn.classList.remove('active');
        }
        
        // Eğer hiç filtre kalmazsa, "Tümü" filtresini ekle
        if (activeFilters.size === 0) {
            activeFilters.add('all');
            const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
            if (allBtn) {
                allBtn.classList.add('active');
            }
        }
        
        // Menüyü filtrele
        applyFilters();
    }
    
    // Filtreleri uygula
    function applyFilters() {
        // Animasyonlu yükleme göstergesi
        showFilteringIndicator();
        
        // Kısa gecikme ile filtreleri uygula - daha iyi kullanıcı deneyimi için
        setTimeout(() => {
            // Tüm menü öğelerini al
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                // "Tümü" filtresi seçiliyse tümünü göster
                if (activeFilters.has('all')) {
                    showItem(item);
                    return;
                }
                
                // Öğenin etiketlerini al
                const itemTags = getItemTags(item);
                
                // Aktif filtrelerden en az biri bu öğenin etiketlerinde varsa göster
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
            
            // Yükleme göstergesini gizle
            hideFilteringIndicator();
            
        }, 150);
    }
    
    // Geçici yükleme göstergesi ekle
    function showFilteringIndicator() {
        // Varolan bir gösterge varsa onu kullan, yoksa yeni oluştur
        let indicator = document.querySelector('.filter-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'filter-indicator';
            indicator.innerHTML = `<span class="filter-indicator-dot"></span>`;
            document.querySelector('.filter-section').appendChild(indicator);
        }
        indicator.classList.add('active');
        
        // 2 saniye sonra otomatik olarak göstergeyi kaldır (güvenlik)
        setTimeout(() => {
            hideFilteringIndicator();
        }, 2000);
    }
    
    // Yükleme göstergesini kaldır
    function hideFilteringIndicator() {
        const indicator = document.querySelector('.filter-indicator');
        if (indicator) {
            indicator.classList.remove('active');
        }
    }
    
    // Öğeyi göster - iOS tarzı animasyon
    function showItem(item) {
        // Zaten görünürse işlem yapma
        if (item.style.display !== 'none' && !item.classList.contains('fade-out')) {
            return;
        }
        
        item.style.display = '';
        item.classList.remove('fade-out');
        
        // Görünüm animasyonu
        item.animate([
            { opacity: 0, transform: 'translateY(15px)' },
            { opacity: 1, transform: 'translateY(0)' }
        ], {
            duration: 300,
            easing: 'cubic-bezier(0.2, 0, 0, 1)',
            fill: 'forwards'
        });
    }
    
    // Öğeyi gizle - iOS tarzı yumuşak geçiş
    function hideItem(item) {
        if (item.style.display === 'none') {
            return;
        }
        
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
    
    // Boş bölümleri kontrol et
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
            
            if (visibleItems === 0) {
                // Bölümde görünür öğe yoksa, boş mesajı göster veya bölümü gizle
                if (!section.querySelector('.empty-section-message')) {
                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'empty-section-message';
                    emptyMessage.innerHTML = `
                        <div class="empty-message-icon">🔍</div>
                        <p>Bu kritere uygun ürün bulunamadı.</p>
                    `;
                    
                    const menuItems = section.querySelector('.menu-items');
                    if (menuItems) {
                        menuItems.appendChild(emptyMessage);
                    }
                }
            } else {
                // Görünür öğe varsa, boş mesajını kaldır
                const emptyMessage = section.querySelector('.empty-section-message');
                if (emptyMessage) {
                    emptyMessage.remove();
                }
            }
        });
    }
    
    // Belge üzerindeki tıklamalar için olay dinleyici - iOS tarzı
    document.addEventListener('click', function(e) {
        // Genişletilmiş filtre alanı açıksa ve dışına tıklandıysa kapat
        if (expandedFilters.classList.contains('show') &&
            !expandedFilters.contains(e.target) &&
            !showMoreBtn.contains(e.target)) {
            
            expandedFilters.classList.remove('show');
            showMoreBtn.classList.remove('expanded');
            const icon = showMoreBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-sliders-h';
            }
            const text = showMoreBtn.querySelector('span'); 
            if (text) {
                text.textContent = 'Daha Fazla';
            }
        }
    });
    
    // Sayfa yüklendiğinde filtreleri başlat
    window.addEventListener('load', function() {
        // Filtreleri ilk kez uygula
        applyFilters();
        
        // Arama kutusuna filtre entegrasyonu - iOS tarzı akıcı deneyim
        const searchInput = document.getElementById('menuSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase().trim();
                
                // Arama terimi değiştikçe filtreleri güncelle
                clearTimeout(filterUpdateDelay);
                
                if (searchTerm.length >= 1) {
                    // Eğer aktif bir arama sözcüğü varsa
                    filterUpdateDelay = setTimeout(() => {
                        // Geçici olarak aktif filtreleri kaydet ve geçici olarak "Tümü" filtresine geç
                        const previousFilters = new Set([...activeFilters]);
                        clearAllFilters();
                        
                        // Arama filtresi uygula
                        filterBySearchTerm(searchTerm);
                    }, 200);
                } else {
                    // Arama alanı boşsa normal filtrelere dön
                    filterUpdateDelay = setTimeout(() => {
                        applyFilters();
                    }, 200);
                }
            });
        }
    });
    
    // Arama terimine göre filtrele - iOS tarzı yumuşak geçiş
    function filterBySearchTerm(term) {
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const title = item.querySelector('.menu-item-title')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.menu-item-description')?.textContent.toLowerCase() || '';
            const tags = getItemTags(item).join(' ').toLowerCase();
            
            // Başlık, açıklama veya etiketlerde arama terimi geçiyorsa göster
            if (title.includes(term) || description.includes(term) || tags.includes(term)) {
                showItem(item);
            } else {
                hideItem(item);
            }
        });
        
        // Boş bölümleri kontrol et
        checkEmptySections();
    }

    // Özel etkinleştirilmiş arama filtresi
    function activateSpecialFilter(filter, animated = true) {
        // Tüm filtreleri temizle
        clearAllFilters();
        
        // Belirtilen filtreyi etkinleştir
        if (filter !== 'all') {
            activeFilters.delete('all');
            activeFilters.add(filter);
        }
        
        // Filtre butonunu güncelle
        const filterBtn = document.querySelector(`.filter-btn[data-filter="${filter}"]`);
        if (filterBtn) {
            // Diğer butonları pasif yap
            allFilterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Bu butonu aktif yap
            filterBtn.classList.add('active');
            
            // İsteğe bağlı animasyon
            if (animated) {
                // Butona animasyonlu vurgu
                filterBtn.animate([
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.1)', offset: 0.5 },
                    { transform: 'scale(1)' }
                ], {
                    duration: 600,
                    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                });
                
                // Butonu görünür kıl - kaydırarak
                setTimeout(() => {
                    filterBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }, 100);
            }
        }
        
        // Aktif filtre etiketlerini güncelle
        updateActiveFilterTags();
        
        // Filtreleri uygula
        applyFilters();
    }
    
    // Filter butonları için özel stil güncelleme
    function updateFilterButtonStyle(btn) {
        const isActive = btn.classList.contains('active');
        
        if (isActive) {
            // Reset previous inline styles
            btn.style.transform = '';
            btn.style.boxShadow = '';
            
            // Add active animation
            btn.animate([
                { transform: 'translateY(0)' },
                { transform: 'translateY(-3px)', boxShadow: '0 4px 12px rgba(106, 90, 224, 0.3)' },
                { transform: 'translateY(-2px)', boxShadow: '0 3px 10px rgba(106, 90, 224, 0.2)' }
            ], {
                duration: 300,
                easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                fill: 'forwards'
            });
        }
    }
    
    // Arama alanının temizlenmesi ve görünümü
    function setupSearchClearButton() {
        const searchInput = document.getElementById('menuSearch');
        if (!searchInput) return;
        
        // Temizleme butonu oluştur
        const clearButton = document.createElement('button');
        clearButton.className = 'search-clear';
        clearButton.innerHTML = '<i class="fas fa-times-circle"></i>';
        clearButton.style.display = 'none';
        
        // Temizleme butonu için düğme olayı
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            this.style.display = 'none';
            searchInput.focus();
            
            // Normal filtreleri geri yükle
            applyFilters();
        });
        
        // Arama kutusunun ebeveyn konteynerini seç
        const searchBox = searchInput.parentNode;
        searchBox.appendChild(clearButton);
        searchBox.style.position = 'relative';
        
        // Arama alanı değiştiğinde temizleme butonunun görünürlüğünü değiştir
        searchInput.addEventListener('input', function() {
            clearButton.style.display = this.value ? 'flex' : 'none';
        });
    }
    
    // Yeni filtreler için görsel stil iyileştirmesi 
    function enhanceFilterButtonAppearance() {
        // Emoji'lerin boyut ve konumunu düzelt
        document.querySelectorAll('.filter-emoji').forEach(emoji => {
            emoji.style.lineHeight = '1';
            emoji.style.fontSize = '1.2em';
        });
    }
    
    // Filtre etiket animasyonlarını güçlendir
    function enhanceFilterTagAnimations() {
        // Aktif etiketler için geçiş animasyonları
        const style = document.createElement('style');
        style.textContent = `
            .active-filter-tag {
                animation-duration: 0.4s;
                animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .active-filter-tag:hover {
                transform: translateY(-2px);
                box-shadow: 0 3px 8px rgba(106, 90, 224, 0.2);
            }
            
            .active-filter-tag:active {
                transform: translateY(0);
            }
            
            @keyframes popIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Mobil tablet için dokunma optimizasyonları
    function setupTouchInteractions() {
        // Dokunma olayları için scroll davranışını iyileştir
        const filterContainer = document.querySelector('.filter-container');
        if (!filterContainer) return;
        
        let isDragging = false;
        let startX = 0;
        let scrollLeft = 0;
        
        filterContainer.addEventListener('touchstart', function(e) {
            isDragging = true;
            startX = e.touches[0].pageX - filterContainer.offsetLeft;
            scrollLeft = filterContainer.scrollLeft;
        });
        
        filterContainer.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            const x = e.touches[0].pageX - filterContainer.offsetLeft;
            const walk = (x - startX) * 1.5; // Kaydırma hızını ayarla
            filterContainer.scrollLeft = scrollLeft - walk;
        });
        
        filterContainer.addEventListener('touchend', function() {
            isDragging = false;
        });
    }
    
    // Tüm başlatma işlemlerini düzenleyici
    function initializeFilterSystem() {
        setupSearchClearButton();
        enhanceFilterButtonAppearance();
        enhanceFilterTagAnimations();
        setupTouchInteractions();
        
        // Kategori ve filtre sistemlerini entegre et
        integrateWithCategoriesSystem();
        
        // Modal sistemine entegre et
        integrateWithModalSystem();
    }
    
    // Kategoriler sistemi ile entegrasyon
    function integrateWithCategoriesSystem() {
        // Kategori öğelerine tıklandığında filtreleri ayarla
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-category');
                if (categoryId) {
                    // Kategori filtresini etkinleştir
                    activateSpecialFilter(categoryId, true);
                    
                    // Kategori modalını kapat
                    const categoriesModal = document.getElementById('categoriesModal');
                    if (categoriesModal) {
                        categoriesModal.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Modal sistemi ile entegrasyon
    function integrateWithModalSystem() {
        // Modal kapatıldığında filtre panelini kapat
        document.addEventListener('modalClosed', function() {
            if (expandedFilters && expandedFilters.classList.contains('show')) {
                expandedFilters.classList.remove('show');
                
                if (showMoreBtn) {
                    showMoreBtn.classList.remove('expanded');
                    const icon = showMoreBtn.querySelector('i');
                    if (icon) icon.className = 'fas fa-sliders-h';
                }
            }
        });
    }
    
    // Sayfa yüklendiğinde tüm başlatma fonksiyonlarını çalıştır
    document.addEventListener('DOMContentLoaded', function() {
        // Filtreleme sistemini başlat
        initializeFilterSystem();
    });
});