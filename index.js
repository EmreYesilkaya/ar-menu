// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const statusMessage = document.getElementById('statusMessage');
const arContainer = document.getElementById('arContainer');
const arCanvas = document.getElementById('ar-canvas');
const mainDishesContainer = document.getElementById('mainDishes');
const dessertsContainer = document.getElementById('desserts');
const drinksContainer = document.getElementById('drinks');
const showInstructionsBtn = document.getElementById('showInstructionsBtn');
const instructionsModal = document.getElementById('instructionsModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const rotateLeftBtn = document.getElementById('rotateLeftBtn');
const rotateRightBtn = document.getElementById('rotateRightBtn');
const resetBtn = document.getElementById('resetBtn');
const closeArBtn = document.getElementById('closeArBtn');

// Global variables
let scene, camera, renderer;
let currentModel = null;
let xrSession = null;
let hitTestSource = null;
let hitTestSourceRequested = false;
let reticle;
let isModelPlaced = false;
let modelRotationY = 0;
let arSupport = 'none'; // 'webxr', 'quicklook', 'none'

// Improved function to check what AR technology is supported
function checkARSupport() {
    // Detect iOS devices more reliably
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    console.log('Device detection:', { isIOS, isSafari, userAgent: navigator.userAgent });
    
    // For iOS devices, prioritize AR Quick Look
    if (isIOS) {
        console.log('iOS device detected, using AR Quick Look');
        arSupport = 'quicklook';
        return Promise.resolve('quicklook');
    }
    
    // Check for WebXR support
    if (navigator.xr && 'isSessionSupported' in navigator.xr) {
        return navigator.xr.isSessionSupported('immersive-ar')
            .then(supported => {
                if (supported) {
                    arSupport = 'webxr';
                    return 'webxr';
                } else {
                    arSupport = 'none';
                    return 'none';
                }
            })
            .catch(() => {
                arSupport = 'none';
                return 'none';
            });
    } else {
        arSupport = 'none';
        return Promise.resolve('none');
    }
}

// Menu data - Replace with your actual data or fetch from API
const menuData = {
    mainDishes: [
        { 
          id: 1, 
          name: 'Izgara Köfte', 
          price: '120 TL', 
          image: './assets/dishes/kofte.jpg', 
          modelPath: './models/glb/kofte.glb',
          // For iOS AR QuickLook - yolun tam ve doğru olduğundan emin olun
          usdz: './models/usdz/kofte.usdz'
        },
        { 
          id: 2, 
          name: 'Karışık Izgara', 
          price: '180 TL', 
          image: './assets/dishes/karisik.jpg', 
          modelPath: './models/glb/karisik.glb',
          usdz: './models/usdz/karisik.usdz'
        },
        { 
          id: 3, 
          name: 'Tavuk Şiş', 
          price: '140 TL', 
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Tavuk+Şiş', 
          modelPath: './assets/models/tavuk_sis.glb',
          usdz: './assets/models/tavuk_sis.usdz'
        }
    ],
    desserts: [
        {
          id: 4,
          name: 'Künefe',
          price: '65 TL',
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Künefe',
          modelPath: './assets/models/kunefe.glb',
          usdz: './assets/models/kunefe.usdz'
        },
        {
          id: 5,
          name: 'Baklava',
          price: '75 TL',
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Baklava',
          modelPath: './assets/models/baklava.glb',
          usdz: './assets/models/baklava.usdz'
        }
    ],
    drinks: [
        {
          id: 6,
          name: 'Ayran',
          price: '15 TL',
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Ayran',
          modelPath: './assets/models/ayran.glb',
          usdz: './assets/models/ayran.usdz'
        },
        {
          id: 7,
          name: 'Türk Kahvesi',
          price: '30 TL',
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Türk+Kahvesi',
          modelPath: './assets/models/kahve.glb',
          usdz: './assets/models/kahve.usdz'
        }
    ]
};

// Initialize the application - Yükleme sorunu çözümü
function init() {
    console.log("AR Menü başlatılıyor...");
    
    // Önce DOM'un hazır olduğundan emin olalım
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initAfterDOMLoaded);
    } else {
        initAfterDOMLoaded();
    }
}

