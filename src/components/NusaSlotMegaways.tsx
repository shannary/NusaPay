/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Coins, 
  Sparkles, 
  RefreshCw, 
  Play, 
  Trophy, 
  Zap, 
  Flame, 
  Award, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  Layers,
  Sliders,
  HelpCircle,
  Gem,
  GitCommit
} from 'lucide-react';
import { DbRecord } from '../types';

interface NusaSlotMegawaysProps {
  currentUser: string;
  dbType: 'PostgreSQL' | 'MySQL' | 'MongoDB';
  dbRecords: DbRecord[];
  onModifyRecords: (updater: (prev: DbRecord[]) => DbRecord[]) => void;
  onAddNotification?: (msg: string, type: 'info' | 'warning' | 'alert') => void;
  onAddAuditLog: (log: { type: 'INFO' | 'WARNING' | 'EXPLOIT' | 'SECURITY'; message: string }) => void;
}

// Global Progressive Jackpot static tracker
let globalJackpot = 5482910; // Starts at Rp 5.482.910 Rp

export default function NusaSlotMegaways({
  currentUser,
  dbType,
  dbRecords,
  onModifyRecords,
  onAddNotification,
  onAddAuditLog
}: NusaSlotMegawaysProps) {
  
  const [slotMode, setSlotMode] = useState<'MEGAWAYS' | 'PAYLINES'>('MEGAWAYS');
  const betOptions = [500, 1000, 2500, 5000, 10000, 25000];
  const [betSize, setBetSize] = useState<number>(2500);
  const paylineOptions = [1, 3, 5, 9, 15];
  const [activePaylines, setActivePaylines] = useState<number>(5);
  const [isMuted, setIsMuted] = useState(false);
  const [jackpotAmount, setJackpotAmount] = useState<number>(globalJackpot);
  const [reels, setReels] = useState<string[][]>([
    ['🔔', '💎', '🍋'],
    ['🍒', '⭐', '🔔'],
    ['👑', '🍋', '🍒'],
    ['💎', '🔔', '🎰'],
    ['🍋', '🍒', '⭐']
  ]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winMessage, setWinMessage] = useState('Pilih taruhan Anda & klik Spin!');
  const [lastWinAmount, setLastWinAmount] = useState<number>(0);
  const [isJackpotWon, setIsJackpotWon] = useState(false);
  const [freeSpinsLeft, setFreeSpinsLeft] = useState<number>(0);
  const [totalFreeSpinsWon, setTotalFreeSpinsWon] = useState<number>(0);
  const [freeSpinsWinSession, setFreeSpinsWinSession] = useState<number>(0);
  const [activeMultiplier, setActiveMultiplier] = useState<number>(1);
  const [cuanBoostActive, setCuanBoostActive] = useState<boolean>(false);
  const symbolList = ['💎', '🔔', '🍒', '🍋', '👑', '⭐', '🎰'];

  useEffect(() => {
    const timer = setInterval(() => {
      globalJackpot += Math.floor(Math.random() * 45) + 5;
      setJackpotAmount(globalJackpot);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentSessionUser = dbRecords.find(r => r.username === currentUser && r.dbType === dbType) || {
    username: currentUser,
    balance: 335000,
    role: 'Regular_User',
    email: `${currentUser}@nusapay-user.id`
  };

  const userBalance = currentSessionUser.balance ?? 0;

  // Sound Engine using Web Audio API
  const playSynthesizedSound = (type: 'spin' | 'win' | 'jackpot' | 'scatter' | 'click') => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === 'spin') {
        // Rhythmic pulsing low sweep
        let time = ctx.currentTime;
        for (let i = 0; i < 6; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(100 + i * 40, time);
          osc.frequency.exponentialRampToValueAtTime(50, time + 0.12);
          gain.gain.setValueAtTime(0.03, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
          osc.start(time);
          osc.stop(time + 0.12);
          time += 0.12;
        }
      } else if (type === 'win') {
        // Uplifting arpeggio melody
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C E G C E
        let time = ctx.currentTime;
        notes.forEach((freq, index) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, time);
          gain.gain.setValueAtTime(0.06, time);
          gain.gain.setValueAtTime(0.06, time + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
          osc.start(time);
          osc.stop(time + 0.15);
          time += 0.08;
        });
      } else if (type === 'scatter') {
        // High resonance bell sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === 'jackpot') {
        // Intense party siren sound
        let time = ctx.currentTime;
        for (let i = 0; i < 15; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = 'square';
          osc.frequency.setValueAtTime(i % 2 === 0 ? 600 : 900, time);
          gain.gain.setValueAtTime(0.08, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
          osc.start(time);
          osc.stop(time + 0.18);
          time += 0.12;
        }
      }
    } catch (e) {
      // AudioContext fails silently if no speaker connected
    }
  };

  // Generate randomized columns
  const generateRandomColumn = (rowCount: number) => {
    const col: string[] = [];
    for (let r = 0; r < rowCount; r++) {
      let rand = Math.random();
      
      // If Cuan Boost is active, we significantly elevate the chance of Wild (👑) and Scatter (⭐)
      const wildThreshold = cuanBoostActive ? 0.15 : 0.08;
      const scatterThreshold = cuanBoostActive ? 0.30 : 0.18;
      const jackpotThreshold = 0.03;

      if (rand < jackpotThreshold) {
        col.push('🎰'); // Jackpot Symbol
      } else if (rand < wildThreshold) {
        col.push('👑'); // Wild
      } else if (rand < scatterThreshold) {
        col.push('⭐'); // Scatter
      } else {
        // Other standard symbols
        const stdSyms = ['💎', '💎', '🔔', '🔔', '🍒', '🍒', '🍋', '🍋'];
        col.push(stdSyms[Math.floor(Math.random() * stdSyms.length)]);
      }
    }
    return col;
  };

  const handleSpinToggle = () => {
    if (isSpinning) return;

    // Bet deduction calculations
    const finalBetCost = cuanBoostActive ? Math.floor(betSize * 1.25) : betSize;

    if (userBalance < finalBetCost && freeSpinsLeft <= 0) {
      setWinMessage('❌ Saldo tidak cukup! Klaim voucher promo atau perkecil nominal taruhan Anda.');
      playSynthesizedSound('click');
      return;
    }

    setIsSpinning(true);
    setWinMessage('🎰 Memutar roda NusaSlot Megaways...');
    setIsJackpotWon(false);
    playSynthesizedSound('spin');

    // Charge the cost if not in free-spins
    if (freeSpinsLeft <= 0) {
      onModifyRecords(prev => prev.map(rec => 
        rec.username === currentUser && rec.dbType === dbType 
          ? { ...rec, balance: Math.max(0, (rec.balance ?? 0) - finalBetCost) } 
          : rec
      ));
      
      // Feed 5% of the bet to Progressive Jackpot
      globalJackpot += Math.floor(finalBetCost * 0.05);
      setJackpotAmount(globalJackpot);
    }

    // Spin animation logic (Simulate 8 steps repeating fast)
    let animationCounter = 0;
    const animInterval = setInterval(() => {
      setReels(() => {
        return [
          generateRandomColumn(slotMode === 'MEGAWAYS' ? Math.floor(Math.random() * 4) + 2 : 3),
          generateRandomColumn(slotMode === 'MEGAWAYS' ? Math.floor(Math.random() * 4) + 2 : 3),
          generateRandomColumn(slotMode === 'MEGAWAYS' ? Math.floor(Math.random() * 4) + 2 : 3),
          generateRandomColumn(slotMode === 'MEGAWAYS' ? Math.floor(Math.random() * 4) + 2 : 3),
          generateRandomColumn(slotMode === 'MEGAWAYS' ? Math.floor(Math.random() * 4) + 2 : 3)
        ];
      });
      animationCounter++;
      
      if (animationCounter > 8) {
        clearInterval(animInterval);
        processFinalSpinResult();
      }
    }, 100);
  };

  const processFinalSpinResult = () => {
    // 1. Generate final reels outcome
    // Megaways has 2 to 5 random rows for each of 5 reels
    // Paylines has standard 3 rows on each of 5 reels
    const finalReels = [
      generateRandomColumn(slotMode === 'MEGAWAYS' ? Math.floor(Math.random() * 4) + 2 : 3),
      generateRandomColumn(slotMode === 'MEGAWAYS' ? Math.floor(Math.random() * 4) + 2 : 3),
      generateRandomColumn(slotMode === 'MEGAWAYS' ? Math.floor(Math.random() * 4) + 2 : 3),
      generateRandomColumn(slotMode === 'MEGAWAYS' ? Math.floor(Math.random() * 4) + 2 : 3),
      generateRandomColumn(slotMode === 'MEGAWAYS' ? Math.floor(Math.random() * 4) + 2 : 3)
    ];

    setReels(finalReels);
    setIsSpinning(false);

    // 2. Count Scatters (⭐) anywhere on grid to trigger Free Spins
    let scatterCount = 0;
    finalReels.forEach(col => {
      col.forEach(sym => {
        if (sym === '⭐') scatterCount++;
      });
    });

    // 3. Count matching symbols based on active Mode
    let winMultiplier = 0;
    let earnedProfit = 0;
    let isMegaWaysWin = false;
    let matchDescription = '';

    // Standard multipliers config (per matching ways/paylines value)
    const basePayoutValues: Record<string, number> = {
      '🎰': 50, // 5 Jackpot symbols = Progressive Jackpot or 50x bet size
      '💎': 15, // Diamond
      '👑': 8,  // Wild
      '🔔': 4,  // Bell
      '🍒': 2,  // Cherry
      '🍋': 1   // Lemon
    };

    if (slotMode === 'MEGAWAYS') {
      // MEGAWAYS MODE CALCULATION
      // Check left-to-right consecutive matching symbols starting from Reel 1
      // For each symbol, trace consecutive occurrence
      const checkedSymbols = ['🎰', '💎', '🔔', '🍒', '🍋'];
      let highestSymbolWinning = '';
      let maxSymbolWaysMultiplier = 0;

      checkedSymbols.forEach(sym => {
        // Counts of this symbol (or Wild 👑) on consecutive reels
        const counts = [0, 0, 0, 0, 0];
        for (let reelIndex = 0; reelIndex < 5; reelIndex++) {
          finalReels[reelIndex].forEach(cellVal => {
            if (cellVal === sym || cellVal === '👑') {
              counts[reelIndex]++;
            }
          });
        }

        // Trace max consecutive reels with at least one match
        let consecutiveReelsCount = 0;
        for (let rc = 0; rc < 5; rc++) {
          if (counts[rc] > 0) {
            consecutiveReelsCount++;
          } else {
            break;
          }
        }

        if (consecutiveReelsCount >= 3) {
          // It's a win! Calculate the Megaways coefficient
          // Total ways = count1 * count2 * count3 * ...
          let waysCount = 1;
          for (let ri = 0; ri < consecutiveReelsCount; ri++) {
            waysCount *= counts[ri];
          }

          // Multiply base payouts by the consecutive reel multiplier bonus
          // 3 matches: base multiplier * 1
          // 4 matches: base multiplier * 2.5
          // 5 matches: base multiplier * 6
          const reelBonus = consecutiveReelsCount === 3 ? 1 : consecutiveReelsCount === 4 ? 2.5 : 6;
          const payoutMultiplier = basePayoutValues[sym] * waysCount * reelBonus;

          if (payoutMultiplier > maxSymbolWaysMultiplier) {
            maxSymbolWaysMultiplier = parseFloat(payoutMultiplier.toFixed(1));
            highestSymbolWinning = sym;
            isMegaWaysWin = true;
            matchDescription = `Left-to-Right ${consecutiveReelsCount} Reels (${waysCount} Megaways) dengan Simbol ${sym}`;
          }
        }
      });

      winMultiplier = maxSymbolWaysMultiplier;

    } else {
      // MULTI-PAYLINE MODE CALCULATION (3x5 grid standard layout)
      // Check horizontal or angled rows matching
      // Paylines lines definition mapped from Reel indices:
      // Line 1: [1,1,1,1,1] (middle horizontal)
      // Line 2: [0,0,0,0,0] (top horizontal)
      // Line 3: [2,2,2,2,2] (bottom horizontal)
      // Line 4: [0,1,2,1,0] (V-shape)
      // Line 5: [2,1,0,1,2] (Inverted V)
      // Up to 15 paths! We look up according to activePaylines count.
      const linesPaths = [
        [1, 1, 1, 1, 1], // Line 1
        [0, 0, 0, 0, 0], // Line 2
        [2, 2, 2, 2, 2], // Line 3
        [0, 1, 2, 1, 0], // Line 4
        [2, 1, 0, 1, 2], // Line 5
        [0, 0, 1, 2, 2], // Line 6
        [2, 2, 1, 0, 0], // Line 7
        [1, 2, 2, 1, 0], // Line 8
        [1, 0, 0, 1, 2], // Line 9
        [0, 2, 0, 2, 0], // Line 10
        [2, 0, 2, 0, 2], // Line 11
        [1, 2, 1, 2, 1], // Line 12
        [1, 0, 1, 0, 1], // Line 13
        [0, 1, 0, 1, 0], // Line 14
        [2, 1, 2, 1, 2]  // Line 15
      ];

      let totalPaylinesWinMult = 0;
      let matchedLineCount = 0;

      for (let lineId = 0; lineId < activePaylines; lineId++) {
        const path = linesPaths[lineId];
        // Read symbols on this path
        const sym0 = finalReels[0][path[0]];
        const sym1 = finalReels[1][path[1]];
        const sym2 = finalReels[2][path[2]];
        const sym3 = finalReels[3][path[3]];
        const sym4 = finalReels[4][path[4]];

        // Determine if they are matching. High cuan means we allow Wild (👑) substitution!
        const matchLeftToRight = (targetSym: string) => {
          const isMatch = (symVal: string) => symVal === targetSym || symVal === '👑';
          if (isMatch(sym0) && isMatch(sym1) && isMatch(sym2)) {
            if (isMatch(sym3)) {
              if (isMatch(sym4)) return 5;
              return 4;
            }
            return 3;
          }
          return 0;
        };

        const targetCandidates = ['🎰', '💎', '🔔', '🍒', '🍋'];
        let lineMaxMult = 0;

        targetCandidates.forEach(cand => {
          const matches = matchLeftToRight(cand);
          if (matches >= 3) {
            const multBonus = matches === 3 ? 1.5 : matches === 4 ? 4 : 10;
            const payoff = basePayoutValues[cand] * multBonus;
            if (payoff > lineMaxMult) {
              lineMaxMult = payoff;
            }
          }
        });

        if (lineMaxMult > 0) {
          totalPaylinesWinMult += lineMaxMult;
          matchedLineCount++;
        }
      }

      winMultiplier = totalPaylinesWinMult;
      if (matchedLineCount > 0) {
        matchDescription = `Berhasil mencocokkan ${matchedLineCount} Payline Aktif!`;
      }
    }

    // 4. Special progressive Jackpot event: Check for 5 matching '🎰' symbols (consecutive left-to-right)
    let isJackpotAchieved = false;
    let countsOfJackpot = 0;
    for (let i = 0; i < 5; i++) {
      if (finalReels[i].includes('🎰')) countsOfJackpot++;
    }

    if (countsOfJackpot === 5) {
      isJackpotAchieved = true;
    }

    // Apply Free Spins multiplication multiplier
    let finalWinMultiplier = winMultiplier;
    if (freeSpinsLeft > 0) {
      finalWinMultiplier = winMultiplier * activeMultiplier;
    }

    // Profit calculation
    earnedProfit = Math.floor(betSize * (finalWinMultiplier / 10));

    // Grant Progressive Jackpot prize
    if (isJackpotAchieved) {
      earnedProfit += jackpotAmount;
      setIsJackpotWon(true);
      globalJackpot = 5000000; // Reset global Progresif starting seed
      setJackpotAmount(globalJackpot);
      playSynthesizedSound('jackpot');
      
      onAddNotification?.(`🎉 PROGRESIF JACKPOT PECAH! @${currentUser} sukses memenangkan total Rp ${earnedProfit.toLocaleString('id-ID')} senilai Jackpot Progresif!`, 'info');
      onAddAuditLog({
        type: 'INFO',
        message: `MEGA JACKPOT: Akun @${currentUser} memenangkan Jackpot Progresif NusaSlot sebesar Rp ${earnedProfit.toLocaleString('id-ID')}!`
      });
    }

    // 5. Update user state on the DB
    if (earnedProfit > 0) {
      onModifyRecords(prev => prev.map(rec => 
        rec.username === currentUser && rec.dbType === dbType 
          ? { ...rec, balance: (rec.balance ?? 0) + earnedProfit } 
          : rec
      ));

      setLastWinAmount(earnedProfit);
      
      if (freeSpinsLeft > 0) {
        setFreeSpinsWinSession(prev => prev + earnedProfit);
      }

      if (!isJackpotAchieved) {
        setWinMessage(`🎉 CUAN GEDE! Menang Rp ${earnedProfit.toLocaleString('id-ID')} (${matchDescription})`);
        playSynthesizedSound('win');
      }

      // If extremely higher payout, write to forensic log to create a realistic gaming log trace
      if (earnedProfit > 50000 && !isJackpotAchieved) {
        onAddAuditLog({
          type: 'INFO',
          message: `NusaSlot: Member @${currentUser} mencairkan Cuan sebesar Rp ${earnedProfit.toLocaleString('id-ID')} (Mult: ${finalWinMultiplier}x)`
        });
      }
    } else {
      setLastWinAmount(0);
      setWinMessage(freeSpinsLeft > 0 ? 'Putaran bonus gratis belum beruntung. Lanjutkan!' : '😢 Belum beruntung. Putar lagi untuk peluang cuan!');
    }

    // 6. Handle Scatter Free Spins triggers
    if (scatterCount >= 3) {
      playSynthesizedSound('scatter');
      const extraSpins = 10;
      setFreeSpinsLeft(prev => prev + extraSpins);
      setTotalFreeSpinsWon(prev => prev + extraSpins);
      
      // Randomize an elevated multiplier during free spin modes (3x - 10x)
      // If Cuan Boost is active, we gain a massive 5x to 15x multiplier boost!
      const nextMult = cuanBoostActive ? Math.floor(Math.random() * 11) + 5 : Math.floor(Math.random() * 8) + 3;
      setActiveMultiplier(nextMult);

      onAddNotification?.(`🎰 BONUS SCATTER TERDIKTEKSI! Anda memenangkan ${extraSpins} Free Spins dengan Multiplier Pengali ${nextMult}x lipat!`, 'info');
      
      setWinMessage(`🔥 BONUS DAHSYAT! Ditemukan ${scatterCount} Scatter ⭐. Menang ${extraSpins} Putaran Gratis [Pengali: ${nextMult}x]!`);
    }

    // Tick free spin session countdown
    if (freeSpinsLeft > 0) {
      setFreeSpinsLeft(prev => {
        const next = prev - 1;
        if (next === 0) {
          // Session over, summarize notifications
          setTimeout(() => {
            onAddNotification?.(`🎉 AKUMULASI FREE SPINS SELESAI! Total cuan yang dikeruk dari putaran bonus: Rp ${freeSpinsWinSession.toLocaleString('id-ID')} IDR!`, 'info');
            setFreeSpinsWinSession(0);
          }, 1500);
        }
        return next;
      });
    }
  };

  // Grid sizing indicator for Megaways UI layout
  const getColLayoutClass = (symbolsLength: number) => {
    switch (symbolsLength) {
      case 2: return 'grid-rows-2 h-44';
      case 3: return 'grid-rows-3 h-44';
      case 4: return 'grid-rows-4 h-44';
      case 5: return 'grid-rows-5 h-44';
      default: return 'grid-rows-3 h-44';
    }
  };

  const getMegawaysPossibilities = () => {
    if (slotMode === 'PAYLINES') {
      return `${activePaylines} Lines`;
    }
    // Multiply rows count across 5 reels to get total ways
    const ways = reels[0].length * reels[1].length * reels[2].length * reels[3].length * reels[4].length;
    return `${ways.toLocaleString('id-ID')} Ways`;
  };

  return (
    <div className="bg-gradient-to-b from-[#130d22] to-[#0a0715] border border-[#d97706]/30 rounded-3xl p-5 md:p-6 shadow-[0_0_30px_rgba(217,119,6,0.15)] space-y-5 select-none relative overflow-hidden">
      
      {/* Decorative Lights & Flare grids */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/5 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#a855f7]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-[#f59e0b]/80 to-transparent" />

      {/* Progressive Jackpot Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#110c1f] via-[#2d1b06] to-[#110c1f] border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        
        {/* Blinking indicator */}
        <div className="absolute top-1.5 right-3 flex items-center gap-1 font-mono text-[9px] text-[#f59e0b]/60">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
          <span>LIVE PROGRESSIVE MULTIPLIER ACTIVE</span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-center sm:justify-start items-center gap-2 text-rose-400 font-mono text-[10px] font-black uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-500 animate-bounce" />
            <span>NusaSlot Megaways Progressive Jackpot</span>
          </div>
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#fbbf24] font-mono tracking-tight animate-pulse drop-shadow-[0_2px_10px_rgba(245,158,11,0.2)]">
            Rp {jackpotAmount.toLocaleString('id-ID')} IDR
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <span className="px-3 py-1.5 bg-[#030712] border border-amber-500/20 rounded-xl text-center font-mono">
            <span className="text-[9px] text-gray-500 block uppercase font-bold">Roda Mode</span>
            <span className="text-xs text-[#fbbf24] font-bold">{slotMode}</span>
          </span>
          <span className="px-3 py-1.5 bg-[#030712] border border-[#a855f7]/20 rounded-xl text-center font-mono">
            <span className="text-[9px] text-gray-500 block uppercase font-bold">Slot Megaways</span>
            <span className="text-xs text-[#c084fc] font-bold">{getMegawaysPossibilities()}</span>
          </span>
        </div>
      </div>

      {/* Inner Game Screen Frame */}
      <div className="bg-[#05030a] rounded-2.5xl border border-[#ffffff]/5 p-3.5 relative shadow-inner">
        
        {/* Top Floating Multiplier indicator (If in free spins) */}
        {freeSpinsLeft > 0 && (
          <div className="absolute top-2.5 right-6 z-10 bg-gradient-to-r from-purple-600 to-rose-600 border border-purple-400 text-white font-mono text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
            <Flame className="w-4 h-4 animate-pulse fill-white" />
            <span>Free Spin Terbuka ({freeSpinsLeft} Sisa) x{activeMultiplier} Multiplier!</span>
          </div>
        )}

        {/* Dynamic Megaways Columns Reels Container */}
        <div className="grid grid-cols-5 gap-2 relative overflow-hidden py-1">
          {reels.map((col, colIdx) => (
            <div 
              key={colIdx} 
              className={`bg-gradient-to-b from-[#110b24] to-[#070410] border border-purple-950/40 rounded-xl flex flex-col justify-center items-center gap-1.5 p-1 transition-all duration-300 relative ${
                isSpinning ? 'brightness-125 blur-[1px]' : ''
              }`}
            >
              
              {/* Vertical line connectors */}
              <div className="absolute inset-y-0 w-[1px] bg-purple-500/5 left-1/2 -translate-x-1/2 pointer-events-none" />

              <div className={`grid ${getColLayoutClass(col.length)} w-full gap-1.5 items-center justify-center`}>
                {col.map((sym, symIdx) => (
                  <div 
                    key={symIdx} 
                    className={`aspect-square min-w-[34px] sm:min-w-[48px] md:min-w-[56px] rounded-lg bg-[#1a1233]/70 hover:bg-[#251a49] border border-purple-500/5 flex items-center justify-center text-xl sm:text-2xl md:text-3xl select-none font-bold text-center shadow-lg transform hover:scale-105 transition-all duration-150 duration-200 relative group`}
                    title={`Column ${colIdx+1}, Row ${symIdx+1}`}
                  >
                    {/* Symbol shine or glow decoration */}
                    {sym === '🎰' && <div className="absolute inset-0 bg-yellow-400/5 animate-pulse rounded-lg" />}
                    {sym === '⭐' && <div className="absolute inset-0 bg-amber-400/5 animate-pulse rounded-lg" />}
                    {sym === '👑' && <div className="absolute inset-0 bg-rose-450/5 animate-pulse rounded-lg" />}

                    <span>{sym}</span>
                  </div>
                ))}
              </div>

              {/* Individual Reel Ways indicator badge */}
              {slotMode === 'MEGAWAYS' && (
                <span className="absolute bottom-1 px-1 bg-[#100a26] text-[#c084fc] font-mono text-[80%] font-bold rounded border border-purple-500/10">
                  {col.length}R
                </span>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Control Panel Widget */}
      <div className="space-y-4 font-mono text-[#07090e] bg-gradient-to-br from-[#1b152d] to-[#120e20] p-4.5 rounded-2xl border border-purple-950/40 text-slate-350">
        
        {/* First Row: Choose Game Mode & Cuan Boost switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-gray-500 uppercase font-black block">Mode Mekanik Arena:</span>
            <div className="flex bg-[#05030a] p-1 rounded-xl border border-purple-950/60 w-max font-bold">
              <button
                type="button"
                onClick={() => { setSlotMode('MEGAWAYS'); playSynthesizedSound('click'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  slotMode === 'MEGAWAYS' ? 'bg-[#a855f7] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Nusa Megaways</span>
              </button>
              <button
                type="button"
                onClick={() => { setSlotMode('PAYLINES'); playSynthesizedSound('click'); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  slotMode === 'PAYLINES' ? 'bg-[#f59e0b] text-black shadow-lg' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Line Khusus</span>
              </button>
            </div>
          </div>

          {/* Cuan Boost Feature Switch Option */}
          <div className="flex flex-col gap-1 items-start sm:items-end">
            <span className="text-[10px] text-gray-500 uppercase font-black block text-left sm:text-right">Fitur Cuan Boost (Scatter Bonus x2):</span>
            <button
              onClick={() => { setCuanBoostActive(!cuanBoostActive); playSynthesizedSound('click'); }}
              className={`px-4.5 py-1.5 text-xs font-black rounded-xl uppercase tracking-wider transition-all border flex items-center gap-1.5 cursor-pointer ${
                cuanBoostActive 
                  ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-yellow-500 border-yellow-500 animate-pulse' 
                  : 'bg-black/40 text-gray-500 border-purple-900/10 hover:text-[#fbbf24] hover:bg-black/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{cuanBoostActive ? 'CUAN BOOST ON (+25% TARUHAN)' : 'CUAN BOOST AKTIFKAN'}</span>
            </button>
          </div>

        </div>

        {/* Second Row: Specific line selectors or general information */}
        {slotMode === 'PAYLINES' && (
          <div className="bg-[#05030a] p-3 rounded-xl border border-purple-950/20 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Sesuaikan Garis Kemenangan (Paylines):</span>
              <span className="text-[10px] text-amber-400 font-bold tracking-widest">{activePaylines} Garis Terpasang</span>
            </div>
            <div className="flex gap-2">
              {paylineOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setActivePaylines(opt); playSynthesizedSound('click'); }}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-black tracking-wider transition-colors cursor-pointer ${
                    activePaylines === opt 
                      ? 'bg-amber-500/15 border-amber-500/40 text-[#f59e0b]' 
                      : 'bg-black/30 border-purple-900/35 text-gray-500 hover:text-white'
                  }`}
                >
                  {opt} Line
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Third Row: Bet Size selection and Spin triggers */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-center">
          
          {/* Bet size selections */}
          <div className="md:col-span-6 space-y-1.5">
            <span className="text-[10px] text-gray-500 uppercase font-black block">Nominal Taruhan (Bet):</span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {betOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setBetSize(opt); playSynthesizedSound('click'); }}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border font-mono tracking-tighter ${
                    betSize === opt 
                      ? 'bg-purple-600 border-purple-400 text-white shadow-xl shadow-purple-500/5 font-extrabold' 
                      : 'bg-[#05030a] border-purple-950/70 text-gray-550 hover:text-white'
                  }`}
                >
                  {opt >= 1000 ? `${(opt / 1000).toFixed(0)}k` : opt}
                </button>
              ))}
            </div>
          </div>

          {/* SPIN & ACTION BLOCK */}
          <div className="md:col-span-6 flex gap-2 items-end pt-1">
            
            {/* Spinning Indicator details */}
            <div className="bg-[#05030a] px-3.5 py-1 text-[#fbbf24] border border-[#d97706]/20 py-2.5 rounded-xl block text-center flex-1 h-11 flex flex-col justify-center">
              <span className="text-[8px] text-gray-500 uppercase font-bold block leading-[1]">Biaya Taruhan</span>
              <span className="text-xs font-black tracking-widest block pt-0.5">
                Rp {cuanBoostActive ? Math.floor(betSize * 1.25).toLocaleString('id-ID') : betSize.toLocaleString('id-ID')}
              </span>
            </div>

            {/* SOUND MUTE BUTTON */}
            <button
              onClick={() => { setIsMuted(!isMuted); playSynthesizedSound('click'); }}
              className="p-3 bg-[#05030a] hover:bg-black/40 text-gray-500 hover:text-white rounded-xl border border-purple-950/40 cursor-pointer h-11 flex items-center justify-center transition-colors"
              title={isMuted ? 'Nyalakan Audio' : 'Sunyikan Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            {/* BIG ACTION BUTTON */}
            <button
              onClick={handleSpinToggle}
              disabled={isSpinning}
              className={`px-6 h-11 text-black font-extrabold text-[#090b11] rounded-xl text-xs tracking-wider uppercase cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-lg ${
                isSpinning 
                  ? 'bg-purple-800 text-purple-200 opacity-60' 
                  : freeSpinsLeft > 0
                  ? 'bg-gradient-to-r from-purple-500 to-rose-500 text-white animate-pulse border-purple-400 shadow-purple-500/20 hover:from-purple-400 hover:to-rose-400'
                  : 'bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#fbbf24] hover:from-[#fcd34d] hover:to-[#f59e0b] shadow-amber-500/10'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'SPINNING...' : freeSpinsLeft > 0 ? `SPIN GRATIS (${freeSpinsLeft})` : 'PUTAR SPIN'}</span>
            </button>

          </div>

        </div>

        {/* Footer info showing win results */}
        <div className="pt-2 border-t border-purple-950/20 text-center space-y-1">
          <div className="text-[11px] font-sans italic text-slate-400 font-bold min-h-[16px] leading-[1.3] text-center max-w-full">
            {winMessage}
          </div>
          {lastWinAmount > 0 ? (
            <div className="text-emerald-400 text-xs font-extrabold flex justify-center items-center gap-1 animate-pulse">
              <Award className="w-4 h-4" />
              <span>MEMENANGKAN SALDO: Rp {lastWinAmount.toLocaleString('id-ID')} IDR [CUAN!]</span>
            </div>
          ) : (
            <div className="text-gray-550 text-[10px] uppercase font-bold tracking-widest text-center py-0.5">
              RTP NusaSlot: <span className="text-[#fbbf24]">98.7%</span> (Gacor & Anti Rungkat)
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
