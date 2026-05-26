/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Terminal, 
  AlertTriangle, 
  Cpu, 
  RefreshCw, 
  Database,
  ShieldCheck,
  Sparkles,
  User,
  AlertOctagon,
  CheckCircle2,
  Trash2,
  LockKeyhole,
  Skull,
  Clock,
  Fingerprint
} from 'lucide-react';
import { SecurityAuditLog, DbRecord, ThreatIncident } from '../types';

interface SyncPanelProps {
  currentUser: string;
  dbType: 'PostgreSQL' | 'MySQL' | 'MongoDB';
  dbRecords: DbRecord[];
  onModifyRecords: (updater: (prev: DbRecord[]) => DbRecord[]) => void;
  onAddAuditLog: (log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) => void;
  onNavigateToLab: () => void;
  securityLevel: number;
  setSecurityLevel: (lvl: number) => void;
  isBlacklisted: boolean;
  setIsBlacklisted: (b: boolean) => void;
  threatIncidents: ThreatIncident[];
  setThreatIncidents: React.Dispatch<React.SetStateAction<ThreatIncident[]>>;
  activeChallengeCode: string;
  setActiveChallengeCode: (code: string) => void;
  isEmergencyLocked: boolean;
  setIsEmergencyLocked: (b: boolean) => void;
  addThreatIncident: (incident: Omit<ThreatIncident, 'id' | 'timestamp'>) => void;
  onResetBlacklist: () => void;
}

