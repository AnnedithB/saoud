"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type BugKind = "bug" | "fake" | "gold";

type Cell = {
  id: string;
  kind: BugKind;
  bornAt: number;
  expiresAt: number;
};

const GRID = 4; // 4x4
const CELL_COUNT = GRID * GRID;

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function BugCatcher() {
  const [best, setBest] = useState(0);

  const [running, setRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [level, setLevel] = useState(1);
  const [cells, setCells] = useState<Record<number, Cell | null>>(() =>
    Object.fromEntries(Array.from({ length: CELL_COUNT }, (_, i) => [i, null])),
  );
  const [toast, setToast] = useState<string | null>(null);

  const tickRef = useRef<number | null>(null);
  const lastSpawnRef = useRef<number>(0);

  const accuracy = useMemo(() => {
    const total = hits + misses;
    if (total === 0) return 100;
    return Math.round((hits / total) * 100);
  }, [hits, misses]);

  useEffect(() => {
    try {
      const v = localStorage.getItem("bugCatcherBest");
      const n = v ? parseInt(v, 10) : 0;
      if (Number.isFinite(n)) setBest(n);
    } catch {}
  }, []);

  const saveBest = useCallback((value: number) => {
    setBest((prev) => {
      const next = Math.max(prev, value);
      try {
        localStorage.setItem("bugCatcherBest", String(next));
      } catch {}
      return next;
    });
  }, []);

  const spawn = useCallback(() => {
    const now = Date.now();
    setCells((prev) => {
      const next = { ...prev };
      const empty = Object.keys(next)
        .map((k) => parseInt(k, 10))
        .filter((i) => next[i] === null);
      if (empty.length === 0) return prev;

      const multi = level >= 6 ? randInt(1, 2) : level >= 10 ? randInt(1, 3) : 1;
      for (let s = 0; s < multi; s++) {
        const idx = empty.splice(randInt(0, empty.length - 1), 1)[0];
        if (idx === undefined) break;

        const roll = Math.random();
        const kind: BugKind = roll < 0.08 ? "gold" : roll < 0.18 ? "fake" : "bug";

        const lifeMs = clamp(900 - level * 55, 260, 900);
        next[idx] = {
          id: `${now}-${idx}-${Math.random().toString(16).slice(2)}`,
          kind,
          bornAt: now,
          expiresAt: now + lifeMs,
        };
      }
      return next;
    });
  }, [level]);

  const reset = useCallback(() => {
    setRunning(false);
    setScore(0);
    setStreak(0);
    setHits(0);
    setMisses(0);
    setLevel(1);
    setToast(null);
    setCells(Object.fromEntries(Array.from({ length: CELL_COUNT }, (_, i) => [i, null])) as any);
    lastSpawnRef.current = 0;
  }, []);

  useEffect(() => {
    if (!running) return;

    function tick() {
      const now = Date.now();
      // expire bugs
      setCells((prev) => {
        let changed = false;
        const next = { ...prev };
        for (let i = 0; i < CELL_COUNT; i++) {
          const c = next[i];
          if (c && c.expiresAt <= now) {
            next[i] = null;
            changed = true;
            if (c.kind === "bug" || c.kind === "gold") {
              setMisses((m) => m + 1);
              setStreak(0);
            }
          }
        }
        return changed ? next : prev;
      });

      // spawn schedule
      const spawnEvery = clamp(650 - level * 35, 210, 650);
      if (now - lastSpawnRef.current > spawnEvery) {
        lastSpawnRef.current = now;
        spawn();
      }

      // level ramp
      setLevel((lvl) => {
        const next = 1 + Math.floor(score / 80);
        return Math.max(lvl, next);
      });

      tickRef.current = window.setTimeout(tick, 60);
    }

    tickRef.current = window.setTimeout(tick, 60);
    return () => {
      if (tickRef.current) window.clearTimeout(tickRef.current);
    };
  }, [level, running, score, spawn]);

  const onClickCell = useCallback(
    (idx: number) => {
      if (!running) return;
      setCells((prev) => {
        const c = prev[idx];
        if (!c) return prev;
        const next = { ...prev, [idx]: null };
        return next;
      });

      const c = cells[idx];
      if (!c) return;

      if (c.kind === "fake") {
        setToast("Fake bug! -10");
        setScore((s) => Math.max(0, s - 10));
        setStreak(0);
        setMisses((m) => m + 1);
        return;
      }

      const nextStreak = streak + 1;
      const mult = 1 + Math.floor(nextStreak / 5);
      const base = c.kind === "gold" ? 25 : 10;
      const gained = base * mult;

      setToast(c.kind === "gold" ? `Golden! +${gained}` : `+${gained}`);
      setHits((h) => h + 1);
      setStreak(nextStreak);
      setScore((s) => {
        const ns = s + gained;
        saveBest(ns);
        return ns;
      });
    },
    [cells, running, saveBest, streak],
  );

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 650);
    return () => window.clearTimeout(t);
  }, [toast]);

  const start = () => {
    reset();
    setRunning(true);
  };

  const tileBg = (i: number) => {
    const isDirt = (i + Math.floor(i / GRID)) % 3 === 0;
    return isDirt ? "bg-[#a06b3a]" : "bg-[#5aa03a]";
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none">
      <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
        <div className="flex items-center justify-between gap-2 px-3 py-2 text-[10px] font-mono text-muted-foreground border-b border-border bg-muted/30">
          <span>SCORE:{score}</span>
          <span>BEST:{Math.max(score, best)}</span>
          <span>STREAK:{streak}</span>
          <span>ACC:{accuracy}%</span>
          <span>LVL:{level}</span>
        </div>

        <div className="p-3">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}>
            {Array.from({ length: CELL_COUNT }, (_, i) => {
              const c = cells[i];
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => onClickCell(i)}
                  className={[
                    "relative aspect-square rounded-md border border-black/10",
                    "shadow-[inset_0_0_0_2px_rgba(255,255,255,0.12)]",
                    tileBg(i),
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  ].join(" ")}
                  aria-label={`tile-${i}`}
                >
                  {/* pixel flowers */}
                  <span className="absolute left-1 top-1 block size-1 bg-[#ffd85a] opacity-80" />
                  <span className="absolute right-1 bottom-1 block size-1 bg-[#ff6aa8] opacity-60" />

                  {c && (
                    <span className="absolute inset-0 grid place-items-center">
                      {c.kind === "bug" && (
                        <span className="relative block size-6">
                          <span className="absolute left-2 top-2 size-2 bg-[#1b1b1b]" />
                          <span className="absolute left-1 top-3 size-1 bg-[#1b1b1b]" />
                          <span className="absolute left-3 top-3 size-1 bg-[#1b1b1b]" />
                          <span className="absolute left-1 top-1 size-1 bg-[#ffffff]" />
                        </span>
                      )}
                      {c.kind === "fake" && (
                        <span className="relative block size-6">
                          <span className="absolute left-1 top-1 size-4 bg-[#ef4444]" />
                          <span className="absolute left-2 top-2 size-2 bg-[#111]" />
                          <span className="absolute left-2 top-4 size-2 bg-[#111]" />
                        </span>
                      )}
                      {c.kind === "gold" && (
                        <span className="relative block size-6">
                          <span className="absolute left-1 top-1 size-4 bg-[#facc15]" />
                          <span className="absolute left-2 top-2 size-2 bg-[#111]" />
                          <span className="absolute left-2 top-4 size-2 bg-[#111]" />
                          <span className="absolute left-0 top-2 size-1 bg-[#fff]" />
                          <span className="absolute left-5 top-3 size-1 bg-[#fff]" />
                        </span>
                      )}
                    </span>
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
          <div className="text-[10px] font-mono text-muted-foreground min-h-[14px]">
            {toast ?? "Catch bugs. Avoid red fakes. Gold = bonus."}
          </div>
        </div>
      </div>
    </div>
  );
}