// DOM yüklendikten sonra başlatma işlemi
function initAfterDOMLoaded() {
    console.log("DOM yüklendi, AR desteği kontrol ediliyor...");
    
    // Bağımlı kütüphanelerin yüklendiğini kontrol et
    if (!window.THREE) {
        console.error("THREE.js kütüphanesi yüklenemedi!");
        showLoadingError("Gerekli 3D kütüphaneleri yüklenemedi. Sayfayı yenileyin veya farklı bir tarayıcı deneyin.");
        return;
    }
    
    // AR desteği kontrolü ve menü yükleme
    try {
        checkARSupport()
            .then(support => {
                console.log('AR desteği tespit edildi:', support);
                
                // Artık hiçbir bölümü gizlemeye gerek yok, hepsi görünür olacak
                // Tüm kategorilerin içeriğini yükle
                loadMenuItems();
                
                // Olay dinleyicilerini ayarla
                setupEventListeners();
                
                // Yükleme ekranını kaldır
                console.log("Yükleme tamamlandı, yükleme ekranı kapatılıyor...");
                hideLoadingScreen();
            })
            .catch(err => {
                console.error("AR desteği kontrol edilirken hata:", err);
                hideLoadingScreen();
                showStatusMessage("AR özelliklerini kontrol ederken bir hata oluştu, ancak menüyü görüntüleyebilirsiniz.", 5000);
            });
    } catch (err) {
        console.error("Başlatma sırasında bir hata oluştu:", err);
        hideLoadingScreen();
        showStatusMessage("Uygulama başlatılırken bir hata oluştu. Sayfayı yenileyin.", 5000);
    }
}

// Yükleme ekranını gizle - daha güvenli bir fonksiyon
function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        document.body.style.overflow = '';
        console.log("Yükleme ekranı kapatıldı");
    } else {
        console.warn("loadingScreen elementi bulunamadı");
    }
}

// Yükleme hatası göster
function showLoadingError(message) {
    // Yükleme ekranını değiştir
    if (loadingScreen) {
        // Spinner'ı durdur
        const spinner = loadingScreen.querySelector('.spinner');
        if (spinner) spinner.style.display = 'none';
        
        // Emoji'yi değiştir
        const emoji = loadingScreen.querySelector('.loading-emoji');
        if (emoji) emoji.innerHTML = '⚠️';
        
        // Mesajı güncelle
        const text = loadingScreen.querySelector('.loading-text');
        if (text) text.textContent = message;
        
        // Yeniden dene butonu ekle
        const reloadBtn = document.createElement('button');
        reloadBtn.textContent = "Sayfayı Yenile";
        reloadBtn.style.padding = "10px 20px";
        reloadBtn.style.marginTop = "20px";
        reloadBtn.style.backgroundColor = "var(--primary)";
        reloadBtn.style.color = "white";
        reloadBtn.style.border = "none";
        reloadBtn.style.borderRadius = "8px";
        reloadBtn.style.cursor = "pointer";
        reloadBtn.onclick = () => window.location.reload();
        
        loadingScreen.appendChild(reloadBtn);
    } else {
        // Yükleme ekranı yoksa alert göster
        alert(message);
    }
}

// Show/hide loading screen with improved UX
function showLoading(show, message = "Yükleniyor...") {
    if (!loadingScreen) {
        console.warn("Loading screen elementi bulunamadı");
        return;
    }
    
    loadingScreen.style.display = show ? 'flex' : 'none';
    
    const textElement = loadingScreen.querySelector('p');
    if (textElement) {
        textElement.textContent = message;
    }
    
    // Make sure body doesn't scroll while loading
    if (show) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
    
    console.log(show ? "Yükleme ekranı gösteriliyor: " + message : "Yükleme ekranı gizlendi");
}

// Load menu items
function loadMenuItems() {
    // Load main dishes
    menuData.mainDishes.forEach(dish => {
        const dishElement = createMenuItemElement(dish);
        mainDishesContainer.appendChild(dishElement);
    });

    // Load desserts
    menuData.desserts.forEach(dessert => {
        const dessertElement = createMenuItemElement(dessert);
        dessertsContainer.appendChild(dessertElement);
    });

    // Load drinks
    menuData.drinks.forEach(drink => {
        const drinkElement = createMenuItemElement(drink);
        drinksContainer.appendChild(drinkElement);
    });
}

