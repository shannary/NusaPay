/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useMemo } from 'react';
import { 
  Coins, 
  Send, 
  Sparkles, 
  ShieldAlert, 
  Play, 
  Database,
  MessageSquare,
  AlertTriangle,
  User,
  Heart,
  HelpCircle,
  Eye,
  Info,
  Gift,
  CoinsIcon,
  Globe,
  DollarSign,
  Landmark,
  BellRing
} from 'lucide-react';
import { DbRecord, SecurityAuditLog } from '../types';
import NusaSlotMegaways from './NusaSlotMegaways';

interface DashboardProps {
  dbType: 'PostgreSQL' | 'MySQL' | 'MongoDB';
  onAddAuditLog: (log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) => void;
  onNavigateToLab: () => void;
  onNavigateToSync: () => void;
  dbRecords: DbRecord[];
  onModifyRecords: (updater: (prev: DbRecord[]) => DbRecord[]) => void;
  isBlacklisted: boolean;
  setIsBlacklisted: (b: boolean) => void;
  securityLevel: number;
  currentUser: string;
  addThreatIncident: (incident: any) => void;
  onAddNotification?: (msg: string, type: 'info' | 'warning' | 'alert') => void;
  activeChallengeCode: string;
}

export default function Dashboard({
  dbType,
  onAddAuditLog,
  onNavigateToLab,
  onNavigateToSync,
  dbRecords,
  onModifyRecords,
  isBlacklisted,
  setIsBlacklisted,
  securityLevel,
  currentUser,
  addThreatIncident,
  onAddNotification,
  activeChallengeCode
}: DashboardProps) {
  
  // Local active session record
  const currentSessionUser = useMemo(() => {
    return dbRecords.find(r => r.username === currentUser && r.dbType === dbType) || {
      username: currentUser,
      balance: 335000,
      role: 'Regular_User',
      email: `${currentUser}@nusapay-user.id`
    };
  }, [dbRecords, currentUser, dbType]);

  // STORES FOR NORMALIZED WEB OPERATIONS
  
  // 1. Redeem Voucher / Coupon Code
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [isProcessingPromo, setIsProcessingPromo] = useState(false);

  // 2. Transfer Box States
  const [txTarget, setTxTarget] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txReferer, setTxReferer] = useState('http://nusapay-internal.id');
  const [txStatus, setTxStatus] = useState('');
  const [txWafToken, setTxWafToken] = useState('');

  // 3. Stored Comments Forum (Now a completely normal community discussion forum)
  const [shoutComments, setShoutComments] = useState<Array<{ id: string; user: string; text: string; date: string }>>([
    { id: 'c-1', user: 'admin', text: 'Selamat datang di Forum Obrolan NusaPay. Selalu pastikan sesi login Anda disimpan dengan baik.', date: '10 menit yang lalu' },
    { id: 'c-2', user: 'riangacor', text: 'Dompet praktis bener buat transfer kilat ke arena game! Mantap NusaPay. 🔥⚡', date: '3 menit yang lalu' }
  ]);
  const [commentInput, setCommentInput] = useState('');

  // ------------------------------------------------------------------------
  // REDEEM PROMO CODE (Vulnerable SQL/NoSQL Injection under-the-hood)
  // ------------------------------------------------------------------------
  const handleRedeemPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlacklisted) return;
    if (!promoCode.trim()) return;

    setIsProcessingPromo(true);
    setPromoMessage('');
    const code = promoCode.trim();
    const codeLower = code.toLowerCase();

    // Trace backend query based on active DBMS
    const queryTrace = dbType === 'MongoDB' 
      ? `db.vouchers.find({ code: "${code}" })` 
      : `SELECT * FROM vouchers WHERE promo_key = '${code}' AND is_active = true`;

    setTimeout(() => {
      setIsProcessingPromo(false);
      let success = false;

      // Checking background Firewall / WAF Level Rules 
      const isWAFActivated = securityLevel >= 4;

      if (isWAFActivated) {
        // Safe filters blocking query injections
        if (codeLower.includes("'") || codeLower.includes("or") || codeLower.includes("$ne") || codeLower.includes("$gt")) {
          // Trigger blocking security
          setIsBlacklisted(true);
          const alertMsg = `⚠️ [KEAMANAN DIKETATKAN] Sistem WAF mengidentifikasi input karakter ilegal pada kolom voucher. Akses ditangguhkan.`;
          
          if (onAddNotification) {
            onAddNotification('Percobaan siber-hack (Parameter SQL Injection) dideteksi dan diblokir oleh WAF Guardian!', 'alert');
          }

          addThreatIncident({
            attackerIp: '185.195.12.99',
            attackerNode: 'Firewall_WAF_Block',
            attackType: 'SQL/NoSQL Parameter Injection',
            payloadUsed: code,
            severity: 'CRITICAL',
            details: `Upaya memintas parameter logic pada kolom Promo Code diblokir oleh filter WAF Level ${securityLevel}. IP penyerang ditangguhkan sementara.`
          });

          onAddAuditLog({
            type: 'SECURITY',
            message: `WAF BARRIER: Terdeteksi input ilegal pada parameter Promo Code. Akses komputer pengirim dibatasi.`
          });
          return;
        }
      }

      // Check vulnerability execution based on active db rules
      if (dbType === 'MongoDB') {
        if (codeLower.includes('$ne') || codeLower.includes('$gt')) {
          success = true;
        }
      } else {
        if (codeLower.includes("' or") || codeLower.includes("'or") || codeLower.includes('" or') || codeLower.includes("' --")) {
          success = true;
        }
      }

      if (success) {
        // Execute vulnerable bypass: steal Rp 1.500.000 from administrator or riangacor 
        const victim = dbRecords.find(r => r.username === 'riangacor') || dbRecords.find(r => r.username === 'admin');
        const rewards = 1500000;

        if (victim) {
          onModifyRecords(prev => prev.map(r => {
            if (r.id === victim.id) {
              return { ...r, balance: Math.max(0, (r.balance ?? 0) - rewards) };
            }
            if (r.username === currentUser) {
              return { ...r, balance: (r.balance ?? 0) + rewards };
            }
            return r;
          }));

          setPromoMessage(`🎉 Sukses! Keamanan query terlewati. Kode Voucher valid diidentifikasi. Akun Anda memperoleh Dana Rp ${rewards.toLocaleString('id-ID')}!`);
          
          if (onAddNotification) {
            onAddNotification(`Peringatan: Terjadi transfer dana rahasia Rp ${rewards.toLocaleString('id-ID')} ke dompet Anda via Voucher Bypass!`, 'warning');
          }

          onAddAuditLog({
            type: 'EXPLOIT',
            message: `VULNERABILITY BYPASS: Penyerang membobol filter logika database. Mentransfer Rp ${rewards.toLocaleString('id-ID')} secara paksa dari data @${victim.username} ke @${currentUser}`
          });
        }
      } else {
        setPromoMessage('❌ Maaf, Kode Voucher / Gift Card tidak terdaftar. Pastikan memasukkan kode dengan benar.');
      }
    }, 1000);
  };

  // ------------------------------------------------------------------------
  // EXECUTE TRANSFER FORM (CSRF & REFERER VULNERABILITY under-the-hood)
  // ------------------------------------------------------------------------
  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTxStatus('');

    if (isBlacklisted) {
      setTxStatus('❌ TRANS-BLOCK: Akun/IP komputer Anda ditangguhkan demi perlindungan siber.');
      return;
    }

    const targetUserClean = txTarget.trim().toLowerCase();
    const amountVal = parseInt(txAmount);

    if (!targetUserClean || isNaN(amountVal) || amountVal <= 0) {
      setTxStatus('❌ Harap isi username target dan nominal transfer.');
      return;
    }

    if ((currentSessionUser.balance ?? 0) < amountVal) {
      setTxStatus('❌ Saldo Anda tidak mencukupi untuk melakukan transfer ini.');
      return;
    }

    // CSRF and Origin protection rules
    const isWAFActivated = securityLevel >= 4;
    const isIllegalOrigin = txReferer !== 'http://nusapay-internal.id' && txReferer !== 'http://localhost:3000';

    if (isWAFActivated && isIllegalOrigin) {
      setTxStatus('❌ TRANS-BLOCK: Sistem mendeteksi parameter request ilegal (Trans-Block).');
      
      if (onAddNotification) {
        onAddNotification(`Proteksi WAF: Percobaan transaksi mencurigakan dari Origin non-whitelist (${txReferer}) diblokir!`, 'warning');
      }

      addThreatIncident({
        attackerIp: '180.252.19.82',
        attackerNode: 'CSRF_Referer_Guard',
        attackType: 'CSRF Origin Forgery Blocked',
        payloadUsed: `Host: ${txReferer}`,
        severity: 'MEDIUM',
        details: `Sistem mendeteksi transaksi transfer dana yang disulut dari origin host ilegal. Transaksi digagalkan otomatis.`
      });

      onAddAuditLog({
        type: 'WARNING',
        message: `PERINGATAN CSRF: Request transfer dari origin palsu ditolak: ${txReferer}`
      });
      return;
    }

    // Process actual in-memory transaction
    const targetInDb = dbRecords.find(r => r.username.toLowerCase() === targetUserClean && r.dbType === dbType);
    if (!targetInDb) {
      setTxStatus('❌ FAILED: Username target penerima tidak ditemukan di database Node!');
      return;
    }

    // Dynamic Micro-Token checking if Level 5 or Level 6 WAF is armed
    if (securityLevel >= 5 && securityLevel < 7) {
      const isCorrectToken = txWafToken.trim() === activeChallengeCode;
      if (!isCorrectToken) {
        setTxStatus(`❌ WAF-BLOCK: Tanda tangan Micro-Token sesi (${txWafToken.trim() || 'KOSONG'}) salah atau kedaluwarsa.`);
        
        if (onAddNotification) {
          onAddNotification(`Proteksi WAF: Validasi token gagal untuk transaksi transfer pengguna @${currentUser}.`, 'warning');
        }

        // We can trigger an incident or blacklist if they enter a bad token at level 6
        if (securityLevel === 6) {
          setIsBlacklisted(true);
          onAddAuditLog({
            type: 'SECURITY',
            message: `WAF AUTO-LOCK: Deteksi kegagalan sign token keamanan Level 6 pada transaksi @${currentUser}. Komputer diisolasi!`
          });
        } else {
          onAddAuditLog({
            type: 'WARNING',
            message: `WAF FILTER: Deteksi kegagalan Micro-Token Level 5 pada transaksi @${currentUser}.`
          });
        }
        return;
      }
    }

    // Zero-Trust protection in Level 7 (Strict memory consensus matching)
    if (securityLevel === 7) {
      if (txReferer !== 'http://nusapay-internal.id' && txReferer !== 'http://localhost:3000') {
        setTxStatus('❌ WAF-BLOCK: Protokol Zero-Trust menolak manipulasi domain origin.');
        onAddAuditLog({
          type: 'SECURITY',
          message: `Zero-Trust Blok: Menolak request mutasi abnormal yang dikirim dari origin palsu: ${txReferer}`
        });
        return;
      }
      
      if (amountVal > 2500000) {
        setTxStatus('❌ LIMIT-EXCEEDED: Protokol Zero-Trust membatasi transfer mandiri maksimal Rp 2.500.000!');
        if (onAddNotification) {
          onAddNotification('Zero-Trust Guard: Transaksi melebihi limit pengawasan sistem mandiri.', 'warning');
        }
        return;
      }
    }

    onModifyRecords(prev => prev.map(r => {
      if (r.username === currentUser && r.dbType === dbType) {
        return { ...r, balance: Math.max(0, (r.balance ?? 0) - amountVal) };
      }
      if (r.username.toLowerCase() === targetUserClean && r.dbType === dbType) {
        return { ...r, balance: (r.balance ?? 0) + amountVal };
      }
      return r;
    }));

    setTxStatus(`🎉 Sukses mentransfer Rp ${amountVal.toLocaleString('id-ID')} ke @${targetUserClean}!`);
    
    // Notify user of normal successful transaction
    if (onAddNotification) {
      onAddNotification(`Mutasi Berhasil: Berhasil mentransfer Dana Rp ${amountVal.toLocaleString('id-ID')} ke akun @${targetUserClean}`, 'info');
    }

    onAddAuditLog({
      type: 'INFO',
      message: `Transaksi: @${currentUser} mengirim Rp ${amountVal.toLocaleString()} ke @${targetUserClean} (Origin: ${txReferer})`
    });

    setTxTarget('');
    setTxAmount('');
    setTxWafToken('');
  };

  // ------------------------------------------------------------------------
  // COMMENTS FORUM (Dangerous raw rendering for stored script tags under-the-hood)
  // ------------------------------------------------------------------------
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBlacklisted) return;
    if (!commentInput.trim()) return;

    const text = commentInput.trim();
    const commentLower = text.toLowerCase();

    // Check Stored Script signatures
    const hasScript = commentLower.includes('<script>') || 
                     commentLower.includes('img') || 
                     commentLower.includes('onerror') || 
                     commentLower.includes('onload') || 
                     commentLower.includes('javascript:');

    // Secure HTML Sanitizer check under higher WAF levels
    if (securityLevel >= 3 && hasScript) {
      onAddAuditLog({
        type: 'SECURITY',
        message: `WAF AUTO-FILTER: Filter XSS menyaring isian teks komentar secara aman.`
      });

      // Show professional safety info box
      setShoutComments(prev => [
        ...prev,
        { id: `c-${Date.now()}`, user: currentUser, text: text.replace(/</g, "&lt;").replace(/>/g, "&gt;"), date: 'Baru saja' }
      ]);
      setCommentInput('');

      if (onAddNotification) {
        onAddNotification('Proteksi Forum: Input Anda mengandung karakter HTML khusus. Teks otomatis disaring (escaped) agar aman.', 'info');
      }
      return;
    }

    // Vulnerable raw HTML rendering!
    setShoutComments(prev => [
      ...prev,
      { id: `c-${Date.now()}`, user: currentUser, text: text, date: 'Baru saja' }
    ]);

    setCommentInput('');

    // Trigger feedback notification if a danger input is loaded
    if (hasScript) {
      setTimeout(() => {
        if (onAddNotification) {
          onAddNotification(`Peringatan: Sistem mengidentifikasi input script JavaScript yang disimpan di Shoutbox! Cookie Sesi Admin terancam diambil alih.`, 'alert');
        }

        addThreatIncident({
          attackerIp: '188.166.45.12',
          attackerNode: 'Browser_Agent_Audit',
          attackType: 'Stored Integration Injection (XSS)',
          payloadUsed: text,
          severity: 'CRITICAL',
          details: `Pengguna berhasil menyimpan script mentah pada tabel obrolan. Browser administrator fiktif mengeksekusi muatan dan membocorkan cookie rahasia.`
        });

        onAddAuditLog({
          type: 'EXPLOIT',
          message: `INTEGRASI TERKENA DAMPAK: Kode script dieksekusi oleh modul browser. Sesi keamanan admin bocor.`
        });
      }, 1000);
    }
  };


  return (
    <div className="space-y-6">

      {/* Top Welcome Title & Balance Status */}
      <div className="bg-[#0b101d] border border-gray-900 rounded-2.5xl p-6 relative overflow-hidden shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Subtle decorative lights */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] font-bold rounded-lg uppercase tracking-wider">
              Protected Portal Node
            </span>
            <span className="text-[10px] font-mono text-gray-500">Node DB: <strong className="text-gray-350">{dbType}</strong></span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Landmark className="w-5.5 h-5.5 text-emerald-400" />
            <span>NusaPay Keuangan Digital & Arena Arena</span>
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed max-w-xl font-sans">
            Kelola saldo transaksi domestik, kirim uang ke rekan satu tim, dan coba keberuntungan Anda di arena game slot klasik kami. Selamat beraktivitas, <strong className="text-white">@{currentUser}</strong>!
          </p>
        </div>

        {/* Big Premium Balance Box */}
        <div className="bg-gradient-to-br from-[#0c1224] to-[#080d19] border border-gray-900 p-5 rounded-2xl flex items-center gap-4 shrink-0 font-mono w-full md:w-auto shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Coins className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-gray-500 uppercase block tracking-wider font-extrabold">Saldo Utama Dompet</span>
            <span className="text-xl font-black text-emerald-400">
              Rp {(currentSessionUser.balance ?? 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7/12) - Arena & Community Chat */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Upgraded Advanced Slot Megaways Widget */}
          <NusaSlotMegaways
            currentUser={currentUser}
            dbType={dbType}
            dbRecords={dbRecords}
            onModifyRecords={onModifyRecords}
            onAddNotification={onAddNotification}
            onAddAuditLog={onAddAuditLog}
          />

          {/* Section 2: Community Chat / Forum */}
          <div className="bg-[#090e18] border border-gray-900 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>NusaPay Community Board / Shoutbox</span>
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono font-bold uppercase border border-blue-500/20">
                Live Diskusi
              </span>
            </div>

            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
              Diskusikan kiat-kiat memaksimalkan game, informasi promo merchant, serta review dompet digital kami bersama seluruh pengguna NusaPay lainnya secara real-time.
            </p>

            {/* Forum comment feed list */}
            <div className="space-y-3 bg-black/55 rounded-xl p-4 border border-gray-950 max-h-56 overflow-y-auto">
              {shoutComments.map(cmt => (
                <div key={cmt.id} className="border-b border-gray-900 pb-2.5 last:border-0 last:pb-0 text-xs font-mono">
                  <div className="flex justify-between items-center text-[10px] text-gray-500 mb-1">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>@{cmt.user}</span>
                      {cmt.user === 'admin' && <span className="text-[8px] bg-red-950/40 text-red-400 border border-red-900/40 px-1.5 rounded">ADMIN</span>}
                    </span>
                    <span>{cmt.date}</span>
                  </div>
                  
                  {/* Under the hood unescaped render */}
                  <div 
                    className="text-gray-300 font-sans break-words select-text"
                    dangerouslySetInnerHTML={{ __html: cmt.text }}
                  />
                </div>
              ))}
            </div>

            {/* Submit comment */}
            <form onSubmit={handleAddComment} className="flex gap-2 font-mono">
              <input
                type="text"
                required
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Bagikan obrolan atau beri komentar membangun di sini..."
                className="flex-1 bg-black/60 border border-gray-900 focus:border-emerald-500/70 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none font-bold"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-5 rounded-xl text-xs uppercase cursor-pointer"
              >
                BAGIKAN
              </button>
            </form>
          </div>

        </div>

        {/* Right Column (5/12) - Financial Action Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: Transfer Form */}
          <div className="bg-[#090e18] border border-gray-900 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-900 pb-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Formulir Transfer Dana</span>
              </h3>
              <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold uppercase border border-emerald-500/20">
                Layanan Kilat
              </span>
            </div>

            <form onSubmit={handleTransfer} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Username Penerima</span>
                  <input
                    type="text"
                    required
                    value={txTarget}
                    onChange={(e) => setTxTarget(e.target.value)}
                    placeholder="Contoh: riangacor atau admin"
                    className="w-full bg-black/60 border border-gray-900 focus:border-emerald-500/70 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Jumlah Transfer (IDR)</span>
                  <input
                    type="number"
                    required
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    placeholder="Masukkan nominal transfer"
                    className="w-full bg-black/60 border border-gray-900 focus:border-emerald-500/70 rounded-xl px-3.5 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Dynamic WAF Micro-Token Input (Level 5 & 6) */}
              {securityLevel >= 5 && (
                <div className="space-y-1.5 p-3 rounded-xl border border-dashed border-[#fbbf24]/30 bg-amber-950/10 animate-[pulse_3s_infinite]">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#fbbf24]">
                    <span>🔒 MEMBUTUHKAN TOKEN VALIDASI LALU LINTAS:</span>
                    <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase">WAF Level {securityLevel}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-normal mb-1 font-sans">
                    Nusantara WAF Guardian memblokir transfer dana jika token tidak cocok. Buka <strong>WAF Firewall Dashboard</strong> guna menyalin Token aktif Anda saat ini.
                  </p>
                  <input
                    type="text"
                    required
                    value={txWafToken}
                    onChange={(e) => setTxWafToken(e.target.value)}
                    placeholder="Masukkan Token, contoh: LOCKOUT-HASH-22"
                    className="w-full bg-black/80 border border-amber-500/30 focus:border-amber-500 rounded-xl px-3 py-2 text-[11px] text-yellow-300 font-mono tracking-wider placeholder-yellow-800 outline-none animate-pulse"
                  />
                  {activeChallengeCode && (
                    <div className="text-[8px] text-gray-600 block text-right pt-0.5">
                      Hint: Aturan firewall saat ini memerlukan token sinkron aktif.
                    </div>
                  )}
                </div>
              )}

              {/* Secure headers simulation container (Presented as normal developer debug configuration or origin metadata) */}
              <div className="space-y-1.5 pt-1.5 bg-black/25 p-3 rounded-xl border border-gray-950">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Metadata Request Origin / Referer:</span>
                  </span>
                  <span className="text-[8px] text-gray-500">Security Sandbox</span>
                </div>
                <input
                  type="text"
                  required
                  value={txReferer}
                  onChange={(e) => setTxReferer(e.target.value)}
                  placeholder="http://nusapay-internal.id"
                  className="w-full bg-black/60 border border-gray-900 focus:border-emerald-500/70 rounded-xl px-3 py-2 text-[10px] text-blue-300 font-mono tracking-wider outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold px-6 py-2.5 rounded-xl uppercase tracking-wider text-[10px] transition-all cursor-pointer shadow-lg shadow-emerald-500/5 hover:scale-[1.01] active:scale-[0.99]"
                >
                  KIRIM TRANSFER SEKARANG
                </button>
                {txStatus && (
                  <span className={`text-[11px] font-bold leading-normal truncate max-w-full ${txStatus.includes('❌') ? 'text-red-400' : 'text-emerald-400'}`}>
                    {txStatus}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Section 2: Redesigned Coupon Voucher Panel */}
          <div className="bg-[#0b0f19] border border-gray-900 rounded-3xl p-5 shadow-xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-gray-900 pb-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#10b981]" />
                <span>Klaim Kode Voucher Promo</span>
              </span>
              <span className={`text-[8px] border px-2 py-0.5 rounded font-bold uppercase ${
                securityLevel === 7 
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' 
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}>
                {securityLevel === 7 ? 'Zero-Trust Armed' : 'Active Promo'}
              </span>
            </div>

            <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
              Miliki voucher gift card atau kode undian berhadiah? Tukarkan langsung di bawah ini untuk mencairkan saldo tunai promosi ke dompet Anda secara instan.
              {securityLevel === 7 && (
                <span className="text-[#10b981] font-bold block pt-1 font-mono">
                  [!] WAF Level 7 Zero-Trust memproteksi penuh modul klaim dari bypass manipulasi data.
                </span>
              )}
            </p>

            <form onSubmit={handleRedeemPromo} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-[9px] text-gray-500 uppercase block">Masukkan Kode Voucher:</span>
                <input
                  type="text"
                  required
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Kode e.g. PROMO-RAMADHAN"
                  className="w-full bg-black/60 border border-gray-900 focus:border-emerald-500/70 rounded-xl p-2.5 text-[11px] text-zinc-300 outline-none tracking-wider font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessingPromo}
                className="w-full bg-emerald-550 hover:bg-emerald-500 text-white border border-emerald-500/30 font-bold py-2.5 px-3 rounded-xl text-xs tracking-wide uppercase cursor-pointer flex items-center justify-center gap-1 transition-all"
              >
                {isProcessingPromo ? 'VALIDASI VOUCHER...' : 'PROSES PENUKARAN VOUCHER'}
              </button>
            </form>

            {promoMessage && (
              <div className={`p-3 rounded-xl border font-mono text-[10px] leading-relaxed select-text ${
                promoMessage.includes('🎉') 
                  ? 'bg-emerald-950/25 border-emerald-500/25 text-emerald-400' 
                  : 'bg-red-950/25 border-red-500/25 text-red-400'
              }`}>
                {promoMessage}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
