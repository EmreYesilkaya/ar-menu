/**
 * Asset Path Resolution Helper v2
 * Improved to handle various path structures and debug AR model loading issues
 */

// Global path resolution helper
window.resolveAssetPath = function(relativePath) {
    // Debug log
    console.log("Original path:", relativePath);
    
    // Normalize path - replace any double slashes
    let normalizedPath = relativePath.replace(/\/\//g, '/');
    
    // Clean up path - ensure it's relative
    if (normalizedPath.startsWith('/')) {
        normalizedPath = normalizedPath.substring(1);
    }
    
    // Handle different possible path prefixes
    if (normalizedPath.startsWith('assets/') || 
        normalizedPath.startsWith('./assets/')) {
        // Path already starts with assets - fine as is
    } else if (normalizedPath.startsWith('models/') || 
               normalizedPath.startsWith('./models/')) {
        // Convert models/ to assets/models/ if needed
        const modelFile = normalizedPath.replace('models/', '').replace('./models/', '');
        normalizedPath = 'assets/models/' + modelFile;
    }
    
    // Ensure path starts with ./ for relative paths
    if (!normalizedPath.startsWith('./')) {
        normalizedPath = './' + normalizedPath;
    }
    
    console.log(`Path resolved: ${relativePath} → ${normalizedPath}`);
    return normalizedPath;
};

// AR Model Debug Tool - Improved to check all possible paths and load automatically
window.debugARModel = function(modelName) {
    console.log("🔍 AR Model Debugger starting...");
    console.log(`Checking possible paths for "${modelName}"...`);
    
    // Show status message to user
    if (window.showStatusMessage) {
        window.showStatusMessage("Model için aranıyor... Lütfen bekleyin.", 2000);
    }
    
    // List of paths to test - expanded with more possibilities
    const possiblePaths = [
        `./models/${modelName}.glb`,
        `models/${modelName}.glb`,
        `./assets/models/${modelName}.glb`,
        `assets/models/${modelName}.glb`,
        `/models/${modelName}.glb`,
        `/assets/models/${modelName}.glb`,
        `./${modelName}.glb`,
        `${modelName}.glb`,
    ];
    
    console.log("🔍 Paths to check:", possiblePaths);
    
    // Show loading indicator in the AR container
    const arContainer = document.getElementById('arContainer');
    if (arContainer) {
        arContainer.innerHTML = `
            <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #6A5AE0; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="margin-top: 20px; color: #333; font-weight: bold;">Model dosyası aranıyor...</p>
                <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
            </div>
        `;
        arContainer.style.display = 'block';
    }
    
    // Start search animation in browser console
    let searchAnimationFrame = 0;
    let searchAnimationInterval = setInterval(() => {
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        console.log(`${frames[searchAnimationFrame]} Model aranıyor...`);
        searchAnimationFrame = (searchAnimationFrame + 1) % frames.length;
    }, 150);
    
    // Check each path with fetch
    let foundPaths = [];
    let promises = possiblePaths.map(path => {
        return fetch(path, { method: 'HEAD', cache: 'no-store' })
            .then(response => {
                if (response.ok) {
                    console.log(`✅ FOUND: ${path}`);
                    foundPaths.push(path);
                    return { path, status: 'found' };
                } else {
                    console.log(`❌ Not found: ${path} (Status: ${response.status})`);
                    return { path, status: 'not-found' };
                }
            })
            .catch(error => {
                console.log(`❌ Access error: ${path} - ${error.message}`);
                return { path, status: 'error' };
            });
    });
    
    // When all checks are complete, report results
    Promise.all(promises).then(() => {
        // Clear the search animation
        clearInterval(searchAnimationInterval);
        console.log("Search completed!");
        
        if (foundPaths.length > 0) {
            console.log("✅ MODEL FILES FOUND:");
            foundPaths.forEach(path => console.log(`   - ${path}`));
            
            // Notify user
            if (window.showStatusMessage) {
                window.showStatusMessage(`✅ Model dosyası bulundu: ${foundPaths[0]}`, 3000);
            }
            
            // Try to load the first found model
            if (window.loadModelDirectly) {
                window.loadModelDirectly(foundPaths[0]);
            }
        } else {
            console.error("❌ MODEL FILE NOT FOUND!");
            console.log("Please check the file exists and is in one of these directories:");
            console.log("- /assets/models/kofte.glb");
            console.log("- /models/kofte.glb");
            
            // Show error in AR container
            if (arContainer) {
                arContainer.innerHTML = `
                    <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; text-align: center; padding: 20px;">
                        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                        <h2 style="margin-bottom: 10px; color: #d32f2f;">Model Bulunamadı</h2>
                        <p style="margin-bottom: 20px; max-width: 400px;">Hiçbir model dosyası bulunamadı. Lütfen dosyaların varlığını kontrol edin ve doğru klasörlere yerleştirin.</p>
                        <div style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; text-align: left; font-family: monospace; margin-bottom: 20px;">
                            <strong>Aranan yollar:</strong><br>
                            ${possiblePaths.map(p => `- ${p}`).join('<br>')}
                        </div>
                        <button onclick="closeARView()" style="background: var(--primary); color: white; border: none; border-radius: 8px; padding: 10px 20px;">Kapat</button>
                    </div>
                `;
            }
            
            // Notify user
            if (window.showStatusMessage) {
                window.showStatusMessage("❌ Model dosyası bulunamadı! Lütfen dosya yollarını kontrol edin.", 5000);
            }
        }
    });
};

// Direct model loading function - Improved with better error handling
window.loadModelDirectly = function(modelPath) {
    console.log("🚀 Loading model directly:", modelPath);
    
    // Get or create model-viewer element
    let modelViewer = document.querySelector('model-viewer');
    
    if (!modelViewer) {
        console.log("Creating model-viewer element...");
        
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
        modelViewer.style.backgroundColor = '#f5f5f5';
        
        // Add close button
        const closeButton = document.createElement('button');
        closeButton.slot = 'exit-button';
        closeButton.textContent = 'Kapat';
        closeButton.style.background = 'var(--danger)';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '4px';
        closeButton.style.padding = '8px 15px';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.zIndex = '100';
        closeButton.onclick = function() {
            document.getElementById('arContainer').style.display = 'none';
        };
        
        modelViewer.appendChild(closeButton);
        
        // Error handling elements
        const loadingIndicator = document.createElement('div');
        loadingIndicator.slot = 'progress-bar';
        loadingIndicator.style.position = 'absolute';
        loadingIndicator.style.left = '0';
        loadingIndicator.style.bottom = '0';
        loadingIndicator.style.width = '0';
        loadingIndicator.style.height = '5px';
        loadingIndicator.style.background = 'var(--primary)';
        loadingIndicator.style.transition = 'width 0.3s';
        loadingIndicator.style.zIndex = '100';
        modelViewer.appendChild(loadingIndicator);
        
        // Clear and add to AR container
        const arContainer = document.getElementById('arContainer');
        if (arContainer) {
            arContainer.innerHTML = '';
            arContainer.appendChild(modelViewer);
        } else {
            console.error("AR Container not found!");
            return;
        }
    }
    
    // Show a loading message
    const arContainer = document.getElementById('arContainer');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'model-loading-overlay';
    loadingOverlay.style.position = 'absolute';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.flexDirection = 'column';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.backgroundColor = 'rgba(255,255,255,0.9)';
    loadingOverlay.style.zIndex = '99';
    loadingOverlay.innerHTML = `
        <div style="width: 50px; height: 50px; border: 5px solid #f3f3f3; border-top: 5px solid #6A5AE0; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 20px; color: #333; font-weight: bold;">Model yükleniyor...</p>
        <style>@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    `;
    arContainer.appendChild(loadingOverlay);
    
    // Set the model source
    modelViewer.setAttribute('src', modelPath);
    
    // Also try to set iOS USDZ version if exists (by replacing .glb with .usdz)
    const usdzPath = modelPath.replace('.glb', '.usdz');
    modelViewer.setAttribute('ios-src', usdzPath);
    
    // Add load and error event handlers
    modelViewer.addEventListener('load', function() {
        console.log("✅ Model loaded successfully!");
        document.getElementById('model-error').style.display = 'none';
        
        // Remove loading overlay
        const loadingOverlay = document.getElementById('model-loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
        
        if (window.showStatusMessage) {
            window.showStatusMessage("✅ Model yüklendi! 3D modeli döndürmek için sürükleyin.", 3000);
        }
    });
    
    modelViewer.addEventListener('error', function(error) {
        console.error("❌ Model loading error:", error);
        document.getElementById('model-error').style.display = 'block';
        document.getElementById('model-error-details').innerHTML = `
            <strong>Yükleme hatası:</strong><br>
            Model: ${modelPath}<br>
            Hata: ${error.detail?.sourceError?.message || "Bilinmeyen hata"}
        `;
        
        // Remove loading overlay
        const loadingOverlay = document.getElementById('model-loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
        
        if (window.showStatusMessage) {
            window.showStatusMessage("❌ Model yüklenirken hata oluştu.", 3000);
        }
    });
    
    // Show AR container
    document.getElementById('arContainer').style.display = 'block';
};

// Sayfa yüklendiğinde otomatik kontrol
document.addEventListener('DOMContentLoaded', function() {
    console.log("📁 Sayfa yüklendi, AR model dosyaları için hazır.");
    
    // Add click event to all AR buttons
    document.querySelectorAll('.menu-item-ar').forEach(button => {
        const existingClick = button.onclick;
        
        button.onclick = function(e) {
            // Get model path from button
            const modelPath = this.getAttribute('data-model');
            console.log("📂 AR butonu tıklandı, model yolu:", modelPath);
            
            if (modelPath) {
                // Extract model name from path
                let modelName = modelPath.split('/').pop().replace('.glb', '');
                
                // Show AR container first
                document.getElementById('arContainer').style.display = 'block';
                
                // Debug model path
                window.debugARModel(modelName);
                
                // Prevent default if this is being used as an enhancement
                e.preventDefault();
                e.stopPropagation();
            }
            
            // Call existing click handler if any
            if (existingClick) existingClick.call(this, e);
        };
    });
});
