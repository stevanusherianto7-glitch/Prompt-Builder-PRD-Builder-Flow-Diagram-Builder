# 🚀 PromptOps · God Mode 9500 (Prompt Builder, PRD Builder & Flow Diagram Builder)

Platform **SaaS AI Product Engineering Hub** end-to-end berstandar **God Mode Level 9500** yang merancang System Prompt profesional, AI-Executable Product Requirements Document (PRD), dan Visual Flow Diagram terintegrasi.

---

## 🔬 Internalisasi "Kitab Suci" Prompt Engineering & Standar PRD AI Global

Proyek ini telah menginternalisasi **4 repositori standar emas industri global** ke dalam inti *pipeline* engine (`src/app/godmode/godmodeEngine.ts` dan `src/app/hooks/useGodMode.ts`):

### 1. Repositori GitHub untuk Prompt Engineering

#### 🧠 [dair-ai / Prompt-Engineering-Guide](https://github.com/dair-ai/Prompt-Engineering-Guide)
* **Fokus:** Edukasi, panduan komprehensif, sains pemrosesan instruksi AI, dan teknik terstruktur.
* **Implementasi dalam Engine:**
  * Mengintegrasikan protokol penalaran **Chain-of-Thought (CoT)** langkah demi langkah sebelum AI menghasilkan kode atau arsitektur.
  * Menerapkan teknik **Few-Shot Exemplars** untuk membatasi ruang solusi (*solution space*) dan mencegah halusinasi model.
  * Pengecekan **Self-Consistency & Verification Loop** yang menjamin akurasi logika instruksi.

#### 🎭 [f / awesome-chatgpt-prompts](https://github.com/f/awesome-chatgpt-prompts)
* **Fokus:** Role-playing (Persona spesialis) dan instruksi penugasan spesifik.
* **Implementasi dalam Engine:**
  * Mengimpor kerangka persona teruji untuk mengarahkan AI bertindak sebagai spesialis domain tingkat atas (misal: *Principal Blockchain Architect*, *Senior POS & Retail Inventory Architect*, *Lead Full-Stack Product Architect & AI Specialist*).
  * Membekali prompt dengan kosa kata teknis spesifik domain dan batasan otoritas yang tegas (*zero-compromise invariant matrix*).

---

### 2. Repositori GitHub untuk PRD (Product Requirements Document)

Ketika berurusan dengan AI modern, PRD tidak lagi ditulis dalam format naratif Microsoft Word yang berbelit-belit, melainkan menggunakan format **Markdown (.md) terstruktur** agar dapat dibaca dan dieksekusi secara presisi oleh agen AI (*AI-driven workflow*).

#### 🤖 [christerjohansson / ai-product-requirement-document](https://github.com/christerjohansson/ai-product-requirement-document)
* **Fokus:** Alur kerja pembuatan PRD yang digerakkan oleh AI (*AI-driven workflow*).
* **Implementasi dalam Engine:**
  * Format output PRD disusun khusus agar langsung **dapat dieksekusi oleh autonomous coding agent** seperti *Cursor*, *Claude Dev*, *Windsurf*, maupun *Antigravity*.
  * Memuat cetak biru **Agent Executable Task Breakdown Checklist (`- [ ] Task`)** yang memecah instruksi implementasi dari lapis database (RLS Supabase), middleware autentikasi, backend API, hingga komponen frontend React 19 secara runtut.

#### ⚡ [github / awesome-copilot](https://github.com/github/awesome-copilot)
* **Fokus:** Standar penulisan spesifikasi dari ekosistem resmi GitHub Copilot (khususnya skill `breakdown-feature-prd`).
* **Implementasi dalam Engine:**
  * Membedah setiap fitur menjadi **User Stories** berstandar ketat: `As a [role], I want [action], so that [benefit]`.
  * Menetapkan **Acceptance Criteria (Kriteria Penerimaan)** yang objektif, terukur, dan berbasis *Given/When/Then* atau latensi (< 500ms real-time update, 99.9% offline PWA sync).
  * Menertibkan penanganan *edge cases* dan pemetaan matriks mitigasi risiko (*Risk Mitigation Matrix*).

---

## 🎨 Arsitektur & Fitur Utama

1. **Prompt Builder (Level 9500):** Menghasilkan system prompt berdensitas tinggi dengan 7 lapis arsitektur kognitif (Role, CoT Protocol, Execution Workflow, Constraint Matrix, Few-Shot Exemplars, Output Contract, dan Self-Verification Loop).
2. **PRD Builder (AI-Executable Markdown):** Menyusun spesifikasi produk lengkap siap eksekusi dengan *Executive Vision*, *User Journey Map*, *Atomic Features*, dan *Agent Task Checklist*.
3. **Smart Visual Flow Diagram Builder:** Mengubah ide aplikasi secara dinamis menjadi diagram alur interaktif **Mermaid.js** (mendukung auto-zoom dan *domain-aware node generation* untuk Kasir POS, Web3 Crypto Wallet, SaaS, e-Commerce, dll).
4. **Smart Auto-Fill Domain Intelligence:** Tombol AI Auto-fill mendeteksi domain secara otomatis (Sembako/Retail POS, Crypto/Blockchain/Web3, Enterprise SaaS) dan mengisikan parameter optimal secara instan.
5. **Multi-AI Provider Support:** Mendukung Google Gemini 2.5 Flash/Pro, Anthropic Claude 3.5 Sonnet, OpenAI GPT-4, dan Smart Local Synthesis Engine (offline fallback).

---

## 💻 Cara Menjalankan Proyek Secara Lokal

```bash
# 1. Install dependensi
pnpm install

# 2. Jalankan unit test untuk memvalidasi engine God Mode
pnpm test:unit

# 3. Jalankan server pengembangan lokal
pnpm dev
```

Buka browser dan navigasi ke `http://localhost:5173`.