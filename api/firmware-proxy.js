/**
 * Vercel serverless function — proxies GitHub release downloads to bypass CORS.
 * GitHub's release URLs return a 302 redirect to their CDN, which lacks
 * Access-Control-Allow-Origin headers, blocking direct browser fetches.
 */
export default async function handler(req, res) {
  const { url } = req.query;

  // Only allow downloads from the ARF repo
  if (
    !url ||
    !url.startsWith("https://github.com/D4C1-Labs/Flipper-ARF/releases/download/")
  ) {
    return res.status(400).json({ error: "Invalid or missing URL parameter" });
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "ARF-Firmware-Updater/1.0" },
      redirect: "follow",
    });

    if (!response.ok) {
      throw new Error(`GitHub responded with ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Length", buffer.byteLength);
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("[firmware-proxy] Error:", err);
    res.status(500).json({ error: err.message });
  }
}
