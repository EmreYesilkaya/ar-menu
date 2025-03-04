/**
 * Menu Arama ve Filtreleme Fonksiyonları
 * AR Restoran projesi için geliştirilen bu kod, menü öğelerini
 * arama ve filtreleme işlevlerini sağlar.
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM elementlerini seç
    const searchInput = document.getElementById('menuSearch');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    const noResults = document.createElement('div');
    
    // Sonuç yok mesajı oluştur
    noResults.className = 'no-results';
    noResults.innerHTML = `
        <div class="no-results-emoji">🔍</div>
        <h3 class="no-results-title">Sonuç Bulunamadı</h3>
        <p class="no-results-message">Aramanıza uygun bir menü öğesi bulunamadı.</p>
    `;
    
    // Arama fonksiyonu
    function searchMenu() {
        const searchTerm = searchInput.value.toLowerCase();
        const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        let resultsFound = false;
        
        menuItems.forEach(item => {
            const title = item.querySelector('.menu-item-title').textContent.toLowerCase();
            const tags = Array.from(item.querySelectorAll('.food-tag')).map(tag => tag.textContent.toLowerCase());
            
            // Hem arama terimine hem de aktif filtreye göre kontrol et
            const matchesSearch = title.includes(searchTerm);
            const matchesFilter = (activeFilter === 'all') || 
                                 (activeFilter === 'vegan' && tags.some(tag => tag.includes('vegan'))) ||
                                 (activeFilter === 'spicy' && tags.some(tag => tag.includes('acılı'))) ||
                                 (activeFilter === 'popular' && tags.some(tag => tag.includes('popüler')));
            
            if (matchesSearch && matchesFilter) {
                item.style.display = '';
                resultsFound = true;
            } else {
                item.style.display = 'none';
            }
        });
        
        // "Sonuç bulunamadı" mesajı için her bölümü kontrol et
        document.querySelectorAll('.menu-section').forEach(section => {
            const visibleItems = section.querySelectorAll('.menu-item[style=""]').length;
            const noResultsExisting = section.querySelector('.no-results');
            
            if (visibleItems === 0) {
                // Bu bölümde sonuç yoksa ve daha önce mesaj eklenmemişse ekle
                if (!noResultsExisting) {
                    section.querySelector('.menu-items').appendChild(noResults.cloneNode(true));
                }
            } else if (noResultsExisting) {
                // Sonuç var ama hala mesaj varsa kaldır
                noResultsExisting.remove();
            }
        });
    }
    
    // Arama alanı değişikliği dinle
    if (searchInput) {
        searchInput.addEventListener('input', searchMenu);
    }
    
    // Filtre butonları için tıklama olayları ekle
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif filtre butonunu değiştir
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filtrelemeyi uygula
            searchMenu();
            
            // Seçilen filtre için geri bildirim göster
            const filterName = button.textContent.trim();
            showStatusMessage(`"${filterName}" filtresi uygulandı`);
        });
    });
    
    // Klavye kısayolları ekle
    document.addEventListener('keydown', function(e) {
        // CTRL/CMD + F ile arama kutusuna odaklan
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            searchInput.focus();
        }
        
        // ESC ile aramayı temizle
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchMenu();
        }
    });
});
