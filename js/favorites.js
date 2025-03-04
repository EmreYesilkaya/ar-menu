/**
 * Favoriler Özelliği - Düzenlendi ve Hataları Giderildi
 * Kullanıcıların menü öğelerini favorilere ekleyip görebilmelerini sağlar
 */

document.addEventListener('DOMContentLoaded', () => {
    // Favoriler sistemini ve rozetini hemen başlat
    updateFavoritesCount();
    
    // LocalStorage'da favoriler varsa al, yoksa boş array oluştur
    const favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
    
    // Favori sekmesi ekle
    addFavoritesTab();
    
    // Sayfa yüklendiğinde mevcut menü öğelerine favori butonlarını ekle
    setupInitialFavoriteButtons();
    
    // Yeni eklenen menü öğeleri için MutationObserver ekle
    setupMenuItemsObserver();
});

// LocalStorage'dan favori sayısını alıp badge'i güncelle
function updateFavoritesCount() {
    const favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
    const favoritesBadge = document.getElementById('favoritesBadge');
    
    if (favoritesBadge) {
        favoritesBadge.textContent = favorites.length;
        favoritesBadge.style.display = favorites.length > 0 ? 'flex' : 'none';
    }
    
    // Ayrıca üst menüdeki favoriler butonundaki badge'i de güncelle
    const headerFavoritesBadge = document.querySelector('#favoritesBtn .notification-badge');
    if (headerFavoritesBadge) {
        headerFavoritesBadge.textContent = favorites.length;
        headerFavoritesBadge.style.display = favorites.length > 0 ? 'inline-flex' : 'none';
    }
    
    // Bu fonksiyonu global olarak erişilebilir yap
    window.updateFavoritesCount = updateFavoritesCount;
}

// Sayfa ilk yüklendiğinde mevcut menü öğelerine favori butonları ekle
function setupInitialFavoriteButtons() {
    // Tüm menü öğelerini seç
    const menuItems = document.querySelectorAll('.menu-item');
    
    if (menuItems.length > 0) {
        // Her menü öğesine favori butonu ekle
        menuItems.forEach(menuItem => addFavoriteButtonToMenuItem(menuItem));
    } else {
        // Eğer henüz menü öğeleri yüklenmediyse, kısa bir gecikmeyle tekrar dene
        setTimeout(() => {
            const delayedMenuItems = document.querySelectorAll('.menu-item');
            if (delayedMenuItems.length > 0) {
                delayedMenuItems.forEach(menuItem => addFavoriteButtonToMenuItem(menuItem));
            }
        }, 1000);
    }
}

// Yeni eklenen menü öğeleri için MutationObserver
function setupMenuItemsObserver() {
    // DOM değişikliklerini izlemek için bir observer oluştur
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Eğer yeni elemanlar eklendiyse
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    // Eğer eklenen bir menu-item ise
                    if (node.nodeType === 1 && node.classList.contains('menu-item')) {
                        // Favori butonu ekle
                        addFavoriteButtonToMenuItem(node);
                    }
                    
                    // Alt elemanlarda menu-item öğeleri var mı diye kontrol et
                    if (node.nodeType === 1) {
                        const menuItems = node.querySelectorAll('.menu-item');
                        if (menuItems.length) {
                            menuItems.forEach(menuItem => addFavoriteButtonToMenuItem(menuItem));
                        }
                    }
                });
            }
        });
    });
    
    // Kontrol edilecek elementleri izle
    const menuSections = document.querySelectorAll('.menu-section');
    menuSections.forEach(section => {
        observer.observe(section, { childList: true, subtree: true });
    });
}

