/**
 * Yükleme Ekranı Sorunu için Acil Düzeltme
 * Bu dosya, yükleme ekranının takılması durumunda zorla kapatılmasını sağlar
 */

(function() {
    console.log("Yükleme ekranı düzeltme kodu çalıştırılıyor...");
    
    // Sayfa yüklenir yüklenmez çalıştır
    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM yüklendi, yükleme ekranı kontrol ediliyor...");
        checkLoadingScreen();
    });
    
    // 1 saniye sonra kontrol et
    setTimeout(checkLoadingScreen, 1000);
    
    // 3 saniye sonra kontrol et
    setTimeout(checkLoadingScreen, 3000);
    
    // 5 saniye sonra zorla kapat
    setTimeout(forceHideLoadingScreen, 5000);

    function checkLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            console.warn("Yükleme ekranı hala görünür, kapatmayı deniyoruz...");
            tryHideLoadingScreen();
        } else {
            console.log("Yükleme ekranı kontrolü: görünmüyor veya zaten kapalı");
        }
    }
    
    function tryHideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) return;
        
        try {
            // Mevcut hideLoadingScreen fonksiyonunu deneyin
            if (typeof hideLoadingScreen === 'function') {
                console.log("hideLoadingScreen() fonksiyonu çağrılıyor...");
                hideLoadingScreen();
                return;
            }
            
            // PopupManager'ı deneyin
            if (window.PopupManager && typeof window.PopupManager.hideLoading === 'function') {
                console.log("PopupManager.hideLoading() çağrılıyor...");
                window.PopupManager.hideLoading();
                return;
            }
            
            // Manuel olarak gizlemeyi deneyin
            console.log("Manuel olarak yükleme ekranını gizleme deniyor...");
            loadingScreen.style.opacity = '0';
            loadingScreen.style.transition = 'opacity 0.3s ease';
            
            setTimeout(function() {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = '';
                console.log("Yükleme ekranı manuel olarak gizlendi.");
            }, 300);
            
        } catch (error) {
            console.error("Yükleme ekranını gizlemeyi denerken hata:", error);
            // Hata durumunda doğrudan DOM manipülasyonu
            forceHideLoadingScreen();
        }
    }
    
    function forceHideLoadingScreen() {
        console.warn("ZORLA YÜKLEME EKRANINI KAPATMA İŞLEMİ!");
        const loadingScreen = document.getElementById('loadingScreen');
        
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            console.warn("Yükleme ekranı hala açık! Zorla kapatılıyor...");
            loadingScreen.style.display = 'none';
            document.body.style.overflow = '';
            
            // Taşma problemini de düzelt
            document.body.style.position = 'static';
            document.body.style.height = 'auto';
            
            // Başarı mesajı göster
            showLoadedMessage();
        }
    }
    
    function showLoadedMessage() {
        // Kullanıcıya bir bildirim göster
        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '80px';
        message.style.left = '50%';
        message.style.transform = 'translateX(-50%)';
        message.style.backgroundColor = 'rgba(0, 180, 100, 0.9)';
        message.style.color = 'white';
        message.style.padding = '10px 20px';
        message.style.borderRadius = '8px';
        message.style.zIndex = '9999';
        message.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        message.style.fontSize = '14px';
        message.style.textAlign = 'center';
        
        message.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="font-size: 18px;">✅</div>
                <div>Sayfa yüklendi!</div>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // 3 saniye sonra mesajı kaldır
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                if (document.body.contains(message)) {
                    document.body.removeChild(message);
                }
            }, 500);
        }, 3000);
    }
    
    // Hata kontrolü - Sayfa yüklendikten sonra tüm hataları yakala
    window.addEventListener('error', function(event) {
        console.error("SAYFA HATASI YAKALANDI:", event.error);
        
        // Hata varsa ve yükleme ekranı hala açıksa, zorla kapat
        if (document.getElementById('loadingScreen')?.style.display !== 'none') {
            console.warn("Hata nedeniyle yükleme ekranı zorla kapatılıyor");
            forceHideLoadingScreen();
        }
    });
    
    // Unhandled promise rejection yakalama
    window.addEventListener('unhandledrejection', function(event) {
        console.error("İŞLENMEYEN PROMISE REDDİ:", event.reason);
        
        // Promise hatası varsa ve yükleme ekranı hala açıksa, zorla kapat
        if (document.getElementById('loadingScreen')?.style.display !== 'none') {
            console.warn("Promise hatası nedeniyle yükleme ekranı zorla kapatılıyor");
            forceHideLoadingScreen();
        }
    });
})();
