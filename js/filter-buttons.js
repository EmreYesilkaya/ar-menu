/**
 * Filtre Butonları Modülü - Emojilerle Geliştirilmiş
 */

document.addEventListener('DOMContentLoaded', function() {
    initializeFilterButtons();
    
    // Menü değişikliklerini izle ve filtreleri güncelle
    const menuObserver = new MutationObserver(function(mutations) {
        let shouldUpdate = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
            }
        });
        
        if (shouldUpdate) {
            initializeFilterButtons();
        }
    });
    
    // Menü konteyneri varsa izlemeye başla
    const menuContainer = document.querySelector('.main-container');
    if (menuContainer) {
        menuObserver.observe(menuContainer, { 
            childList: true, 
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }
});

function initializeFilterButtons() {
    // Emoji haritasını menu-renderer.js'den kontrol et
    let tagEmojis = {};
    if (window.MenuRenderer && window.MenuRenderer.tagEmojis) {
        tagEmojis = window.MenuRenderer.tagEmojis;
    } else {
        // Fallback emoji haritası
        tagEmojis = {
            'all': '🍽️',
            'vegan': '🌱',
            'vegetarian': '🥗',
            'spicy': '🌶️',
            'popular': '⭐',
            'meat': '🥩',
            'chicken': '🍗',
            'high-protein': '💪',
            'low-carb': '📉',
            // ...diğer gerekli emojiler...
        };
    }
    
    // All emoji'sini ekleyelim (menu-renderer'da olmaması normal)
    tagEmojis['all'] = '🍽️';

    // Öncelikli gösterilecek etiketler
    const priorityTags = ['all', 'popular', 'vegan', 'vegetarian', 'meat', 'spicy', 'high-protein', 'low-carb'];
    
    // Tüm menü öğelerindeki etiketleri bul
    const menuTags = collectAllMenuTags();
    
    // Filtre butonları konteyneri
    const filterContainer = document.querySelector('.filter-buttons');
    if (!filterContainer) return;
    
    // Önce mevcut filtre butonlarını temizle
    filterContainer.innerHTML = '';
    
    // "Tümü" filtresi her zaman ilk sırada
    createFilterButton('all', 'Tümü', true, filterContainer, tagEmojis['all']);
    
    // Öncelikli etiketleri ekle (eğer menüde varsa)
    priorityTags.forEach(tag => {
        if (tag !== 'all' && menuTags.has(tag)) {
            createFilterButton(tag, formatTagName(tag), false, filterContainer, tagEmojis[tag] || '•');
        }
    });
    
    // Diğer etiketleri ekle (öncelikli olmayanlar)
    menuTags.forEach(tag => {
        if (!priorityTags.includes(tag)) {
            createFilterButton(tag, formatTagName(tag), false, filterContainer, tagEmojis[tag] || '•');
        }
    });
    
    // Filter butonlarına tıklama olayları
    setupFilterClickHandlers();
}

function collectAllMenuTags() {
    const tags = new Set();
    
    // Tüm menü öğelerini bul
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        // Food-tag elementlerini bul
        const tagElements = item.querySelectorAll('.food-tag');
        
        tagElements.forEach(tagEl => {
            // tag-xxx formatındaki class'ları bul
            const tagClasses = Array.from(tagEl.classList).filter(cls => cls.startsWith('tag-') && cls !== 'tag-more');
            
            tagClasses.forEach(cls => {
                const tagName = cls.replace('tag-', '');
                tags.add(tagName);
            });
        });
        
        // Data-tags özniteliğini kontrol et
        if (item.dataset.tags) {
            const itemTags = item.dataset.tags.split(',').map(tag => tag.trim());
            itemTags.forEach(tag => tags.add(tag));
        }
    });
    
    return tags;
}

function createFilterButton(value, text, isActive, container, emoji = '') {
    const button = document.createElement('button');
    button.className = `filter-btn${isActive ? ' active' : ''}`;
    button.setAttribute('data-filter', value);
    button.innerHTML = emoji ? `<span class="filter-emoji">${emoji}</span> ${text}` : text;
    button.title = `${text} öğelerini göster`;
    container.appendChild(button);
    return button;
}

function setupFilterClickHandlers() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Aktif sınıfını kaldır
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            
            // Bu butona aktif sınıfını ekle
            this.classList.add('active');
            
            // Filtrelemeyi çalıştır
            const filterValue = this.getAttribute('data-filter');
            filterMenuItems(filterValue);
            
            // Dokunma geri bildirimi
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });
    });
}

function filterMenuItems(filterValue) {
    // Tüm menü öğelerini bul
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        // Eğer "tümü" filtresi ise hepsini göster
        if (filterValue === 'all') {
            item.style.display = '';
            return;
        }
        
        // Bu öğenin etiketlerini bul
        let hasTag = false;
        
        // Food-tag elementlerini kontrol et
        const tagElements = item.querySelectorAll('.food-tag');
        tagElements.forEach(tagEl => {
            if (tagEl.classList.contains(`tag-${filterValue}`)) {
                hasTag = true;
            }
        });
        
        // Data-tags özniteliğini kontrol et
        if (item.dataset.tags) {
            const itemTags = item.dataset.tags.split(',').map(tag => tag.trim());
            if (itemTags.includes(filterValue)) {
                hasTag = true;
            }
        }
        
        // Etiket varsa göster, yoksa gizle
        item.style.display = hasTag ? '' : 'none';
    });
    
    // Bölümlerin görünürlüğünü güncelle
    updateSectionVisibility();
}

function updateSectionVisibility() {
    // Tüm menu sections'ları bul
    const sections = document.querySelectorAll('.menu-section');
    
    sections.forEach(section => {
        // Bu bölümdeki görünür öğeleri bul
        const visibleItems = section.querySelectorAll('.menu-item[style="display: none;"]');
        
        // Eğer tüm öğeler gizliyse, bölümü de gizle
        if (visibleItems.length === section.querySelectorAll('.menu-item').length) {
            section.style.display = 'none';
        } else {
            section.style.display = '';
        }
    });
}

function formatTagName(tag) {
    // Özel adlandırmalar için dönüşüm tablosu
    const specialNames = {
        'all': 'Tümü',
        'popular': 'Popüler',
        'vegan': 'Vegan',
        'vegetarian': 'Vejetaryen',
        'spicy': 'Acılı',
        'hot': 'Sıcak',
        'cold': 'Soğuk',
        'meat': 'Et',
        'chicken': 'Tavuk',
        'fresh': 'Taze',
        'sweet': 'Tatlı',
        'traditional': 'Geleneksel',
        'breakfast': 'Kahvaltı',
        'high-protein': 'Protein',
        'low-carb': 'Düşük Karb',
        'regional': 'Yöresel',
        'premium': 'Premium',
        'dairy-free': 'Süt Ürünsüz',
        'plant-based': 'Bitkisel',
        'chef-special': 'Şef Özel',
        'seasonal': 'Mevsimlik',
        'comfort-food': 'Lezzet Bombası',
        'organic': 'Organik',
        'local': 'Yerel',
        'dinner': 'Akşam',
        'eco-friendly': 'Çevre Dostu',
        'favorites': 'Favoriler'
    };
    
    // Özel bir ismi varsa onu kullan
    if (specialNames[tag]) return specialNames[tag];
    
    // Yoksa basit formatlama yap
    return tag
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}
