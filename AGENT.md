# Konteks Proyek
Ini adalah proyek template "Link-in-Bio" yang di-deploy ke Vercel. 
Tujuan: Mengubah template statis menjadi dinamis dengan CMS / Admin Panel sederhana.

# Tech Stack Utama
- Framework: Next.js 15 (Wajib gunakan App Router)
- Styling: Tailwind CSS
- Database: Vercel Postgres (SQL)
- Authentication: NextAuth.js v5 (Auth.js)

# Aturan Pengembangan Wajib (Rules)
1. Selalu gunakan React Server Components (RSC) sebagai default untuk fetching data agar performa SEO optimal.
2. Wajib menggunakan "Server Actions" untuk semua mutasi data (CRUD), jangan membuat API Routes (`/api/...`) kecuali sangat terpaksa.
3. Gunakan `"use client"` HANYA pada komponen yang membutuhkan interaktivitas UI (misalnya tombol, form input, atau fitur drag-and-drop).
4. Setiap mutasi data di CMS wajib memanggil `revalidatePath('/')` agar halaman utama publik langsung ter-update.