// Create menu item element
function createMenuItemElement(item) {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="menu-item-img" 
             onerror="this.src='https://placehold.co/220x140/eee/999?text=${encodeURIComponent(item.name)}'">
        <div class="menu-item-info">
            <div class="menu-item-title">${item.name}</div>
            <div class="menu-item-price">${item.price}</div>
            <div class="menu-item-ar">
                <i class="fas fa-cube"></i> AR'da Gör
            </div>
        </div>
    `;
    
    // Add click event to open AR view based on detected support
    const arButton = menuItem.querySelector('.menu-item-ar');
    arButton.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (arSupport === 'quicklook' && item.usdz) {
            initQuickLook(item);
        } else if (arSupport === 'webxr') {
            initWebXR(item);
        } else {
            // Fallback to model-viewer
            initModelViewer(item);
        }
    });
    
    return menuItem;
}

// Initialize AR with model-viewer (works on most browsers including iOS)
function initModelViewer(item) {
    showLoading(true, "3D Model yükleniyor...");
    
    // Create the model-viewer element if it doesn't exist
    let modelViewer = document.querySelector('model-viewer');
    if (!modelViewer) {
        modelViewer = document.createElement('model-viewer');
        modelViewer.setAttribute('id', 'ar-model-viewer');
        modelViewer.setAttribute('ar', '');
        modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('shadow-intensity', '1');
        modelViewer.setAttribute('touch-action', 'pan-y');
        modelViewer.style.width = '100%';
        modelViewer.style.height = '100%';
        
        // Add AR prompt message for better UX
        modelViewer.setAttribute('ar-status', 'not-presenting');
        
        // Listen for AR events for better user feedback
        modelViewer.addEventListener('ar-status', (event) => {
            if (event.detail.status === 'session-started') {
                showStatusMessage('AR deneyimi başlatıldı! Modeli yerleştirmek için ekrana dokunun.', 3000);
            } else if (event.detail.status === 'not-presenting') {
                console.log('AR session ended or not started');
            }
        });
        
        // Clear and add model-viewer to AR container
        arContainer.innerHTML = '';
        arContainer.appendChild(modelViewer);
    }
    
    // Set the source of model-viewer
    modelViewer.setAttribute('src', item.modelPath);
    if (item.usdz) {
        modelViewer.setAttribute('ios-src', item.usdz);
    }
    
    // Show AR container
    arContainer.style.display = 'block';
    showLoading(false);
    
    showStatusMessage("AR'ı başlatmak için ekranın altındaki AR butonuna tıklayın", 5000);
}

// Improved AR Quick Look for iOS - completely revised for better iOS compatibility
function initQuickLook(item) {
    console.log('Starting AR Quick Look for iOS with item:', item);
    
    if (!item.usdz) {
        showStatusMessage("Bu ürün için AR modeli bulunamadı. Lütfen diğer ürünleri deneyin.");
        return;
    }
    
    // Önce modelin var olup olmadığını kontrol edelim
    fetch(item.usdz)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Model dosyası bulunamadı: ${item.usdz}`);
            }
            return response;
        })
        .then(() => {
            showStatusMessage("AR deneyimi başlatılıyor... Kameranıza erişim isteklerini kabul edin.", 3000);
            
            // iOS 14+ Enhanced AR Quick Look method
            const anchor = document.createElement('a');
            anchor.setAttribute('rel', 'ar');
            anchor.setAttribute('href', item.usdz);
            
            // iOS AR attributes
            anchor.setAttribute('data-ar-scale', 'auto');
            anchor.setAttribute('data-ar-tracking', 'world');
            anchor.setAttribute('data-ar-placement', 'floor');
            
            if (item.name) {
                anchor.setAttribute('data-ar-title', item.name);
            }
            
            // Debug logging
            console.log('Created AR Quick Look anchor with href:', anchor.getAttribute('href'));
            
            // iOS 13+ requires the anchor to be in the DOM with an image child
            const img = document.createElement('img');
            img.src = item.image || 'https://placehold.co/1x1.png';
            img.style.display = 'none';
            anchor.appendChild(img);
            
            // Add to body
            document.body.appendChild(anchor);
            
            // Force a small delay before clicking to ensure DOM update
            setTimeout(() => {
                try {
                    // Log right before click for debugging
                    console.log('About to click AR link - current time:', new Date().toISOString());
                    
                    // Add a visual indicator that something is happening
                    const clickFeedback = document.createElement('div');
                    clickFeedback.style.position = 'fixed';
                    clickFeedback.style.top = '50%';
                    clickFeedback.style.left = '50%';
                    clickFeedback.style.transform = 'translate(-50%, -50%)';
                    clickFeedback.style.backgroundColor = 'rgba(0,0,0,0.7)';
                    clickFeedback.style.color = 'white';
                    clickFeedback.style.padding = '20px';
                    clickFeedback.style.borderRadius = '10px';
                    clickFeedback.style.zIndex = '9999';
                    clickFeedback.innerHTML = 'AR Açılıyor...';
                    document.body.appendChild(clickFeedback);
                    
                    // Actually launch AR
                    anchor.click();
                    console.log("AR Quick Look link clicked");
                    
                    // Remove the feedback after a brief delay
                    setTimeout(() => {
                        document.body.removeChild(clickFeedback);
                    }, 1500);
                    
                    // Add a timeout to detect if AR doesn't launch
                    setTimeout(() => {
                        showStatusMessage("AR başlatılamadı. Safari tarayıcısında olduğunuzdan emin olun.", 5000);
                    }, 3000);
                } catch (err) {
                    console.error("Error triggering AR Quick Look:", err);
                    showStatusMessage("AR başlatılamadı. Lütfen Safari tarayıcısı ile deneyin.");
                }
                
                // Remove anchor after a longer delay to ensure it's processed
                setTimeout(() => {
                    if (document.body.contains(anchor)) {
                        document.body.removeChild(anchor);
                    }
                }, 2000);
            }, 300);
        })
        .catch(error => {
            console.error("Model dosyası kontrolü sırasında hata:", error);
            showStatusMessage("Model dosyası bulunamadı. Lütfen model yollarını kontrol edin.");
            
            // Log the error details for debugging
            console.error("Model yolu:", item.usdz);
            console.error("Tam hata:", error);
        });
}

