# Gunakan image resmi Bun berbasis Linux
FROM oven/bun:1 as base
WORKDIR /usr/src/app

# Salin file package.json dan bun.lockb (jika ada)
COPY package.json bun.lockb* ./

# Install dependencies
RUN bun install --frozen-lockfile

# Salin sisa kode sumber ke dalam container
COPY . .

# Generate Typescript types atau proses lainnya jika perlu
# (Jika Anda memiliki proses build khusus, tambahkan di sini)

# Expose port yang digunakan aplikasi (misalnya 4000)
EXPOSE 4000

# Set environment variable agar Elysia/Bun berjalan dalam mode production
ENV NODE_ENV=production

# Jalankan aplikasi (index.ts)
CMD ["bun", "run", "src/index.ts"]
