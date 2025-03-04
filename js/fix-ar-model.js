/**
 * AR Model Yükleme Sorunlarını Çözen Yardımcı Dosya
 * Bu dosya, model-test.html sayfasında çalışan model yükleme kodunu ana uygulamaya entegre eder
 */

// İki sayfa arasındaki modeli doğrudan yükleyen fonksiyon
window.directLoadModel = function(modelName) {
    console.log("📂 Model doğrudan yükleniyor:", modelName);
    
    // Test edilen ve çalışan yol
    const modelPath = `models/${modelName}.glb`;
    console.log(`Kullanılan yol: ${modelPath}`);
    
    // Konteyneri bul ve göster
    const arContainer = document.getElementById('arContainer');
    if (!arContainer) {
        console.error("AR konteyneri bulunamadı!");
        return;
    }
    
    // Konteyneri görünür yap
    arContainer.style.display = 'block';
    
    // Yükleme göstergesi ekle
    arContainer.innerHTML = `
        <div id="model-loading-indicator" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; 
             display: flex; align-items: center; justify-content: center; background-color: rgba(255,255,255,0.8);">
            <div style="text-align: center;">
                <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #6A5AE0; 
                      border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite;"></div>
                <p>${modelName} yükleniyor...</p>
                <p style="font-size: 0.8em; color: #666;">Kullanılan yol: ${modelPath}</p>
            </div>
        </div>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;
    
    // Model viewer elementi oluştur
    const modelViewer = document.createElement('model-viewer');
    modelViewer.setAttribute('id', 'ar-model-viewer');
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('auto-rotate', '');
    modelViewer.setAttribute('shadow-intensity', '1');
    modelViewer.setAttribute('ar', ''); 
    modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    modelViewer.setAttribute('ar-scale', 'auto');
    modelViewer.style.width = '100%';
    modelViewer.style.height = '100%';
    modelViewer.style.backgroundColor = '#f2f2f7';
    
    // Kapatma düğmesi ekle
    const closeButton = document.createElement('button');
    closeButton.slot = 'exit-button';
    closeButton.textContent = 'Kapat ×';
    closeButton.style.backgroundColor = 'var(--danger, red)';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '8px';
    closeButton.style.padding = '8px 12px';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.zIndex = '100';
    closeButton.onclick = () => {
        arContainer.style.display = 'none';
    };
    modelViewer.appendChild(closeButton);
    
    // Model başarılı yüklendiğinde
    modelViewer.addEventListener('load', () => {
        console.log("✅ Model başarıyla yüklendi!");
        const loadingIndicator = document.getElementById('model-loading-indicator');
        if (loadingIndicator) loadingIndicator.remove();
        
        if (window.showStatusMessage) {
            window.showStatusMessage(`${modelName} modeli başarıyla yüklendi! Modeli döndürmek için sürükleyin.`, 3000);
        }
    });
    
    // Yükleme hatası olduğunda
    modelViewer.addEventListener('error', (error) => {
        console.error("❌ Model yükleme hatası:", error);
        
        // Alternatif yolu deneyelim
        const altPath = `assets/models/${modelName}.glb`;
        console.log(`İlk yol başarısız oldu. Alternatif deneniyor: ${altPath}`);
        
        // Başka yolu dene
        modelViewer.setAttribute('src', altPath);
        
        // Model hatası görünümünü hazırlayalım ama hemen göstermeyelim
        const errorDiv = document.createElement('div');
        errorDiv.id = 'model-error-display';
        errorDiv.style.display = 'none';
        errorDiv.style.position = 'absolute';
        errorDiv.style.top = '50%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translate(-50%, -50%)';
        errorDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        errorDiv.style.padding = '20px';
        errorDiv.style.borderRadius = '10px';
        errorDiv.style.maxWidth = '80%';
        errorDiv.style.textAlign = 'center';
        errorDiv.innerHTML = `
            <h3 style="color: #d32f2f; margin-bottom: 15px;">Model Yüklenemedi</h3>
            <p>Köfte modeli yüklenirken bir sorun oluştu.</p>
            <div style="margin: 15px 0; text-align: left; background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                <p>Denenen yollar:</p>
                <ul style="padding-left: 20px; margin: 5px 0;">
                    <li>${modelPath}</li>
                    <li>${altPath}</li>
                </ul>
            </div>
            <button id="force-load-btn" style="background: #6A5AE0; color: white; border: none; padding: 10px 15px; 
                   border-radius: 5px; cursor: pointer; margin-right: 10px;">Zorla Yükle</button>
            <button onclick="document.getElementById('arContainer').style.display='none'" 
                    style="background: #d32f2f; color: white; border: none; padding: 10px 15px; 
                   border-radius: 5px; cursor: pointer;">Kapat</button>
        `;
        
        arContainer.appendChild(errorDiv);
        
        // 3 saniye sonra alternatif yol da başarısız olursa hata mesajını göster
        setTimeout(() => {
            const stillLoading = document.getElementById('model-loading-indicator');
            if (stillLoading) {
                console.log("Alternatif yol da başarısız oldu, hata gösteriliyor");
                stillLoading.remove();
                document.getElementById('model-error-display').style.display = 'block';
                
                // Zorla yükleme düğmesi için olay dinleyicisi
                document.getElementById('force-load-btn').addEventListener('click', () => {
                    // Direkt yolu kullanarak modeli zorla yükle
                    const fixedPath = `models/${modelName}.glb`;
                    console.log("Zorla yükleme deneniyor:", fixedPath);
                    modelViewer.setAttribute('src', fixedPath);
                    document.getElementById('model-error-display').style.display = 'none';
                });
            }
        }, 3000);
    });
    
    // Model viewer'ı önce arContainere ekle, sonra modeli ayarla
    // Bu, bazı tarayıcılarda yükleme sorunlarını önlemeye yardımcı olur
    arContainer.appendChild(modelViewer);
    
    // Modeli ayarla - model-test sayfasında çalışan doğru yolu kullanıyoruz
    modelViewer.setAttribute('src', modelPath);
    
    // iOS için USDZ versiyonunu da ayarla
    modelViewer.setAttribute('ios-src', modelPath.replace('.glb', '.usdz'));
    
    console.log("Model viewer ayarlandı ve yükleme başlatıldı");
};

// AR Menü Düğmeleri için Olay Dinleyicilerini Ayarla
document.addEventListener('DOMContentLoaded', function() {
    console.log("AR Model düzeltme kodu yüklendi");
    
    // Biraz gecikmeyle AR butonlarını düzenleyelim (diğer scriptlerin yüklenmesi için)
    setTimeout(function() {
        // Köfte için özel işleme yapıyoruz
        const arButtons = document.querySelectorAll('.menu-item-ar');
        
        arButtons.forEach(button => {
            const modelPath = button.getAttribute('data-model');
            if (modelPath && modelPath.includes('kofte')) {
                console.log("Köfte modeli için özel işleyici ekleniyor:", modelPath);
                
                // Mevcut olay dinleyicilerini kaldır
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // Yeni olay dinleyicisi ekle
                newButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    console.log("AR Köfte Düğmesi tıklandı - özel yükleyici kullanılıyor");
                    window.directLoadModel('kofte');
                });
            }
        });
    }, 1000);
});
