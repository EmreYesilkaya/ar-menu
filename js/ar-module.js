/**
 * AR Menü Uygulaması - Birleştirilmiş AR Modülü
 * Tüm AR işlevlerini tek bir modüler yapıda toplar.
 * 
 * Özellikler:
 * - AR teknolojisi otomatik tespiti (WebXR, QuickLook, model-viewer)
 * - Model yükleme ve görüntüleme
 * - Etkileşim kontrolleri (döndürme, paylaşım, vb.)
 * - Hata yönetimi ve düzeltmeler
 * - Paylaşım özellikleri
 * - Özel model işleme (köfte vb.)
 */

// Modülü IIFE (Immediately Invoked Function Expression) ile tanımlayalım
const ARModule = (function() {
    // Private değişkenler
    let arSupport = 'none'; // 'webxr', 'quicklook', 'none'
    let currentModel = null;
    let xrSession = null;
    let scene, camera, renderer;
    let hitTestSource = null;
    let hitTestSourceRequested = false;
    let reticle;
    let isModelPlaced = false;
    let modelRotationY = 0;
    let arContainer, arCanvas, modelViewer;
    let statusCallback = null;
    let errorCallback = null;
    let currentModelInfo = null;
    let shareEnabled = true;
    
    // AR konteyneri ve kontrolleri bul
    function initARElements() {
        arContainer = document.getElementById('arContainer');
        arCanvas = document.getElementById('ar-canvas');
        
        // Kontroller
        const rotateLeftBtn = document.getElementById('rotateLeftBtn');
        const rotateRightBtn = document.getElementById('rotateRightBtn');
        const resetBtn = document.getElementById('resetBtn');
        const closeArBtn = document.getElementById('closeArBtn');
        
        // Kontrol olaylarını bağla
        if (rotateLeftBtn) {
            rotateLeftBtn.addEventListener('click', rotateModelLeft);
        }
        
        if (rotateRightBtn) {
            rotateRightBtn.addEventListener('click', rotateModelRight);
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', resetModel);
        }
        
        if (closeArBtn) {
            closeArBtn.addEventListener('click', closeARView);
        }
        
        // Paylaşım düğmesi kontrolü
        const shareBtn = document.getElementById('shareArBtn');
        if (shareBtn && shareEnabled) {
            shareBtn.addEventListener('click', takeScreenshotAndShare);
        }
    }
    
    // AR teknolojisi tespiti
    function checkARSupport() {
        // iOS cihazları tespit et
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        console.log('AR teknolojisi tespiti:', { isIOS, isSafari, userAgent: navigator.userAgent });
        
        // iOS cihazlar için AR Quick Look'u önceliklendir
        if (isIOS) {
            console.log('iOS cihaz tespit edildi, AR Quick Look kullanılacak');
            arSupport = 'quicklook';
            return Promise.resolve('quicklook');
        }
        
        // WebXR desteğini kontrol et
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
    
    // Model viewer ile AR modeli gösterme
    function initModelViewer(item) {
        currentModelInfo = item;
        showStatus("3D Model yükleniyor...", true);
        
        // Model adını çıkar
        const modelPath = item.modelPath;
        const modelName = modelPath.split('/').pop().replace('.glb', '');
        console.log(`Model yükleniyor: ${item.name} (${modelName})`);
        
        // Köfte modeli için özel işlem
        if (modelName === 'kofte') {
            console.log("Köfte modeli için özel işlem uygulanıyor");
            hideStatus();
            directLoadModel('kofte');
            return;
        }
        
        // Modeli yükle ve konteynere ekle
        loadAndDisplayModel(modelPath, item);
    }
    
    // Modeli yükle ve göster
    function loadAndDisplayModel(modelPath, item) {
        console.log("Model yolunu doğrulamaya başlıyorum:", modelPath);
        
        // Önce dosyanın varlığını kontrol et
        fetch(modelPath, { method: 'HEAD' })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Model bulunamadı: ${modelPath}`);
                }
                return displayModel(modelPath, item);
            })
            .catch(error => {
                console.warn("İlk yol başarısız:", error);
                
                // Alternatif yolları dene
                tryAlternativePaths(item);
            });
    }
    
    // Alternatif model yollarını dene
    function tryAlternativePaths(item) {
        console.log("Alternatif model yolları deneniyor");
        
        // Denenecek yollar
        const pathsToTry = [
            item.modelPath,
            ...(item.modelAlternates || []),
            `models/${item.id || item.name.toLowerCase().replace(/\s+/g, '_')}.glb`,
            `./models/${item.id || item.name.toLowerCase().replace(/\s+/g, '_')}.glb`,
            'models/kofte.glb',
            './models/kofte.glb',
            '/models/kofte.glb',
            'assets/models/kofte.glb',
            './assets/models/kofte.glb'
        ];
        
        // Yolları tek tek dene
        let currentPathIndex = 0;
        
        function tryNextPath() {
            if (currentPathIndex >= pathsToTry.length) {
                console.error("Hiçbir model yolu çalışmadı!");
                showError(item.modelPath, "Hiçbir konumda model dosyası bulunamadı");
                hideStatus();
                return;
            }
            
            const currentPath = pathsToTry[currentPathIndex];
            console.log(`Yol deneniyor ${currentPathIndex + 1}/${pathsToTry.length}: ${currentPath}`);
            
            fetch(currentPath, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        console.log(`✅ Çalışan yol bulundu: ${currentPath}`);
                        displayModel(currentPath, item);
                    } else {
                        console.log(`❌ Yol başarısız: ${currentPath}`);
                        currentPathIndex++;
                        tryNextPath();
                    }
                })
                .catch(error => {
                    console.log(`❌ Yol hatası: ${currentPath}`, error);
                    currentPathIndex++;
                    tryNextPath();
                });
        }
        
        // Yol denemelerini başlat
        tryNextPath();
    }
    
    // Modeli görüntüle
    function displayModel(modelPath, item) {
        console.log(`✓ Model doğrulanmış yoldan yükleniyor: ${modelPath}`);
        
        // Model viewer oluştur veya mevcut olanı bul
        modelViewer = document.querySelector('model-viewer');
        if (!modelViewer) {
            console.log("Yeni model-viewer elementi oluşturuluyor");
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
            
            // Çıkış butonu ekle
            const exitButton = document.createElement('button');
            exitButton.slot = 'exit-button';
            exitButton.textContent = 'Kapat ×';
            exitButton.style.backgroundColor = 'var(--danger, red)';
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
            
            // Hata takibi
            modelViewer.addEventListener('error', (error) => {
                console.error('Model-viewer yükleme hatası:', error);
                showError(modelPath, error.target.error || 'Bilinmeyen hata');
                showStatus("Model yüklenemedi: " + modelPath, false);
            });
            
            // Yükleme takibi
            modelViewer.addEventListener('load', () => {
                console.log('Model başarıyla yüklendi');
                showStatus("Model yüklendi! Modeli döndürmek için sürükleyin.", false);
                hideModelError();
                
                // Özel model yükleme olayı tetikle
                const event = new CustomEvent('modelLoaded', { detail: { item: item } });
                document.dispatchEvent(event);
            });
            
            // Model-viewer'ı AR konteynerine ekle
            if (arContainer) {
                arContainer.innerHTML = '';
                arContainer.appendChild(modelViewer);
            } else {
                console.error("AR konteyneri bulunamadı!");
                return;
            }
        }
        
        // Model viewer kaynağını ayarla
        modelViewer.setAttribute('src', modelPath);
        
        // iOS için USDZ formatını da ayarla
        if (item.usdz) {
            const usdzPath = item.usdz;
            modelViewer.setAttribute('ios-src', usdzPath);
        } else {
            // Varsayılan olarak GLB yolundan USDZ yolunu tahmin et
            const usdzPath = modelPath.replace('.glb', '.usdz');
            modelViewer.setAttribute('ios-src', usdzPath);
        }
        
        // AR konteynerini görünür yap
        if (arContainer) {
            arContainer.style.display = 'block';
        }
        
        // Yükleme göstergesini gizle
        hideStatus();
    }
    
    // Köfte modeli gibi özel modelleri doğrudan yükleme (fix-ar-model'den taşındı)
    function directLoadModel(modelName) {
        console.log("📂 Model doğrudan yükleniyor:", modelName);
        
        // Test edilen ve çalışan yol
        const modelPath = `models/${modelName}.glb`;
        console.log(`Kullanılan yol: ${modelPath}`);
        
        // Konteyneri bul ve göster
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
        modelViewer = document.createElement('model-viewer');
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
        closeButton.onclick = closeARView;
        modelViewer.appendChild(closeButton);
        
        // Model başarılı yüklendiğinde
        modelViewer.addEventListener('load', () => {
            console.log("✅ Model başarıyla yüklendi!");
            const loadingIndicator = document.getElementById('model-loading-indicator');
            if (loadingIndicator) loadingIndicator.remove();
            
            showStatus(`${modelName} modeli başarıyla yüklendi! Modeli döndürmek için sürükleyin.`, false);
            
            // Model Yüklenme olayını tetikle
            const placeholderItem = { name: modelName, modelPath };
            const event = new CustomEvent('modelLoaded', { detail: { item: placeholderItem } });
            document.dispatchEvent(event);
        });
        
        // Yükleme hatası olduğunda
        modelViewer.addEventListener('error', (error) => {
            console.error("❌ Model yükleme hatası:", error);
            
            // Alternatif yolu deneyelim
            const altPath = `assets/models/${modelName}.glb`;
            console.log(`İlk yol başarısız oldu. Alternatif deneniyor: ${altPath}`);
            
            // Başka yolu dene
            modelViewer.setAttribute('src', altPath);
            
            // Model hatası görünümünü hazırla
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
                <p>${modelName} modeli yüklenirken bir sorun oluştu.</p>
                <div style="margin: 15px 0; text-align: left; background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                    <p>Denenen yollar:</p>
                    <ul style="padding-left: 20px; margin: 5px 0;">
                        <li>${modelPath}</li>
                        <li>${altPath}</li>
                    </ul>
                </div>
                <button id="force-load-btn" style="background: #6A5AE0; color: white; border: none; padding: 10px 15px; 
                       border-radius: 5px; cursor: pointer; margin-right: 10px;">Zorla Yükle</button>
                <button onclick="ARModule.close()" 
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
        arContainer.appendChild(modelViewer);
        
        // Modeli ayarla - model-test sayfasında çalışan doğru yolu kullanıyoruz
        modelViewer.setAttribute('src', modelPath);
        
        // iOS için USDZ versiyonunu da ayarla
        modelViewer.setAttribute('ios-src', modelPath.replace('.glb', '.usdz'));
        
        console.log("Model viewer ayarlandı ve yükleme başlatıldı");
    }
    
    // iOS için AR QuickLook
    function initQuickLook(item) {
        console.log('iOS için AR QuickLook başlatılıyor:', item);
        currentModelInfo = item;
        
        if (!item.usdz) {
            showStatus("Bu ürün için AR modeli bulunamadı. Lütfen diğer ürünleri deneyin.", false);
            return;
        }
        
        // Önce modelin varlığını kontrol et
        fetch(item.usdz)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Model dosyası bulunamadı: ${item.usdz}`);
                }
                return response;
            })
            .then(() => {
                showStatus("AR deneyimi başlatılıyor... Kameranıza erişim isteklerini kabul edin.", false);
                
                // iOS 14+ Enhanced AR Quick Look
                const anchor = document.createElement('a');
                anchor.setAttribute('rel', 'ar');
                anchor.setAttribute('href', item.usdz);
                
                // iOS AR özellikleri
                anchor.setAttribute('data-ar-scale', 'auto');
                anchor.setAttribute('data-ar-tracking', 'world');
                anchor.setAttribute('data-ar-placement', 'floor');
                
                if (item.name) {
                    anchor.setAttribute('data-ar-title', item.name);
                }
                
                console.log('AR Quick Look bağlantısı oluşturuldu:', anchor.getAttribute('href'));
                
                // iOS 13+ için anchor DOM'da olmalı ve bir resim içermeli
                const img = document.createElement('img');
                img.src = item.image || 'https://placehold.co/1x1.png';
                img.style.display = 'none';
                anchor.appendChild(img);
                
                // Body'ye ekle
                document.body.appendChild(anchor);
                
                // DOM güncellemesi için kısa bir gecikme uygula
                setTimeout(() => {
                    try {
                        // Tıklama öncesi log
                        console.log('AR bağlantısı tıklanıyor:', new Date().toISOString());
                        
                        // Görsel geri bildirim ekle
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
                        
                        // AR'ı başlat
                        anchor.click();
                        console.log("AR QuickLook bağlantısı tıklandı");
                        
                        // Geri bildirimi kısa bir süre sonra kaldır
                        setTimeout(() => {
                            document.body.removeChild(clickFeedback);
                        }, 1500);
                        
                        // AR başlamazsa uyarı göster
                        setTimeout(() => {
                            showStatus("AR başlatılamadı. Safari tarayıcısında olduğunuzdan emin olun.", false);
                        }, 3000);
                    } catch (err) {
                        console.error("AR Quick Look başlatma hatası:", err);
                        showStatus("AR başlatılamadı. Lütfen Safari tarayıcısı ile deneyin.");
                    }
                    
                    // Bağlantıyı bir süre sonra kaldır
                    setTimeout(() => {
                        if (document.body.contains(anchor)) {
                            document.body.removeChild(anchor);
                        }
                    }, 2000);
                }, 300);
            })
            .catch(error => {
                console.error("Model dosyası kontrolü sırasında hata:", error);
                showStatus("Model dosyası bulunamadı. Lütfen model yollarını kontrol edin.");
                console.error("Model yolu:", item.usdz);
                console.error("Tam hata:", error);
            });
    }
    
    // WebXR ile AR deneyimi başlat
    function initWebXR(item) {
        currentModelInfo = item;
        showStatus("AR deneyimi başlatılıyor...", true);
        
        // Kamera izin mesajı
        showStatus("Kamera erişimi için izin istenecektir. Lütfen kabul edin.", false);
        
        // WebXR desteklenmiyor mu?
        if (!navigator.xr) {
            console.log("WebXR desteklenmiyor, model-viewer'a geçiliyor");
            initModelViewer(item);
            return;
        }
        
        try {
            // Three.js sahnesini kur
            setupThreeJsScene();
            
            // AR oturumu iste
            navigator.xr.requestSession('immersive-ar', {
                requiredFeatures: ['hit-test', 'dom-overlay'],
                domOverlay: { root: arContainer }
            }).then(session => {
                xrSession = session;
                
                // XR oturumunu kur
                setupXRSession(xrSession);

                // 3D modeli yükle
                loadModel(item.modelPath);
                
                // AR konteynerini görünür yap
                if (arContainer) {
                    arContainer.style.display = 'block';
                }
                
                // Başarı mesajı
                showStatus("AR başlatıldı! Kameranızı düz bir yüzeye doğrultun.", false);
            }).catch(error => {
                console.error('AR oturumu hatası:', error);
                showStatus("AR oturumu başlatılamadı. Cihazınız desteklemiyor olabilir.");
                // Model-viewer'a dön
                initModelViewer(item);
            });
        } catch (error) {
            console.error('WebXR başlatma hatası:', error);
            showStatus("AR başlatılamadı. Lütfen tekrar deneyin.");
            // Model-viewer'a dön
            initModelViewer(item);
        }
    }
    
    // Three.js sahnesini kur
    function setupThreeJsScene() {
        // Scene oluştur
        scene = new THREE.Scene();

        // Kamera oluştur
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

        // Renderer oluştur
        renderer = new THREE.WebGLRenderer({
            canvas: arCanvas,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true;

        // Işıklar oluştur
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 5, 0);
        scene.add(directionalLight);

        // Yerleştirme için halkayı oluştur
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
    
    // XR oturumunu kur
    function setupXRSession(session) {
        // Referans alanı oluştur
        session.requestReferenceSpace('local').then((referenceSpace) => {
            session.requestHitTestSource({ space: referenceSpace }).then((source) => {
                hitTestSource = source;
            });
        });
        
        // Renderer'ı XR oturumu ile birlikte ayarla
        renderer.xr.setReferenceSpaceType('local');
        renderer.xr.setSession(session);
        
        // Animasyon döngüsünü ayarla
        session.requestAnimationFrame(onXRFrame);
        
        // Oturum olayları
        session.addEventListener('end', () => {
            hitTestSourceRequested = false;
            hitTestSource = null;
            closeARSession();
        });
        
        // Model yerleştirmek için dokunma
        if (arCanvas) {
            arCanvas.addEventListener('touchstart', placeModel);
        }
        
        hideStatus();
    }
    
    // 3D modeli yükle
    function loadModel(modelPath) {
        const loader = new THREE.GLTFLoader();
        const dracoLoader = new THREE.DRACOLoader();
        dracoLoader.setDecoderPath('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/libs/draco/');
        loader.setDRACOLoader(dracoLoader);
        
        loader.load(
            modelPath,
            (gltf) => {
                currentModel = gltf.scene;
                
                // Modeli ölçekle ve konumlandır
                currentModel.scale.set(0.5, 0.5, 0.5);
                
                // Modeli yerleştirilene kadar gizle
                currentModel.visible = false;
                scene.add(currentModel);
                
                showStatus("Modeli yerleştirmek için düz bir yüzeye kameranızı doğrultun ve ekrana dokunun.");
                hideStatus();
            },
            (progress) => {
                const percentComplete = Math.round((progress.loaded / progress.total) * 100);
                showStatus(`Model yükleniyor: ${percentComplete}%`, true);
            },
            (error) => {
                console.error('Model yükleme hatası:', error);
                showStatus("Model yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
                hideStatus();
            }
        );
    }
    
    // Dokunma ile modeli yerleştir
    function placeModel() {
        if (!isModelPlaced && currentModel && reticle.visible) {
            // Halkadan modelin konumunu al
            currentModel.position.setFromMatrixPosition(reticle.matrix);
            currentModel.visible = true;
            isModelPlaced = true;
            
            // Halka artık görünmez olsun
            reticle.visible = false;
            
            showStatus("Model yerleştirildi! Döndürmek için kontrolleri kullanabilirsiniz.");
        }
    }
    
    // XR animasyon çerçevesi
    function onXRFrame(time, frame) {
        if (!xrSession) return;
        
        // Sonraki çerçeveyi iste
        xrSession.requestAnimationFrame(onXRFrame);
        
        // Görüntüleyici duruşunu al
        const referenceSpace = renderer.xr.getReferenceSpace();
        const viewerPose = frame.getViewerPose(referenceSpace);
        
        if (viewerPose) {
            // Hit testi
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
            
            // Sahneyi render et
            renderer.render(scene, camera);
        }
    }
    
    // AR oturumunu kapat
    function closeARSession() {
        if (xrSession) {
            xrSession.end().then(() => {
                xrSession = null;
                
                // Temizlik
                if (currentModel) {
                    scene.remove(currentModel);
                    currentModel = null;
                }
                
                isModelPlaced = false;
                if (arContainer) {
                    arContainer.style.display = 'none';
                }
            });
        }
    }
    
    // AR görünümünü kapat
    function closeARView() {
        if (arSupport === 'webxr' && xrSession) {
            closeARSession();
        } else {
            // Model-viewer için
            if (arContainer) {
                arContainer.style.display = 'none';
            }
        }
    }
    
    // Model döndürme - sol
    function rotateModelLeft() {
        if (currentModel) {
            modelRotationY -= Math.PI / 8;
            currentModel.rotation.y = modelRotationY;
            
            // Dokunma geri bildirimi
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }
    }
    
    // Model döndürme - sağ
    function rotateModelRight() {
        if (currentModel) {
            modelRotationY += Math.PI / 8;
            currentModel.rotation.y = modelRotationY;
            
            // Dokunma geri bildirimi
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(50);
            }
        }
    }
    
    // Model sıfırlama
    function resetModel() {
        if (currentModel) {
            modelRotationY = 0;
            currentModel.rotation.y = 0;
            currentModel.position.set(0, 0, 0);
            isModelPlaced = false;
            
            // Dokunma geri bildirimi
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate([50, 50, 50]);
            }
            
            showStatus("Model sıfırlandı! Tekrar yerleştirmek için ekrana dokunun.");
        }
    }
    
    // Status mesajı göster
    function showStatus(message, isLoading = false) {
        if (statusCallback) {
            statusCallback(message, isLoading);
        } else {
            // Varsayılan durum göstergesi
            console.log(`AR Status: ${message}`);
        }
    }
    
    // Status mesajını gizle
    function hideStatus() {
        if (statusCallback) {
            statusCallback(null, false);
        }
    }
    
    // Model hatası göster
    function showError(modelPath, errorMessage) {
        console.error(`Model hatası: ${errorMessage} (${modelPath})`);
        
        if (errorCallback) {
            errorCallback(modelPath, errorMessage);
        } else {
            // Varsayılan hata gösterimi
            const modelError = document.getElementById('model-error');
            if (modelError) {
                modelError.style.display = 'block';
                
                const errorDetails = document.getElementById('model-error-details');
                if (errorDetails) {
                    errorDetails.textContent = `Yol: ${modelPath}\nHata: ${errorMessage}`;
                }
            }
        }
    }
    
    // Model hatasını gizle
    function hideModelError() {
        const modelError = document.getElementById('model-error');
        if (modelError) {
            modelError.style.display = 'none';
        }
    }

    // Ekran görüntüsü al ve paylaş
    function takeScreenshotAndShare() {
        showStatus("Ekran görüntüsü alınıyor...", true);
        console.log("Ekran görüntüsü alınıyor");
        
        try {
            // Model-viewer varsa ondan ekran görüntüsü al
            if (modelViewer) {
                modelViewer.toBlob()
                    .then(blob => {
                        const imageUrl = URL.createObjectURL(blob);
                        console.log("Model viewer ekran görüntüsü alındı");
                        showShareModal(imageUrl);
                        hideStatus();
                    })
                    .catch(error => {
                        console.error("Model viewer ekran görüntüsü alınırken hata:", error);
                        showStatus("Ekran görüntüsü alınamadı. Lütfen tekrar deneyin.", false);
                    });
                return;
            }
            
            // WebXR kullanılıyorsa canvas'dan ekran görüntüsü al
            if (arCanvas && arSupport === 'webxr') {
                arCanvas.toBlob(blob => {
                    const imageUrl = URL.createObjectURL(blob);
                    console.log("Canvas ekran görüntüsü alındı");
                    showShareModal(imageUrl);
                    hideStatus();
                });
                return;
            }
            
            // Ekran görüntüsü alınamadı
            showStatus("Ekran görüntüsü alınamadı. Desteklenen bir AR modu kullanılamıyor.", false);
            console.error("Ekran görüntüsü alınabilecek bir kaynak bulunamadı");
        } catch (error) {
            console.error("Ekran görüntüsü alınırken hata:", error);
            showStatus("Ekran görüntüsü alınırken bir hata oluştu.", false);
        }
    }
    
    // Paylaşım modalını göster
    function showShareModal(imageUrl) {
        // Modal oluştur
        const modal = document.createElement('div');
        modal.className = 'ar-share-modal';
        
        // Modelin adını al
        const title = currentModelInfo ? currentModelInfo.name : 'AR Model';
        
        // Modal içeriği
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
                            <button class="share-btn whatsapp" id="whatsappShareBtn">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </button>
                            <button class="share-btn download" id="downloadImageBtn">
                                <i class="fas fa-download"></i> İndir
                            </button>
                            <button class="share-btn" id="webShareBtn">
                                <i class="fas fa-share-alt"></i> Paylaş
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Modal'ı body'e ekle
        document.body.appendChild(modal);
        
        // Kapatma butonu olayı
        const closeBtn = modal.querySelector('#closeShareModalBtn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // WhatsApp paylaşım butonu
        const whatsappBtn = modal.querySelector('#whatsappShareBtn');
        whatsappBtn.addEventListener('click', () => shareToWhatsApp(imageUrl, title));
        
        // İndirme butonu
        const downloadBtn = modal.querySelector('#downloadImageBtn');
        downloadBtn.addEventListener('click', () => downloadImage(imageUrl, title));
        
        // Web Share API paylaşımı
        const webShareBtn = modal.querySelector('#webShareBtn');
        webShareBtn.addEventListener('click', () => shareViaWebAPI(imageUrl, title));
        
        // Modal dışına tıklama olayı
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Dokunma geri bildirimi
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    }
    
    // WhatsApp ile paylaş
    function shareToWhatsApp(imageUrl, title) {
        // Görüntüyü blob olarak al ve WhatsApp'ta paylaş
        fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
                // Web Share API kullanılabilir mi?
                if (navigator.share && navigator.canShare) {
                    const file = new File([blob], 'ar_model.png', { type: 'image/png' });
                    
                    // Paylaşılacak içeriği oluştur
                    const shareData = {
                        title: 'AR Menü',
                        text: `AR Menü uygulamasında ${title} göründüğü gibi!`,
                        files: [file]
                    };
                    
                    // Paylaşılabilir mi kontrol et
                    if (navigator.canShare(shareData)) {
                        navigator.share(shareData)
                            .then(() => {
                                console.log("Paylaşım başarılı");
                                showStatus("Paylaşım başarılı!", false);
                            })
                            .catch(err => {
                                console.error("Paylaşım hatası:", err);
                                // Alternatif paylaşım
                                alternativeShare('whatsapp', imageUrl, title);
                            });
                    } else {
                        console.log("Bu içerik paylaşılamaz");
                        alternativeShare('whatsapp', imageUrl, title);
                    }
                } else {
                    // Web Share API desteklenmiyorsa
                    alternativeShare('whatsapp', imageUrl, title);
                }
            });
    }
    
    // Alternatif paylaşım yöntemi
    function alternativeShare(platform, imageUrl, title) {
        if (platform === 'whatsapp') {
            const text = encodeURIComponent(`AR Menü uygulamasında ${title} göründüğü gibi!`);
            const whatsappUrl = `https://wa.me/?text=${text}`;
            window.open(whatsappUrl, '_blank');
        } else {
            showStatus("Bu cihazda doğrudan paylaşım desteklenmiyor. Lütfen görüntüyü indirip manuel olarak paylaşın.", false);
        }
    }
    
    // Web Share API ile paylaş
    function shareViaWebAPI(imageUrl, title) {
        fetch(imageUrl)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'ar_model.png', { type: 'image/png' });
                
                if (navigator.share) {
                    navigator.share({
                        title: 'AR Menü Paylaşımı',
                        text: `AR Menü uygulamasında ${title} göründüğü gibi!`,
                        files: navigator.canShare && navigator.canShare({ files: [file] }) ? [file] : undefined
                    })
                        .then(() => showStatus("Paylaşım başarılı!", false))
                        .catch(error => {
                            console.error("Paylaşım hatası:", error);
                            showStatus("Paylaşım sırasında bir hata oluştu.", false);
                        });
                } else {
                    showStatus("Bu cihazda paylaşım desteklenmiyor. Lütfen görüntüyü indirin.", false);
                }
            });
    }
    
    // Görüntüyü indir
    function downloadImage(imageUrl, title) {
        // İndirilecek dosya adını ayarla
        const fileName = `ar_menu_${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
        
        // İndirme bağlantısı oluştur
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        
        // İndirmeyi başlat
        link.click();
        
        // Bağlantıyı kaldır
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(imageUrl); // Bellek temizliği
        }, 100);
        
        showStatus("Görüntü indiriliyor: " + fileName, false);
        
        // Dokunma geri bildirimi
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate([50, 50, 50]);
        }
    }
    
    // Modülü başlat
    function init() {
        console.log("AR Modülü başlatılıyor...");
        
        // AR elementlerini başlat
        initARElements();
        
        // AR desteğini kontrol et
        return checkARSupport().then(support => {
            console.log(`AR desteği: ${support}`);
            return support;
        });
    }
    
    // Ekran boyutu değişimi olayını dinle
    window.addEventListener('resize', () => {
        if (camera && renderer) {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    });
    
    // Public API
    return {
        // Başlatma
        init: init,
        
        // AR desteğini kontrol et
        checkSupport: checkARSupport,
        
        // AR görünümünü başlat
        showAR: function(item) {
            console.log(`AR görünümünü başlatma: ${item.name}`);
            
            // Uygun AR teknolojisini kullan
            if (arSupport === 'quicklook' && item.usdz) {
                initQuickLook(item);
            } else if (arSupport === 'webxr') {
                initWebXR(item);
            } else {
                initModelViewer(item);
            }
        },
        
        // AR görünümünü kapat
        close: closeARView,
        
        // Mevcut AR desteğini döndür
        getSupport: function() {
            return arSupport;
        },
        
        // Durum mesajı gösterme fonksiyonu ayarla
        setStatusCallback: function(callback) {
            statusCallback = callback;
        },
        
        // Hata gösterme fonksiyonu ayarla
        setErrorCallback: function(callback) {
            errorCallback = callback;
        },
        
        // Mevcut modeli döndür
        rotateLeft: rotateModelLeft,
        rotateRight: rotateModelRight,
        
        // Modeli sıfırla
        resetModel: resetModel,
        
        // Model bilgisini döndür
        getModelInfo: function() {
            return currentModelInfo;
        },
        
        // Bir model yüklü mü?
        isModelLoaded: function() {
            return !!currentModel;
        },

        // Ekran görüntüsü al ve paylaş
        takeScreenshot: takeScreenshotAndShare,
        
        // Paylaşımı etkinleştir/devre dışı bırak
        enableSharing: function(enabled) {
            shareEnabled = enabled;
            const shareBtn = document.getElementById('shareArBtn');
            if (shareBtn) {
                if (enabled) {
                    shareBtn.style.display = 'flex';
                } else {
                    shareBtn.style.display = 'none';
                }
            }
        },
        
        // Direkt olarak bir modeli yükle
        loadModel: function(modelName) {
            return directLoadModel(modelName);
        }
    };
})();

// AR Modülünü sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', () => {
    console.log("AR Modülü otomatik olarak başlatılıyor...");
    
    // Modülü başlat
    ARModule.init().then(support => {
        console.log(`AR desteği: ${support}`);
        
        // Durum mesajı gösterme fonksiyonunu ayarla
        ARModule.setStatusCallback((message, isLoading) => {
            if (message === null) {
                // Mesajı gizle
                const statusMessage = document.getElementById('statusMessage');
                if (statusMessage) {
                    statusMessage.style.display = 'none';
                }
                return;
            }
            
            // Mesaj tipini belirle
            let icon = 'ℹ️';
            let className = 'info';
            
            if (message.toLowerCase().includes('hata') || message.toLowerCase().includes('bulunamadı')) {
                icon = '⚠️';
                className = 'warning';
            } else if (message.toLowerCase().includes('başarı') || message.toLowerCase().includes('yüklendi')) {
                icon = '✅';
                className = 'success';
            } else if (message.toLowerCase().includes('kamera')) {
                icon = '📷';
                className = 'info';
            }
            
            // Mesajı göster
            const statusMessage = document.getElementById('statusMessage');
            if (statusMessage) {
                statusMessage.innerHTML = `<div class="alert alert-${className}"><div class="alert-emoji">${icon}</div><div>${message}</div></div>`;
                statusMessage.style.display = 'block';
                
                // Otomatik kapat
                setTimeout(() => {
                    statusMessage.style.display = 'none';
                }, 3000);
            } else {
                console.log("Status mesaj elementi bulunamadı, mesaj:", message);
            }
        });
        
        // AR butonlarını modüle bağla
        document.querySelectorAll('.menu-item-ar').forEach(button => {
            // Önceki tıklama olaylarını temizle
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Modülle AR görünümünü başlat
            newButton.addEventListener('click', e => {
                e.preventDefault();
                e.stopPropagation();
                
                // Menü öğesinin verilerini al
                const menuItem = newButton.closest('.menu-item');
                if (menuItem) {
                    // Menü öğesi verilerini oluştur
                    const item = {
                        name: menuItem.querySelector('.menu-item-title').textContent,
                        modelPath: newButton.getAttribute('data-model') || `models/${menuItem.dataset.itemId || 'default'}.glb`,
                        usdz: newButton.getAttribute('data-usdz') || undefined,
                        image: menuItem.querySelector('.menu-item-img')?.src
                    };
                    
                    // AR modülü ile göster
                    ARModule.showAR(item);
                }
            });
        });
    });
});