# Pamet — Discord Bot Hub (Vercel + Supabase + Freenom)

## What you need
- GitHub account (repo)
- Vercel account (free)
- Supabase account (free)
- Top.gg API token (create on top.gg)
- Optional: Freenom account for free domain (pamet.tk)

## Steps (short)
1. Create GitHub repo `pamet` and push all files in this repo.
2. Create Supabase project:
   - Create table `uploads` (id, name, prefix, desc, tags, avatar, banner, invite, commands, created_at).
   - Get `SUPABASE_URL` and `SUPABASE_KEY` (service role) — keep secret.
3. In Vercel:
   - Import GitHub repo and Deploy.
   - Set these Environment Variables in Vercel project settings:
     - `TOPGG_TOKEN` = (your top.gg API token)
     - `SUPABASE_URL` = (from Supabase)
     - `SUPABASE_KEY` = (from Supabase)
     - `ADMIN_SECRET` = (optional secret string to protect uploads)
   - Deploy.
4. Visit `https://<your-vercel-project>.vercel.app` → site live.
5. (Optional) Freenom: register `pamet.tk` and point DNS (CNAME / A) to Vercel per Vercel docs → attach domain in Vercel.

## How the site works
- Frontend calls `/api/bots?limit=100&offset=0` on Vercel; server uses `TOPGG_TOKEN` to query top.gg and returns JSON.
- Frontend also GETs `/api/uploads` to show user-submitted bots (persisted in Supabase).
- Upload form POSTs to `/api/uploads` (server writes to Supabase).
- To fetch many bots (2k), frontend calls multiple pages (e.g., offset 0..1900 step 100) — client can trigger reload to fetch more.

## Notes & warnings
- **Never** commit secrets to GitHub. Use Vercel env vars.
- Top.gg rate-limits; avoid hammering. Use server-side caching or scheduled fetch if you need full 2k regularly.
- Supabase `service_role` key is powerful; keep it secret.

