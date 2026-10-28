# Mumbai Studio Showcase

A responsive directory of 100 independent concept demos for the prospect names in `data/leads.json`. Each page is selected by the `?b=<slug>` query parameter, for example `index.html?b=neha-c-interior-designer`.

## What is included

- Six visual systems for interiors, bridal makeup, couture and jewellery, cakes, wedding and event work, and local services.
- Search, category filters, sorting, individual share links, and WhatsApp chat-picker links with prefilled text. WhatsApp links intentionally contain no guessed phone number.
- Motion and responsive layouts, including reduced-motion support and an 8-second muted cinematic loop with a poster fallback.
- Self-hosted fonts and illustrative AI-generated imagery. The demo pages clearly state: “Independent concept demo • illustrative copy and imagery • not the client’s official website.”
- No researched facts or invented contact details, prices, reviews, awards, qualifications, years, or portfolio claims.

## Preview locally

From this directory, run:

```powershell
py -m http.server 8000
```

Then open `http://localhost:8000/`.

## Publish with GitHub Pages

Copy the contents of this directory into the root of the target GitHub repository, commit and push, then enable GitHub Pages for the repository’s publishing branch in the repository settings. The site is static and needs no build step. Once published, the individual links in `data/client-demo-links.csv` can be prefixed with the published site URL; each query parameter opens one lead directly.

The final public links depend on the repository owner/name and GitHub Pages URL. They are not embedded here yet.

## Content and imagery

The lead names are provided to identify each prospect. All site copy and portfolio-style images are illustrative layout material, not client-approved content or work. Confirm all copy, services, locations, contact information, photography, and branding with each business before any production use.
