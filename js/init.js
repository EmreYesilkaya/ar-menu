/**
 * AR Menü Başlatma Dosyası - v3.0
 * Tamamen yeniden yazıldı
 * - Yükleme ekranı kesinlikle kapanacak şekilde güvenli tasarlandı
 * - Daha basit ve güvenilir yükleme mantığı
 */

// Sayfa yüklenme işlemi - kendini çalıştıran fonksiyon
(function() {
    console.log("InitJS 3.0: Başlatılıyor...");

    // Global değişkenler
    let isLoading = true;
    let loadingScreen = null;
    
    // DOM yükleme olayını dinle
    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM yüklendi");
        
        // Yükleme ekranı elementini al
        loadingScreen = document.getElementById('loadingScreen');
        if (!loadingScreen) {
            console.error("Yükleme ekranı elementi bulunamadı!");
            return;
        }
        
        // 1.5 saniye sonra yükleme ekranını kapat
        setTimeout(forceHideLoadingScreen, 1500);
    });
    
    // Sayfa tam olarak yüklendiğinde
    window.addEventListener('load', function() {
        console.log("Tüm sayfa içeriği yüklendi");
        
        // Daha kısa sürede yükleme ekranını kapat
        setTimeout(forceHideLoadingScreen, 500);
    });
    
    // Yükleme ekranını tamamen kapatan basit fonksiyon
    function forceHideLoadingScreen() {
        if (!isLoading) return; // Zaten kapatıldıysa tekrar çalıştırma
        
        console.log("Yükleme ekranı kapatılıyor...");
        
        try {
            // Ekranı bul (eğer daha önce bulunmadıysa)
            if (!loadingScreen) {
                loadingScreen = document.getElementById('loadingScreen');
            }
            
            if (loadingScreen) {
                // Doğrudan display:none yaparak kesin olarak gizle
                loadingScreen.style.opacity = '0';
                
                // Kısa gecikmeyle tamamen kaldır
                setTimeout(function() {
                    loadingScreen.style.display = 'none';
                    
                    // Tutorial'ı göstermeyi dene
                    try {
                        if (window.openTutorialModal) {
                            setTimeout(window.openTutorialModal, 300);
                        }
                    } catch(err) {
                        console.log("Tutorial açma hatası:", err);
                    }
                }, 300);
                
                // Yükleme durumunu güncelle
                isLoading = false;
                console.log("Yükleme ekranı kapatıldı");
            }
        } catch (err) {
            console.error("Yükleme ekranını kapatma hatası:", err);
            
            // Hata olsa bile kesin kapatmayı dene
            try {
                const screen = document.getElementById('loadingScreen');
                if (screen) screen.style.display = 'none';
                isLoading = false;
            } catch(e) {
                console.error("Kritik kapatma hatası:", e);
            }
        }
    }
    
    // Global olarak erişilebilir kapatma fonksiyonu
    window._hideLoadingScreen = forceHideLoadingScreen;
    
    // ÇOK ÖNEMLİ: 3 saniye sonra kesinlikle kapanmasını garantile
    setTimeout(function() {
        if (isLoading) {
            console.warn("ACİL DURUM: 3 saniye sonra hala yükleme ekranı açık, ZORLA KAPATILIYOR");
            forceHideLoadingScreen();
            
            // Yine de kapanmadıysa DOM'a doğrudan müdahale et
            setTimeout(function() {
                const screen = document.getElementById('loadingScreen');
                if (screen) {
                    screen.style.display = 'none';
                    console.warn("ACİL DURUM: Yükleme ekranı doğrudan DOM ile gizlendi");
                }
            }, 100);
        }
    }, 3000);
})();
