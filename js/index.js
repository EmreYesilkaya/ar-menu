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

// Dosya yollarını bulma ve doğrulama için yardımcı fonksiyon
function resolveAssetPath(relativePath) {
    // Tarayıcıda tam URL'yi oluştur
    const basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
    const fullPath = new URL(relativePath, basePath).href;
    
    console.log(`Asset yolu dönüştürüldü: ${relativePath} => ${fullPath}`);
    return relativePath; // Göreceli yol döndür, fetch kendisi taban URL ekleyecektir
}

// Menu data - Path correction for kofte.glb file
const menuData = {
    mainDishes: [
        { 
          id: 1, 
          name: 'Izgara Köfte', 
          price: '120 TL', 
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Köfte', 
          // Modelin model-test'te çalışan tam yolunu kullan - çok önemli!
          modelPath: 'models/kofte.glb',  
          usdz: 'models/kofte.usdz',
          // Alternatif yolları çalışma önceliğine göre düzenleyelim
          modelAlternates: ['models/kofte.glb', './models/kofte.glb', '/models/kofte.glb', 'assets/models/kofte.glb']
        },
        { 
          id: 2, 
          name: 'Karışık Izgara', 
          price: '180 TL', 
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Karışık', 
          modelPath: './models/karisik.glb', 
          usdz: './models/karisik.usdz'
        },
        { 
          id: 3, 
          name: 'Tavuk Şiş', 
          price: '140 TL', 
          image: 'https://placehold.co/220x140/e8e0d5/333?text=Tavuk+Şiş', 
          modelPath: './models/tavuk_sis.glb',
          usdz: './models/tavuk_sis.usdz'
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
    
    // Tutorial'ı gösterme kontrolü ekleyelim (ek güvenlik için)
    ensureTutorialCheck();
    
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

// Tutorial gösteriminin kontrol edildiğinden emin ol
function ensureTutorialCheck() {
    if (typeof window.checkFirstVisit === 'function') {
        console.log('Tutorial fonksiyonu bulundu, çağrılıyor...');
        window.checkFirstVisit();
    } else {
        console.log('Tutorial fonksiyonu bulunamadı, alternatif yükleme deneniyor...');
        
        // Tutorial.js yüklenmediyse veya fonksiyona erişilemiyorsa
        if (document.getElementById('instructionsModal')) {
            const tutorialShown = localStorage.getItem('ar_tutorial_shown');
            if (!tutorialShown) {
                console.log('Tutorial manuel olarak gösteriliyor');
                document.getElementById('instructionsModal').style.display = 'flex';
                localStorage.setItem('ar_tutorial_shown', 'true');
            }
        }
    }
}

// Yükleme ekranını gizle - PopupManager kullanılarak güncellendi
function hideLoadingScreen() {
    if (window.PopupManager) {
        window.PopupManager.hideLoading();
    } else {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            document.body.style.overflow = '';
            console.log("Yükleme ekranı kapatıldı");
        } else {
            console.warn("loadingScreen elementi bulunamadı");
        }
    }
}

// Yükleme hatası göster - PopupManager kullanılarak güncellendi
function showLoadingError(message) {
    if (window.PopupManager) {
        window.PopupManager.showLoadingError(message);
    } else {
        // Eski yöntem için kod korundu
        if (loadingScreen) {
            const spinner = loadingScreen.querySelector('.spinner');
            if (spinner) spinner.style.display = 'none';
            
            const emoji = loadingScreen.querySelector('.loading-emoji');
            if (emoji) emoji.innerHTML = '⚠️';
            
            const text = loadingScreen.querySelector('.loading-text');
            if (text) text.textContent = message;
            
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
            alert(message);
        }
    }
}

// Show/hide loading screen - PopupManager kullanılarak güncellendi
function showLoading(show, message = "Yükleniyor...") {
    if (window.PopupManager) {
        if (show) {
            window.PopupManager.showLoading(message);
        } else {
            window.PopupManager.hideLoading();
        }
        return;
    }
    
    // Eski yöntem için kod korundu
    if (!loadingScreen) {
        console.warn("Loading screen elementi bulunamadı");
        return;
    }
    
    loadingScreen.style.display = show ? 'flex' : 'none';
    
    const textElement = loadingScreen.querySelector('p');
    if (textElement) {
        textElement.textContent = message;
    }
    
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
    
    // Extract model name for debugging
    const modelName = item.modelPath.split('/').pop().replace('.glb', '');
    console.log(`Trying to load model for: ${item.name} (${modelName})`);
    
    // Köfte modeli için özel işlem yapalım (model-test.html'de çalıştığını bildiğimiz)
    if (modelName === 'kofte') {
        console.log("Köfte modeli için özel yükleme işlevi kullanılıyor...");
        hideLoadingScreen(); // Önce mevcut yükleme ekranını kapat
        
        // Özelleştirilmiş yükleme işlevini çağır
        if (window.directLoadModel) {
            window.directLoadModel('kofte');
        } else {
            console.error("directLoadModel fonksiyonu bulunamadı!");
            showStatusMessage("Model yükleme kodu bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.", 4000);
        }
        return;
    }
    
    // Use our debug function which tries all possible paths
    if (window.debugARModel) {
        window.debugARModel(modelName);
        return;
    }
    
    // If debug function is not available, try with standard approach
    const modelPath = resolveAssetPath(item.modelPath);
    console.log("Attempting to load model from:", modelPath);
    
    // First check if the file exists
    fetch(modelPath, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                console.warn(`Primary model path failed: ${modelPath}`);
                throw new Error(`Model not found at primary path: ${modelPath}`);
            }
            return actuallyLoadModel(modelPath, item);
        })
        .catch(error => {
            console.error("Primary model path error:", error);
            
            // Try alternatives in a sequential manner
            tryAlternativePaths(item);
        });
}

