# ichsanfachri.my.id — Portfolio + Admin Panel

Website profil Ichsan Fachri Siroj. Dibuat dengan **Next.js 15 (full stack)**, Tailwind CSS v4, PostgreSQL (Drizzle ORM), dan object storage S3-compatible.

| Host | Fungsi |
|---|---|
| `ichsanfachri.my.id` | Website publik (light/dark mode, navy & hitam) |
| `admin.ichsanfachri.my.id` | Panel admin: login, edit profil/experience/projects/skills/awards, upload foto & PDF |

Satu aplikasi melayani dua host. `src/middleware.ts` me-rewrite `admin.*` ke route `/admin/*`, dan `/admin` di domain utama selalu 404.

## Struktur singkat
```
src/app/page.tsx                 halaman publik (data dari DB)
src/app/admin/login              login admin
src/app/admin/(dash)/*           halaman CRUD (dilindungi session)
src/app/api/admin/upload         upload file → object storage + tabel media
src/db/schema.ts                 skema database
src/db/seed.ts                   akun admin + konten awal dari CV
drizzle/                         file migrasi SQL
deploy/Caddyfile.snippet         blok Caddy untuk 2 host
.github/workflows/deploy.yml     auto-deploy ke VPS saat push ke main
```

## Jalankan lokal
```bash
cp .env.example .env            # isi DATABASE_URL, AUTH_SECRET, dll.
npm install
npm run db:migrate
npm run db:seed
npm run dev
```
- Publik: http://localhost:3000
- Admin: http://admin.localhost:3000 (browser otomatis mengarahkan `*.localhost` ke 127.0.0.1)

## Deploy ke VPS

### 1. DNS (di panel domain .my.id)
| Type | Name | Value |
|---|---|---|
| A | `@` | IP VPS |
| A | `www` | IP VPS |
| A | `admin` | IP VPS |

### 2. Siapkan VPS (Ubuntu + Docker)
VPS ini dipakai bersama stack lain yang sudah menjalankan **Caddy** di port 80/443, jadi **jangan** memasang Nginx/certbot.
```bash
git clone https://github.com/IchsanFachriS/portfolio_v2.git ~/portfolio
cd ~/portfolio
cp .env.example .env && nano .env     # isi DATABASE_URL, AUTH_SECRET, S3_*, ADMIN_*
```
Database: PostgreSQL Sumopod (Transactional Pooler). Tabel dibuat di schema `portfolio`, terpisah dari tabel lain di database yang sama.

### 3. Jalankan
```bash
docker compose up -d --build
docker compose exec portfolio node scripts/migrate.js
docker compose exec portfolio node scripts/seed.js   # buat akun admin + isi konten dari CV
```
Service bernama `portfolio` dan bergabung ke jaringan `app_default` (milik Caddy). Jangan ganti namanya menjadi `app`.

### 4. Caddy (HTTPS otomatis)
Tambahkan isi `deploy/Caddyfile.snippet` ke Caddyfile yang dipakai Caddy, lalu reload tanpa downtime:
```bash
docker exec app-caddy-1 caddy validate --config /etc/caddy/Caddyfile
docker exec app-caddy-1 caddy reload --config /etc/caddy/Caddyfile
```

### 5. Object storage
1. Buat bucket, lalu buat access key yang hanya punya akses ke bucket itu.
2. Buat file bisa dibaca publik: pakai bucket policy public-read, custom domain/CDN, atau set `S3_PUBLIC_ACL=true`.
3. Isi variabel `S3_*` di `.env`. `S3_PUBLIC_URL` adalah URL dasar yang dipakai untuk menampilkan file.
4. Upload lewat server (tanpa presigned URL), jadi bucket **tidak perlu** pengaturan CORS.

### 6. Auto-deploy dari GitHub (CI/CD)
Setiap push ke `main` menjalankan `.github/workflows/deploy.yml`:
1. **check:** typecheck + lint (juga jalan di pull request).
2. **deploy:** SSH ke VPS, `git reset --hard origin/main`, `docker compose up -d --build portfolio`, migrasi database.
3. **health check:** memastikan `ichsanfachri.my.id` dan `admin.ichsanfachri.my.id/login` merespons.

Deploy hanya menyentuh service `portfolio`; stack lain di VPS tidak diubah. Jika secrets belum diisi, deploy dilewati dengan peringatan.

**Setup sekali (di laptop):**
```bash
ssh-keygen -t ed25519 -f ~/.ssh/portfolio_deploy -N "" -C "github-actions-portfolio"
ssh-copy-id -i ~/.ssh/portfolio_deploy.pub ubuntu@43.133.142.23
cat ~/.ssh/portfolio_deploy      # isi untuk secret VPS_SSH_KEY (key privat, jangan dibagikan)
```
Lalu di GitHub: **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Isi |
|---|---|
| `VPS_HOST` | `43.133.142.23` |
| `VPS_USER` | `ubuntu` |
| `VPS_SSH_KEY` | isi file `~/.ssh/portfolio_deploy` (seluruhnya, termasuk baris `BEGIN`/`END`) |
| `VPS_PORT` | opsional, default 22 |
| `VPS_APP_DIR` | opsional, default `~/portfolio` |

Sidik jari host key VPS tertanam di workflow; jika VPS di-install ulang, perbarui nilainya.

## Cara update konten
Buka `admin.ichsanfachri.my.id`, login, lalu edit. Perubahan langsung tampil di website. Foto/PDF diunggah lewat tombol **Upload** di form, atau lewat menu **Media**.

## Mengubah skema database
Edit `src/db/schema.ts`, jalankan `npm run db:generate`, lalu commit folder `drizzle/`. Migrasi akan jalan otomatis saat deploy.
