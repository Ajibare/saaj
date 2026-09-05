import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

function envFromDotenv(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    let value = trimmed.slice(eq + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    out[trimmed.slice(0, eq).trim()] = value;
  }
  return out;
}

const env = envFromDotenv(process.cwd() + "/.env");
const cloudName = env.CLOUDINARY_CLOUD_NAME;
const apiKey = env.CLOUDINARY_API_KEY;
const apiSecret = env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error("Missing Cloudinary env vars");
  process.exit(1);
}

async function main() {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const folder = "saaj";
  const params: Record<string, string> = { folder, timestamp };
  const toSign =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + apiSecret;
  const signature = createHash("sha1").update(toSign).digest("hex");

  console.log("Signing params:", params, "signature:", signature);

  // 1x1 transparent PNG
  const buffer = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );

  const form = new FormData();
  form.append("file", new Blob([buffer], { type: "image/png" }), "test-saaj.png");
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: form }
  );
  const data = await res.json();
  if (!res.ok || data.error) {
    console.error("UPLOAD FAILED", res.status, data);
    process.exit(1);
  }
  console.log("UPLOAD OK", data.secure_url, "public_id:", data.public_id);

  // Clean up: destroy the test asset
  const destroyTimestamp = String(Math.floor(Date.now() / 1000));
  const destroyParams: Record<string, string> = {
    public_id: data.public_id,
    resource_type: "image",
    timestamp: destroyTimestamp,
  };
  const destroyToSign =
    Object.keys(destroyParams)
      .sort()
      .map((k) => `${k}=${destroyParams[k]}`)
      .join("&") + apiSecret;
  const destroySignature = createHash("sha1").update(destroyToSign).digest("hex");
  const destroyForm = new URLSearchParams({
    ...destroyParams,
    api_key: apiKey,
    signature: destroySignature,
  });
  const destroyRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: "POST", body: destroyForm }
  );
  console.log("DESTROY", await destroyRes.json());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});