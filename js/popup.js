/**
 * Popup Manager - AR Menü uygulaması için tüm popup'ları ve yüklenme ekranını yönetir
 * - Yükleme ekranı takılı kalma sorunu düzeltildi
 * - Yeni, daha estetik spinner desteği eklendi
 */

// Singleton tasarım desenine uygun popup yöneticisi
const PopupManager = {
    // Farklı popup türlerinin referansları
    popups: {
        loadingScreen: null,
        statusMessage: null,
        instructionsModal: null,
        arTroubleshoot: null
    },
    
    // İnitialize edildi mi?
    isInitialized: false,

    // Popupların ilk oluşturulması - sayfa yüklenirken otomatik başlat
    init() {
        console.log("PopupManager başlatılıyor...");
        
        // DOM yüklendiğinde popup elementlerini al
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this._initialize());
        } else {
            // DOM zaten yüklenmişse hemen başlat
            this._initialize();
        }
        
        return this; // Metot zincirlemesi için
    },
    
    // Gerçek başlatma işlemi
    _initialize() {
        if (this.isInitialized) return;
        
        console.log("PopupManager: Initialize ediliyor...");
        
        // Popup elementlerini al
        this.popups.loadingScreen = document.getElementById('loadingScreen');
        this.popups.statusMessage = document.getElementById('statusMessage');
        this.popups.instructionsModal = document.getElementById('instructionsModal');
        this.popups.arTroubleshoot = document.getElementById('arTroubleshootStatus');
        
        // Yükleme ekranı bulunamadıysa yarat
        if (!this.popups.loadingScreen) {
            console.log("PopupManager: Yükleme ekranı bulunamadı, oluşturuluyor...");
            this.popups.loadingScreen = this._createLoadingScreen();
        }
        
        console.log('PopupManager: Başarıyla başlatıldı');
        
        // Popupların event listener'larını ayarla
        this._setupEventListeners();
        
        // Başlangıçta loading ekranının aktif olduğundan emin olalım
        this.popups.loadingScreen.style.display = 'flex';
        
        this.isInitialized = true;
    },
    
    // Olay dinleyicileri kurulumu
    _setupEventListeners() {
        // Instructions modal için kapatma butonları
        const closeModalBtn = document.getElementById('closeModalBtn');
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                this.hideInstructionsModal();
            });
        }
        
        // Instructions modalını dışarı tıklayarak kapatma
        if (this.popups.instructionsModal) {
            this.popups.instructionsModal.addEventListener('click', (e) => {
                if (e.target === this.popups.instructionsModal) {
                    this.hideInstructionsModal();
                }
            });
        }
        
        // Nasıl kullanılır butonuna tıklama
        const showInstructionsBtn = document.getElementById('showInstructionsBtn');
        if (showInstructionsBtn) {
            showInstructionsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showInstructionsModal();
            });
        }
        
        // AR Troubleshoot kapatma butonu
        const closeARStatusBtn = document.getElementById('closeARStatusButton');
        if (closeARStatusBtn) {
            closeARStatusBtn.addEventListener('click', () => {
                this.hideARTroubleshoot();
            });
        }
        
        // AR Yeniden deneme butonu
        const retryARBtn = document.getElementById('retryARButton');
        if (retryARBtn) {
            retryARBtn.addEventListener('click', () => {
                this.hideARTroubleshoot();
                // AR'ı yeniden başlatma fonksiyonu (Global olarak tanımlanmış olmalı)
                if (typeof checkARSupport === 'function') {
                    checkARSupport();
                }
            });
        }
    },
    
    // LOADING SCREEN YÖNETİMİ
    
    // Yükleme ekranını göster
    showLoading(message = "Yükleniyor...") {
        if (!this.popups.loadingScreen) {
            this.popups.loadingScreen = document.getElementById('loadingScreen');
            if (!this.popups.loadingScreen) {
                this._createLoadingScreen();
            }
        }
        
        const textElement = this.popups.loadingScreen.querySelector('.loading-text');
        if (textElement) {
            textElement.textContent = message;
        }
        
        // Görünür yap ve animasyon ekle
        this.popups.loadingScreen.style.display = 'flex';
        this.popups.loadingScreen.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log("Yükleme ekranı gösteriliyor:", message);
    },
    
    // Yükleme ekranını gizle - tamamen yeniden düzenlenmiş, hata korumalı
    hideLoading() {
        console.log("PopupManager: Yükleme ekranını kapatma işlemi başlatıldı");
        
        // Ekranı bul
        if (!this.popups.loadingScreen) {
            this.popups.loadingScreen = document.getElementById('loadingScreen');
            if (!this.popups.loadingScreen) {
                console.warn("PopupManager: loadingScreen elementi bulunamadı!");
                return;
            }
        }
        
        try {
            // Animasyonlu olarak gizle
            this.popups.loadingScreen.style.opacity = '0';
            
            // 500ms sonra display:none yap
            setTimeout(() => {
                this.popups.loadingScreen.style.display = 'none';
                document.body.style.overflow = '';
                console.log("PopupManager: Yükleme ekranı kapatıldı");
                
                // Anlatıcıyı gösterme fonksiyonu varsa tetikle
                this._showTutorialAfterLoading();
                
                // Yükleme kapandı eventi tetikle
                document.dispatchEvent(new CustomEvent('loadingScreenClosed'));
            }, 500);
            
            // Durum bilgisini döndür
            return true;
        } catch (e) {
            console.error("PopupManager: Yükleme ekranını kapatırken bir hata oluştu", e);
            
            // Yine de ekranı kapatmaya çalış - son çare
            try {
                const loadingScreen = document.getElementById('loadingScreen');
                if (loadingScreen) loadingScreen.style.display = 'none';
            } catch (innerError) {
                console.error("PopupManager: Yükleme ekranı kapatılamadı!", innerError);
            }
            
            return false;
        }
    },
    
    // Anlatıcıyı göster - yeni yardımcı metod
    _showTutorialAfterLoading() {
        try {
            // 10ms bekle ve sonra anlatıcıyı göster
            setTimeout(() => {
                // Global fonksiyonu kullan
                if (window._showTutorialAfterLoadingScreen && 
                    typeof window._showTutorialAfterLoadingScreen === 'function') {
                    console.log("PopupManager: Anlatıcı gösterme fonksiyonu çağrılıyor");
                    window._showTutorialAfterLoadingScreen();
                }
                // Veya direkt tutorial açma fonksiyonunu kullan
                else if (window.openTutorialModal) {
                    console.log("PopupManager: window.openTutorialModal çağrılıyor");
                    window.openTutorialModal();
                }
            }, 10);
        } catch (e) {
            console.error("PopupManager: Anlatıcı gösterilirken hata!", e);
        }
    },
    
    // Yükleme hatası göster
    showLoadingError(message) {
        if (!this.popups.loadingScreen) {
            this.popups.loadingScreen = document.getElementById('loadingScreen');
            if (!this.popups.loadingScreen) {
                this._createLoadingScreen();
            }
        }
        
        // Spinner'ı durdur
        const spinner = this.popups.loadingScreen.querySelector('.spinner');
        if (spinner) spinner.style.display = 'none';
        
        // Emoji'yi değiştir
        const emoji = this.popups.loadingScreen.querySelector('.loading-emoji');
        if (emoji) emoji.innerHTML = '⚠️';
        
        // Mesajı güncelle
        const text = this.popups.loadingScreen.querySelector('.loading-text');
        if (text) text.textContent = message;
        
        // Yeniden dene butonu ekle (eğer yoksa)
        if (!this.popups.loadingScreen.querySelector('.reload-btn')) {
            const reloadBtn = document.createElement('button');
            reloadBtn.className = 'reload-btn';
            reloadBtn.textContent = "Sayfayı Yenile";
            reloadBtn.style.padding = "10px 20px";
            reloadBtn.style.marginTop = "20px";
            reloadBtn.style.backgroundColor = "var(--primary)";
            reloadBtn.style.color = "white";
            reloadBtn.style.border = "none";
            reloadBtn.style.borderRadius = "8px";
            reloadBtn.style.cursor = "pointer";
            reloadBtn.onclick = () => window.location.reload();
            
            this.popups.loadingScreen.appendChild(reloadBtn);
        }
        
        // Yükleme ekranını göster
        this.popups.loadingScreen.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        console.error("Yükleme hatası gösteriliyor:", message);
    },
    
    // Yükleme ekranı yoksa oluştur
    _createLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.className = 'loading-screen';
        
        loadingScreen.innerHTML = `
            <div class="loading-emoji">🍽️</div>
            <div class="spinner"></div>
            <p class="loading-text">AR Menü Yükleniyor...</p>
        `;
        
        document.body.appendChild(loadingScreen);
        this.popups.loadingScreen = loadingScreen;
        
        // CSS animasyonu ekle
        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            .loading-screen {
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            }
            
            .loading-screen.active {
                opacity: 1;
            }
            
            .loading-screen.fade-out {
                opacity: 0;
            }
        `;
        document.head.appendChild(styleSheet);
        
        return loadingScreen;
    },
    
    // STATUS MESSAGE YÖNETİMİ
    
    // Durum mesajı göster
    showStatusMessage(message, duration = 3000) {
        if (!this.popups.statusMessage) {
            this.popups.statusMessage = document.getElementById('statusMessage');
            if (!this.popups.statusMessage) {
                this._createStatusMessage();
            }
        }
        
        // Mesaj türüne göre ikon ve stil belirle
        let icon = 'ℹ️';
        let className = 'info';
        
        if (message.toLowerCase().includes('hata') || message.toLowerCase().includes('bulunamadı')) {
            icon = '⚠️';
            className = 'warning';
        } else if (message.toLowerCase().includes('başlatıldı') || message.toLowerCase().includes('yerleştirildi')) {
            icon = '✅';
            className = 'success';
        } else if (message.toLowerCase().includes('izin')) {
            icon = '📷';
            className = 'info';
        }
        
        // Status message içeriğini güncelle
        this.popups.statusMessage.innerHTML = `
            <div class="alert alert-${className}">
                <div class="alert-emoji">${icon}</div>
                <div>${message}</div>
            </div>
        `;
        
        // Status message'ı göster
        this.popups.statusMessage.style.display = 'block';
        
        // Var olan zamanlayıcıyı temizle
        if (this._statusMessageTimer) {
            clearTimeout(this._statusMessageTimer);
        }
        
        // Belirtilen süre sonra mesajı gizle
        this._statusMessageTimer = setTimeout(() => {
            this.popups.statusMessage.style.display = 'none';
        }, duration);
        
        console.log(`Status message (${className}):`, message);
    },
    
    // Durum mesajı oluştur
    _createStatusMessage() {
        const statusMessage = document.createElement('div');
        statusMessage.id = 'statusMessage';
        statusMessage.className = 'status-message';
        statusMessage.style.display = 'none';
        
        document.body.appendChild(statusMessage);
        this.popups.statusMessage = statusMessage;
        
        return statusMessage;
    },
    
    // INSTRUCTIONS MODAL YÖNETİMİ
    
    // Kullanım talimatları modalını göster
    showInstructionsModal() {
        if (!this.popups.instructionsModal) {
            this.popups.instructionsModal = document.getElementById('instructionsModal');
            if (!this.popups.instructionsModal) return;
        }
        
        this.popups.instructionsModal.style.display = 'flex';
        
        // Tutorial açıldığını kaydet
        localStorage.setItem('ar_tutorial_shown', 'true');
    },
    
    // Kullanım talimatları modalını gizle
    hideInstructionsModal() {
        if (!this.popups.instructionsModal) {
            this.popups.instructionsModal = document.getElementById('instructionsModal');
            if (!this.popups.instructionsModal) return;
        }
        
        this.popups.instructionsModal.style.display = 'none';
    },
    
    // AR TROUBLESHOOT YÖNETİMİ
    
    // AR sorun giderme popup'ını göster
    showARTroubleshoot(message = "AR başlatılırken bir sorun oluştu") {
        if (!this.popups.arTroubleshoot) {
            this.popups.arTroubleshoot = document.getElementById('arTroubleshootStatus');
            if (!this.popups.arTroubleshoot) return;
        }
        
        const arStatusMessage = document.getElementById('arStatusMessage');
        if (arStatusMessage) {
            arStatusMessage.textContent = message;
        }
        
        this.popups.arTroubleshoot.style.display = 'flex';
    },
    
    // AR sorun giderme popup'ını gizle
    hideARTroubleshoot() {
        if (!this.popups.arTroubleshoot) {
            this.popups.arTroubleshoot = document.getElementById('arTroubleshootStatus');
            if (!this.popups.arTroubleshoot) return;
        }
        
        this.popups.arTroubleshoot.style.display = 'none';
    }
};

// PopupManager'ı başlat ve global scope'a ekle
window.PopupManager = PopupManager.init();

// Sayfa yükleme tamamlandığında yükleme ekranını kapatmak için zamanlayıcı ayarla
window.addEventListener('load', () => {
    console.log("PopupManager: Sayfa tamamen yüklendi");
    
    // Yükleme ekranını 1.5 saniye sonra kapat - hem PopupManager hem de init.js ile dene
    setTimeout(() => {
        console.log("PopupManager: Yükleme ekranını kapatma zamanlayıcısı tetiklendi");
        
        // PopupManager ile dene
        if (window.PopupManager && window.PopupManager.hideLoading) {
            window.PopupManager.hideLoading();
        } 
        // init.js ile dene
        else if (window._hideLoadingScreen) {
            window._hideLoadingScreen();
        }
        // En son çare - doğrudan DOM manipülasyonu
        else {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
                console.log("PopupManager: Doğrudan DOM manipülasyonu ile yükleme ekranı kapatıldı");
            }
        }
    }, 1500);
});

// 7 saniye güvenlik önlemini 10 saniyeye çıkaralım
// Eğer herhangi bir yöntemle yükleme ekranı kapanmazsa zorla kapat
setTimeout(() => {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        console.warn("PopupManager: GÜVENLİK ÖNLEMİ - 10 saniye geçti, yükleme ekranı zorla kapatılıyor");
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}, 10000);
