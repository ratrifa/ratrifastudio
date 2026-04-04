import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const ALLOWED_IMAGE_MIME = new Set(["image/png", "image/jpeg", "image/webp"]);
const ALLOWED_DOCUMENT_MIME = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]);
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const MAX_DOCUMENT_SIZE = 5 * 1024 * 1024;

function extFromMime(mime: string) {
  if (mime === "image/png") return ".png";
  if (mime === "image/jpeg") return ".jpg";
  if (mime === "image/webp") return ".webp";
  return "";
}

function toPublicPath(folder: string, filename: string) {
  return `/uploads/${folder}/${filename}`;
}

function toAbsolutePath(publicPath: string) {
  const relative = publicPath.replace(/^\//, "");
  return path.join(process.cwd(), "public", relative.replace(/^public[\\/]/, ""));
}

export async function saveImageUpload(fileLike: FormDataEntryValue | null, folder: "projects" | "certificates" | "hero") {
  if (!(fileLike instanceof File) || fileLike.size === 0) {
    return null;
  }

  if (!ALLOWED_IMAGE_MIME.has(fileLike.type)) {
    throw new Error("Format file tidak didukung. Gunakan PNG, JPG, atau WEBP.");
  }

  if (fileLike.size > MAX_IMAGE_SIZE) {
    throw new Error("Ukuran file maksimal 2MB.");
  }

  const extension = extFromMime(fileLike.type);
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const targetDir = path.join(process.cwd(), "public", "uploads", folder);
  const absolutePath = path.join(targetDir, filename);

  await mkdir(targetDir, { recursive: true });

  const arrayBuffer = await fileLike.arrayBuffer();
  await writeFile(absolutePath, Buffer.from(arrayBuffer));

  return toPublicPath(folder, filename);
}

export async function saveDocumentUpload(fileLike: FormDataEntryValue | null, folder: "hero") {
  if (!(fileLike instanceof File) || fileLike.size === 0) {
    return null;
  }

  if (!ALLOWED_DOCUMENT_MIME.has(fileLike.type)) {
    throw new Error("Format file CV tidak didukung. Gunakan PDF, DOC, atau DOCX.");
  }

  if (fileLike.size > MAX_DOCUMENT_SIZE) {
    throw new Error("Ukuran file CV maksimal 5MB.");
  }

  const extension = fileLike.type === "application/pdf" ? ".pdf" : fileLike.type === "application/msword" ? ".doc" : ".docx";
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const targetDir = path.join(process.cwd(), "public", "uploads", folder);
  const absolutePath = path.join(targetDir, filename);

  await mkdir(targetDir, { recursive: true });

  const arrayBuffer = await fileLike.arrayBuffer();
  await writeFile(absolutePath, Buffer.from(arrayBuffer));

  return toPublicPath(folder, filename);
}

export async function deleteLocalUpload(publicPath: string | null | undefined) {
  if (!publicPath || !publicPath.startsWith("/uploads/")) {
    return;
  }

  const absolutePath = toAbsolutePath(publicPath);
  try {
    await unlink(absolutePath);
  } catch {
    // Ignore missing files; database cleanup should still proceed.
  }
}
