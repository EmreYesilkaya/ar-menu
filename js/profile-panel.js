/**
 * Profil Paneli İşlevselliği
 * Kullanıcı profil panelini açma, kapama ve dark mode uyumlu hale getirme
 */

document.addEventListener('DOMContentLoaded', function() {
    // Profil butonunu bul
    const profileBtn = document.querySelector('.bottom-nav-item[data-action="profile"]');
    
    if (profileBtn) {
        // Var olan tıklama olayını sakla
        const originalClick = profileBtn.onclick;
        
        // Yeni tıklama olayı ekle
        profileBtn.onclick = function(e) {
            e.preventDefault();
            
            // Profil paneli var mı?
            let profilePanel = document.querySelector('.profile-panel');
            
            // Yoksa oluştur
            if (!profilePanel) {
                profilePanel = document.createElement('div');
                profilePanel.className = 'profile-panel';
                profilePanel.innerHTML = `
                    <div class="profile-panel-header">
                        <div class="profile-panel-title">Profilim</div>
                        <button class="close-panel" id="closeProfilePanel"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="profile-panel-content">
                        <div class="profile-user-info">
                            <div class="profile-avatar-large">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="profile-user-details">
                                <div class="profile-username">Misafir Kullanıcı</div>
                                <div class="profile-email">kullanici@example.com</div>
                                <div class="profile-membership">
                                    <i class="fas fa-crown"></i> Premium Üye
                                </div>
                            </div>
                        </div>
                        <div class="profile-actions">
                            <a href="#" class="profile-action-btn">
                                <div class="profile-action-icon">
                                    <i class="fas fa-cog"></i>
                                </div>
                                <div class="profile-action-text">Ayarlar</div>
                                <div class="profile-action-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </a>
                            <a href="#" class="profile-action-btn">
                                <div class="profile-action-icon">
                                    <i class="fas fa-calendar-alt"></i>
                                </div>
                                <div class="profile-action-text">Masa Rezervasyonları</div>
                                <div class="profile-action-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </a>
                            <a href="#" class="profile-action-btn">
                                <div class="profile-action-icon">
                                    <i class="fas fa-shopping-bag"></i>
                                </div>
                                <div class="profile-action-text">Sipariş Geçmişi</div>
                                <div class="profile-action-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </a>
                            <a href="#" class="profile-action-btn">
                                <div class="profile-action-icon">
                                    <i class="fas fa-star"></i>
                                </div>
                                <div class="profile-action-text">Değerlendirmelerim</div>
                                <div class="profile-action-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </a>
                            <a href="#" class="profile-action-btn">
                                <div class="profile-action-icon">
                                    <i class="fas fa-ticket-alt"></i>
                                </div>
                                <div class="profile-action-text">Kuponlarım</div>
                                <div class="profile-action-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </a>
                            <a href="#" class="profile-action-btn">
                                <div class="profile-action-icon">
                                    <i class="fas fa-bell"></i>
                                </div>
                                <div class="profile-action-text">Bildirim Ayarları</div>
                                <div class="profile-action-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </a>
                            <a href="#" class="profile-action-btn profile-logout-btn">
                                <div class="profile-action-icon">
                                    <i class="fas fa-sign-out-alt"></i>
                                </div>
                                <div class="profile-action-text">Çıkış Yap</div>
                                <div class="profile-action-arrow">
                                    <i class="fas fa-chevron-right"></i>
                                </div>
                            </a>
                        </div>
                    </div>
                `;
                document.body.appendChild(profilePanel);
                
                // Kapatma düğmesi işlevselliği
                const closeBtn = profilePanel.querySelector('#closeProfilePanel');
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        profilePanel.classList.remove('active');
                    });
                }
                
                // Panel dışına tıklandığında kapat
                document.addEventListener('click', function(e) {
                    if (profilePanel.classList.contains('active') && 
                        !profilePanel.contains(e.target) && 
                        e.target !== profileBtn && 
                        !profileBtn.contains(e.target)) {
                        profilePanel.classList.remove('active');
                    }
                });
            }
            
            // Paneli göster
            profilePanel.classList.add('active');
            
            // Dark mode durumunu kontrol et ve uygula
            if (document.body.classList.contains('dark-mode')) {
                applyProfileDarkMode();
            }
            
            // Orijinal tıklama olayını çağır (varsa)
            if (typeof originalClick === 'function') {
                originalClick.call(this, e);
            }
        };
    }
    
    // Dark mode değişimini izle
    const bodyObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const isDarkMode = document.body.classList.contains('dark-mode');
                
                // Profil panelini güncelle
                if (isDarkMode) {
                    applyProfileDarkMode();
                } else {
                    removeProfileDarkMode();
                }
            }
        });
    });
    
    // Body elemanını izle
    bodyObserver.observe(document.body, { attributes: true });
    
    // Dark mode profil paneli stillerini uygula
    function applyProfileDarkMode() {
        const panel = document.querySelector('.profile-panel');
        if (panel) {
            panel.style.backgroundColor = 'var(--card-bg)';
            panel.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            panel.style.boxShadow = '0 -5px 25px rgba(0, 0, 0, 0.3)';
            
            panel.querySelectorAll('.profile-panel-header').forEach(el => {
                el.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            });
            
            panel.querySelectorAll('.profile-panel-title').forEach(el => {
                el.style.color = 'var(--text-dark)';
            });
            
            panel.querySelectorAll('.close-panel').forEach(el => {
                el.style.color = 'var(--text-medium)';
            });
            
            panel.querySelectorAll('.profile-username').forEach(el => {
                el.style.color = 'var(--text-dark)';
            });
            
            panel.querySelectorAll('.profile-user-info').forEach(el => {
                el.style.borderColor = 'rgba(255, 255, 255, 0.05)';
            });
            
            // Profil butonları için dark mode stillerini güçlendirilmiş şekilde uygula
            panel.querySelectorAll('.profile-action-btn').forEach(el => {
                // Tamamen opak arka plan - beyaz rengi engellemek için
                el.style.backgroundColor = 'rgba(42, 43, 70, 0.6)';
                el.style.color = 'var(--text-dark)';
                el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                
                // Buton içindeki metni doğrudan güncelle
                const textElement = el.querySelector('.profile-action-text');
                if (textElement) {
                    textElement.style.color = 'var(--text-dark)';
                }
                
                // Ok ikonunu doğrudan güncelle
                const arrowElement = el.querySelector('.profile-action-arrow');
                if (arrowElement) {
                    arrowElement.style.color = 'var(--text-medium)';
                }
            });
            
            panel.querySelectorAll('.profile-action-icon').forEach(el => {
                el.style.backgroundColor = 'rgba(106, 90, 224, 0.15)';
                el.style.color = 'var(--primary-light)';
            });
            
            // Çıkış yap butonu için özel stiller - daha güçlü şekilde uygula
            panel.querySelectorAll('.profile-logout-btn').forEach(el => {
                el.style.backgroundColor = 'rgba(255, 90, 101, 0.08)';
                el.style.borderColor = 'rgba(255, 90, 101, 0.15)';
                
                // Çıkış butonundaki ikonu özel olarak güncelle
                const iconContainer = el.querySelector('.profile-action-icon');
                if (iconContainer) {
                    iconContainer.style.backgroundColor = 'rgba(255, 90, 101, 0.15)';
                    iconContainer.style.color = '#FF7A82';
                }
            });
            
            // Profil seçenekleri ve iletişim butonu için dark mode stillerini güçlendirilmiş şekilde uygula
            panel.querySelectorAll('.profile-option').forEach(el => {
                el.style.backgroundColor = 'rgba(42, 43, 70, 0.6)';
                el.style.color = 'var(--text-dark)';
                el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                el.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
                
                // İkonları güncelle
                const icon = el.querySelector('i');
                if (icon) {
                    icon.style.color = 'var(--primary-light)';
                }
            });
            
            // İletişim butonu için özel stil
            const contactBtn = panel.querySelector('#contactBtn');
            if (contactBtn) {
                contactBtn.style.backgroundColor = 'rgba(106, 90, 224, 0.15)';
                
                const icon = contactBtn.querySelector('i');
                if (icon) {
                    icon.style.color = 'var(--primary-light)';
                }
            }
            
            // Yeni bir stil etiketi ekleyerek inline stil uygula - en güçlü çözüm
            let styleElement = document.getElementById('profile-dark-mode-styles');
            if (!styleElement) {
                styleElement = document.createElement('style');
                styleElement.id = 'profile-dark-mode-styles';
                document.head.appendChild(styleElement);
            }
            
            // CSS kurallarını doğrudan ekle
            styleElement.textContent = `
                body.dark-mode .profile-panel .profile-action-btn {
                    background-color: rgba(42, 43, 70, 0.6) !important;
                    color: var(--text-dark) !important;
                    border-color: rgba(255, 255, 255, 0.08) !important;
                }
                
                body.dark-mode .profile-panel .profile-action-text {
                    color: var(--text-dark) !important;
                }
                
                body.dark-mode .profile-panel .profile-action-icon {
                    background-color: rgba(106, 90, 224, 0.15) !important;
                    color: var(--primary-light) !important;
                }
                
                body.dark-mode .profile-panel .profile-option {
                    background-color: rgba(42, 43, 70, 0.6) !important;
                    color: var(--text-dark) !important;
                    border-color: rgba(255, 255, 255, 0.08) !important;
                }
                
                body.dark-mode .profile-panel .profile-option i {
                    color: var(--primary-light) !important;
                }
                
                body.dark-mode #contactBtn {
                    background-color: rgba(106, 90, 224, 0.15) !important;
                }
            `;
        }
    }
    
    // Dark mode stillerini kaldır
    function removeProfileDarkMode() {
        const panel = document.querySelector('.profile-panel');
        if (panel) {
            panel.style.backgroundColor = '';
            panel.style.borderColor = '';
            panel.style.boxShadow = '';
            
            panel.querySelectorAll('.profile-panel-header').forEach(el => {
                el.style.borderColor = '';
            });
            
            panel.querySelectorAll('.profile-panel-title').forEach(el => {
                el.style.color = '';
            });
            
            panel.querySelectorAll('.close-panel').forEach(el => {
                el.style.color = '';
            });
            
            panel.querySelectorAll('.profile-username').forEach(el => {
                el.style.color = '';
            });
            
            panel.querySelectorAll('.profile-user-info').forEach(el => {
                el.style.borderColor = '';
            });
            
            // Profil butonları için normal stiller
            panel.querySelectorAll('.profile-action-btn').forEach(el => {
                el.style.backgroundColor = '';
                el.style.color = '';
                el.style.borderColor = '';
                el.style.boxShadow = '';
            });
            
            panel.querySelectorAll('.profile-action-icon').forEach(el => {
                el.style.backgroundColor = '';
            });
            
            panel.querySelectorAll('.profile-action-arrow').forEach(el => {
                el.style.color = '';
            });
            
            // Çıkış yap butonu için normal stiller
            panel.querySelectorAll('.profile-logout-btn').forEach(el => {
                el.style.backgroundColor = '';
                el.style.borderColor = '';
            });
            
            // Profil seçenekleri ve iletişim butonu için normal stiller
            panel.querySelectorAll('.profile-option').forEach(el => {
                el.style.backgroundColor = '';
                el.style.color = '';
                el.style.borderColor = '';
                el.style.boxShadow = '';
                
                // İkonları normal haline döndür
                const icon = el.querySelector('i');
                if (icon) {
                    icon.style.color = '';
                }
            });
        }
    }
});
