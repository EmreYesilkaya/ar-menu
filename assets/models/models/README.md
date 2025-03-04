# AR Model Formatları ve Dosya Yapısı

Bu klasör AR uygulamasında kullanılan 3D modelleri içerir.

## Dosya Yapısı

```
models/
├── usdz/         - iOS AR QuickLook için modeller (.usdz)
├── glb/          - WebXR ve model-viewer için modeller (.glb)
└── textures/     - Model dokuları (ihtiyaç duyulursa)
```

## Model Formatları

### iOS AR QuickLook (USDZ)
- iOS cihazlar için USDZ formatında modeller gereklidir
- Her yemek modeli için bir USDZ dosyası olmalıdır
- Dosya adı: `yemek_adi.usdz`

### WebXR ve Diğer Platformlar (GLB/GLTF)
- Android ve diğer WebXR destekli cihazlar için GLB formatında modeller gereklidir
- GLB formatı modelleri ve dokularını tek bir dosyada birleştirir
- Dosya adı: `yemek_adi.glb`

## Model Optimizasyonu

İyi performans için:
- Modeller 50K poligondan az olmalı
- Doku boyutları 2048x2048 pikselden küçük olmalı
- Model boyutu 10MB'ı geçmemeli
