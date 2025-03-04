/**
 * Menu Arama ve Filtreleme Fonksiyonları - DÜZELTME
 * - Etiket filtresi düzeltildi (tıklanabilir etiketler artık çalışıyor)
 * - DOM elementlerini doğru şekilde seçme
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Search.js yüklendi - etiket filtreleme düzeltildi');
    
    // DOM elementlerini seç
    const searchInput = document.getElementById('menuSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Tüm menü öğeleri için collection oluştur
    let allMenuItems = [];
    
    // Sonuç yok mesajı oluştur
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
        <div class="no-results-emoji">🔍</div>
        <h3 class="no-results-title">Sonuç bulunamadı</h3>
        <p class="no-results-message">Farklı bir arama terimi deneyin veya filtreleri temizleyin.</p>
    `;
    
    // Sayfadaki tüm menü öğelerini topla
    function collectAllMenuItems() {
        allMenuItems = Array.from(document.querySelectorAll('.menu-item'));
        console.log(`Toplam ${allMenuItems.length} menü öğesi bulundu.`);
    }
    
    // İlk yüklemede menü öğelerini topla
    collectAllMenuItems();
    
    // Menü öğelerinin yüklenmesini bekleyen bir kontrol mekanizması
    if (allMenuItems.length === 0) {
        // Biraz bekleyip tekrar dene (DOMContentLoaded'dan sonra menu öğeleri JS ile eklenmiş olabilir)
        setTimeout(() => {
            collectAllMenuItems();
            // Menü öğeleri yüklendiyse, arama sistemini başlat
            if (allMenuItems.length > 0) {
                console.log('Gecikmeli menu öğeleri bulundu, arama aktif ediliyor');
                initializeSearch();
            }
        }, 1000); // 1 saniye bekle
    } else {
        // Menü öğeleri zaten yüklenmişse, arama sistemini hemen başlat
        initializeSearch();
    }
    
    // Arama sistemini başlat
    function initializeSearch() {
        // Arama olay dinleyicisi ekle
        if (searchInput) {
            searchInput.addEventListener('input', performSearch);
        }
        
        // Filtre butonları için olay dinleyicileri ekle
        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                // Aktif sınıfını diğer butonlardan kaldır
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Bu butona aktif sınıfını ekle
                this.classList.add('active');
                // Aramayı gerçekleştir
                performSearch();
                
                // Dokunma geri bildirimi
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(50);
                }
                
                console.log(`Filtre uygulandı: ${this.getAttribute('data-filter')}`);
            });
        });
    }
    
    // Arama ve filtreleme işlevini gerçekleştir
    function performSearch() {
        // En güncel menü öğelerini yeniden topla (yeni eklenenler olabilir)
        collectAllMenuItems();
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const activeFilterBtn = document.querySelector('.filter-btn.active');
        const activeFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
        
        console.log(`Arama gerçekleştiriliyor... Terim: "${searchTerm}", Filtre: ${activeFilter}`);
        
        let visibleItemsCount = 0;
        let sectionVisibility = {};
        
        // Tüm menü öğelerini kontrol et
        allMenuItems.forEach(item => {
            // Öğenin içindeki tüm metni al
            const itemText = item.textContent.toLowerCase();
            
            // Öğenin food-tag sınıflı elementlerini bul
            const tagElements = Array.from(item.querySelectorAll('.food-tag'));
            let itemTags = [];
            
            // Her tag elementinden sınıf isimlerini çıkar
            tagElements.forEach(tagEl => {
                const classList = tagEl.className.split(' ');
                // tag-xxxx formatındaki sınıfları bul
                classList.forEach(className => {
                    if (className.startsWith('tag-')) {
                        const tagName = className.replace('tag-', '');
                        itemTags.push(tagName);
                    }
                });
            });
            
            // Eğer food-tag elementi yoksa data-tags özniteliğini kontrol et
            if (itemTags.length === 0 && item.hasAttribute('data-tags')) {
                itemTags = item.getAttribute('data-tags').split(',').map(tag => tag.trim());
            }
            
            // Debug: Öğenin etiketlerini göster
            if (itemTags.length > 0) {
                console.log(`Öğe: ${item.querySelector('.menu-item-title')?.textContent} - Etiketler:`, itemTags);
            }
            
            // Filtre ve arama terimine göre görünürlüğü belirle
            const matchesFilter = activeFilter === 'all' || itemTags.includes(activeFilter);
            const matchesSearch = !searchTerm || itemText.includes(searchTerm);
            
            // Hem filtre hem de arama ile eşleşiyorsa göster
            if (matchesFilter && matchesSearch) {
                item.style.display = 'block';
                visibleItemsCount++;
                
                // Bu öğenin bağlı olduğu bölümü de görünür yap
                const section = findParentSection(item);
                if (section && section.id) {
                    sectionVisibility[section.id] = true;
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Bölümlerin görünürlüğünü güncelle ve sonuç bulunamazsa mesaj göster
        updateSectionVisibility(sectionVisibility, activeFilter, searchTerm);
        
        console.log(`Arama tamamlandı. ${visibleItemsCount} öğe gösteriliyor.`);
    }
    
    // Bir menü öğesinin bağlı olduğu bölümü bul
    function findParentSection(element) {
        let current = element;
        while (current && !current.classList.contains('menu-section')) {
            current = current.parentElement;
        }
        return current;
    }
    
    // Bölümlerin görünürlüğünü güncelle ve sonuç bulunamazsa mesaj göster
    function updateSectionVisibility(sectionVisibility, activeFilter, searchTerm) {
        const menuSections = document.querySelectorAll('.menu-section');
        
        menuSections.forEach(section => {
            // Bu bölümün ID'si
            const sectionId = section.id;
            
            // Eğer bölüm favoriler ise ve filtre favoriler değilse, görünürlüğü değiştirme
            if (sectionId === 'favoritesSection' && activeFilter !== 'favorites') {
                section.style.display = 'none';
                return;
            }
            
            // Bölüm başlığını bul
            const sectionTitle = section.querySelector('.section-title');
            
            // Bu bölümdeki görünür öğeleri kontrol et
            const visibleItems = Array.from(section.querySelectorAll('.menu-item')).filter(
                item => item.style.display !== 'none'
            );
            
            // Eğer bölümde hiç görünür öğe yoksa
            if (visibleItems.length === 0) {
                // Bölümü gizle veya "sonuç bulunamadı" mesajı göster
                if (activeFilter !== 'all' || searchTerm) {
                    // Arama veya filtreleme yapılıyorsa bölümü gizle
                    section.style.display = 'none';
                } else {
                    // Normal görünümde, tüm bölümler görünür olmalı
                    section.style.display = 'block';
                }
            } else {
                // Bölümü göster
                section.style.display = 'block';
                
                // Mevcut "sonuç bulunamadı" mesajını kaldır
                const existingNoResults = section.querySelector('.no-results');
                if (existingNoResults) {
                    existingNoResults.remove();
                }
            }
        });
        
        // Eğer hiçbir bölüm görünür değilse genel bir "sonuç bulunamadı" mesajı göster
        const visibleSections = Array.from(menuSections).filter(
            section => section.style.display !== 'none'
        );
        
        if (visibleSections.length === 0 && (activeFilter !== 'all' || searchTerm)) {
            // Ana içerik alanını bul
            const mainContainer = document.querySelector('.main-container');
            if (mainContainer) {
                // Mevcut genel "sonuç bulunamadı" mesajını kontrol et
                let generalNoResults = document.getElementById('generalNoResults');
                
                if (!generalNoResults) {
                    // Oluştur ve ekle
                    generalNoResults = document.createElement('div');
                    generalNoResults.id = 'generalNoResults';
                    generalNoResults.className = 'no-results';
                    generalNoResults.innerHTML = `
                        <div class="no-results-emoji">🔍</div>
                        <h3 class="no-results-title">Sonuç bulunamadı</h3>
                        <p class="no-results-message">Arama kriterlerinize uygun bir sonuç bulunamadı.</p>
                        <button id="resetSearchBtn" class="btn btn-primary">Filtreleri Temizle</button>
                    `;
                    
                    mainContainer.appendChild(generalNoResults);
                    
                    // Temizleme butonuna olay ekle
                    const resetButton = document.getElementById('resetSearchBtn');
                    if (resetButton) {
                        resetButton.addEventListener('click', () => {
                            // Arama kutusunu temizle
                            if (searchInput) {
                                searchInput.value = '';
                            }
                            
                            // Tümü filtresini seç
                            const allFilterBtn = document.querySelector('.filter-btn[data-filter="all"]');
                            if (allFilterBtn) {
                                allFilterBtn.click();
                            } else {
                                // Aktif filtreyi kaldır
                                filterButtons.forEach(btn => btn.classList.remove('active'));
                                // Aramayı yeniden çalıştır
                                performSearch();
                            }
                            
                            // Mesajı kaldır
                            generalNoResults.remove();
                        });
                    }
                }
            }
        } else {
            // Genel "sonuç bulunamadı" mesajını kaldır
            const generalNoResults = document.getElementById('generalNoResults');
            if (generalNoResults) {
                generalNoResults.remove();
            }
        }
    }
    
    // Sayfa değişikliklerini izle ve yeni menü öğeleri eklendiğinde arama sistemini güncelle
    const menuObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        mutations.forEach((mutation) => {
            // Yeni bir node eklendiyse ve o node bir menu-item içeriyorsa
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        if (
                            node.classList && node.classList.contains('menu-item') ||
                            node.querySelectorAll && node.querySelectorAll('.menu-item').length > 0
                        ) {
                            shouldUpdate = true;
                        }
                    }
                });
            }
        });
        
        // Eğer menü öğeleri eklendiyse, arama sistemini güncelle
        if (shouldUpdate) {
            collectAllMenuItems();
            // Aktif bir arama varsa, yeniden çalıştır
            if (searchInput && searchInput.value.trim() || document.querySelector('.filter-btn.active:not([data-filter="all"])')) {
                performSearch();
            }
        }
    });
    
    // Menü bölümlerini izle
    document.querySelectorAll('.menu-section').forEach((section) => {
        menuObserver.observe(section, { childList: true, subtree: true });
    });
    
    // Ana içerik konteyneri varsa, ona da yeni bölümler eklendiğinde izle
    const mainContainer = document.querySelector('.main-container');
    if (mainContainer) {
        menuObserver.observe(mainContainer, { childList: true });
    }
    
    // İlk yüklemede arama yap (varsayılan filtreleme için)
    setTimeout(performSearch, 500);
});
