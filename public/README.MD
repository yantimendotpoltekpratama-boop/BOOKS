# Flowork: Visual AI Workflow Automation Platform

<p align="center">
  <a href="https://flowork.cloud"><img src="https://img.shields.io/badge/Website-flowork.cloud-blue?style=for-the-badge" alt="Website"></a>
  <a href="https://docs.flowork.cloud/"><img src="https://img.shields.io/badge/Docs-Read_Here-green?style=for-the-badge" alt="Documentation"></a>
  <a href="https://discord.gg/Gv7h5d5d"><img src="https://img.shields.io/badge/Discord-Join_Chat-7289DA?style=for-the-badge&logo=discord" alt="Discord"></a>
  <a href="https://t.me/FLOWORK_AUTOMATION"><img src="https://img.shields.io/badge/Telegram-Join_Channel-2CA5E0?style=for-the-badge&logo=telegram" alt="Telegram"></a>
  <a href="https://www.youtube.com/playlist?list=PLATUnnrT5igDXCqjBVvkmE4UKq9XASUtT"><img src="https://img.shields.io/badge/YouTube-Watch_Tutorials-red?style=for-the-badge&logo=youtube" alt="YouTube"></a>
</p>

<p align="center">
  <img src="https://flowork.cloud/images/flowork_2.webp" alt="Flowork Synapse Logo" width="600"/>
</p>

> Flowork adalah *engine* orkestrasi *workflow* AI *open-core* dan *self-hosted* yang dirancang untuk **Skalabilitas Terdistribusi Global** dan **Kedaulatan Data Pengguna Penuh**.

Arsitektur kami memisahkan antarmuka (GUI di *cloud*) dari logika inti (*Gateway* dan *Core* di server Anda), memberi Anda kendali penuh atas data dan sumber daya Anda. Prinsip inti kami: **"Data Anda di Server Anda."**

---

## ✨ Mengapa Memilih Flowork?

Flowork dibangun dengan filosofi inti yang mengutamakan privasi data, kinerja, dan fleksibilitas developer.

### 👑 Kedaulatan Data & Keamanan (Prinsip Utama)
* **Kedaulatan Data Pengguna:** Semua database (SQLite/PostgreSQL) dan data pribadi pengguna berada secara eksklusif di server Anda (*self-hosted*).
* **Akses Kripto (Zero-Trust):** Kami menggunakan Teknologi Kripto Web3 (*Private Key*) untuk otentikasi admin dan pengguna, menyediakan lapisan keamanan *zero-trust* yang kuat.
* **Jejak Audit (Audit Trail):** Semua aktivitas administratif dicatat di *Audit Log* lokal di server pengguna.

### 🚀 Arsitektur Berkinerja Tinggi & Fleksibel
* **Model Eksekusi Terpisah:** Core Kernel kami berjalan dalam proses/kontainer terpisah dari Gateway, memastikan stabilitas tertinggi untuk penerapan terdistribusi.
* **Agnostik Penyedia AI:** Tidak terkunci pada satu penyedia AI. Pengguna bebas memilih antara AI *cloud* (Gemini, ChatGPT) atau model **AI Lokal** (*on-premise*).
* **Dukungan AI Lokal:** Mendukung model AI *on-premise* yang berjalan di perangkat keras Anda (misalnya, ditenagai oleh **llama-cpp-python**).
* **Efisien Sumber Daya:** Menggunakan **SQLite** sebagai *database default* berbasis *file* untuk **zero-setup** dan efisiensi sumber daya (RAM/CPU).

### 💻 Penuh Fitur untuk Developer
* **Mesin Runner Multi-Bahasa:** Jalankan modul kode yang ditulis dalam **Python, JavaScript, Bash, PHP, Perl, dan Ruby** langsung di dalam *workflow* visual Anda.
* **Debugger "Time Traveler":** Memungkinkan Anda memeriksa *state* data (*variabel* dan *payload*) **setelah setiap *node*** dieksekusi.
* **Mode "Quick Run":** Memungkinkan *developer* mengeksekusi **satu *modul* secara independen** untuk pengujian dan *debugging* cepat.
* **Pelatihan AI Terintegrasi:** Mendukung *workflow* untuk **Pelatihan Model AI** yang dilakukan sepenuhnya di dalam lingkungan server Anda.

