/**
 * QR Kod Tarayıcı Modülü
 * HTML5 QR kodunu kullanarak gerçek bir QR kodu tarayıcısı sağlar
 */

// QR Kod Tarayıcı modülü - IIFE kullanarak kapsüllendi
const QRScannerModule = (function() {
    // Özel değişkenler
    let qrScanner = null;
    let scannerModal = null;
    let currentStream = null;
    let onScanCallback = null;
    let statusCallback = null;
    
    // HTML5 QR Library CDN bağlantısını ekle
    function loadQRLibrary() {
        return new Promise((resolve, reject) => {
            // Eğer kütüphane zaten yüklüyse
            if (window.Html5Qrcode) {
                resolve();
                return;
            }
            
            // Kütüphane için script ekle
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js';
            script.onload = () => {
                console.log('QR kütüphanesi yüklendi');
                resolve();
            };
            script.onerror = (error) => {
                console.error('QR kütüphanesi yüklenemedi', error);
                reject(new Error('QR kütüphanesi yüklenemedi'));
            };
            document.body.appendChild(script);
        });
    }
    
    // QR Tarayıcı modalını oluştur ve göster
    function showQRScannerModal(options = {}) {
        // Varsayılan ayarları birleştir
        const settings = Object.assign({
            onScan: (result) => console.log('QR taranan sonuç:', result),
            onClose: () => {},
            onError: (error) => console.error('QR tarama hatası:', error),
            statusCallback: (message) => console.log(message)
        }, options);
        
        // Callback fonksiyonlarını kaydet
        onScanCallback = settings.onScan;
        statusCallback = settings.statusCallback;
        
        // Önce kütüphaneyi yükle
        loadQRLibrary()
            .then(() => {
                // Modal oluştur
                createScannerModal();
                
                // Modal göster
                setTimeout(() => {
                    scannerModal.style.opacity = '1';
                    // 0.5 saniye sonra taramayı başlat
                    setTimeout(initializeScanner, 500);
                }, 100);
            })
            .catch(error => {
                settings.statusCallback("QR tarayıcı kütüphanesi yüklenemedi: " + error.message);
                settings.onError(error);
            });
    }
    
    // Tarayıcı modalını oluştur
    function createScannerModal() {
        // Eğer zaten varsa kaldır
        if (scannerModal) {
            document.body.removeChild(scannerModal);
        }
        
        // Yeni modal oluştur
        scannerModal = document.createElement('div');
        scannerModal.className = 'qr-scanner-modal';
        scannerModal.style.opacity = '0';
        scannerModal.style.transition = 'opacity 0.3s ease';
        
        // Modal içeriği
        scannerModal.innerHTML = `
            <div class="qr-scanner-content">
                <div class="qr-scanner-header">
                    <h2 class="qr-scanner-title">
                        <i class="fas fa-qrcode"></i> QR Kod Tarayıcı
                    </h2>
                    <button class="qr-scanner-close-btn" id="qr-scanner-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="qr-scanner-body">
                    <div class="qr-loading-indicator">
                        <div class="qr-spinner"></div>
                        <p>Kamera erişimi isteniyor...</p>
                    </div>
                    
                    <div id="qr-reader" class="qr-reader-container" style="display: none;"></div>
                    <div id="qr-reader-error" class="qr-reader-error" style="display: none;"></div>
                    
                    <div class="qr-result-container" id="qr-result" style="display: none;">
                        <div class="qr-result-icon"><i class="fas fa-check-circle"></i></div>
                        <h3 class="qr-result-title">QR Kod Okundu!</h3>
                        <div class="qr-result-data" id="qr-result-data"></div>
                        <div class="qr-result-buttons">
                            <button class="qr-result-btn primary" id="qr-result-action">İşlem Yap</button>
                            <button class="qr-result-btn secondary" id="qr-scan-again">Tekrar Tara</button>
                        </div>
                    </div>
                </div>
                
                <div class="qr-scanner-footer">
                    <div class="qr-scanner-info">Kameranızı QR koduna doğrultun</div>
                    <div class="qr-scanner-controls">
                        <button id="qr-toggle-flash" class="qr-control-btn" style="display: none;">
                            <i class="fas fa-bolt"></i> Flaş
                        </button>
                        <button id="qr-switch-camera" class="qr-control-btn" style="display: none;">
                            <i class="fas fa-sync"></i> Kamera Değiştir
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Modaldaki CSS
        const style = document.createElement('style');
        style.textContent = `
            .qr-scanner-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.85);
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
            }
            
            .qr-scanner-content {
                width: 100%;
                max-width: 500px;
                background-color: #fff;
                border-radius: 20px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                margin: 20px;
            }
            
            .qr-scanner-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background-color: var(--primary, #6A5AE0);
                color: white;
            }
            
            .qr-scanner-title {
                margin: 0;
                font-size: 1.2rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .qr-scanner-close-btn {
                background: none;
                border: none;
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 1.2rem;
            }
            
            .qr-scanner-body {
                position: relative;
                padding: 0;
                height: 350px;
                overflow: hidden;
            }
            
            .qr-loading-indicator {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255,255,255,0.95);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 2;
            }
            
            .qr-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(0, 0, 0, 0.1);
                border-left-color: var(--primary, #6A5AE0);
                border-radius: 50%;
                animation: qr-spin 1s linear infinite;
                margin-bottom: 15px;
            }
            
            @keyframes qr-spin {
                to { transform: rotate(360deg); }
            }
            
            .qr-reader-container {
                width: 100%;
                height: 100%;
            }
            
            .qr-reader-error {
                padding: 20px;
                text-align: center;
                color: #e74c3c;
            }
            
            .qr-result-container {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                text-align: center;
                z-index: 3;
            }
            
            .qr-result-icon {
                font-size: 48px;
                color: var(--success, #4CD964);
                margin-bottom: 15px;
            }
            
            .qr-result-title {
                margin-bottom: 15px;
                font-size: 1.4rem;
                color: var(--text-dark, #2D2F48);
            }
            
            .qr-result-data {
                background-color: #f5f5f7;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                width: 100%;
                max-width: 300px;
                word-break: break-all;
                font-family: monospace;
                font-size: 0.9rem;
                color: var(--text-dark, #2D2F48);
                text-align: left;
            }
            
            .qr-result-buttons {
                display: flex;
                gap: 10px;
            }
            
            .qr-result-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .qr-result-btn.primary {
                background-color: var(--primary, #6A5AE0);
                color: white;
            }
            
            .qr-result-btn.secondary {
                background-color: #f1f1f5;
                color: var(--text-dark, #2D2F48);
            }
            
            .qr-result-btn:hover {
                transform: translateY(-2px);
            }
            
            .qr-scanner-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                background-color: #f8f8fc;
                border-top: 1px solid rgba(0,0,0,0.05);
            }
            
            .qr-scanner-info {
                color: var(--text-medium, #5B5D72);
                font-size: 0.9rem;
            }
            
            .qr-scanner-controls {
                display: flex;
                gap: 10px;
            }
            
            .qr-control-btn {
                background-color: var(--primary, #6A5AE0);
                color: white;
                border: none;
                border-radius: 6px;
                padding: 8px 12px;
                font-size: 0.85rem;
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .qr-control-btn:hover {
                background-color: var(--primary-dark, #594DC2);
            }
            
            @media (max-width: 480px) {
                .qr-scanner-content {
                    margin: 0;
                    height: 100%;
                    max-width: 100%;
                    border-radius: 0;
                }
                
                .qr-scanner-body {
                    height: calc(100vh - 128px);
                }
                
                .qr-reader-container {
                    height: 100%;
                }
            }
            
            /* QR kod tarayıcı stil düzeltmeleri */
            #qr-reader {
                border: none !important;
                padding: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }
            
            #qr-reader video {
                object-fit: cover !important;
            }
            
            #qr-reader__dashboard_section_swaplink {
                text-decoration: none !important;
                color: var(--primary, #6A5AE0) !important;
                font-size: 14px !important;
            }
            
            #qr-reader__dashboard_section_csr button {
                background-color: var(--primary, #6A5AE0) !important;
                border: none !important;
                border-radius: 6px !important;
                padding: 8px 15px !important;
                color: white !important;
                cursor: pointer !important;
            }
            
            #qr-reader__scan_region {
                position: relative !important;
            }
            
            #qr-reader__scan_region::before {
                content: '' !important;
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                border: 2px solid rgba(255,255,255,0.5) !important;
                box-shadow: 0 0 0 100vmax rgba(0,0,0,0.4) !important;
                clip-path: inset(0px -100vmax -100vmax 0px) !important;
            }
            
            #qr-reader__dashboard_section_fsr input {
                border: 1px solid #ddd !important;
                padding: 8px !important;
                border-radius: 6px !important;
            }
            
            #qr-reader__dashboard_section_fsr span {
                color: var(--primary, #6A5AE0) !important;
                cursor: pointer !important;
            }
            
            #qr-reader__status_span {
                color: var(--text-medium, #5B5D72) !important;
                background-color: #f8f8fc !important;
                padding: 8px !important;
                border-radius: 4px !important;
            }
        `;
        
        // Stili dokümana ekle
        document.head.appendChild(style);
        
        // Modalı dokümana ekle
        document.body.appendChild(scannerModal);
        
        // Kapatma düğmesine olay dinleyicisi ekle
        document.getElementById('qr-scanner-close').addEventListener('click', () => {
            closeScanner();
        });
    }
    
    // QR tarayıcıyı başlat
    function initializeScanner() {
        try {
            // QR okuyucu konteynerini göster
            document.getElementById('qr-reader').style.display = 'block';
            
            // HTML5 QR kod tarayıcı oluştur
            qrScanner = new Html5Qrcode("qr-reader");
            
            // Tarama seçenekleri
            const config = { 
                fps: 10, 
                qrbox: 250,
                aspectRatio: 1.0,
                formatsToSupport: [
                    Html5QrcodeSupportedFormats.QR_CODE
                ]
            };
            
            // Kamera izinleri için kullanıcıya sor ve taramayı başlat
            qrScanner.start(
                { facingMode: "environment" }, // Arka kamera
                config,
                onQRCodeScanned,
                onQRScanningProgress
            ).then(() => {
                // Tarama başarıyla başladı
                console.log("QR tarama başladı");
                statusCallback("QR tarayıcı aktif. Kameranızı QR koduna doğrultun.");
                
                // Yükleniyor göstergesini gizle
                document.querySelector('.qr-loading-indicator').style.display = 'none';
                
                // Kamera kontrollerini göster
                setTimeout(() => {
                    document.getElementById('qr-toggle-flash').style.display = 'flex';
                    document.getElementById('qr-switch-camera').style.display = 'flex';
                    
                    // Kamera değiştirme butonuna olay ekle
                    document.getElementById('qr-switch-camera').addEventListener('click', switchCamera);
                    
                    // Flaş butonuna olay ekle
                    document.getElementById('qr-toggle-flash').addEventListener('click', toggleFlash);
                }, 1000);
            }).catch((err) => {
                // Tarama başlatılamadı
                console.error("QR tarama başlatılamadı:", err);
                statusCallback("Kamera erişimi sağlanamadı. İzinleri kontrol edin.");
                
                // Hata mesajını göster
                document.querySelector('.qr-loading-indicator').style.display = 'none';
                const errorDiv = document.getElementById('qr-reader-error');
                errorDiv.style.display = 'block';
                errorDiv.innerHTML = `
                    <div class="qr-error-icon"><i class="fas fa-exclamation-triangle"></i></div>
                    <h4>Kamera Erişimi Sağlanamadı</h4>
                    <p>${err.message || 'Lütfen tarayıcı izinlerini kontrol edin.'}</p>
                    <button id="qr-retry-btn" class="qr-result-btn primary">Tekrar Dene</button>
                `;
                
                // Tekrar deneme butonu
                document.getElementById('qr-retry-btn').addEventListener('click', () => {
                    errorDiv.style.display = 'none';
                    document.querySelector('.qr-loading-indicator').style.display = 'flex';
                    setTimeout(initializeScanner, 500);
                });
            });
        } catch (error) {
            // Beklenmeyen bir hata oluştu
            console.error("QR tarayıcı başlatılırken hata:", error);
            statusCallback("QR tarayıcı başlatılamadı: " + error.message);
        }
    }
    
    // QR kodu başarıyla tarandığında
    function onQRCodeScanned(decodedText, decodedResult) {
        console.log("QR kod tarandı:", decodedText);
        
        // Taramayı durdur
        qrScanner.stop().then(() => {
            console.log("QR tarama durduruldu");
            
            // Sonuç ekranını göster
            const resultDiv = document.getElementById('qr-result');
            resultDiv.style.display = 'flex';
            
            // Taranan verileri göster
            const resultDataDiv = document.getElementById('qr-result-data');
            resultDataDiv.textContent = decodedText;
            
            // Sonuç formatına göre eylemi ayarla
            const actionBtn = document.getElementById('qr-result-action');
            
            // Menü bağlantısı formatı: https://arrestorant.com/menu/urun_id
            if (decodedText.includes('/menu/')) {
                const menuId = decodedText.split('/menu/')[1];
                actionBtn.textContent = "Menüye Git";
                actionBtn.addEventListener('click', () => {
                    // Callback'i çağır ve modalı kapat
                    if (onScanCallback) {
                        onScanCallback(decodedText, menuId);
                    }
                    closeScanner();
                });
            }
            // Sonuç bir URL mi?
            else if (isUrl(decodedText)) {
                actionBtn.textContent = "Bağlantıyı Aç";
                actionBtn.addEventListener('click', () => {
                    // URL'yi aç
                    window.open(decodedText, '_blank');
                    closeScanner();
                });
            }
            // Genel metin
            else {
                actionBtn.textContent = "Tamam";
                actionBtn.addEventListener('click', () => {
                    // Callback'i çağır ve modalı kapat
                    if (onScanCallback) {
                        onScanCallback(decodedText, null);
                    }
                    closeScanner();
                });
            }
            
            // Tekrar tarama butonu
            document.getElementById('qr-scan-again').addEventListener('click', () => {
                // Sonuç ekranını gizle ve taramayı yeniden başlat
                resultDiv.style.display = 'none';
                
                // Yükleniyor göstergesini göster
                document.querySelector('.qr-loading-indicator').style.display = 'flex';
                
                // Taramayı yeniden başlat
                setTimeout(initializeScanner, 500);
            });
        }).catch((err) => {
            console.error("QR tarayıcı kapatılamadı:", err);
        });
    }
    
    // URL olup olmadığını kontrol et
    function isUrl(text) {
        try {
            new URL(text);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    // QR tarama sürecinde çağrılan fonksiyon
    function onQRScanningProgress(message) {
        console.log("QR tarama durumu:", message);
    }
    
    // Kamerayı değiştir (ön/arka)
    function switchCamera() {
        if (qrScanner) {
            qrScanner.stop().then(() => {
                // Yükleniyor göstergesini göster
                document.querySelector('.qr-loading-indicator').style.display = 'flex';
                document.getElementById('qr-reader').style.display = 'none';
                
                // Geçerli kamera modunu tersine çevir
                const currentFacingMode = document.getElementById('qr-switch-camera').getAttribute('data-facing-mode') || 'environment';
                const newFacingMode = currentFacingMode === 'environment' ? 'user' : 'environment';
                
                // Yeni modu kaydet
                document.getElementById('qr-switch-camera').setAttribute('data-facing-mode', newFacingMode);
                
                // Taramayı yeniden başlat
                setTimeout(() => {
                    document.getElementById('qr-reader').style.display = 'block';
                    
                    // Tarama seçenekleri
                    const config = { 
                        fps: 10, 
                        qrbox: 250,
                        aspectRatio: 1.0
                    };
                    
                    qrScanner.start(
                        { facingMode: newFacingMode },
                        config,
                        onQRCodeScanned,
                        onQRScanningProgress
                    ).then(() => {
                        // Yükleniyor göstergesini gizle
                        document.querySelector('.qr-loading-indicator').style.display = 'none';
                    }).catch(err => {
                        console.error("Kamera değiştirilemedi:", err);
                        // Varsayılan modda tekrar dene
                        qrScanner.start(
                            { facingMode: "environment" },
                            config,
                            onQRCodeScanned,
                            onQRScanningProgress
                        ).then(() => {
                            document.querySelector('.qr-loading-indicator').style.display = 'none';
                        });
                    });
                }, 500);
            });
        }
    }
    
    // Flaşı aç/kapat
    function toggleFlash() {
        if (qrScanner) {
            const flashBtn = document.getElementById('qr-toggle-flash');
            const isFlashOn = flashBtn.classList.contains('active');
            
            if (!isFlashOn) {
                qrScanner.applyTorch(true).then(() => {
                    flashBtn.classList.add('active');
                    flashBtn.innerHTML = '<i class="fas fa-bolt"></i> Kapat';
                }).catch(err => {
                    console.error("Flaş açılamadı:", err);
                    statusCallback("Flaş açılamadı. Cihazınızda bu özellik desteklenmiyor olabilir.");
                });
            } else {
                qrScanner.applyTorch(false).then(() => {
                    flashBtn.classList.remove('active');
                    flashBtn.innerHTML = '<i class="fas fa-bolt"></i> Flaş';
                }).catch(err => {
                    console.error("Flaş kapatılamadı:", err);
                });
            }
        }
    }
    
    // Tarayıcıyı kapat
    function closeScanner() {
        // Tarayıcı modalını kapat
        if (scannerModal) {
            scannerModal.style.opacity = '0';
            setTimeout(() => {
                if (scannerModal && scannerModal.parentNode) {
                    document.body.removeChild(scannerModal);
                    scannerModal = null;
                }
            }, 300);
        }
        
        // QR tarayıcıyı kapat
        if (qrScanner) {
            qrScanner.stop().then(() => {
                console.log("QR tarayıcı başarıyla kapatıldı");
            }).catch(err => {
                console.error("QR tarayıcı kapatılırken hata oluştu:", err);
            }).finally(() => {
                qrScanner = null;
            });
        }
    }
    
    // Public API
    return {
        show: showQRScannerModal,
        close: closeScanner,
        isActive: () => !!qrScanner,
        
        // Test için eklendi: Test sonucu işleme
        onTestScanComplete: function(testQrText) {
            if (qrScanner) {
                onQRCodeScanned(testQrText, {});
            }
        }
    };
})();

// Sayfa yüklendiğinde bottom-nav entegrasyonu
document.addEventListener('DOMContentLoaded', () => {
    // QR Tara butonunu bul
    const qrScannerButton = document.getElementById('openARCamera');
    
    // Butonu gördüğümüzde olayı ayarla
    if (qrScannerButton) {
        // Butona tıklandığında
        qrScannerButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Dokunma geri bildirimi
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate([50, 30, 50]);
            }
            
            // QR tarayıcıyı başlat
            QRScannerModule.show({
                onScan: (decodedText, menuId) => {
                    console.log("QR kod başarıyla tarandı:", decodedText);
                    
                    // Menü ID'si varsa menüye git
                    if (menuId) {
                        // Bildirim göster
                        if (window.PopupManager) {
                            window.PopupManager.showStatusMessage(`"${menuId}" menüsüne gidiliyor...`, 2000);
                        }
                        
                        // İlgili menü öğesine git
                        setTimeout(() => {
                            const targetElement = document.querySelector(`.menu-item[data-item-id="${menuId}"]`);
                            if (targetElement) {
                                targetElement.scrollIntoView({ behavior: 'smooth' });
                                
                                // Öğeyi vurgula
                                targetElement.classList.add('highlight');
                                setTimeout(() => {
                                    targetElement.classList.remove('highlight');
                                }, 2000);
                            } else {
                                // Öğe bulunamadıysa kategoriye git
                                const menuSection = document.getElementById('mainDishesSection');
                                if (menuSection) {
                                    menuSection.scrollIntoView({ behavior: 'smooth' });
                                }
                                
                                // Bildirim göster
                                if (window.PopupManager) {
                                    window.PopupManager.showStatusMessage(`"${menuId}" öğesi menüde bulunamadı.`, 3000);
                                }
                            }
                        }, 500);
                    } else {
                        // Metin içeriği için bildirim göster
                        if (window.PopupManager) {
                            window.PopupManager.showStatusMessage(`QR kodu tarandı: ${decodedText}`, 3000);
                        }
                    }
                },
                onClose: () => {
                    console.log("QR tarayıcı kapatıldı");
                },
                statusCallback: (message) => {
                    console.log("QR durum:", message);
                    
                    // Durum mesajını göster
                    if (window.PopupManager) {
                        window.PopupManager.showStatusMessage(message, 2000);
                    }
                }
            });
        });
    }
});

// Stil için genel CSS ekle
(function addGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes highlight-pulse {
            0% { box-shadow: 0 0 0 0 rgba(106, 90, 224, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(106, 90, 224, 0); }
            100% { box-shadow: 0 0 0 0 rgba(106, 90, 224, 0); }
        }
        
        .menu-item.highlight {
            animation: highlight-pulse 2s ease-out;
            position: relative;
            z-index: 5;
        }
        
        .qr-scanner-button-hint {
            position: absolute;
            bottom: 75px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            font-size: 0.85rem;
            padding: 8px 15px;
            border-radius: 20px;
            z-index: 999;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 280px;
        }
        
        .qr-scanner-guide {
            position: fixed;
            bottom: 135px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--primary, #6A5AE0);
            color: white;
            padding: 10px 20px;
            border-radius: 12px;
            font-size: 0.9rem;
            box-shadow: 0 4px 12px rgba(106, 90, 224, 0.3);
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .qr-scanner-guide i {
            font-size: 1.2rem;
        }
        
        @media (max-width: 480px) {
            .qr-scanner-guide {
                width: 90%;
                font-size: 0.8rem;
                padding: 8px 15px;
            }
        }
        
        /* QR scanner permission denied error styling */
        .qr-error-icon {
            font-size: 38px;
            color: #e74c3c;
            margin-bottom: 15px;
        }
        
        .qr-reader-error h4 {
            font-size: 1.2rem;
            color: #333;
            margin-bottom: 10px;
        }
        
        .qr-reader-error p {
            margin-bottom: 20px;
            color: #666;
        }
        
        /* QR scanner permission denied message */
        .qr-scanner-permission-denied {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 20px;
        }
        
        /* QR scanner success state */
        .qr-scanner-success {
            color: var(--success, #4CD964);
        }
        
        /* QR results item styling */
        .qr-history-item {
            background: #f8f9fe;
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .qr-history-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: var(--primary, #6A5AE0);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        
        .qr-history-content {
            flex: 1;
            overflow: hidden;
        }
        
        .qr-history-title {
            font-weight: 600;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .qr-history-value {
            font-size: 0.85rem;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .qr-history-time {
            font-size: 0.75rem;
            color: #999;
            margin-top: 2px;
        }
    `;
    
    document.head.appendChild(style);
})();

// Biraz kullanılabilirlik veri taraması ekleyelim
class QRDataProcessor {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('qr_scan_history') || '[]');
        
        // En fazla 20 taranan öğe saklanır
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
            localStorage.setItem('qr_scan_history', JSON.stringify(this.history));
        }
    }
    
    // QR verisi işle
    processData(data) {
        // Yeni taramayı geçmişe ekle
        const newScan = {
            timestamp: Date.now(),
            data: data,
            type: this.determineType(data)
        };
        
        this.history.unshift(newScan);
        
        // Geçmişi 20 öğe ile sınırla
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }
        
        // Local storage'a kaydet
        localStorage.setItem('qr_scan_history', JSON.stringify(this.history));
        
        return newScan;
    }
    
    // QR veri tipini belirle
    determineType(data) {
        // URL mi?
        try {
            new URL(data);
            if (data.includes('/menu/')) {
                return 'menu';
            }
            return 'url';
        } catch (e) {
            // E-posta mi?
            if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
                return 'email';
            }
            
            // Telefon numarası mı?
            if (/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(data)) {
                return 'phone';
            }
            
            // WiFi mi?
            if (data.startsWith('WIFI:')) {
                return 'wifi';
            }
            
            // Metin
            return 'text';
        }
    }
    
    // Geçmiş tara listesini getir
    getHistory() {
        return this.history;
    }
    
    // Geçmişi temizle
    clearHistory() {
        this.history = [];
        localStorage.removeItem('qr_scan_history');
    }
}

