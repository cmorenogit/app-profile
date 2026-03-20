import { useState, useRef, useCallback } from "react"
import { pipeline as hfPipeline, type PipelineType } from "@huggingface/transformers"
import { useDevice } from "./useDevice"
import type { MobileDetectResult } from "./useMobileDetect"

export interface ModelConfig {
  task: string
  modelId: string
  mobileModelId?: string
  modelSizeMB: number
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
    // Check device capability first
    if (!deviceInfo.canRunModel(modelConfig.modelSizeMB)) {
      setStatus("fallback")
      return null
    }

    // Select model based on device capabilities
    const selectedModel =
      deviceInfo.shouldUseMobileModel && modelConfig.mobileModelId
        ? modelConfig.mobileModelId
        : modelConfig.modelId

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

      const pipe = await hfPipeline(modelConfig.task as PipelineType, selectedModel, {
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
      })

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
