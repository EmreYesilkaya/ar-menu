/**
 * Premium Header İşlevselliği - Geliştirildi
 */
document.addEventListener('DOMContentLoaded', function() {
  // Header scroll efekti
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 30) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });
  
  // Arama butonu işlevselliği
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      // Arama kutusuna odaklan
      const searchInput = document.getElementById('menuSearch');
      if (searchInput) {
        searchInput.focus();
        
        // Smooth scroll to search
        searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Visual feedback
        searchBtn.classList.add('active');
        setTimeout(() => searchBtn.classList.remove('active'), 300);
        
        // Haptic feedback if supported
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(40);
        }
      }
    });
  }
  
  // Favoriler butonu işlevi - GÜNCELLENDI: Favoriler bölümüne kaydırma eklendi
  const favoritesBtn = document.getElementById('favoritesBtn');
  if (favoritesBtn) {
    favoritesBtn.addEventListener('click', function() {
      // Favori sayısı efekti
      const badge = favoritesBtn.querySelector('.notification-badge');
      if (badge) {
        badge.classList.add('pulse');
        setTimeout(() => badge.classList.remove('pulse'), 600);
      }
      
      // Haptic feedback if supported
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([30, 20, 30]);
      }
      
      // Favoriler bölümünü bul
      const favoritesSection = document.getElementById('favoritesSection');
      if (favoritesSection) {
        // Favoriler sekmesini aktif et
        const menuTabs = document.querySelectorAll('.menu-tab');
        menuTabs.forEach(tab => {
          if (tab.getAttribute('data-target') === 'favorites') {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
        });
        
        // Favoriler bölümünü vurgula
        favoritesSection.classList.add('highlight-section');
        setTimeout(() => {
          favoritesSection.classList.remove('highlight-section');
        }, 2000);
        
        // Favoriler bölümüne kaydır
        favoritesSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Favoriler bölümü bulunamazsa eski mesajı göster
        showStatusMessage('Favorileriniz burada gösterilecek', 2000);
      }
    });
  }
  
  // Bilgi butonu işlevi
  const infoBtn = document.getElementById('infoBtn');
  if (infoBtn) {
    infoBtn.addEventListener('click', function() {
      // AR kullanım kılavuzunu göster
      const instructionsModal = document.getElementById('instructionsModal');
      if (instructionsModal) {
        instructionsModal.style.display = 'flex';
        
        // Haptic feedback if supported
        if (window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(40);
        }
      }
    });
  }
  
  // Header logo interaktivitesi
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', function() {
      // Sayfanın en üstüne yumuşak kaydırma
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Favorileri sayacını güncelleme yardımcı fonksiyonu
  window.updateFavoritesCount = function(count) {
    const badge = document.querySelector('.notification-badge');
    if (badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
      
      if (count > 0) {
        badge.classList.add('pulse');
        setTimeout(() => badge.classList.remove('pulse'), 600);
      }
    }
  };
  
  // İlk yüklemede favori sayısını ayarla
  const savedFavorites = JSON.parse(localStorage.getItem('favoriteItems')) || [];
  window.updateFavoritesCount(savedFavorites.length);
  
  // Status mesajını gösterme yardımcı fonksiyonu
  function showStatusMessage(message, duration = 2000) {
    const statusMessage = document.getElementById('statusMessage');
    if (!statusMessage) return;
    
    statusMessage.innerHTML = `<div class="alert alert-info"><div>${message}</div></div>`;
    statusMessage.style.display = 'block';
    
    setTimeout(() => {
      statusMessage.style.display = 'none';
    }, duration);
  }
});
