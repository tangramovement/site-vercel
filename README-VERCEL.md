# Tangram on Vercel

This project hosts the public site, Decap CMS, GitHub OAuth callback, and public contact endpoint on Vercel.

## Required configuration

1. Create a GitHub OAuth App from the GitHub account that owns `tangramovement/site-vercel`.
2. Use `https://www.tangramovement.com/api/callback` as the OAuth callback URL.
3. Add the OAuth client ID and secret to Vercel using the variable names in `.env.example`.
4. Add a Resend API key, verified sender, and destination email to activate the contact form.
5. Import `tangramovement/site-vercel` into Vercel with no build command and no output directory.
6. Verify the Vercel deployment before changing the `www` DNS record in Hostinger.

## Admin behavior

`/admin/` opens Decap CMS. Editors sign in through GitHub and must have push access to `tangramovement/site-vercel`. Publishing commits `content/site.json` to `main`; Vercel then deploys that commit.

## Updating events

1. Open https://www.tangramovement.com/admin/ and choose Login with GitHub.
2. Use a GitHub account with write access to this repository. The former Netlify email/password login no longer applies.
3. Open Site Tangram, then Conteudo do site, then Agenda / Eventos.
4. Edit the PT and EN button labels. A final parenthesized status, such as `(Em breve)`, appears on its own line on mobile.
5. Leave Link do ingresso empty until tickets are available. The event remains visible without a clickable link.
6. Paste the complete HTTPS ticket URL when available. Activate/deactivate events with Evento ativo, or use Adicionar evento / Remover evento.
7. Choose Publish / Publish now. Wait for the GitHub Actions deployment to finish, then check the public site.

If authentication expires, sign out and sign in again. A GitHub permission error requires repository write access; a failed deployment must be checked in the repository Actions tab. Publishing success alone does not confirm deployment success.
