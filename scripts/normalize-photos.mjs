/**
 * Normalise the original studio PNGs and write optimized WebP.
 * Near-neutral off-white pixels are lifted to pure white so a photo
 * sits flush on a white card. Ivory paper, metal and diamond facets stay.
 *
 *   node scripts/normalize-photos.mjs /path/to/pngs
 */
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const srcDir = process.argv[2];
if (!srcDir) {
  console.error("usage: node scripts/normalize-photos.mjs <png-directory>");
  process.exit(1);
}

const jobs = [
  ["diamond-round.png", "public/images/shapes/round.webp", 1200],
  ["diamond-princess.png", "public/images/shapes/princess.webp", 1200],
  ["diamond-cushion.png", "public/images/shapes/cushion.webp", 1200],
  ["diamond-oval.png", "public/images/shapes/oval.webp", 1200],
  ["diamond-emerald.png", "public/images/shapes/emerald.webp", 1200],
  ["diamond-pear.png", "public/images/shapes/pear.webp", 1200],
  ["diamond-marquise.png", "public/images/shapes/marquise.webp", 1200],
  ["diamond-radiant.png", "public/images/shapes/radiant.webp", 1200],
  ["diamond-asscher.png", "public/images/shapes/asscher.webp", 1200],
  ["diamond-heart.png", "public/images/shapes/heart.webp", 1200],
  ["hero-brilliant.png", "public/images/heroes/brilliant.webp", 1600],
  ["hero-loose-diamonds.png", "public/images/heroes/loose-diamonds.webp", 1600],
  ["diamond-certificate.png", "public/images/studio/certificate.webp", 1400],
  ["diamond-tweezers.png", "public/images/studio/tweezers.webp", 1400],
];

function liftToWhite(data, channels) {
  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (max - min > 5 || min < 242) continue;
    const t = (min - 242) / 13;
    const lift = t * t * (3 - 2 * t);
    data[i] = Math.round(r + (255 - r) * lift);
    data[i + 1] = Math.round(g + (255 - g) * lift);
    data[i + 2] = Math.round(b + (255 - b) * lift);
  }
  return data;
}

for (const [file, dest, width] of jobs) {
  const input = sharp(join(srcDir, file)).rotate();
  const { data, info } = await input.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  liftToWhite(data, info.channels);
  mkdirSync(dirname(dest), { recursive: true });
  const image = sharp(data, { raw: { width: info.width, height: info.height, channels: info.channels } })
    .resize({ width, withoutEnlargement: true })
    .removeAlpha();
  await image.clone().webp({ quality: 82, effort: 6, smartSubsample: true }).toFile(dest);
  const avif = dest.replace(/\.webp$/, ".avif");
  await image.clone().avif({ quality: 50, effort: 6 }).toFile(avif);
  const webpStat = (await sharp(dest).metadata());
  console.log(`${file} -> ${dest} ${webpStat.width}x${webpStat.height}`);
}
