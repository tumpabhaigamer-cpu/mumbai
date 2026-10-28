# -*- coding: utf-8 -*-
import json, re, unicodedata, pathlib

ROOT = pathlib.Path('/home/user/mumbai-showcase')
CATS = {
 'interior': {'label':'Interior design','system':'Aperture','n':25},
 'bridal':   {'label':'Bridal makeup','system':'Veil','n':22},
 'couture':  {'label':'Couture, boutiques & jewellery','system':'Loom','n':12},
 'cake':     {'label':'Custom cakes','system':'Crumb','n':11},
 'film':     {'label':'Weddings, events & films','system':'Frame','n':15},
 'local':    {'label':'Dental, fitness, auto & real estate','system':'Ledger','n':15},
}

RAW = [
 ('interior','Neha C | Interior Designer',''),
 ('interior','The White Canvas',''),
 ('interior','RuKap Interior Design Inc.',''),
 ('interior','Tejal Mathur Design',''),
 ('interior','Richa Bahl Design Studio',''),
 ('interior','Sarjita Raiyani Interiors',''),
 ('interior','The 7th Corner Interior Design',''),
 ('interior','Studio 21 by Mahendra Jangid',''),
 ('interior','Tanuja and Associates',''),
 ('interior','A to Z Furniture & Interiors',''),
 ('interior','AB Rahman Khan Luxury Interiors',''),
 ('interior','Ar. Meenakshi Jessani',''),
 ('interior','Winsome Interior',''),
 ('interior','Imagision Studio',''),
 ('interior','Nandini N. | Interior Designer',''),
 ('interior','Dhruv Mistry Designs',''),
 ('interior','Sira Interiors',''),
 ('interior','Shreya Bhimani Designs',''),
 ('interior','Blueboxx Interior',''),
 ('interior','Limehouse Design Studio',''),
 ('interior','Earthborne by Dezign (Pallavi Goel)',''),
 ('interior','Canvasinc Architecture Interiors',''),
 ('interior','VM Design Stoorie',''),
 ('interior','Design Vault Studio',''),
 ('interior','studio29 (Sumi Sethi)',''),
 ('bridal','Ojas Rajani',''),
 ('bridal','Priyanka John Makeovers',''),
 ('bridal','Makeup by Aanchal',''),
 ('bridal','Kajol R. Paswwan',''),
 ('bridal','Farhin Shaikh (MUA)',''),
 ('bridal','Fizza Abdi Makeup Artist',''),
 ('bridal','Bianca Louzado Makeup',''),
 ('bridal','Tejaswini Shetty',''),
 ('bridal','Makeup By Nandini Advani',''),
 ('bridal','Naina Tahilramani',''),
 ('bridal','Mita Vaswani',''),
 ('bridal','Sonam Vaghani',''),
 ('bridal','Supriya Shah Bridal Makeover',''),
 ('bridal','Minal Patel Makeover',''),
 ('bridal','Makeup by Khushboo Wadhwani',''),
 ('bridal','HK Makeovers And Academy',''),
 ('bridal','Jacinta Desouza Makeup Artist',''),
 ('bridal','Viva Salon & Makeup Academy',''),
 ('bridal','Yashika Panchal Bridal MUA',''),
 ('bridal','Glamyouupnow by Archana Harjani',''),
 ('bridal','Kareizma Makeup and Hair',''),
 ('bridal','Blush By Alisha Studio & Academy',''),
 ('couture','Jadau Jewellery by Falguni Mehta',''),
 ('couture','Pagli Fashion Studio',''),
 ('couture','Kazbee Boutique',''),
 ('couture','Akashi Designer Studio',''),
 ('couture','Rajgharana Ethnic Studio',''),
 ('couture','Shivam Srivastava Designer',''),
 ('couture','Eves24 Bridal Jewellery',''),
 ('couture','Jiya By Veer Design Studio',''),
 ('couture','Asbaab by Madiha Farooq',''),
 ('couture','Nyfi by Varsha',''),
 ('couture','Sandhya Shah Designer Store',''),
 ('couture','Insta Fashion Mumbai',''),
 ('cake','Bakeology by Dr. Kasturi',''),
 ('cake','Baking Blunders',''),
 ('cake','Fama’s Cart',''),
 ('cake','Baked By Ree',''),
 ('cake','Whimsical Baker',''),
 ('cake','The Chef Patissier',''),
 ('cake','Time For Cake Studio',''),
 ('cake','Degree Celsius Cake Studio',''),
 ('cake','Cake House by Rhea',''),
 ('cake','The Cake Saga (Prameet)',''),
 ('cake','Meraki Cake Studio (Meghana)',''),
 ('film','Two Fat Ladies Wedding Planners','planner'),
 ('film','Classique Events','planner'),
 ('film','Once Upon A Time Weddings','planner'),
 ('film','Weddings by Evensia','planner'),
 ('film','Panaash Entertainment','planner'),
 ('film','Trunnk In Love','planner'),
 ('film','Hitchkey Weddings','planner'),
 ('film','The Wedding Mantra','planner'),
 ('film','Neha Decorators & Tanisha Events','decor'),
 ('film','Arika Event Design','decor'),
 ('film','SonuArts WeddingStudio','decor'),
 ('film','Aboutday Wedding Films','film'),
 ('film','Meet Patel Photography','photo'),
 ('film','PS Films & Entertainment Studio','film'),
 ('film','Filming B Productions','film'),
 ('local','Bombay Dental Centre','dental'),
 ('local','Smile Couture Dental Clinic','dental'),
 ('local','Dr Rashmi Pashine’s The Smile Project','dental'),
 ('local','Dentfix Clinic','dental'),
 ('local','Dr. Shreya Shah’s Assured Dental Care','dental'),
 ('local','White Atelier Dental Clinic','dental'),
 ('local','KÝND Dental','dental'),
 ('local','Smilora Dental (Dr. Binal Shah)','dental'),
 ('local','Sobo Smiles Implant Centre','dental'),
 ('local','Neha Agarwalla (Personal Training)','fitness'),
 ('local','Prime Shine Detailing Studio','auto'),
 ('local','Car ’O’ Shine Premium Detailing','auto'),
 ('local','N1 Car Detailing Studio','auto'),
 ('local','INSTA CARS (Pre-Owned Cars)','auto'),
 ('local','Ravi Kewalramani (Luxury Realtor)','realestate'),
]

