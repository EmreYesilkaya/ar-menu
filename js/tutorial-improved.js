/**
 * AR Menü Geliştirilmiş Eğitim Sistemi - v3.0
 * - Tamamen yeniden yazılmış daha kararlı tutorial sistemi
 * - Tek bir durumu takip eden IIFE yapısı
 * - Kilit mekanizmasıyla çakışan gösterimleri engeller
 * - Mobil ve masaüstünde tutarlı görünüm
 */

// Tutorial Controller: Immediately Invoked Function Expression (IIFE)
const TutorialController = (function() {
    // Private variables for state management
    let currentStep = 0;
    const totalSteps = 4; // Total step count
    let isActive = false; // Whether the tutorial is currently active
    let isLocked = false; // Lock to prevent multiple concurrent operations
    let hasBeenShown = false; // Track if tutorial has been shown during this session
    
    // DOM references
    let modal, modalContent, nextBtn, backBtn, skipBtn, closeBtn, 
        progressBar, stepDots, slidesContainer, slides;
    
    // Tutorial content data
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
    
    // Initialize the tutorial system
    function init() {
        console.log("TutorialController: Başlatılıyor...");
        
        // If DOM is ready, initialize immediately; otherwise, wait for it
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initAfterDOMLoaded);
        } else {
            initAfterDOMLoaded();
        }
        
        // Check localStorage for tutorial shown status
        if (localStorage.getItem('ar_tutorial_shown')) {
            hasBeenShown = true;
        }
        
        // Return the public API
        return {
            show: showTutorial,
            close: closeTutorial,
            reset: resetTutorialState,
            forceShow: forceShowTutorial,
            hasBeenShown: () => hasBeenShown
        };
    }
    
    // Initialize after DOM is loaded
    function initAfterDOMLoaded() {
        console.log("TutorialController: DOM hazır, eğitim içeriği yükleniyor");
        
        // Get modal element
        modal = document.getElementById('instructionsModal');
        
        // If there's no modal, create one
        if (!modal) {
            createTutorialModal();
        } else {
            // Get existing modal content
            modalContent = modal.querySelector('.modal-content');
            if (!modalContent) {
                console.error("TutorialController: Modal içeriği bulunamadı, yeniden oluşturuluyor");
                createTutorialModal();
            } else {
                // Create content in existing modal
                createTutorialContent();
            }
        }
        
        // Get DOM references after creation
        updateDOMReferences();
        
        // Attach event listeners to buttons
        attachEventListeners();
        
        console.log("TutorialController: Başlatma tamamlandı");
    }
    
    // Get all DOM references in one place
    function updateDOMReferences() {
        modal = document.getElementById('instructionsModal');
        if (!modal) return;
        
        modalContent = modal.querySelector('.modal-content');
        
        // Button references
        nextBtn = document.getElementById('tutorialNextBtn');
        backBtn = document.getElementById('tutorialBackBtn');
        skipBtn = document.getElementById('tutorialSkipBtn');
        closeBtn = document.getElementById('closeModalBtn');
        
        // UI elements
        progressBar = document.getElementById('tutorialProgressBar');
        stepDots = document.querySelectorAll('.step-dot');
        slidesContainer = document.querySelector('.tutorial-slides');
        slides = document.querySelectorAll('.tutorial-slide');
    }
    
    // Create the entire tutorial modal
    function createTutorialModal() {
        console.log("TutorialController: Modal oluşturuluyor");
        
        // Create modal element
        modal = document.createElement('div');
        modal.id = 'instructionsModal';
        modal.className = 'modal';
        modal.style.display = 'none';
        
        // Add basic modal structure
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>📱 AR Deneyimi Eğitimi</h3>
                    <button class="close-modal" id="closeModalBtn"><i class="fas fa-times"></i></button>
                </div>
                <div class="modal-body">
                    <!-- Tutorial content will be added here -->
                </div>
            </div>
        `;
        
        // Append to body
        document.body.appendChild(modal);
        
        // Add tutorial content
        createTutorialContent();
    }
    
    // Create tutorial content inside modal
    function createTutorialContent() {
        console.log("TutorialController: Eğitim içeriği oluşturuluyor");
        
        // Find modal body
        const modalBody = modal.querySelector('.modal-body');
        if (!modalBody) {
            console.error("TutorialController: Modal body bulunamadı");
            return;
        }
        
        // Tutorial HTML structure
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
        
        // Add slide for each step
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
        
        // Add navigation buttons
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
        
        // Insert HTML into modal
        modalBody.innerHTML = tutorialHTML;
    }
    
    // Attach all event listeners
    function attachEventListeners() {
        console.log("TutorialController: Olay dinleyicileri ekleniyor");
        
        // If modal or content doesn't exist, bail out
        if (!modal) {
            console.error("TutorialController: Modal bulunamadı, event listener'lar eklenemedi");
            return;
        }
        
        // Update DOM references once more to make sure we have everything
        updateDOMReferences();
        
        // NAVIGATION BUTTONS
        
        // Next button
        if (nextBtn) {
            // Remove any existing listeners first
            nextBtn.removeEventListener('click', handleNextClick);
            // Add new listener
            nextBtn.addEventListener('click', handleNextClick);
        }
        
        // Back button
        if (backBtn) {
            backBtn.removeEventListener('click', handleBackClick);
            backBtn.addEventListener('click', handleBackClick);
        }
        
        // Skip button
        if (skipBtn) {
            skipBtn.removeEventListener('click', handleSkipClick);
            skipBtn.addEventListener('click', handleSkipClick);
        }
        
        // Close button (X in the corner)
        if (closeBtn) {
            closeBtn.removeEventListener('click', handleCloseClick);
            closeBtn.addEventListener('click', handleCloseClick);
        }
        
        // Clicking outside the modal
        modal.removeEventListener('click', handleOutsideClick);
        modal.addEventListener('click', handleOutsideClick);
        
        // Step indicators
        stepDots.forEach(dot => {
            dot.removeEventListener('click', handleDotClick);
            dot.addEventListener('click', handleDotClick);
        });
        
        // Ensure modal content click doesn't close modal
        if (modalContent) {
            modalContent.removeEventListener('click', handleContentClick);
            modalContent.addEventListener('click', handleContentClick);
        }
        
        // "How to use" button in the main page
        const showInstructionsBtn = document.getElementById('showInstructionsBtn');
        if (showInstructionsBtn) {
            showInstructionsBtn.removeEventListener('click', handleInstructionsBtnClick);
            showInstructionsBtn.addEventListener('click', handleInstructionsBtnClick);
        }
        
        console.log("TutorialController: Olay dinleyicileri eklendi");
    }
    
    // EVENT HANDLERS
    
    function handleNextClick(e) {
        // Prevent multiple clicks
        if (isLocked) return;
        lockUI();
        
        console.log("TutorialController: İleri butonuna tıklandı");
        
        if (currentStep < totalSteps - 1) {
            // Go to next step
            currentStep++;
            updateUI();
        } else {
            // Finish the tutorial
            completeTutorial();
        }
        
        unlockUI();
    }
    
    function handleBackClick(e) {
        if (isLocked) return;
        lockUI();
        
        console.log("TutorialController: Geri butonuna tıklandı");
        
        if (currentStep > 0) {
            currentStep--;
            updateUI();
        }
        
        unlockUI();
    }
    
    function handleSkipClick(e) {
        if (isLocked) return;
        lockUI();
        
        console.log("TutorialController: Atla butonuna tıklandı");
        closeTutorial();
        
        unlockUI();
    }
    
    function handleCloseClick(e) {
        if (isLocked) return;
        lockUI();
        
        console.log("TutorialController: Kapat butonuna tıklandı");
        closeTutorial();
        
        unlockUI();
    }
    
    function handleOutsideClick(e) {
        if (isLocked) return;
        
        // Only close if the click is directly on the modal backdrop
        if (e.target === modal) {
            lockUI();
            console.log("TutorialController: Modal dışına tıklandı");
            closeTutorial();
            unlockUI();
        }
    }
    
    function handleContentClick(e) {
        // Stop propagation to prevent the modal from closing
        e.stopPropagation();
    }
    
    function handleDotClick(e) {
        if (isLocked) return;
        lockUI();
        
        const stepIndex = parseInt(e.currentTarget.dataset.step);
        console.log(`TutorialController: Adım ${stepIndex+1}'e tıklandı`);
        
        if (!isNaN(stepIndex) && stepIndex >= 0 && stepIndex < totalSteps) {
            currentStep = stepIndex;
            updateUI();
        }
        
        unlockUI();
    }
    
    function handleInstructionsBtnClick(e) {
        e.preventDefault();
        console.log("TutorialController: Nasıl Kullanılır butonuna tıklandı");
        showTutorial();
    }
    
    // UI UPDATES
    
    // Update the UI to reflect the current step
    function updateUI() {
        console.log(`TutorialController: UI güncelleniyor, adım ${currentStep + 1}/${totalSteps}`);
        
        // Update progress bar
        if (progressBar) {
            const progress = ((currentStep + 1) / totalSteps) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        // Update step dots
        stepDots.forEach((dot, index) => {
            if (index === currentStep) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
        
        // Update slides
        slides.forEach((slide, index) => {
            if (index === currentStep) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        // Update back button state
        if (backBtn) {
            backBtn.disabled = currentStep === 0;
        }
        
        // Update next button text
        if (nextBtn) {
            if (currentStep === totalSteps - 1) {
                nextBtn.innerHTML = '<i class="fas fa-check"></i> Tamamla';
            } else {
                nextBtn.innerHTML = 'İleri <i class="fas fa-chevron-right"></i>';
            }
        }
        
        // Update skip button visibility
        if (skipBtn) {
            skipBtn.style.display = currentStep === totalSteps - 1 ? 'none' : 'block';
        }
    }
    
    // Lock the UI to prevent multiple operations
    function lockUI() {
        isLocked = true;
    }
    
    // Unlock the UI
    function unlockUI() {
        setTimeout(() => {
            isLocked = false;
        }, 300); // Short delay to prevent rapid-fire events
    }
    
    // PUBLIC METHODS
    
    // Show tutorial modal
    function showTutorial() {
        if (isLocked || isActive) return;
        lockUI();
        
        console.log("TutorialController: Eğitim gösteriliyor");
        
        // Reset to first step
        currentStep = 0;
        
        // Update the UI
        updateUI();
        
        // Actually show the modal
        if (modal) {
            // Ensure old animations are cleared
            modal.classList.remove('modal-leave');
            
            // Show modal with enter animation
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
            
            setTimeout(() => {
                modal.classList.add('modal-enter');
            }, 10);
            
            // Flag that tutorial has been shown
            hasBeenShown = true;
            isActive = true;
            
            // Save to localStorage
            localStorage.setItem('ar_tutorial_shown', 'true');
            
            unlockUI();
        } else {
            console.error("TutorialController: Modal bulunamadı");
            unlockUI();
        }
    }
    
    // Force show tutorial even if it has been shown before
    function forceShowTutorial() {
        console.log("TutorialController: Eğitim zorla gösteriliyor");
        showTutorial();
    }
    
    // Close tutorial modal
    function closeTutorial() {
        if (!isActive) return;
        
        console.log("TutorialController: Eğitim kapatılıyor");
        
        if (modal) {
            // Add leave animation
            modal.classList.remove('modal-enter');
            modal.classList.add('modal-leave');
            
            // Actually hide the modal after animation
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = ''; // Restore background scrolling
                modal.classList.remove('modal-leave');
                isActive = false;
            }, 300);
        }
    }
    
    // Complete the tutorial
    function completeTutorial() {
        console.log("TutorialController: Eğitim tamamlandı");
        
        // Mark as completed
        localStorage.setItem('ar_tutorial_completed', 'true');
        
        // Close modal
        closeTutorial();
        
        // Show success message if PopupManager is available
        if (window.PopupManager && window.PopupManager.showStatusMessage) {
            window.PopupManager.showStatusMessage("✅ AR eğitimi tamamlandı! Artık hazırsınız.");
        }
    }
    
    // Reset tutorial state
    function resetTutorialState() {
        console.log("TutorialController: Eğitim durumu sıfırlanıyor");
        localStorage.removeItem('ar_tutorial_shown');
        localStorage.removeItem('ar_tutorial_completed');
        hasBeenShown = false;
    }
    
    // Initialize and return public API
    return init();
})();

// Make accessible globally
window.TutorialController = TutorialController;

// Check if we should show the tutorial on first visit
document.addEventListener('DOMContentLoaded', function() {
    console.log("Tutorial otomatik gösterim kontrolü yapılıyor");
    
    // Automatic tutorial check function - now uses the controller
    window.checkFirstVisit = function() {
        const tutorialShown = localStorage.getItem('ar_tutorial_shown');
        console.log('Tutorial daha önce gösterilmiş mi:', tutorialShown);
        
        if (!tutorialShown) {
            console.log('İlk ziyaret tespit edildi, tutorial gösteriliyor');
            // Small delay to ensure everything is ready
            setTimeout(() => {
                TutorialController.show();
            }, 500);
        }
    };
    
    // Support for legacy AR tutorial systems
    window.openTutorialModal = function() {
        TutorialController.show();
    };
});
