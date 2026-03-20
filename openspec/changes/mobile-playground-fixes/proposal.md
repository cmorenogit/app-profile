# Proposal: Mobile Playground Fixes

## Intent

El Playground de AI demos no funciona correctamente en dispositivos móviles (iOS Safari y Android Chrome). Los problemas principales son:

1. **Whisper Speech-to-Text roto en iOS**: El audio se captura a 48kHz nativo pero se pasa a Whisper esperando 16kHz, sin resampling. AudioContext puede quedar en estado `suspended` o `interrupted` sin manejo.
2. **Crashes por memoria**: Modelos grandes (>300MB) causan que iOS Safari mate el tab silenciosamente. Los modelos no se liberan al cambiar entre demos.
3. **UX no adaptada a mobile**: Sin feedback de descarga de modelos, sin detección de capacidad del dispositivo, inputs no optimizados para touch.

Este es un portfolio personal donde el Playground es un diferenciador clave. Debe funcionar de manera impresionante en móvil.

## Scope

### In Scope
- Fix completo de captura de audio Whisper (resampling, AudioContext state, iOS interruptions)
- Gestión de memoria: dispose de modelos al cambiar demo, detección de límites
- UX mobile: progress bars con MB para descarga de modelos, warnings por tamaño, inputs touch-friendly
- Modelos alternativos más ligeros para mobile (MobileNetV4 para Image, quantized para Sentiment/Summary)
- Resultados pre-grabados como fallback para demos que excedan la capacidad del dispositivo
- `navigator.storage.persist()` para proteger cache de modelos

### Out of Scope
- Migración de ScriptProcessorNode a AudioWorklet (funcional, mejora futura)
- Servidor de inferencia como fallback (contradice el mensaje "runs in your browser")
- PWA / Add to Home Screen prompt (mejora futura para bypass ITP 7-day)
- Upgrade a Transformers.js v4 (cambio mayor, separar en otro change)
- Web Workers para inferencia (mejora de rendimiento, no blocker)

## Approach

### Fase 1: Fix Audio Whisper
- Crear AudioContext sin forzar sampleRate → usar tasa nativa del dispositivo
- Agregar `audioContext.resume()` explícito para iOS
- Implementar resampling lineal de tasa nativa (48kHz) a 16kHz antes de pasar a Whisper
- Manejar estado `interrupted` con listener de `statechange`
- Limitar grabación a 30s en mobile

### Fase 2: Gestión de Memoria
- Crear hook `usePipelineManager` que gestione el ciclo de vida del pipeline activo
- Disponer automáticamente el modelo anterior al cargar uno nuevo
- Crear hook `useMobileDetect` para detectar dispositivo y capacidades
- Mostrar warnings/fallbacks basados en `navigator.deviceMemory` + heurísticas

### Fase 3: UX Mobile
- Refactorizar `DemoShell` para mostrar progress bar con bytes descargados
- Agregar badge de tamaño del modelo en cada card del demo selector
- Adaptar inputs por demo: ImageDemo (botones camera/gallery), WhisperDemo (botón grande)
- Implementar sistema de resultados pre-grabados para demos que no pueden ejecutarse

### Fase 4: Caching
- Llamar `navigator.storage.persist()` al montar PlaygroundApp
- Verificar espacio disponible antes de descargar con `storage.estimate()`

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/playground/WhisperDemo.tsx` | Modified | Fix audio capture, resampling, iOS state handling, recording limit |
| `src/components/playground/PlaygroundApp.tsx` | Modified | Pipeline manager, mobile detection, storage persistence, model size badges |
| `src/components/playground/DemoShell.tsx` | Modified | Progress bar con bytes, model loading UX, fallback display |
| `src/components/playground/ImageDemo.tsx` | Modified | Mobile camera/gallery buttons, smaller model for mobile |
| `src/components/playground/SentimentDemo.tsx` | Modified | Quantized model variant for mobile |
| `src/components/playground/SummaryDemo.tsx` | Modified | Quantized model + pre-recorded fallback for mobile |
| `src/components/playground/useDevice.ts` | Modified | Expandir con mobile detection, memory estimation |
| `src/components/playground/usePipelineManager.ts` | New | Hook compartido para gestión de pipeline con dispose |
| `src/data/prerecorded-results.ts` | New | Resultados pre-grabados para fallback mobile |
| `vercel.json` | Potentially Modified | Headers si se necesitan COOP/COEP para SharedArrayBuffer |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Resampling lineal produce artefactos que afectan Whisper | Low | Whisper es robusto con audio de voz; interpolación lineal es suficiente para speech |
| MobileNetV4 no disponible en Transformers.js 3.8.1 | Medium | Verificar disponibilidad; fallback a ViT quantized q4 si no existe |
| `navigator.storage.persist()` rechazado en iOS sin engagement previo | Medium | No es crítico; mejora incremental. Modelos se re-descargan si se pierde cache |
| Dispose de pipeline causa delay al recargar mismo demo | Low | Aceptable trade-off; modelo se re-carga desde Cache API (~2s) |
| Cambio de `sampleRate` en AudioContext rompe playback WAV | Low | Usar sampleRate detectado para WAV, y sampleRate fijo (16kHz) para Whisper post-resample |
| COOP/COEP headers rompen embeds externos (HuggingFace audio example) | Medium | Evaluar impacto; puede requerir proxy o no activar COOP/COEP |

## Rollback Plan

1. Revertir la rama `feature/mobile-playground-fixes` sin merge a `main`
2. Vercel automáticamente eliminará el preview deployment
3. No hay cambios de infraestructura, DB, ni servicios externos que revertir
4. Si solo falla una fase, cherry-pick los commits de las fases funcionales

## Dependencies

- `@huggingface/transformers` v3.8.1 (ya instalado) — debe soportar modelos quantized seleccionados
- Modelos quantized disponibles en HuggingFace Hub (verificar antes de implementar)
- Vercel preview deployments habilitados en el proyecto (ya configurado)

## Success Criteria

- [ ] Whisper demo graba y transcribe correctamente en iOS Safari 17+ y Android Chrome
- [ ] AudioContext maneja estados suspended/interrupted sin perder grabación
- [ ] Al cambiar de demo, el modelo anterior se libera (verificable via DevTools Memory)
- [ ] Demos con modelos >200MB muestran warning y/o fallback en dispositivos con <4GB RAM
- [ ] Barra de progreso muestra MB descargados durante carga de modelos
- [ ] Image demo muestra botones "Take Photo"/"Choose from Gallery" en mobile
- [ ] Summary demo muestra resultados pre-grabados como fallback en iOS con <4GB
- [ ] Build exitoso (`npm run build`) sin errores TypeScript
- [ ] Preview URL de Vercel accesible y funcional en dispositivo móvil real
