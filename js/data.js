// Konten pendidikan Cyber Academy + data quest/achievement.
export const LESSONS=[
 {id:'hw',title:'Hardware dan Software',goal:'Membedakan perangkat keras dan perangkat lunak.',
  body:['Hardware adalah bagian komputer yang bisa disentuh: prosesor (CPU), RAM, penyimpanan, monitor, keyboard.','Software adalah instruksi yang dijalankan hardware: sistem operasi, aplikasi, dan game.','Keduanya saling bergantung. Hardware tanpa software tidak tahu harus bekerja apa; software tanpa hardware tidak punya tempat berjalan.'],
  example:'Laptop = hardware. Browser Chrome dan Windows = software.',exp:40},
 {id:'os',title:'Sistem Operasi',goal:'Memahami peran sistem operasi.',
  body:['Sistem operasi (OS) adalah software utama yang mengelola hardware dan menyediakan layanan untuk aplikasi.','Tugas OS: mengatur memori, menjalankan program, mengelola file, dan menghubungkan perangkat.','Contoh OS: Windows, Linux, macOS, Android, iOS.'],
  example:'Saat membuka dua aplikasi sekaligus, OS yang membagi waktu CPU dan RAM di antara keduanya.',exp:40},
 {id:'rpl',title:'Apa itu RPL dan Algoritma',goal:'Mengenal Rekayasa Perangkat Lunak dan algoritma.',
  body:['Rekayasa Perangkat Lunak (RPL) adalah cara terstruktur membuat software: menganalisis kebutuhan, merancang, membuat kode, menguji, lalu merilis.','Algoritma adalah langkah-langkah terurut untuk menyelesaikan masalah. Algoritma yang baik jelas, berhingga, dan menghasilkan keluaran.','Profesi: programmer, UI/UX designer, QA tester, DevOps, data analyst, software architect.'],
  example:'Algoritma membuat teh: 1) didihkan air, 2) masukkan teh, 3) tuang air, 4) tunggu, 5) sajikan.',exp:50}];
export const QUESTIONS=[
 {q:'Manakah yang termasuk hardware?',o:['Sistem operasi','RAM','Browser','File dokumen'],a:1,e:'RAM adalah komponen fisik. Sistem operasi, browser, dan file adalah software atau data.'},
 {q:'Apa tugas utama sistem operasi?',o:['Mengedit foto','Mengelola hardware dan menjalankan program','Mendesain logo','Membuat kabel jaringan'],a:1,e:'OS menjadi penghubung antara hardware dan aplikasi. Mengedit foto adalah tugas aplikasi tertentu.'},
 {q:'Linux adalah contoh…',o:['Hardware','Bahasa pemrograman','Sistem operasi','Database'],a:2,e:'Linux adalah sistem operasi. Contoh bahasa pemrograman: Python, JavaScript.'},
 {q:'Algoritma adalah…',o:['Langkah terurut untuk menyelesaikan masalah','Kabel penghubung komputer','Jenis monitor','Nama aplikasi'],a:0,e:'Algoritma = urutan langkah yang jelas untuk menyelesaikan suatu masalah.'},
 {q:'Tahap yang biasanya dilakukan PERTAMA dalam membuat software adalah…',o:['Merilis ke pengguna','Menguji','Menganalisis kebutuhan','Menulis dokumentasi akhir'],a:2,e:'Kebutuhan harus dipahami lebih dulu agar rancangan dan kode sesuai tujuan.'},
 {q:'Siapa yang bertugas mencari bug sebelum software dirilis?',o:['QA tester','Desainer kemasan','Operator warnet','Kurir'],a:0,e:'QA (Quality Assurance) tester menguji software untuk menemukan kesalahan.'},
 {q:'Mana yang BUKAN ciri algoritma yang baik?',o:['Langkahnya jelas','Berhingga (ada akhirnya)','Langkahnya ambigu','Menghasilkan keluaran'],a:2,e:'Algoritma harus jelas. Langkah yang ambigu membuat hasilnya tidak pasti.'},
 {q:'Benar atau salah: software bisa dipegang secara fisik.',o:['Benar','Salah'],a:1,e:'Software berupa instruksi/program, bukan benda fisik. Yang bisa dipegang adalah hardware atau media penyimpanannya.'},
 {q:'Urutan yang benar dari tahap pembuatan software:',o:['Uji, rancang, rilis, analisis','Analisis, rancang, kode, uji','Kode, rilis, rancang, uji','Rilis, uji, analisis, kode'],a:1,e:'Alur umum: analisis kebutuhan, perancangan, implementasi (kode), pengujian, lalu rilis.'},
 {q:'Output dari kode ini?  let x = 2; x = x + 3; console.log(x)',o:['2','3','5','23'],a:2,e:'x awalnya 2, ditambah 3 menjadi 5. Karena keduanya angka, hasilnya penjumlahan, bukan gabungan teks.'}];
export const QUESTS=[
 {id:'q1',title:'Kenali dunia RPL',desc:'Selesaikan 3 materi di Learning Center.',type:'Main Quest',lvl:'Beginner',goal:3,prog:s=>s.lessons.length,reward:{exp:60,coin:30}},
 {id:'q2',title:'Sapa Pak Guru',desc:'Bicara dengan NPC guru di dunia.',type:'Main Quest',lvl:'Beginner',goal:1,prog:s=>s.flags.talked?1:0,reward:{exp:30,coin:15}},
 {id:'q3',title:'Kumpulkan Data Core',desc:'Temukan 3 koin data tersembunyi di Cyber Academy.',type:'Side Quest',lvl:'Beginner',goal:3,prog:s=>s.picked.length,reward:{exp:40,coin:20,item:'hp'}},
 {id:'q4',title:'Kalahkan Bug Monster',desc:'Menangkan battle di Arena.',type:'Boss Mission',lvl:'Intermediate',goal:1,prog:s=>s.wins>0?1:0,reward:{exp:120,coin:60,item:'exp'}}];
export const ACHS=[
 {id:'a1',t:'First Login',d:'Membuat karakter pertamamu.',ok:s=>!!s.created},
 {id:'a2',t:'First Lesson',d:'Menyelesaikan satu materi.',ok:s=>s.lessons.length>=1},
 {id:'a3',t:'Quiz Master',d:'Menjawab 10 soal dengan benar.',ok:s=>s.correct>=10},
 {id:'a4',t:'Boss Slayer',d:'Mengalahkan Bug Monster.',ok:s=>s.wins>=1},
 {id:'a5',t:'Junior Developer',d:'Mencapai level 5.',ok:s=>s.level>=5}];
export const ITEMS={hp:{n:'Health Potion',i:'🧪',d:'Memulihkan 40 HP.',price:25},exp:{n:'EXP Potion',i:'⚗️',d:'Memberi 50 EXP.',price:40},en:{n:'Energy Potion',i:'🔋',d:'Memulihkan 30 energi.',price:20}};
export const RANKS=['Beginner Coder','Junior Developer','Intermediate Developer','Senior Developer','Software Architect','Ultimate Developer'];
