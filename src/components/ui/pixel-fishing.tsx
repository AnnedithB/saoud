'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const W = 160;
const H = 144;
const POND = { x: 24, y: 48, w: 112, h: 72 };
const DOCK = { x: 60, y: 40, w: 40, h: 16 };

type Rarity = 'common' | 'rare' | 'legendary';
type Pattern = 'linear' | 'sine' | 'zigzag';
type GameState = 'idle' | 'fishing' | 'caught' | 'missed';

interface Fish {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  dx: number;
  dy: number;
  pattern: Pattern;
  rarity: Rarity;
  baseY: number;
  phase: number;
  dirTimer: number;
  points: number;
  bodyColor: string;
  finColor: string;
  eyeColor: string;
}

const COLORS = {
  grass1: '#5a8f29',
  grass2: '#4a7a22',
  grass3: '#6b9e35',
  water1: '#3b7dd8',
  water2: '#2d6bc4',
  water3: '#5090e0',
  waterDeep: '#2558a8',
  dock: '#8b6834',
  dockLight: '#a07840',
  dockDark: '#6e5228',
  reed: '#3d6e1e',
  reedDark: '#2d5516',
  rock: '#7a7a7a',
  rockLight: '#999',
  rockDark: '#5a5a5a',
  flower1: '#e84060',
  flower2: '#f0c040',
  flower3: '#d050d0',
  flower4: '#50c8e0',
  line: '#c8c8c8',
  hook: '#b0b0b0',
  hookDark: '#808080',
};

const FISH_PALETTES: Record<Rarity, { body: string; fin: string; eye: string }[]> = {
  common: [
    { body: '#f0a030', fin: '#e08020', eye: '#222' },
    { body: '#60c060', fin: '#40a040', eye: '#222' },
    { body: '#e06060', fin: '#c04040', eye: '#222' },
  ],
  rare: [
    { body: '#40b0e0', fin: '#2090c0', eye: '#fff' },
    { body: '#e0a0f0', fin: '#c070e0', eye: '#fff' },
  ],
  legendary: [
    { body: '#ffd700', fin: '#ffaa00', eye: '#f00' },
  ],
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function spawnFish(difficulty: number): Fish {
  const roll = Math.random();
  const rarity: Rarity = roll < 0.05 ? 'legendary' : roll < 0.20 ? 'rare' : 'common';
  const palette = pick(FISH_PALETTES[rarity]);
  const patterns: Pattern[] = ['linear', 'sine', 'zigzag'];
  const pattern = pick(patterns);

  const baseSpeed = rarity === 'legendary' ? 28 : rarity === 'rare' ? 22 : 14;
  const speed = baseSpeed + difficulty * 1.5;

  const fishW = rarity === 'legendary' ? 12 : rarity === 'rare' ? 10 : 8;
  const fishH = rarity === 'legendary' ? 7 : rarity === 'rare' ? 6 : 5;

  const margin = 6;
  const x = rand(POND.x + margin, POND.x + POND.w - margin - fishW);
  const y = rand(POND.y + margin + 8, POND.y + POND.h - margin - fishH);

  return {
    x,
    y,
    w: fishW,
    h: fishH,
    speed,
    dx: Math.random() > 0.5 ? 1 : -1,
    dy: Math.random() > 0.5 ? 0.3 : -0.3,
    pattern,
    rarity,
    baseY: y,
    phase: Math.random() * Math.PI * 2,
    dirTimer: rand(0.8, 2.5),
    points: rarity === 'legendary' ? 50 : rarity === 'rare' ? 20 : 10,
    bodyColor: palette.body,
    finColor: palette.fin,
    eyeColor: palette.eye,
  };
}

function drawPixel(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
}

function drawRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.floor(x), Math.floor(y), w, h);
}

