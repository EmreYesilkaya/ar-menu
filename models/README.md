# AR Model Klasörü Yapısı

Bu klasör AR uygulaması için gerekli 3D modelleri içerir.

## Klasör Yapısı

```
/models
  /usdz     - iOS için USDZ formatında modeller
  /glb      - Web ve Android için GLB formatında modeller
```

## Gerekli Model Dosyaları

Aşağıdaki model dosyalarının ilgili klasörlerde bulunduğundan emin olun:

### USDZ Modelleri (iOS için)
- `/models/usdz/kofte.usdz` 
- `/models/usdz/karisik.usdz`
- `/models/usdz/tavuk_sis.usdz`
- `/models/usdz/kunefe.usdz`
- `/models/usdz/baklava.usdz`
- `/models/usdz/ayran.usdz`
- `/models/usdz/kahve.usdz`

### GLB Modelleri (WebXR için)
- `/models/glb/kofte.glb`
- `/models/glb/karisik.glb`
- `/models/glb/tavuk_sis.glb`
- `/models/glb/kunefe.glb`
- `/models/glb/baklava.glb`
- `/models/glb/ayran.glb`
- `/models/glb/kahve.glb`

## Sorun Giderme

- Model görüntülenmiyorsa, modellerin doğru konumda olduğundan emin olun.
- iOS'ta AR Quick Look için mutlaka USDZ formatı gereklidir.
- USDZ dosyaları 50MB'den küçük olmalıdır.
- Sorun giderme için konsolda `testAR.diagnose()` komutunu çalıştırarak model yollarını kontrol edin.
