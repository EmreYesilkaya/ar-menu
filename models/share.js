/**
 * AR Deneyimi Paylaşma ve Ekran Görüntüsü Özelliği
 * Bu dosya, kullanıcıların AR deneyimlerini paylaşabilmelerini sağlar.
 */

let currentItemInfo = null;

// Ekran görüntüsü almak ve paylaşmak için fonksiyonlar
function setupSharingFeatures() {
    // Paylaşım butonu oluştur ve AR kontrollerine ekle
    const shareBtn = document.createElement('button');
    shareBtn.id = 'shareArBtn';
    shareBtn.className = 'control-btn';
    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
    shareBtn.title = 'Paylaş';
    
    // AR Kontroller içine ekle
    const controls = document.querySelector('.controls');
    if (controls) {
        controls.insertBefore(shareBtn, controls.lastElementChild);
    }
    
    // Paylaşım butonu tıklama olayı
    shareBtn.addEventListener('click', () => {
        // Ekran görüntüsü al
        takeScreenshot().then(imageUrl => {
            // Paylaşım modal'ını göster
            showShareModal(imageUrl);
        }).catch(error => {
            console.error('Ekran görüntüsü alınamadı:', error);
            showStatusMessage('Paylaşım için ekran görüntüsü alınamadı. Lütfen tekrar deneyin.');
        });
    });
}

// Ekran görüntüsü alma fonksiyonu
function takeScreenshot() {
    return new Promise((resolve, reject) => {
        try {
            // Model-viewer kullanılıyorsa
            const modelViewer = document.querySelector('model-viewer');
            if (modelViewer) {
                // Model-viewer'dan ekran görüntüsü al
                modelViewer.toDataURL().then(dataUrl => {
                    resolve(dataUrl);
                }).catch(reject);
                return;
            }
            
            // WebXR kullanılıyorsa canvas'dan ekran görüntüsü al
            const canvas = document.getElementById('ar-canvas');
            if (canvas) {
                const dataUrl = canvas.toDataURL('image/png');
                resolve(dataUrl);
                return;
            }
            
            reject(new Error('Ekran görüntüsü alınabilecek bir kaynak bulunamadı.'));
        } catch (error) {
            reject(error);
        }
    });
}

// Paylaşım modal'ını göster
function showShareModal(imageUrl) {
    // Modal oluştur
    const modal = document.createElement('div');
    modal.className = 'ar-share-modal';
    
    // Modal içeriği
    const title = currentItemInfo ? currentItemInfo.name : 'AR Deneyimim';
    
    modal.innerHTML = `
        <div class="ar-share-content">
            <div class="modal-header">
                <h3>Paylaş</h3>
                <button class="close-modal" id="closeShareModalBtn"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="share-preview">
                    <img src="${imageUrl}" alt="AR Görüntü" class="share-image">
                    <div class="share-overlay">
                        <div class="share-branding">✨ AR Menü</div>
                    </div>
                </div>
                <div class="share-description">
                    <p>AR'da ${title} göründüğü gibi!</p>
                    <div class="share-buttons">
                        <button class="share-btn whatsapp"><i class="fab fa-whatsapp"></i> WhatsApp</button>
                        <button class="share-btn instagram"><i class="fab fa-instagram"></i> Instagram</button>
                        <button class="share-btn download"><i class="fas fa-download"></i> İndir</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Modal'ı body'e ekle
    document.body.appendChild(modal);
    
    // Kapatma butonu olayı
    modal.querySelector('#closeShareModalBtn').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Paylaşım butonları için olaylar
    const whatsappBtn = modal.querySelector('.share-btn.whatsapp');
    whatsappBtn.addEventListener('click', () => shareToWhatsApp(imageUrl, title));
    
    const instagramBtn = modal.querySelector('.share-btn.instagram');
    instagramBtn.addEventListener('click', () => {
        alert('Instagram Hikayeler açılamadı. Görüntüyü indirip manuel olarak Instagram hikayelerine yükleyebilirsiniz.');
    });
    
    const downloadBtn = modal.querySelector('.share-btn.download');
    downloadBtn.addEventListener('click', () => downloadImage(imageUrl, `ar_menu_${title.replace(/\s+/g, '_').toLowerCase()}`));
    
    // Modal dışına tıklama olayı
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// WhatsApp'ta paylaşma
function shareToWhatsApp(imageUrl, title) {
    // Web Share API kullanılabilir mi?
    if (navigator.share) {
        fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'ar_foto.png', { type: 'image/png' });
                navigator.share({
                    title: `AR Menü - ${title}`,
                    text: `AR Menü uygulamasında ${title} nasıl görünüyor!`,
                    files: [file]
                }).catch(error => {
                    console.error('Paylaşım hatası:', error);
                    // Yedek yöntem
                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`AR Menü uygulamasında harika bir yemek keşfettim! - ${title}`)}`;
                    window.open(whatsappUrl, '_blank');
                });
            });
    } else {
        // Web Share API desteklenmiyorsa
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`AR Menü uygulamasında harika bir yemek keşfettim! - ${title}`)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Görüntüyü indirme
function downloadImage(dataUrl, fileName) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${fileName}.png`;
    link.click();
}

// Sayfa yüklendiğinde paylaşım özelliklerini kur
document.addEventListener('DOMContentLoaded', () => {
    // Paylaşım butonunu oluştur
    setupSharingFeatures();
    
    // Mevcut AR modelini izle
    document.addEventListener('modelLoaded', (e) => {
        if (e.detail && e.detail.item) {
            currentItemInfo = e.detail.item;
        }
    });
    
    // Model yükleme olayını izlemek için özel bir olay dinleyici ekle
    const originalInitModelViewer = window.initModelViewer || function() {};
    window.initModelViewer = function(item) {
        // Orijinal fonksiyonu çağır
        originalInitModelViewer(item);
        
        // Model bilgisini güncelle
        currentItemInfo = item;
        
        // Özel model yükleme olayını tetikle
        const event = new CustomEvent('modelLoaded', { detail: { item: item } });
        document.dispatchEvent(event);
    };
});