// Menü öğesine favori butonu ekle
function addFavoriteButtonToMenuItem(menuItem) {
    // Eğer bu öğeye zaten favori butonu eklenmiş ise tekrar ekleme
    if (menuItem.querySelector('.favorite-btn')) return;
    
    // Favori listesini al
    const favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
    
    // Menü öğesi ID'si için veri öğesi kullan ya da oluştur
    let itemId = menuItem.dataset.itemId;
    
    if (!itemId) {
        // ID üretmek için öğe başlığı ve fiyatını kullan
        const menuItemTitle = menuItem.querySelector('.menu-item-title');
        const menuItemPrice = menuItem.querySelector('.menu-item-price');
        
        if (menuItemTitle && menuItemPrice) {
            itemId = `${menuItemTitle.textContent.trim().toLowerCase().replace(/\s+/g, '_')}_${menuItemPrice.textContent.trim().replace(/\s+/g, '')}`;
            menuItem.dataset.itemId = itemId;
        } else {
            // Eğer başlık ve fiyat bulunamazsa benzersiz bir ID oluştur
            itemId = 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
            menuItem.dataset.itemId = itemId;
        }
    }
    
    // Favori butonu oluştur
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn';
    favoriteBtn.innerHTML = favorites.includes(itemId) 
        ? '<i class="fas fa-heart"></i>' 
        : '<i class="far fa-heart"></i>';
    
    // Menü öğesi resim konteynerini bul
    const menuItemImgContainer = menuItem.querySelector('.menu-item-img-container');
    
    if (menuItemImgContainer) {
        // Menü öğesi resim konteynerine butonu ekle
        menuItemImgContainer.style.position = 'relative';
        menuItemImgContainer.appendChild(favoriteBtn);
    } else {
        // Eğer resim konteyneri yoksa, doğrudan menü öğesine ekle
        const menuItemImg = menuItem.querySelector('.menu-item-img');
        if (menuItemImg) {
            const parentElement = menuItemImg.parentNode;
            parentElement.style.position = 'relative';
            parentElement.appendChild(favoriteBtn);
        }
    }
    
    // Favori butonu için olay dinleyicisi ekle
    favoriteBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Butonun altındaki öğeye tıklanmasını engelle
        toggleFavorite(itemId, favoriteBtn);
    });
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
        
        // Dokunma geri bildirimi
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([50, 30, 50]);
        }
    }
    
    // LocalStorage'a kaydet
    localStorage.setItem('arMenuFavorites', JSON.stringify(favorites));
    
    // Favoriler rozetini güncelle
    updateFavoritesCount();
    
    // Favoriler sekmesini güncelle
    if (document.querySelector('#favoritesSection')) {
        updateFavoritesSection();
    }
    
    // Aynı ID'ye sahip tüm diğer favori butonlarını da güncelle
    document.querySelectorAll(`.menu-item[data-item-id="${itemId}"] .favorite-btn`).forEach(btn => {
        if (btn !== button) {
            btn.innerHTML = button.innerHTML;
        }
    });
}

