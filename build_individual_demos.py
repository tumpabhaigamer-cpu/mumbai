import html, json, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent
DATA = json.loads((ROOT / 'data' / 'leads.json').read_text(encoding='utf-8'))
LEADS = DATA['leads']
BASE = 'https://tumpabhaigamer-cpu.github.io/mumbai/'

BASE_HUE = {'interior': 29, 'bridal': 344, 'couture': 322, 'cake': 42, 'film': 164, 'local': 34}
LAYOUTS = ['folio', 'poster', 'archive', 'stack', 'grid', 'editorial', 'frame', 'panel']
MEDIA = {
    'interior': [('interior-1', 'Illustrative interior study with soft daylight and natural materials'), ('interior-2', 'Illustrative plaster and shadow material study')],
    'bridal': [('bridal-1', 'Illustrative bridal portrait under a sheer veil'), ('bridal-2', 'Illustrative makeup still life on linen')],
    'couture': [('couture-1', 'Illustrative embroidered silk textile study'), ('couture-2', 'Illustrative jewellery still life')],
    'cake': [('cake-1', 'Illustrative celebration cake in a muted palette'), ('cake-2', 'Illustrative cake detail and table still life')],
    'film': [('film-1', 'Illustrative ceremony film still'), ('film-2', 'Illustrative golden-hour rooftop film still')],
    'local': []
}

COPY = {
    'interior': ('Spaces, shaped around light.', 'A considered digital introduction to the practice, with room for real projects, material choices and the studio’s own point of view.'),
    'bridal': ('A softer way to meet the artist.', 'A calm, image-led introduction for bridal beauty. Replace the illustrative imagery and copy with the artist’s own portfolio and service details.'),
    'couture': ('A study in cloth, form and detail.', 'An editorial concept for presenting a collection or atelier. Product information, materials and availability should be supplied and confirmed by the business.'),
    'cake': ('A little room for celebration.', 'A bright, tactile concept for a cake studio. Menu, flavours, dietary information, lead times and delivery details are intentionally left for confirmation.'),
    'film': ('Stories, held in the frame.', 'A cinematic concept page for wedding and event work. The generated images and motion are placeholders, not footage or work by the business.'),
    'local': ('A clearer first hello.', 'A practical concept for an independent local business. The page structure is illustrative; services, locations, credentials and contact information must be supplied by the business.')
}

SECTIONS = {
    'interior': [('Point of view', 'A quiet editorial introduction leaves the first screen focused on the designer’s own words.'), ('Selected spaces', 'A flexible project gallery, ready for approved photographs and captions.'), ('Materials & process', 'A place to explain the studio’s approach after details are confirmed.')],
    'bridal': [('The look', 'A portrait-led opening gives the artist’s approved work the room it needs.'), ('Portfolio', 'A clean gallery designed for real client-approved images and accurate credits.'), ('Consultation', 'A simple path for enquiries, with final services and availability to be confirmed.')],
    'couture': [('The collection', 'An editorial space for approved collection photography and the designer’s own description.'), ('Details', 'A close-up gallery for craft, form and finish. Product facts remain to be supplied.'), ('Enquiries', 'A considered contact point for questions about pieces or appointments.')],
    'cake': [('The table', 'A warm visual introduction for celebration cakes and custom work.'), ('Gallery', 'A flexible layout for real cake photographs, captions and accurate dietary notes.'), ('Plan a cake', 'An enquiry path with all menu, timing and delivery information left for confirmation.')],
    'film': [('The reel', 'A cinematic stage for approved films and event stories.'), ('Still frames', 'A gallery for real, permissioned work with clear credits.'), ('Start a conversation', 'An enquiry path that can be adapted to the studio’s actual process.')],
    'local': [('What visitors need', 'A clear place for confirmed service information and practical details.'), ('How it works', 'A short explanation of the business’s real process, to be supplied.'), ('Get in touch', 'A direct path to verified contact details once approved.')]
}


def esc(value):
    return html.escape(str(value or ''), quote=True)


def image_markup(lead, i, hero=False):
    items = MEDIA[lead['category']]
    if not items:
        return '<div class="service-art" aria-label="Illustrative graphic composition"><span class="art-mark">' + esc(lead['name'][:1]) + '</span><span class="art-index">' + str(lead['id']).zfill(2) + ' / 100</span><span class="art-caption">A graphic placeholder · replace with approved photography</span></div>'
    name, alt = items[i % len(items)]
    src = '../../assets/img/' + name + '-960.jpg'
    eager = 'fetchpriority="high"' if hero else 'loading="lazy"'
    return '<img src="' + src + '" alt="' + esc(alt) + ' — illustrative, not client work" ' + eager + ' decoding="async">'


