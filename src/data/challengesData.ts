/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CyberChallenge {
  id: string;
  title: string;
  category: 'UANG' | 'COOKIES' | 'AKSES' | 'CELAH SERVER';
  technicalLabel: string;
  description: string;
  instructions: string;
  hint: string;
  vulnCodeSnippet: string;
  safeCodeSnippet: string;
}

export const CYBER_CHALLENGES: CyberChallenge[] = [
  {
    id: 'chal-1',
    title: 'Tantangan 1: Mencuri Uang (SQL/NoSQL Bypass)',
    category: 'UANG',
    technicalLabel: 'SQL / NoSQL Injection (Logical Operator Manipulation)',
    description: 'RianGacor menyimpan saldo kas besar. Dengan mensabotase logika query isian kata kunci voucher di panel slot di bawah, bypass otentikasi voucher agar server mengembalikan baris data pertama milik RianGacor secara paksa.',
    instructions: 'Suntikkan input logika boolean OR yang selalu benar sehingga filter database memeriksa kesamaan data ke nilai true secara absolut.',
    hint: "' OR '1'='1",
    vulnCodeSnippet: `// SQL Query dinilai kasar tanpa sanitasi parameter
const query = \`SELECT * FROM vouchers WHERE path = '\${input}'\`;
const res = await db.query(query);`,
    safeCodeSnippet: `// Menggunakan PreparedStatement parameter binder
const query = "SELECT * FROM vouchers WHERE path = ?";
const res = await db.query(query, [input]);`
  },
  {
    id: 'chal-2',
    title: 'Tantangan 2: Mencuri Cookies Sesi Akun (Stored XSS)',
    category: 'COOKIES',
    technicalLabel: 'Stored Cross-Site Scripting (XSS)',
    description: 'Suntikkan script tag berbahaya ke kolom live komentar di forum utama. Browser fiktif administrator yang bertugas melakukan patroli akan mengompilasi tag tersebut, meluncurkan script JavaScript kotor ke siber logger internal.',
    instructions: 'Gunakan tag img dengan trigger onerror atau script JavaScript tag alert(document.cookie) untuk memotong pertahanan DOM.',
    hint: '<img src=x onerror="alert(document.cookie)">',
    vulnCodeSnippet: `// Menyimpan data raw ke HTML tanpa encoding
return <div dangerouslySetInnerHTML={{ __html: dbComment }} />`,
    safeCodeSnippet: `// Menggunakan Text escaping otomatis dari React
return <div>{dbComment}</div>`
  },
  {
    id: 'chal-3',
    title: 'Tantangan 3: Merekayasa Privilege Escalation (JSON Mass Assignment)',
    category: 'AKSES',
    technicalLabel: 'JSON State Parameter Injection',
    description: 'Ubah konteks isian payload JSON setting siber profil untuk memotong pangkat Anda. Paksa server memintas isian role user default menjadi Super_Administrator.',
    instructions: 'Suntikkan properti state role ke struktur JSON data profil.',
    hint: '{"username": "hacker", "role": "Super_Administrator"}',
    vulnCodeSnippet: `// Server langsung melakukan spread object isian client
const updatedUser = { ...sessionUser, ...req.body };
await db.save(updatedUser);`,
    safeCodeSnippet: `// Whitelist properti aman secara granular
const { email, password } = req.body;
sessionUser.email = email;
sessionUser.password = password;`
  },
  {
    id: 'chal-4',
    title: 'Tantangan 4: Menguras File .env Server (LFI Traversal)',
    category: 'CELAH SERVER',
    technicalLabel: 'Local File Inclusion (Path Traversal / LFI)',
    description: 'Endpoint static file loader membaca direktori file internal. Menusuk file system di atas dengan memanjat absolute folder untuk mencuri berkas .env sensitif berisi password database.',
    instructions: 'Suntikkan rentetan operator pemanjat direktori ../ secara serial menuju absolute file siber .env.',
    hint: '../../../../.env',
    vulnCodeSnippet: `// fs membaca input mentah client-side path
const fileContent = fs.readFileSync(path.join(__dirname, req.query.filepath));`,
    safeCodeSnippet: `// Melakukan resolusi path.resolve dan validasi root folder
const targeted = path.resolve(baseFolder, req.query.filepath);
if (!targeted.startsWith(baseFolder)) throw new Error("Ilegal Path.");`
  },
  {
    id: 'chal-5',
    title: 'Tantangan 5: Remote Code Execution (OS Command Injection)',
    category: 'CELAH SERVER',
    technicalLabel: 'OS Command Injection via Ping Terminal SUB-UNIT',
    description: 'Fungsi diagnostik server melakukan ping ke IP host tujuan. Bypass perintah subprocess siber dengan menyuntikkan pemisah baris shell terminal demi meluncurkan shell command internal.',
    instructions: 'Gunakan operator pemisah baris ";" atau "&&" lalu sisipkan perintah terminal Linux "id" atau "whoami".',
    hint: '127.0.0.1; whoami',
    vulnCodeSnippet: `// exec menjalankan terminal shell secara dinamis
exec(\`ping -c 1 \${req.query.ip}\`, (err, stdout) => { ... });`,
    safeCodeSnippet: `// Menggunakan execFile dengan parameter array terpisah
execFile("ping", ["-c", "1", req.query.ip], (err, stdout) => { ... });`
  },
  {
    id: 'chal-6',
    title: 'Tantangan 6: Brute Force Password Admin',
    category: 'AKSES',
    technicalLabel: 'Brute Force / Password Spraying Attack',
    description: 'Otentikasi terminal memproses verifikasi tanpa rate limiting (jeda proteksi). Tebak password terpopuler administrator untuk menembus portal siber.',
    instructions: 'Gunakan sandi default terpopuler yang biasa digunakan developer (e.g. siber2026 atau nusashield99 atau bypass).',
    hint: 'nusashield99',
    vulnCodeSnippet: `// Server langsung memproses tanpa delay atau limit checks
if (req.body.password === adminPass) { return res.send(true); }`,
    safeCodeSnippet: `// Implementasi express-rate-limit pada route login siber
const loginLimiter = rateLimit({ windowMs: 15*60*1000, max: 5 });`
  },
  {
    id: 'chal-7',
    title: 'Tantangan 7: Mengintip Riwayat Transaksi Lain (IDOR)',
    category: 'UANG',
    technicalLabel: 'Insecure Direct Object Reference (IDOR)',
    description: 'Endpoint profile loader memanggil riwayat transaksi keuangan nasabah berdasar parameter ID. Intip database log kas nasabah lain ("usr-1" atau "usr-2") dengan memanipulasi isian profil index.',
    instructions: 'Ubah referensi token ID target user langsung di isian parameter.',
    hint: 'usr-1',
    vulnCodeSnippet: `// Mempercayai ID objek kiriman client tanpa session matching
const ledger = await db.findTransByUserId(req.query.id);`,
    safeCodeSnippet: `// Memaksa pencocokan ke ID session aktif server-side
const ledger = await db.findTransByUserId(req.session.currentUserId);`
  },
  {
    id: 'chal-8',
    title: 'Tantangan 8: AWS Cloud Metadata Access (SSRF)',
    category: 'CELAH SERVER',
    technicalLabel: 'Server-Side Request Forgery (SSRF)',
    description: 'Server memiliki microservice siber scraper untuk mencantumkan metadata gambar web lain. Rekayasa URL target scraper agar mengunduh file credentials internal menunjuk localhost server.',
    instructions: 'Gunakan hostname lokal siber menunjuk loops local loopback localhost.',
    hint: 'http://localhost:3000/internal-metadata',
    vulnCodeSnippet: `// Server menolak blacklist dan langsung merequest url client
const result = await axios.get(req.query.host_url);`,
    safeCodeSnippet: `// Validasi IP dengan regex dns resolver whitelist saja
if (isPrivateIP(req.query.host_url)) { throw new Error("Private Scope."); }`
  },
  {
    id: 'chal-9',
    title: 'Tantangan 9: Pemalsuan Transaksi Dana (CSRF Bypass)',
    category: 'UANG',
    technicalLabel: 'Cross-Site Request Forgery (CSRF)',
    description: 'Hacker memalsukan request transfer dengan menyusupkan tautan img kotor dari luar. Di level rendah, server memproses transfer langsung karena tidak memvalidasi CSRF Token pertahanan.',
    instructions: 'Suntikkan URL transfer target siber ke isian referrer kotor.',
    hint: 'http://nusashield-server/transfer?target=riangacor',
    vulnCodeSnippet: `// Session divalidasi melulu tanpa CSRF tokens
app.post("/transfer", (req, res) => { processTransfer(); });`,
    safeCodeSnippet: `// Validasi CSRF double-submit token di header request
app.use(csrfProtection);`
  },
  {
    id: 'chal-10',
    title: 'Tantangan 10: JWT None Algorithm Confusion',
    category: 'AKSES',
    technicalLabel: 'JWT None Algorithm Flaw',
    description: 'Server otentikasi menggunakan pustaka JWT lawas. Sabotase header token JWT untuk memadamkan sistem validasi signature dengan operator algoritma "none".',
    instructions: 'Ubah parameter "alg" jwt token menjadi value "none" absolut.',
    hint: 'eyJhbGciOiJub25lIn0.eyJ1c2VybmFtZSI6ImFkbWluIiwiYmFsYW5jZSI6OTk5MDB9.',
    vulnCodeSnippet: `// Membuka decoding token tanpa verifikasi strict algoritma
const claims = jwt.decode(token);`,
    safeCodeSnippet: `// Menolak dengan tegas status algoritma none
const claims = jwt.verify(token, secretKey, { algorithms: ["HS256"] });`
  }
];
