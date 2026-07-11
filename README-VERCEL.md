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