SUBS = {'dental':'Dental','fitness':'Fitness','auto':'Auto care','realestate':'Real estate',
        'planner':'Planning','decor':'Decor & design','film':'Film','photo':'Photography'}

def slugify(s):
    s = s.replace('’',"'").replace('Ý','Y')
    s = unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode()
    s = s.lower()
    s = re.sub(r"[’'\"&|.(),]", ' ', s)
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return re.sub(r'-{2,}','-',s)

# ---- conceptual (non-factual) copy banks -------------------------------------
POSITION = {
 'interior': [
  'Light-led rooms, quiet materials, long shadows.',
  'A proposed direction: bone plaster, cane and morning light.',
  'Concept: fewer objects, softer edges, better light.',
  'An editorial take on calm, material-first living.',
 ],
 'bridal': [
  'Close, unhurried, skin-first bridal beauty.',
  'A proposed direction: dew, warmth and soft gold.',
  'Concept: portraits made in window light, not flash.',
  'Restraint over glitter — a quiet bridal language.',
 ],
 'couture': [
  'Textile first: hand, weight and fall of the cloth.',
  'A proposed direction: zari, shadow and deep plum.',
  'Concept: heirloom pieces photographed like objects of study.',
  'Slow craft, close detail, museum-quiet layouts.',
 ],
 'cake': [
  'Sculptural cakes, muted palettes, clean shadows.',
  'A proposed direction: buttercream texture, dried florals, no noise.',
  'Concept: dessert as still life, photographed in daylight.',
  'Small batches, restrained flavour cues, no colour overload.',
 ],
 'film': [
  'Available light, long lenses, honest pacing.',
  'A proposed direction: golden hour, teal shadows, no rush.',
  'Concept: a film that feels remembered, not performed.',
  'Documentary instinct, cinematic grade, quiet edit.',
 ],
 'local': [
  'Clear, trustworthy, no-nonsense local presence.',
  'A proposed direction: plain language, strong hierarchy.',
  'Concept: practical clarity over decoration.',
  'Trust built through structure, not adjectives.',
 ],
}

