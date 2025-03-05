/**
 * Emoji Etiketleri
 * Sayfa yüklendiğinde ve DOM değişikliklerinde etiketlere emoji ekleyen script
 */

// Global olarak emoji-etiket eşlemesi tanımla
const tagEmojis = {
    // Temel etiketler
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
    'regional': '🏞️',
    'premium': '✨',
    'organic': '🌎',
    'dairy-free': '🥛',
    'plant-based': '🌱',
    'chef-special': '👨‍🍳',
    'seasonal': '🌞',
    'comfort-food': '🏠',
    'gluten-free': '🌾',
    'new': '🆕',
    'gourmet': '👑',
    'healthy': '💚',
    'low-calorie': '🍃',
    'antioxidant': '🍇',
    
    // YENİ: Eksik etiketler
    'cheese': '🧀',
    'peynir': '🧀',
    'sharing': '🤝',
    'paylaşımlık': '🤝',
    'paylasimlik': '🤝',
    'caffeine': '☕',
    'cultural': '🌍',
    'folk': '🏮',
    'eggs': '🥚',
    'yumurta': '🥚',
    'morning': '🌅',
    'sabah': '🌅',
    'coffee': '☕',
    'tea': '🍵',
    'dessert': '🍰',
    'seafood': '🦐',
    'fish': '🐟',
    'soup': '🍲',
    'salad': '🥗',
    'pasta': '🍝',
    'burger': '🍔',
    'pizza': '🍕',
    'sandwich': '🥪',
    'wrap': '🌯',
    'wraps': '🌯',
    'grill': '🔥',
    'bbq': '🍖',
    'quick': '⚡',
    'slow-cooked': '⏱️',
    'drink': '🥤',
    'smoothie': '🧃',
    'appetizer': '🥟',
    'main': '📋',
    'side': '🍟',
    'starter': '🍽️',
    'eco-friendly': '♻️',
    'local': '📍',
    'dinner': '🍽️',
    'lunch': '🥙',
    'brunch': '🥐',
    'supper': '🌙',
    'snack': '🥨',
    'kids': '👶',
    'family': '👨‍👩‍👧‍👦',
    'shareable': '🤝',
    'handcrafted': '🧶',
    'homemade': '🏠',
    'artisanal': '🧑‍🎨',
    'keto': '🥑',
    'no-sugar': '🚫🍭',
    'allergen-free': '✅',
    'nuts': '🥜',
    'fermented': '🧪',
    'probiotic': '🦠',
    'summer': '☀️',
    'yaz': '☀️',
    'winter': '❄️',
    'spring': '🌷',
    'autumn': '🍂',
    'refreshing': '🧊',
    'warming': '♨️',
    'cooling': '❄️',
    'citrus': '🍋',
    'wholesome': '🌈',
};

// İşlenen etiketleri takip eden Set
const processedTags = new Set();

document.addEventListener('DOMContentLoaded', function() {
    console.log('Emoji tag handler initialized');
    
    // İlk yükleme
    initEmojiTags();
    
    // DOM değişikliklerini izle
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        for (const mutation of mutations) {
            // Yeni düğümler eklendiğinde
            if (mutation.addedNodes.length > 0) {
                shouldUpdate = true;
                break;
            }
            
            // Sınıf değişiklikleri
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('food-tag') || 
                    target.classList.contains('food-tags') ||
                    target.classList.contains('hidden-tag')) {
                    shouldUpdate = true;
                    break;
                }
            }
        }
        
        if (shouldUpdate) {
            // Gecikmeyi kaldırarak daha hızlı güncelleyelim
            initEmojiTags();
        }
    });
    
    // Tüm DOM'u izle
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
    
    // 'daha' butonlarına tıklanınca da emoji güncellemesi yap
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tag-more')) {
            // Kısa bir gecikme ile emojileri güncelle - etiketler açıldıktan sonra
            setTimeout(initEmojiTags, 50);
        }
    });
    
    // Sayfa yükleme sonrası bir kez daha kontrol et
    window.addEventListener('load', function() {
        setTimeout(initEmojiTags, 300);
    });
});

// Emoji etiketlerini başlat - ana fonksiyon
function initEmojiTags() {
    // Tüm tag-more olmayan etiketleri seç
    const allTags = document.querySelectorAll('.food-tag:not(.tag-more)');
    
    // Her etiketi emojilerle güncelle
    allTags.forEach(tag => {
        addEmojiToTag(tag);
    });
    
    // Filtre butonlarına emoji ekle
    document.querySelectorAll('.filter-btn').forEach(btn => {
        addEmojiToFilterBtn(btn);
    });
}

// Tek bir etikete emoji ekleme
function addEmojiToTag(tag) {
    // Eğer tag zaten emoji içeriyorsa işlem yapma
    if (tag.hasAttribute('data-emoji-added')) {
        return;
    }
    
    // Eğer etiketin görünürlüğü none ise bekle
    if (tag.style.display === 'none') {
        return;
    }
    
    // Etiket türünü belirle
    let tagType = '';
    
    // tag-xxx formatındaki sınıf adından etiket türünü çıkar
    for (const cls of tag.classList) {
        if (cls.startsWith('tag-') && cls !== 'tag-more' && cls !== 'food-tag' && cls !== 'hidden-tag' && cls !== 'clickable') {
            tagType = cls.replace('tag-', '');
            break;
        }
    }
    
    if (tagType && tagEmojis[tagType]) {
        // Mevcut içeriği al
        const currentText = tag.textContent.trim();
        
        // Eğer emoji zaten yoksa emoji ekle
        if (!currentText.includes(tagEmojis[tagType])) {
            tag.innerHTML = `<span class="tag-emoji">${tagEmojis[tagType]}</span> <span class="tag-text">${currentText}</span>`;
            tag.setAttribute('data-emoji-added', 'true');
        }
    }
}

// Filtre butonuna emoji ekleme
function addEmojiToFilterBtn(btn) {
    // Zaten işlenmişse atla
    if (btn.hasAttribute('data-emoji-added')) {
        return;
    }
    
    // Filtre değerini al
    const filterValue = btn.getAttribute('data-filter');
    
    if (filterValue && tagEmojis[filterValue]) {
        // Mevcut içeriği al
        const currentText = btn.textContent.trim();
        
        // Emoji ekle
        if (!currentText.includes(tagEmojis[filterValue])) {
            btn.innerHTML = `<span class="filter-emoji">${tagEmojis[filterValue]}</span> <span class="filter-text">${currentText}</span>`;
            btn.setAttribute('data-emoji-added', 'true');
        }
    }
}

// Gizli etiketler için özel güncelleme
function updateHiddenTagsEmojis(container) {
    if (!container) return;
    
    // Konteynerdeki tüm gizli etiketlere emoji ekle
    const hiddenTags = container.querySelectorAll('.food-tag.hidden-tag');
    hiddenTags.forEach(tag => {
        // Görünür hale geldiğinde emoji ekle
        if (!tag.classList.contains('hidden') && !tag.hasAttribute('data-emoji-added')) {
            addEmojiToTag(tag);
        }
    });
}

// Global erişim için
window.initEmojiTags = initEmojiTags;
window.updateHiddenTagsEmojis = updateHiddenTagsEmojis;
window.addEmojiToTag = addEmojiToTag;

// Hemen çalıştır
if (document.readyState !== 'loading') {
    initEmojiTags();
}
