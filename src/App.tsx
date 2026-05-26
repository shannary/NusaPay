/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Terminal, 
  Database, 
  Lock, 
  Power, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  Cpu,
  Layers,
  Sparkles,
  LogOut,
  Sliders,
  BellRing,
  AlertOctagon,
  X
} from 'lucide-react';
import LoginScreen from './components/LoginScreen';
import SyncPanel from './components/SyncPanel';
import Dashboard from './components/Dashboard';
import { DbRecord, SecurityAuditLog, ThreatIncident } from './types';

const INITIAL_RECORDS: DbRecord[] = [
  {
    id: 'usr-1',
    username: 'admin',
    role: 'Super_Administrator',
    email: 'admin@nusapay.id',
    balance: 20000000,
    lastLogin: '2026-05-26T15:00:22Z',
    dbType: 'PostgreSQL'
  },
  {
    id: 'usr-2',
    username: 'riangacor',
    role: 'Regular_Gamer',
    email: 'riangacor88@gmail.com',
    balance: 1500000, 
    lastLogin: '2026-05-26T15:10:44Z',
    dbType: 'PostgreSQL'
  },
  {
    id: 'usr-3',
    username: 'rizky_haxxor',
    role: 'Security_Analyst',
    email: 'rizky@nusapay.id',
    balance: 335000,
    lastLogin: '2026-05-26T14:48:10Z',
    dbType: 'PostgreSQL'
  },
  // MySQL Node
  {
    id: 'usr-4',
    username: 'admin',
    role: 'Super_Administrator',
    email: 'mysqladmin@nusapay.id',
    balance: 20000000,
    lastLogin: '2026-05-26T15:00:22Z',
    dbType: 'MySQL'
  },
  {
    id: 'usr-5',
    username: 'riangacor',
    role: 'Regular_Gamer',
    email: 'riangacor88@gmail.com',
    balance: 1500000,
    lastLogin: '2026-05-26T15:10:44Z',
    dbType: 'MySQL'
  },
  // MongoDB Node
  {
    id: 'usr-6',
    username: 'admin',
    role: 'Super_Administrator',
    email: 'mongoadmin@nusapay.id',
    balance: 20000000,
    lastLogin: '2026-05-26T15:00:22Z',
    dbType: 'MongoDB'
  },
  {
    id: 'usr-7',
    username: 'riangacor',
    role: 'Regular_Gamer',
    email: 'riangacor88@gmail.com',
    balance: 1500000,
    lastLogin: '2026-05-26T15:10:44Z',
    dbType: 'MongoDB'
  }
];

