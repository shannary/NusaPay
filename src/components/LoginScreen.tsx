/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Lock, User, Key, Mail, Landmark, Coins } from 'lucide-react';
import { DbRecord } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (username: string, dbType: 'PostgreSQL' | 'MySQL' | 'MongoDB') => void;
  dbRecords: DbRecord[];
  onModifyRecords: (updater: (prev: DbRecord[]) => DbRecord[]) => void;
  selectedDb: 'PostgreSQL' | 'MySQL' | 'MongoDB';
  setSelectedDb: (db: 'PostgreSQL' | 'MySQL' | 'MongoDB') => void;
}

export default function LoginScreen({ 
  onLoginSuccess, 
  dbRecords, 
  onModifyRecords, 
  selectedDb, 
  setSelectedDb 
}: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login input states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register input states
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const userLower = loginUsername.trim().toLowerCase();

    if (!userLower) {
      setError('Masukkan username Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Validate credential matching
      const foundMatch = dbRecords.find(
        r => r.username.toLowerCase() === userLower && r.dbType === selectedDb
      );

      // Preloaded password validation bypass or logical simulation
      if (userLower === 'admin' || userLower === 'riangacor' || foundMatch) {
        onLoginSuccess(userLower, selectedDb);
      } else {
        setError(`Akun "${userLower}" tidak ditemukan di kluster database ${selectedDb}. Harap Daftar terlebih dahulu.`);
      }
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const userClean = regUsername.trim().toLowerCase();
    const emailClean = regEmail.trim().toLowerCase();

    if (!userClean || !emailClean || !regPassword) {
      setError('Harap isi semua kolom pendaftaran.');
      return;
    }

    if (userClean.length < 3) {
      setError('Username minimal terdiri dari 3 karakter.');
      return;
    }

    // Check if user already exists
    const exists = dbRecords.some(r => r.username.toLowerCase() === userClean && r.dbType === selectedDb);
    if (exists) {
      setError('Username sudah digunakan di kluster database ini.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      // Create new record with exactly Rp 335.000 (335000)
      const newRecord: DbRecord = {
        id: `usr-${Date.now()}`,
        username: userClean,
        role: 'Regular_User',
        email: emailClean,
        balance: 335000, // Rp 335.000 as explicitly requested!
        lastLogin: new Date().toISOString(),
        dbType: selectedDb
      };

      onModifyRecords(prev => [...prev, newRecord]);
      setSuccess(`Akun "${userClean}" berhasil didaftarkan dengan Saldo Awal Rp 335.000! Silakan Login.`);
      
      // Auto move tab
      setLoginUsername(userClean);
      setActiveTab('login');
      
      // Reset inputs
      setRegUsername('');
      setRegEmail('');
      setRegPassword('');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-gray-200 flex flex-col justify-between p-4 md:p-8 font-sans relative overflow-hidden">
      
      {/* Dynamic Network mesh line background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-teal-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Pristine Minimalist Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between z-10 py-2 border-b border-gray-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-lg shadow-emerald-500/10">
            <div className="w-full h-full bg-[#080d19] rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white tracking-tight text-base">NUSA<span className="text-emerald-400">PAY</span></span>
              <span className="text-[9px] uppercase tracking-wider font-mono bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">PORTAL</span>
            </div>
            <p className="text-[10px] text-gray-550 font-mono">Gateway Keuangan Digital & Dompet Siber Indonesia</p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-mono font-bold animate-pulse">
          🎯 SANDBOX TUMBAL TARGET
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto my-auto z-10 py-8">
        
        {/* Database Quick Switcher inside Login Screen (To choose which table to query) */}
        <div className="mb-4 bg-black/40 border border-gray-900 rounded-2xl p-2.5 flex items-center justify-between gap-2.5">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase px-1.5">Target Cluster DB:</span>
          <div className="flex gap-1">
            {(['PostgreSQL', 'MySQL', 'MongoDB'] as const).map(db => (
              <button
                key={db}
                onClick={() => setSelectedDb(db)}
                type="button"
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                  selectedDb === db 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-transparent border-transparent text-gray-600 hover:text-gray-400'
                }`}
              >
                {db}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#09101d] border border-gray-900 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
          
          {/* Aesthetic upper accent light */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          
          <div className="flex bg-black/40 p-1 rounded-xl border border-gray-900/80 mb-6 font-mono">
            <button
              onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'login' ? 'bg-[#0f172a] text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setActiveTab('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'register' ? 'bg-[#0f172a] text-[#10b981]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Daftar Akun Baru (Mulakan)
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/5 border border-red-500/15 text-red-400 rounded-xl text-xs flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/5 border border-emerald-500/15 text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            // NORMAL LOGIN FORM
            <form onSubmit={handleLoginSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-black block">NusaPay Username / Akun</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-600"><User className="w-4 h-4" /></span>
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Contoh: admin atau riangacor atau akun Anda"
                    className="w-full bg-black/60 border border-gray-900 focus:border-emerald-500/70 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder:text-gray-750 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-500 uppercase font-black block">Password Sesi Keuangan</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-600"><Lock className="w-4 h-4" /></span>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Sandi pembuka keamanan (Bisa apa saja)"
                    className="w-full bg-black/60 border border-gray-900 focus:border-emerald-500/70 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder:text-gray-750 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Melakukan Otorisasi Transaksi...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Masuk ke Dompet NusaPay</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[9px] text-gray-600 bg-black/25 rounded-lg p-2.5 text-center leading-relaxed">
                Kredensial Default Terbuka:<br />
                <code className="text-gray-500">username: <strong className="text-gray-350">admin</strong> password: siber2026</code><br />
                <code className="text-gray-500">username: <strong className="text-gray-350">riangacor</strong> password: password</code>
              </div>
            </form>
          ) : (
            // NORMAL REGISTRATION FORM
            <form onSubmit={handleRegisterSubmit} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-black block">Username Baru</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-600"><User className="w-4 h-4" /></span>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="Username e.g. hacker_gacor"
                    className="w-full bg-black/60 border border-gray-900 focus:border-emerald-500/70 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder:text-gray-750"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-black block">Email Transaksi</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-600"><Mail className="w-4 h-4" /></span>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@nusapay-user.id"
                    className="w-full bg-black/60 border border-gray-900 focus:border-emerald-500/70 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder:text-gray-750"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-gray-400 uppercase font-black block">Kata Sandi Akun</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-600"><Lock className="w-4 h-4" /></span>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Buat kata sandi aman"
                    className="w-full bg-black/60 border border-gray-900 focus:border-emerald-500/70 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white outline-none placeholder:text-gray-750"
                  />
                </div>
              </div>

              {/* Explicit bonus highlight */}
              <div className="bg-emerald-950/20 border border-emerald-500/20 px-3 py-2.5 rounded-xl text-[10px] text-emerald-400 flex items-center gap-2.5">
                <Coins className="w-5 h-5 flex-shrink-0 animate-bounce" />
                <div>
                  <strong>BONUS REGISTRASI SIBER:</strong><br />
                  Setiap akun yang didaftarkan memperoleh saldo awal sebesar <strong className="text-white underline">Rp 335.000 IDR</strong> yang siap diuji/diretas!
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold py-3 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Menyimpan Akun & Saldo Bonus...</span>
                    </>
                  ) : (
                    <>
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Buat Akun Rp 335rb</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto w-full z-10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-600 border-t border-gray-950 pt-4 font-mono">
        <p>© 2026 Lembaga Sandi Keuangan Siber & NusaPay Gateway.</p>
        <span>AES-256 Client-Controlled Entropy Mode</span>
      </div>

    </div>
  );
}