def render(lead):
    cat = lead['category']
    label = lead['categoryLabel']
    slug = lead['slug']
    name = lead['name']
    hue = (BASE_HUE[cat] + lead['id'] * 37) % 360
    layout = LAYOUTS[(lead['id'] * 7 + list(BASE_HUE).index(cat)) % len(LAYOUTS)]
    shape = ['soft', 'sharp', 'oval', 'line', 'cut'][lead['id'] % 5]
    headline, intro = COPY[cat]
    link = BASE + 'demos/' + slug + '/'
    subtitle = lead.get('subLabel') or label
    sections = SECTIONS[cat]
    second = MEDIA[cat][1][0] if MEDIA[cat] else ''
    h1_scale = 1 + (lead['id'] % 5) * 0.025
    video = ''
    if cat == 'film':
        video = '''<div class="film-stage"><div class="film-poster" role="img" aria-label="Illustrative ceremony frame"></div><video muted loop playsinline preload="none" poster="../../assets/img/cinema-poster.jpg" aria-hidden="true"><source src="../../assets/video/cinema-loop.mp4" type="video/mp4"></video><div class="film-copy"><span>AMBIENT LOOP · MUTED · ILLUSTRATIVE</span><p>Motion made for this concept, not footage of the business.</p></div></div>'''
    section_images = ''
    if MEDIA[cat]:
        section_images = '<div class="gallery">' + image_markup(lead, 0) + image_markup(lead, 1) + '</div>'
    sections_html = ''.join('<article class="service-card"><span class="n">0' + str(i + 1) + '</span><h3>' + esc(title) + '</h3><p>' + esc(copy) + '</p><small>CONCEPT SECTION · COPY TO CONFIRM</small></article>' for i, (title, copy) in enumerate(sections))
    wa_text = 'Hello! I made an independent concept website for ' + name + '. The copy and imagery are illustrative, not your official site or portfolio. Here is the preview: ' + link + ' If you would like, I can adapt it using details and images you approve.'
    safe_lead = json.dumps({'name': name, 'slug': slug, 'url': link, 'wa': 'https://wa.me/?text=' + __import__('urllib.parse').parse.quote(wa_text)}, ensure_ascii=False).replace('<', '\\u003c')
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="hsl({hue} 24% 95%)"><meta name="description" content="Independent concept demo for {esc(name)} — illustrative copy and imagery, not the official website."><meta name="robots" content="noindex"><title>{esc(name)} — independent concept demo</title><link rel="stylesheet" href="../../assets/css/independent.css"><link rel="preload" href="../../assets/fonts/fraunces-normal.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="../../assets/fonts/inter-normal.woff2" as="font" type="font/woff2" crossorigin></head>
<body class="site" data-category="{cat}" data-layout="{layout}" data-shape="{shape}" style="--hue:{hue};--scale:{h1_scale}">
<div class="disclaimer"><span>INDEPENDENT CONCEPT DEMO</span><i>•</i><span>ILLUSTRATIVE COPY AND IMAGERY</span><i>•</i><span>NOT THE CLIENT’S OFFICIAL WEBSITE</span></div>
<header class="nav"><a class="wordmark" href="../../">MUMBAI <span>STUDIO</span></a><span class="nav-note">{esc(label)} <i>·</i> Independent concept</span><a class="index-link" href="../../">All concepts <b>↗</b></a></header>
<main>
<section class="hero wrap"><div class="hero-copy"><p class="eyebrow"><span class="dot"></span> {esc(subtitle)} <i>·</i> MUMBAI · CONCEPT {str(lead['id']).zfill(2)}</p><h1>{esc(name)}</h1><p class="manifesto">{esc(headline)}</p><p class="intro">{esc(intro)}</p><div class="actions"><a class="button button-primary" href="#contact">Explore the concept <span>↓</span></a><button class="button button-quiet" data-copy>Copy this link</button></div></div><figure class="hero-visual">{image_markup(lead,0,True)}<figcaption><span>VISUAL DIRECTION {str(lead['id']).zfill(2)}</span><span>Illustrative image · not client work</span></figcaption></figure></section>
{video}
<section class="intro-band wrap"><div class="section-label"><span>01</span><span>THE DIRECTION</span></div><div class="direction-copy"><h2>{esc(sections[0][0])}, with a point of view.</h2><p>{esc(sections[0][1])} This is a design proposal; the business’s actual story and details should replace this copy.</p></div><div class="direction-mark" aria-hidden="true"><span>{str(lead['id']).zfill(2)}</span><i></i><b>{esc(label.upper())}</b></div></section>
<section class="offer wrap"><div class="section-label"><span>02</span><span>PAGE ELEMENTS</span></div><div class="offer-grid">{sections_html}</div></section>
<section class="gallery-section wrap"><div class="gallery-heading"><div class="section-label"><span>03</span><span>IMAGE DIRECTION</span></div><h2>Visuals to replace with approved work.</h2><p>All artwork shown here is generated illustration and is not connected to {esc(name)}.</p></div>{section_images if section_images else '<div class="graphic-pair"><div>Service information<br><span>To confirm with business</span></div><div>Contact details<br><span>To add when approved</span></div></div>'}</section>
<section class="contact wrap" id="contact"><div class="contact-panel"><p class="eyebrow">A FIRST DRAFT · OPEN FOR DISCUSSION</p><h2>A website that feels like {esc(name)}.</h2><p>Independent concept demo • illustrative copy and imagery • not the client’s official website.</p><div class="actions"><button class="button button-primary" data-copy>Copy this demo link <span>↗</span></button><a class="button button-quiet" href="{esc(safe_wa(wa_text))}" target="_blank" rel="noopener noreferrer">WhatsApp enquiry <span>↗</span></a></div></div></section>
</main>
<footer class="footer wrap"><span>{esc(name)} · CONCEPT {str(lead['id']).zfill(2)} / 100</span><span>All words and images are illustrative placeholders. Not affiliated with or approved by the named business.</span><a href="../../">Return to concept index ↗</a></footer>
<script>window.INDEPENDENT_DEMO={safe_lead};</script><script src="../../assets/js/independent.js" defer></script>
</body></html>'''


def safe_wa(message):
    from urllib.parse import quote
    return 'https://wa.me/?text=' + quote(message)

for lead in LEADS:
    # INSTA CARS has a separate custom 3D showroom page; keep this generator
    # from replacing that concept with the standard lead template.
    if lead['slug'] == 'insta-cars-pre-owned-cars':
        continue
    target = ROOT / 'demos' / lead['slug'] / 'index.html'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(render(lead), encoding='utf-8')

print(f'Generated {len(LEADS)} independent static demos in demos/<slug>/index.html')