function drawEnvironment(ctx: CanvasRenderingContext2D) {
  // grass background
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = ((x * 7 + y * 13) % 5);
      drawPixel(ctx, x, y, n < 2 ? COLORS.grass1 : n < 4 ? COLORS.grass2 : COLORS.grass3);
    }
  }

  // pond
  for (let y = POND.y; y < POND.y + POND.h; y++) {
    for (let x = POND.x; x < POND.x + POND.w; x++) {
      const edgeDist = Math.min(x - POND.x, POND.x + POND.w - 1 - x, y - POND.y, POND.y + POND.h - 1 - y);
      if (edgeDist <= 1) {
        drawPixel(ctx, x, y, COLORS.water3);
      } else if (edgeDist <= 3) {
        drawPixel(ctx, x, y, COLORS.water1);
      } else {
        const n = ((x * 3 + y * 7) % 3);
        drawPixel(ctx, x, y, n === 0 ? COLORS.water2 : COLORS.waterDeep);
      }
    }
  }

  // pond rounded corners (cut 2px)
  const corners = [
    [POND.x, POND.y], [POND.x + 1, POND.y],
    [POND.x, POND.y + 1],
    [POND.x + POND.w - 1, POND.y], [POND.x + POND.w - 2, POND.y],
    [POND.x + POND.w - 1, POND.y + 1],
    [POND.x, POND.y + POND.h - 1], [POND.x + 1, POND.y + POND.h - 1],
    [POND.x, POND.y + POND.h - 2],
    [POND.x + POND.w - 1, POND.y + POND.h - 1], [POND.x + POND.w - 2, POND.y + POND.h - 1],
    [POND.x + POND.w - 1, POND.y + POND.h - 2],
  ];
  for (const [cx, cy] of corners) {
    const n = ((cx * 7 + cy * 13) % 5);
    drawPixel(ctx, cx, cy, n < 2 ? COLORS.grass1 : n < 4 ? COLORS.grass2 : COLORS.grass3);
  }

  // dock
  for (let y = DOCK.y; y < DOCK.y + DOCK.h; y++) {
    for (let x = DOCK.x; x < DOCK.x + DOCK.w; x++) {
      const stripe = ((x - DOCK.x) % 6 < 3);
      drawPixel(ctx, x, y, stripe ? COLORS.dock : COLORS.dockLight);
    }
  }
  drawRect(ctx, DOCK.x, DOCK.y, DOCK.w, 1, COLORS.dockDark);
  drawRect(ctx, DOCK.x, DOCK.y + DOCK.h - 1, DOCK.w, 1, COLORS.dockDark);

  // reeds on left
  const reedsL = [[POND.x - 2, POND.y + 6], [POND.x - 3, POND.y + 18], [POND.x - 1, POND.y + 30]];
  for (const [rx, ry] of reedsL) {
    for (let i = 0; i < 10; i++) drawPixel(ctx, rx, ry - i, i < 3 ? COLORS.reedDark : COLORS.reed);
    drawPixel(ctx, rx - 1, ry - 9, COLORS.reed);
    drawPixel(ctx, rx + 1, ry - 8, COLORS.reed);
  }

  // reeds on right
  const reedsR = [[POND.x + POND.w + 1, POND.y + 10], [POND.x + POND.w + 2, POND.y + 28]];
  for (const [rx, ry] of reedsR) {
    for (let i = 0; i < 10; i++) drawPixel(ctx, rx, ry - i, i < 3 ? COLORS.reedDark : COLORS.reed);
    drawPixel(ctx, rx + 1, ry - 9, COLORS.reed);
    drawPixel(ctx, rx - 1, ry - 8, COLORS.reed);
  }

  // rocks
  const rocks = [[10, 30], [145, 60], [14, 130], [140, 20]];
  for (const [rx, ry] of rocks) {
    drawRect(ctx, rx, ry, 4, 3, COLORS.rock);
    drawRect(ctx, rx + 1, ry - 1, 2, 1, COLORS.rockLight);
    drawPixel(ctx, rx + 3, ry + 2, COLORS.rockDark);
  }

  // flowers
  const flowers = [
    [8, 18, COLORS.flower1], [20, 8, COLORS.flower2],
    [130, 12, COLORS.flower3], [148, 38, COLORS.flower4],
    [12, 110, COLORS.flower2], [145, 130, COLORS.flower1],
    [30, 135, COLORS.flower3], [120, 135, COLORS.flower4],
  ];
  for (const [fx, fy, fc] of flowers) {
    drawPixel(ctx, fx as number, fy as number, fc as string);
    drawPixel(ctx, (fx as number) - 1, fy as number, fc as string);
    drawPixel(ctx, (fx as number) + 1, fy as number, fc as string);
    drawPixel(ctx, fx as number, (fy as number) - 1, fc as string);
    drawPixel(ctx, fx as number, (fy as number) + 1, '#2d5516');
    drawPixel(ctx, fx as number, (fy as number) + 2, '#2d5516');
  }
}