// New function to try alternative model paths
function tryAlternativePaths(item) {
    console.log("Trying alternative model paths");
    
    // Collect all possible paths to try
    const pathsToTry = [
        item.modelPath,
        // Check if we have alternates defined
        ...(item.modelAlternates || []),
        // Add common fallbacks
        'models/kofte.glb',
        './models/kofte.glb',
        '/models/kofte.glb',
        'assets/models/kofte.glb',
        './assets/models/kofte.glb'
    ];
    
    // Try paths one by one
    let currentPathIndex = 0;
    
    function tryNextPath() {
        if (currentPathIndex >= pathsToTry.length) {
            console.error("All model paths failed!");
            showModelError(item.modelPath, "Could not find model file in any location");
            showLoading(false);
            return;
        }
        
        const currentPath = pathsToTry[currentPathIndex];
        console.log(`Trying path ${currentPathIndex + 1}/${pathsToTry.length}: ${currentPath}`);
        
        fetch(currentPath, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    console.log(`✅ Found working model path: ${currentPath}`);
                    actuallyLoadModel(currentPath, item);
                } else {
                    console.log(`❌ Path failed: ${currentPath}`);
                    currentPathIndex++;
                    tryNextPath();
                }
            })
            .catch(error => {
                console.log(`❌ Path error: ${currentPath}`, error);
                currentPathIndex++;
                tryNextPath();
            });
    }
    
    // Start trying paths
    tryNextPath();
}

