# NUSA LINGUA — Heritage Brand Profile + Platform (V26)

## Struktur dan navigasi

- `index.html` — halaman **Company Profile**, dapat diakses di `/`.
- `app.html` — **platform NUSA LINGUA asli** yang dipertahankan, dapat diakses di `/app.html`.
- `sumber-profil.html` — sumber, etika media, dan penjelasan tentang status konsep.
- `profile.css`, `profile.js`, `assets/profile/` — desain, interaksi, foto lokal, dan audio latar profile.
- `app.js`, `styles.css`, dll. — fitur NUSA TWIN, LINGUA AI, NUSA GUIDE, museum interaktif dari proyek sebelumnya.

## Cara jalankan di komputer

1. Ekstrak ZIP ke direktori baru, jangan dicampur dengan V25.
2. Buka folder `nusa-lingua-app` (yang berisi `package.json`) di VS Code.
3. Jalankan `npm run check` untuk pemeriksaan file & sintaks.
4. Jalankan `npm start`.
5. Buka `http://localhost:3000` untuk Company Profile.
6. Tekan **Kunjungi NUSA LINGUA**, aplikasi di `http://localhost:3000/app.html` terbuka.

Jika port 3000 dipakai, pada PowerShell jalankan `$env:PORT=3001; npm start` dan buka `http://localhost:3001`.

Tidak perlu `npm install`; server Node menggunakan modul bawaan.

## Hosting di Railway — pilihan yang lebih sederhana untuk server Node ini

1. Buat repositori GitHub baru dan unggah **isi folder** `nusa-lingua-app` (bukan folder ZIP atau folder induk).
2. Buka Railway, pilih **New Project > Deploy from GitHub Repo**.
3. Pilih repo, tunggu Railway membaca `package.json`.
4. Di Settings, pastikan Start Command adalah `npm start`. Server sudah menggunakan `process.env.PORT` dan host `0.0.0.0`.
5. Pilih **Networking > Generate Domain**. Buka domain tersebut — `/` adalah company profile dan `/app.html` adalah platform.
6. Uji pembukaan gambar, keempat video museum, peta (internet), bahasa, mode malam, narasi, dan itinerary.

### Hosting di Vercel (opsi situs statis)

`index.html` dan `app.html` dapat di-host sebagai static files; `server.js` **tidak diperlukan** untuk Vercel static deployment.

1. Unggah repo ke GitHub.
2. Di Vercel pilih **Add New > Project > Import Git Repository**.
3. Set **Framework Preset: Other**, **Build Command: kosong**, **Output Directory: .**.
4. Deploy. Jika Vercel mengarahkan build ke framework lain, periksa kembali root directory dan build settings.
5. Pastikan `index.html`, `app.html`, serta `assets/` tersedia pada deployment. Uji video MP4 yang besar karena limit dan performa transfer dapat bervariasi per paket hosting.

**Rekomendasi:** untuk ukuran paket video saat ini, Railway lebih dekat dengan model server lokal yang telah dipakai. Untuk trafik tinggi, pindahkan MP4 ke storage/CDN yang mendukung HTTP range dan cache.

## Optimasi yang dilakukan

- Semua gambar pada **company profile** bersumber dari aset visual lokal yang sudah ada di paket awal dan disimpan sebagai WebP yang sudah dioptimalkan.
- Foto hero company profile dipreload; gambar yang berada di bawah area pertama memakai lazy loading.
- Musik profile orisinal lokal MP3, baru dimuat saat tombol Musik diklik; **tidak** dipaksa autoplay dengan suara karena browser membatasi audio autoplay.
- Keempat video museum **dipertahankan tanpa kompresi baru**, untuk menjaga resolusi file dari V25; tidak dimuat pada halaman company profile.
- Browser caching sebagian gambar lokal sudah didukung server. Peta dan sumber foto eksternal yang masih digunakan **pada platform lama** tetap memerlukan koneksi.

## Keterbatasan dan tanggung jawab publikasi

- Company profile adalah profil **konsep produk/proyek**, bukan klaim bahwa perusahaan resmi telah didirikan.
- Filosofi logo & palet adalah interpretasi merek, bukan definisi universal simbol adat.
- Audio latar adalah instrumental sintetis orisinal yang **bukan** gondang Batak; menggantinya dengan musik tradisional autentik membutuhkan rekaman/izin pemilik hak.
- Foto diambil dari paket dokumenter yang sudah diberikan ke tim, tetapi informasi izin tiap foto/video perlu diverifikasi sebelum publikasi umum atau penggunaan komersial.
- Bahasa Batak dalam LINGUA AI adalah demo glosarium; belum penerjemah bebas yang teruji.
- Peta menggunakan layanan eksternal, tidak full offline.

## Pemeriksaan

`npm run check` memvalidasi keberadaan file dan sintaks JavaScript, **bukan** pengujian end-to-end. Pastikan melakukan pengujian di browser serta di hosting sebelum publikasi.
