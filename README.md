# Fatlum Diamonds

Loose-diamond site for Fatlum (Munich). Next.js App Router, TypeScript, Tailwind CSS v4. German (`/de`, default) and English (`/en`). No prices and no checkout: visitors build a request list and send an inquiry.

Temporary host: `https://quantum-darkseagreen-salamander-62.hostingersite.com`

Sister sites: [Fatlum Gold](https://honeydew-seahorse-267054.hostingersite.com) and [Fatlum Jewelry](https://devoted-mintcream-goshawk-42.hostingersite.com).

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

`POST /api/request` stores the inquiry. Resend runs only when `RESEND_API_KEY` is set. Otherwise the request is stored and the response says email was skipped.

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