export default function SyncPanel({ 
  currentUser, 
  dbType, 
  dbRecords,
  onModifyRecords,
  onAddAuditLog, 
  onNavigateToLab,
  securityLevel,
  setSecurityLevel,
  isBlacklisted,
  setIsBlacklisted,
  threatIncidents,
  setThreatIncidents,
  activeChallengeCode,
  setActiveChallengeCode,
  isEmergencyLocked,
  setIsEmergencyLocked,
  addThreatIncident,
  onResetBlacklist
}: SyncPanelProps) {
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(100);
  const [lastSyncTime, setLastSyncTime] = useState('Terhubung & Stabil');
  const [seedHistory, setSeedHistory] = useState<string[]>(['NUSA-WAF-SECURE-CHAIN']);

  // Professional Security level matrices for enterprise audit logs
  const levelDescriptions = [
    {
      level: 1,
      name: 'Standard Permissive (Low Filter)',
      defense: 'Filter dinonaktifkan (Mode audit pasif).',
      vulnDesc: 'Sistem membiarkan semua request melintas tanpa validasi sintaks. Keamanan longgar, mengandalkan proteksi level fisik.',
      blacklistMin: 'Tidak aktif (Penyusupan siber tidak diputus)',
      color: 'text-blue-400 border-blue-500/20 bg-blue-950/5',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    },
    {
      level: 2,
      name: 'Sanitized Parameter Escaping',
      defense: 'Filter enkapsulasi & penyaringan tanda petik tunggal (\').',
      vulnDesc: 'Melakukan pembersihan dasar pada input string teks. Karakter tanda petik disaring untuk mencegah modifikasi query kotor sederhana.',
      blacklistMin: 'Tidak aktif (Hanya melakukan sanitasi teks dasar)',
      color: 'text-indigo-400 border-indigo-500/20 bg-indigo-950/5',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
    },
    {
      level: 3,
      name: 'Moderate Signature Inspection',
      defense: 'Pemeriksaan regular expression (RegEx) terhadap keyword logis.',
      vulnDesc: 'Mendeteksi dan menandai isian yang membawa keyword DBMS dasar seperti OR, AND, UNION, dan operator logis terstruktur.',
      blacklistMin: 'Tidak aktif (Mencatat log insiden tetapi tidak memblokir penyerang)',
      color: 'text-amber-400 border-amber-500/20 bg-amber-950/5',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    },
    {
      level: 4,
      name: 'Active IPS Shielding',
      defense: 'Intrusion Prevention System (IPS) mendeteksi pola anomali secara real-time.',
      vulnDesc: 'Sistem firewall aktif memantau tanda-tanda forgery request dan injeksi multi-sintaks. Setiap aktivitas anomali langsung memicu isolasi IP terkait.',
      blacklistMin: 'AKTIF (Isolasi IP penyerang otomatis dipicu seketika)',
      color: 'text-orange-400 border-orange-500/20 bg-orange-950/5',
      badgeColor: 'bg-orange-500/10 text-orange-400 border-orange-500/30'
    },
    {
      level: 5,
      name: 'Dynamic Micro-Token Validation',
      defense: 'Rotasi entropy token validasi unik di setiap sesi mutasi.',
      vulnDesc: 'Menerapkan dynamic signature matching. Setiap request harus menyertakan token hash terenkripsi dari server yang terus dirotasi.',
      blacklistMin: 'PROTEKSI TINGGI (Blokir ketat jika tanda tangan enkripsi atau token sesi tidak cocok)',
      color: 'text-rose-400 border-rose-500/20 bg-rose-950/5',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
    },
    {
      level: 6,
      name: 'Paranoid Isolation & Lockout',
      defense: 'Penguncian Darurat Otomatis (Automatic Gateway Disconnect).',
      vulnDesc: 'Keamanan paranoid tingkat tinggi. Segala bentuk kegagalan validasi atau kesalahan masukan dianggap sebagai upaya penetrasi siber, sirkuit situs langsung diputus total.',
      blacklistMin: 'TANGGAP DARURAT (Mengunci gerbang portal secara instan ke mode penutupan sirkuit)',
      color: 'text-red-500 border-red-500/20 bg-red-950/5',
      badgeColor: 'bg-red-500/15 text-red-500 border-red-500/30'
    },
    {
      level: 7,
      name: 'Elite Enterprise Zero-Trust Protocol',
      defense: 'Arsitektur Kedaulatan Zero-Trust Berbasis Session-Memory.',
      vulnDesc: 'Sistem mengabaikan semua parameter modifikasi dari sisi klien. Seluruh nilai saldo, peran akses, dan status penukaran divalidasi silang secara server-authoritative.',
      blacklistMin: 'ZERO-TRUST ACTIVE (Request yang tidak tervalidasi di memori internal ditolak 100% tanpa kompromi)',
      color: 'text-emerald-550 border-emerald-500/30 bg-emerald-950/10 shadow-lg shadow-emerald-500/5',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 font-bold'
    }
  ];

  // Action: Synchronize firewall configurations
  const handleSynchronizeSecurity = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    onAddAuditLog({
      type: 'SECURITY',
      message: `Mengatur ulang gerbang perlindungan firewall ke Level ${securityLevel} (${levelDescriptions[securityLevel - 1].name})...`
    });

    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          
          let newCode = '';
          if (securityLevel === 1) {
            newCode = 'NUSAWAF-LOW-PERMISSIVE';
          } else if (securityLevel === 2) {
            newCode = 'NUSAWAF-ESCAPEND-VERIFY';
          } else if (securityLevel === 3) {
            newCode = 'NUSAWAF-MODERATE-REGEX';
          } else if (securityLevel === 4) {
            const hex = Math.random().toString(16).substring(3, 7).toUpperCase();
            newCode = `IPS_ACTIVE_${hex}`;
          } else if (securityLevel === 5) {
            const digit = Math.floor(Math.random() * 9);
            newCode = `ENTROPY_DIGIT_${digit}`;
          } else if (securityLevel === 6) {
            const minutes = new Date().getMinutes();
            newCode = `LOCKOUT-HASH-${minutes}`;
          } else {
            newCode = 'ZERO-TRUST-ENFORCED-KEY';
          }
          
          setActiveChallengeCode(newCode);
          setSeedHistory(prevHistory => [newCode, ...prevHistory.slice(0, 4)]);
          
          const timeString = new Date().toLocaleTimeString('id-US') + ' WIB';
          setLastSyncTime(timeString);

          onAddAuditLog({
            type: 'INFO',
            message: `Aturan firewall berhasil dikompilasi! Kode Hash Sinkronisasi: ${newCode.substring(0, 8)}...`
          });
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  // Simulated Cyber Attack from outside (Hacking dari pihak luar)
  const handleTriggerSimulatedHack = () => {
    const attackers = [
      { node: 'China_APT_Group_41', ip: '103.245.89.12' },
      { node: 'Russian_Cozy_Bear_Proxy', ip: '95.165.23.109' },
      { node: 'Lazarus_Fake_Worker_Indo', ip: '43.252.122.8' },
      { node: 'APT_Siber_Shadow_Subnet', ip: '114.122.45.67' }
    ];
    
    const pick = attackers[Math.floor(Math.random() * attackers.length)];
    const payloads = [
      `SELECT * FROM users WHERE name = '' OR 1=1; --`,
      `db.users.find({ username: { $ne: "" } })`,
      `' UNION SELECT null, username, pin_hash FROM accounts; --`
    ];
    const rawPayload = payloads[Math.floor(Math.random() * payloads.length)];
    
    // Check if security level successfully defends the simulated attack
    const attackBlocked = securityLevel >= 4;

    onAddAuditLog({
      type: 'WARNING',
      message: `PERINGATAN SENSOR: Teridentifikasi lalu lintas data mencurigakan dari IP Luar ${pick.ip} (${pick.node}).`
    });

    addThreatIncident({
      attackerIp: pick.ip,
      attackerNode: pick.node,
      attackType: attackBlocked ? 'SQL/NoSQL Injection Attempt Blocked (WAF Dynamic Defence)' : 'Ancaman Tercatat (Security Rule Permissive)',
      payloadUsed: rawPayload,
      severity: attackBlocked ? 'CRITICAL' : 'MEDIUM',
      details: attackBlocked 
        ? `Proteksi IPS memindai payload kotor dari luar dan memblokir alamat IP penyerang guna melindungi data pengguna.` 
        : `Sistem mendeteksi pencurian data/logika tetapi konfigurasi proteksi sedang berada di bawah level aman.`
    });

    if (attackBlocked) {
      setIsBlacklisted(true);
      if (securityLevel === 6) {
        setIsEmergencyLocked(true);
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Account Control Upper Banner */}
      <div className="bg-[#0c101c] border border-gray-900 rounded-3xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-[-50%] right-[-10%] w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-950 border border-gray-800 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">Modul Keamanan Digital</span>
              <h2 className="text-lg font-bold text-white tracking-tight">Nusantara WAF Guardian Console</h2>
              <p className="text-xs text-gray-500">
                Pusat pengawasan log forensik dan konfigurasi sirkuit pengaman DBMS: <strong className="text-white font-mono">{dbType}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSynchronizeSecurity}
              disabled={isSyncing}
              className="px-4.5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-[#07090e] font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-40 shadow-lg shadow-emerald-500/5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'SINKRONKAN ATURAN FIREWALL'}</span>
            </button>
            
            {threatIncidents.length > 0 && (
              <button
                onClick={() => setThreatIncidents([])}
                className="p-2.5 bg-gray-950 hover:bg-red-950/20 text-gray-500 hover:text-rose-400 hover:border-rose-500/20 rounded-xl border border-gray-900 transition-colors cursor-pointer"
                title="Bersihkan Semua Log Insiden"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isSyncing && (
          <div className="mt-5 space-y-2">
            <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
              <span>Mengompilasi ulang Aturan WAF Firewall...</span>
              <span>{syncProgress}%</span>
            </div>
            <div className="w-full bg-[#03060a] h-2 rounded-full overflow-hidden border border-gray-950">
              <div 
                className="bg-emerald-500 h-full transition-all duration-300 shadow-[0_0_8px_#10b981]" 
                style={{ width: `${syncProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-gray-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-gray-500 font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Postur Pertahanan Aktif: <strong className="text-white">{levelDescriptions[securityLevel - 1].name}</strong></span>
          </span>
          <span>Status Sinkronisasi Firewall: <strong className="text-emerald-400">{lastSyncTime}</strong></span>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#080d19] border border-gray-350 rounded-2xl p-5 md:p-6 shadow-xl space-y-4">
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Konfigurasikan Aturan Proteksi</h3>
                <p className="text-xs text-gray-500">Pilih tingkat keketatan aturan lalu lintas data transaksi Nusapay.</p>
              </div>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                LEVEL {securityLevel}
              </span>
            </div>

            {/* Level Selector Buttons */}
            <div className="grid grid-cols-7 gap-2 pt-1 font-mono">
              {[1, 2, 3, 4, 5, 6, 7].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setSecurityLevel(lvl);
                    onAddAuditLog({
                      type: 'SECURITY',
                      message: `Mode keamanan beralih ke Level ${lvl}. Klik 'Sinkronkan Aturan' untuk menginstalasi ulang firewall.`
                    });
                  }}
                  className={`py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    securityLevel === lvl
                      ? 'bg-emerald-500/15 border-emerald-400 text-emerald-400 shadow-md'
                      : 'bg-black/40 border-gray-900 text-gray-400 hover:border-gray-800 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Dynamic Rule Information */}
            <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-3 font-mono transition-all duration-300 ${levelDescriptions[securityLevel - 1].color}`}>
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="flex items-center gap-1.5 font-bold uppercase">
                  <Fingerprint className="w-4 h-4" />
                  <span>{levelDescriptions[securityLevel - 1].name}</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${levelDescriptions[securityLevel - 1].badgeColor}`}>
                  Aturan Keamanan Level {securityLevel}
                </span>
              </div>
              
              <div className="space-y-1 text-gray-300 text-[11px]">
                <p><span className="text-emerald-400 font-bold block pb-0.5">🛡️ FILTER PARAMETER:</span> {levelDescriptions[securityLevel - 1].defense}</p>
                <p className="pt-2 text-zinc-400 leading-normal">{levelDescriptions[securityLevel - 1].vulnDesc}</p>
              </div>

              <div className="pt-2 border-t border-white/5 text-[10px] space-y-1 text-gray-500">
                <p><span className="text-red-400 font-bold uppercase">► Aturan Firewall IPS:</span> {levelDescriptions[securityLevel - 1].blacklistMin}</p>
              </div>
            </div>

            <p className="text-[11px] text-gray-550 leading-normal italic font-mono pt-1">
              *Tingkat keandalan proteksi siber akan terus bertambah seiring peningkatan level dari tingkat 1 hingga kedaulatan penuh di tingkat 7.
            </p>

          </div>

          {/* Education box */}
          <div className="bg-[#0b0f19] border border-gray-900 rounded-2xl p-5 shadow-xl flex items-start gap-4">
            <LockKeyhole className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-gray-400">
              <span className="font-bold text-white block font-sans">Bagaimana Mekanisme Keamanan WAF Terdistribusi?</span>
              <p className="leading-relaxed font-sans">
                Nusantara WAF Guardian memindai setiap transaksi, klaim promo, dan isian forum yang dikirimkan. Di tingkat 1 sampai 3, sistem hanya merekam aktivitas. Mulai tingkat 4 ke atas, sistem secara mandiri menutup port akses jika mendeteksi anomali berbahaya untuk menjaga integritas dana dan data sensitif pengguna.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Blacklist Status Banner */}
          <div className={`p-5 rounded-2xl border flex flex-col justify-between shadow-xl relative overflow-hidden font-mono ${
            isBlacklisted 
              ? 'bg-red-950/20 border-red-500/30 text-red-100' 
              : 'bg-emerald-950/15 border-emerald-500/20 text-emerald-400'
          }`}>
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-widest font-black block text-gray-400">Status Gateway Keuangan</span>
              
              <div className="flex items-center gap-2">
                {isBlacklisted ? (
                  <>
                    <Skull className="w-5 h-5 text-red-500 animate-pulse" />
                    <h3 className="text-sm font-black text-rose-400 uppercase tracking-widest leading-none">FIREWALL SHIELD TRIGGERED</h3>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest leading-none">SYSTEM AMAN & OPERASIONAL</h3>
                  </>
                )}
              </div>
              <p className="text-[11px] text-gray-400 font-sans pt-1 leading-relaxed">
                {isBlacklisted 
                  ? 'Sistem keamanan memblokir aktivitas yang tidak terotorisasi. Aturan WAF mendeteksi pemicu anomali kritis dari luar.' 
                  : 'Suhu server stabil. Tidak ada sidik jari ancaman luar yang melakukan eksploitasi saat ini.'}
              </p>
            </div>

            {isBlacklisted && (
              <button
                onClick={onResetBlacklist}
                className="mt-4 w-full bg-red-650 hover:bg-red-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs uppercase tracking-wide transition-colors border border-red-500/40 cursor-pointer"
              >
                MULIKAN FIREWALL & ATUR ULANG
              </button>
            )}
          </div>

          {/* Incidents Board details (Notification - "Siapa, Kapan, Bagaimana") */}
          <div className="bg-[#090d16] border border-gray-900 rounded-3xl p-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-gray-950 pb-3 mb-4">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-500 animate-pulse" />
                <span>Pemantauan Serangan Siber Luar ({threatIncidents.length})</span>
              </span>
              
              <button
                onClick={handleTriggerSimulatedHack}
                className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-450 px-2 py-1 rounded border border-emerald-500/20 hover:bg-emerald-500 hover:text-black cursor-pointer transition-all duration-300"
                title="Luncurkan simulasi penyerangan luar untuk menguji keandalan WAF"
              >
                + Simulasi Attack Luar
              </button>
            </div>

            <div className="space-y-3.5 max-h-80 overflow-y-auto font-mono text-[11px]">
              {threatIncidents.map((incident) => (
                <div key={incident.id} className="bg-black/75 rounded-xl border border-red-500/20 p-3.5 space-y-2 relative">
                  
                  <div className="flex justify-between items-center text-[9px] border-b border-red-500/10 pb-1.5 mb-1 text-gray-500">
                    <span className="font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{incident.timestamp}</span>
                    </span>
                    <span className="text-red-450 font-black px-1.5 bg-red-950/30 border border-red-900/30 rounded">
                      #{incident.severity}
                    </span>
                  </div>

                  <div className="space-y-1 text-gray-300">
                    <p className="leading-normal">
                      <span className="text-red-400 font-bold font-mono">► UNIT PENYERANG:</span> <strong className="text-white">@{incident.attackerNode}</strong> ({incident.attackerIp})
                    </p>
                    <p className="leading-normal">
                      <span className="text-red-400 font-bold font-mono">► METODE CELEH:</span> {incident.attackType}
                    </p>
                    <p className="leading-normal">
                      <span className="text-red-400 font-bold font-mono">► MUATAN PAYLOAD:</span>
                    </p>
                    <code className="bg-red-950/10 border border-red-500/15 p-1.5 rounded text-red-450 block text-[10px] break-all select-text mt-1">
                      {incident.payloadUsed}
                    </code>
                    <p className="text-[10px] text-gray-500 pt-1 leading-normal">
                      <span className="text-red-400 font-bold font-mono">► UTAS LOG:</span> {incident.details}
                    </p>
                  </div>
                </div>
              ))}

              {threatIncidents.length === 0 && (
                <div className="py-12 text-center text-gray-500 flex flex-col items-center justify-center space-y-2">
                  <ShieldCheck className="w-8 h-8 text-emerald-500/20 animate-pulse" />
                  <span className="text-xs">Situasi Siber Aman & Terkendali.</span>
                  <span className="text-[10px] text-gray-600 font-sans px-3">
                    Belum terdeteksi adanya insiden serangan siber dari pihak luar. Klik tombol <strong>"+ Simulasi Attack Luar"</strong> di atas untuk melihat bagaimana WAF melacak, memperingati, dan memblokir aktivitas siber berbahaya secara real-time.
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
