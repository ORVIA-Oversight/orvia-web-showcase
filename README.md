# MARA ELLISON STUDIO — ORVIA Web Showcase 3

A production-style demonstration of a contemporary artist website with a working private Studio experience behind it.

## Core demonstration

- Public editorial artist website
- 22 coherent fictional artworks across Tidal, Winter Ground and After Rain
- URL-backed catalogue filters
- Individual artwork pages with enquiry, share/QR and test-only reservation demonstrations
- Mara Studio artwork management
- Add and edit artwork, including browser-local image upload
- Live price and availability changes reflected on the public website
- Enquiries created publicly appear in Studio
- Exhibition management and editable artist profile
- Mobile Portfolio Mode for available work
- 390px-first mobile Studio navigation

## Demo data and safety

This is a public ORVIA Web demonstration. Mara Ellison is fictional.

Visitor changes are isolated in browser local storage rather than a shared public database. Data expires after 12 hours and can be reset from `/demo-information`. No email, SMS or real payment is sent. The reservation flow is simulated and refuses live Stripe publishable keys.

Do not enter sensitive or confidential information.

## Local development

```bash
npm install
npm run dev
```

## Deployment

Designed for Vercel with the production demonstration domain:

`https://gallery.web.orvia.org.uk/`

The site is intentionally `noindex, nofollow`.

## ORVIA Web

**A beautiful artist website on the front. A practical business tool behind it.**
