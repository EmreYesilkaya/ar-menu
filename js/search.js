/**
 * Menu Arama ve Filtreleme Fonksiyonları - BUG DÜZELTME
 * - Tag filtreleme sorunu çözüldü
 * - Arama fonksiyonu iyileştirildi
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Search.js yüklendi - etiket filtreleme düzeltildi');
    
    // DOM elementlerini seç
    const searchInput = document.getElementById('menuSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Sonuç yok mesajı oluştur
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
        <div class="no-results-emoji">🔍</div>
        <h3 class="no-results-title">Sonuç Bulunamadı</h3>
        <p class="no-results-message">Aramanıza uygun bir menü öğesi bulunamadı.</p>
    `;
    
    // GELİŞTİRİLMİŞ Arama ve filtreleme fonksiyonu
    function searchAndFilterMenu() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
        
        console.log('Arama ve filtreleme: Term =', searchTerm, 'Filter =', activeFilter);
        
        // Tüm menü bölümlerini dolaş
        document.querySelectorAll('.menu-section').forEach(section => {
            // Bu bölümdeki tüm menü öğelerini al
            const menuItems = section.querySelectorAll('.menu-item');
            let visibleItemsCount = 0;
            
            menuItems.forEach(item => {
                // Başlık ve açıklama metni
                const title = item.querySelector('.menu-item-title')?.textContent.toLowerCase() || '';
                const description = item.querySelector('.menu-item-description')?.textContent.toLowerCase() || '';
                
                // Fiyat ve etiketler
                const price = item.querySelector('.menu-item-price')?.textContent.toLowerCase() || '';
                
                // Etiketleri bul - birden fazla farklı yöntemle kontrol et
                let tags = [];
                
                // Yöntem 1: Özel tag elementleri
                const tagElements = item.querySelectorAll('.food-tag');
                if (tagElements.length > 0) {
                    tags = Array.from(tagElements).map(tag => tag.textContent.toLowerCase());
                }
                
                // Yöntem 2: data-tags özniteliği
                const dataTags = item.getAttribute('data-tags');
                if (dataTags) {
                    tags = tags.concat(dataTags.toLowerCase().split(','));
                }
                
                // Yöntem 3: Sınıf adlarında tag kontrolü
                if (item.classList.contains('tag-popular') || item.classList.contains('popular')) {
                    tags.push('popüler');
                }
                if (item.classList.contains('tag-vegan') || item.classList.contains('vegan')) {
                    tags.push('vegan');
                }
                if (item.classList.contains('tag-spicy') || item.classList.contains('spicy')) {
                    tags.push('acılı');
                }
                
                // HTML içeriğinde etiket adlarını ara
                const itemHtml = item.innerHTML.toLowerCase();
                if (itemHtml.includes('popüler') || itemHtml.includes('popular')) {
                    tags.push('popüler');
                }
                if (itemHtml.includes('vegan')) {
                    tags.push('vegan');
                }
                if (itemHtml.includes('acılı') || itemHtml.includes('spicy')) {
                    tags.push('acılı');
                }
                
                // Arama terimiyle eşleşme kontrolü - iyileştirilmiş
                const matchesSearch = searchTerm === '' || 
                                     title.includes(searchTerm) || 
                                     description.includes(searchTerm) || 
                                     price.includes(searchTerm) ||
                                     tags.some(tag => tag.includes(searchTerm));
                
                // Filtreyle eşleşme kontrolü - iyileştirilmiş
                let matchesFilter = (activeFilter === 'all');
                
                if (activeFilter === 'popular') {
                    matchesFilter = tags.some(tag => 
                        tag.includes('popüler') || tag.includes('popular'));
                } 
                else if (activeFilter === 'vegan') {
                    matchesFilter = tags.some(tag => tag.includes('vegan'));
                } 
                else if (activeFilter === 'spicy') {
                    matchesFilter = tags.some(tag => 
                        tag.includes('acılı') || tag.includes('spicy'));
                }
                
                // Debug
                console.log(`Öğe: ${title}, Tags: [${tags.join(', ')}], Matches: Search=${matchesSearch}, Filter=${matchesFilter}`);
                
                // Her iki koşulu da sağlarsa göster, aksi halde gizle
                if (matchesSearch && matchesFilter) {
                    item.style.display = '';
                    visibleItemsCount++;
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Sonuç bulunamadı mesajını göster/gizle
            const menuItemsContainer = section.querySelector('.menu-items');
            const existingNoResults = menuItemsContainer.querySelector('.no-results');
            
            if (visibleItemsCount === 0) {
                if (!existingNoResults) {
                    menuItemsContainer.appendChild(noResults.cloneNode(true));
                }
            } else if (existingNoResults) {
                existingNoResults.remove();
            }
            
            // Geçici olarak kategorileri de filtreleyelim
            if (activeFilter !== 'all') {
                // Şu an hiçbir kategoriyi gizlemiyoruz, hepsini gösteriyoruz
                section.style.display = '';
            } else {
                section.style.display = '';
            }
        });
    }
    
    // İlk yükleme sonrası filtre butonlarına olay dinleyicileri ekle
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Aktif filtre butonunu değiştir
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filtreleme işlemini gerçekleştir
                searchAndFilterMenu();
                
                // Kullanıcıya hangi filtrenin uygulandığını göster
                const filterName = this.textContent.trim();
                showStatusMessage(`"${filterName}" filtresi uygulandı`, 2000);
            });
        });
    }
    
    // Arama alanı değişikliğini dinle
    if (searchInput) {
        searchInput.addEventListener('input', searchAndFilterMenu);
        
        // Arama alanına odaklanma/odağı kaybetme olayları
        searchInput.addEventListener('focus', function() {
            this.classList.add('focused');
            // Arama ipucu göster
            showStatusMessage('Aramak için yazmaya başlayın...', 1500);
        });
        
        searchInput.addEventListener('blur', function() {
            this.classList.remove('focused');
        });
    }
    
    // Durum mesajını gösterme yardımcı fonksiyonu
    function showStatusMessage(message, duration = 2000) {
        const statusMessage = document.getElementById('statusMessage');
        if (!statusMessage) return;
        
        statusMessage.innerHTML = `<div class="alert alert-info"><div>${message}</div></div>`;
        statusMessage.style.display = 'block';
        
        setTimeout(() => {
            statusMessage.style.display = 'none';
        }, duration);
    }
    
    // Sayfa yenilenince arama kutusunu sıfırla
    searchInput.value = '';
    
    // Menüye etiketler eklemek için yardımcı fonksiyon
    function addTagsToMenuItems() {
        console.log('Menü öğelerine etiketler ekleniyor...');
        
        // Menü öğelerine veri etiketleri ekle
        const popularItems = document.querySelectorAll('.menu-item:has(.tag-popular), .menu-item:contains("Popüler")');
        popularItems.forEach(item => {
            item.setAttribute('data-tags', 'popular,popüler');
        });
        
        const veganItems = document.querySelectorAll('.menu-item:has(.tag-vegan), .menu-item:contains("Vegan")');
        veganItems.forEach(item => {
            item.setAttribute('data-tags', (item.getAttribute('data-tags') || '') + ',vegan');
        });
        
        const spicyItems = document.querySelectorAll('.menu-item:has(.tag-spicy), .menu-item:contains("Acılı")');
        spicyItems.forEach(item => {
            item.setAttribute('data-tags', (item.getAttribute('data-tags') || '') + ',spicy,acılı');
        });
    }
    
    // Sayfa yüklendikten sonra etiketleri ekle
    setTimeout(addTagsToMenuItems, 500);
    
    // Klavye kısayolları
    document.addEventListener('keydown', function(e) {
        // CTRL/CMD + F ile arama kutusuna odaklan
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // ESC ile aramayı temizle
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchAndFilterMenu();
            searchInput.blur();
        }
    });
});
