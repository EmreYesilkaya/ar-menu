/**
 * AR Troubleshooting Helper
 * 
 * Bu script, AR deneyimleri için sorun gidermeye yardımcı olur
 */

// AR Sorun Giderme Araçları
const ARTroubleshooter = {
    // Cihaz ve tarayıcıyı tespit et
    detectEnvironment: function() {
        const env = {
            userAgent: navigator.userAgent,
            isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
            isiPad: /iPad/.test(navigator.userAgent),
            isiPhone: /iPhone|iPod/.test(navigator.userAgent),
            isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
            isiOSSafari: (/iPad|iPhone|iPod/.test(navigator.userAgent) && 
                           !window.MSStream && 
                           /^((?!chrome|android).)*safari/i.test(navigator.userAgent)),
            iosVersion: (() => {
                const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
                return match ? parseInt(match[1], 10) : null;
            })(),
            supportsQuickLook: (() => {
                const a = document.createElement('a');
                return a.relList && a.relList.supports && a.relList.supports('ar');
            })()
        };
        
        return env;
    },
    
    // USDZ dosyasının varlığını kontrol et
    checkModelExists: function(url) {
        return fetch(url, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Model dosyasına erişilemiyor: ${response.status}`);
                }
                return {
                    exists: true,
                    size: response.headers.get('content-length'),
                    type: response.headers.get('content-type')
                };
            })
            .catch(error => {
                console.error("Model kontrolü hatası:", error);
                return { exists: false, error: error.message };
            });
    },
    
    // AR deneyimi başlatma kapasitesini kontrol et
    canLaunchAR: function() {
        const env = this.detectEnvironment();
        const checks = {
            isIOS: env.isIOS,
            iosSafari: env.isiOSSafari,
            iosVersionOk: env.iosVersion >= 12,
            supportsQuickLook: env.supportsQuickLook
        };
        
        const canLaunch = checks.isIOS && checks.iosSafari && checks.iosVersionOk && checks.supportsQuickLook;
        
        return {
            canLaunch: canLaunch,
            checks: checks,
            message: canLaunch ? 
                "AR Quick Look başlatılabilir" : 
                "AR Quick Look başlatılamayabilir. Safari tarayıcısını ve iOS 12+ kullandığınızdan emin olun."
        };
    },
    
    // Detaylı teşhis çalıştır ve rapor oluştur
    diagnose: async function() {
        const env = this.detectEnvironment();
        const arCapability = this.canLaunchAR();
        
        console.log("%c📱 AR Sorun Teşhis Raporu", "font-size: 16px; font-weight: bold; color: #6A5AE0;");
        console.log("%c🔍 Cihaz ve Tarayıcı Bilgileri", "font-weight: bold;");
        console.table(env);
        
        console.log("%c🧪 AR Başlatma Yeteneği", "font-weight: bold;");
        console.table(arCapability.checks);
        console.log(arCapability.message);
        
        // Model dosyalarını kontrol et
        console.log("%c📂 Model Dosyaları Kontrolü", "font-weight: bold;");
        
        // Menü verilerini almaya çalış
        let menuItems = [];
        try {
            if (typeof menuData !== 'undefined') {
                // Tüm modelleri düz bir listede topla
                menuData.mainDishes.forEach(item => menuItems.push(item));
                menuData.desserts.forEach(item => menuItems.push(item));
                menuData.drinks.forEach(item => menuItems.push(item));
            }
        } catch (e) {
            console.log("Menü verileri bulunamadı");
        }
        
        if (menuItems.length > 0) {
            for (const item of menuItems) {
                if (item.usdz) {
                    console.log(`USDZ dosyası kontrol ediliyor: ${item.usdz}`);
                    const result = await this.checkModelExists(item.usdz);
                    console.log(result.exists ? 
                        `✅ "${item.name}" modeli erişilebilir (${Math.round(result.size/1024)} KB)` : 
                        `❌ "${item.name}" modeli bulunamadı: ${result.error}`);
                }
            }
        } else {
            console.log("Test edilecek model yolu bulunamadı. Menü verilerinin yüklendiğinden emin olun.");
            
            // Örnek model yollarını kontrol et
            const testPaths = [
                './models/usdz/kofte.usdz',
                './models/glb/kofte.glb'
            ];
            
            for (const path of testPaths) {
                console.log(`Test dosyası kontrol ediliyor: ${path}`);
                const result = await this.checkModelExists(path);
                console.log(result.exists ? 
                    `✅ Test modeli erişilebilir (${Math.round(result.size/1024)} KB)` : 
                    `❌ Test modeli bulunamadı: ${result.error}`);
            }
        }
        
        return {
            environment: env,
            arCapability: arCapability,
            timestamp: new Date().toISOString()
        };
    },
    
    // Sorun çözme önerileri göster
    showTroubleshootingTips: function() {
        const env = this.detectEnvironment();
        const tips = [
            "📱 iOS 12 veya üzeri bir sürüm kullanın.",
            "🧭 Safari tarayıcısını kullanın (Chrome iOS'ta çalışmaz).",
            "🔍 Model dosyalarının doğru konumda olduğundan emin olun.",
            "📂 USDZ dosya formatının geçerli olduğunu kontrol edin.",
            "🔒 Kamera erişim izinlerini kontrol edin.",
            "🧹 Safari önbelleğini temizlemeyi deneyin.",
            "⚙️ Sayfayı yenileyin ve tekrar deneyin."
        ];
        
        if (!env.isIOS) {
            tips.unshift("⚠️ AR Quick Look sadece iOS cihazlarda çalışır.");
        } else if (!env.isSafari) {
            tips.unshift("⚠️ AR Quick Look sadece Safari tarayıcısında çalışır.");
        }
        
        return tips;
    }
};

// Sayfa yüklendiğinde otomatik teşhis çalıştır
document.addEventListener('DOMContentLoaded', () => {
    // 2 saniye gecikme ile çalıştır (diğer scriptlerin yüklenmesi için)
    setTimeout(() => {
        ARTroubleshooter.diagnose().then(report => {
            console.log("%c🚀 AR Teşhisi Tamamlandı", "font-weight: bold; color: green;");
            
            // Sorunlar tespit edildiyse öneriler göster
            if (!report.arCapability.canLaunch) {
                console.log("%c💡 Sorun Giderme Önerileri", "font-weight: bold;");
                ARTroubleshooter.showTroubleshootingTips().forEach((tip, i) => {
                    console.log(`${i+1}. ${tip}`);
                });
            }
        });
    }, 2000);
});

// Global fonksiyon - konsol üzerinden çağırmak için
window.testAR = ARTroubleshooter;
