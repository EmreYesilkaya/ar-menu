/**
 * AR Menü Eğitim Sistemi - v2.0
 * Basitleştirilmiş ve güvenilir anlatıcı
 * - Tüm buton sorunları düzeltildi
 * - İleri/geri/atla/kapat düğmeleri doğrudan çalışır hale getirildi
 */

// Global değişkenler
let currentStep = 0;
const totalSteps = 4; // Toplam adım sayısı

// DOM Yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tutorial: DOM yüklendi, başlatılıyor...');
    
    // Anlatıcı içeriğini oluştur
    createTutorialContent();
    
    // Tüm butonlar için event listener'ları doğrudan ekle
    attachButtonHandlers();
    
    // Sayfa ilk açıldığında anlatıcı gösterilmeli mi kontrol et
    setTimeout(checkFirstVisit, 500);
});

// İlk ziyaret kontrolü
function checkFirstVisit() {
    // Test sırasında devre dışı bırakabilirsiniz
    // localStorage.removeItem('ar_tutorial_shown');
    
    const tutorialShown = localStorage.getItem('ar_tutorial_shown');
    if (!tutorialShown) {
        showTutorial();
    }
}

// Anlatıcı içeriğini oluştur
function createTutorialContent() {
    console.log('Tutorial: İçerik oluşturuluyor...');
    
    // Adım bilgilerini tanımla
    const steps = [
        {
            title: "Menüden Ürün Seçin",
            description: "Yemek kartı üzerindeki <strong>AR'da Gör</strong> butonuna tıklayın.",
            icon: "fas fa-hand-pointer",
            animation: "tap-animation",
            tip: "Modeli olan tüm ürünleri AR'da gerçek boyutlarıyla görüntüleyebilirsiniz!"
        },
        {
            title: "Kamera İzni Verin",
            description: "AR deneyimi için kamera izni gereklidir. <strong>İzin Ver</strong> seçeneğini seçin.",
            icon: "fas fa-camera",
            animation: "pulse-animation", 
            tip: "Kamera erişimi sadece AR deneyimi için kullanılır ve saklanmaz."
        },
        {
            title: "Düz Yüzey Bulun",
            description: "Kameranızı masa veya zemin gibi <strong>düz bir yüzeye</strong> doğrultun.",
            icon: "fas fa-border-all",
            animation: "scan-animation",
            tip: "İyi aydınlatılmış ortamlarda yüzeyler daha hızlı algılanır."
        },
        {
            title: "Yerleştir ve Keşfet",
            description: "Ekrana dokunarak modeli yerleştirin ve <strong>döndürme kontrollerini</strong> kullanın.",
            icon: "fas fa-cube",
            animation: "rotate-animation",
            tip: "Farklı açılardan görmek için modelin etrafında dönebilirsiniz!"
        }
    ];
    
    // Modal içeriğini bul
    const modalBody = document.querySelector('.modal-body');
    if (!modalBody) {
        console.error('Tutorial: Modal body bulunamadı');
        return;
    }
    
    // İçerik HTML'i oluştur
    let tutorialHTML = `
        <div class="tutorial-content">
            <div class="tutorial-progress">
                <div class="progress-container">
                    <div class="progress-bar" id="tutorialProgressBar" style="width: 25%"></div>
                </div>
                <div class="step-indicators">
                    ${steps.map((_, i) => 
                        `<div class="step-dot ${i === 0 ? 'active' : ''}" data-step="${i}"></div>`
                    ).join('')}
                </div>
            </div>
            
            <div class="tutorial-slides">
    `;
    
    // Her adım için slayt HTML'i ekle
    steps.forEach((step, index) => {
        tutorialHTML += `
            <div class="tutorial-slide ${index === 0 ? 'active' : ''}" data-step="${index}">
                <div class="slide-content">
                    <div class="step-icon-container">
                        <div class="step-icon ${step.animation}">
                            <i class="${step.icon}"></i>
                        </div>
                    </div>
                    
                    <div class="step-info">
                        <h3>${step.title}</h3>
                        <p>${step.description}</p>
                        <div class="pro-tip">
                            <div class="tip-icon"><i class="fas fa-lightbulb"></i></div>
                            <div class="tip-text">${step.tip}</div>
                        </div>
                    </div>
                </div>
                
                <div class="step-illustration">
                    <img src="images/tutorial-step-${index + 1}.png" 
                         alt="Adım ${index + 1}" 
                         loading="lazy"
                         onerror="this.src='https://placehold.co/400x200/6A5AE0/fff?text=Adım+${index + 1}'">
                </div>
            </div>
        `;
    });
    
    // Navigasyon butonlarını ekle
    tutorialHTML += `
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
        </div>
    `;
    
    // HTML'i sayfaya ekle
    modalBody.innerHTML = tutorialHTML;
    console.log('Tutorial: İçerik oluşturuldu');
}

