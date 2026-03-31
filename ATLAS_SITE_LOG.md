# Atlas Site — Change Log & Memory

Site: https://www.atlasupholstering.com
Repo: /Users/banaf/.openclaw/workspace/projects/atlas/
Deployed on: Vercel (project: atlas-upholstering)

---

## Credentials & Config

- **Outlook email:** atlasupholstering@outlook.com
- **Outlook app password:** stored in Vercel env as `SMTP_PASS`
- **SMTP host:** smtp-mail.outlook.com | port: 587 | STARTTLS
- **Quote form sends to:** atlasupholstering@outlook.com

---

## Change Log

### 2026-03-31
- Replaced Resend API with direct Outlook SMTP (nodemailer) for quote form
- Reason: Resend free plan restricts delivery to unverified domains; SMTP sends directly from/to atlasupholstering@outlook.com
- Files changed: `api/submit.js`, `package.json`
- Env var added to Vercel: `SMTP_PASS`
