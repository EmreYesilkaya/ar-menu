/**
 * Tema Değiştirici - Koyu/Açık Mod
 * Animasyonlu tema geçişi için JS kodu
 */

// Sayfa yüklenirken eklemeyi garantileyen hızlı çalıştırma
(function() {
  console.log('Theme Switcher başlatılıyor...');
})();

// Tema kontrolcüsü
const ThemeSwitcher = {
    // DOM elementleri
    elements: {
        body: document.body,
        themeToggle: null
    },

    // Başlangıç durumu
    isDark: false,

    // Başlatma fonksiyonu
    init() {
        console.log("ThemeSwitcher: Başlatılıyor...");
        
        // Tema tercihini localStorage'dan al
        const savedTheme = localStorage.getItem('theme-preference');
        
        // Sistem renk şeması tercihini kontrol et
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Tema değerini belirle - önce kayıtlı tercihi, yoksa sistem tercihini kullan
        this.isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
        
        // DOM hazırsa hemen yükle, değilse yüklenince yap
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTheme());
        } else {
            this.setupTheme();
        }
        
        // Sistem teması değiştiğinde temayı güncelle
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            // Sadece kullanıcı tercihi yoksa sistem tercihini izle
            if (!localStorage.getItem('theme-preference')) {
                this.isDark = e.matches;
                this.applyTheme();
            }
        });
        
        // API'yi döndür
        return {
            toggle: () => this.toggleTheme(),
            setDark: (isDark) => this.setTheme(isDark),
            isDarkMode: () => this.isDark
        };
    },
    
    // Temayı ayarla
    setupTheme() {
        // İlk kez dolaylı tema değişimi animasyonsuz olsun
        document.body.classList.add('theme-transition');
        
        // Tema butonunu oluştur
        this.createThemeToggle();
        
        // Tema uygula
        this.applyTheme();
        
        // 100ms sonra geçiş animasyonlarını etkinleştir
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 100);
    },
    
    // Tema değiştirme butonunu oluştur
    createThemeToggle() {
        // Header'ın actions bölümünü bul
        const headerActions = document.querySelector('.header-actions');
        
        if (!headerActions) {
            console.warn("ThemeSwitcher: Header actions bulunamadı");
            return;
        }
        
        // Tema değiştirme butonunu oluştur
        const themeBtn = document.createElement('button');
        themeBtn.id = 'themeToggleBtn';
        themeBtn.className = 'header-btn theme-toggle-btn';
        themeBtn.setAttribute('aria-label', 'Temayı Değiştir');
        
        // İki ikonu da içeren HTML - her ikisi de her zaman DOM'da
        themeBtn.innerHTML = `
            <div class="theme-toggle-icon">
                <i class="fas fa-sun"></i>
                <i class="fas fa-moon"></i>
            </div>
        `;
        
        // Tıklama olayı ekle
        themeBtn.addEventListener('click', () => this.toggleTheme());
        
        // Info butonundan önce ekle
        const infoBtn = document.getElementById('infoBtn');
        if (infoBtn) {
            headerActions.insertBefore(themeBtn, infoBtn);
        } else {
            headerActions.appendChild(themeBtn);
        }
        
        // Element referansını kaydet
        this.elements.themeToggle = themeBtn;
        
        // Buton durumunu güncelle
        this.updateToggleButton();
    },
    
    // Tema değiştirme
    toggleTheme() {
        // Temayı tersine çevir
        this.isDark = !this.isDark;
        
        // Temayı uygula
        this.applyTheme();
        
        // Haptik geribildirim (titreşim) - destekleniyorsa
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        // Değişikliği kaydet
        localStorage.setItem('theme-preference', this.isDark ? 'dark' : 'light');
        
        // Buton durumunu güncelle
        this.updateToggleButton();
        
        // Durum mesajı göster
        this.showThemeChangeMessage();
    },
    
    // Temayı doğrudan ayarla
    setTheme(isDark) {
        if (this.isDark !== isDark) {
            this.isDark = isDark;
            this.applyTheme();
            localStorage.setItem('theme-preference', isDark ? 'dark' : 'light');
            this.updateToggleButton();
        }
    },
    
    // Temayı uygula
    applyTheme() {
        if (this.isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    },
    
    // Buton görünümünü güncelle
    updateToggleButton() {
        if (!this.elements.themeToggle) return;
        
        // Butonun ARIA label'ını güncelle
        if (this.isDark) {
            this.elements.themeToggle.setAttribute('aria-label', 'Açık temaya geç');
        } else {
            this.elements.themeToggle.setAttribute('aria-label', 'Koyu temaya geç');
        }
        
        // Not: İkonları değiştirmeye gerek yok çünkü ikisi de her zaman DOM'da,
        // CSS ile hangisinin görüneceğini kontrol ediyoruz
    },
    
    // Tema değişikliği bildirimini göster
    showThemeChangeMessage() {
        // PopupManager mevcutsa kullan
        if (window.PopupManager && window.PopupManager.showStatusMessage) {
            const message = this.isDark 
                ? '<i class="fas fa-moon"></i> Koyu tema aktif' 
                : '<i class="fas fa-sun"></i> Açık tema aktif';
                
            window.PopupManager.showStatusMessage(message, 1800);
            
            // Ekstra görsel feedback - body'ye geçici sınıf ekle
            document.body.classList.add('theme-changed');
            setTimeout(() => {
                document.body.classList.remove('theme-changed');
            }, 1000);
        }
    }
};

// ThemeSwitcher'ı global olarak kullanılabilir yap ve otomatik başlat
window.ThemeSwitcher = ThemeSwitcher.init();

// İlk yüklemede bazen hata olursa diye fazladan kontrol
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('themeToggleBtn')) {
        console.warn("ThemeSwitcher: Otomatik başlatma çalışmamış, tekrar deneniyor...");
        window.ThemeSwitcher = ThemeSwitcher.init();
    }
});