// Initialize WebXR (improved for better user feedback)
function initWebXR(menuItem) {
    showLoading(true, "AR deneyimi başlatılıyor...");
    
    // Show a camera permission message for better UX
    showStatusMessage("Kamera erişimi için izin istenecektir. Lütfen kabul edin.", 3000);
    
    // Check if WebXR is supported
    if (!navigator.xr) {
        console.log("WebXR not supported, falling back to model-viewer");
        // Fall back to model-viewer
        initModelViewer(menuItem);
        return;
    }
    
    try {
        // Set up Three.js scene
        setupThreeJsScene();
        
        // Request AR session
        navigator.xr.requestSession('immersive-ar', {
            requiredFeatures: ['hit-test', 'dom-overlay'],
            domOverlay: { root: document.getElementById('arContainer') }
        }).then(session => {
            xrSession = session;
            
            // Set up XR session
            setupXRSession(xrSession);

            // Load the 3D model
            loadModel(menuItem.modelPath);
            
            // Show AR container
            arContainer.style.display = 'block';
            
            // Show success message
            showStatusMessage("AR başlatıldı! Kameranızı düz bir yüzeye doğrultun.", 3000);
        }).catch(error => {
            console.error('Error requesting AR session:', error);
            showStatusMessage("AR oturumu başlatılamadı. Cihazınız desteklemiyor olabilir.");
            // Fall back to model-viewer
            initModelViewer(menuItem);
        });
    } catch (error) {
        console.error('Error initializing WebXR:', error);
        showStatusMessage("AR başlatılamadı. Lütfen tekrar deneyin.");
        // Fall back to model-viewer
        initModelViewer(menuItem);
    }
}

