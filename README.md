# Fatlum Diamonds

Loose-diamond site for Fatlum (Munich). Next.js App Router, TypeScript, Tailwind CSS v4. German (`/de`, default) and English (`/en`). No prices and no checkout: visitors build a request list and send an inquiry.

Temporary host: `https://little-mistyrose-starling-03.hostingersite.com`

Sister sites: [Fatlum Gold](https://honeydew-seahorse-267054.hostingersite.com) and [Fatlum Jewelry](https://top-orangered-kudu-52.hostingersite.com).

## Pages

- `/[locale]` home
- `/[locale]/diamanten` search (shape, carat, colour, clarity, cut, polish, symmetry, fluorescence, laboratory, origin). Filters, sort and compare selection stay in the URL. Grid or list.
- `/[locale]/diamanten/[slug]` stone detail, original SVG, add to request list, request price
- `/[locale]/vergleich` compare up to four stones
- `/[locale]/anfrage` request list and form
- `/[locale]/wissen` and topics `4c`, `formen`, `zertifikate`, `herkunft`, `fluoreszenz`, `kaufberatung`
- `/[locale]/faq`, `/ueber-uns`, `/kontakt`
- `/[locale]/impressum`, `/datenschutz`, `/agb` (placeholders where the legal entity is still unknown)

## Data

Catalog reads `diamond_stones` from Supabase at runtime. If the URL or anon key is missing, or the query fails, the site uses `data/stones.json` (40 example stones). Every example row is marked `EXAMPLE` in `example_marker`, `sku` (`FD-EX-…`) and `cert_number` (`EXAMPLE-…`), and the UI shows an EXAMPLE badge.

Migrations (do not apply from this app; apply them yourself on project `puezkvwdjyarxwwdtikd`):

- `supabase/migrations/20261118180000_diamond_schema.sql`
- `supabase/migrations/20261118180100_diamond_seed.sql`

RLS: anonymous and authenticated users may select active stones and insert inquiries. They cannot read inquiries. Gold tables are not altered. Regenerate the seed with `npm run generate-stones`.

## Email

`POST /api/request` stores the inquiry and sends it with the Resend SDK when `RESEND_API_KEY` is set. `MAIL_FROM` defaults to `Fatlum Diamonds <info@fatlum.diamonds>` and `MAIL_TO` to `info@fatlum.diamonds`. The shop message uses the customer as reply-to. A short confirmation goes to the customer in their language. If the key is missing, nothing is thrown and the form says the enquiry is stored. A reservation is the same list, with a reservation note in the message.

## Photographs

Original studio frames, one per shape, live in `public/images/shapes/<shape>.webp` (and `.avif`). Heroes and the certificate and tweezers frames are under `public/images/heroes` and `public/images/studio`. Backgrounds are lifted to pure white. `next/image` serves AVIF where the browser accepts it, otherwise WebP. Search filters keep the line icons. A later per-stone file is `/images/products/<slug>.webp`, registered in `src/lib/images.ts`.

## Environment

See `.env.example`.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (not used by the site; server-side only, never in client code)
- `RESEND_API_KEY` (optional)
- `MAIL_FROM`, `MAIL_TO`
- `NEXT_PUBLIC_SITE_URL`

## Run

`npm install`, `npm run dev`, `npm run build`, `npm start`. Hostinger Node.js hosting: `next build` then `next start` on `PORT`. Fonts are self-hosted. Images are original SVG.