### ⚙️ Otomatisasi OS-Native & Kolaborasi
* **Pengamat Sistem File (File Watchers):** Picu *workflow* secara instan saat ada perubahan (pembuatan, modifikasi, penghapusan) di direktori atau *file* lokal.
* **Pemantauan Proses & Cron:** Mulai tugas berdasarkan jadwal Cron atau status proses lokal lainnya yang sedang berjalan.
* **Berbagi Engine:** Pengguna dapat **berbagi akses ke Engine** (server) mereka dengan pengguna Flowork lain di bawah kontrol izin yang ketat.
* **Berbagi Preset:** Bagikan *workflow* atau *preset* yang telah Anda buat dengan mudah.

---

## 🚀 Instalasi Cepat (Docker)

Panduan ini menggunakan Docker Compose untuk penyiapan lokal yang cepat.

### Prasyarat
* Docker Desktop (atau Docker Engine)
* Python 3.11+ (untuk menjalankan skrip pengaturan)

### Langkah-langkah Instalasi
1.  **Buat Environment:** Hasilkan ID Engine, Token, dan *Admin Login Private Key* baru dengan menjalankan skrip Python yang disediakan.
    ```bash
    python generate_env.py
    ```

2.  **Build dan Jalankan Kontainer:** Bangun dan jalankan *stack* Docker. Ini akan menyiapkan **Gateway** (termasuk Core Kernel, migrasi database, dan dependensi AI/ML).
    ```bash
    # PENTING: Gunakan --force-recreate --no-cache untuk build pertama kali.
    docker-compose up --build --force-recreate -d
    
    # Untuk restart selanjutnya:
    docker-compose up -d
    ```

3.  **Dapatkan Private Key (Login):** Periksa *log* kontainer Gateway untuk mengambil *private key* admin yang baru dibuat. Simpan ini di tempat yang aman!
    ```bash
    docker-compose logs flowork_gateway
    # Cari baris yang berisi: !!! YOUR LOGIN PRIVATE KEY IS: ...
    ```

---

## 🔌 Konfigurasi Cloudflare Tunnel (Wajib)

GUI Flowork di *cloud* perlu mengakses API Gateway Anda yang berjalan di server Anda. Kami menggunakan Cloudflare Tunnel untuk ini.

1.  **Dapatkan Token:** Dapatkan **Cloudflare Tunnel Token** Anda dari *dashboard* Cloudflare Zero Trust.
2.  **Atur di .env:** Buka *file* `.env` Anda dan pastikan variabel `CLOUDFLARED_TUNNEL_TOKEN` diisi dengan token Anda.
3.  **Restart Kontainer:** *Restart* kontainer `flowork_cloudflared` (atau jalankan `docker-compose up -d` lagi) agar *tunnel* terhubung ke layanan Gateway (`http://flowork_gateway:8000`).

---

## 🌐 Komunitas & Sumber Daya

Bergabunglah dengan komunitas kami yang sedang berkembang! Kami menyambut kontribusi, umpan balik, dan pertanyaan Anda.

| Platform | Tautan |
| :--- | :--- |
| **Website** | [https://flowork.cloud](https://flowork.cloud) |
| **Repo GitHub** | [https://github.com/flowork-dev/Visual-AI-Workflow-Automation-Platform.git](https://github.com/flowork-dev/Visual-AI-Workflow-Automation-Platform.git) |
| **Dokumentasi (Docs)** | [https://docs.flowork.cloud/](https://docs.flowork.cloud/) |
| **Server Discord** | [https://discord.gg/Gv7h5d5d](https://discord.gg/Gv7h5d5d) |
| **Channel Telegram** | [https://t.me/FLOWORK_AUTOMATION](https://t.me/FLOWORK_AUTOMATION) |
| **Playlist YouTube** | [https://www.youtube.com/playlist?list=PLATUnnrT5igDXCqjBVvkmE4UKq9XASUtT](https://www.youtube.com/playlist?list=PLATUnnrT5igDXCqjBVvkmE4UKq9XASUtT) |