function drawFish(ctx: CanvasRenderingContext2D, fish: Fish) {
  const { x, y, w, h, dx, bodyColor, finColor, eyeColor } = fish;
  const fx = Math.floor(x);
  const fy = Math.floor(y);
  const facingRight = dx > 0;

  // body
  drawRect(ctx, fx + 1, fy, w - 2, h, bodyColor);
  drawRect(ctx, fx, fy + 1, w, h - 2, bodyColor);

  // tail fin
  if (facingRight) {
    drawRect(ctx, fx - 1, fy + 1, 2, h - 2, finColor);
  } else {
    drawRect(ctx, fx + w - 1, fy + 1, 2, h - 2, finColor);
  }

  // dorsal fin
  drawRect(ctx, fx + Math.floor(w / 2) - 1, fy - 1, 3, 1, finColor);

  // eye
  const eyeX = facingRight ? fx + w - 3 : fx + 2;
  const eyeY = fy + 1;
  drawPixel(ctx, eyeX, eyeY, eyeColor);

  // belly highlight
  drawRect(ctx, fx + 2, fy + h - 2, w - 4, 1, '#ffffff40');
}

function drawHook(ctx: CanvasRenderingContext2D, hookX: number, hookY: number, lineStart: { x: number; y: number }) {
  // fishing line
  ctx.fillStyle = COLORS.line;
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lx = lineStart.x + (hookX - lineStart.x) * t;
    const ly = lineStart.y + (hookY - lineStart.y) * t + Math.sin(t * Math.PI) * 3;
    ctx.fillRect(Math.floor(lx), Math.floor(ly), 1, 1);
  }

  // hook
  const hx = Math.floor(hookX);
  const hy = Math.floor(hookY);
  drawRect(ctx, hx, hy, 1, 4, COLORS.hook);
  drawPixel(ctx, hx + 1, hy + 4, COLORS.hook);
  drawPixel(ctx, hx + 1, hy + 5, COLORS.hook);
  drawPixel(ctx, hx, hy + 5, COLORS.hookDark);
  drawPixel(ctx, hx - 1, hy + 4, COLORS.hookDark);
}

function drawTimingRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  angle: number,
  sweetSpotSize: number,
  state: GameState,
) {
  if (state !== 'fishing') return;

  const r = 8;
  const segments = 32;

  for (let i = 0; i < segments; i++) {
    const a1 = (i / segments) * Math.PI * 2;
    const a2 = ((i + 1) / segments) * Math.PI * 2;

    const sweetCenter = 0;
    let diff = Math.abs(a1 - sweetCenter);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    const inSweet = diff < sweetSpotSize / 2;

    const x1 = cx + Math.cos(a1) * r;
    const y1 = cy + Math.sin(a1) * r;
    drawPixel(ctx, x1, y1, inSweet ? '#40e040' : '#ffffff40');

    void a2;
  }

  // indicator dot
  const ix = cx + Math.cos(angle) * r;
  const iy = cy + Math.sin(angle) * r;
  drawRect(ctx, Math.floor(ix) - 1, Math.floor(iy) - 1, 3, 3, '#ff3030');
}

function drawRipple(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
  const r = 3 + t * 8;
  const alpha = 1 - t;
  if (alpha <= 0) return;
  ctx.globalAlpha = alpha * 0.5;
  const segments = 16;
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const px = x + Math.cos(a) * r;
    const py = y + Math.sin(a) * r * 0.5;
    drawPixel(ctx, px, py, '#ffffff');
  }
  ctx.globalAlpha = 1;
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, color = '#fff') {
  ctx.fillStyle = '#00000080';
  ctx.fillRect(x - 1, y - 1, text.length * 4 + 2, 7);
  ctx.fillStyle = color;
  ctx.font = '5px monospace';
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
}

