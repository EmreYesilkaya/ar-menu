/**
 * Etiket Yönetimi ve Etiket Filtreleri için İşlevler
 * Etiketlerin tıklanabilirliği ve filtrelemeyi sağlar
 */

document.addEventListener('DOMContentLoaded', function() {
    // Menü öğeleri yüklendikten sonra çalışacak fonksiyon
    function makeTagsClickable() {
        document.querySelectorAll('.food-tag:not(.tag-more)').forEach(tag => {
            // Etiket adını belirle
            let tagName = '';
            tag.classList.forEach(cls => {
                if (cls.startsWith('tag-') && cls !== 'tag-more' && cls !== 'food-tag') {
                    tagName = cls.replace('tag-', '');
                }
            });
            
            // Eğer tag henüz tıklanabilir değilse
            if (tagName && !tag.hasAttribute('data-clickable')) {
                tag.setAttribute('data-clickable', 'true');
                tag.classList.add('clickable');
                
                // Tıklama olayı ekle
                tag.addEventListener('click', function(e) {
                    e.stopPropagation(); // Ana menü öğesine tıklama olayının yayılmasını engelle
                    
                    console.log(`Etiket tıklandı: ${tagName}`);
                    
                    // İlgili filtreyi aktif et
                    if (window.activateSpecialFilter) {
                        window.activateSpecialFilter(tagName, true);
                    } else {
                        console.warn('activateSpecialFilter fonksiyonu bulunamadı');
                    }
                    
                    // Haptic geri bildirim (iOS)
                    if ('vibrate' in navigator) {
                        navigator.vibrate(20);
                    }
                });
            }
        });
    }
    
    // Etiketlerin genişletilip daraltılmasını sağlayan fonksiyon
    function setupExpandableTags() {
        document.querySelectorAll('.tag-more').forEach(moreTag => {
            // Zaten işlenmişse atlayalım
            if (moreTag.hasAttribute('data-initialized')) {
                return;
            }
            
            // İşlenmiş olarak işaretleyelim
            moreTag.setAttribute('data-initialized', 'true');
            
            // Etiket container'ı bul
            const tagContainer = moreTag.closest('.food-tags');
            if (!tagContainer) return;
            
            // Gizli etiketleri bul
            const hiddenTags = tagContainer.querySelectorAll('.food-tag.hidden-tag');
            if (!hiddenTags.length) return;
            
            // Etiket sayısını göster
            moreTag.textContent = `+${hiddenTags.length} daha`;
            
            // Başlangıç durumunda tüm gizli etiketleri gizle
            hiddenTags.forEach(tag => {
                tag.classList.add('hidden');
                tag.style.display = 'none';
            });
            
            // Tıklama olayı ekle
            moreTag.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Ana menü öğesine tıklama olayının yayılmasını engelle
                
                // Tıklandı animasyonu ekle
                this.classList.add('clicked');
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 300); 
                
                // Haptic geri bildirim (mobil dokunma hissi)
                if ('vibrate' in navigator) {
                    navigator.vibrate(20);
                }
                
                // Dalga efekti ekle
                createRippleEffect(this, e);
                
                // Mevcut durum
                const isExpanded = tagContainer.classList.contains('expanded');
                
                if (!isExpanded) {
                    // ====== GENİŞLET ======
                    // İlk önce konteyneri genişlet
                    tagContainer.classList.add('expanded');
                    
                    // Etiketleri sırayla görünür yap - kaskad animasyonu için
                    hiddenTags.forEach((tag, index) => {
                        // Önce görünür hale getir
                        tag.style.display = 'inline-flex';
                        
                        // Kısa bir gecikme sonra animasyon başlat
                        setTimeout(() => {
                            tag.classList.remove('hidden');
                            tag.classList.add('fade-in');
                            
                            // Emoji güncellemesi yap (önemli!)
                            if (window.addEmojiToTag) {
                                window.addEmojiToTag(tag);
                            }
                            
                            // Bir süre sonra fazladan classı kaldır
                            setTimeout(() => {
                                tag.classList.remove('fade-in');
                            }, 500);
                        }, 30 * (index + 1));
                    });
                    
                    // Buton metnini değiştir
                    moreTag.textContent = 'Daha az';
                    moreTag.classList.add('active');
                    
                    // Etiketler görünür olduktan sonra tıklanabilirliği ekle
                    setTimeout(makeTagsClickable, 300);
                    
                    // Emojileri güncelle
                    if (window.initEmojiTags) {
                        setTimeout(window.initEmojiTags, 100);
                    }
                    
                } else {
                    // ====== DARALT ======
                    // Animasyonlu şekilde gizleme
                    hiddenTags.forEach((tag, index) => {
                        // Ters sırada animasyon (son etiketler önce kaybolur)
                        const delay = 30 * (hiddenTags.length - index - 1);
                        
                        // Önce fade-out animasyonu başlat
                        setTimeout(() => {
                            tag.classList.add('fade-out');
                            
                            // Animasyon bitince tamamen gizle
                            setTimeout(() => {
                                tag.classList.remove('fade-out');
                                tag.classList.add('hidden');
                                tag.style.display = 'none';
                            }, 300);
                        }, delay);
                    });
                    
                    // Konteyneri animasyonlu şekilde daralt
                    setTimeout(() => {
                        tagContainer.classList.remove('expanded');
                    }, 50);
                    
                    // Buton metnini değiştir
                    moreTag.textContent = `+${hiddenTags.length} daha`;
                    moreTag.classList.remove('active');
                }
            });
        });
    }
    
    // Dalga efekti oluştur
    function createRippleEffect(element, event) {
        // Var olan ripple'ları kaldır
        const oldRipples = element.querySelectorAll('.ripple');
        oldRipples.forEach(ripple => ripple.remove());
        
        // Yeni ripple elementi oluştur
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        // Element pozisyon ve boyutlarını al
        const rect = element.getBoundingClientRect();
        
        // Ripple boyutunu hesapla
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = `${size}px`;
        
        // Ripple pozisyonunu hesapla
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Ripple'ı elemente ekle
        element.appendChild(ripple);
        
        // Animasyon sonunda ripple'ı kaldır
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Sayfa içi filtreleme için işlevler
    let menuItemObserver = null;
    
    // Etiket yöneticisini başlat
    function initTagManager() {
        // Etiketleri tıklanabilir yap
        makeTagsClickable();
        
        // Genişletilebilir etiketleri ayarla
        setupExpandableTags();
        
        // Yeni eklenen menü öğelerini izle
        if (!menuItemObserver) {
            menuItemObserver = new MutationObserver((mutations) => {
                let hasNewMenuItems = false;
                
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            // HTML elementi mi kontrol et
                            if (node.nodeType === 1) {
                                // Menü öğesi veya içinde etiketler var mı
                                if (node.classList?.contains('menu-item') || 
                                    node.querySelector?.('.menu-item') ||
                                    node.classList?.contains('food-tag') ||
                                    node.querySelector?.('.food-tag')) {
                                    hasNewMenuItems = true;
                                }
                            }
                        });
                    }
                });
                
                // Yeni menü öğeleri eklendiyse etiketleri güncelleyelim
                if (hasNewMenuItems) {
                    setTimeout(() => {
                        makeTagsClickable();
                        setupExpandableTags();
                    }, 100);
                }
            });
            
            // Ana konteyneri izleyelim
            const mainContainer = document.querySelector('.main-container');
            if (mainContainer) {
                menuItemObserver.observe(mainContainer, {
                    childList: true,
                    subtree: true
                });
            }
        }
    }
    
    // Sayfa yüklendiğinde tag yöneticisini başlat
    initTagManager();
    
    // Global erişim için dışa aktar
    window.makeTagsClickable = makeTagsClickable;
    window.setupExpandableTags = setupExpandableTags;
    
    // Sayfa tam yüklendikten sonra bir kez daha kontrol et
    window.addEventListener('load', function() {
        // Etiketlerin düzgün çalışmasını sağla
        setTimeout(function() {
            makeTagsClickable();
            setupExpandableTags();
        }, 500);
    });
});
