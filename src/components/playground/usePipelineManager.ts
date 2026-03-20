import { useState, useRef, useCallback } from "react"
import { env, pipeline as hfPipeline, type PipelineType } from "@huggingface/transformers"
import { useDevice } from "./useDevice"
import type { MobileDetectResult } from "./useMobileDetect"

export interface ModelConfig {
  task: string
  modelId: string
  mobileModelId?: string
  modelSizeMB: number
  /** dtype override for quantization (e.g., "q8", "fp16", or per-module object) */
  dtype?: string | Record<string, string>
  /** dtype to use on iOS/mobile for reduced memory (e.g., "q8") */
  mobileDtype?: string | Record<string, string>
}

// Configure Transformers.js for iOS Safari to prevent tab crashes.
// iOS Safari + JSC has issues with multi-threaded WASM (Issue #1242)
// and memory triples during model loading (fetch + cache + WASM).
let iosConfigured = false
function configureForIOS() {
  if (iosConfigured) return
  iosConfigured = true

  // Disable multi-threaded WASM — JSC spirals on memory with threads
  if (env.backends?.onnx?.wasm) {
    env.backends.onnx.wasm.numThreads = 1
  }

  // Disable browser Cache API — eliminates one memory copy during loading
  // Trade-off: models re-download each visit, but prevents crash
  env.useBrowserCache = false
}

export type PipelineStatus =
  | "idle"
  | "downloading"
  | "initializing"
  | "ready"
  | "error"
  | "fallback"

export interface PipelineManagerReturn {
  pipeline: any | null
  isLoading: boolean
  progress: number
  loadedBytes: number
  totalBytes: number
  status: PipelineStatus
  error: string | null
  loadModel: () => Promise<any>
  dispose: () => Promise<void>
}

export function usePipelineManager(
  modelConfig: ModelConfig,
  deviceInfo: MobileDetectResult,
): PipelineManagerReturn {
  const pipelineRef = useRef<any>(null)
  const loadedModelRef = useRef<string | null>(null)

  const [status, setStatus] = useState<PipelineStatus>("idle")
  const [progress, setProgress] = useState(0)
  const [loadedBytes, setLoadedBytes] = useState(0)
  const [totalBytes, setTotalBytes] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const { device } = useDevice()

  const dispose = useCallback(async () => {
    if (pipelineRef.current) {
      try {
        await pipelineRef.current.dispose()
      } catch (e) {
        console.warn("Failed to dispose pipeline:", e)
      }
      pipelineRef.current = null
      loadedModelRef.current = null
    }
    setStatus("idle")
    setProgress(0)
    setLoadedBytes(0)
    setTotalBytes(0)
    setError(null)
  }, [])

  const loadModel = useCallback(async () => {
    // Configure iOS optimizations before any model loading
    if (deviceInfo.isIOS) {
      configureForIOS()
    }

    // Select model based on device capabilities
    const selectedModel =
      deviceInfo.shouldUseMobileModel && modelConfig.mobileModelId
        ? modelConfig.mobileModelId
        : modelConfig.modelId

    // Determine effective model size (mobile model may be different)
    const effectiveSize = deviceInfo.shouldUseMobileModel && modelConfig.mobileModelId
      ? modelConfig.modelSizeMB // conservative: use original size for check
      : modelConfig.modelSizeMB

    // Check device capability with quantized size estimate
    // q8 quantization reduces size by ~75%, so effective peak memory is much lower
    const quantizedSizeEstimate = (deviceInfo.isIOS && modelConfig.mobileDtype)
      ? effectiveSize * 0.3 // q8 models are ~25-30% of original
      : effectiveSize
    if (!deviceInfo.canRunModel(quantizedSizeEstimate)) {
      setStatus("fallback")
      return null
    }

    // Return cached pipeline if same model is already loaded
    if (pipelineRef.current && loadedModelRef.current === selectedModel) {
      return pipelineRef.current
    }

    // Dispose previous pipeline if switching models
    if (pipelineRef.current) {
      await dispose()
    }

    try {
      setStatus("downloading")
      setProgress(0)
      setLoadedBytes(0)
      setTotalBytes(0)
      setError(null)

      // Select dtype: use mobileDtype on iOS/mobile, otherwise dtype or default
      const selectedDtype = deviceInfo.shouldUseMobileModel && modelConfig.mobileDtype
        ? modelConfig.mobileDtype
        : modelConfig.dtype

      const pipelineOptions: Record<string, any> = {
        device,
        progress_callback: (event: any) => {
          if (event.status === "initiate") {
            setStatus("downloading")
            if (event.total) setTotalBytes(event.total)
          } else if (event.status === "progress") {
            setProgress(event.progress ?? 0)
            if (event.loaded) setLoadedBytes(event.loaded)
            if (event.total) setTotalBytes(event.total)
          } else if (event.status === "done") {
            setStatus("initializing")
          } else if (event.status === "ready") {
            setStatus("ready")
          }
        },
      }

      if (selectedDtype) {
        pipelineOptions.dtype = selectedDtype
      }

      const pipe = await hfPipeline(modelConfig.task as PipelineType, selectedModel, pipelineOptions)

      pipelineRef.current = pipe
      loadedModelRef.current = selectedModel
      setStatus("ready")
      setProgress(100)

      return pipe
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load model"
      setStatus("error")
      setError(message)
      console.error("Pipeline load error:", e)
      return null
    }
  }, [modelConfig, deviceInfo, device, dispose])

  return {
    pipeline: pipelineRef.current,
    isLoading: status === "downloading" || status === "initializing",
    progress,
    loadedBytes,
    totalBytes,
    status,
    error,
    loadModel,
    dispose,
  }
}
