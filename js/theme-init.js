/**
 * Tema başlatıcı - Sayfa yüklenmeden önce tema ayarlarını uygular
 * Bu şekilde kullanıcı temayı ilk kez seçtiğinde beyaz/siyah ekran yanıp sönmesi önlenir
 */
(function() {
  // Seçili temayı localStorage'dan al
  const savedTheme = localStorage.getItem('theme-preference');
  
  // Sistem tercihini kontrol et
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Tema değerini belirle
  let theme;
  if (savedTheme) {
    // Kullanıcı tercihi varsa onu kullan
    theme = savedTheme;
  } else {
    // Yoksa sistem tercihini kullan
    theme = systemPrefersDark ? 'dark' : 'light';
  }
  
  // Temayı ayarla
  if (theme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  // Animasyonsuz geçiş için sınıf ekle (DOM yüklenirken)
  document.body.classList.add('theme-transition');
  
  // Animasyonları kaldırma işlemini DOM yüklendikten sonraya zamanla
  window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 100);
  });
  
  // ThemeSwitcher script'ini dinamik olarak yüklemeyi garantile
  window.addEventListener('DOMContentLoaded', () => {
    // ThemeSwitcher script'inin eklenip eklenmediğini kontrol et
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
