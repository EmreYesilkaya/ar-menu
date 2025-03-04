/**
 * Favoriler Özelliği
 * Kullanıcıların menü öğelerini favorilere eklemelerini ve daha sonra görüntülemelerini sağlar.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Favoriler sistemi ayarları
    setupFavoritesSystem();
    
    // Favoriler sekmesi ekle
    addFavoritesTab();
});

// Favorilere ekle/çıkar butonunu her menü öğesine ekle
function setupFavoritesSystem() {
    // LocalStorage'da favoriler varsa al, yoksa boş array oluştur
    const favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
    
    // Tüm menü öğelerine favori butonu ekle
    document.querySelectorAll('.menu-item').forEach(menuItem => {
        // Menü öğesinin ID'sini al
        const itemId = menuItem.dataset.itemId || generateItemId(menuItem);
        menuItem.dataset.itemId = itemId;
        
        // Favori butonu oluştur
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = favorites.includes(itemId) 
            ? '<i class="fas fa-heart"></i>' 
            : '<i class="far fa-heart"></i>';
        
        // Favori butonunu menü öğesinin içine ekle
        const menuItemImg = menuItem.querySelector('.menu-item-img-container') || menuItem.querySelector('.menu-item-img').parentNode;
        menuItemImg.style.position = 'relative';
        menuItemImg.appendChild(favoriteBtn);
        
        // Favori butonu olayı
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Butonun altındaki öğelere tıklamayı engelle
            toggleFavorite(itemId, favoriteBtn);
        });
    });
}

// Menü öğesi için benzersiz ID oluştur
function generateItemId(menuItem) {
    const title = menuItem.querySelector('.menu-item-title').textContent;
    const price = menuItem.querySelector('.menu-item-price').textContent;
    return `${title.trim()}_${price.trim()}`.replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '').toLowerCase();
}

// Öğeyi favorilere ekle/çıkar
function toggleFavorite(itemId, button) {
    let favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
    
    const index = favorites.indexOf(itemId);
    if (index > -1) {
        // Favorilerden çıkar
        favorites.splice(index, 1);
        button.innerHTML = '<i class="far fa-heart"></i>'; // Boş kalp ikonu
        showStatusMessage('Favorilerden çıkarıldı');
    } else {
        // Favorilere ekle
        favorites.push(itemId);
        button.innerHTML = '<i class="fas fa-heart"></i>'; // Dolu kalp ikonu
        showStatusMessage('Favorilere eklendi');
        
        // Haptic feedback
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([50, 30, 50]);
        }
    }
    
    // Favorileri güncelle
    localStorage.setItem('arMenuFavorites', JSON.stringify(favorites));
    
    // Eğer favoriler sekmesi mevcutsa, içeriğini güncelle
    updateFavoritesSection();
}

// Favoriler sekmesini ekle
function addFavoritesTab() {
    // Önce mevcut sekmeleri kontrol et
    const menuTabs = document.querySelector('.menu-tabs');
    if (!menuTabs || document.querySelector('.menu-tab[data-target="favorites"]')) return;
    
    // Favoriler sekmesi oluştur
    const favoritesTab = document.createElement('a');
    favoritesTab.href = '#favoritesSection';
    favoritesTab.className = 'menu-tab';
    favoritesTab.setAttribute('data-target', 'favorites');
    favoritesTab.innerHTML = `
        <span class="tab-emoji">❤️</span> Favoriler
    `;
    
    // Sekmeyi ekle
    menuTabs.appendChild(favoritesTab);
    
    // Favoriler bölümü oluştur
    const favoritesSection = document.createElement('section');
    favoritesSection.id = 'favoritesSection';
    favoritesSection.className = 'menu-section';
    favoritesSection.innerHTML = `
        <h2 class="section-title">❤️ Favorilerim</h2>
        <div class="menu-items" id="favoriteItems"></div>
    `;
    
    // Ana içerik alanına ekle
    const mainContainer = document.querySelector('.main-container');
    mainContainer.appendChild(favoritesSection);
    
    // İlk içeriği yükle
    updateFavoritesSection();
    
    // Sekme tıklama olayı
    favoritesTab.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Diğer sekmelerdeki active class'ı kaldır
        document.querySelectorAll('.menu-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Bu sekmeye active class ekle
        favoritesTab.classList.add('active');
        
        // Favoriler bölümüne git
        favoritesSection.scrollIntoView({
            behavior: 'smooth'
        });
        
        // İçeriği güncelle
        updateFavoritesSection();
    });
}

// Favoriler bölümünü güncelle
function updateFavoritesSection() {
    const favoritesContainer = document.getElementById('favoriteItems');
    if (!favoritesContainer) return;
    
    // Favorileri local storage'dan al
    let favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
    
    // Favoriler boşsa mesaj göster
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="no-favorites">
                <div class="no-favorites-emoji">💔</div>
                <h3 class="no-favorites-title">Henüz favoriniz yok</h3>
                <p class="no-favorites-message">Favori ürünlerinizi eklemek için menü öğelerindeki kalp ikonuna tıklayın.</p>
            </div>
        `;
        return;
    }
    
    // Favorilere eklenen menü öğelerini göster
    favoritesContainer.innerHTML = '';
    favorites.forEach(itemId => {
        // ID ile menü öğesini bul
        const originalItem = document.querySelector(`.menu-item[data-item-id="${itemId}"]`);
        if (originalItem) {
            // Menü öğesini kopyala ve favorilere ekle
            const itemClone = originalItem.cloneNode(true);
            favoritesContainer.appendChild(itemClone);
            
            // Yeni favori butonuna tıklama olayı ekle
            const newFavoriteBtn = itemClone.querySelector('.favorite-btn');
            if (newFavoriteBtn) {
                newFavoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    // Hem orijinal hem de kopya butonu güncelle
                    toggleFavorite(itemId, newFavoriteBtn);
                    const originalBtn = originalItem.querySelector('.favorite-btn');
                    if (originalBtn) {
                        originalBtn.innerHTML = newFavoriteBtn.innerHTML;
                    }
                });
            }
            
            // AR butonu için doğru olayı ayarla
            const arButton = itemClone.querySelector('.menu-item-ar');
            if (arButton) {
                // Orijinal düğme olaylarını kopyalayamayacağımız için, item veri özelliğini ekleyip
                // o menü öğesi için AR'ı başlatan fonksiyonu çağırıyoruz
                arButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    // Orijinal öğenin ID'sine göre menuData'dan öğeyi bulalım
                    const menuItemData = findMenuItemById(itemId);
                    if (menuItemData) {
                        // AR görüntüleyicisini başlat
                        if (arSupport === 'quicklook' && menuItemData.usdz) {
                            initQuickLook(menuItemData);
                        } else if (arSupport === 'webxr') {
                            initWebXR(menuItemData);
                        } else {
                            initModelViewer(menuItemData);
                        }
                    } else {
                        showStatusMessage('Bu öğe için AR modeli bulunamadı.');
                    }
                });
            }
        } else {
            // Eğer orijinal öğe bulunamadıysa (muhtemelen silinmiş veya değişmiş bir öğe)
            // Bu öğeyi favorilerden kaldır
            console.warn(`Favorilerdeki öğe bulunamadı. ID: ${itemId}`);
            favorites = favorites.filter(id => id !== itemId);
            localStorage.setItem('arMenuFavorites', JSON.stringify(favorites));
        }
    });
}

// ID'ye göre menuData içinden öğe bulma
function findMenuItemById(itemId) {
    let allMenuItems = [];
    
    // Tüm kategorilerdeki öğeleri topla
    for (const category in menuData) {
        if (Array.isArray(menuData[category])) {
            allMenuItems = [...allMenuItems, ...menuData[category]];
        }
    }
    
    // ID'ye göre eşleşen öğeyi bul
    for (const item of allMenuItems) {
        const generatedId = `${item.name.trim()}_${item.price.trim()}`.replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '').toLowerCase();
        if (generatedId === itemId) {
            return item;
        }
    }
    
    return null;
}

// Favori sayısını güncelleme ve sekme badge'ini güncelleyen yardımcı fonksiyon
function updateFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
    const favoritesTab = document.querySelector('.menu-tab[data-target="favorites"]');
    
    if (favoritesTab) {
        // Mevcut badge'i bul veya oluştur
        let badge = favoritesTab.querySelector('.tab-count');
        if (!badge && favorites.length > 0) {
            badge = document.createElement('span');
            badge.className = 'tab-count';
            favoritesTab.appendChild(badge);
        }
        
        // Badge içeriğini güncelle veya gizle
        if (badge) {
            if (favorites.length > 0) {
                badge.textContent = favorites.length;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }
    }
}

// Sayfa yüklendiğinde ve her favori değişikliğinde sayıyı güncelle
document.addEventListener('DOMContentLoaded', updateFavoritesCount);
window.addEventListener('storage', updateFavoritesCount); // Diğer sekmelerde yapılan değişiklikleri yakala