// Butonlara tıklama event'lerini ekle
function attachButtonHandlers() {
    console.log('Tutorial: Buton olay dinleyicileri ekleniyor...');
    
    // İleri butonu
    const nextBtn = document.getElementById('tutorialNextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            console.log('Tutorial: İleri butonuna tıklandı');
            goToNextStep();
        });
    }
    
    // Geri butonu
    const backBtn = document.getElementById('tutorialBackBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            console.log('Tutorial: Geri butonuna tıklandı');
            goToPreviousStep();
        });
    }
    
    // Atla butonu
    const skipBtn = document.getElementById('tutorialSkipBtn');
    if (skipBtn) {
        skipBtn.addEventListener('click', function() {
            console.log('Tutorial: Atla butonuna tıklandı');
            closeTutorial();
        });
    }
    
    // Kapatma butonu
    const closeBtn = document.getElementById('closeModalBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            console.log('Tutorial: Kapat butonuna tıklandı');
            closeTutorial();
        });
    }
    
    // Adım noktalarına tıklama
    const stepDots = document.querySelectorAll('.step-dot');
    stepDots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            console.log(`Tutorial: Adım ${index+1}'e tıklandı`);
            goToStep(index);
        });
    });
    
    // Modal dışına tıklama
    const modal = document.getElementById('instructionsModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                console.log('Tutorial: Modal dışına tıklandı');
                closeTutorial();
            }
        });
    }
    
    console.log('Tutorial: Tüm buton olay dinleyicileri eklendi');
}

// Sonraki adıma geç
function goToNextStep() {
    if (currentStep < totalSteps - 1) {
        currentStep++;
        updateStep();
    } else {
        // Son adımdayız, tutorial'ı tamamla
        completeTutorial();
    }
}

// Önceki adıma geç
function goToPreviousStep() {
    if (currentStep > 0) {
        currentStep--;
        updateStep();
    }
}

// Belirli adıma git
function goToStep(stepIndex) {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
        currentStep = stepIndex;
        updateStep();
    }
}

// Adım değişikliği sonrası UI güncelle
function updateStep() {
    console.log(`Tutorial: ${currentStep+1}. adıma geçiliyor`);
    
    // İlerleme çubuğunu güncelle
    const progressBar = document.getElementById('tutorialProgressBar');
    if (progressBar) {
        const progress = ((currentStep + 1) / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
    }
    
    // Adım noktalarını güncelle
    const stepDots = document.querySelectorAll('.step-dot');
    stepDots.forEach((dot, index) => {
        if (index === currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Slaytları güncelle
    const slides = document.querySelectorAll('.tutorial-slide');
    slides.forEach((slide, index) => {
        if (index === currentStep) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Geri butonunu güncelle
    const backBtn = document.getElementById('tutorialBackBtn');
    if (backBtn) {
        backBtn.disabled = currentStep === 0;
    }
    
    // İleri butonunu güncelle (son adımda Tamamla olacak)
    const nextBtn = document.getElementById('tutorialNextBtn');
    if (nextBtn) {
        if (currentStep === totalSteps - 1) {
            nextBtn.innerHTML = '<i class="fas fa-check"></i> Tamamla';
        } else {
            nextBtn.innerHTML = 'İleri <i class="fas fa-chevron-right"></i>';
        }
    }
    
    // Atla butonunu güncelle (son adımda gizle)
    const skipBtn = document.getElementById('tutorialSkipBtn');
    if (skipBtn) {
        skipBtn.style.display = currentStep === totalSteps - 1 ? 'none' : 'block';
    }
    
    console.log(`Tutorial: Adım ${currentStep+1} görüntüleniyor`);
}

// Tutorial'ı tamamla
function completeTutorial() {
    console.log('Tutorial: Tamamlandı');
    
    // Tamamlandı olarak işaretle (tekrar gösterme)
    localStorage.setItem('ar_tutorial_completed', 'true');
    localStorage.setItem('ar_tutorial_shown', 'true');
    
    // Modal'ı kapat
    closeTutorial();
    
    // Başarı mesajı göster (PopupManager varsa)
    if (window.PopupManager && window.PopupManager.showStatusMessage) {
        window.PopupManager.showStatusMessage("✅ AR eğitimi tamamlandı! Artık hazırsınız.");
    }
}

// Tutorial'ı göster
function showTutorial() {
    console.log('Tutorial: Gösteriliyor');
    
    const modal = document.getElementById('instructionsModal');
    if (!modal) {
        console.error('Tutorial: Modal bulunamadı!');
        return;
    }
    
    // İlk adımı göster
    currentStep = 0;
    updateStep();
    
    // Modal'ı göster
    modal.style.display = 'flex';
    
    // Gösterildiğini kaydet
    localStorage.setItem('ar_tutorial_shown', 'true');
}

// Tutorial'ı kapat
function closeTutorial() {
    console.log('Tutorial: Kapatılıyor');
    
    const modal = document.getElementById('instructionsModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Global olarak erişilebilir fonksiyonlar
window.openTutorialModal = showTutorial;

// Sayfa tamamen yüklendiğinde "Nasıl Kullanılır" butonunu etkinleştir
window.addEventListener('load', function() {
    const showInstructionsBtn = document.getElementById('showInstructionsBtn');
    if (showInstructionsBtn) {
        showInstructionsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showTutorial();
        });
    }
});