// Helper function to actually load the model once path is verified
function actuallyLoadModel(modelPath, item) {
    console.log(`✓ Loading model from verified path: ${modelPath}`);
    
    // Get or create model-viewer element
    let modelViewer = document.querySelector('model-viewer');
    if (!modelViewer) {
        console.log("Creating new model-viewer element");
        modelViewer = document.createElement('model-viewer');
        modelViewer.setAttribute('id', 'ar-model-viewer');
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('shadow-intensity', '1');
        modelViewer.setAttribute('ar', ''); 
        modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
        modelViewer.setAttribute('ar-scale', 'auto');
        modelViewer.setAttribute('touch-action', 'pan-y');
        modelViewer.style.width = '100%';
        modelViewer.style.height = '100%';
        modelViewer.style.backgroundColor = '#f2f2f7';
        
        // Add exit button
        const exitButton = document.createElement('button');
        exitButton.slot = 'exit-button';
        exitButton.textContent = 'Kapat ×';
        exitButton.style.backgroundColor = 'var(--danger)';
        exitButton.style.color = 'white';
        exitButton.style.borderRadius = '8px';
        exitButton.style.border = 'none';
        exitButton.style.padding = '8px 12px';
        exitButton.style.position = 'absolute';
        exitButton.style.top = '10px';
        exitButton.style.right = '10px';
        exitButton.style.zIndex = '100';
        exitButton.onclick = closeARView;
        modelViewer.appendChild(exitButton);
        
        // Error tracking
        modelViewer.addEventListener('error', (error) => {
            console.error('Model-viewer loading error:', error);
            document.getElementById('model-error').style.display = 'block';
            document.getElementById('model-error-details').textContent = 
                `Full path: ${modelPath}\nError: ${error.target.error || 'Unknown error'}`;
            
            showStatusMessage("Model loading failed: " + modelPath, 5000);
        });
        
        // Load tracking
        modelViewer.addEventListener('load', () => {
            console.log('Model loaded successfully');
            showStatusMessage("Model loaded! Drag to rotate the 3D model.", 3000);
            document.getElementById('model-error').style.display = 'none';
        });
        
        // Clear and add model-viewer to AR container
        const arContainer = document.getElementById('arContainer');
        arContainer.innerHTML = '';
        arContainer.appendChild(modelViewer);
    }
    
    // Set the source of model-viewer
    modelViewer.setAttribute('src', modelPath);
    if (item.usdz) {
        const usdzPath = modelPath.replace('.glb', '.usdz');
        modelViewer.setAttribute('ios-src', usdzPath);
    }
    
    // Show AR container and hide loading screen
    document.getElementById('arContainer').style.display = 'block';
    showLoading(false);
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

// Enhanced status message - PopupManager kullanılarak güncellendi
function showStatusMessage(message, duration = 3000) {
    if (window.PopupManager) {
        window.PopupManager.showStatusMessage(message, duration);
        return;
    }
    
    // Eski yöntem için kod korundu
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
        
        // Tutorial gösterim kontrolü ekle
        setTimeout(function() {
            if (typeof window.checkFirstVisit === 'function' && 
                !localStorage.getItem('ar_tutorial_shown')) {
                window.checkFirstVisit();
            }
        }, 1000); // 1 saniye sonra tekrar kontrol et
        
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

/**
 * AR Menü Uygulaması - Ana JavaScript Dosyası
 * - Menü öğelerinin dinamik olarak yüklenmesi
 * - AR deneyimi için etkileşimlerin yönetimi
 * - Zenginleştirilmiş menü öğeleri ve kategoriler
 */

// Sayfa yüklenmesi tamamlandığında çalışacak
document.addEventListener('DOMContentLoaded', function() {
    console.log('AR Menü uygulaması başlatılıyor...');
    
    // Menü öğelerini yükle
    loadMenuItems();
    
    // Menü sekmesi değişikliklerini yönet
    setupTabNavigation();
    
    // Sayfa kaydırma olaylarını yönet
    setupScrollEvents();
});

// Menü öğelerini yükle
function loadMenuItems() {
    // Tüm menü öğeleri
    const menuData = {
        // ANA YEMEKLER
        mainDishes: [
            {
                id: 'kofte',
                name: 'Izgara Köfte',
                description: 'Özel baharatlarla hazırlanmış el yapımı ızgara köfte',
                price: 85,
                rating: 4.5,
                ratingCount: 124,
                image: '/api/placeholder/220/140',
                tags: ['popular', 'meat'],
                modelPath: 'assets/models/kofte.glb',
                allergens: ['gluten']
            },
            {
                id: 'tavuk_sis',
                name: 'Baharatlı Tavuk Şiş',
                description: 'Özel marine edilmiş baharatlı tavuk şiş',
                price: 75,
                rating: 4.0,
                ratingCount: 86,
                image: '/api/placeholder/220/140',
                tags: ['spicy', 'chicken'],
                modelPath: 'models/tavuk_sis.glb',
                allergens: []
            },
            {
                id: 'karisik_izgara',
                name: 'Karışık Izgara',
                description: 'Kuzu pirzola, köfte, tavuk şiş ve dana bonfileden oluşan karışık ızgara',
                price: 140,
                rating: 4.8,
                ratingCount: 156,
                image: '/api/placeholder/220/140',
                tags: ['popular', 'meat'],
                modelPath: 'models/karisik.glb',
                allergens: []
            },
            {
                id: 'adana',
                name: 'Adana Kebap',
                description: 'Geleneksel tarifle hazırlanan acılı Adana kebap',
                price: 90,
                rating: 4.7,
                ratingCount: 112,
                image: '/api/placeholder/220/140',
                tags: ['spicy', 'meat', 'popular'],
                modelPath: 'models/adana.glb',
                allergens: []
            },
            {
                id: 'veggie_burger',
                name: 'Vegan Burger',
                description: 'Nohut köftesi, avokado ve taze sebzelerden hazırlanan vegan burger',
                price: 70,
                rating: 4.6,
                ratingCount: 82,
                image: '/api/placeholder/220/140',
                tags: ['vegan', 'popular'],
                modelPath: 'models/veggie_burger.glb',
                allergens: ['soy']
            },
            {
                id: 'patlican',
                name: 'Patlıcan Musakka',
                description: 'Fırında pişirilmiş ve beşamel soslu patlıcan musakka',
                price: 65,
                rating: 4.2,
                ratingCount: 64,
                image: '/api/placeholder/220/140',
                tags: ['vegetarian'],
                modelPath: 'models/musakka.glb',
                allergens: ['milk', 'gluten']
            }
        ],
        
        // TATLILAR
        desserts: [
            {
                id: 'kunefe',
                name: 'Künefe',
                description: 'Özel kadayıf ve eritilmiş peynir üzerine Antep fıstıklı künefe',
                price: 65,
                rating: 5.0,
                ratingCount: 210,
                image: '/api/placeholder/220/140',
                tags: ['popular', 'hot'],
                modelPath: 'models/kunefe.glb',
                allergens: ['milk', 'nuts']
            },
            {
                id: 'baklava',
                name: 'Antep Fıstıklı Baklava',
                description: '40 kat el açma yufka ile hazırlanmış geleneksel Antep fıstıklı baklava',
                price: 75,
                rating: 4.9,
                ratingCount: 185,
                image: '/api/placeholder/220/140',
                tags: ['popular', 'nuts'],
                modelPath: 'models/baklava.glb',
                allergens: ['nuts', 'gluten']
            },
            {
                id: 'sutlac',
                name: 'Fırın Sütlaç',
                description: 'Fırında karamelize edilmiş geleneksel sütlaç',
                price: 40,
                rating: 4.4,
                ratingCount: 96,
                image: '/api/placeholder/220/140',
                tags: ['vegetarian'],
                modelPath: 'models/sutlac.glb',
                allergens: ['milk']
            },
            {
                id: 'kazandibi',
                name: 'Kazandibi',
                description: 'Geleneksel yöntemle hazırlanmış karamelize tatlı',
                price: 45,
                rating: 4.6,
                ratingCount: 102,
                image: '/api/placeholder/220/140',
                tags: ['vegetarian'],
                modelPath: 'models/kazandibi.glb',
                allergens: ['milk', 'eggs']
            },
            {
                id: 'vegan_cheesecake',
                name: 'Vegan Çilekli Cheesecake',
                description: 'Kaju bazlı vegan cheesecake, çilek sosu ile servis edilir',
                price: 55,
                rating: 4.7,
                ratingCount: 78,
                image: '/api/placeholder/220/140',
                tags: ['vegan', 'raw'],
                modelPath: 'models/vegan_cake.glb',
                allergens: ['nuts']
            }
        ],
        
        // İÇECEKLER
        drinks: [
            {
                id: 'ayran',
                name: 'Ayran',
                description: 'Geleneksel ev yapımı ayran',
                price: 15,
                rating: 4.2,
                ratingCount: 92,
                image: '/api/placeholder/220/140',
                tags: [],
                modelPath: 'models/ayran.glb',
                allergens: ['milk']
            },
            {
                id: 'turkish_coffee',
                name: 'Türk Kahvesi',
                description: 'Geleneksel yöntemle pişirilmiş Türk kahvesi, lokum ile servis edilir',
                price: 25,
                rating: 4.8,
                ratingCount: 156,
                image: '/api/placeholder/220/140',
                tags: ['popular'],
                modelPath: 'models/kahve.glb',
                allergens: []
            },
            {
                id: 'sahlep',
                name: 'Tarçınlı Sahlep',
                description: 'Geleneksel kış içeceği, tarçın ve fındık ile servis edilir',
                price: 30,
                rating: 4.5,
                ratingCount: 78,
                image: '/api/placeholder/220/140',
                tags: ['hot', 'seasonal'],
                modelPath: 'models/sahlep.glb',
                allergens: ['milk', 'nuts']
            },
            {
                id: 'fresh_orange',
                name: 'Taze Sıkılmış Portakal Suyu',
                description: '100% taze sıkılmış portakal suyu',
                price: 25,
                rating: 4.7,
                ratingCount: 104,
                image: '/api/placeholder/220/140',
                tags: ['vegan', 'fresh'],
                modelPath: 'models/orange_juice.glb',
                allergens: []
            },
            {
                id: 'limonata',
                name: 'Ev Yapımı Limonata',
                description: 'Taze sıkılmış limon ve nane yaprakları ile hazırlanmış limonata',
                price: 20,
                rating: 4.6,
                ratingCount: 112,
                image: '/api/placeholder/220/140',
                tags: ['vegan', 'fresh', 'popular'],
                modelPath: 'models/limonata.glb',
                allergens: []
            },
            {
                id: 'coconut_smoothie',
                name: 'Hindistan Cevizi Smoothie',
                description: 'Hindistan cevizi sütü ve muz ile hazırlanmış ferahlatıcı içecek',
                price: 35,
                rating: 4.4,
                ratingCount: 64,
                image: '/api/placeholder/220/140',
                tags: ['vegan'],
                modelPath: 'models/coconut_smoothie.glb',
                allergens: ['nuts']
            }
        ]
    };
    
    // Popüler ürünleri filtrele
    const popularItems = [
        ...menuData.mainDishes.filter(item => item.tags.includes('popular')),
        ...menuData.desserts.filter(item => item.tags.includes('popular')),
        ...menuData.drinks.filter(item => item.tags.includes('popular'))
    ];
    
    // Ana yemekleri yükle
    renderMenuItems(menuData.mainDishes, 'mainDishes');
    
    // Tatlıları yükle
    renderMenuItems(menuData.desserts, 'desserts');
    
    // İçecekleri yükle
    renderMenuItems(menuData.drinks, 'drinks');
    
    // Popüler ürünleri yükle
    renderMenuItems(popularItems, 'popularItems');
    
    // AR butonları için olay dinleyicileri ekle
    setupARButtons();
}

// Menü öğelerini HTML'e render et
function renderMenuItems(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container not found: ${containerId}`);
        return;
    }
    
    container.innerHTML = ''; // Container'ı temizle
    
    items.forEach(item => {
        // Etiketleri oluştur
        let tagHtml = '';
        if (item.tags.includes('popular')) {
            tagHtml += `<span class="food-tag tag-popular">🔥 Popüler</span>`;
        }
        if (item.tags.includes('vegan')) {
            tagHtml += `<span class="food-tag tag-vegan">🥗 Vegan</span>`;
        }
        if (item.tags.includes('spicy')) {
            tagHtml += `<span class="food-tag tag-spicy">🌶️ Acılı</span>`;
        }
        if (item.tags.includes('vegetarian')) {
            tagHtml += `<span class="food-tag tag-vegetarian">🥕 Vejetaryen</span>`;
        }
        
        // Yıldız derecelendirmesi oluştur
        let ratingHtml = '';
        const fullStars = Math.floor(item.rating);
        const hasHalfStar = item.rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            ratingHtml += `<i class="fas fa-star"></i>`;
        }
        
        if (hasHalfStar) {
            ratingHtml += `<i class="fas fa-star-half-alt"></i>`;
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            ratingHtml += `<i class="far fa-star"></i>`;
        }
        
        // Menü öğesi HTML'i oluştur
        const menuItemHtml = `
            <div class="menu-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="menu-item-img">
                <div class="menu-item-info">
                    <div>
                        ${tagHtml}
                    </div>
                    <h3 class="menu-item-title">${item.name}</h3>
                    <p class="menu-item-description">${item.description}</p>
                    <div class="rating">
                        ${ratingHtml}
                        <span>${item.rating}</span>
                        <span class="rating-count">(${item.ratingCount})</span>
                    </div>
                    <p class="menu-item-price">₺${item.price} <span style="font-size: 1.2rem;">💰</span></p>
                    <div class="menu-item-ar" data-model="${item.modelPath}">
                        <i class="fas fa-cube"></i> AR'da Gör
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += menuItemHtml;
    });
    
    // Yukarıdaki kod menü öğelerini sayfaya ekliyor
    console.log(`${items.length} adet öğe ${containerId} içine yüklendi.`);
}