// Set up Three.js scene
function setupThreeJsScene() {
    // Create scene
    scene = new THREE.Scene();

    // Create camera
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    // Create renderer
    renderer = new THREE.WebGLRenderer({
        canvas: arCanvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    // Create lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 5, 0);
    scene.add(directionalLight);

    // Create reticle for placement
    reticle = new THREE.Mesh(
        new THREE.RingGeometry(0.15, 0.2, 32),
        new THREE.MeshBasicMaterial({
            color: 0xff6b35,
            transparent: true,
            opacity: 0.8
        })
    );
    reticle.rotation.x = -Math.PI / 2;
    reticle.visible = false;
    scene.add(reticle);
}

// Set up XR session
function setupXRSession(session) {
    // Set up reference space
    session.requestReferenceSpace('local').then((referenceSpace) => {
        session.requestHitTestSource({ space: referenceSpace }).then((source) => {
            hitTestSource = source;
        });
    });
    
    // Set up renderer with XR session
    renderer.xr.setReferenceSpaceType('local');
    renderer.xr.setSession(session);
    
    // Set up animation loop
    session.requestAnimationFrame(onXRFrame);
    
    // Event listeners for session
    session.addEventListener('end', () => {
        hitTestSourceRequested = false;
        hitTestSource = null;
        closeARSession();
    });
    
    // Tap to place model
    arCanvas.addEventListener('touchstart', placeModel);
    
    showLoading(false);
}

// Load 3D model - Fixed function with proper callback structure
function loadModel(modelPath) {
    const loader = new THREE.GLTFLoader();
    const dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
    loader.setDRACOLoader(dracoLoader);
    
    loader.load(
        modelPath,
        (gltf) => {
            currentModel = gltf.scene;
            
            // Scale and position model
            currentModel.scale.set(0.5, 0.5, 0.5);
            
            // Hide model initially until placed
            currentModel.visible = false;
            scene.add(currentModel);
            
            showStatusMessage("Modeli yerleştirmek için düz bir yüzeye kameranızı doğrultun ve ekrana dokunun.");
            showLoading(false);
        },
        (progress) => {
            const percentComplete = Math.round((progress.loaded / progress.total) * 100);
            showLoading(true, `Model yükleniyor: ${percentComplete}%`);
        },
        (error) => {
            console.error('Error loading model:', error);
            showStatusMessage("Model yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
            showLoading(false);
        }
    );
}

// Place model on tap
function placeModel() {
    if (!isModelPlaced && currentModel && reticle.visible) {
        // Set model position to reticle position
        currentModel.position.setFromMatrixPosition(reticle.matrix);
        currentModel.visible = true;
        isModelPlaced = true;
        
        // Hide reticle after placement
        reticle.visible = false;
        
        showStatusMessage("Model yerleştirildi! Döndürmek için kontrolleri kullanabilirsiniz.");
    }
}

// XR animation frame
function onXRFrame(time, frame) {
    if (!xrSession) return;
    
    // Request next frame
    xrSession.requestAnimationFrame(onXRFrame);
    
    // Get viewer pose
    const referenceSpace = renderer.xr.getReferenceSpace();
    const viewerPose = frame.getViewerPose(referenceSpace);
    
    if (viewerPose) {
        // Handle hit test
        if (!isModelPlaced && hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            
            if (hitTestResults.length > 0) {
                const hit = hitTestResults[0];
                const hitPose = hit.getPose(referenceSpace);
                
                reticle.visible = true;
                reticle.matrix.fromArray(hitPose.transform.matrix);
            } else {
                reticle.visible = false;
            }
        }
        
        // Render the scene
        renderer.render(scene, camera);
    }
}

// Close AR session
function closeARSession() {
    if (xrSession) {
        xrSession.end().then(() => {
            xrSession = null;
            
            // Clean up
            if (currentModel) {
                scene.remove(currentModel);
                currentModel = null;
            }
            
            isModelPlaced = false;
            arContainer.style.display = 'none';
        });
    }
}

// Enhanced status message with icons based on message type
function showStatusMessage(message, duration = 3000) {
    // Determine message type for appropriate icon and styling
    let icon = 'ℹ️';
    let className = 'info';
    
    if (message.toLowerCase().includes('hata') || message.toLowerCase().includes('bulunamadı')) {
        icon = '⚠️';
        className = 'warning';
    } else if (message.toLowerCase().includes('başlatıldı') || message.toLowerCase().includes('yerleştirildi')) {
        icon = '✅';
        className = 'success';
    } else if (message.toLowerCase().includes('izin')) {
        icon = '📷';
        className = 'info';
    }
    
    statusMessage.innerHTML = `<div class="alert alert-${className}"><div class="alert-emoji">${icon}</div><div>${message}</div></div>`;
    statusMessage.style.display = 'block';
    
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, duration);
}

// Check browser compatibility on startup with more detailed messages
function checkCompatibility() {
    const arInstructions = document.getElementById('arInstructions');
    
    checkARSupport().then(support => {
        console.log('AR compatibility check result:', support);
        
        if (support === 'none') {
            arInstructions.className = 'alert alert-warning';
            arInstructions.innerHTML = '<div class="alert-emoji">⚠️</div><div><strong>Uyarı:</strong> Cihazınızda AR desteği bulunamadı. Basit 3D görüntüleme kullanılacak. En iyi deneyim için iOS 12+ veya ARCore destekleyen Android 8+ cihaz kullanın.</div>';
        } else if (support === 'quicklook') {
            arInstructions.innerHTML = '<div class="alert-emoji">📱</div><div><strong>iOS AR Hazır:</strong> Yemek görsellerine tıklayarak gerçek boyutlarında görün. <a href="#" id="showInstructionsBtn" style="color: var(--primary); font-weight: 600;">Nasıl kullanılır?</a></div>';
            
            // Reattach event listener as we changed the HTML
            document.getElementById('showInstructionsBtn').addEventListener('click', (e) => {
                e.preventDefault();
                instructionsModal.style.display = 'flex';
            });
        } else if (support === 'webxr') {
            arInstructions.innerHTML = '<div class="alert-emoji">📱</div><div><strong>AR Hazır:</strong> Kameranızı kullanarak yemekleri gerçek ortamınızda görüntüleyin. <a href="#" id="showInstructionsBtn" style="color: var(--primary); font-weight: 600;">Nasıl kullanılır?</a></div>';
            
            // Reattach event listener as we changed the HTML
            document.getElementById('showInstructionsBtn').addEventListener('click', (e) => {
                e.preventDefault();
                instructionsModal.style.display = 'flex';
            });
        }
    });
}

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM yüklendi, uygulamayı başlatma...");
    
    try {
        checkCompatibility();
        init();
        
        // Zaman aşımı kontrolü - 10 saniye sonra hala yükleme ekranı açıksa otomatik kapat
        setTimeout(() => {
            if (loadingScreen && loadingScreen.style.display !== 'none') {
                console.warn("Zaman aşımı: Yükleme 10 saniye içinde tamamlanamadı, yükleme ekranı kapatılıyor");
                hideLoadingScreen();
                showStatusMessage("Yükleme zaman aşımına uğradı, ancak uygulamayı kullanabilirsiniz.", 4000);
            }
        }, 10000);
    } catch (err) {
        console.error("Başlatma sırasında kritik hata:", err);
        showLoadingError("Uygulama başlatılırken bir hata oluştu. Lütfen sayfayı yenileyin.");
    }
});