export interface RealTimeNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'alert';
  timestamp: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem('nusapay_currentUser') || null;
    } catch {
      return null;
    }
  });
  const [activeTab, setActiveTab] = useState<'home' | 'sync'>(() => {
    try {
      return (localStorage.getItem('nusapay_activeTab') as 'home' | 'sync') || 'home';
    } catch {
      return 'home';
    }
  });
  const [selectedDb, setSelectedDb] = useState<'PostgreSQL' | 'MySQL' | 'MongoDB'>(() => {
    try {
      return (localStorage.getItem('nusapay_selectedDb') as 'PostgreSQL' | 'MySQL' | 'MongoDB') || 'PostgreSQL';
    } catch {
      return 'PostgreSQL';
    }
  });
  
  // Storage source simulation
  const [dbRecords, setDbRecords] = useState<DbRecord[]>(() => {
    try {
      const saved = localStorage.getItem('nusapay_dbRecords');
      return saved ? JSON.parse(saved) : INITIAL_RECORDS;
    } catch {
      return INITIAL_RECORDS;
    }
  });
  
  // Custom Security Levels State for Nusantara WAF (Levels 1 to 7)
  const [securityLevel, setSecurityLevel] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nusapay_securityLevel');
      return saved ? Number(saved) : 3;
    } catch {
      return 3;
    }
  });
  const [isBlacklisted, setIsBlacklisted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nusapay_isBlacklisted') === 'true';
    } catch {
      return false;
    }
  });
  const [isEmergencyLocked, setIsEmergencyLocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('nusapay_isEmergencyLocked') === 'true';
    } catch {
      return false;
    }
  });
  const [activeChallengeCode, setActiveChallengeCode] = useState<string>(() => {
    try {
      return localStorage.getItem('nusapay_activeChallengeCode') || 'WAF-BYPASS-SEED-911';
    } catch {
      return 'WAF-BYPASS-SEED-911';
    }
  });
  const [threatIncidents, setThreatIncidents] = useState<ThreatIncident[]>(() => {
    try {
      const saved = localStorage.getItem('nusapay_threatIncidents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // REAL-TIME SECURITY ALERTS AND TOASTS FEED
  const [notifications, setNotifications] = useState<RealTimeNotification[]>([]);

  // Real-time Live Security Audit Logs representing the forensic trace log
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('nusapay_auditLogs');
      return saved ? JSON.parse(saved) : [
        {
          id: 'log-1',
          timestamp: new Date(Date.now() - 1200000).toLocaleTimeString('id-US') + ' WIB',
          type: 'INFO',
          message: 'Sistem utama NusaPay diaktifkan secara komprehensif.',
        },
        {
          id: 'log-2',
          timestamp: new Date(Date.now() - 300000).toLocaleTimeString('id-US') + ' WIB',
          type: 'SECURITY',
          message: 'Protokol WAF Guardian siaga penuh di latar belakang.',
        }
      ];
    } catch {
      return [];
    }
  });

  // Synchronize state changes with Web Storage (localStorage)
  React.useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('nusapay_currentUser', currentUser);
      } else {
        localStorage.removeItem('nusapay_currentUser');
      }
    } catch (e) {
      console.warn('Web Storage access disabled or full:', e);
    }
  }, [currentUser]);

  React.useEffect(() => {
    try {
      localStorage.setItem('nusapay_activeTab', activeTab);
    } catch {}
  }, [activeTab]);

  React.useEffect(() => {
    try {
      localStorage.setItem('nusapay_selectedDb', selectedDb);
    } catch {}
  }, [selectedDb]);

  React.useEffect(() => {
    try {
      localStorage.setItem('nusapay_dbRecords', JSON.stringify(dbRecords));
    } catch {}
  }, [dbRecords]);

  React.useEffect(() => {
    try {
      localStorage.setItem('nusapay_securityLevel', String(securityLevel));
    } catch {}
  }, [securityLevel]);

  React.useEffect(() => {
    try {
      localStorage.setItem('nusapay_isBlacklisted', String(isBlacklisted));
    } catch {}
  }, [isBlacklisted]);

  React.useEffect(() => {
    try {
      localStorage.setItem('nusapay_isEmergencyLocked', String(isEmergencyLocked));
    } catch {}
  }, [isEmergencyLocked]);

  React.useEffect(() => {
    try {
      localStorage.setItem('nusapay_activeChallengeCode', activeChallengeCode);
    } catch {}
  }, [activeChallengeCode]);

  React.useEffect(() => {
    try {
      localStorage.setItem('nusapay_threatIncidents', JSON.stringify(threatIncidents));
    } catch {}
  }, [threatIncidents]);

  React.useEffect(() => {
    try {
      localStorage.setItem('nusapay_auditLogs', JSON.stringify(auditLogs));
    } catch {}
  }, [auditLogs]);

  // Raise standard user notification toast
  const addNotification = (message: string, type: 'info' | 'warning' | 'alert' = 'info') => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
    const timestamp = new Date().toLocaleTimeString('id-US') + ' WIB';
    
    setNotifications(prev => [
      { id, message, type, timestamp },
      ...prev.slice(0, 5) // Keep last 6 notifications in buffer
    ]);

    // Auto delete after 7 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 7000);
  };

  const addThreatIncident = (incident: Omit<ThreatIncident, 'id' | 'timestamp'>) => {
    const newInc: ThreatIncident = {
      ...incident,
      id: `incident-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-US') + ' WIB (' + new Date().toLocaleDateString('id-ID') + ')',
    };
    setThreatIncidents(prev => [newInc, ...prev]);

    // Trigger instant alert explaining "Siapa, Kapan, Bagaimana, dan Mengapa" as explicitly requested
    addNotification(
      `🚨 [SUSPICIOUS THREAT] @${incident.attackerNode} (IP: ${incident.attackerIp}) melancarkan serangan ${incident.attackType}! Proteksi WAF: ${securityLevel >= 4 ? 'DIBLOKIR / BLOCKED' : 'TERDETEKSI & DICATAT'}`,
      incident.severity === 'CRITICAL' ? 'alert' : 'warning'
    );
  };

  const handleResetBlacklist = () => {
    setIsBlacklisted(false);
    setIsEmergencyLocked(false);
    addAuditLog({
      type: 'SECURITY',
      message: 'WAF RECOVERY: Tim siber mereset status blacklist & memulihkan port firewall.',
    });
    addNotification('Sirkuit WAF Keamanan dipulihkan sukses. Status blacklist ditiadakan.', 'info');
  };

  const handleLoginSuccess = (username: string, dbType: 'PostgreSQL' | 'MySQL' | 'MongoDB') => {
    setCurrentUser(username);
    setSelectedDb(dbType);
    
    // Add dynamic user record with Rp 335.000 in mock DB if it does not exist
    const exists = dbRecords.some(r => r.username.toLowerCase() === username.toLowerCase() && r.dbType === dbType);
    if (!exists) {
      setDbRecords(prev => [
        ...prev,
        {
          id: `usr-${Date.now()}`,
          username: username.toLowerCase(),
          role: 'Regular_User',
          email: `${username.toLowerCase()}@nusapay-user.id`,
          balance: 335000, // Rp 335.000 Initial IDR
          lastLogin: new Date().toISOString(),
          dbType: dbType
        }
      ]);
    }

    addAuditLog({
      type: 'INFO',
      message: `Pengguna "@${username}" sukses melakukan login ke Portal NusaPay.`,
    });

    addNotification(`Selamat datang kembali, @${username}. Sesi transaksi Anda dijamin terlindung.`, 'info');
  };

  const addAuditLog = (log: Omit<SecurityAuditLog, 'id' | 'timestamp'>) => {
    const newLog: SecurityAuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-US') + ' WIB',
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const handleLogout = () => {
    addAuditLog({
      type: 'INFO',
      message: `Pengguna @${currentUser} menutup sesi siber secara aman.`,
    });
    addNotification('Sesi berhasil diakhiri secara aman.', 'info');
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Modify local database store handler
  const handleModifyRecords = (updater: (prev: DbRecord[]) => DbRecord[]) => {
    setDbRecords(prev => updater(prev));
  };

  // Dismiss Toast
  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!currentUser) {
    return (
      <LoginScreen 
        onLoginSuccess={handleLoginSuccess} 
        dbRecords={dbRecords} 
        onModifyRecords={handleModifyRecords} 
        selectedDb={selectedDb} 
        setSelectedDb={setSelectedDb} 
      />
    );
  }

  // Paranoid Level Lockout Screen
  if (isEmergencyLocked) {
    return (
      <div className="min-h-screen bg-[#070101] text-red-500 font-mono flex flex-col justify-between p-6 md:p-12 relative overflow-hidden">
        
        {/* Pulsing red radar scope */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06)_0%,transparent_75%)] animate-pulse pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d0505_1px,transparent_1px),linear-gradient(to_bottom,#1d0505_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-35 pointer-events-none" />

        {/* Locked Header */}
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 border-b border-red-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-950/40 border border-red-500/55 flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h1 className="text-base font-black text-white uppercase tracking-wider">NusaShield Security Hub</h1>
              <p className="text-[10px] text-red-400">ALERT: MALICIOUS PAYLOAD ENGAGED // ACCESS DENIED</p>
            </div>
          </div>
          <span className="text-xs bg-red-500/20 border border-red-500 text-white px-2.5 py-1 rounded animate-bounce font-bold">
            FIREWALL AUTO LOCKOUT
          </span>
        </div>

        {/* Core alert block */}
        <div className="max-w-xl w-full mx-auto my-auto z-10 py-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-950/50 border border-red-500/30 rounded-2xl flex items-center justify-center mx-auto text-red-500 transform rotate-45 shadow-[0_0_25px_rgba(239,68,68,0.1)]">
            <AlertTriangle className="w-8 h-8 transform -rotate-45" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">KONEKSI PERTAHANAN DIAKTIFKAN</h2>
            <p className="text-xs text-red-400 max-w-md mx-auto leading-relaxed">
              Pencegahan Intrusi WAF Guardian mengunci sirkuit keuangan portal Anda karena terdeteksi masukan mencurigakan yang melanggar parameter penukaran voucher database.
            </p>
          </div>

          {/* Dynamic forensik analysis */}
          <div className="bg-black/95 rounded-2xl p-5 border border-red-550/20 text-left space-y-3 shadow-inner text-xs">
            <div className="flex items-center gap-2 text-red-400 font-bold border-b border-red-950 pb-2 uppercase font-mono text-[11px]">
              <Terminal className="w-4 h-4 text-red-500" />
              <span>Daftar Forensik Pelacakan Ancaman:</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-gray-300">
              {threatIncidents.length > 0 ? (
                <>
                  <p><span className="text-red-500">► Sumber Celah:</span> @{threatIncidents[0].attackerNode} ({threatIncidents[0].attackerIp})</p>
                  <p><span className="text-red-500">► Aktivitas Kasus:</span> {threatIncidents[0].attackType}</p>
                  <p><span className="text-red-500">► Payload Terekam:</span></p>
                  <code className="bg-red-950/25 text-red-400 border border-red-900/40 px-2.5 py-1.5 rounded block text-[10px] break-all select-text font-mono">
                    {threatIncidents[0].payloadUsed}
                  </code>
                </>
              ) : (
                <p className="text-gray-550">Memroses riwayat sensor di memori...</p>
              )}
            </div>
          </div>

          {/* Recovery controls */}
          <div className="bg-[#120404] border border-red-500/20 rounded-2.5xl p-5 space-y-4">
            <span className="text-xs text-gray-400 uppercase font-bold tracking-widest block font-mono">Buka Blokir Sesi Konsol</span>
            <form onSubmit={(e) => {
              e.preventDefault();
              const val = (e.currentTarget.elements.namedItem('key') as HTMLInputElement).value.trim();
              if (val.toLowerCase() === 'bypass' || val.toLowerCase() === 'unblock' || val === 'admin') {
                handleResetBlacklist();
              } else {
                alert('Akses Ditolak! Kata sandi pemulihan salah!');
              }
            }} className="flex gap-2">
              <input
                name="key"
                type="text"
                required
                placeholder="PROSES BYPASS ATAU UNBLOCK"
                className="flex-1 bg-black border border-red-500/30 text-white rounded-lg p-2.5 text-xs text-center uppercase tracking-widest outline-none font-mono focus:border-red-500"
              />
              <button
                type="submit"
                className="bg-red-650 hover:bg-red-500 text-white px-5 rounded-lg text-xs font-bold transition-colors border border-red-500 cursor-pointer uppercase"
              >
                Kirim
              </button>
            </form>
            <div className="text-[10px] text-gray-600 font-mono text-center">
              Masukkan "bypass" atau "unblock" untuk mengaktifkan kembali situs kedaulatan utama.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto w-full z-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-red-800 border-t border-red-500/10 pt-5 font-mono">
          <p>© 2026 Lembaga Sandi Keuangan Siber & NusaPay Gateway.</p>
          <span>EMERGENCY_LOCKOUT_PORT_3000</span>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-300 font-sans flex flex-col relative select-none">
      
      {/* Grid line backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />

      {/* Decorative ambient spots */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Corporate Dashboard Header */}
      <header className="sticky top-0 z-45 bg-[#07090e]/85 backdrop-blur-md border-b border-gray-900 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] rounded-xl shadow-lg shadow-emerald-500/10">
            <div className="w-full h-full bg-[#080d19] rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white tracking-tight text-base">NUSA<span className="text-emerald-400">PAY</span></span>
              <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 font-bold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/20">PORTAL</span>
            </div>
            <p className="text-[10px] font-mono text-gray-550">Sistem Dompet Mandiri & Keuangan Digital Terintegrasi</p>
          </div>
        </div>

        {/* Corporate Navigation Items */}
        <nav className="flex items-center gap-1.5 bg-[#0d121f] p-1 rounded-xl border border-gray-800/65 max-w-full overflow-x-auto font-mono">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'home'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-900/40'
            }`}
          >
            🎰 Portal NusaPay & Arena
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-4.5 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'sync'
                ? 'bg-emerald-500 text-black font-extrabold shadow-md shadow-emerald-500/10'
                : 'text-gray-400 hover:text-white hover:bg-gray-900/40'
            }`}
          >
            🛡️ WAF Firewall Dashboard
          </button>
        </nav>

        {/* Active Profile Info */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-900">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-gray-400">Akun: <strong className="text-white">@{currentUser}</strong></span>
          </div>
          
          <button
            onClick={handleLogout}
            className="p-2.5 bg-gray-950 hover:bg-red-950/20 rounded-lg text-gray-400 hover:text-red-400 border border-gray-900 cursor-pointer transition-colors"
            title="Keluar Sesi"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8 space-y-8 overflow-x-hidden md:relative">
        
        {/* Render clean pages */}
        {activeTab === 'home' && (
          <Dashboard 
            dbType={selectedDb} 
            onAddAuditLog={addAuditLog} 
            onNavigateToLab={() => {}} 
            onNavigateToSync={() => setActiveTab('sync')} 
            dbRecords={dbRecords} 
            onModifyRecords={handleModifyRecords} 
            isBlacklisted={isBlacklisted} 
            setIsBlacklisted={setIsBlacklisted} 
            securityLevel={securityLevel} 
            currentUser={currentUser} 
            addThreatIncident={addThreatIncident} 
            onAddNotification={addNotification}
            activeChallengeCode={activeChallengeCode}
          />
        )}

        {activeTab === 'sync' && (
          <SyncPanel 
            currentUser={currentUser} 
            dbType={selectedDb} 
            dbRecords={dbRecords} 
            onModifyRecords={handleModifyRecords} 
            onAddAuditLog={addAuditLog} 
            onNavigateToLab={() => {}} 
            securityLevel={securityLevel} 
            setSecurityLevel={setSecurityLevel} 
            isBlacklisted={isBlacklisted} 
            setIsBlacklisted={setIsBlacklisted} 
            threatIncidents={threatIncidents} 
            setThreatIncidents={setThreatIncidents} 
            activeChallengeCode={activeChallengeCode} 
            setActiveChallengeCode={setActiveChallengeCode} 
            isEmergencyLocked={isEmergencyLocked} 
            setIsEmergencyLocked={setIsEmergencyLocked} 
            addThreatIncident={addThreatIncident} 
            onResetBlacklist={handleResetBlacklist} 
          />
        )}

      </main>

      {/* REAL-TIME GLOBAL THREAT NOTIFICATIONS ALERTS (TOASTS) GRID */}
      {notifications.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm space-y-3.5 pointer-events-none px-4 sm:px-0">
          {notifications.map((toast) => (
            <div 
              key={toast.id}
              className={`pointer-events-auto w-full p-4.5 rounded-2xl border flex items-start gap-3.5 shadow-2.5xl transform translate-y-0 transition-transform duration-300 animate-[slideUp_0.2s_ease-out] font-sans ${
                toast.type === 'alert' 
                  ? 'bg-[#150202] border-red-500/40 text-red-100 shadow-red-950/20' 
                  : toast.type === 'warning'
                  ? 'bg-[#120a02] border-amber-500/40 text-amber-100 shadow-amber-950/20'
                  : 'bg-[#040c15] border-blue-500/40 text-blue-100 shadow-blue-950/20'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'alert' ? (
                  <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" />
                ) : toast.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
                ) : (
                  <BellRing className="w-5 h-5 text-blue-400" />
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center border-b border-white/5 pb-1 mb-1">
                  <span className={`text-[10px] font-mono font-black uppercase tracking-wider ${
                    toast.type === 'alert' ? 'text-red-400' : toast.type === 'warning' ? 'text-amber-400' : 'text-blue-400'
                  }`}>
                    {toast.type === 'alert' ? 'Notifikasi Kritis' : toast.type === 'warning' ? 'Notifikasi Fraud' : 'Layanan NusaPay'}
                  </span>
                  <span className="text-[8px] font-mono text-gray-550">{toast.timestamp}</span>
                </div>
                <p className="text-xs leading-normal font-sans tracking-wide">
                  {toast.message}
                </p>
              </div>
              <button 
                onClick={() => handleDismissNotification(toast.id)}
                className="shrink-0 p-1 bg-black/20 hover:bg-black/40 text-gray-550 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Forensic Audit Trace log footer */}
      <footer className="mt-auto border-t border-gray-900 bg-[#04060b] px-4 md:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-mono text-gray-500">
          
          <div className="flex items-center gap-2.5 w-full md:max-w-xl">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] uppercase font-bold shrink-0 rounded font-mono">
              Cyber Audit Trace
            </span>
            <div className="truncate text-zinc-400 w-full text-[10px]/normal tracking-wide">
              {auditLogs[0] ? (
                <span>[{auditLogs[0].timestamp}] {auditLogs[0].message}</span>
              ) : (
                <span>Koneksi aman. Tidak ada log audit siber saat ini.</span>
              )}
            </div>
          </div>

          <p>© 2026 Lembaga Sandi Keuangan Siber & NusaPay Gateway.</p>
        </div>
      </footer>

      {/* Custom keyframe animation definitions injected into style tag for smooth slide and alert animation props */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(1.5rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

    </div>
  );
}
