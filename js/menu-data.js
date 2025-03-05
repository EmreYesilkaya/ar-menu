/**
 * Menü Verileri - AR Restoran
 * - Tüm menü öğeleri ve kategoriler
 * - Etiket ve AR modelleri için özelleştirilmiş yapı
 */

const menuData = {
    // Ana yemekler
    mainDishes: [
        {
            id: 'grilled-salmon',
            name: 'Izgara Somon',
            description: 'Limon ve baharatlarla marine edilmiş taze somon, yanında ızgara sebzeler.',
            price: '180 ₺',
            image: 'images/menu/grilled-salmon.jpg',
            modelPath: 'models/grilled-salmon.glb',
            tags: ['seafood', 'healthy', 'high-protein', 'gluten-free', 'low-carb']
        },
        {
            id: 'beef-steak',
            name: 'Antrikot Steak',
            description: 'Özel baharatlarla marine edilmiş, közde pişirilmiş dana antrikot.',
            price: '280 ₺',
            image: 'images/menu/beef-steak.jpg',
            modelPath: 'models/beef-steak.glb',
            tags: ['meat', 'popular', 'high-protein', 'hot']
        },
        {
            id: 'stuffed-peppers',
            name: 'Zeytinyağlı Biber Dolma',
            description: 'Pirinç ve aromatik otlar ile doldurulmuş, zeytinyağında pişirilmiş taze biber dolması.',
            price: '95 ₺',
            image: 'images/menu/stuffed-peppers.jpg',
            modelPath: 'models/stuffed-peppers.glb',
            tags: ['vegetarian', 'traditional', 'cultural', 'cold']
        },
        {
            id: 'vegetable-curry',
            name: 'Sebzeli Köri',
            description: 'Hindistan cevizi sütü ve karışık baharatlarla pişirilmiş, taze sebzelerle sunulan köri.',
            price: '120 ₺',
            image: 'images/menu/vegetable-curry.jpg',
            modelPath: 'models/vegetable-curry.glb',
            tags: ['vegan', 'spicy', 'hot', 'cultural']
        },
        {
            id: 'lamb-kebab',
            name: 'Kuzu Şiş',
            description: 'Özel baharatlarla marine edilmiş kuzu eti, kömürde pişirilmiş soğan ve biber ile.',
            price: '200 ₺',
            image: 'images/menu/lamb-kebab.jpg',
            modelPath: 'models/lamb-kebab.glb',
            tags: ['meat', 'traditional', 'hot', 'popular']
        },
        {
            id: 'chicken-parm',
            name: 'Tavuk Parmesan',
            description: 'Çıtır kaplamalı tavuk göğsü, mozzarella peyniri ve domates sosu ile fırınlanmış.',
            price: '140 ₺',
            image: 'images/menu/chicken-parmesan.jpg',
            modelPath: 'models/chicken-parmesan.glb',
            tags: ['chicken', 'cheese', 'hot', 'popular']
        },
        {
            id: 'veggie-burger',
            name: 'Vegan Burger',
            description: 'Nohut ve sebzelerden yapılmış köfte, avokado sosu ve taze yeşilliklerle.',
            price: '110 ₺',
            image: 'images/menu/veggie-burger.jpg',
            modelPath: 'models/veggie-burger.glb',
            tags: ['vegan', 'handcrafted', 'sharing', 'high-protein']
        },
        {
            id: 'mushroom-risotto',
            name: 'Mantarlı Risotto',
            description: 'Porcini mantarı, beyaz şarap, tereyağı ve parmesan ile zenginleştirilmiş Italian risotto.',
            price: '145 ₺',
            image: 'images/menu/mushroom-risotto.jpg',
            modelPath: 'models/mushroom-risotto.glb',
            tags: ['vegetarian', 'cheese', 'cultural', 'hot', 'sharing']
        },
        // YENİ YEMEK - Tavada Harçlı Izgara Et
        {
            id: 'pan-seared-steak',
            name: 'Tavada Harçlı Izgara Et',
            description: 'Kekik, sarımsak ve tereyağı ile marine edilmiş, dışı çıtır içi sulu mükemmel pişirilmiş et.',
            price: '260 ₺',
            image: 'images/menu/pan-seared-steak.jpg',
            modelPath: 'models/steak.glb',
            tags: ['meat', 'hot', 'high-protein', 'keto', 'popular']
        },
        // YENİ YEMEK - Fırınlanmış Patates
        {
            id: 'baked-potato',
            name: 'Peynirli Fırın Patates',
            description: 'Kaşar peyniri ve krema ile doldurulmuş, fırında altın renginde pişirilmiş büyük patates.',
            price: '85 ₺',
            image: 'images/menu/baked-potato.jpg',
            modelPath: 'models/baked-potato.glb',
            tags: ['vegetarian', 'cheese', 'sharing', 'hot', 'comfort-food']
        },
        // YENİ YEMEK - Karnabahar Köftesi
        {
            id: 'cauliflower-patties',
            name: 'Karnabahar Köftesi',
            description: 'Karnabahar, kinoa ve baharatlarla hazırlanmış, tavada çıtır çıtır pişirilmiş vegan köfteler.',
            price: '95 ₺',
            image: 'images/menu/cauliflower-patties.jpg',
            modelPath: 'models/cauliflower.glb',
            tags: ['vegan', 'healthy', 'gluten-free', 'dairy-free', 'low-carb']
        },
        // YENİ YEMEK - Thai Karidesli Noodle
        {
            id: 'thai-shrimp-noodle',
            name: 'Thai Karidesli Noodle',
            description: 'Karides, taze sebzeler ve özel Tai sosları ile hazırlanmış sıcak noodle çanağı.',
            price: '190 ₺',
            image: 'images/menu/thai-noodle.jpg',
            modelPath: 'models/noodle.glb',
            tags: ['seafood', 'spicy', 'hot', 'cultural']
        }
    ],
    
    // Tatlılar
    desserts: [
        {
            id: 'chocolate-souffle',
            name: 'Sıcak Çikolatalı Sufle',
            description: 'Dışı çıtır, içi yumuşak çikolata dolgulu sufle, vanilyalı dondurma ile.',
            price: '85 ₺',
            image: 'images/menu/chocolate-souffle.jpg',
            modelPath: 'models/chocolate-souffle.glb',
            tags: ['dessert', 'hot', 'sweet', 'popular']
        },
        {
            id: 'baklava',
            name: 'Fıstıklı Baklava',
            description: 'İnce yufkalar arasında Antep fıstığı ile hazırlanmış geleneksel Türk tatlısı.',
            price: '110 ₺',
            image: 'images/menu/baklava.jpg',
            modelPath: 'models/baklava.glb',
            tags: ['dessert', 'sweet', 'cultural', 'traditional', 'nuts']
        },
        {
            id: 'cheesecake',
            name: 'New York Cheesecake',
            description: 'Kremsi labne peyniri ve bisküvi tabanıyla hazırlanmış klasik Amerikan tatlısı.',
            price: '80 ₺',
            image: 'images/menu/cheesecake.jpg',
            modelPath: 'models/cheesecake.glb',
            tags: ['dessert', 'cheese', 'sweet', 'cold']
        },
        {
            id: 'sutlac',
            name: 'Fırın Sütlaç',
            description: 'Pirinç, süt ve şeker ile hazırlanan, üzeri fırınlanarak kızartılmış geleneksel tatlı.',
            price: '65 ₺',
            image: 'images/menu/rice-pudding.jpg',
            modelPath: 'models/rice-pudding.glb',
            tags: ['dessert', 'traditional', 'sweet', 'hot', 'vegetarian']
        },
        // YENİ TATLIAR
        {
            id: 'apple-crumble',
            name: 'Elmalı Crumble',
            description: 'Tarçınlı elma parçaları üzerinde çıtır hamur kırıntıları, sıcak servis edilir.',
            price: '75 ₺',
            image: 'images/menu/apple-crumble.jpg',
            modelPath: 'models/apple-crumble.glb',
            tags: ['dessert', 'sweet', 'hot', 'vegetarian', 'handcrafted']
        },
        {
            id: 'tiramisu',
            name: 'Klasik Tiramisu',
            description: 'Espresso ile ıslatılmış kedi dili bisküviler ve mascarpone peyniri katmanları.',
            price: '90 ₺',
            image: 'images/menu/tiramisu.jpg',
            modelPath: 'models/tiramisu.glb',
            tags: ['dessert', 'sweet', 'cold', 'cultural', 'caffeine']
        },
        {
            id: 'vegan-brownie',
            name: 'Vegan Brownie',
            description: 'Hindistan cevizi yağı ve bitter çikolata ile hazırlanmış, cevizli yumuşak kek.',
            price: '70 ₺',
            image: 'images/menu/vegan-brownie.jpg',
            modelPath: 'models/brownie.glb',
            tags: ['dessert', 'vegan', 'sweet', 'nuts', 'dairy-free']
        }
    ],
    
    // İçecekler
    drinks: [
        {
            id: 'turkish-tea',
            name: 'Türk Çayı',
            description: 'Geleneksel yöntemle demlenmiş, ince belli bardakta servis edilen Türk çayı.',
            price: '15 ₺',
            image: 'images/menu/turkish-tea.jpg',
            modelPath: 'models/turkish-tea.glb',
            tags: ['hot', 'traditional', 'cultural', 'caffeine']
        },
        {
            id: 'ayran',
            name: 'Ayran',
            description: 'Yoğurt, su ve tuz ile hazırlanan geleneksel Türk içeceği.',
            price: '25 ₺',
            image: 'images/menu/ayran.jpg',
            modelPath: 'models/ayran.glb',
            tags: ['cold', 'cultural', 'traditional', 'refreshing', 'dairy-free']
        },
        {
            id: 'fresh-orange-juice',
            name: 'Taze Sıkılmış Portakal Suyu',
            description: 'Günlük taze sıkılmış, soğuk servis edilen portakal suyu.',
            price: '45 ₺',
            image: 'images/menu/orange-juice.jpg',
            modelPath: 'models/orange-juice.glb',
            tags: ['cold', 'fresh', 'vegan', 'healthy', 'refreshing']
        },
        {
            id: 'turkish-coffee',
            name: 'Türk Kahvesi',
            description: 'Geleneksel yöntemle pişirilen, cezve ile servis edilen Türk kahvesi.',
            price: '35 ₺',
            image: 'images/menu/turkish-coffee.jpg',
            modelPath: 'models/turkish-coffee.glb',
            tags: ['hot', 'traditional', 'cultural', 'caffeine']
        },
        // YENİ İÇECEKLER
        {
            id: 'smoothie-bowl',
            name: 'Karışık Meyve Smoothie',
            description: 'Muz, çilek, yaban mersini ve hindistan cevizi sütünden hazırlanan soğuk smoothie.',
            price: '65 ₺',
            image: 'images/menu/smoothie.jpg',
            modelPath: 'models/smoothie.glb',
            tags: ['cold', 'vegan', 'fresh', 'sweet', 'healthy', 'refreshing', 'dairy-free']
        },
        {
            id: 'mint-lemonade',
            name: 'Naneli Limonata',
            description: 'Taze sıkılmış limon, nane ve bal ile hazırlanan ferahlatıcı içecek.',
            price: '45 ₺',
            image: 'images/menu/mint-lemonade.jpg',
            modelPath: 'models/lemonade.glb',
            tags: ['cold', 'fresh', 'refreshing', 'sweet', 'handcrafted']
        },
        {
            id: 'espresso',
            name: 'Double Espresso',
            description: 'İtalyan kahve çekirdeklerinden özenle hazırlanan yoğun içimli espresso.',
            price: '30 ₺',
            image: 'images/menu/espresso.jpg',
            modelPath: 'models/espresso.glb',
            tags: ['hot', 'caffeine', 'cultural']
        }
    ],
    
    // Kahvaltı
    breakfast: [
        {
            id: 'turkish-breakfast',
            name: 'Serpme Kahvaltı',
            description: 'Zeytin, peynir çeşitleri, domates, salatalık, bal, kaymak, tereyağı, reçel ve yumurta içeren geleneksel Türk kahvaltısı.',
            price: '180 ₺',
            image: 'images/menu/turkish-breakfast.jpg',
            modelPath: 'models/turkish-breakfast.glb',
            tags: ['breakfast', 'cultural', 'sharing', 'traditional', 'cheese', 'eggs']
        },
        {
            id: 'avocado-toast',
            name: 'Avokado Toast',
            description: 'Ekşi maya ekmeği üzerine avokado ezmesi, kızarmış yumurta ve taze otlar.',
            price: '90 ₺',
            image: 'images/menu/avocado-toast.jpg',
            modelPath: 'models/avocado-toast.glb',
            tags: ['breakfast', 'healthy', 'eggs', 'fresh']
        },
        {
            id: 'pancakes',
            name: 'Pancake',
            description: 'Akçaağaç şurubu ve taze meyvelerle servis edilen yumuşak pancake.',
            price: '75 ₺',
            image: 'images/menu/pancakes.jpg',
            modelPath: 'models/pancakes.glb',
            tags: ['breakfast', 'sweet', 'vegetarian']
        },
        {
            id: 'omelette',
            name: 'Peynirli Omlet',
            description: 'Taze otlar, beyaz peynir ve kaşar peyniri ile hazırlanmış omlet.',
            price: '65 ₺',
            image: 'images/menu/omelette.jpg',
            modelPath: 'models/omelette.glb',
            tags: ['breakfast', 'eggs', 'cheese', 'hot', 'high-protein']
        },
        // YENİ KAHVALTI ÖĞELERİ
        {
            id: 'granola-bowl',
            name: 'Meyveli Granola Kase',
            description: 'Ev yapımı granola, yoğurt ve taze meyvelerle hazırlanmış sağlıklı kahvaltı kasesi.',
            price: '65 ₺',
            image: 'images/menu/granola-bowl.jpg',
            modelPath: 'models/granola.glb',
            tags: ['breakfast', 'healthy', 'cold', 'vegetarian', 'nuts']
        },
        {
            id: 'menemen',
            name: 'Menemen',
            description: 'Domates, biber ve yumurta ile hazırlanan geleneksel Türk kahvaltısı, yanında sıcak pide ile.',
            price: '70 ₺',
            image: 'images/menu/menemen.jpg',
            modelPath: 'models/menemen.glb',
            tags: ['breakfast', 'traditional', 'hot', 'eggs', 'cultural']
        }
    ],
    
    // Çorbalar (Yeni Kategori)
    soups: [
        {
            id: 'lentil-soup',
            name: 'Mercimek Çorbası',
            description: 'Kırmızı mercimek, havuç, patates ve baharatlarla hazırlanan geleneksel Türk çorbası.',
            price: '45 ₺',
            image: 'images/menu/lentil-soup.jpg',
            modelPath: 'models/lentil-soup.glb',
            tags: ['hot', 'traditional', 'vegan', 'soup', 'healthy']
        },
        {
            id: 'tomato-soup',
            name: 'Domates Çorbası',
            description: 'Taze domateslerden hazırlanan, krema ile sunulan klasik çorba.',
            price: '50 ₺',
            image: 'images/menu/tomato-soup.jpg',
            modelPath: 'models/tomato-soup.glb',
            tags: ['hot', 'vegetarian', 'soup', 'healthy']
        },
        {
            id: 'chicken-soup',
            name: 'Tavuk Çorbası',
            description: 'Ev yapımı tavuk suyu, sebze ve limon ile hazırlanan besleyici çorba.',
            price: '55 ₺',
            image: 'images/menu/chicken-soup.jpg',
            modelPath: 'models/chicken-soup.glb',
            tags: ['hot', 'chicken', 'soup', 'high-protein']
        },
        // YENİ ÇORBALAR
        {
            id: 'seafood-chowder',
            name: 'Deniz Mahsullü Çorba',
            description: 'Kremalı taban üzerine karides, balık parçaları ve midye ile zenginleştirilmiş lüks çorba.',
            price: '85 ₺',
            image: 'images/menu/seafood-chowder.jpg',
            modelPath: 'models/seafood-soup.glb',
            tags: ['hot', 'seafood', 'soup', 'high-protein', 'premium']
        },
        {
            id: 'mushroom-soup',
            name: 'Mantarlı Çorba',
            description: 'Çeşitli mantar türlerinin kremsi dokuda birleştiği aromatik çorba.',
            price: '60 ₺',
            image: 'images/menu/mushroom-soup.jpg',
            modelPath: 'models/mushroom-soup.glb',
            tags: ['hot', 'vegetarian', 'soup', 'healthy']
        }
    ],
    
    // Salatalar (Yeni Kategori)
    salads: [
        {
            id: 'caesar-salad',
            name: 'Caesar Salata',
            description: 'Izgara tavuk, kruton, parmesan peyniri ve özel Caesar sosu ile hazırlanmış salata.',
            price: '85 ₺',
            image: 'images/menu/caesar-salad.jpg',
            modelPath: 'models/caesar-salad.glb',
            tags: ['salad', 'cold', 'chicken', 'cheese', 'fresh']
        },
        {
            id: 'greek-salad',
            name: 'Yunan Salatası',
            description: 'Domates, salatalık, kırmızı soğan, zeytin ve beyaz peynir ile hazırlanan klasik salata.',
            price: '70 ₺',
            image: 'images/menu/greek-salad.jpg',
            modelPath: 'models/greek-salad.glb',
            tags: ['salad', 'cold', 'vegetarian', 'cheese', 'fresh', 'cultural']
        },
        {
            id: 'quinoa-salad',
            name: 'Kinoa Salatası',
            description: 'Kinoa, nohut, avokado, domates ve yeşilliklerden oluşan besleyici salata.',
            price: '80 ₺',
            image: 'images/menu/quinoa-salad.jpg',
            modelPath: 'models/quinoa-salad.glb',
            tags: ['salad', 'cold', 'vegan', 'healthy', 'fresh', 'high-protein']
        },
        // YENİ SALATALAR
        {
            id: 'waldorf-salad',
            name: 'Waldorf Salata',
            description: 'Elma, ceviz, kereviz sapı ve üzüm ile hazırlanan, mayonez soslu klasik Amerikan salatası.',
            price: '75 ₺',
            image: 'images/menu/waldorf-salad.jpg',
            modelPath: 'models/waldorf-salad.glb',
            tags: ['salad', 'cold', 'fresh', 'nuts', 'cultural']
        },
        {
            id: 'thai-beef-salad',
            name: 'Thai Biftek Salatası',
            description: 'Marin edilmiş ince dilimlenmiş biftek, misket limonu, çıtır sebzeler ve Thai sos ile.',
            price: '110 ₺',
            image: 'images/menu/thai-beef-salad.jpg',
            modelPath: 'models/thai-salad.glb',
            tags: ['salad', 'meat', 'spicy', 'cultural', 'high-protein', 'fresh']
        }
    ]
};

// Popüler öğeleri bir araya getiren yardımcı fonksiyon
function getPopularItems() {
    const popularItems = [];
    
    // Tüm kategorileri döngüye al
    Object.values(menuData).forEach(category => {
        // Her kategoriden popüler etiketli olanları filtrele
        const categoryPopular = category.filter(item => item.tags.includes('popular'));
        popularItems.push(...categoryPopular);
    });
    
    return popularItems;
}

// Popüler öğeler için erişim kolaylığı
menuData.popularItems = getPopularItems();