// QR işlemcisini global olarak kullanılabilir yap
window.QRDataProcessor = new QRDataProcessor();

// İlk ziyarette kullanım ipucu göster
document.addEventListener('DOMContentLoaded', () => {
    // Daha önce ipucu gösterilip gösterilmediğini kontrol et
    const qrHintShown = localStorage.getItem('qr_hint_shown');
    
    if (!qrHintShown) {
        // Kullanım ipucunu 3 saniye sonra göster
        setTimeout(() => {
            const hintElement = document.createElement('div');
            hintElement.className = 'qr-scanner-button-hint';
            hintElement.innerHTML = `
                <div>Menüdeki QR kodları taramak için orta butonu kullanabilirsiniz 👇</div>
            `;
            document.body.appendChild(hintElement);
            
            // İpucunu 5 saniye sonra gizle
            setTimeout(() => {
                hintElement.style.opacity = '0';
                hintElement.style.transition = 'opacity 0.5s ease';
                
                setTimeout(() => {
                    if (document.body.contains(hintElement)) {
                        document.body.removeChild(hintElement);
                    }
                }, 500);
            }, 5000);
            
            // İpucunun gösterildiğini kaydet
            localStorage.setItem('qr_hint_shown', 'true');
        }, 3000);
    }
});

// QR tarama özelliklerini global olarak kullanılabilir yap
window.QRScanner = QRScannerModule;