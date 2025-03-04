/**
 * AR Entegrasyon Yardımcısı
 * Bu dosya, eski AR işlevlerini ARModule'e bağlar ve uyumluluk sağlar
 */

// Bu script, eski kodun ARModule ile çalışmasını sağlar
document.addEventListener('DOMContentLoaded', function() {
    console.log('AR Integration: ARModule ile eski kodun entegrasyonu sağlanıyor...');
    
    if (!window.ARModule) {
        console.error('AR Integration: ARModule bulunamadı!');
        return;
    }
    
    try {
        // Eski initModelViewer fonksiyonunu ARModule'e yönlendir
        window.initModelViewer = function(item) {
            console.log('AR Integration: initModelViewer çağrısı ARModule.showAR\'a yönlendiriliyor');
            return ARModule.showAR(item);
        };
        
        // Eski initQuickLook fonksiyonunu ARModule'e yönlendir
        window.initQuickLook = function(item) {
            console.log('AR Integration: initQuickLook çağrısı ARModule.showAR\'a yönlendiriliyor');
            return ARModule.showAR(item);
        };
        
        // Eski initWebXR fonksiyonunu ARModule'e yönlendir
        window.initWebXR = function(item) {
            console.log('AR Integration: initWebXR çağrısı ARModule.showAR\'a yönlendiriliyor');
            return ARModule.showAR(item);
        };
        
        // Eski directLoadModel fonksiyonunu ARModule'e yönlendir
        window.directLoadModel = function(modelName) {
            console.log('AR Integration: directLoadModel çağrısı ARModule.loadModel\'e yönlendiriliyor');
            return ARModule.loadModel(modelName);
        };
        
        // Eski closeARView fonksiyonunu ARModule'e yönlendir  
        window.closeARView = function() {
            console.log('AR Integration: closeARView çağrısı ARModule.close\'a yönlendiriliyor');
            return ARModule.close();
        };
        
        console.log('AR Integration: ARModule entegrasyonu tamamlandı');
    } catch (err) {
        console.error('AR Integration hatası:', err);
    }
});
