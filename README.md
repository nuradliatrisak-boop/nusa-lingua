# NUSA LINGUA — Heritage Edition (local documentary build)

Website interaktif NUSA LINGUA untuk BUDAYA GO! 2026, berbasis berkas V7 yang diunggah pengguna. Tidak memerlukan npm install.

## Memulai (Windows / PowerShell)
1. Ekstrak ZIP ke folder baru (jangan gabungkan dengan versi lama).
2. Buka folder `nusa-lingua-app` di VS Code. Pastikan `package.json` ada di folder ini.
3. Jalankan `npm run check` untuk memeriksa aset dan sintaks.
4. Jalankan `npm start`, lalu buka `http://localhost:3000`.
5. Jika perubahan lama masih muncul, tekan Ctrl+Shift+R atau gunakan mode incognito.

## Yang berubah
- Hero, kartu dan pratinjau destinasi menggunakan poster foto **lokal** yang diekstrak dari video pengguna. Foto tidak harus merupakan dokumentasi dari POI spesifik.
- Keempat video diproses menjadi MP4 H.264 ukuran lebih kecil, 24fps, tanpa audio untuk memberi ruang narasi TTS. Videonya tersedia di `assets/documentary/`.
- Server mendukung permintaan HTTP `Range` untuk pemutaran/seek video lebih stabil. Video utama hanya dimuat ketika digunakan. Internet tidak diperlukan untuk video, poster, HTML/CSS/JS.
- Visual lebih editorial, navbar krem semi-transparan, kartu dan detail destinasi lebih rapi, pengaturan mode gelap/terang dan bahasa Indonesia/English **beta**.
- Museum/Jejak Waktu tidak menjadi modul keempat dalam navbar; masuk melalui NUSA TWIN atau tombol cerita di Beranda.
- Pilihan suara narator bahasa Indonesia dari suara yang tersedia di perangkat. Kualitas suara tetap tergantung browser dan sistem operasi (bukan rekaman suara manusia).

## Yang masih membutuhkan internet
- Peta OpenStreetMap dan library Leaflet dari CDN.
- Google Fonts. Jika tidak terhubung, browser menggunakan font fallback.

## Konten dan hak penggunaan
Video `village.mp4`, `house.mp4`, `ulos.mp4`, `toba.mp4` diproses dari berkas yang diunggah pengguna dalam ZIP awal. Paket ini **bukan bukti izin penggunaan / lisensi**. Konfirmasi hak pemutaran dan distribusi video, termasuk bila terdapat logo pemilik di footage. Seluruh narasi budaya dan kecocokan visual dengan nama situs perlu divalidasi dengan pengelola/komunitas. Jangan mempresentasikan video ilustratif sebagai bukti sejarah atau dokumentasi lokasi persis tanpa pemeriksaan.

## Batasan
- Pilihan EN adalah terjemahan **antarmuka utama versi beta**, sebagian informasi rinci dan output itinerary tetap dalam bahasa Indonesia.
- Suara saat ini menggunakan SpeechSynthesis perangkat. Pilih varian suara `id-ID` di panel museum bila tersedia. Untuk narator manusia profesional, perlu berkas voice-over rekaman manusia berizin.
- Museum berupa dokumenter video dengan panel narasi dan penghubung peta; **bukan rekonstruksi spasial 3D/4D fotorealistis**.
- Aplikasi ini masih prototype: status destinasi, etika kunjungan, pemaknaan budaya dan rekomendasi itinerary perlu validasi.

## Heritage Refinement (versi terbaru)
- Aset utama video tetap di `assets/documentary/` (4 MP4 lokal). Tidak ada streaming video museum.
- Foto editorial dipisahkan dari footage pada `assets/editorial/`. Kartu fitur dan destinasi memakai foto-foto lokal.
- Tema malam dibuat berkontras tinggi khusus halaman cerita dan area konten.
- Navigasi bahasa dan tema tetap memakai implementasi sebelumnya, dengan perapian bentuk.
- Narasi memakai `speechSynthesis` bawaan browser: kualitas suara bergantung pada suara Indonesia yang terpasang di perangkat. Subtitle ditampilkan di atas film.
- Video sumber pertama yang tersedia bersifat **vertikal (480×854)**. Pada desktop digunakan foto horizontal sebagai gambar dasar, sedangkan video dipertahankan sebagai aksen bergerak supaya tidak perlu memperbesar video vertikal menjadi layar lebar (penyebab buram).
- Motif dekorasi merupakan **interpretasi geometris modern yang terinspirasi ulos dan gorga**, bukan klaim menyalin motif ritual tertentu.
- Hak cipta, sumber, dan persetujuan untuk video yang disediakan pengguna harus ditinjau sebelum publikasi komersial.

## Jalankan
`npm start` -> buka http://localhost:3000
`npm run check` -> pemeriksaan struktur dan sintaks JS.

Catatan: peta tetap membutuhkan koneksi ke OpenStreetMap dan Leaflet CDN. Pengalihan bahasa Inggris pada beberapa konten dinamis masih sebagian.


## V11 visual corrections

- Original-style documentary images returned to NUSA TWIN, LINGUA AI and NUSA GUIDE cards; no video stills used for these feature cards. The NUSA GUIDE reference card photo was cropped from a screenshot supplied by the user (limited resolution).
- The original cultural imagery is retained for destination cards and the history editorial section.
- Language selector is now a keyboard-accessible ID/EN pill, synchronized with the existing language-switching code. English interface remains partial/beta.
- Navbar and footer wordmark use an elegant editorial serif, with the real transparent logo beside it.
- The heritage motif promo uses a real ulos-weaving documentary photograph instead of decorative diamonds.
- Desktop hero favors a real landscape photograph with subtle cinematic camera movement because the supplied 480x854 portrait video looks blurry when stretched. Mobile preserves existing real video. To use a new properly licensed 1920x1080 landscape clip, edit the hero-video element and media loader. No external unlicensed footage was silently embedded.
- Four user-supplied documentary clips remain in assets/documentary. Check footage rights and factual correspondence before publishing.


## V12 — revisi khusus
- Hero beranda diubah menjadi foto panorama (tanpa video).
- Foto lokal tampil langsung; jika ada internet, foto Wikimedia Commons HD akan menggantikannya otomatis setelah selesai dimuat.
- Foto panorama HD: Danau Toba dari Samosir, PL 05 SIGIT (CC BY-SA 4.0), https://commons.wikimedia.org/wiki/File:Danau_Toba_dari_Samosir.jpg. Untuk publikasi, tetap cantumkan atribusi dan ketentuan lisensi.
- Kontrol ID/EN dan mode malam diperkecil. Fitur dan foto kartu lain tetap seperti V11.


## V13 — banner foto budaya
Banner NUSA IMMERSIVE kini menggunakan foto pertunjukan budaya yang sudah ada secara lokal (`assets/editorial/original-guide.webp`), ditampilkan selebar banner dengan motif transparan. Kontras angka koleksi disempurnakan dalam mode malam. Kartu fitur, foto, dan video lain tidak diubah.
