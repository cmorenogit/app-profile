# Proposal: Fix iOS Safari Tab Crash on Model Loading

## Intent

iOS Safari mata el tab silenciosamente al cargar modelos ML via Transformers.js. El peak memory durante la carga es ~3x el tamaño del modelo (fetch buffer + Cache API copy + WASM heap copy), y el WASM multi-threaded agrava el problema exponencialmente en JavaScriptCore. Solo RAG (~23MB) funciona; Whisper (~40MB) y todos los demás crashean.

## Scope

### In Scope
- Deshabilitar WASM multi-threading en iOS (fix crítico, Issue #1242)
- Deshabilitar Cache API en iOS para eliminar una copia de memoria
- Ajustar thresholds de `canRunModel()` con límites realistas para iOS
- Usar modelos quantized donde estén disponibles
- Fallback a resultados pre-grabados para modelos imposibles en iOS

### Out of Scope
- Upgrade Transformers.js v4 (cambio mayor separado)
- Custom streaming cache via OPFS
- WebGPU path para iOS 18.2+ (ONNX Runtime tiene bug JSEP #26827)

## Approach

1. **Configure ONNX Runtime** al detectar iOS: `numThreads=1`, `useBrowserCache=false`
2. **Recalibrar thresholds**: iOS max ~80MB de modelo real (considerando 3x peak)
3. **Quantized models**: usar variantes `_quantized` de Xenova donde existan
4. **Fallback inteligente**: mostrar resultados pre-grabados en vez de crashear

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/components/playground/usePipelineManager.ts` | Modified | Configurar env de Transformers.js para iOS |
| `src/components/playground/useMobileDetect.ts` | Modified | Thresholds iOS-específicos |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| numThreads=1 hace inferencia más lenta | Expected | Aceptable para portfolio; UX funcional > UX rápida |
| Sin cache = re-descarga cada visita en iOS | Expected | Trade-off aceptable; modelos son pequeños con quantization |
| Modelos quantized no disponibles para todos | Medium | Verificar en HuggingFace; fallback a pre-recorded si no existe |

## Rollback Plan

Revertir rama sin merge. Sin cambios de infraestructura.

## Success Criteria

- [ ] RAG, Whisper y Sentiment funcionan en iOS Safari sin crash
- [ ] Image funciona con modelo quantized en iOS
- [ ] Summary muestra fallback pre-grabado en iOS (imposible cargar 305MB)
- [ ] Build exitoso
