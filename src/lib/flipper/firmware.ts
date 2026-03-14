/**
 * Firmware download and unpacking utilities
 * Downloads .tgz from GitHub releases and extracts for upload to Flipper
 */
import pako from "pako";

export interface FirmwareFile {
  name: string;
  path: string;
  data: Uint8Array;
  isDirectory: boolean;
}

export interface ReleaseInfo {
  tagName: string;
  name: string;
  publishedAt: string;
  downloadUrl: string;
  size: number;
}

/**
 * Fetch the latest release info from GitHub.
 * Tries /releases/latest first, then falls back to /releases list.
 */
export async function getLatestRelease(): Promise<ReleaseInfo> {
  // Try the latest endpoint first (single request, no rate limit concern)
  try {
    const res = await fetch(
      "https://api.github.com/repos/D4C1-Labs/Flipper-ARF/releases/latest",
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (res.status === 404) {
      throw new Error("REPO_NOT_FOUND");
    }
    if (res.status === 403 || res.status === 429) {
      throw new Error("RATE_LIMITED");
    }
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const release = await res.json();
    const tgzAsset = release.assets?.find((a: any) => a.name.endsWith(".tgz"));
    if (tgzAsset) {
      return {
        tagName: release.tag_name,
        name: release.name || release.tag_name,
        publishedAt: release.published_at,
        downloadUrl: tgzAsset.browser_download_url,
        size: tgzAsset.size,
      };
    }
    throw new Error("NO_TGZ_ASSET");
  } catch (err: any) {
    // Re-throw typed errors as-is
    if (["REPO_NOT_FOUND", "RATE_LIMITED", "NO_TGZ_ASSET"].includes(err.message)) {
      throw err;
    }

    // Fall back to list endpoint
    const res2 = await fetch(
      "https://api.github.com/repos/D4C1-Labs/Flipper-ARF/releases?per_page=5",
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (res2.status === 404) throw new Error("REPO_NOT_FOUND");
    if (res2.status === 403 || res2.status === 429) throw new Error("RATE_LIMITED");
    if (!res2.ok) throw new Error(`GitHub API error: ${res2.status}`);

    const releases = await res2.json();
    if (!Array.isArray(releases) || releases.length === 0) {
      throw new Error("NO_RELEASES");
    }

    for (const release of releases) {
      const tgzAsset = release.assets?.find((a: any) => a.name.endsWith(".tgz"));
      if (tgzAsset) {
        return {
          tagName: release.tag_name,
          name: release.name || release.tag_name,
          publishedAt: release.published_at,
          downloadUrl: tgzAsset.browser_download_url,
          size: tgzAsset.size,
        };
      }
    }

    throw new Error("NO_TGZ_ASSET");
  }
}

/**
 * Human-readable error message from a getLatestRelease() error code.
 */
export function releaseErrorMessage(err: any): string {
  const msg: string = err?.message ?? String(err);
  if (msg === "REPO_NOT_FOUND") return "Le dépôt GitHub n'existe pas encore ou est privé.";
  if (msg === "RATE_LIMITED") return "GitHub API rate limit reached. Try again in a few minutes.";
  if (msg === "NO_RELEASES" || msg === "NO_TGZ_ASSET") return "Aucune release .tgz publiée pour l'instant.";
  return "Could not fetch release info (offline?).";
}

/**
 * Download firmware .tgz file via the Vercel proxy to bypass GitHub CORS restrictions.
 */
export async function downloadFirmware(
  url: string,
  onProgress?: (loaded: number, total: number) => void
): Promise<ArrayBuffer> {
  // Route through our serverless proxy — GitHub releases block direct browser fetches
  const proxyUrl = `/api/firmware-proxy?url=${encodeURIComponent(url)}`;
  const res = await fetch(proxyUrl);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);

  const contentLength = res.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength) : 0;

  if (!res.body) {
    return await res.arrayBuffer();
  }

  const reader = res.body.getReader();
  const chunks: Uint8Array[] = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    if (onProgress && total) onProgress(loaded, total);
  }

  const result = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result.buffer;
}

/**
 * Simple TAR parser - extracts files from a tar archive
 */
function parseTar(buffer: Uint8Array): FirmwareFile[] {
  const files: FirmwareFile[] = [];
  let offset = 0;

  while (offset < buffer.length - 512) {
    // Read header
    const header = buffer.slice(offset, offset + 512);

    // Check for empty header (end of archive)
    if (header.every((b) => b === 0)) break;

    // Extract filename (bytes 0-99)
    let name = "";
    for (let i = 0; i < 100; i++) {
      if (header[i] === 0) break;
      name += String.fromCharCode(header[i]);
    }

    // Check for prefix (bytes 345-499, ustar format)
    let prefix = "";
    if (header[257] === 0x75 && header[258] === 0x73 && header[259] === 0x74) {
      for (let i = 345; i < 500; i++) {
        if (header[i] === 0) break;
        prefix += String.fromCharCode(header[i]);
      }
    }

    const fullName = prefix ? `${prefix}/${name}` : name;

    // Extract size (bytes 124-135, octal)
    let sizeStr = "";
    for (let i = 124; i < 136; i++) {
      if (header[i] === 0 || header[i] === 0x20) break;
      sizeStr += String.fromCharCode(header[i]);
    }
    const size = parseInt(sizeStr, 8) || 0;

    // Type flag (byte 156)
    const typeFlag = header[156];
    const isDirectory = typeFlag === 53; // '5'

    offset += 512; // Move past header

    if (fullName && !isDirectory && size > 0) {
      const data = buffer.slice(offset, offset + size);
      files.push({
        name: fullName.split("/").pop() || fullName,
        path: fullName,
        data: new Uint8Array(data),
        isDirectory: false,
      });
    } else if (isDirectory) {
      files.push({
        name: fullName,
        path: fullName,
        data: new Uint8Array(0),
        isDirectory: true,
      });
    }

    // Move to next entry (512-byte aligned)
    offset += Math.ceil(size / 512) * 512;
  }

  return files;
}

/**
 * Extract firmware files from a .tgz archive
 */
export function extractFirmware(tgzBuffer: ArrayBuffer): FirmwareFile[] {
  // Decompress gzip
  const ungzipped = pako.ungzip(new Uint8Array(tgzBuffer));

  // Parse tar
  return parseTar(ungzipped);
}

/**
 * Get the update manifest path from extracted files
 */
export function findManifest(files: FirmwareFile[]): string | null {
  const manifest = files.find(
    (f) => f.name === "update.fuf" || f.path.endsWith("/update.fuf")
  );
  return manifest?.path || null;
}