SECTIONS = {
 'interior': ['Statement of intent','Selected rooms','Material & light study','Process in three steps','Studio contact'],
 'bridal':   ['The approach','Bridal portrait series','Preparation still life','What to expect','Consultation request'],
 'couture':  ['The atelier note','Textile & embroidery','Object study','Made-to-order outline','Appointment request'],
 'cake':     ['The kitchen note','Cake studies','Flavour direction','Ordering outline','Enquiry'],
 'film':     ['The reel note','Film stills','Approach & pacing','Coverage outline','Check availability'],
 'local':    ['What we do','How it works','Practical details','Common questions','Get in touch'],
}
BLOCKS = {
 'interior': [
  ('Hero statement','Two lines of positioned copy — tone: quiet, confident, diurnal.'),
  ('Room captions','Short one-line notes under each illustrative room image.'),
  ('Materials list','A text-only list of finishes and materials to be confirmed.'),
  ('Process','Three-step outline: brief, design, on-site — wording to be confirmed.'),
 ],
 'bridal': [
  ('Hero statement','Two lines of positioned copy — tone: intimate, unhurried.'),
  ('Portrait captions','One-line notes, first-person, no claims.'),
  ('Approach blocks','Skin prep, light, longevity — wording to be confirmed.'),
  ('Consultation','A single clear next step, no pricing placed in the demo.'),
 ],
 'couture': [
  ('Hero statement','Two lines of positioned copy — tone: restrained, tactile.'),
  ('Textile captions','One-line notes on fabric and hand-work to be confirmed.'),
  ('Object notes','Jewellery shown as study objects, not catalogue SKUs.'),
  ('Atelier process','Made-to-order outline — wording to be confirmed.'),
 ],
 'cake': [
  ('Hero statement','Two lines of positioned copy — tone: warm, matter-of-fact.'),
  ('Cake captions','One-line notes on palette and finish to be confirmed.'),
  ('Flavour direction','Text-only flavour cues, no prices.'),
  ('Ordering','An outline of how enquiries are handled, to be confirmed.'),
 ],
 'film': [
  ('Hero statement','Two lines of positioned copy — tone: cinematic, understated.'),
  ('Film still captions','One-line notes on light and pacing.'),
  ('Approach','Coverage outline and edit philosophy — wording to be confirmed.'),
  ('Availability','A single calm call to action, no dates implied.'),
 ],
 'local': [
  ('Hero statement','Two lines of positioned copy — tone: plain, useful.'),
  ('Service cards','Short, scannable blocks — final wording to be confirmed.'),
  ('Practical details','Placeholder rows for location and hours; nothing invented here.'),
  ('Contact','One clear next step; no number or address fabricated.'),
 ],
}