// Close AR view for WebXR or model-viewer
function closeARView() {
    if (arSupport === 'webxr' && xrSession) {
        closeARSession();
    } else {
        // For model-viewer
        arContainer.style.display = 'none';
    }
}

// Setup event listeners with improved UX - kaydırma düzeltmesi
function setupEventListeners() {
    // Show instructions modal
    showInstructionsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        instructionsModal.style.display = 'flex';
    });
    
    // Close instructions modal
    closeModalBtn.addEventListener('click', () => {
        instructionsModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    instructionsModal.addEventListener('click', (e) => {
        if (e.target === instructionsModal) {
            instructionsModal.style.display = 'none';
        }
    });
    
    // AR control buttons with haptic feedback for iOS
    rotateLeftBtn.addEventListener('click', () => {
        if (currentModel) {
            modelRotationY -= Math.PI / 8;
            currentModel.rotation.y = modelRotationY;
            
            // Add haptic feedback if supported
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }
    });
    
    rotateRightBtn.addEventListener('click', () => {
        if (currentModel) {
            modelRotationY += Math.PI / 8;
            currentModel.rotation.y = modelRotationY;
            
            // Add haptic feedback if supported
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }
    });

    resetBtn.addEventListener('click', () => {
        if (currentModel) {
            modelRotationY = 0;
            currentModel.rotation.y = 0;
            currentModel.position.set(0, 0, 0);
            isModelPlaced = false;
            
            // Add haptic feedback if supported
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate([50, 50, 50]);
            }
            
            showStatusMessage("Model sıfırlandı! Tekrar yerleştirmek için ekrana dokunun.");
        }
    });

    closeArBtn.addEventListener('click', () => {
        closeARView();
        
        // Add haptic feedback if supported
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(100);
        }
        
        showStatusMessage("AR görünümü kapatıldı.");
    });
    
    // Add instructions for AR use when clicking menu section headers
    document.querySelectorAll('.section-title').forEach(title => {
        title.addEventListener('click', () => {
            showStatusMessage("Yemeklerin AR görünümü için yemek kartındaki 'AR'da Gör' butonuna tıklayın.", 3000);
        });
    });

    // Menü sekmeleri için tıklama olayları - TEK SAYFA KAYDIRMA İÇİN DÜZENLENDİ
    const menuTabs = document.querySelectorAll('.menu-tab');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Standart link davranışını engelle
            e.preventDefault();
            
            const targetId = tab.getAttribute('data-target');
            console.log("Tıklanan sekme:", targetId);
            
            // Tüm sekmelerde active class'ı kaldır
            menuTabs.forEach(t => t.classList.remove('active'));
            
            // Tıklanan sekmeye active class'ı ekle
            tab.classList.add('active');
            
            // Hedef bölümü bul
            const targetSection = document.getElementById(targetId + 'Section');
            console.log("Hedef bölüm:", targetSection);
            
            if (targetSection) {
                // Hiçbir şeyi gizleme - sadece kaydır
                
                // Popüler için özel durum - ilk kez tıklandıysa doldur
                if (targetId === 'popular') {
                    const popularItems = document.getElementById('popularItems');
                    if (popularItems && popularItems.children.length === 0) {
                        fillPopularItems();
                    }
                }
                
                // Smooth scroll ile bölüme kaydır
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            } else {
                console.error("Hedef bölüm bulunamadı:", targetId + 'Section');
            }
        });
    });
    
    // Tekrarlı kodları kaldıralım, yukarıdaki olay yeterli
    // Bu kısmı kaldırıyoruz
    /*
    menuTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('data-target');
            
            // Tüm sekmelerde active class'ı kaldır
            menuTabs.forEach(t => t.classList.remove('active'));
            
            // Tıklanan sekmeye active class'ı ekle
            tab.classList.add('active');
            
            // İlgili bölüme kaydır
            const targetSection = document.querySelector(`.menu-section[data-category="${targetId}"]`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    */
    
    // Bu kısmı da kaldırıyoruz, yukarıdaki tıklama olayı görevini görüyor
    /*
    // Menü sekmeleri için sadece kaydırma işlevselliği
    menuTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            // Standart link davranışını engelleme
            e.preventDefault();
            
            // Tıklanan sekmeyi aktif yap
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Hedef bölümü bul ve kaydır
            const targetId = tab.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smooth scroll ile bölüme kaydır
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    */
    
    // Yukarı çık butonu oluştur ve ekle
    createBackToTopButton();
    
    // Sayfa kaydırma olayını dinle
    window.addEventListener('scroll', handleScroll);
    
    // Menü sekmeleri için kaydırma işlevi
    menuTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = tab.getAttribute('data-target');
            
            // Tüm sekmelerde active class'ı kaldır
            menuTabs.forEach(t => t.classList.remove('active'));
            
            // Tıklanan sekmeye active class'ı ekle
            tab.classList.add('active');
            
            // İlgili bölüme kaydır
            const targetSection = document.querySelector(`.menu-section[data-category="${targetId}"]`);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Yukarı çık butonu için scroll dinleyici
    window.addEventListener('scroll', handleScroll);
    
    // Yukarı çık butonuna tıklama
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        backToTopButton.addEventListener('click', () => {
            // Sayfanın en üstüne yumuşak şekilde kaydır
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Sayfa kaydırıldığında çalışacak işlev
function handleScroll() {
    const backToTopButton = document.getElementById('backToTop');
    
    // 300px'den fazla aşağı kaydırıldığında yukarı çıkma butonunu göster
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
    
    // Performans için throttle mekanizması ekleyelim
    // Bu sayede çok fazla hesaplama yapmayız
    if (!handleScroll.ticking) {
        window.requestAnimationFrame(() => {
            updateActiveTabOnScroll();
            handleScroll.ticking = false;
        });
        handleScroll.ticking = true;
    }
}
handleScroll.ticking = false;

// Kaydırma pozisyonuna göre aktif sekmeleri güncelle - İyileştirilmiş orantılı görünürlük
function updateActiveTabOnScroll() {
    const sections = document.querySelectorAll('.menu-section');
    const menuTabs = document.querySelectorAll('.menu-tab');
    
    // Viewport yüksekliği
    const viewportHeight = window.innerHeight;
    const scrollPosition = window.scrollY;
    
    // Hangi bölümün en iyi şekilde görünür olduğunu hesapla
    let maxVisibleSection = null;
    let maxVisiblePercentage = 0;
    
    sections.forEach(section => {
        // Bölümün pozisyon ve boyutu
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionBottom = sectionTop + sectionHeight;
        
        // Viewport'un altı ve üstü
        const viewportTop = scrollPosition;
        const viewportBottom = scrollPosition + viewportHeight;
        
        // Bölüm başlangıcı daha fazla önceliğe sahip olması için
        // bölümün üst kısmına daha fazla ağırlık verelim
        const visibleTop = Math.max(sectionTop, viewportTop);
        const visibleBottom = Math.min(sectionBottom, viewportBottom);
        
        // Görünür yükseklik
        let visibleHeight = visibleBottom - visibleTop;
        
        // Negatif değer olmamalı
        visibleHeight = Math.max(0, visibleHeight);
        
        // Bölümün başlangıcı viewport'ta görünüyorsa daha fazla ağırlık ver
        const isHeaderVisible = (sectionTop >= viewportTop && sectionTop <= viewportBottom);
        const headerBonus = isHeaderVisible ? viewportHeight * 0.2 : 0;
        
        // Görünürlük yüzdesi (bölüm başlangıcına bonus ekle)
        const visiblePercentage = (visibleHeight + headerBonus) / sectionHeight;
        
        // En fazla görünür olan bölümü bul
        if (visiblePercentage > maxVisiblePercentage) {
            maxVisiblePercentage = visiblePercentage;
            maxVisibleSection = section;
        }
        
        // Hata ayıklama amaçlı
        console.log(`Bölüm: ${section.id}, Görünürlük: ${Math.round(visiblePercentage * 100)}%`);
    });
    
    // En çok görünür olan bölüme göre sekmeleri aktifleştir
    if (maxVisibleSection) {
        const categoryId = maxVisibleSection.id.replace('Section', '');
        
        menuTabs.forEach(tab => {
            if (tab.getAttribute('data-target') === categoryId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }
}

// Popüler ürünleri sayfa yüklendiğinde doldur
function loadPopularItems() {
    const popularItemsContainer = document.getElementById('popularItems');
    if (!popularItemsContainer) return;
    
    // Tüm kategorilerden popüler öğeleri topla
    const allPopularItems = [];
    
    // Ana yemeklerden popüler olanlar
    menuData.mainDishes.forEach(item => {
        if (item.isPopular || (item.rating && item.rating >= 4.5)) {
            allPopularItems.push(item);
        }
    });
    
    // Tatlılardan popüler olanlar
    menuData.desserts.forEach(item => {
        if (item.isPopular || (item.rating && item.rating >= 4.5)) {
            allPopularItems.push(item);
        }
    });
    
    // İçeceklerden popüler olanlar
    menuData.drinks.forEach(item => {
        if (item.isPopular || (item.rating && item.rating >= 4.5)) {
            allPopularItems.push(item);
        }
    });
    
    // Eğer popüler ürün yoksa rastgele öğeler ekle
    if (allPopularItems.length === 0) {
        if (menuData.mainDishes.length > 0) allPopularItems.push(menuData.mainDishes[0]);
        if (menuData.desserts.length > 0) allPopularItems.push(menuData.desserts[0]);
        if (menuData.drinks.length > 0) allPopularItems.push(menuData.drinks[0]);
    }
    
    // Popüler öğeleri konteyner'a ekle
    allPopularItems.forEach(item => {
        const itemElement = createMenuItemElement(item);
        popularItemsContainer.appendChild(itemElement);
    });
}

// Popüler ürünleri göster - işlevi yeniden tanımlanıyor
function fillPopularItems() {
    console.log("Popüler ürünler dolduruluyor...");
    const popularItemsContainer = document.getElementById('popularItems');
    
    if (!popularItemsContainer) {
        console.error("popularItems konteyneri bulunamadı!");
        return;
    }
    
    // Eğer popüler öğeler zaten doldurulmuşsa tekrar doldurma
    if (popularItemsContainer.children.length > 0) {
        console.log("Popüler öğeler zaten doldurulmuş.");
        return;
    }
    
    // Tüm kategorilerden popüler öğeleri topla
    let popularItems = [];
    
    // Ana yemekler, tatlılar ve içeceklerden popüler ürünleri topla
    try {
        for (const category in menuData) {
            menuData[category].forEach(item => {
                if (item.isPopular || (item.rating && item.rating >= 4.5)) {
                    popularItems.push(item);
                }
            });
        }
        
        // Eğer popüler ürün bulamazsak her kategoriden bir ürün ekleyelim
        if (popularItems.length === 0) {
            if (menuData.mainDishes && menuData.mainDishes.length > 0) {
                popularItems.push(menuData.mainDishes[0]);
            }
            if (menuData.desserts && menuData.desserts.length > 0) {
                popularItems.push(menuData.desserts[0]);
            }
            if (menuData.drinks && menuData.drinks.length > 0) {
                popularItems.push(menuData.drinks[0]);
            }
        }
        
        console.log("Bulunan popüler öğeler:", popularItems.length);
        
        // Popüler öğeleri konteyner'a ekle
        popularItems.forEach(item => {
            const itemElement = createMenuItemElement(item);
            popularItemsContainer.appendChild(itemElement);
        });
    } catch (error) {
        console.error("Popüler öğeler doldurulurken hata:", error);
    }
}

// showPopularItems fonksiyonunu fillPopularItems ile değiştirmek için eski fonksiyonu da tanımlayalım
// bu şekilde hata vermez, eski bir fonksiyon çağrısı varsa fillPopularItems'ı çalıştırır
function showPopularItems() {
    console.warn("showPopularItems kullanımı eski, fillPopularItems kullanılmalı");
    fillPopularItems();
}