// Menü sekmeleri için navigasyon işlevini ayarla
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.menu-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Aktif sekmeyi güncelle
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Hedef bölüme kaydır
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Header yüksekliği
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll olaylarını yönet
function setupScrollEvents() {
    // Yukarı çıkma butonu
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Sticky menü
    const menuTabs = document.querySelector('.menu-tabs-container');
    if (menuTabs) {
        const stickyOffset = menuTabs.offsetTop;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > stickyOffset) {
                menuTabs.classList.add('sticky');
            } else {
                menuTabs.classList.remove('sticky');
            }
        });
    }
}

// AR butonları için olay dinleyicilerini ayarla
function setupARButtons() {
    const arButtons = document.querySelectorAll('.menu-item-ar');
    
    arButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modelPath = this.getAttribute('data-model');
            if (modelPath) {
                showARView(modelPath);
            } else {
                console.error('Model yolu bulunamadı');
                // Hata bildir
                if (window.PopupManager) {
                    window.PopupManager.showStatusMessage('⚠️ Bu ürün için AR modeli bulunamadı.');
                }
            }
        });
    });
}

// AR görünümünü aç
function showARView(modelPath) {
    console.log(`AR görünümü açılıyor: ${modelPath}`);
    
    // AR konteynerini göster
    const arContainer = document.getElementById('arContainer');
    if (!arContainer) return;
    
    arContainer.style.display = 'block';
    
    // Model-viewer ile modeli yükle
    loadARModel(modelPath);
}

