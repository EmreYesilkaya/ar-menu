/**
 * Menü Öğeleri Render Edici
 * Menü öğesi kartlarını oluşturan ve görüntüleyen kod
 */

const MenuRenderer = (function() {
    // Emoji haritası - TÜM etiketler için genişletilmiş
    const tagEmojis = {
        // Temel etiketler
        'vegan': '🌱',
        'vegetarian': '🥗',
        'spicy': '🌶️',
        'popular': '⭐',
        'meat': '🥩',
        'chicken': '🍗',
        'high-protein': '💪',
        'low-carb': '📉',
        'traditional': '📜',
        'hot': '🔥',
        'cold': '❄️',
        'fresh': '🌿',
        'sweet': '🍯',
        'breakfast': '🍳',
        
        // Diğer etiketler
        'regional': '🏞️',
        'premium': '✨',
        'organic': '🌎',
        'dairy-free': '🥛',
        'plant-based': '🌱',
        'chef-special': '👨‍🍳',
        'seasonal': '🌞',
        'comfort-food': '🏠',
        'local': '📍',
        'dinner': '🍽️',
        'eco-friendly': '♻️',
        'gluten-free': '🌾',
        'new': '🆕',
        'gourmet': '👑',
        'healthy': '💚',
        'low-calorie': '🍃',
        'antioxidant': '🍇',
        
        // Eksik etiketler için yeni emoji eklemeleri
        'handcrafted': '🧶',
        'homemade': '🏠',
        'artisanal': '🧑‍🎨',
        'keto': '🥑',
        'seafood': '🦐',
        'fish': '🐟',
        'dessert': '🍰',
        'soup': '🍲',
        'salad': '🥗',
        'pasta': '🍝',
        'burger': '🍔',
        'pizza': '🍕',
        'sandwich': '🥪',
        'wraps': '🌯',
        'grill': '🔥',
        'bbq': '🍖',
        'quick': '⚡',
        'slow-cooked': '⏱️',
        'gluten-free': '🌾',
        'no-sugar': '🚫🍭',
        'allergen-free': '✅',
        'nuts': '🥜',
        'kids': '👶',
        'family': '👨‍👩‍👧‍👦',
        'shareable': '🤝',
        'brunch': '🥐',
        'lunch': '🥙',
        'dinner': '🍽️',
        'supper': '🌙',
        'snack': '🥨',
        'appetizer': '🥟',
        'main': '📋',
        'side': '🍟',
        'drink': '🥤',
        'smoothie': '🧃',
        'fermented': '🧪',
        'probiotic': '🦠'
    };

    // Etiketleri renderla - emoji ve daha fazla göster butonu ile
    function renderTags(tags) {
        if (!tags || !Array.isArray(tags) || tags.length === 0) return '';
        
        // İlk 3 etiketi görünür yap, kalanları gizli sınıfıyla ekle
        const visibleCount = 3;
        const visibleTags = tags.slice(0, visibleCount);
        const hiddenTags = tags.slice(visibleCount);
        
        let html = '<div class="food-tags">';
        
        // Görünür etiketler
        visibleTags.forEach(tag => {
            const emoji = tagEmojis[tag] || '•'; // Emoji yoksa • işareti kullan
            html += `<span class="food-tag tag-${tag}" data-tag="${tag}">${emoji} ${formatTagName(tag)}</span>`;
        });
        
        // Daha fazla etiketi göstermek için buton
        if (hiddenTags.length > 0) {
            html += `<span class="food-tag tag-more" data-count="${hiddenTags.length}">+${hiddenTags.length}</span>`;
            
            // Gizli etiketler (başlangıçta görünmez)
            hiddenTags.forEach(tag => {
                const emoji = tagEmojis[tag] || '•';
                html += `<span class="food-tag tag-${tag} hidden-tag hidden" data-tag="${tag}">${emoji} ${formatTagName(tag)}</span>`;
            });
        }
        
        html += '</div>';
        return html;
    }
    
    // Etiket adını formatlama
    function formatTagName(tag) {
        // Özel adlandırmalar için dönüşüm tablosu
        const specialNames = {
            'high-protein': 'Yüksek Protein',
            'low-carb': 'Düşük Karb',
            'eco-friendly': 'Çevre Dostu',
            'plant-based': 'Bitkisel',
            'dairy-free': 'Süt Ürünsüz',
            'chef-special': 'Şef Özel',
            'comfort-food': 'Ev Lezzeti',
            'gluten-free': 'Glutensiz',
            'low-calorie': 'Düşük Kalori',
            'handcrafted': 'El Yapımı',
            'artisanal': 'Butik',
            'homemade': 'Ev Yapımı',
            'allergen-free': 'Alerjen İçermez',
            'no-sugar': 'Şekersiz'
        };
        
        // Özel isim varsa kullan
        if (specialNames[tag]) return specialNames[tag];
        
        // Yoksa otomatik formatlama
        return tag
            .replace(/-/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase());
    }
    
    // Menü öğesini render etme
    function renderMenuItem(item) {
        return `
        <div class="menu-item" data-id="${item.id}" data-category="${item.category || ''}" data-tags="${item.tags.join(',')}">
            <div class="menu-item-img-container">
                <img class="menu-item-img" src="${item.image}" alt="${item.name}" loading="lazy">
                <button class="favorite-btn" data-id="${item.id}" aria-label="Favorilere ekle">
                    <i class="${isFavorite(item.id) ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="menu-item-info">
                <h3 class="menu-item-title">${item.name}</h3>
                ${renderTags(item.tags)}
                <p class="menu-item-description">${item.description}</p>
                <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>${item.rating.toFixed(1)}</span>
                    <span class="rating-count">(${item.ratingCount})</span>
                </div>
                <div class="menu-item-price">${item.price}</div>
                <button class="menu-item-ar" data-id="${item.id}" data-model="${item.modelPath}">
                    <i class="fas fa-cube"></i>
                    3D Önizleme
                </button>
            </div>
        </div>`;
    }
    
    // Favorileri localStorage'dan kontrol et
    function isFavorite(id) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        return favorites.includes(id);
    }
    
    // Herkese açık API
    return {
        renderMenuItem,
        renderTags,
        formatTagName,
        tagEmojis
    };
})();

