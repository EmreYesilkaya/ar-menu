/**
 * TUTORIAL GÖRÜNTÜLEME SORUNU DÜZELTME
 * Tutorial modülünün görünmez kalma sorununu çözer
 */

(function() {
    // Sayfanın yüklenmesini bekleyin
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Tutorial düzeltme modülü çalışıyor...');
        
        // İlk ziyarette tutorial'ı göstermek için zamanlayıcıyı ayarla
        setTimeout(checkAndShowTutorial, 1000); // Sayfa içeriği yüklendikten sonra kontrol et
    });
    
    // Sayfa tamamen yüklendiğinde de kontrol et (resimler, vs.)
    window.addEventListener('load', function() {
        console.log('Sayfa tamamen yüklendi, tutorial kontrolü yapılıyor...');
        checkAndShowTutorial();
    });
    
    // Tutorial'ı kontrol et ve gerekirse göster
    function checkAndShowTutorial() {
        console.log('Tutorial görünürlük kontrolü yapılıyor...');
        
        // Tutorial gösterilmiş mi kontrol et
        const isTutorialShown = localStorage.getItem('ar_tutorial_shown');
        
        // Tutorial modalını bul
        const instructionsModal = document.getElementById('instructionsModal');
        
        // İlk ziyaretse ve modal varsa göster
        if (!isTutorialShown && instructionsModal) {
            console.log('İlk ziyaret tespit edildi, tutorial gösterilecek!');
            
            // Modal görünürlüğünü test et
            if (window.getComputedStyle(instructionsModal).display === 'none') {
                // Modalı zorla göster
                showTutorialModal();
            } else {
                console.log('Tutorial zaten görünür durumda');
            }
        } else {
            console.log('İlk ziyaret değil veya tutorial modalı bulunamadı');
        }
        
        // "Nasıl Kullanılır?" butonunu dinle
        setupInstructionButton();
    }
    
    // Tutorial modalını göster
    function showTutorialModal() {
        console.log('Tutorial modalı açılıyor...');
        
        const instructionsModal = document.getElementById('instructionsModal');
        if (!instructionsModal) {
            console.error('Tutorial modalı bulunamadı!');
            return;
        }
        
        // Modalı göster
        instructionsModal.style.display = 'flex';
        instructionsModal.style.opacity = '1';
        
        // Arkaplanda scroll'u önle
        document.body.style.overflow = 'hidden';
        
        // LocalStorage'a kaydederek bir daha gösterilmemesini sağla
        localStorage.setItem('ar_tutorial_shown', 'true');
        
        // Modalın içeriğini kontrol et
        const modalBody = instructionsModal.querySelector('.modal-body');
        if (modalBody && modalBody.children.length === 0) {
            console.warn('Tutorial içeriği yüklenmemiş, yeniden yükleniyor...');
            
            // Eğer tutorial.js çalışmadıysa, içeriği manuel oluşturalım
            createTutorialContent(modalBody);
        }
        
        // Modal kapatma butonunu etkinleştir
        const closeBtn = instructionsModal.querySelector('#closeModalBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                instructionsModal.style.display = 'none';
                document.body.style.overflow = '';
            });
        }
        
        // Modal dışı tıklamayla kapatma
        instructionsModal.addEventListener('click', function(e) {
            if (e.target === instructionsModal) {
                instructionsModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        console.log('Tutorial başarıyla gösterildi!');
    }
    
    // "Nasıl Kullanılır?" butonunu etkinleştir
    function setupInstructionButton() {
        const showInstructionsBtn = document.getElementById('showInstructionsBtn');
        if (showInstructionsBtn) {
            // Mevcut event listener'ları kaldır
            const newBtn = showInstructionsBtn.cloneNode(true);
            showInstructionsBtn.parentNode.replaceChild(newBtn, showInstructionsBtn);
            
            // Yeni event listener ekle
            newBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Nasıl Kullanılır butonuna tıklandı');
                showTutorialModal();
            });
            
            console.log('Nasıl Kullanılır butonu etkinleştirildi');
        }
    }
    
    // Temel tutorial içeriği oluştur 
    function createTutorialContent(modalBody) {
        modalBody.innerHTML = `
        <div class="tutorial-content">
            <div class="tutorial-progress">
                <div class="progress-container">
                    <div class="progress-bar" id="tutorialProgressBar" style="width: 25%"></div>
                </div>
                <div class="step-indicators">
                    <div class="step-dot active" data-step="0"></div>
                    <div class="step-dot" data-step="1"></div>
                    <div class="step-dot" data-step="2"></div>
                    <div class="step-dot" data-step="3"></div>
                </div>
            </div>
            
            <div class="tutorial-slides">
                <div class="tutorial-slide active" data-step="0">
                    <div class="slide-content">
                        <div class="step-icon-container">
                            <div class="step-icon tap-animation">
                                <i class="fas fa-hand-pointer"></i>
                            </div>
                        </div>
                        
                        <div class="step-info">
                            <h3>Menüden Ürün Seçin</h3>
                            <p>Yemek kartı üzerindeki <strong>AR'da Gör</strong> butonuna tıklayın.</p>
                            <div class="pro-tip">
                                <div class="tip-icon"><i class="fas fa-lightbulb"></i></div>
                                <div class="tip-text">Modeli olan tüm ürünleri AR'da gerçek boyutlarıyla görüntüleyebilirsiniz!</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Diğer slaytlar için benzer yapı -->
            </div>
            
            <div class="tutorial-navigation">
                <button class="tutorial-btn back-btn" id="tutorialBackBtn" disabled>
                    <i class="fas fa-chevron-left"></i> Geri
                </button>
                <button class="tutorial-btn skip-btn" id="tutorialSkipBtn">Atla</button>
                <button class="tutorial-btn next-btn" id="tutorialNextBtn">
                    İleri <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>`;
        
        // Navigasyon butonlarını etkinleştir
        setupNavigationButtons();
    }
    
    // Tutorial navigasyon butonlarını etkinleştir
    function setupNavigationButtons() {
        const closeBtn = document.getElementById('tutorialSkipBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                const modal = document.getElementById('instructionsModal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
        
        // İleri butonu için olay dinleyicisi ekle
        const nextBtn = document.getElementById('tutorialNextBtn');
        if (nextBtn) {
            // Tek tıklamada tamamla
            nextBtn.addEventListener('click', function() {
                const modal = document.getElementById('instructionsModal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    }
    
    // Global API
    window.TutorialFix = {
        showTutorial: showTutorialModal
    };
})();
