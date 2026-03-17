import { useState, useEffect } from "react";

type Device = "webgpu" | "wasm";

let cachedDevice: Device | null = null;

async function detectDevice(): Promise<Device> {
  if (cachedDevice) return cachedDevice;
  try {
    if (!navigator.gpu) throw new Error("No WebGPU");
    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) throw new Error("No adapter");
    cachedDevice = "webgpu";
  } catch {
    cachedDevice = "wasm";
  }
  return cachedDevice;
}

export function useDevice() {
  const [device, setDevice] = useState<Device>("wasm");
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    detectDevice().then((d) => {
      setDevice(d);
      setIsDetecting(false);
    });
  }, []);

  return { device, isDetecting, isWebGPU: device === "webgpu" };
}