// Global erişim
window.MenuRenderer = MenuRenderer;

// Sayfa yüklendiğinde etiketleri başlat
document.addEventListener('DOMContentLoaded', function() {
    // Etiket yönetici olup olmadığını kontrol et
    if (typeof initTagHandlers === 'function') {
        initTagHandlers();
    }
});

/**
 * Menü Öğesi Render Sistemi
 * - HTML formatına çevirir
 * - Etiketleri ve AR düğmelerini oluşturur
 */

// Her bir menü öğesini HTML olarak oluşturur
function renderMenuItems(items, container) {
    if (!container) {
        console.error('Container element bulunamadı');
        return;
    }
    
    // Favorilerin durumunu kontrol et
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Tüm öğeleri döngüye al ve HTML olarak işle
    items.forEach(item => {
        // Menü öğesi konteyneri
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.id = item.id;
        
        // Etiketleri data-tags özelliğine ekle (filtreleme için)
        if (item.tags && item.tags.length > 0) {
            menuItem.setAttribute('data-tags', item.tags.join(','));
        }
        
        // Görsel bölümü - DÜZELTME: Görsel yolu kontrolü eklendi
        const imgContainer = document.createElement('div');
        imgContainer.className = 'menu-item-img-container';
        
        const img = document.createElement('img');
        img.className = 'menu-item-img';
        
        // DÜZELTME: Görsel yolunu doğrudan kullan, resolveAssetPath kullanma
        img.src = item.image;
        img.alt = item.name;
        img.loading = 'lazy';
        
        // DÜZELTME: Görsel yüklenme hatası durumunda yedek görsel göster
        img.onerror = function() {
            console.warn(`Görsel yüklenemedi: ${this.src} (${item.name})`);
            this.src = 'images/placeholder.jpg'; // Yedek görsel
            this.classList.add('fallback-image');
        };
        
        // Favori düğmesi
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = `menu-item-favorite ${favorites.includes(item.id) ? 'active' : ''}`;
        favoriteBtn.innerHTML = `<i class="fas ${favorites.includes(item.id) ? 'fa-heart' : 'fa-heart'}"></i>`;
        favoriteBtn.setAttribute('aria-label', 'Favorilere ekle/çıkar');
        favoriteBtn.setAttribute('data-item-id', item.id);
        
        // Favorilere ekleme/çıkarma işlevi
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Menü öğesi tıklamasını engelle
            toggleFavorite(item.id);
            
            const isFavorite = this.classList.contains('active');
            this.classList.toggle('active');
            this.innerHTML = `<i class="fas ${isFavorite ? 'fa-heart' : 'fa-heart'}"></i>`;
            
            // Haptic geri bildirim
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }
        });
        
        // Görsel bölümünü birleştir
        imgContainer.appendChild(img);
        imgContainer.appendChild(favoriteBtn);
        
        // Bilgi bölümü
        const info = document.createElement('div');
        info.className = 'menu-item-info';
        
        const title = document.createElement('h3');
        title.className = 'menu-item-title';
        title.textContent = item.name;
        
        const description = document.createElement('p');
        description.className = 'menu-item-description';
        description.textContent = item.description;
        
        // Etiketler
        let tags = document.createElement('div');
        tags.className = 'food-tags';
        
        if (item.tags && item.tags.length > 0) {
            // Maximum görünür etiket
            const maxVisibleTags = 3;
            const visibleTags = item.tags.slice(0, maxVisibleTags);
            const hiddenTags = item.tags.slice(maxVisibleTags);
            
            // Görünür etiketleri ekle
            visibleTags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = `food-tag tag-${tag}`;
                tagElement.textContent = formatTagName(tag);
                tags.appendChild(tagElement);
            });
            
            // Gizli etiketler varsa ekleme yap
            if (hiddenTags.length > 0) {
                // Gizli etiketleri ekle
                hiddenTags.forEach(tag => {
                    const tagElement = document.createElement('span');
                    tagElement.className = `food-tag tag-${tag} hidden-tag hidden`;
                    tagElement.textContent = formatTagName(tag);
                    tags.appendChild(tagElement);
                });
                
                // Daha fazla etiketi göster
                const moreTag = document.createElement('span');
                moreTag.className = 'food-tag tag-more';
                moreTag.textContent = `+${hiddenTags.length} daha`;
                tags.appendChild(moreTag);
            }
        }
        
        const price = document.createElement('div');
        price.className = 'menu-item-price';
        price.textContent = item.price;
        
        // AR düğmesi
        const arButton = document.createElement('button');
        arButton.className = 'menu-item-ar';
        arButton.innerHTML = '<i class="fas fa-cube"></i> AR\'da Göster';
        arButton.setAttribute('data-model-path', item.modelPath);
        arButton.setAttribute('data-item-name', item.name);
        
        // AR modelini gösterme işlevi
        arButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const modelPath = this.getAttribute('data-model-path');
            const itemName = this.getAttribute('data-item-name');
            
            if (modelPath) {
                showARModel(modelPath, itemName);
            } else {
                showStatusMessage('Bu ürün için AR modeli bulunmuyor.');
            }
            
            // Haptic geri bildirim
            if ('vibrate' in navigator) {
                navigator.vibrate(30);
            }
        });
        
        // Bilgi bölümünü birleştir
        info.appendChild(title);
        info.appendChild(description);
        info.appendChild(tags);
        info.appendChild(price);
        info.appendChild(arButton);
        
        // Menü öğesini tamamla
        menuItem.appendChild(imgContainer);
        menuItem.appendChild(info);
        
        // Ana konteynere ekle
        container.appendChild(menuItem);
    });
    
    // Emoji etiketlerini güncelleyen işlevi çağırma
    if (window.enhanceTagsWithEmojis) {
        window.enhanceTagsWithEmojis();
    }
}

// Etiket adını formatlama (kebab-case -> Title Case)
function formatTagName(tag) {
    return tag
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Global erişim için dışa aktar
window.renderMenuItems = renderMenuItems;