// Favoriler sekmesi ekle
function addFavoritesTab() {
    // Menü sekmeleri konteyneri var mı kontrol et
    const menuTabs = document.querySelector('.menu-tabs');
    if (!menuTabs) return;
    
    // Favoriler sekmesi zaten var mı kontrol et
    if (document.querySelector('.menu-tab[data-target="favorites"]')) return;
    
    // Favoriler sekmesi oluştur ve ekle
    const favoritesTab = document.createElement('a');
    favoritesTab.href = '#favoritesSection';
    favoritesTab.className = 'menu-tab';
    favoritesTab.setAttribute('data-target', 'favorites');
    favoritesTab.innerHTML = `
        <span class="tab-emoji">❤️</span> Favorilerim
    `;
    
    // Sekmeyi ekle - son sekme olarak
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
    if (mainContainer) {
        mainContainer.appendChild(favoritesSection);
    }
    
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
        
        // Favoriler içeriğini güncelle
        updateFavoritesSection();
        
        // Favoriler bölümüne git
        favoritesSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Favoriler bölümünü güncelle - scroll işlemi ekleyerek
function updateFavoritesSection(scrollToSection = false) {
    const favoritesContainer = document.getElementById('favoriteItems');
    if (!favoritesContainer) return;
    
    // Favorileri local storage'dan al
    let favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
    
    // Favori sayısını güncelle
    updateFavoritesCount();
    
    // İçeriği temizle
    favoritesContainer.innerHTML = '';
    
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
    
    // Her favori öğeyi bul ve kopyasını favoriler bölümüne ekle
    let foundItems = 0;
    
    favorites.forEach(itemId => {
        // DOM'da itemId'ye sahip menü öğesini bul
        const originalItem = document.querySelector(`.menu-item[data-item-id="${itemId}"]`);
        
        if (originalItem) {
            // Orijinal öğeyi kopyala
            const itemClone = originalItem.cloneNode(true);
            
            // Kopya öğeyi favoriler bölümüne ekle
            favoritesContainer.appendChild(itemClone);
            foundItems++;
            
            // AR ve favoriler butonlarını yeniden ayarla
            setupClonedItemButtons(itemClone, itemId);
        }
    });
    
    // Eğer hiç öğe bulunamadıysa, favoriler listesini temizle
    if (foundItems === 0 && favorites.length > 0) {
        favoritesContainer.innerHTML = `
            <div class="no-favorites">
                <div class="no-favorites-emoji">🔍</div>
                <h3 class="no-favorites-title">Favorileriniz bulunamadı</h3>
                <p class="no-favorites-message">Favorilerinize eklediğiniz ürünler menüde bulunamadı. Başka ürünler ekleyebilirsiniz.</p>
            </div>
        `;
        
        // Eski favori listesini temizle
        localStorage.setItem('arMenuFavorites', JSON.stringify([]));
        updateFavoritesCount();
    }
    
    // Scroll işlemi gerekli ise favoriler bölümüne kaydır
    if (scrollToSection) {
        const favoritesSection = document.getElementById('favoritesSection');
        if (favoritesSection) {
            favoritesSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Kopyalanmış menü öğesindeki butonları ayarla
function setupClonedItemButtons(itemClone, itemId) {
    // Favori butonunu ayarla
    const favoriteBtn = itemClone.querySelector('.favorite-btn');
    if (favoriteBtn) {
        favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>'; // Favori olduğundan emin ol
        
        // Tıklama olayını yeniden ekle
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(itemId, favoriteBtn);
            
            // Favoriler listesinde artık öğe kalmadıysa, güncelle
            setTimeout(() => {
                const favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
                if (favorites.length === 0) {
                    updateFavoritesSection();
                }
            }, 100);
        });
    }
    
    // AR butonunu ayarla
    const arButton = itemClone.querySelector('.menu-item-ar');
    if (arButton) {
        arButton.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Bu öğe için AR modülünü başlat
            if (window.ARModule) {
                const modelPath = arButton.getAttribute('data-model');
                const usdzPath = arButton.getAttribute('data-usdz');
                
                const item = {
                    name: itemClone.querySelector('.menu-item-title')?.textContent,
                    modelPath: modelPath,
                    usdz: usdzPath,
                    image: itemClone.querySelector('.menu-item-img')?.src
                };
                
                ARModule.showAR(item);
            } else {
                console.error('AR modülü bulunamadı');
                showStatusMessage('AR görüntüleme için gerekli modül yüklenemedi.', 3000);
            }
        });
    }
}

// Favoriler düğmesine tıklama olayını global olarak erişilebilir hale getir
window.showFavoritesSection = function() {
    const favoritesSection = document.getElementById('favoritesSection');
    if (favoritesSection) {
        // Favoriler bölümüne git
        favoritesSection.scrollIntoView({ behavior: 'smooth' });
        
        // Favoriler bölümünü güncelle
        updateFavoritesSection(false);
        
        // Vurgu için geçici sınıf ekle
        favoritesSection.classList.add('highlight-section');
        setTimeout(() => {
            favoritesSection.classList.remove('highlight-section');
        }, 2000);
    }
};

// Bu fonksiyonu global olarak erişilebilir yap
window.updateFavoritesSection = updateFavoritesSection;

// Bildirim göster
function showStatusMessage(message, duration = 2000) {
    // PopupManager varsa onu kullan
    if (window.PopupManager && window.PopupManager.showStatusMessage) {
        window.PopupManager.showStatusMessage(message, duration);
        return;
    }
    
    // Varolan status mesaj elementini kullan
    const statusEl = document.getElementById('statusMessage');
    if (statusEl) {
        statusEl.innerHTML = `<div class="alert alert-info"><div class="alert-emoji">ℹ️</div><div>${message}</div></div>`;
        statusEl.style.display = 'block';
        
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, duration);
        return;
    }
    
    // Hiçbiri yoksa basit bir bildirim oluştur
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = 'rgba(0,0,0,0.8)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '20px';
    notification.style.zIndex = '1000';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        document.body.removeChild(notification);
    }, duration);
}