// AR modelini yükle
function loadARModel(modelPath) {
    // Bu fonksiyon içeriği başka bir dosyada olabilir
    console.log(`Model yükleniyor: ${modelPath}`);
    // AR modelini yükleme kodları burada olacak
}

// AR görünümünü kapat
window.closeARView = function() {
    const arContainer = document.getElementById('arContainer');
    if (arContainer) {
        arContainer.style.display = 'none';
    }
};

// Eksik showModelError fonksiyonu ekleniyor
function showModelError(modelPath, errorMessage) {
    console.error(`Model error: ${errorMessage} (${modelPath})`);
    
    // Model error elementini göster
    const modelError = document.getElementById('model-error');
    if (modelError) {
        modelError.style.display = 'block';
        
        // Hata detaylarını göster
        const errorDetails = document.getElementById('model-error-details');
        if (errorDetails) {
            errorDetails.textContent = `Yol: ${modelPath}\nHata: ${errorMessage}`;
        }
    }
    
    // Kullanıcıya bildirim göster
    showStatusMessage(`Model yüklenemedi: ${errorMessage}`, 5000);
}

// createBackToTopButton fonksiyonu eksik, ekleniyor
function createBackToTopButton() {
    // Eğer buton zaten varsa, tekrar oluşturma
    if (document.getElementById('backToTop')) return;
    
    // Yukarı çık butonu oluştur
    const backToTopBtn = document.createElement('div');
    backToTopBtn.id = 'backToTop';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    
    // HTML'e ekle
    document.body.appendChild(backToTopBtn);
    
    // Tıklama olayı
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    console.log("Yukarı çık butonu oluşturuldu");
}