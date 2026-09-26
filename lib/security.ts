import path from "path";

export interface FileSecurityOptions {
  maxSizeMB?: number;
  allowedExtensions?: string[];
  allowedMimeTypes?: string[];
}

export interface SecurityCheckResult {
  isValid: boolean;
  error?: string;
  detectedMime?: string;
  detectedExt?: string;
  buffer?: Buffer;
}

const DEFAULT_ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];
const DEFAULT_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

/**
 * Validasi Magic Bytes (Magic Numbers) asli dari header file binary.
 * Ini memastikan jika seseorang me-rename malware.php atau script.sh menjadi backdoor.jpg,
 * sistem akan MENOLAKNYA karena signature binary-nya bukan gambar asli.
 */
export function detectRealImageMagicBytes(buffer: Buffer): { mime: string; ext: string } | null {
  if (buffer.length < 8) return null;

  // 1. PNG Magic Numbers: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mime: "image/png", ext: ".png" };
  }

  // 2. JPEG / JPG Magic Numbers: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", ext: ".jpg" };
  }

  // 3. GIF Magic Numbers: GIF87a (47 49 46 38 37 61) atau GIF89a (47 49 46 38 39 61)
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return { mime: "image/gif", ext: ".gif" };
  }

  // 4. WEBP Magic Numbers: RIFF .... WEBP (52 49 46 46 ... 57 45 42 50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { mime: "image/webp", ext: ".webp" };
  }

  // 5. SVG Inspection (Text XML / SVG tag check & Malicious Script Scan)
  const textContent = buffer.toString("utf-8", 0, Math.min(buffer.length, 2048)).trim();
  if (textContent.includes("<svg") || textContent.includes("<?xml")) {
    // Sanitasi ekstra: Tolak jika ada tag <script> berbahaya di dalam SVG
    if (/<script/i.test(textContent) || /javascript:/i.test(textContent) || /onload=/i.test(textContent)) {
      return null; // Script terdeteksi dalam SVG!
    }
    return { mime: "image/svg+xml", ext: ".svg" };
  }

  return null;
}

/**
 * Pemeriksa Keamanan File Global Reusable untuk seluruh endpoint upload
 */
export async function validateSecureFileUpload(
  file: File,
  options: FileSecurityOptions = {}
): Promise<SecurityCheckResult> {
  const maxSizeMB = options.maxSizeMB || 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  const allowedExts = options.allowedExtensions || DEFAULT_ALLOWED_EXTENSIONS;
  const allowedMimes = options.allowedMimeTypes || DEFAULT_ALLOWED_MIME_TYPES;

  // 1. Ukuran File Check
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `Ukuran file melebihi batas ${maxSizeMB}MB (Ukuran file: ${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
    };
  }

  // 2. Ekstensi Nama File Check
  const rawExt = path.extname(file.name).toLowerCase();
  if (!allowedExts.includes(rawExt)) {
    return {
      isValid: false,
      error: `Ekstensi file '${rawExt}' tidak diizinkan. Hanya (${allowedExts.join(", ")}) yang diperbolehkan.`,
    };
  }

  // 3. Extract Binary Content
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // 4. Inspect Deep Magic Bytes (Deteksi isi asli file)
  const magicInfo = detectRealImageMagicBytes(buffer);

  if (!magicInfo || !allowedMimes.includes(magicInfo.mime)) {
    return {
      isValid: false,
      error:
        "Keamanan Terdeteksi: File yang diunggah bukan gambar asli (Magic Bytes tidak cocok atau berisi script berbahaya).",
    };
  }

  // 5. Anti Script Injection Scan (Cari pattern PHP, JS, Shell, Perl, Executables)
  const headTailBuffer = Buffer.concat([
    buffer.subarray(0, 1024),
    buffer.subarray(Math.max(0, buffer.length - 1024)),
  ]).toString("utf-8");

  const dangerousPatterns = [
    /<\?php/i,
    /<\?=/,
    /eval\s*\(/i,
    /system\s*\(/i,
    /passthru\s*\(/i,
    /exec\s*\(/i,
    /shell_exec/i,
    /base64_decode/i,
    /#!/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(headTailBuffer)) {
      return {
        isValid: false,
        error: "Bahaya Keamanan Ditolak: Terdeteksi script/potensi malware tersembunyi di dalam file!",
      };
    }
  }

  return {
    isValid: true,
    detectedMime: magicInfo.mime,
    detectedExt: magicInfo.ext,
    buffer,
  };
}
