/**
 * DÜZELTILMIŞ KATEGORİLER SİSTEMİ
 * Geriye dönük uyumluluk ile yeni yapıyı birleştirir
 */

(function() {
    // Kategorileri tanımla (içerik değişmedi)
    const categories = [
        { id: 'breakfast', name: 'Kahvaltı', icon: 'fas fa-coffee' },
        { id: 'soups', name: 'Çorbalar', icon: 'fas fa-utensil-spoon' },
        { id: 'salads', name: 'Salatalar', icon: 'fas fa-leaf' },
        { id: 'mainDishes', name: 'Ana Yemekler', icon: 'fas fa-utensils' },
        { id: 'desserts', name: 'Tatlılar', icon: 'fas fa-cookie' },
        { id: 'drinks', name: 'İçecekler', icon: 'fas fa-glass-cheers' },
        { id: 'popular', name: 'Popüler', icon: 'fas fa-fire' },
        { id: 'vegan', name: 'Vegan', icon: 'fas fa-seedling' },
        { id: 'vegetarian', name: 'Vejetaryen', icon: 'fas fa-carrot' },
        { id: 'gluten-free', name: 'Glutensiz', icon: 'fas fa-bread-slice' },
        { id: 'healthy', name: 'Sağlıklı', icon: 'fas fa-heartbeat' },
        { id: 'spicy', name: 'Acı Sevenler', icon: 'fas fa-pepper-hot' },
        { id: 'meat', name: 'Et Çeşitleri', icon: 'fas fa-drumstick-bite' },
        { id: 'seafood', name: 'Deniz Ürünleri', icon: 'fas fa-fish' },
        { id: 'favorites', name: 'Favorilerim', icon: 'fas fa-heart' }
    ];

    // Sayfa yüklendiğinde inicialize et
    document.addEventListener('DOMContentLoaded', initialize);

    function initialize() {
        console.log('🔄 Düzeltilmiş kategoriler sistemi başlatıldı');
        
        // Alt menüdeki kategoriler butonuna tıklama olayı ekle
        const categoriesBtn = document.querySelector('.bottom-nav-item[data-action="categories"]');
        if (categoriesBtn) {
            categoriesBtn.addEventListener('click', handleCategoriesClick);
            console.log('✓ Kategori butonu bağlandı');
        } else {
            console.error('⚠️ Kategoriler butonu bulunamadı!');
        }
        
        // Global erişim için fonksiyonları dışa aktar
        window.Categories = {
            showModal: showCategoriesModal,
            closeModal: closeCategoriesModal,
            select: selectCategory,
            categories: categories
        };
        
        // Debug bilgisi
        console.log(`📋 ${categories.length} kategori yüklendi`);
    }

    // Alt menüdeki kategoriler butonuna tıklama olayını işle
    function handleCategoriesClick(e) {
        e.preventDefault();
        console.log('🔍 Kategoriler butonuna tıklandı');
        
        try {
            // Aktif butonu güncelle
            document.querySelectorAll('.bottom-nav-item').forEach(item => {
                item.classList.remove('active');
            });
            e.currentTarget.classList.add('active');
            
            // Kategoriler modalını göster
            showCategoriesModal();
        } catch (error) {
            console.error('❌ Kategoriler butonuna tıklama işlenirken hata:', error);
        }
    }

    // Kategoriler modalını göster
    function showCategoriesModal() {
        console.log('📂 Kategoriler modalı açılıyor...');
        
        let modal = document.getElementById('categoriesModal');
        
        // Modal yoksa oluştur
        if (!modal) {
            modal = createCategoriesModal();
            setupModalEvents(modal);
        }
        
        // Modalı göster
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
            
            // Scroll engelleme
            document.body.style.overflow = 'hidden';
        }, 10);
    }

    // Kategoriler modalı oluştur
    function createCategoriesModal() {
        console.log('🏗 Kategoriler modalı oluşturuluyor');
        
        const modal = document.createElement('div');
        modal.id = 'categoriesModal';
        modal.className = 'categories-modal';
        
        // Modal içeriği
        let modalHTML = `
            <div class="categories-modal-content">
                <div class="categories-modal-header">
                    <h3>Kategoriler</h3>
                    <button class="categories-close-btn" id="closeCategoriesBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="categories-modal-body">
                    <div class="categories-grid">`;
        
        // Kategorileri ekle
        categories.forEach(category => {
            modalHTML += `
                <div class="category-item" data-category="${category.id}">
                    <div class="category-icon"><i class="${category.icon}"></i></div>
                    <div class="category-name">${category.name}</div>
                </div>
            `;
        });
        
        modalHTML += `
                    </div>
                </div>
            </div>
        `;
        
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        
        return modal;
    }

    // Modal olaylarını ayarla
    function setupModalEvents(modal) {
        // Kapatma butonuna tıklama
        const closeBtn = modal.querySelector('#closeCategoriesBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeCategoriesModal();
            });
        }
        
        // Modal arka planına tıklama ile kapatma
        modal.addEventListener('click', e => {
            if (e.target === modal) {
                closeCategoriesModal();
            }
        });
        
        // Kategori öğelerine tıklama
        const categoryItems = modal.querySelectorAll('.category-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', e => {
                const categoryId = item.getAttribute('data-category');
                console.log(`🔍 Kategori öğesine tıklandı: ${categoryId}`);
                
                // Önce modalı kapat, sonra kaydır
                closeCategoriesModal(() => {
                    selectCategory(categoryId);
                });
            });
        });
    }

    // Kategoriler modalını kapat
    function closeCategoriesModal(callback) {
        const modal = document.getElementById('categoriesModal');
        if (!modal) return;
        
        console.log('📂 Kategoriler modalı kapatılıyor...');
        
        // Scroll engellemeyi kaldır
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        
        // Özel durum düzeltmesi
        document.body.classList.add('categories-modal-closed');
        setTimeout(() => document.body.classList.remove('categories-modal-closed'), 500);
        
        // Modal kapatma animasyonu
        modal.classList.remove('active');
        
        // Animasyon süresinden sonra tamamen kaldır
        setTimeout(() => {
            modal.style.display = 'none';
            
            // Özel olay tetikle - scroll düzeltmeler için
            document.dispatchEvent(new CustomEvent('categoriesModalClosed'));
            
            // Callback varsa çağır
            if (typeof callback === 'function') {
                callback();
            }
        }, 300);
    }

    // Kategori seç ve o bölüme kaydır
    function selectCategory(categoryId) {
        console.log(`📌 Kategori seçildi: ${categoryId}`);
        
        try {
            // Mehmet'in orijinal kategoriler yapısı ile uyumlu kod
            // Önce menü sekmesini kontrol et
            const menuTab = document.querySelector(`.menu-tab[data-target="${categoryId}"]`);
            
            if (menuTab) {
                // Sekmeye tıkla - sekme sistemini kullan
                menuTab.click();
                
                // İlgili bölümü bul ve kaydır
                setTimeout(() => {
                    scrollToSection(categoryId);
                }, 100);
            } 
            else if (categoryId === 'favorites') {
                // Favoriler için özel işlem
                const section = document.getElementById('favoritesSection');
                if (section) {
                    scrollElementIntoView(section);
                }
            }
            else {
                // Özel kategoriler için filtre kullan
                console.log('Sekme bulunamadı, filtre uygulanıyor');
                if (typeof window.activateSpecialFilter === 'function') {
                    window.activateSpecialFilter(categoryId);
                } else {
                    console.warn('Filtre fonksiyonu bulunamadı');
                }
            }
            
            // Dokunsal geri bildirim
            if ('vibrate' in navigator) {
                navigator.vibrate(30);
            }
        } catch (error) {
            console.error('❌ Kategori seçme işleminde hata:', error);
        }
    }
    
    // Belirli bir bölüme kaydırma yardımcı fonksiyonu
    function scrollToSection(categoryId) {
        // Bölümün ID'sini oluştur
        let sectionId = `${categoryId}Section`;
        
        // categoryId zaten "Section" ile bitiyorsa düzelt
        if (categoryId.endsWith('Section')) {
            sectionId = categoryId;
        }
        
        const section = document.getElementById(sectionId);
        if (section) {
            scrollElementIntoView(section);
        } else {
            console.warn(`⚠️ Bölüm bulunamadı: ${sectionId}`);
        }
    }
    
    // Bir elementi görünür alana kaydırma
    function scrollElementIntoView(element) {
        try {
            // Offset hesapla (header ve menü sekmeleri için)
            const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
            const menuTabsHeight = document.querySelector('.menu-tabs-container')?.offsetHeight || 0;
            const scrollOffset = headerHeight + menuTabsHeight + 10;
            
            // Bölüme kaydır
            const top = element.getBoundingClientRect().top + window.pageYOffset - scrollOffset;
            window.scrollTo({
                top: top,
                behavior: 'auto'
            });
            
            console.log(`✓ "${element.id}" bölümüne kaydırıldı`);
        } catch (error) {
            console.error('❌ Kaydırma işleminde hata:', error);
            
            // Fallback yöntem
            try {
                element.scrollIntoView({behavior: "auto", block: "start"});
            } catch (e) {
                console.error('⚠️ Alternatif kaydırma da başarısız:', e);
            }
        }
    }
    
    // Doğrudan dışa aktarım - bazı eski kodlar için
    window.showCategoriesModal = showCategoriesModal;
    window.closeCategoriesModal = closeCategoriesModal;
    window.selectCategory = selectCategory;
})();
