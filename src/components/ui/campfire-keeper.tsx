"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export default function CampfireKeeper() {
  const [best, setBest] = useState(0);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [heat, setHeat] = useState(65); // 0..100
  const [level, setLevel] = useState(1);
  const [msg, setMsg] = useState<string>("Keep the fire in the sweet spot.");

  const rafRef = useRef<number | null>(null);
  const lastRef = useRef<number>(0);

  const saveBest = useCallback((value: number) => {
    setBest((prev) => {
      const next = Math.max(prev, value);
      try {
        localStorage.setItem("campfireKeeperBest", String(next));
      } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    try {
      const v = localStorage.getItem("campfireKeeperBest");
      const n = v ? parseInt(v, 10) : 0;
      if (Number.isFinite(n)) setBest(n);
    } catch {}
  }, []);

  const stage = useMemo(() => {
    if (heat < 25) return "low";
    if (heat < 70) return "cozy";
    if (heat < 90) return "strong";
    return "over";
  }, [heat]);

  const reset = useCallback(() => {
    setRunning(false);
    setScore(0);
    setCombo(0);
    setHeat(65);
    setLevel(1);
    setMsg("Keep the fire in the sweet spot.");
    lastRef.current = 0;
  }, []);

  const start = () => {
    reset();
    setRunning(true);
  };

  useEffect(() => {
    function loop(t: number) {
      if (lastRef.current === 0) lastRef.current = t;
      const dt = Math.min(0.033, (t - lastRef.current) / 1000);
      lastRef.current = t;

      if (running) {
        // difficulty ramps with score
        setLevel((lvl) => Math.max(lvl, 1 + Math.floor(score / 120)));

        // fire decays faster with level
        const decay = 6 + level * 1.6;
        setHeat((h) => clamp(h - decay * dt, 0, 100));

        // passive score if alive
        setScore((s) => {
          const ns = s + Math.floor(18 * dt);
          saveBest(ns);
          return ns;
        });

        // if fully dead, combo breaks and message updates
        if (heat <= 1) {
          setCombo(0);
          setMsg("Fire went out! Click to add wood.");
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [heat, level, running, saveBest, score]);

  const addWood = useCallback(() => {
    if (!running) return;

    const inSweetSpot = heat >= 45 && heat <= 65;
    const tooHot = heat > 80;

    if (tooHot) {
      // overfeeding penalty: adds little heat and breaks combo
      setCombo(0);
      setMsg("Overfed! Efficiency down.");
      setHeat((h) => clamp(h + 4, 0, 100));
      setScore((s) => Math.max(0, s - 8));
      return;
    }

    const nextCombo = inSweetSpot ? combo + 1 : 0;
    const mult = 1 + Math.floor(nextCombo / 4);
    const gain = inSweetSpot ? 14 * mult : 8;

    setCombo(nextCombo);
    setMsg(inSweetSpot ? `Perfect timing! +${gain}` : `Added wood +${gain}`);
    setScore((s) => {
      const ns = s + gain;
      saveBest(ns);
      return ns;
    });
    setHeat((h) => clamp(h + (inSweetSpot ? 16 : 12), 0, 100));
  }, [combo, heat, running, saveBest]);

  const fireColor =
    stage === "low"
      ? "#ffb020"
      : stage === "cozy"
        ? "#ff7a18"
        : stage === "strong"
          ? "#ff3b30"
          : "#ffffff";

  const glow =
    stage === "low"
      ? "0 0 20px rgba(255,176,32,0.28)"
      : stage === "cozy"
        ? "0 0 26px rgba(255,122,24,0.35)"
        : stage === "strong"
          ? "0 0 34px rgba(255,59,48,0.35)"
          : "0 0 42px rgba(255,255,255,0.22)";

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-3 py-2 text-[10px] font-mono text-muted-foreground border-b border-border bg-muted/30">
          <span>SCORE:{score}</span>
          <span>BEST:{Math.max(score, best)}</span>
          <span>COMBO:{combo}</span>
          <span>LVL:{level}</span>
        </div>

        <div className="p-3">
          <div className="mx-auto rounded-lg border border-black/10 bg-[#0b1020] overflow-hidden" style={{ width: 320, height: 240 }}>
            {/* stars */}
            <div className="relative w-full h-full">
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute block size-1 bg-white/70"
                  style={{
                    left: `${(i * 23) % 95}%`,
                    top: `${(i * 37) % 55}%`,
                    opacity: 0.35 + ((i % 5) * 0.1),
                  }}
                />
              ))}

              {/* ground */}
              <div className="absolute left-0 right-0 bottom-0 h-20 bg-[#16351c]" />
              <div className="absolute left-0 right-0 bottom-16 h-1 bg-[#214c28] opacity-70" />

              {/* logs */}
              <div className="absolute left-1/2 bottom-10 h-3 w-20 -translate-x-1/2 rounded-sm bg-[#8b6834]" />
              <div className="absolute left-1/2 bottom-8 h-3 w-16 -translate-x-1/2 rotate-6 rounded-sm bg-[#a07840]" />

              {/* fire meter */}
              <div className="absolute left-3 top-3 w-24">
                <div className="text-[10px] font-mono text-white/70">FIRE</div>
                <div className="mt-1 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-[#ffb020]" style={{ width: `${heat}%` }} />
                </div>
                <div className="mt-1 text-[10px] font-mono text-white/60">
                  {stage.toUpperCase()}
                </div>
              </div>

              {/* sweet spot band */}
              <div className="absolute left-3 top-[34px] h-2 w-24 rounded-full bg-white/5" />
              <div className="absolute left-3 top-[34px] h-2 w-[24px] translate-x-[52px] rounded-full bg-[#22c55e]/30" />

              {/* fire */}
              <div
                className="absolute left-1/2 bottom-14 -translate-x-1/2"
                style={{ width: 34, height: 34, filter: "pixelated" as any }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: fireColor,
                    boxShadow: glow,
                    clipPath:
                      stage === "over"
                        ? "polygon(50% 0%, 72% 22%, 100% 40%, 78% 66%, 50% 100%, 22% 66%, 0% 40%, 28% 22%)"
                        : "polygon(50% 0%, 70% 24%, 86% 52%, 66% 82%, 50% 100%, 34% 82%, 14% 52%, 30% 24%)",
                  }}
                />
                <div className="absolute left-2 top-2 size-1 bg-white/70" />
                <div className="absolute right-2 bottom-3 size-1 bg-black/20" />
              </div>

              {/* hint */}
              <div className="absolute left-3 right-3 bottom-2 text-center text-[10px] font-mono text-white/70">
                {msg}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-3 space-y-2">
        <div className="flex items-center justify-between">
          {running ? (
            <Button className="font-mono" onClick={addWood}>
              Add wood
            </Button>
          ) : (
            <Button className="font-mono" onClick={start}>
              Start
            </Button>
          )}
          {running && (
            <Button variant="secondary" className="font-mono" onClick={reset}>
              Restart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

