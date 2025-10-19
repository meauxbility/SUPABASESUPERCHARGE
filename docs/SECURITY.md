## Secrets Policy
- Never commit `.env` files or API keys.
- Client code must use only publishable keys. All sensitive operations go through the proxy server.
- Secret scanning is enforced (pre-commit + CI). If a secret is suspected exposed, open a Security Incident and rotate within 24h.

## Environment Handling
- Dev: `.env.local` on your machine (git-ignored).
- Staging/Prod: use platform secrets (GitHub Actions, Render, Supabase, Vercel, Cloud Run).


