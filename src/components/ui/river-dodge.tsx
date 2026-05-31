"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type Obstacle = { id: string; x: number; y: number; w: number; h: number; vx: number; kind: "log" | "rock" };
type Collectible = { id: string; x: number; y: number; r: number };

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}

export default function RiverDodge() {
  const W = 320;
  const H = 240;
  const riverX = 40;
  const riverW = 240;

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  const [best, setBest] = useState(0);

  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);
  const [scoreMs, setScoreMs] = useState(0);
  const [level, setLevel] = useState(1);
  const [nearMiss, setNearMiss] = useState(0);
  const [coins, setCoins] = useState(0);

  const stateRef = useRef({
    px: riverX + riverW / 2,
    targetX: riverX + riverW / 2,
    obstacles: [] as Obstacle[],
    coins: [] as Collectible[],
    spawnT: 0,
    coinT: 1.2,
  });

  const saveBest = useCallback((value: number) => {
    setBest((prev) => {
      const next = Math.max(prev, value);
      try {
        localStorage.setItem("riverDodgeBestMs", String(next));
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      const v = localStorage.getItem("riverDodgeBestMs");
      const n = v ? parseInt(v, 10) : 0;
      if (Number.isFinite(n)) setBest(n);
    } catch {}
  }, []);

  const reset = useCallback(() => {
    stateRef.current = {
      px: riverX + riverW / 2,
      targetX: riverX + riverW / 2,
      obstacles: [],
      coins: [],
      spawnT: 0.6,
      coinT: 1.2,
    };
    setRunning(false);
    setDead(false);
    setScoreMs(0);
    setLevel(1);
    setNearMiss(0);
    setCoins(0);
    lastRef.current = 0;
  }, [riverW]);

  const start = () => {
    reset();
    setRunning(true);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") stateRef.current.targetX -= 18;
      if (e.key === "ArrowRight") stateRef.current.targetX += 18;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    stateRef.current.targetX = riverX + clamp(x, 0, rect.width) * (riverW / rect.width);
  };

  const render = useMemo(() => {
    return (s: typeof stateRef.current) => {
      const px = s.px;
      const py = H - 24;
      return { px, py };
    };
  }, []);

  useEffect(() => {
    function loop(t: number) {
      if (lastRef.current === 0) lastRef.current = t;
      const dt = Math.min(0.033, (t - lastRef.current) / 1000);
      lastRef.current = t;

      if (running && !dead) {
        const s = stateRef.current;

        // level ramps with time
        setScoreMs((ms) => {
          const next = ms + Math.floor(dt * 1000);
          const lvl = 1 + Math.floor(next / 8000);
          setLevel(lvl);
          return next;
        });

        const speed = 70 + level * 16;

        // smooth player
        s.targetX = clamp(s.targetX, riverX + 14, riverX + riverW - 14);
        s.px += (s.targetX - s.px) * clamp(dt * 10, 0, 1);

        // spawn obstacles
        s.spawnT -= dt;
        if (s.spawnT <= 0) {
          const kind: Obstacle["kind"] = Math.random() < 0.55 ? "log" : "rock";
          const w = kind === "log" ? randInt(34, 54) : randInt(18, 28);
          const h = kind === "log" ? 12 : 16;
          const x = rand(riverX + 10, riverX + riverW - 10 - w);
          const vx = (Math.random() - 0.5) * 26;
          s.obstacles.push({
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            x,
            y: -20,
            w,
            h,
            vx,
            kind,
          });
          s.spawnT = clamp(0.85 - level * 0.05, 0.28, 0.85);
        }

        // spawn collectibles
        s.coinT -= dt;
        if (s.coinT <= 0) {
          s.coins.push({
            id: `${Date.now()}c-${Math.random().toString(16).slice(2)}`,
            x: rand(riverX + 12, riverX + riverW - 12),
            y: -10,
            r: 5,
          });
          s.coinT = clamp(1.9 - level * 0.06, 0.7, 1.9);
        }

        // move
        s.obstacles.forEach((o) => {
          o.y += speed * dt;
          o.x += o.vx * dt;
          o.x = clamp(o.x, riverX + 8, riverX + riverW - 8 - o.w);
        });
        s.obstacles = s.obstacles.filter((o) => o.y < H + 30);

        s.coins.forEach((c) => (c.y += (speed * 0.9) * dt));
        s.coins = s.coins.filter((c) => c.y < H + 20);

        // collision
        const player = render(s);
        const pr = 10;
        const px = player.px;
        const py = player.py;

        let near = false;

        for (const o of s.obstacles) {
          const ox1 = o.x;
          const oy1 = o.y;
          const ox2 = o.x + o.w;
          const oy2 = o.y + o.h;

          const cx = clamp(px, ox1, ox2);
          const cy = clamp(py, oy1, oy2);
          const dx = px - cx;
          const dy = py - cy;
          const dist2 = dx * dx + dy * dy;

          if (dist2 < pr * pr) {
            setDead(true);
            setRunning(false);
            saveBest(scoreMs);
            break;
          }

          if (dist2 < (pr + 8) * (pr + 8)) near = true;
        }

        if (near) setNearMiss((v) => v + 1);

        // collect coins
        s.coins = s.coins.filter((c) => {
          const dx = px - c.x;
          const dy = py - c.y;
          const hit = dx * dx + dy * dy < (pr + c.r) * (pr + c.r);
          if (hit) setCoins((v) => v + 1);
          return !hit;
        });

        // update best continuously
        saveBest(scoreMs);
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dead, level, render, running, saveBest, scoreMs]);

  const s = stateRef.current;
  const player = render(s);

  const bestSec = (best / 1000).toFixed(1);
  const sec = (scoreMs / 1000).toFixed(1);

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-3 py-2 text-[10px] font-mono text-muted-foreground border-b border-border bg-muted/30">
          <span>TIME:{sec}s</span>
          <span>BEST:{bestSec}s</span>
          <span>LVL:{level}</span>
          <span>COIN:{coins}</span>
        </div>

        <div className="p-3">
          <div
            className="relative mx-auto rounded-lg border border-black/10 bg-[#e6f2ff] overflow-hidden"
            style={{ width: W, height: H }}
            onMouseMove={onMouse}
          >
            {/* river */}
            <div className="absolute inset-0 bg-[#e6f2ff]" />
            <div
              className="absolute top-0 bottom-0"
              style={{ left: riverX, width: riverW, background: "#3b7dd8" }}
            />
            <div
              className="absolute top-0 bottom-0 opacity-70"
              style={{
                left: riverX,
                width: riverW,
                background:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 6px, rgba(0,0,0,0.02) 6px 12px)",
              }}
            />
            {/* banks */}
            <div className="absolute top-0 bottom-0 left-0" style={{ width: riverX, background: "#5a8f29" }} />
            <div
              className="absolute top-0 bottom-0"
              style={{ left: riverX + riverW, width: W - (riverX + riverW), background: "#5a8f29" }}
            />
            {/* reeds */}
            <div className="absolute left-2 top-2 size-1 bg-[#f0c040] opacity-70" />
            <div className="absolute right-2 bottom-2 size-1 bg-[#e84060] opacity-70" />

            {/* obstacles */}
            {s.obstacles.map((o) => (
              <div
                key={o.id}
                className="absolute rounded-sm"
                style={{
                  left: o.x,
                  top: o.y,
                  width: o.w,
                  height: o.h,
                  background: o.kind === "log" ? "#8b6834" : "#7a7a7a",
                  boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.12)",
                }}
              />
            ))}

            {/* coins */}
            {s.coins.map((c) => (
              <div
                key={c.id}
                className="absolute rounded-full"
                style={{
                  left: c.x - c.r,
                  top: c.y - c.r,
                  width: c.r * 2,
                  height: c.r * 2,
                  background: "#facc15",
                  boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.12)",
                }}
              />
            ))}

            {/* player raft */}
            <div
              className="absolute"
              style={{
                left: player.px - 12,
                top: player.py - 8,
                width: 24,
                height: 16,
              }}
            >
              <div className="absolute inset-0 rounded-sm" style={{ background: "#a07840" }} />
              <div className="absolute left-1 top-1 size-2 bg-[#fff] opacity-70" />
              <div className="absolute right-1 bottom-1 size-1 bg-[#000] opacity-25" />
            </div>

            {dead && (
              <div className="absolute inset-0 grid place-items-center bg-background/80 backdrop-blur-sm">
                <div className="text-center space-y-2">
                  <div className="text-sm font-semibold">Game over</div>
                  <div className="text-xs text-muted-foreground">Click Restart</div>
                </div>
              </div>
            )}
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
          <div className="text-[10px] font-mono text-muted-foreground text-right">
            Arrows or mouse. Near-miss: {nearMiss}
          </div>
        </div>
      </div>
    </div>
  );
}

