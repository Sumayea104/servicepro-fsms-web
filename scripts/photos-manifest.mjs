// Scans public/photos and writes src/lib/photos.manifest.json so the UI knows which real photos exist
// (decided at build time — no filesystem access at runtime, so it also works on serverless hosts).
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.cwd(), 'public', 'photos');
const out = path.join(process.cwd(), 'src', 'lib', 'photos.manifest.json');
const manifest = {};
if (fs.existsSync(dir)) {
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^(.+)\.(jpe?g|webp|png|avif)$/i);
    if (m) manifest[m[1]] = `/photos/${f}`;
  }
}
fs.writeFileSync(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`photos manifest: ${Object.keys(manifest).length} photo(s) found`);
