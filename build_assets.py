import json, subprocess, pathlib, base64, io
from PIL import Image, ImageEnhance, ImageFilter
ROOT = pathlib.Path('/home/user/mumbai-showcase')
IMG = ROOT/'assets/img'
FF = subprocess.check_output(['python3','-c','import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())']).decode().strip()

SRC = {
 'interior-1': ('interior', 'Living room study, illustrative'),
 'interior-2': ('interior', 'Material and light study, illustrative'),
 'bridal-1':   ('bridal',   'Bridal beauty study, illustrative'),
 'bridal-2':   ('bridal',   'Preparation still life, illustrative'),
 'couture-1':  ('couture',  'Textile and embroidery study, illustrative'),
 'couture-2':  ('couture',  'Jewellery still life, illustrative'),
 'cake-1':     ('cake',     'Celebration cake study, illustrative'),
 'cake-2':     ('cake',     'Cake detail study, illustrative'),
 'film-1':     ('film',     'Ceremony detail frame, illustrative'),
 'film-2':     ('film',     'Golden hour frame, illustrative'),
}
WIDTHS = [480, 960, 1440]
manifest = {}

def grade(im):
    # muted, filmic, slightly desaturated + lifted blacks
    im = ImageEnhance.Color(im).enhance(0.86)
    im = ImageEnhance.Contrast(im).enhance(1.04)
    r,g,b = im.split()
    r = r.point(lambda v: min(255, int(v*1.02)))
    b = b.point(lambda v: min(255, int(v*1.05)))
    im = Image.merge('RGB',(r,g,b))
    # gentle black lift
    lut = [int(10 + v*(245/255)) for v in range(256)]
    return im.point(lut*3)

for name,(cat,alt) in SRC.items():
    src = Image.open(IMG/f'{name}.jpg').convert('RGB')
    src = grade(src)
    entry = {'category':cat,'alt':alt,'w':src.width,'h':src.height,'variants':{}}
    for w in WIDTHS:
        if w > src.width: continue
        h = round(src.height * w / src.width)
        im = src.resize((w,h), Image.LANCZOS)
        im.save(IMG/f'{name}-{w}.webp','WEBP',quality=74,method=6)
        if w == 960:
            im.save(IMG/f'{name}-{w}.jpg','JPEG',quality=76,optimize=True,progressive=True)
        entry['variants'][w] = {'webp':f'assets/img/{name}-{w}.webp'}
    # LQIP
    lq = src.resize((20, max(1,round(20*src.height/src.width))), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.4))
    buf = io.BytesIO(); lq.save(buf,'JPEG',quality=40)
    entry['lqip'] = 'data:image/jpeg;base64,'+base64.b64encode(buf.getvalue()).decode()
    manifest[name] = entry
    # remove oversized original to keep bundle small (keep 1440 webp only)
    print(name, src.size, 'ok')

# ---- the single muted looping background video (cinematic) ----
poster_src = Image.open(IMG/'film-1.jpg').convert('RGB')
pw = 1280; ph = round(poster_src.height*pw/poster_src.width)
poster = poster_src.resize((pw,ph), Image.LANCZOS)
poster.save(IMG/'cinema-poster.jpg','JPEG',quality=70,optimize=True,progressive=True)
pv = {'variants':{960:'assets/img/cinema-poster.jpg'},'lqip':manifest['film-1']['lqip'],
      'alt':'Ambient ceremony bokeh, illustrative','category':'film','w':pw,'h':ph}
manifest['cinema-poster']=pv
print('poster ok')
(ROOT/'data/manifest.json').write_text(json.dumps(manifest,indent=1))
