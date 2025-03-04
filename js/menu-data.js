/**
 * AR Restoran Menü Veri Modülü
 * Tüm yiyecek ve içeceklere ait veriler bu dosyada toplandı.
 * Kategoriler:
 * - Ana Yemekler (mainDishes)
 * - Tatlılar (desserts)
 * - İçecekler (drinks)
 * - Salatalar (salads)
 * - Kahvaltı (breakfast)
 * - Çorbalar (soups)
 */

const MenuDB = (function() {
    // Tüm kategoriler ve öğeler burada saklanır
    const menuData = {
        // ANA YEMEKLER
        mainDishes: [
            {
                id: 'kofte',
                name: 'Izgara Köfte',
                description: 'Özel baharatlarla hazırlanmış el yapımı ızgara köfte',
                price: '85 TL',
                numericPrice: 85,
                rating: 4.5,
                ratingCount: 124,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Köfte',
                tags: ['popular', 'meat'],
                modelPath: 'models/kofte.glb',
                usdz: 'models/kofte.usdz',
                allergens: ['gluten'],
                calories: 450,
                protein: 25,
                carbs: 15,
                fat: 30,
                qrUrl: 'https://arrestorant.com/menu/kofte'
            },
            {
                id: 'tavuk_sis',
                name: 'Baharatlı Tavuk Şiş',
                description: 'Özel marine edilmiş baharatlı tavuk şiş',
                price: '75 TL',
                numericPrice: 75,
                rating: 4.0,
                ratingCount: 86,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Tavuk+Şiş',
                tags: ['spicy', 'chicken'],
                modelPath: 'models/tavuk_sis.glb',
                usdz: 'models/tavuk_sis.usdz',
                allergens: [],
                calories: 320,
                protein: 28,
                carbs: 8,
                fat: 18
            },
            {
                id: 'karisik_izgara',
                name: 'Karışık Izgara',
                description: 'Kuzu pirzola, köfte, tavuk şiş ve dana bonfileden oluşan karışık ızgara',
                price: '140 TL',
                numericPrice: 140,
                rating: 4.8,
                ratingCount: 156,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Karışık+Izgara',
                tags: ['popular', 'meat'],
                modelPath: 'models/karisik.glb',
                usdz: 'models/karisik.usdz',
                allergens: [],
                calories: 650,
                protein: 45,
                carbs: 12,
                fat: 40
            },
            {
                id: 'adana',
                name: 'Adana Kebap',
                description: 'Geleneksel tarifle hazırlanan acılı Adana kebap',
                price: '90 TL',
                numericPrice: 90,
                rating: 4.7,
                ratingCount: 112,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Adana+Kebap',
                tags: ['spicy', 'meat', 'popular'],
                modelPath: 'models/adana.glb',
                usdz: 'models/adana.usdz',
                allergens: [],
                calories: 520,
                protein: 32,
                carbs: 10,
                fat: 38,
                qrUrl: 'https://arrestorant.com/menu/adana_kebap'
            },
            {
                id: 'veggie_burger',
                name: 'Vegan Burger',
                description: 'Nohut köftesi, avokado ve taze sebzelerden hazırlanan vegan burger',
                price: '70 TL',
                numericPrice: 70,
                rating: 4.6,
                ratingCount: 82,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Vegan+Burger',
                tags: ['vegan', 'popular'],
                modelPath: 'models/veggie_burger.glb',
                usdz: 'models/veggie_burger.usdz',
                allergens: ['soy'],
                calories: 380,
                protein: 15,
                carbs: 45,
                fat: 18
            },
            {
                id: 'patlican',
                name: 'Patlıcan Musakka',
                description: 'Fırında pişirilmiş ve beşamel soslu patlıcan musakka',
                price: '65 TL',
                numericPrice: 65,
                rating: 4.2,
                ratingCount: 64,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Patlıcan+Musakka',
                tags: ['vegetarian'],
                modelPath: 'models/musakka.glb',
                usdz: 'models/musakka.usdz',
                allergens: ['milk', 'gluten'],
                calories: 420,
                protein: 12,
                carbs: 38,
                fat: 25
            }
        ],
        
        // TATLILAR
        desserts: [
            {
                id: 'kunefe',
                name: 'Künefe',
                description: 'Özel kadayıf ve eritilmiş peynir üzerine Antep fıstıklı künefe',
                price: '65 TL',
                numericPrice: 65,
                rating: 5.0,
                ratingCount: 210,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Künefe',
                tags: ['popular', 'hot'],
                modelPath: 'models/kunefe.glb',
                usdz: 'models/kunefe.usdz',
                allergens: ['milk', 'nuts'],
                calories: 450,
                protein: 8,
                carbs: 65,
                fat: 18
            },
            {
                id: 'baklava',
                name: 'Antep Fıstıklı Baklava',
                description: '40 kat el açma yufka ile hazırlanmış geleneksel Antep fıstıklı baklava',
                price: '75 TL',
                numericPrice: 75,
                rating: 4.9,
                ratingCount: 185,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Baklava',
                tags: ['popular', 'nuts'],
                modelPath: 'models/baklava.glb',
                usdz: 'models/baklava.usdz',
                allergens: ['nuts', 'gluten'],
                calories: 420,
                protein: 10,
                carbs: 58,
                fat: 22,
                qrUrl: 'https://arrestorant.com/menu/baklava'
            },
            {
                id: 'sutlac',
                name: 'Fırın Sütlaç',
                description: 'Fırında karamelize edilmiş geleneksel sütlaç',
                price: '40 TL',
                numericPrice: 40,
                rating: 4.4,
                ratingCount: 96,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Sütlaç',
                tags: ['vegetarian'],
                modelPath: 'models/sutlac.glb',
                usdz: 'models/sutlac.usdz',
                allergens: ['milk'],
                calories: 320,
                protein: 7,
                carbs: 54,
                fat: 8
            },
            {
                id: 'kazandibi',
                name: 'Kazandibi',
                description: 'Geleneksel yöntemle hazırlanmış karamelize tatlı',
                price: '45 TL',
                numericPrice: 45,
                rating: 4.6,
                ratingCount: 102,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Kazandibi',
                tags: ['vegetarian'],
                modelPath: 'models/kazandibi.glb',
                usdz: 'models/kazandibi.usdz',
                allergens: ['milk', 'eggs'],
                calories: 380,
                protein: 9,
                carbs: 60,
                fat: 12
            },
            {
                id: 'vegan_cheesecake',
                name: 'Vegan Çilekli Cheesecake',
                description: 'Kaju bazlı vegan cheesecake, çilek sosu ile servis edilir',
                price: '55 TL',
                numericPrice: 55,
                rating: 4.7,
                ratingCount: 78,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Vegan+Cheesecake',
                tags: ['vegan', 'raw'],
                modelPath: 'models/vegan_cake.glb',
                usdz: 'models/vegan_cake.usdz',
                allergens: ['nuts'],
                calories: 350,
                protein: 8,
                carbs: 42,
                fat: 20
            }
        ],
        
        // İÇECEKLER
        drinks: [
            {
                id: 'ayran',
                name: 'Ayran',
                description: 'Geleneksel ev yapımı ayran',
                price: '15 TL',
                numericPrice: 15,
                rating: 4.2,
                ratingCount: 92,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Ayran',
                tags: [],
                modelPath: 'models/ayran.glb',
                usdz: 'models/ayran.usdz',
                allergens: ['milk'],
                calories: 80,
                protein: 5,
                carbs: 6,
                fat: 3
            },
            {
                id: 'turkish_coffee',
                name: 'Türk Kahvesi',
                description: 'Geleneksel yöntemle pişirilmiş Türk kahvesi, lokum ile servis edilir',
                price: '25 TL',
                numericPrice: 25,
                rating: 4.8,
                ratingCount: 156,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Türk+Kahvesi',
                tags: ['popular'],
                modelPath: 'models/kahve.glb',
                usdz: 'models/kahve.usdz',
                allergens: [],
                calories: 5,
                protein: 0,
                carbs: 1,
                fat: 0
            },
            {
                id: 'sahlep',
                name: 'Tarçınlı Sahlep',
                description: 'Geleneksel kış içeceği, tarçın ve fındık ile servis edilir',
                price: '30 TL',
                numericPrice: 30,
                rating: 4.5,
                ratingCount: 78,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Sahlep',
                tags: ['hot', 'seasonal'],
                modelPath: 'models/sahlep.glb',
                usdz: 'models/sahlep.usdz',
                allergens: ['milk', 'nuts'],
                calories: 180,
                protein: 4,
                carbs: 30,
                fat: 6
            },
            {
                id: 'fresh_orange',
                name: 'Taze Sıkılmış Portakal Suyu',
                description: '100% taze sıkılmış portakal suyu',
                price: '25 TL',
                numericPrice: 25,
                rating: 4.7,
                ratingCount: 104,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Portakal+Suyu',
                tags: ['vegan', 'fresh'],
                modelPath: 'models/orange_juice.glb',
                usdz: 'models/orange_juice.usdz',
                allergens: [],
                calories: 120,
                protein: 1,
                carbs: 28,
                fat: 0
            },
            {
                id: 'limonata',
                name: 'Ev Yapımı Limonata',
                description: 'Taze sıkılmış limon ve nane yaprakları ile hazırlanmış limonata',
                price: '20 TL',
                numericPrice: 20,
                rating: 4.6,
                ratingCount: 112,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Limonata',
                tags: ['vegan', 'fresh', 'popular'],
                modelPath: 'models/limonata.glb',
                usdz: 'models/limonata.usdz',
                allergens: [],
                calories: 90,
                protein: 0,
                carbs: 22,
                fat: 0
            }
        ],
        
        // YENİ: SALATALAR
        salads: [
            {
                id: 'coban_salata',
                name: 'Çoban Salatası',
                description: 'Domates, salatalık, biber ve soğan ile hazırlanmış klasik Türk salatası',
                price: '35 TL',
                numericPrice: 35,
                rating: 4.3,
                ratingCount: 88,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Çoban+Salatası',
                tags: ['vegan', 'fresh'],
                modelPath: 'models/coban_salata.glb',
                usdz: 'models/coban_salata.usdz',
                allergens: [],
                calories: 120,
                protein: 3,
                carbs: 12,
                fat: 7
            },
            {
                id: 'gavurdagi_salata',
                name: 'Gavurdağı Salatası',
                description: 'Ceviz, nar ekşisi ve sumak ile tatlandırılmış Antep usulü salata',
                price: '45 TL',
                numericPrice: 45,
                rating: 4.6,
                ratingCount: 76,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Gavurdağı+Salatası',
                tags: ['vegan', 'spicy'],
                modelPath: 'models/gavurdagi.glb',
                usdz: 'models/gavurdagi.usdz',
                allergens: ['nuts'],
                calories: 180,
                protein: 5,
                carbs: 14,
                fat: 12
            }
        ],
        
        // YENİ: KAHVALTI
        breakfast: [
            {
                id: 'serpme_kahvalti',
                name: 'Serpme Kahvaltı',
                description: 'Zengin içerikli geleneksel Türk kahvaltısı (2 kişilik)',
                price: '180 TL',
                numericPrice: 180,
                rating: 4.9,
                ratingCount: 215,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Serpme+Kahvaltı',
                tags: ['popular'],
                modelPath: 'models/kahvalti.glb',
                usdz: 'models/kahvalti.usdz',
                allergens: ['milk', 'gluten', 'eggs'],
                calories: 1200,
                protein: 40,
                carbs: 120,
                fat: 60
            },
            {
                id: 'menemen',
                name: 'Menemen',
                description: 'Domates, biber ve yumurta ile hazırlanan geleneksel kahvaltı yemeği',
                price: '45 TL',
                numericPrice: 45,
                rating: 4.7,
                ratingCount: 134,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Menemen',
                tags: ['vegetarian', 'hot'],
                modelPath: 'models/menemen.glb',
                usdz: 'models/menemen.usdz',
                allergens: ['eggs'],
                calories: 320,
                protein: 14,
                carbs: 12,
                fat: 24
            }
        ],
        
        // YENİ: ÇORBALAR
        soups: [
            {
                id: 'mercimek',
                name: 'Mercimek Çorbası',
                description: 'Geleneksel tarif ile hazırlanmış kremsi kırmızı mercimek çorbası',
                price: '30 TL',
                numericPrice: 30,
                rating: 4.5,
                ratingCount: 108,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Mercimek+Çorbası',
                tags: ['vegan', 'hot'],
                modelPath: 'models/mercimek.glb',
                usdz: 'models/mercimek.usdz',
                allergens: [],
                calories: 180,
                protein: 9,
                carbs: 30,
                fat: 2
            },
            {
                id: 'ezogelin',
                name: 'Ezogelin Çorbası',
                description: 'Mercimek, pirinç ve bulgur ile hazırlanan baharatlı çorba',
                price: '30 TL',
                numericPrice: 30,
                rating: 4.4,
                ratingCount: 92,
                image: 'https://placehold.co/220x140/e8e0d5/333?text=Ezogelin+Çorbası',
                tags: ['vegan', 'spicy'],
                modelPath: 'models/ezogelin.glb',
                usdz: 'models/ezogelin.usdz',
                allergens: ['gluten'],
                calories: 210,
                protein: 8,
                carbs: 36,
                fat: 3
            }
        ]
    };

    // Kategorilerin görünen adları ve simgeleri
    const categoryInfo = {
        mainDishes: {
            title: "Ana Yemekler",
            icon: "🍳",
            emoji: "🍽️",
            description: "Özenle hazırlanmış et, tavuk ve vegan ana yemek çeşitlerimiz.",
            sortOrder: 1
        },
        desserts: {
            title: "Tatlılar",
            icon: "🍰",
            emoji: "🧁",
            description: "Geleneksel ve modern tatlı çeşitlerimiz arasından seçiminizi yapın.",
            sortOrder: 3
        },
        drinks: {
            title: "İçecekler",
            icon: "🍹",
            emoji: "🥤",
            description: "Sıcak ve soğuk içecek çeşitlerimiz.",
            sortOrder: 4
        },
        salads: {
            title: "Salatalar",
            icon: "🥗",
            emoji: "🥬",
            description: "Taze ve sağlıklı salata çeşitlerimiz.",
            sortOrder: 2
        },
        breakfast: {
            title: "Kahvaltı",
            icon: "☕",
            emoji: "🍳",
            description: "Güne güzel bir başlangıç için kahvaltı çeşitlerimiz.",
            sortOrder: 0
        },
        soups: {
            title: "Çorbalar",
            icon: "🍲",
            emoji: "🥣",
            description: "Geleneksel Türk mutfağından çorba çeşitlerimiz.",
            sortOrder: 5
        }
    };

    // Popüler öğeleri filtrele
    function getPopularItems(limit = 6) {
        let allItems = [];
        
        // Tüm kategorilerdeki popüler öğeleri ekle
        for (const category in menuData) {
            const popularItemsInCategory = menuData[category].filter(item => 
                (item.tags && item.tags.includes('popular')) || 
                (item.rating && item.rating >= 4.5)
            );
            allItems = [...allItems, ...popularItemsInCategory];
        }
        
        // Puanı en yüksek olanlara göre sırala
        allItems.sort((a, b) => b.rating - a.rating);
        
        // İstenilen sayıda öğeyi döndür
        return limit ? allItems.slice(0, limit) : allItems;
    }
    
    // Etiketlere göre öğeleri filtrele
    function getItemsByTag(tag) {
        let taggedItems = [];
        
        // Tüm kategorilerde etiket ara
        for (const category in menuData) {
            const items = menuData[category].filter(item => 
                item.tags && item.tags.includes(tag)
            );
            taggedItems = [...taggedItems, ...items];
        }
        
        return taggedItems;
    }
    
    // Fiyat aralığına göre öğeleri filtrele
    function getItemsByPriceRange(min, max) {
        let matchingItems = [];
        
        // Tüm kategorilerde fiyat aralığına uyan öğeleri bul
        for (const category in menuData) {
            const items = menuData[category].filter(item => 
                item.numericPrice >= min && item.numericPrice <= max
            );
            matchingItems = [...matchingItems, ...items];
        }
        
        return matchingItems;
    }
    
    // ID'ye göre belirli bir öğeyi bul
    function getItemById(id) {
        for (const category in menuData) {
            const item = menuData[category].find(item => item.id === id);
            if (item) return item;
        }
        return null;
    }
    
    // İsme göre arama yap
    function searchItems(query) {
        if (!query || query.trim() === '') return [];
        
        const searchQuery = query.toLowerCase().trim();
        let results = [];
        
        // Tüm kategorilerde ara
        for (const category in menuData) {
            const matches = menuData[category].filter(item => 
                item.name.toLowerCase().includes(searchQuery) || 
                (item.description && item.description.toLowerCase().includes(searchQuery)) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
            );
            results = [...results, ...matches];
        }
        
        return results;
    }
    
    // Tüm kategorilerin listesini al
    function getAllCategories() {
        return Object.keys(menuData).map(key => {
            return {
                id: key,
                ...categoryInfo[key],
                itemCount: menuData[key].length
            };
        }).sort((a, b) => a.sortOrder - b.sortOrder);
    }

    // Public API
    return {
        // Bir kategorideki tüm öğeleri al
        getCategory: function(categoryId) {
            return menuData[categoryId] || [];
        },
        
        // Tüm kategorilerin listesini al
        getCategories: getAllCategories,
        
        // Kategori bilgisini al
        getCategoryInfo: function(categoryId) {
            return categoryInfo[categoryId] || null;
        },
        
        // Popüler öğeleri al
        getPopular: getPopularItems,
        
        // Etiketlere göre filtrele
        getByTag: getItemsByTag,
        
        // Fiyata göre filtrele
        getByPriceRange: getItemsByPriceRange,
        
        // ID'ye göre öğe bul
        getById: getItemById,
        
        // Arama yap
        search: searchItems,
        
        // Tüm menüyü al (yönetim paneli için)
        getAll: function() {
            return menuData;
        }
    };
})();

// Global olarak erişilebilir olması için MenuDB'yi window nesnesine ekle
window.MenuDB = MenuDB;
