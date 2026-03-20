import { useState, useEffect } from "react"

export interface MobileDetectResult {
  isMobile: boolean
  isTablet: boolean
  isIOS: boolean
  isAndroid: boolean
  deviceMemoryGB: number
  hardwareConcurrency: number
  canRunModel: (sizeMB: number) => boolean
  shouldUseMobileModel: boolean
  recommendation: "full" | "mobile" | "fallback"
}

function detectDevice(): MobileDetectResult {
  const isServer = typeof window === "undefined"
  if (isServer) {
    return {
      isMobile: false,
      isTablet: false,
      isIOS: false,
      isAndroid: false,
      deviceMemoryGB: 4,
      hardwareConcurrency: 4,
      canRunModel: () => true,
      shouldUseMobileModel: false,
      recommendation: "full",
    }
  }

  const ua = navigator.userAgent
  const screenWidth = window.screen.width
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0

  // Device memory: Chrome/Edge expose it directly, fallback via screen heuristic
  const deviceMemoryGB =
    (navigator as any).deviceMemory ??
    (screenWidth > 1200 ? 4 : screenWidth > 768 ? 3 : 2)

  const hardwareConcurrency = navigator.hardwareConcurrency ?? 4

  const isMobile = hasTouch && screenWidth < 768
  const isTablet = hasTouch && screenWidth >= 768 && screenWidth <= 1200

  // iOS: Safari + touch. All iOS browsers use WebKit so checking Safari UA is sufficient
  const isIOS =
    hasTouch &&
    (/iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1))

  const isAndroid = /Android/i.test(ua)

  const canRunModel = (sizeMB: number): boolean => {
    if (sizeMB < 50) return true
    if (deviceMemoryGB >= 4) return true
    if (deviceMemoryGB >= 2 && sizeMB < 200) return true
    return false
  }

  const shouldUseMobileModel = deviceMemoryGB < 4

  const recommendation: MobileDetectResult["recommendation"] =
    deviceMemoryGB >= 4 ? "full" : deviceMemoryGB >= 2 ? "mobile" : "fallback"

  return {
    isMobile,
    isTablet,
    isIOS,
    isAndroid,
    deviceMemoryGB,
    hardwareConcurrency,
    canRunModel,
    shouldUseMobileModel,
    recommendation,
  }
}

let cachedResult: MobileDetectResult | null = null

export function useMobileDetect(): MobileDetectResult {
  const [result, setResult] = useState<MobileDetectResult>(
    () => cachedResult ?? detectDevice(),
  )

  useEffect(() => {
    if (!cachedResult) {
      const detected = detectDevice()
      cachedResult = detected
      setResult(detected)
    }
  }, [])

  return result
}
