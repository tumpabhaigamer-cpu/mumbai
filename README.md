# Mumbai Studio Showcase

A responsive index linking to 100 separately built, standalone concept websites for the prospect names in `data/leads.json`. Each business has its own page and direct URL under `demos/<slug>/`, for example `demos/neha-c-interior-designer/`. The layouts, type, color, motion and image composition vary across pages.

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

Copy the contents of this directory into the root of the target GitHub repository, commit and push, then enable GitHub Pages for the repository’s publishing branch in the repository settings. The site is static and needs no build step. The published showcase is https://tumpabhaigamer-cpu.github.io/mumbai/. The absolute, direct link for every lead is listed in `data/client-demo-links.csv`. Each URL opens that business’s own standalone website.

GitHub Pages: https://tumpabhaigamer-cpu.github.io/mumbai/.

## Content and imagery

The lead names are provided to identify each prospect. All site copy and portfolio-style images are illustrative layout material, not client-approved content or work. Confirm all copy, services, locations, contact information, photography, and branding with each business before any production use.

