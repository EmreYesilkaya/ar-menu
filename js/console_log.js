/**
 * Bu dosya, modellerin yollarını ve projenin yapısını kontrol etmek için yardımcı olur.
 * Konsola kapsamlı bilgiler yazdırır.
 */

// Projenin kök dizinini al
const rootPath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);

// Tarayıcı bilgileri
console.log('%c==== TARAYICI BİLGİLERİ ====', 'font-weight: bold; color: blue;');
console.log('User Agent:', navigator.userAgent);
console.log('Proje URL:', rootPath);

// Yol testleri yapmak için fonksiyon
function checkFilePath(path) {
    const absolutePath = new URL(path, rootPath).href;
    
    console.log(`%cDosya Yolu Kontrolü: ${path}`, 'color: purple; font-weight: bold;');
    console.log('Tam URL:', absolutePath);
    
    return fetch(path, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                console.log(`%c✓ BULUNDU: ${path}`, 'color: green;');
                return true;
            } else {
                console.log(`%c✗ BULUNAMADI: ${path} (HTTP ${response.status})`, 'color: red;');
                return false;
            }
        })
        .catch(error => {
            console.log(`%c✗ HATA: ${path} - ${error.message}`, 'color: red;');
            return false;
        });
}

// Yaygın dosya yollarını kontrol et
console.log('%c==== DOSYA YOLU KONTROLLERİ ====', 'font-weight: bold; color: blue;');

// Muhtemel model klasörleri
const possiblePaths = [
    './models/kofte.glb',
    'models/kofte.glb',
    '/models/kofte.glb',
    '../models/kofte.glb',
    '/Users/ey/ar restorant/models/kofte.glb',
    './assets/models/kofte.glb',
    'assets/models/kofte.glb'
];

// Tüm olasılıkları kontrol et
Promise.all(possiblePaths.map(checkFilePath))
    .then(results => {
        // Başarılı ve başarısız yolları özetle
        const successPaths = possiblePaths.filter((_, i) => results[i]);
        const failPaths = possiblePaths.filter((_, i) => !results[i]);
        
        console.log('%c==== SONUÇLAR ====', 'font-weight: bold; color: blue;');
        
        if (successPaths.length > 0) {
            console.log('%c✓ BULUNAN DOSYA YOLLARI:', 'color: green; font-weight: bold;');
            successPaths.forEach(path => console.log(` - ${path}`));
        } else {
            console.log('%c✗ HİÇBİR DOSYA YOLU ÇALIŞMIYOR!', 'color: red; font-weight: bold;');
        }
        
        // Önerilen düzenleme
        console.log('%c==== ÖNERİLER ====', 'font-weight: bold; color: blue;');
        
        if (successPaths.length > 0) {
            console.log(`menuData içinde şu dosya yolunu kullanmanız önerilir: '${successPaths[0]}'`);
        } else {
            console.log('Lütfen GLB dosyalarınızın projenizde doğru konumda olduğundan emin olun:');
            console.log('1. /Users/ey/ar restorant/models/ klasörünün mevcut olduğunu kontrol edin');
            console.log('2. Dosya adlarının doğru yazıldığından emin olun (örn: kofte.glb)');
            console.log('3. Dosya uzantılarının küçük harfle yazıldığından emin olun (.glb, .GLB değil)');
        }
    });
