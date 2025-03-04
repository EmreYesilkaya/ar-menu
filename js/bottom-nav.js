/**
 * Alt Gezinme Çubuğu İşlevselliği - Güncellendi
 * - Yeni kategoriler menüsü
 * - AR kamera hızlı erişimi
 * - Favoriler listesi
 * - Kullanıcı profili
 */

document.addEventListener('DOMContentLoaded', function() {
    // Alt gezinme çubuğu öğelerini seç
    const navItems = document.querySelectorAll('.bottom-nav-item');
    const favoritesBadge = document.getElementById('favoritesBadge');
    const openARCameraBtn = document.getElementById('openARCamera');
    const showFavoritesBtn = document.getElementById('showFavorites');
    
    // Kategori modalı
    let categoriesModal;
    
    // Favorilerdeki öğelerin sayısını güncelle
    function updateFavoritesCount() {
        const favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
        favoritesBadge.textContent = favorites.length;
        
        if (favorites.length > 0) {
            favoritesBadge.style.display = 'flex';
        } else {
            favoritesBadge.style.display = 'none';
        }
    }
    
    // İlk yüklemede favorileri güncelle
    updateFavoritesCount();
    
    // Alt gezinme çubuğu butonları için tıklama olayları
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Varsayılan link davranışını engelle
            e.preventDefault();
            
            // Dokunma geri bildirimi
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
            
            // Aktif sınıfı güncelle
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');
            
            // Özel işlevler butonlarda tanımlanmadıysa burada işleyelim
            const action = this.getAttribute('data-action');
            if (!action) return;
            
            switch(action) {
                case 'home':
                    // Ana sayfaya git - en üste kaydır
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    break;
                    
                case 'categories':
                    // Kategoriler modalını göster
                    showCategoriesModal();
                    break;
                    
                case 'profile':
                    // Profil/hesap modalını göster
                    showProfileModal();
                    break;
            }
        });
    });
    
    // AR Kamera Düğmesi
    if (openARCameraBtn) {
        openARCameraBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Dokunma geri bildirimi
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate([50, 30, 50]);
            }
            
            // QR Tarayıcı modalını göster
            showQRScannerModal();
        });
    }

    // Favoriler Butonu
    if (showFavoritesBtn) {
        showFavoritesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Favoriler sekmesini kontrol et 
            const favoritesTab = document.querySelector('.menu-tab[data-target="favorites"]');
            if (favoritesTab) {
                // Tıklama olayını tetikle
                favoritesTab.click();
            } else {
                // Favoriler bölümüne git ve güncelle
                const favoritesSection = document.getElementById('favoritesSection');
                if (favoritesSection) {
                    // Favoriler bölümünü görünür yap ve sayfayı kaydır
                    favoritesSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Favoriler bölümünü güncelle
                    if (window.updateFavoritesSection) {
                        window.updateFavoritesSection();
                    }
                } else {
                    console.error('Favoriler bölümü (favoritesSection) bulunamadı!');
                    // Bildirim göster
                    showNotification('Favoriler bölümüne ulaşılamıyor', 'error');
                }
            }
            
            // Dokunma geri bildirimi
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        });
    }
    
    // Kategoriler Modalını Göster
    function showCategoriesModal() {
        // Modal zaten oluşturulmuşsa tekrar oluşturma
        if (categoriesModal) {
            categoriesModal.style.display = 'flex';
            return;
        }
        
        // Tüm kategorileri al
        const categories = [
            { id: 'breakfast', name: 'Kahvaltı', icon: 'fas fa-coffee' },
            { id: 'soups', name: 'Çorbalar', icon: 'fas fa-utensil-spoon' },
            { id: 'salads', name: 'Salatalar', icon: 'fas fa-leaf' },
            { id: 'mainDishes', name: 'Ana Yemekler', icon: 'fas fa-utensils' },
            { id: 'desserts', name: 'Tatlılar', icon: 'fas fa-cookie' },
            { id: 'drinks', name: 'İçecekler', icon: 'fas fa-glass-cheers' },
            { id: 'popular', name: 'Popüler', icon: 'fas fa-fire' },
            { id: 'favorites', name: 'Favorilerim', icon: 'fas fa-heart' }
        ];
        
        // Modal oluştur
        categoriesModal = document.createElement('div');
        categoriesModal.className = 'modal';
        categoriesModal.id = 'categoriesModal';
        categoriesModal.style.display = 'flex';
        
        // Modal içeriği oluştur
        let categoriesHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-th-large"></i> Kategoriler</h3>
                    <button class="close-modal" id="closeCategoriesBtn"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="categories-grid">
        `;
        
        // Kategorileri ekle
        categories.forEach(category => {
            categoriesHTML += `
                <div class="category-item" data-category="${category.id}">
                    <div class="category-icon"><i class="${category.icon}"></i></div>
                    <div class="category-name">${category.name}</div>
                </div>
            `;
        });
        
        // Modal içeriğini tamamla
        categoriesHTML += `
                    </div>
                </div>
            </div>
        `;
        
        // Modal içeriğini ekle
        categoriesModal.innerHTML = categoriesHTML;
        
        // Modal'ı body'e ekle
        document.body.appendChild(categoriesModal);
        
        // Kapatma butonu olayını ekle
        document.getElementById('closeCategoriesBtn').addEventListener('click', () => {
            categoriesModal.style.display = 'none';
        });
        
        // Modal dışına tıklama ile kapatma
        categoriesModal.addEventListener('click', (e) => {
            if (e.target === categoriesModal) {
                categoriesModal.style.display = 'none';
            }
        });
        
        // Kategori öğelerine tıklama olayları ekle
        document.querySelectorAll('.category-item').forEach(item => {
            item.addEventListener('click', () => {
                const categoryId = item.getAttribute('data-category');
                const menuTab = document.querySelector(`.menu-tab[data-target="${categoryId}"]`);
                
                if (menuTab) {
                    menuTab.click();
                    categoriesModal.style.display = 'none';
                }
            });
        });
        
        // Kategoriler için stil ekle
        const style = document.createElement('style');
        style.textContent = `
            .categories-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
                padding: 10px;
            }
            
            .category-item {
                background-color: #f5f5f7;
                border-radius: 12px;
                padding: 20px;
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .category-item:hover {
                background-color: var(--primary-light);
                color: white;
                transform: translateY(-5px);
            }
            
            .category-icon {
                font-size: 2rem;
                margin-bottom: 10px;
            }
            
            .category-name {
                font-weight: 600;
            }
            
            @media (min-width: 768px) {
                .categories-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Favoriler Modalını Göster
    function showFavoritesModal() {
        // Favorileri al
        const favorites = JSON.parse(localStorage.getItem('arMenuFavorites')) || [];
        
        // Modal oluştur
        const favoritesModal = document.createElement('div');
        favoritesModal.className = 'modal';
        favoritesModal.style.display = 'flex';
        
        // Modal içeriği
        let favoritesHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-heart"></i> Favorilerim</h3>
                    <button class="close-modal" id="closeFavoritesBtn"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
        `;
        
        // Favoriler boşsa mesaj göster
        if (favorites.length === 0) {
            favoritesHTML += `
                <div class="no-favorites">
                    <div class="no-favorites-emoji">💔</div>
                    <h3 class="no-favorites-title">Henüz favoriniz yok</h3>
                    <p class="no-favorites-message">Favori ürünlerinizi eklemek için menü öğelerindeki kalp ikonuna tıklayın.</p>
                </div>
            `;
        } else {
            favoritesHTML += `<div class="favorites-list">`;
            
            // Favoriler listesini oluştur (burada daha sonra doldurulacak)
            favoritesHTML += `
                <p class="favorites-placeholder">Favorileriniz burada listelenecek...</p>
            `;
            
            favoritesHTML += `</div>`;
        }
        
        // Modal içeriğini tamamla
        favoritesHTML += `
                </div>
            </div>
        `;
        
        // Modal içeriğini ekle
        favoritesModal.innerHTML = favoritesHTML;
        
        // Modal'ı body'e ekle
        document.body.appendChild(favoritesModal);
        
        // Kapatma butonu olayını ekle
        document.getElementById('closeFavoritesBtn').addEventListener('click', () => {
            document.body.removeChild(favoritesModal);
        });
        
        // Modal dışına tıklama ile kapatma
        favoritesModal.addEventListener('click', (e) => {
            if (e.target === favoritesModal) {
                document.body.removeChild(favoritesModal);
            }
        });
    }
    
    // AR Tarayıcı Modunu Göster
    function showARBrowserModal() {
        // Modal oluştur
        const arBrowserModal = document.createElement('div');
        arBrowserModal.className = 'modal';
        arBrowserModal.style.display = 'flex';
        
        // Modal içeriği
        arBrowserModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-camera"></i> AR Görünümü</h3>
                    <button class="close-modal" id="closeARBrowserBtn"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="ar-browser-content">
                        <p class="ar-browser-info">
                            AR Kamera modu ile menüdeki öğeleri gerçek ortamınızda görüntüleyebilirsiniz. 
                            Hangi yemeği AR'da görmek istersiniz?
                        </p>
                        
                        <div class="ar-browser-items">
                            <div class="ar-browser-placeholder">
                                <div class="ar-browser-placeholder-icon"><i class="fas fa-cube"></i></div>
                                <p>Popüler modeller yükleniyor...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Modal'ı body'e ekle
        document.body.appendChild(arBrowserModal);
        
        // Kapatma butonu olayını ekle
        document.getElementById('closeARBrowserBtn').addEventListener('click', () => {
            document.body.removeChild(arBrowserModal);
        });
        
        // Modal dışına tıklama ile kapatma
        arBrowserModal.addEventListener('click', (e) => {
            if (e.target === arBrowserModal) {
                document.body.removeChild(arBrowserModal);
            }
        });
        
        // Önceden hazırlanmış modelleri yükle
        setTimeout(() => {
            // Örnek: Demo modeller
            const demoModels = [
                { name: 'Köfte', id: 'kofte', image: 'https://placehold.co/100x100?text=K%C3%B6fte' },
                { name: 'Baklava', id: 'baklava', image: 'https://placehold.co/100x100?text=Baklava' },
                { name: 'Ayran', id: 'ayran', image: 'https://placehold.co/100x100?text=Ayran' }
            ];
            
            // Yükleme animasyonunu gizle
            const placeholder = arBrowserModal.querySelector('.ar-browser-placeholder');
            if (placeholder) placeholder.style.display = 'none';
            
            // Modelleri ekle
            const modelsContainer = arBrowserModal.querySelector('.ar-browser-items');
            
            demoModels.forEach(model => {
                const modelElement = document.createElement('div');
                modelElement.className = 'ar-browser-item';
                modelElement.innerHTML = `
                    <img src="${model.image}" alt="${model.name}" class="ar-browser-item-img">
                    <div class="ar-browser-item-name">${model.name}</div>
                `;
                
                modelElement.addEventListener('click', () => {
                    // AR modülü kullanarak direkt modeli yükle
                    if (window.ARModule) {
                        ARModule.loadModel(model.id);
                        document.body.removeChild(arBrowserModal);
                    } else {
                        showNotification('AR modülü yüklenemedi', 'error');
                    }
                });
                
                modelsContainer.appendChild(modelElement);
            });
        }, 1000);
        
        // AR Browser için stil ekle
        const style = document.createElement('style');
        style.textContent = `
            .ar-browser-content {
                padding: 15px 10px;
            }
            
            .ar-browser-info {
                text-align: center;
                color: var(--text-medium);
                margin-bottom: 20px;
            }
            
            .ar-browser-items {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            
            .ar-browser-item {
                background-color: #f5f5f7;
                border-radius: 12px;
                overflow: hidden;
                text-align: center;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
            }
            
            .ar-browser-item:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(106, 90, 224, 0.2);
            }
            
            .ar-browser-item-img {
                width: 100%;
                height: 100px;
                object-fit: cover;
            }
            
            .ar-browser-item-name {
                padding: 10px;
                font-weight: 600;
            }
            
            .ar-browser-placeholder {
                grid-column: span 2;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 30px;
                color: var(--text-medium);
                text-align: center;
            }
            
            .ar-browser-placeholder-icon {
                font-size: 3rem;
                margin-bottom: 15px;
                animation: pulse 1.5s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 0.7; }
            }
            
            @media (min-width: 768px) {
                .ar-browser-items {
                    grid-template-columns: repeat(3, 1fr);
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Profil/Hesap Modalını Göster
    function showProfileModal() {
        // Kullanıcı verilerini al (veya varsayılan değerleri kullan)
        const user = JSON.parse(localStorage.getItem('arMenuUser')) || {
            name: 'Misafir Kullanıcı',
            email: '',
            visits: 1
        };
        
        // Ziyaret sayısını artır
        user.visits = (user.visits || 0) + 1;
        localStorage.setItem('arMenuUser', JSON.stringify(user));
        
        // Modal oluştur
        const profileModal = document.createElement('div');
        profileModal.className = 'modal';
        profileModal.style.display = 'flex';
        
        // Modal içeriği
        profileModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-user"></i> Hesabım</h3>
                    <button class="close-modal" id="closeProfileBtn"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="profile-container">
                        <div class="profile-avatar">
                            <div class="profile-avatar-inner">${user.name.charAt(0)}</div>
                        </div>
                        
                        <h4 class="profile-name">${user.name}</h4>
                        <p class="profile-info">Ziyaret sayısı: ${user.visits}</p>
                        
                        <div class="profile-buttons">
                            <button class="profile-btn primary" id="loginBtn">
                                <i class="fas fa-sign-in-alt"></i> Giriş Yap
                            </button>
                            <button class="profile-btn secondary" id="settingsBtn">
                                <i class="fas fa-cog"></i> Ayarlar
                            </button>
                        </div>
                        
                        <div class="profile-options">
                            <a href="#" class="profile-option" id="reservationBtn">
                                <i class="fas fa-calendar-check"></i> Masa Rezervasyon
                            </a>
                            <a href="#" class="profile-option" id="orderHistoryBtn">
                                <i class="fas fa-history"></i> Sipariş Geçmişi
                            </a>
                            <a href="#" class="profile-option" id="contactBtn">
                                <i class="fas fa-phone"></i> İletişim
                            </a>
                        </div>
                        
                        <div class="profile-footer">
                            <p>v1.0.0 - AR Menü</p>
                            <button class="text-btn" id="clearDataBtn">Verileri Temizle</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Modal'ı body'e ekle
        document.body.appendChild(profileModal);
        
        // Kapatma butonu olayını ekle
        document.getElementById('closeProfileBtn').addEventListener('click', () => {
            document.body.removeChild(profileModal);
        });
        
        // Modal dışına tıklama ile kapatma
        profileModal.addEventListener('click', (e) => {
            if (e.target === profileModal) {
                document.body.removeChild(profileModal);
            }
        });
        
        // Butonlara olay ekle
        if (document.getElementById('clearDataBtn')) {
            document.getElementById('clearDataBtn').addEventListener('click', () => {
                const confirmClear = window.confirm('Tüm AR Menü verileri silinecek. Emin misiniz?');
                if (confirmClear) {
                    localStorage.removeItem('arMenuUser');
                    localStorage.removeItem('arMenuFavorites');
                    localStorage.removeItem('ar_tutorial_shown');
                    showNotification('Veriler temizlendi!', 'success');
                    document.body.removeChild(profileModal);
                }
            });
        }
        
        // Profil için stil ekle
        const style = document.createElement('style');
        style.textContent = `
            .profile-container {
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .profile-avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background-color: var(--primary);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 15px;
            }
            
            .profile-avatar-inner {
                width: 72px;
                height: 72px;
                border-radius: 50%;
                background-color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
                font-weight: bold;
                color: var(--primary);
            }
            
            .profile-name {
                font-size: 1.2rem;
                margin-bottom: 5px;
                color: var(--text-dark);
            }
            
            .profile-info {
                color: var(--text-medium);
                margin-bottom: 20px;
                font-size: 0.9rem;
            }
            
            .profile-buttons {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                width: 100%;
            }
            
            .profile-btn {
                flex: 1;
                padding: 10px;
                border-radius: 8px;
                border: none;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.3s ease;
            }
            
            .profile-btn.primary {
                background-color: var(--primary);
                color: white;
            }
            
            .profile-btn.secondary {
                background-color: #f5f5f7;
                color: var(--text-medium);
            }
            
            .profile-btn:hover {
                opacity: 0.9;
                transform: translateY(-2px);
            }
            
            .profile-options {
                width: 100%;
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .profile-option {
                padding: 12px 15px;
                border-radius: 8px;
                background-color: #f5f5f7;
                color: var(--text-dark);
                text-decoration: none;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.3s ease;
            }
            
            .profile-option:hover {
                background-color: #e9e9ef;
            }
            
            .profile-footer {
                margin-top: auto;
                width: 100%;
                padding-top: 20px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: var(--text-light);
                font-size: 0.8rem;
            }
            
            .text-btn {
                background: none;
                border: none;
                color: var(--text-medium);
                cursor: pointer;
                font-size: 0.8rem;
                padding: 5px;
            }
            
            .text-btn:hover {
                color: var(--danger);
                text-decoration: underline;
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // QR Kod Tarayıcı Modalını Göster - YENİ EKLENDİ
    function showQRScannerModal() {
        // Modal oluştur
        const qrScannerModal = document.createElement('div');
        qrScannerModal.className = 'modal';
        qrScannerModal.style.display = 'flex';
        
        // Modal içeriği
        qrScannerModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-qrcode"></i> QR Kod Tarayıcı</h3>
                    <button class="close-modal" id="closeQRScannerBtn"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <div class="qr-scanner-container">
                        <div class="qr-scanner-info">
                            <p>QR kodu taratmak için kameranızı QR kodun üzerine doğrultun.</p>
                            <div class="qr-scanner-placeholder">
                                <div class="qr-scanner-icon">
                                    <i class="fas fa-qrcode"></i>
                                </div>
                                <div class="qr-scanner-loading">
                                    <span class="qr-scanner-message">Kamera erişimi bekleniyor...</span>
                                </div>
                            </div>
                            <div class="qr-scanner-options">
                                <button class="qr-scanner-btn primary" id="startQRScanBtn">
                                    <i class="fas fa-camera"></i> Taramaya Başla
                                </button>
                                <button class="qr-scanner-btn secondary" id="uploadQRCodeBtn">
                                    <i class="fas fa-upload"></i> QR Kod Yükle
                                </button>
                            </div>
                        </div>
                        <div id="qr-video-container" class="qr-video-container" style="display:none;">
                            <video id="qr-video" playsinline></video>
                            <div class="qr-overlay">
                                <div class="qr-target"></div>
                            </div>
                            <button class="qr-scanner-control-btn" id="switchCameraBtn">
                                <i class="fas fa-sync"></i>
                            </button>
                            <button class="qr-scanner-control-btn" id="toggleFlashlightBtn">
                                <i class="fas fa-bolt"></i>
                            </button>
                        </div>
                        <div id="qr-result" class="qr-result" style="display:none;">
                            <div class="qr-result-icon"><i class="fas fa-check-circle"></i></div>
                            <div class="qr-result-title">QR Kod Okundu!</div>
                            <div class="qr-result-content" id="qr-result-text">İçerik burada gösterilecek</div>
                            <div class="qr-result-actions">
                                <button class="qr-result-btn primary" id="qr-result-action-btn">
                                    İşlem Yap
                                </button>
                                <button class="qr-result-btn secondary" id="scan-again-btn">
                                    Tekrar Tara
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Modal'ı body'e ekle
        document.body.appendChild(qrScannerModal);
        
        // Kapatma butonu olayını ekle
        document.getElementById('closeQRScannerBtn').addEventListener('click', () => {
            // Kamera açıksa kapat
            stopQRScanner();
            document.body.removeChild(qrScannerModal);
        });
        
        // Modal dışına tıklama ile kapatma
        qrScannerModal.addEventListener('click', (e) => {
            if (e.target === qrScannerModal) {
                // Kamera açıksa kapat
                stopQRScanner();
                document.body.removeChild(qrScannerModal);
            }
        });
        
        // Tarama başlatma düğmesi
        document.getElementById('startQRScanBtn').addEventListener('click', () => {
            startQRScanner();
        });
        
        // QR Kod yükleme düğmesi
        document.getElementById('uploadQRCodeBtn').addEventListener('click', () => {
            // Dosya seçici oluştur
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            
            // Dosya seçildiğinde
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    // Gösterge metni değiştir
                    document.querySelector('.qr-scanner-message').textContent = 'QR kod resmi işleniyor...';
                    
                    // Burada QR kod okuma işlemi yapılabilir
                    // Şimdilik sadece simülasyon yapıyoruz
                    setTimeout(() => {
                        showQRResult('https://www.arrestorant.com/menu/pasta-1234');
                    }, 1500);
                }
            });
            
            // Dosya seçiciyi aç
            document.body.appendChild(fileInput);
            fileInput.click();
            document.body.removeChild(fileInput);
        });
        
        // QR Kodu taramayı başlat
        function startQRScanner() {
            // Kamera erişimi için sorgu
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                // Bilgi ve kontroller güncelleme
                document.querySelector('.qr-scanner-info').style.display = 'none';
                document.getElementById('qr-video-container').style.display = 'block';
                
                navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                    .then(function(stream) {
                        const video = document.getElementById('qr-video');
                        video.srcObject = stream;
                        video.setAttribute('playsinline', true);
                        video.play();
                        
                        // QR kod okuma simülasyonu (gerçek uygulamada bir QR kod kütüphanesi kullanılır)
                        setTimeout(() => {
                            showQRResult('https://www.arrestorant.com/menu/burger-2345');
                            
                            // Kamera akışını durdur
                            const tracks = stream.getTracks();
                            tracks.forEach(track => track.stop());
                        }, 3000);
                    })
                    .catch(function(err) {
                        console.error('Kamera erişiminde hata:', err);
                        document.querySelector('.qr-scanner-message').textContent = 'Kamera erişimi sağlanamadı! ' + err.message;
                    });
            } else {
                document.querySelector('.qr-scanner-message').textContent = 'Tarayıcınız kamera erişimini desteklemiyor!';
            }
        }
        
        // QR Kod tarayıcıyı durdur
        function stopQRScanner() {
            const video = document.getElementById('qr-video');
            if (video && video.srcObject) {
                const tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        }
        
        // QR Kod sonucunu göster
        function showQRResult(content) {
            document.getElementById('qr-video-container').style.display = 'none';
            document.getElementById('qr-result').style.display = 'block';
            document.getElementById('qr-result-text').textContent = content;
            
            // Sonuç URL'ini analiz et ve işlem düğmesini güncelle
            const actionBtn = document.getElementById('qr-result-action-btn');
            if (content.includes('/menu/')) {
                // Menü öğesi
                const itemId = content.split('/menu/')[1];
                actionBtn.textContent = 'Menü Öğesini Göster';
                actionBtn.addEventListener('click', () => {
                    document.body.removeChild(qrScannerModal);
                    showNotification(`"${itemId}" menü öğesine yönlendiriliyorsunuz...`, 'info');
                    
                    // Menü öğesine git (simülasyon)
                    setTimeout(() => {
                        const menuSection = document.querySelector('.menu-section');
                        if (menuSection) {
                            menuSection.scrollIntoView({ behavior: 'smooth' });
                        }
                    }, 1000);
                });
            } else if (content.includes('/coupon/')) {
                // Kupon kodu
                actionBtn.textContent = 'Kuponu Kullan';
                actionBtn.addEventListener('click', () => {
                    document.body.removeChild(qrScannerModal);
                    showNotification('Kupon başarıyla hesabınıza eklendi!', 'success');
                });
            } else {
                // Genel bağlantı
                actionBtn.textContent = 'Bağlantıya Git';
                actionBtn.addEventListener('click', () => {
                    window.open(content, '_blank');
                });
            }
            
            // Tekrar tarama düğmesi
            document.getElementById('scan-again-btn').addEventListener('click', () => {
                document.getElementById('qr-result').style.display = 'none';
                startQRScanner();
            });
        }
        
        // QR Scanner için stil ekle
        const style = document.createElement('style');
        style.textContent = `
            .qr-scanner-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 10px;
            }
            
            .qr-scanner-info {
                text-align: center;
                margin-bottom: 20px;
                width: 100%;
            }
            
            .qr-scanner-placeholder {
                background-color: #f5f5f7;
                border-radius: 10px;
                padding: 30px;
                margin: 20px 0;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .qr-scanner-icon {
                font-size: 4rem;
                color: var(--primary);
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }
            
            .qr-scanner-loading {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .qr-scanner-message {
                color: var(--text-medium);
                margin-top: 10px;
            }
            
            .qr-scanner-options {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
                width: 100%;
            }
            
            .qr-scanner-btn {
                padding: 12px 20px;
                border-radius: 8px;
                border: none;
                font-weight: 600;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                flex: 1;
            }
            
            .qr-scanner-btn.primary {
                background-color: var(--primary);
                color: white;
            }
            
            .qr-scanner-btn.secondary {
                background-color: #f5f5f7;
                color: var(--text-dark);
            }
            
            .qr-video-container {
                position: relative;
                width: 100%;
                max-width: 100%;
                height: 300px;
                overflow: hidden;
                border-radius: 10px;
                background-color: black;
            }
            
            #qr-video {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .qr-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(0, 0, 0, 0.2);
            }
            
            .qr-target {
                width: 200px;
                height: 200px;
                border: 2px solid rgba(255, 255, 255, 0.8);
                border-radius: 10px;
                position: relative;
            }
            
            .qr-target::before,
            .qr-target::after {
                content: '';
                position: absolute;
                width: 30px;
                height: 30px;
                border-color: var(--primary);
                border-style: solid;
            }
            
            .qr-target::before {
                top: -2px;
                left: -2px;
                border-width: 4px 0 0 4px;
                border-radius: 8px 0 0 0;
            }
            
            .qr-target::after {
                bottom: -2px;
                right: -2px;
                border-width: 0 4px 4px 0;
                border-radius: 0 0 8px 0;
            }
            
            .qr-scanner-control-btn {
                position: absolute;
                bottom: 15px;
                background-color: rgba(255, 255, 255, 0.7);
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10;
            }
            
            #switchCameraBtn {
                left: 15px;
            }
            
            #toggleFlashlightBtn {
                right: 15px;
            }
            
            .qr-result {
                text-align: center;
                padding: 20px;
                width: 100%;
            }
            
            .qr-result-icon {
                font-size: 3rem;
                color: var(--success);
                margin-bottom: 15px;
            }
            
            .qr-result-title {
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 10px;
            }
            
            .qr-result-content {
                background-color: #f5f5f7;
                padding: 15px;
                border-radius: 8px;
                word-break: break-all;
                margin-bottom: 20px;
                font-family: monospace;
                color: var(--text-dark);
            }
            
            .qr-result-actions {
                display: flex;
                gap: 10px;
            }
            
            .qr-result-btn {
                flex: 1;
                padding: 12px;
                border-radius: 8px;
                border: none;
                font-weight: 600;
                cursor: pointer;
            }
            
            .qr-result-btn.primary {
                background-color: var(--primary);
                color: white;
            }
            
            .qr-result-btn.secondary {
                background-color: #f5f5f7;
                color: var(--text-dark);
            }
            
            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.7; }
                50% { transform: scale(1.1); opacity: 1; }
                100% { transform: scale(1); opacity: 0.7; }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    // Bildirim gösterme yardımcı fonksiyonu
    function showNotification(message, type = 'info', duration = 3000) {
        if (window.PopupManager && window.PopupManager.showStatusMessage) {
            window.PopupManager.showStatusMessage(message, duration);
        } else {
            const notification = document.createElement('div');
            notification.className = 'bottom-nav-notification ' + type;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, duration);
        }
    }
    
    // İlk ziyaret kontrolü ve ziyaret sayısı artırımı
    (function checkVisitCount() {
        const user = JSON.parse(localStorage.getItem('arMenuUser')) || {
            name: 'Misafir Kullanıcı',
            visits: 0
        };
        
        user.visits = (user.visits || 0) + 1;
        localStorage.setItem('arMenuUser', JSON.stringify(user));
        
        // İlk ziyarette tutorial göster
        if (user.visits === 1) {
            setTimeout(() => {
                const instructionsModal = document.getElementById('instructionsModal');
                if (instructionsModal) {
                    instructionsModal.style.display = 'flex';
                }
            }, 1000);
        }
    })();
    
    // Notification için stil ekle
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .bottom-nav-notification {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            z-index: 1000;
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .bottom-nav-notification.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        
        .bottom-nav-notification.info {
            background-color: rgba(0, 0, 0, 0.8);
        }
        
        .bottom-nav-notification.success {
            background-color: var(--success);
        }
        
        .bottom-nav-notification.warning {
            background-color: var(--warning);
        }
        
        .bottom-nav-notification.error {
            background-color: var(--danger);
        }
    `;
    
    document.head.appendChild(notificationStyle);
});
