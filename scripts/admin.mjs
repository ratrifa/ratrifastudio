import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { createInterface } from "readline";

const prisma = new PrismaClient();

const rl = createInterface({ input: process.stdin, output: process.stdout });

const ask = (question, hidden = false) =>
  new Promise((resolve) => {
    if (hidden) {
      process.stdout.write(question);
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      let input = "";
      process.stdin.on("data", function handler(ch) {
        if (ch === "\n" || ch === "\r" || ch === "") {
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener("data", handler);
          process.stdout.write("\n");
          resolve(input);
        } else if (ch === "") {
          if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(question + "*".repeat(input.length));
          }
        } else {
          input += ch;
          process.stdout.write("*");
        }
      });
    } else {
      rl.question(question, resolve);
    }
  });

const line = () => console.log("─".repeat(40));

async function menuUtama() {
  console.clear();
  line();
  console.log("  ADMIN MANAGER");
  line();
  console.log("  1. Buat / Update akun admin");
  console.log("  2. Reset password admin");
  console.log("  3. Lihat semua akun admin");
  console.log("  4. Hapus akun admin");
  console.log("  0. Keluar");
  line();
  const pilihan = await ask("Pilih menu: ");
  return pilihan.trim();
}

async function buatAdmin() {
  console.log("\n[ Buat / Update Admin ]\n");
  const name = await ask("Nama: ");
  const email = await ask("Email: ");
  const password = await ask("Password: ", true);

  if (!name || !email || !password) {
    console.log("\nSemua field wajib diisi.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { name, password: passwordHash, role: "ADMIN" },
    create: { name, email, password: passwordHash, role: "ADMIN" },
  });

  console.log(`\nBerhasil! Admin: ${admin.email} (${admin.name})`);
}

async function resetPassword() {
  console.log("\n[ Reset Password Admin ]\n");

  const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
  if (admins.length === 0) {
    console.log("Belum ada akun admin.");
    return;
  }

  admins.forEach((a, i) => console.log(`  ${i + 1}. ${a.email} (${a.name})`));
  const pilihan = await ask("\nPilih nomor admin: ");
  const idx = parseInt(pilihan) - 1;

  if (isNaN(idx) || !admins[idx]) {
    console.log("Pilihan tidak valid.");
    return;
  }

  const passwordBaru = await ask("Password baru: ", true);
  const konfirmasi = await ask("Konfirmasi password: ", true);

  if (passwordBaru !== konfirmasi) {
    console.log("\nPassword tidak cocok.");
    return;
  }

  const passwordHash = await bcrypt.hash(passwordBaru, 12);
  await prisma.user.update({
    where: { id: admins[idx].id },
    data: { password: passwordHash },
  });

  await prisma.adminSession.deleteMany({ where: { userId: admins[idx].id } });

  console.log(`\nPassword berhasil direset. Semua sesi ${admins[idx].email} telah diakhiri.`);
}

async function lihatAdmin() {
  console.log("\n[ Daftar Akun Admin ]\n");

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    include: { _count: { select: { sessions: true } } },
  });

  if (admins.length === 0) {
    console.log("Belum ada akun admin.");
    return;
  }

  admins.forEach((a, i) => {
    console.log(`  ${i + 1}. ${a.name}`);
    console.log(`     Email   : ${a.email}`);
    console.log(`     Sesi aktif: ${a._count.sessions}`);
    console.log(`     Update  : ${a.updatedAt.toLocaleString("id-ID")}`);
    console.log();
  });
}

async function hapusAdmin() {
  console.log("\n[ Hapus Akun Admin ]\n");

  const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
  if (admins.length === 0) {
    console.log("Belum ada akun admin.");
    return;
  }

  admins.forEach((a, i) => console.log(`  ${i + 1}. ${a.email} (${a.name})`));
  const pilihan = await ask("\nPilih nomor admin yang akan dihapus: ");
  const idx = parseInt(pilihan) - 1;

  if (isNaN(idx) || !admins[idx]) {
    console.log("Pilihan tidak valid.");
    return;
  }

  const konfirmasi = await ask(`Yakin hapus ${admins[idx].email}? (ketik "ya" untuk konfirmasi): `);
  if (konfirmasi.trim().toLowerCase() !== "ya") {
    console.log("Dibatalkan.");
    return;
  }

  await prisma.user.delete({ where: { id: admins[idx].id } });
  console.log(`\nAkun ${admins[idx].email} berhasil dihapus.`);
}

async function main() {
  while (true) {
    const pilihan = await menuUtama();
    switch (pilihan) {
      case "1":
        await buatAdmin();
        break;
      case "2":
        await resetPassword();
        break;
      case "3":
        await lihatAdmin();
        break;
      case "4":
        await hapusAdmin();
        break;
      case "0":
        console.log("\nSampai jumpa!");
        rl.close();
        await prisma.$disconnect();
        process.exit(0);
      default:
        console.log("\nPilihan tidak valid.");
    }
    await ask("\nTekan Enter untuk kembali ke menu...");
  }
}

main().catch(async (err) => {
  console.error(err);
  rl.close();
  await prisma.$disconnect();
  process.exit(1);
});
