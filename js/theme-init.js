/**
 * Tema başlatıcı - Sayfa yüklenmeden önce tema ayarlarını uygular
 * Bu şekilde kullanıcı temayı ilk kez seçtiğinde beyaz/siyah ekran yanıp sönmesi önlenir
 */
(function() {
  // Erken ayarlanan tema sınıfı
  document.body.classList.add('preload-theme');

  // Seçili temayı localStorage'dan al
  const savedTheme = localStorage.getItem('theme-preference');
  
  // Sistem tercihini kontrol et
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Tema değerini belirle
  const theme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
  
  // Body'e tema sınıfını ekle
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark-mode');
  }
  
  // Animasyonsuz geçiş için sınıf ekle (DOM yüklenirken)
  document.body.classList.add('theme-transition');
  
  // Animasyonları kaldırma işlemini DOM yüklendikten sonraya zamanla
  window.addEventListener('DOMContentLoaded', () => {
    // Preload sınıfını kaldır
    document.body.classList.remove('preload-theme');
    
    // Animasyonları etkinleştir
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
    
    // ThemeSwitcher script'ini dinamik olarak yüklemeyi garantile
    if (!window.ThemeSwitcher) {
      // Script'in zaten eklenmiş olup olmadığını kontrol et
      const existingScript = document.querySelector('script[src="js/theme-switcher.js"]');
      
      if (!existingScript) {
        console.log("ThemeSwitcher script dosyası eksik, yükleniyor...");
        const script = document.createElement('script');
        script.src = 'js/theme-switcher.js';
        document.head.appendChild(script);
      }
    }
  });
})();