export default function PixelFishing({ embedded = false }: { embedded?: boolean } = {}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const envCacheRef = useRef<ImageData | null>(null);
  const frameRef = useRef(0);

  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [fishCaught, setFishCaught] = useState(0);
  const [difficulty, setDifficulty] = useState(0);

  const fishRef = useRef<Fish>(spawnFish(0));
  const hookRef = useRef({ x: DOCK.x + DOCK.w / 2, y: DOCK.y + DOCK.h + 4 });
  const angleRef = useRef(0);
  const rippleRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const feedbackRef = useRef<{ text: string; x: number; y: number; t: number; color: string } | null>(null);
  const gameStateRef = useRef<GameState>('idle');
  const scoreRef = useRef(0);
  const comboRef = useRef(0);
  const difficultyRef = useRef(0);
  const fishCaughtRef = useRef(0);
  const stateTimerRef = useRef(0);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pixelFishingBest');
      if (!saved) return;
      const n = parseInt(saved, 10);
      if (Number.isFinite(n)) setBestScore(n);
    } catch {}
  }, []);

  const saveBest = useCallback((s: number) => {
    setBestScore(prev => {
      const next = Math.max(prev, s);
      try { localStorage.setItem('pixelFishingBest', String(next)); } catch {}
      return next;
    });
  }, []);

  const startGame = useCallback(() => {
    setGameState('fishing');
    setScore(0);
    setCombo(0);
    setFishCaught(0);
    setDifficulty(0);
    scoreRef.current = 0;
    comboRef.current = 0;
    difficultyRef.current = 0;
    fishCaughtRef.current = 0;
    fishRef.current = spawnFish(0);
    angleRef.current = 0;
    rippleRef.current = [];
    feedbackRef.current = null;
    stateTimerRef.current = 0;
    hookRef.current = { x: DOCK.x + DOCK.w / 2, y: DOCK.y + DOCK.h + 4 };
  }, []);

  const handleCanvasClick = useCallback(() => {
    if (gameStateRef.current !== 'fishing') return;

    const sweetSpotSize = Math.max(0.6, 1.4 - difficultyRef.current * 0.06);
    const angle = angleRef.current;
    const sweetCenter = 0;
    let diff = Math.abs(angle - sweetCenter);
    if (diff > Math.PI) diff = Math.PI * 2 - diff;
    const hit = diff < sweetSpotSize / 2;

    const fish = fishRef.current;

    if (hit) {
      const newCombo = comboRef.current + 1;
      const multiplier = Math.min(5, 1 + Math.floor(newCombo / 3));
      const earned = fish.points * multiplier;
      const newScore = scoreRef.current + earned;

      comboRef.current = newCombo;
      scoreRef.current = newScore;
      fishCaughtRef.current += 1;
      difficultyRef.current += 1;

      setCombo(newCombo);
      setScore(newScore);
      setFishCaught(fishCaughtRef.current);
      setDifficulty(difficultyRef.current);
      saveBest(newScore);

      rippleRef.current.push({ x: fish.x + fish.w / 2, y: fish.y + fish.h / 2, t: 0 });

      const rarityLabel = fish.rarity !== 'common' ? ` ${fish.rarity.toUpperCase()}!` : '';
      feedbackRef.current = {
        text: `+${earned}${multiplier > 1 ? ` x${multiplier}` : ''}${rarityLabel}`,
        x: fish.x,
        y: fish.y - 6,
        t: 0,
        color: fish.rarity === 'legendary' ? '#ffd700' : fish.rarity === 'rare' ? '#40b0e0' : '#40e040',
      };

      stateTimerRef.current = 0;
      setGameState('caught');
    } else {
      comboRef.current = 0;
      setCombo(0);

      rippleRef.current.push({ x: hookRef.current.x, y: hookRef.current.y + 5, t: 0 });
      feedbackRef.current = {
        text: 'MISS',
        x: hookRef.current.x - 4,
        y: hookRef.current.y - 6,
        t: 0,
        color: '#ff4040',
      };

      stateTimerRef.current = 0;
      setGameState('missed');
    }
  }, [saveBest]);

  // main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    let lastTime = 0;
    let running = true;

    function loop(time: number) {
      if (!running) return;
      const dt = Math.min(0.05, (time - lastTime) / 1000);
      lastTime = time;

      const state = gameStateRef.current;

      // cache environment layer
      if (!envCacheRef.current) {
        drawEnvironment(ctx!);
        envCacheRef.current = ctx!.getImageData(0, 0, W, H);
      } else {
        ctx!.putImageData(envCacheRef.current, 0, 0);
      }

      const fish = fishRef.current;

      // update fish movement
      if (state === 'fishing') {
        fish.phase += dt * fish.speed * 0.15;
        fish.dirTimer -= dt;
        if (fish.dirTimer <= 0) {
          fish.dx = Math.random() > 0.5 ? 1 : -1;
          fish.dy = rand(-0.5, 0.5);
          fish.dirTimer = rand(0.6, 2.0);
        }

        const moveSpeed = fish.speed * dt;
        fish.x += fish.dx * moveSpeed;

        if (fish.pattern === 'sine') {
          fish.y = fish.baseY + Math.sin(fish.phase) * 8;
        } else if (fish.pattern === 'zigzag') {
          fish.y += fish.dy * moveSpeed * 0.7;
        } else {
          fish.y += fish.dy * moveSpeed * 0.3;
        }

        // bounds
        const margin = 4;
        if (fish.x < POND.x + margin) { fish.x = POND.x + margin; fish.dx = Math.abs(fish.dx); }
        if (fish.x + fish.w > POND.x + POND.w - margin) { fish.x = POND.x + POND.w - margin - fish.w; fish.dx = -Math.abs(fish.dx); }
        if (fish.y < POND.y + 8) { fish.y = POND.y + 8; fish.dy = Math.abs(fish.dy); fish.baseY = fish.y; }
        if (fish.y + fish.h > POND.y + POND.h - margin) { fish.y = POND.y + POND.h - margin - fish.h; fish.dy = -Math.abs(fish.dy); fish.baseY = fish.y; }

        // hook follows fish loosely
        hookRef.current.x += (fish.x + fish.w / 2 - hookRef.current.x) * dt * 2;
        hookRef.current.y += (fish.y - 6 - hookRef.current.y) * dt * 1.5;

        // timing ring rotation
        angleRef.current += dt * (2.5 + difficultyRef.current * 0.15);
        if (angleRef.current > Math.PI * 2) angleRef.current -= Math.PI * 2;
      }

      // state transitions
      if (state === 'caught' || state === 'missed') {
        stateTimerRef.current += dt;
        if (stateTimerRef.current > 0.8) {
          fishRef.current = spawnFish(difficultyRef.current);
          hookRef.current = { x: DOCK.x + DOCK.w / 2, y: DOCK.y + DOCK.h + 4 };
          angleRef.current = 0;
          stateTimerRef.current = 0;
          setGameState('fishing');
        }
      }

      // draw fish
      if (state === 'fishing' || state === 'missed') {
        drawFish(ctx!, fish);
      }

      // draw hook + line
      if (state !== 'idle') {
        const lineStart = { x: DOCK.x + DOCK.w / 2, y: DOCK.y + 2 };
        drawHook(ctx!, hookRef.current.x, hookRef.current.y, lineStart);
      }

      // timing ring
      if (state === 'fishing') {
        const sweetSpotSize = Math.max(0.6, 1.4 - difficultyRef.current * 0.06);
        drawTimingRing(ctx!, hookRef.current.x + 12, hookRef.current.y, angleRef.current, sweetSpotSize, state);
      }

      // ripples
      rippleRef.current = rippleRef.current.filter(r => {
        r.t += dt * 1.5;
        if (r.t >= 1) return false;
        drawRipple(ctx!, r.x, r.y, r.t);
        return true;
      });

      // feedback text
      if (feedbackRef.current) {
        feedbackRef.current.t += dt * 2;
        const fb = feedbackRef.current;
        if (fb.t < 1) {
          const yOff = fb.t * 8;
          ctx!.globalAlpha = 1 - fb.t;
          drawText(ctx!, fb.text, fb.x, fb.y - yOff, fb.color);
          ctx!.globalAlpha = 1;
        } else {
          feedbackRef.current = null;
        }
      }

      // HUD
      if (state !== 'idle') {
        drawText(ctx!, `SCORE:${scoreRef.current}`, 2, 2);
        drawText(ctx!, `BEST:${Math.max(scoreRef.current, bestScore)}`, 2, 10);
        const mult = Math.min(5, 1 + Math.floor(comboRef.current / 3));
        if (comboRef.current > 0) {
          drawText(ctx!, `COMBO:${comboRef.current} x${mult}`, 2, 18, '#f0c040');
        }
        drawText(ctx!, `FISH:${fishCaughtRef.current}`, W - 36, 2);

        // rarity indicator
        if (state === 'fishing' && fish.rarity !== 'common') {
          const label = fish.rarity === 'legendary' ? '!! LEGENDARY !!' : '! RARE !';
          const color = fish.rarity === 'legendary' ? '#ffd700' : '#40b0e0';
          drawText(ctx!, label, W / 2 - label.length * 2, H - 8, color);
        }
      }

      // idle title
      if (state === 'idle') {
        drawText(ctx!, 'PIXEL FISHING', W / 2 - 26, H / 2 - 20, '#ffd700');
        drawText(ctx!, 'Click to start', W / 2 - 28, H / 2 - 10, '#c8c8c8');
        if (bestScore > 0) {
          drawText(ctx!, `Best: ${bestScore}`, W / 2 - 18, H / 2, '#a0a0a0');
        }
      }

      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      running = false;
      cancelAnimationFrame(frameRef.current);
    };
  }, [bestScore]);

  const handleClick = useCallback(() => {
    if (gameStateRef.current === 'idle') {
      startGame();
    } else {
      handleCanvasClick();
    }
  }, [startGame, handleCanvasClick]);

  const multiplier = Math.min(5, 1 + Math.floor(combo / 3));

  const hud = (
    <div className="flex items-center justify-between gap-2 px-3 py-2 text-[10px] font-mono text-muted-foreground border-b border-border bg-muted/30">
      <span>SCORE:{score}</span>
      <span>BEST:{Math.max(score, bestScore)}</span>
      {combo > 0 && <span className="text-foreground">x{multiplier}</span>}
      <span>FISH:{fishCaught}</span>
      <span>LVL:{difficulty}</span>
    </div>
  );

  const canvas = (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      onClick={handleClick}
      className="block w-full cursor-pointer [image-rendering:pixelated] [aspect-ratio:160/144]"
    />
  );

  const controls = (
    <div className="flex items-center gap-2">
      {gameState === 'idle' ? (
        <Button onClick={startGame} className="font-mono">
          Cast
        </Button>
      ) : (
        <Button onClick={startGame} variant="secondary" className="font-mono">
          Restart
        </Button>
      )}
      <Button
        type="button"
        variant="outline"
        className="font-mono"
        onClick={handleCanvasClick}
        disabled={gameState !== 'fishing'}
      >
        Reel
      </Button>
    </div>
  );

  if (embedded) {
    return (
      <div className="w-full h-full flex flex-col justify-between select-none">
        <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
          {hud}
          <div className="p-2 flex items-center justify-center">
            <div className="w-full">{canvas}</div>
          </div>
        </div>

        <div className="pt-3 space-y-2">
          <div className="flex items-center justify-between">{controls}</div>
          <p className="text-[10px] text-muted-foreground font-mono">
            Click when the red dot hits the green zone.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-[720px] select-none">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Pixel Fishing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border border-border bg-muted/40 overflow-hidden">
          {hud}
          {canvas}
        </div>
        {controls}
        <p className="text-xs text-muted-foreground font-mono">
          Click when the red dot hits the green zone.
        </p>
      </CardContent>
    </Card>
  );
}