PALETTE = {
 'interior': [('#F6F1E7','Bone'),('#DED5C4','Oat'),('#8E9B86','Sage'),('#B9785A','Terracotta'),('#1C1A17','Ink')],
 'bridal':   [('#FBF3EC','Ivory'),('#EBD3C6','Blush'),('#C8A292','Rose clay'),('#B08A4F','Antique gold'),('#2A211F','Cocoa')],
 'couture':  [('#1B1418','Aubergine'),('#3B2230','Plum'),('#E7DCC6','Raw silk'),('#B99A5B','Zari'),('#F4EDE2','Ivory')],
 'cake':     [('#FBF6EE','Cream'),('#EFE1CE','Almond'),('#C7A98B','Honey'),('#9FAE8C','Pistachio'),('#8A5A44','Cocoa')],
 'film':     [('#0E1211','Reel black'),('#1F2B29','Teal shadow'),('#C9A063','Amber'),('#E8E0D3','Highlight'),('#6E7B76','Slate')],
 'local':    [('#F4F3EF','Chalk'),('#E4E2D8','Paper'),('#1E2A38','Ink blue'),('#C58A3C','Ochre'),('#7C8B7A','Field')],
}
TYPENOTE = {
 'interior': 'Fraunces 300 at large sizes, tracked-out Inter small caps for labels.',
 'bridal':   'Instrument Serif italic for names and headlines; Inter 300 for body.',
 'couture':  'Fraunces 400 with generous leading, letterspaced sans labels, hairline gold rules.',
 'cake':     'Fraunces 500 soft headlines, rounded rhythm, warm neutrals.',
 'film':     'Instrument Serif for titles, compressed sans captions, letterboxed composition.',
 'local':    'Inter 600 headlines with tabular numerals and a single ochre accent.',
}
MOTION = {
 'interior': 'Very slow image scale (20s) and line-by-line text reveals on scroll.',
 'bridal':   'Soft radial glow drift and 700ms fade-and-rise reveals.',
 'couture':  'Gold hairline rules drawing in, plinth-style image mask reveals.',
 'cake':     'Gentle float on cards and staggered caption reveals.',
 'film':     'Muted looping background video with poster fallback, plus a frame-line reveal.',
 'local':    'Snap-in blocks, no photography, 120ms micro-transitions.',
}
IMGS = {
 'interior':('interior-1','interior-2'), 'bridal':('bridal-1','bridal-2'),
 'couture':('couture-1','couture-2'), 'cake':('cake-1','cake-2'), 'film':('film-1','film-2'),
}

leads, seen = [], set()
for i,(cat,name,sub) in enumerate(RAW, start=1):
    s = slugify(name)
    base, k = s, 2
    while s in seen:
        s = f'{base}-{k}'; k += 1
    seen.add(s)
    leads.append({
      'id': i, 'slug': s, 'name': name, 'category': cat,
      'categoryLabel': CATS[cat]['label'], 'system': CATS[cat]['system'],
      'sub': sub, 'subLabel': SUBS.get(sub,''),
      'positioning': POSITION[cat][(i-1) % len(POSITION[cat])],
      'sections': SECTIONS[cat], 'blocks': [{'title':a,'copy':b} for a,b in BLOCKS[cat]],
      'images': list(IMGS[cat]) if cat in IMGS else [],
      'demo': f'index.html?b={s}',
    })

assert len(leads)==100, len(leads)
assert len(set(l['slug'] for l in leads))==100
for c,v in CATS.items():
    got = sum(1 for l in leads if l['category']==c)
    assert got==v['n'], (c,got,v['n'])

meta = {c: {'label':v['label'], 'system':v['system'], 'count':v['n'],
            'palette':PALETTE[c], 'typography':TYPENOTE[c], 'motion':MOTION[c],
            'sections':SECTIONS[c], 'blocks':[{'title':a,'copy':b} for a,b in BLOCKS[c]]}
        for c,v in CATS.items()}

out = {
 'meta': {
   'title':'Mumbai Studio Showcase',
   'city':'Mumbai',
   'count':len(leads),
   'disclaimer':'Concept demo — brand details and copy for illustration; confirm before use',
   'disclaimerLong':'Independent concept demo • illustrative copy and imagery • not the client’s official website.',
   'imageryNote':'Illustrative sample imagery generated for layout purposes. Not client work, not a portfolio, no real project is depicted.',
   'categories': meta,
 },
 'leads': leads,
}
(ROOT/'data').mkdir(exist_ok=True)
(ROOT/'data/leads.json').write_text(json.dumps(out, ensure_ascii=False, indent=1), encoding='utf-8')
(ROOT/'assets/js/data.js').write_text(
  "/* Mumbai Studio Showcase — lead dataset (generated from data/leads.json).\n"
  "   Names are the real prospect names supplied for this outreach concept.\n"
  "   All descriptive copy is illustrative/conceptual. No verified facts, reviews,\n"
  "   prices, credentials or contact details are asserted. */\n"
  "window.SHOWCASE = " + json.dumps(out, ensure_ascii=False, separators=(',',':')) + ";\n", encoding='utf-8')
print('leads:', len(leads))
for c in CATS: print(' ', c, sum(1 for l in leads if l['category']==c))
print('sample slugs:', [l['slug'] for l in leads[:3]], leads[-1]['slug'])
print('json KB', round((ROOT/'data/leads.json').stat().st_size/1024,1))
