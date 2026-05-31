"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type CropType = "wheat" | "carrot" | "corn";
type Stage = 0 | 1 | 2 | 3; // 3 = ready

type Plot = {
  id: string;
  crop: CropType;
  stage: Stage;
  plantedAt: number;
  readyAt: number;
  overripeAt: number;
  harvested: boolean;
};

const GRID_R = 4;
const GRID_C = 4;
const COUNT = GRID_R * GRID_C;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

const cropMeta: Record<CropType, { growMs: number; color: string; readyColor: string }> = {
  wheat: { growMs: 1700, color: "#d9b44a", readyColor: "#facc15" },
  carrot: { growMs: 2200, color: "#f97316", readyColor: "#fb923c" },
  corn: { growMs: 2600, color: "#22c55e", readyColor: "#86efac" },
};

function pickCrop(): CropType {
  const roll = Math.random();
  return roll < 0.45 ? "wheat" : roll < 0.75 ? "carrot" : "corn";
}

export default function HarvestRush() {
  const [best, setBest] = useState(0);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [harvested, setHarvested] = useState(0);
  const [plots, setPlots] = useState<Record<number, Plot | null>>(() =>
    Object.fromEntries(Array.from({ length: COUNT }, (_, i) => [i, null])),
  );
  const [hint, setHint] = useState<string>("Click crops when fully grown.");

  const tickRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);

  const saveBest = useCallback((value: number) => {
    setBest((prev) => {
      const next = Math.max(prev, value);
      try {
        localStorage.setItem("harvestRushBest", String(next));
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      const v = localStorage.getItem("harvestRushBest");
      const n = v ? parseInt(v, 10) : 0;
      if (Number.isFinite(n)) setBest(n);
    } catch {}
  }, []);

  const level = useMemo(() => 1 + Math.floor(harvested / 10), [harvested]);
  const spawnEvery = useMemo(() => clamp(1200 - level * 90, 420, 1200), [level]);

  const reset = useCallback(() => {
    setRunning(false);
    setScore(0);
    setCombo(0);
    setHarvested(0);
    setHint("Click crops when fully grown.");
    setPlots(Object.fromEntries(Array.from({ length: COUNT }, (_, i) => [i, null])) as any);
    lastSpawnRef.current = 0;
  }, []);

  const spawn = useCallback(() => {
    const now = Date.now();
    setPlots((prev) => {
      const empty = Object.keys(prev)
        .map((k) => parseInt(k, 10))
        .filter((i) => prev[i] === null);
      if (empty.length === 0) return prev;

      const idx = empty[randInt(0, empty.length - 1)];
      const crop = pickCrop();
      const base = cropMeta[crop].growMs;
      const growMs = clamp(base - level * 50, 900, base);
      const readyAt = now + growMs;
      const overripeAt = readyAt + clamp(800 - level * 35, 260, 900);

      return {
        ...prev,
        [idx]: {
          id: `${now}-${idx}`,
          crop,
          stage: 0,
          plantedAt: now,
          readyAt,
          overripeAt,
          harvested: false,
        },
      };
    });
  }, [level]);

  useEffect(() => {
    if (!running) return;

    function tick() {
      const now = Date.now();
      // stage updates + overripe removal
      setPlots((prev) => {
        let changed = false;
        const next = { ...prev };
        for (let i = 0; i < COUNT; i++) {
          const p = next[i];
          if (!p) continue;

          if (now >= p.overripeAt) {
            next[i] = null;
            changed = true;
            setCombo(0);
            setHint("Missed! Crop overripe.");
            continue;
          }

          const progress = (now - p.plantedAt) / (p.readyAt - p.plantedAt);
          const stage: Stage = progress < 0.33 ? 0 : progress < 0.66 ? 1 : progress < 0.98 ? 2 : 3;
          if (stage !== p.stage) {
            next[i] = { ...p, stage };
            changed = true;
          }
        }
        return changed ? next : prev;
      });

      if (now - lastSpawnRef.current > spawnEvery) {
        lastSpawnRef.current = now;
        spawn();
      }

      tickRef.current = window.setTimeout(tick, 80);
    }

    tickRef.current = window.setTimeout(tick, 80);
    return () => {
      if (tickRef.current) window.clearTimeout(tickRef.current);
    };
  }, [running, spawn, spawnEvery]);

  const onClickPlot = useCallback(
    (idx: number) => {
      if (!running) return;
      const p = plots[idx];
      if (!p) {
        setHint("No crop here.");
        setCombo(0);
        return;
      }

      const now = Date.now();
      const isReady = now >= p.readyAt && now < p.overripeAt;

      if (!isReady) {
        setHint("Too early! -5");
        setScore((s) => Math.max(0, s - 5));
        setCombo(0);
        return;
      }

      const perfectWindow = 220;
      const delta = Math.abs(now - p.readyAt);
      const perfect = delta <= perfectWindow;

      const nextCombo = combo + 1;
      const mult = 1 + Math.floor(nextCombo / 4);
      const base = p.crop === "corn" ? 14 : p.crop === "carrot" ? 12 : 10;
      const gained = (perfect ? base + 6 : base) * mult;

      setCombo(nextCombo);
      setHarvested((h) => h + 1);
      setHint(perfect ? `Perfect! +${gained}` : `Harvested +${gained}`);
      setScore((s) => {
        const ns = s + gained;
        saveBest(ns);
        return ns;
      });

      setPlots((prev) => ({ ...prev, [idx]: null }));
    },
    [combo, plots, running, saveBest],
  );

  const start = () => {
    reset();
    setRunning(true);
  };

  const cropPixel = (p: Plot) => {
    const meta = cropMeta[p.crop];
    const stageSize = p.stage === 0 ? 10 : p.stage === 1 ? 14 : p.stage === 2 ? 18 : 20;
    const color = p.stage === 3 ? meta.readyColor : meta.color;
    return (
      <span
        className="absolute left-1/2 top-1/2 block rounded-sm"
        style={{
          width: stageSize,
          height: stageSize,
          transform: "translate(-50%, -50%)",
          background: color,
          boxShadow: "0 0 0 2px rgba(0,0,0,0.12) inset",
        }}
      />
    );
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-3 py-2 text-[10px] font-mono text-muted-foreground border-b border-border bg-muted/30">
          <span>SCORE:{score}</span>
          <span>BEST:{Math.max(score, best)}</span>
          <span>COMBO:{combo}</span>
          <span>HARV:{harvested}</span>
          <span>LVL:{level}</span>
        </div>

        <div className="p-3">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: COUNT }, (_, i) => {
              const p = plots[i];
              const dirt = (i + Math.floor(i / 4)) % 2 === 0;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onClickPlot(i)}
                  className={[
                    "relative aspect-square rounded-md border border-black/10",
                    "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.10)]",
                    dirt ? "bg-[#8b5a2b]" : "bg-[#7a4e25]",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  ].join(" ")}
                >
                  {/* grass edge */}
                  <span className="absolute left-0 top-0 h-1 w-full bg-[#4f8f2b] opacity-60" />
                  {p && cropPixel(p)}
                  {p?.stage === 3 && (
                    <span className="absolute right-1 top-1 size-1 bg-[#fff] opacity-70" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-3 space-y-2">
        <div className="flex items-center justify-between">
          {running ? (
            <Button variant="secondary" className="font-mono" onClick={reset}>
              Restart
            </Button>
          ) : (
            <Button className="font-mono" onClick={start}>
              Start
            </Button>
          )}
          <div className="text-[10px] font-mono text-muted-foreground min-h-[14px] text-right">
            {hint}
          </div>
        </div>
      </div>
    </div>
  );
}

