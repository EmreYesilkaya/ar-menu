/**
 * AR Menü Uygulaması - Menü Yükleme Modülü
 * menu-data.js verilerini kullanarak tüm kategoriler için menü öğelerini hazırlar
 */

const MenuLoader = (function() {
    // Özel kategori başlıkları ve açıklamaları
    const categoryDescriptions = {
        mainDishes: "Özenle hazırlanmış ana yemeklerimiz arasından seçiminizi yapın. Tüm ana yemeklerimiz taze ve kaliteli malzemeler kullanılarak hazırlanmaktadır.",
        desserts: "Geleneksel ve modern tatlı çeşitlerimiz arasından kendinize bir lezzet ziyafeti çekin.",
        drinks: "Sıcak ve soğuk içecek çeşitlerimiz ile yemeğinizi taçlandırın.",
        salads: "Taze ve sağlıklı salata çeşitlerimiz ile öğününüzü zenginleştirin.",
        breakfast: "Güne güzel bir başlangıç yapmak için kahvaltı çeşitlerimizi deneyin.",
        soups: "Geleneksel Türk mutfağından çorba çeşitlerimiz ile yemeğe lezzetli bir başlangıç yapın.",
        popular: "En çok tercih edilen ve beğenilen lezzetlerimiz."
    };

    // Tüm kategorileri ve içerikleri yükleme
    function loadAllCategories() {
        console.log("Tüm menü kategorileri yükleniyor...");
        
        if (!window.MenuDB) {
            console.error("MenuDB bulunamadı! menu-data.js dosyasını kontrol ediniz.");
            showError("Menü verileri yüklenemedi. Sayfayı yenilemeyi deneyin.");
            return;
        }
        
        // Menü kategorilerini al
        const categories = MenuDB.getCategories();
        
        categories.forEach(category => {
            loadCategoryContent(category.id);
        });
        
        // Popüler öğeleri de yükle
        loadPopularItems();
    }
    
    // Belirli bir kategoriyi yükleme
    function loadCategoryContent(categoryId) {
        // Kategori konteynerini bul
        const categoryContainer = document.getElementById(categoryId);
        if (!categoryContainer) {
            console.warn(`"${categoryId}" ID'li kategori konteyneri bulunamadı!`);
            return;
        }
        
        // Kategori verilerini al
        const categoryItems = MenuDB.getCategory(categoryId);
        const categoryInfo = MenuDB.getCategoryInfo(categoryId);
        
        // Kategori başlığını ve açıklamasını güncelle
        updateCategoryHeader(categoryId, categoryInfo);
        
        // İçeriği temizle
        categoryContainer.innerHTML = '';
        
        if (categoryItems.length === 0) {
            categoryContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-emoji">🍽️</div>
                    <div class="no-results-title">Bu kategoride henüz ürün bulunmuyor</div>
                    <div class="no-results-message">Lütfen daha sonra tekrar kontrol ediniz.</div>
                </div>
            `;
            return;
        }
        
        // Kategori öğelerini ekle
        categoryItems.forEach(item => {
            const menuItemElement = createMenuItemElement(item);
            categoryContainer.appendChild(menuItemElement);
        });
    }
    
    // Kategori başlığını ve açıklamasını güncelle
    function updateCategoryHeader(categoryId, categoryInfo) {
        if (!categoryInfo) return;
        
        // Kategori başlığını bul
        const sectionTitle = document.querySelector(`#${categoryId}Section .section-title`);
        if (sectionTitle) {
            sectionTitle.innerHTML = `${categoryInfo.icon} ${categoryInfo.title}`;
        }
        
        // Kategori açıklamasını ekle
        const sectionDescription = categoryDescriptions[categoryId];
        if (sectionDescription) {
            let descEl = document.querySelector(`#${categoryId}Section .section-desc`);
            
            // Açıklama elementi yoksa oluştur
            if (!descEl) {
                descEl = document.createElement('p');
                descEl.className = 'section-desc';
                if (sectionTitle && sectionTitle.nextSibling) {
                    sectionTitle.parentNode.insertBefore(descEl, sectionTitle.nextSibling);
                } else if (sectionTitle) {
                    sectionTitle.parentNode.appendChild(descEl);
                }
            }
            
            descEl.textContent = sectionDescription;
        }
    }
    
    // Popüler öğeleri yükle
    function loadPopularItems() {
        const popularContainer = document.getElementById('popularItems');
        if (!popularContainer) return;
        
        // Popüler öğeleri al
        const popularItems = MenuDB.getPopular(6);
        
        if (popularItems.length === 0) {
            popularContainer.innerHTML = `
                <div class="no-results">
                    <div class="no-results-emoji">🌟</div>
                    <div class="no-results-title">Popüler ürün bulunmuyor</div>
                    <div class="no-results-message">Yakında popüler ürünleri burada görebilirsiniz.</div>
                </div>
            `;
            return;
        }
        
        // İçeriği temizle
        popularContainer.innerHTML = '';
        
        // Popüler öğeleri ekle
        popularItems.forEach(item => {
            const menuItemElement = createMenuItemElement(item);
            popularContainer.appendChild(menuItemElement);
        });
        
        // Popüler kategori başlığını ve açıklamasını güncelle
        updateCategoryHeader('popular', {
            title: 'Popüler Seçimler',
            icon: '🔥'
        });
    }
    
    // Menü öğesi elementi oluştur
    function createMenuItemElement(item) {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.dataset.itemId = item.id || generateItemId(item);
        
        // Öğe HTML yapısını oluştur
        menuItem.innerHTML = `
            <div class="menu-item-img-container">
                <img src="${item.image}" alt="${item.name}" class="menu-item-img" 
                    onerror="this.src='https://placehold.co/220x140/eee/999?text=${encodeURIComponent(item.name)}'">
                <button class="favorite-btn">
                    <i class="${isFavorite(item.id) ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="menu-item-info">
                <div class="menu-item-title">${item.name}</div>
                ${item.description ? `<div class="menu-item-description">${item.description}</div>` : ''}
                ${createTagsHtml(item.tags)}
                ${createRatingHtml(item.rating, item.ratingCount)}
                <div class="menu-item-price">${item.price}</div>
                <button class="menu-item-ar" 
                        data-model="${item.modelPath}" 
                        data-usdz="${item.usdz || ''}">
                    <i class="fas fa-cube"></i> AR'da Gör
                </button>
            </div>
        `;
        
        // AR butonu için olay ekle
        const arButton = menuItem.querySelector('.menu-item-ar');
        arButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (window.ARModule) {
                ARModule.showAR(item);
            } else {
                showError("AR modülü yüklenemedi. Sayfayı yenileyin veya başka bir tarayıcı deneyin.");
            }
        });
        
        // Favori butonu için olay ekle
        const favoriteBtn = menuItem.querySelector('.favorite-btn');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(item.id, favoriteBtn);
        });
        
        return menuItem;
    }
    
    // Etiketler için HTML oluştur
    function createTagsHtml(tags) {
        if (!tags || tags.length === 0) return '';
        
        let tagsHtml = '<div class="food-tags">';
        
        tags.forEach(tag => {
            const tagClass = `tag-${tag}`;
            tagsHtml += `<span class="food-tag ${tagClass}">${formatTagName(tag)}</span>`;
        });
        
        tagsHtml += '</div>';
        return tagsHtml;
    }
    
    // Puanlar için HTML oluştur
    function createRatingHtml(rating, count) {
        if (!rating) return '';
        
        const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
        
        return `
            <div class="rating">
                <span class="stars">${stars}</span>
                <span class="rating-value">${rating.toFixed(1)}</span>
                ${count ? `<span class="rating-count">(${count})</span>` : ''}
            </div>
        `;
    }
    
    // Etiket ismini formatla
    function formatTagName(tag) {
        const tagNames = {
            'vegan': '🌱 Vegan',
            'vegetarian': '🥕 Vejetaryen',
            'spicy': '🌶️ Acılı',
            'popular': '🔥 Popüler',
            'new': '🆕 Yeni',
            'gluten-free': 'Glutensiz',
            'hot': '🔥 Sıcak',
            'cold': '❄️ Soğuk',
            'seasonal': '🍂 Mevsimlik',
            'fresh': '✨ Taze',
            'raw': '🥗 Çiğ',
            'nuts': '🥜 Kuruyemiş',
            'meat': '🥩 Et',
            'chicken': '🍗 Tavuk'
        };
        
        return tagNames[tag] || tag;
    }
    
    // Öğe ID'si oluştur
    function generateItemId(item) {
        return item.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    }
    
    // Öğe favorilerde mi kontrol et
    function isFavorite(itemId) {
        const favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
        return favorites.includes(itemId);
    }
    
    // Favorileri değiştir
    function toggleFavorite(itemId, button) {
        let favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
        
        const index = favorites.indexOf(itemId);
        if (index > -1) {
            // Favorilerden çıkar
            favorites.splice(index, 1);
            button.innerHTML = '<i class="far fa-heart"></i>';
            showMessage('Favorilerden çıkarıldı');
        } else {
            // Favorilere ekle
            favorites.push(itemId);
            button.innerHTML = '<i class="fas fa-heart"></i>';
            showMessage('Favorilere eklendi');
            
            // Dokunma geri bildirimi
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate([50, 30, 50]);
            }
        }
        
        // LocalStorage'a kaydet
        localStorage.setItem('arMenuFavorites', JSON.stringify(favorites));
        
        // Favoriler rozetini güncelle
        updateFavoritesBadge(favorites.length);
        
        // Favoriler sekmesini güncelle
        if (window.updateFavoritesSection && typeof window.updateFavoritesSection === 'function') {
            window.updateFavoritesSection();
        }
    }
    
    // Favoriler rozetini güncelle
    function updateFavoritesBadge(count) {
        const badge = document.getElementById('favoritesBadge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    // Hata mesajı göster
    function showError(message) {
        if (window.showStatusMessage) {
            window.showStatusMessage(message, 4000);
        } else {
            alert(message);
        }
    }
    
    // Bilgi mesajı göster
    function showMessage(message) {
        if (window.showStatusMessage) {
            window.showStatusMessage(message, 2000);
        }
    }
    
    // Arama işlevi
    function searchMenuItems(query) {
        if (!window.MenuDB) return [];
        return MenuDB.search(query);
    }
    
    // Arama sonuçlarını göster
    function displaySearchResults(results, container) {
        if (!container) return;
        
        // İçeriği temizle
        container.innerHTML = '';
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-emoji">🔍</div>
                    <div class="no-results-title">Sonuç bulunamadı</div>
                    <div class="no-results-message">Farklı bir arama terimi deneyin.</div>
                </div>
            `;
            return;
        }
        
        // Sonuçları ekle
        results.forEach(item => {
            const menuItemElement = createMenuItemElement(item);
            container.appendChild(menuItemElement);
        });
    }
    
    // Public API
    return {
        loadAllCategories,
        loadCategory: loadCategoryContent,
        loadPopularItems,
        searchMenuItems,
        displaySearchResults,
        createMenuItemElement
    };
})();

// Sayfa yüklendiğinde menüyü yükle
document.addEventListener('DOMContentLoaded', () => {
    // MenuDB modülü yüklendiyse
    if (window.MenuDB) {
        // Tüm kategorileri yükle
        MenuLoader.loadAllCategories();
        
        // Arama kutusu
        const searchInput = document.getElementById('menuSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                
                if (query.length >= 2) {
                    const results = MenuLoader.searchMenuItems(query);
                    
                    // Ana öğeleri gizle ve arama sonuçlarını göster
                    document.querySelectorAll('.menu-section').forEach(section => {
                        section.style.display = 'none';
                    });
                    
                    // Arama sonuçları için konteyner oluşturma veya güncelleme
                    let searchResultsSection = document.getElementById('searchResultsSection');
                    if (!searchResultsSection) {
                        searchResultsSection = document.createElement('section');
                        searchResultsSection.id = 'searchResultsSection';
                        searchResultsSection.className = 'menu-section';
                        searchResultsSection.innerHTML = `
                            <h2 class="section-title">🔍 Arama Sonuçları</h2>
                            <div class="menu-items" id="searchResults"></div>
                        `;
                        
                        document.querySelector('.main-container').appendChild(searchResultsSection);
                    } else {
                        searchResultsSection.style.display = 'block';
                    }
                    
                    // Sonuçları göster
                    MenuLoader.displaySearchResults(results, document.getElementById('searchResults'));
                    
                    // Arama sonuçlarının konumlanması için ayarlamalar
                    document.querySelector('.menu-tabs-container').style.display = 'none';
                    document.querySelector('.search-container').classList.add('active-search');
                } else if (query.length === 0) {
                    // Arama kutusu boş ise normal görünüme geri dön
                    document.querySelectorAll('.menu-section').forEach(section => {
                        if (section.id !== 'searchResultsSection') {
                            section.style.display = 'block';
                        }
                    });
                    
                    // Arama sonuçları bölümünü gizle
                    const searchResultsSection = document.getElementById('searchResultsSection');
                    if (searchResultsSection) {
                        searchResultsSection.style.display = 'none';
                    }
                    
                    // Menü sekmelerini yeniden göster
                    document.querySelector('.menu-tabs-container').style.display = 'block';
                    document.querySelector('.search-container').classList.remove('active-search');
                }
            });
        }
    } else {
        console.error("MenuDB modülü bulunamadı! menu-data.js dosyasının doğru şekilde yüklendiğinden emin olun.");
    }
});
