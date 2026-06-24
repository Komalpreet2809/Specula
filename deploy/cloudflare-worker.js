// ══════════════════════════════════════════════════════════════
// Specula — Cloudflare Worker reverse proxy
// ══════════════════════════════════════════════════════════════
// Serves the Hugging Face Space (komalsohal-specula.hf.space) under
// the custom domain specula.komalpreet.me.
//
// Why this exists:
//   HF Spaces routes by Host header and only accepts requests whose
//   Host is "<owner>-<space>.hf.space". A plain CNAME from the custom
//   domain returns 404. This Worker forwards each request to the Space
//   with the correct Host, so the branded domain keeps working —
//   including the /api/* POST endpoints — for free.
//
// Deploy:
//   1. Cloudflare → DNS: remove the old `specula` CNAME (-> onrender.com).
//   2. Cloudflare → Workers & Pages → Create Worker → paste this → Deploy.
//   3. Worker → Settings → Domains & Routes → Add Custom Domain:
//        specula.komalpreet.me   (auto-creates DNS record + TLS cert)
// ══════════════════════════════════════════════════════════════

const TARGET_HOST = "komalsohal-specula.hf.space";

export default {
  async fetch(request) {
    const url = new URL(request.url);
    url.hostname = TARGET_HOST;
    url.protocol = "https:";
    url.port = "";

    // new Request copies method, headers, and body; Cloudflare derives
    // the outgoing Host header from the rewritten URL hostname.
    return fetch(new Request(url, request));
  },
};
