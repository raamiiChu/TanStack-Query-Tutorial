"use client";

import { Gauge } from "lucide-react";

import {
  setNetworkSettings,
  useNetworkSettings,
} from "@/lib/network-simulator";

const NetworkControls = () => {
  const { delay, failRate } = useNetworkSettings();

  return (
    <div className="bg-muted/50 space-y-3 rounded-lg border p-3 text-xs">
      <p className="flex items-center gap-2 font-semibold">
        <Gauge className="size-4" /> Network simulator
      </p>
      <label className="block space-y-1">
        <span className="flex justify-between">
          <span>Latency</span>
          <span className="font-mono">{delay}ms</span>
        </span>
        <input
          type="range"
          min={0}
          max={3000}
          step={100}
          value={delay}
          onChange={(event) =>
            setNetworkSettings({ delay: Number(event.target.value) })
          }
          className="w-full accent-current"
        />
      </label>
      <label className="block space-y-1">
        <span className="flex justify-between">
          <span>Error rate</span>
          <span className="font-mono">{Math.round(failRate * 100)}%</span>
        </span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={failRate}
          onChange={(event) =>
            setNetworkSettings({ failRate: Number(event.target.value) })
          }
          className="w-full accent-current"
        />
      </label>
    </div>
  );
};

export default NetworkControls;
