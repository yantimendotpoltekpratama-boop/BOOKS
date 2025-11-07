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
* **Debugger "Time Traveler":** Memungkinkan Anda memeriksa
