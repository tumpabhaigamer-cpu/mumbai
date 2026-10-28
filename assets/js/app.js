/* ==========================================================================
   Mumbai Studio Showcase — app.js
   Vanilla JS. No dependencies, no network requests.
   - directory: search, filter, sort
   - preview: ?b=<slug> renders one independent concept demo
   - copy link, WhatsApp chat picker (no recipient number), reveal motion,
     ambient loop with poster fallback + reduced-motion support
   ========================================================================== */
(function () {
  'use strict';

  var DATA = window.SHOWCASE;
  if (!DATA) return;
  var META = DATA.meta, LEADS = DATA.leads;

  var SHORT = 'Concept demo — brand details and copy for illustration; confirm before use';
  var LONG = 'Independent concept demo • illustrative copy and imagery • not the client’s official website.';
  var IMAGERY_NOTE = 'All imagery is AI-generated illustration made for layout purposes. It is not the client’s photography, not a portfolio and does not depict any real project, event or person connected to this business.';

  var SYS_COLOR = {
    interior: '#B9785A', bridal: '#C8A292', couture: '#B99A5B',
    cake: '#9FAE8C', film: '#C9A063', local: '#C58A3C'
  };
  var SYS_SUB = {
    interior: 'Aperture', bridal: 'Veil', couture: 'Loom',
    cake: 'Crumb', film: 'Frame', local: 'Ledger'
  };

  var DIMS = {
    'interior-1': [1408, 768], 'interior-2': [1408, 768],
    'bridal-1': [1408, 768], 'bridal-2': [1408, 768],
    'couture-1': [1408, 768], 'couture-2': [1408, 768],
    'cake-1': [1408, 768], 'cake-2': [1408, 768],
    'film-1': [1408, 768], 'film-2': [1584, 672]
  };
  var ALTS = {
    'interior-1': 'Illustrative AI image: sunlit living room with an arched window, cane seating and a brass floor lamp',
    'interior-2': 'Illustrative AI image: lime-plaster wall with raking afternoon light and a dried palm shadow',
    'bridal-1': 'Illustrative AI image: bridal portrait partly veiled by a sheer ivory dupatta',
    'bridal-2': 'Illustrative AI image: makeup brushes, pigments and rose petals on linen',
    'couture-1': 'Illustrative AI image: raw silk with zari and mirror-work embroidery in low light',
    'couture-2': 'Illustrative AI image: polki and pearl jewellery arranged on plum velvet',
    'cake-1': 'Illustrative AI image: sage buttercream cake on a stone pedestal in hard daylight',
    'cake-2': 'Illustrative AI image: pistachio and rose cake slice on marble with dried petals',
    'film-1': 'Illustrative AI image: hennaed hands holding a marigold garland against ceremony bokeh',
    'film-2': 'Illustrative AI image: golden-hour silhouettes on a rooftop above a hazy city'
  };

  /* ---------------- tiny helpers ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function args(fn) { return fn; }

  var ICON = {
    arrowUR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M14 6l-6 6 6 6"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M10 13a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 1 0-5.7-5.7L11.3 6"/><path d="M14 11a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 1 0 5.7 5.7l1.3-1.3"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2A9.9 9.9 0 0 0 3.6 17.1L2.05 22l5.05-1.5A9.9 9.9 0 1 0 12.04 2Zm0 1.8a8.1 8.1 0 0 1 0 16.2 8 8 0 0 1-4.1-1.12l-.3-.18-3 .89.9-2.92-.2-.31a8.1 8.1 0 0 1 6.7-12.56Zm-3.3 3.9c-.18 0-.47.07-.72.34-.25.27-.94.92-.94 2.24s.96 2.6 1.1 2.78c.13.18 1.87 2.98 4.6 4.06 2.26.9 2.72.72 3.21.67.5-.04 1.6-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.53-.32-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.35-1.6-1.51-1.87-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.61-1.47-.84-2-.22-.53-.44-.46-.61-.47h-.5Z"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 16V4m0 0L8 8m4-4 4 4"/><path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="7" y="5" width="3.4" height="14" rx="1"/><rect x="13.6" y="5" width="3.4" height="14" rx="1"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
    film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4"/></svg>'
  };

  var SUB_ICON = {
    dental: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8.5 4.2c1 0 1.6.5 2.4.5.8 0 1.4-.5 2.4-.5 2 0 3.2 1.5 3.2 3.6 0 3.3-1.4 4.6-1.9 7.2-.3 1.5-.5 4.8-1.7 4.8-1 0-.7-3.4-1.9-3.4s-1 3.4-1.9 3.4c-1.2 0-1.4-3.3-1.7-4.8-.5-2.6-1.9-3.9-1.9-7.2 0-2.1 1.2-3.6 3-3.6Z"/></svg>',
    fitness: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10"/></svg>',
    auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 15.5 5.6 10a2 2 0 0 1 1.9-1.4h9a2 2 0 0 1 1.9 1.4L20 15.5"/><rect x="3" y="15" width="18" height="4" rx="1.5"/><circle cx="7" cy="19" r="1.3"/><circle cx="17" cy="19" r="1.3"/></svg>',
    realestate: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3.5 11 12 4l8.5 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/></svg>',
    planner: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M4 10h16M9 4v4M15 4v4"/></svg>',
    decor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3c2 3 4 4.5 4 7a4 4 0 0 1-8 0c0-2.5 2-4 4-7Z"/><path d="M12 14v7"/></svg>',
    film: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 11 5-3v8l-5-3"/></svg>',
    photo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="7" width="18" height="13" rx="2"/><circle cx="12" cy="13.5" r="3.5"/><path d="M9 7l1.2-2h3.6L15 7"/></svg>'
  };

  /* ---------------- media ---------------- */
  function pic(base, sizes, eager) {
    var d = DIMS[base] || [1408, 768];
    return '<picture>' +
      '<source type="image/webp" srcset="assets/img/' + base + '-480.webp 480w, assets/img/' + base + '-960.webp 960w" sizes="' + sizes + '">' +
      '<img src="assets/img/' + base + '-960.jpg" alt="' + esc(ALTS[base] || 'Illustrative image') + '" width="' + d[0] + '" height="' + d[1] + '" ' +
      (eager ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async">' +
      '</picture>';
  }
  function figureImg(base, ratio, cap, index, sizes, eager) {
    sizes = sizes || '(min-width:900px) 44vw, 92vw';
    return '<figure>' +
      '<div class="frame ' + ratio + '">' + pic(base, sizes, eager) + '</div>' +
      '<figcaption><span class="n">' + pad(index) + '</span><span>' + esc(cap) +
      ' <span class="illus">· illustrative image</span></span></figcaption>' +
      '</figure>';
  }

  /* ---------------- disclosure blocks ---------------- */
  function ribbon() {
    return '<div class="pv-ribbon" role="note">' + ICON.info +
      '<span><b>Concept demo</b> — brand details and copy for illustration; confirm before use</span></div>';
  }
  function honestyBlock() {
    return '<section class="pv-sec" aria-labelledby="honesty-h"><div class="wrap">' +
      '<div class="pv-honesty reveal" id="honesty-h">' + ICON.info +
      '<div><p><strong>Independent concept demo • illustrative copy and imagery • not the client’s official website.</strong></p>' +
      '<p style="margin-top:.45rem">' + esc(IMAGERY_NOTE) + '</p>' +
      '<p style="margin-top:.45rem">No reviews, testimonials, prices, awards, years in business, qualifications, client work or contact details are stated anywhere in this preview. All names and sections are placeholders prepared for a design conversation and must be confirmed before any public use.</p>' +
      '</div></div></div></section>';
  }

  /* ---------------- URL + actions ---------------- */
  function baseUrl() {
    if (location.protocol === 'file:') return location.href.split('?')[0].split('#')[0];
    return location.origin + location.pathname.replace(/index\.html$/, '');
  }
  function demoUrl(lead) {
    var u = baseUrl();
    return u + '?b=' + encodeURIComponent(lead.slug);
  }
  function waText(lead) {
    return 'Sharing a concept demo prepared for ' + lead.name + ' — ' + demoUrl(lead) +
      '\n\nThis is an independent concept mock-up (illustrative copy and imagery), not an official website. Nothing in it is a claim about the business — review and confirm before use.';
  }
  function waHref(lead) { return 'https://wa.me/?text=' + encodeURIComponent(waText(lead)); }

  var toastEl, toastTimer;
  function toast(msg, ok) {
    if (!toastEl) toastEl = $('#toast');
    if (!toastEl) return;
    toastEl.innerHTML = (ok ? ICON.check : ICON.info) + '<span>' + esc(msg) + '</span>';
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2800);
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (res, rej) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px;left:0;opacity:0';
        document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, ta.value.length);
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        ok ? res() : rej(new Error('copy blocked'));
      } catch (e) { rej(e); }
    });
  }
  function copyLink(lead, btn) {
    var url = demoUrl(lead);
    copyText(url).then(function () {
      toast('Share link copied — opens this concept demo on its own', true);
      if (btn) {
        var old = btn.innerHTML;
        btn.innerHTML = ICON.check + '<span class="txt">Copied</span>';
        setTimeout(function () { btn.innerHTML = old; }, 1800);
      }
    }).catch(function () {
      window.prompt('Copy this link:', url);
    });
  }

  /* ---------------- reveal motion ---------------- */
  var io = null;
  function observeReveals(root) {
    var els = $$('.reveal, .reveal-x, .mask', root || document);
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    }
    els.forEach(function (e) {
      if (e.classList.contains('in')) return;
      // anything already in view on load reveals immediately (avoids blank first paint)
      var r = e.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) { e.classList.add('in'); return; }
      io.observe(e);
    });
  }

  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  function prefersReduced() { return reduceMQ.matches; }

  /* ---------------- ambient loop ---------------- */
  function initAmbient(scope) {
    var stage = $('.reel-stage', scope);
    if (!stage) return;
    var video = $('video', stage);
    var poster = $('.poster', stage);
    var btn = $('.ambient-note', stage);
    if (!video || !poster) return;

    if (prefersReduced()) {
      poster.classList.remove('hide');
      if (btn) { btn.hidden = false; btn.innerHTML = ICON.play + '<span>Loop off · reduced motion</span>'; btn.disabled = true; }
      video.removeAttribute('autoplay');
      return;
    }
    if (navigator.connection && navigator.connection.saveData) {
      if (btn) { btn.innerHTML = ICON.play + '<span>Loop paused · data saver</span>'; }
      return;
    }

    video.preload = 'auto';
    var started = false;
    function start() {
      if (started) return;
      var p = video.play();
      if (p && p.then) {
        p.then(function () {
          started = true;
          video.classList.add('playing');
          poster.classList.add('hide');
          if (btn) btn.innerHTML = ICON.pause + '<span>Pause ambient loop</span>';
        }).catch(function () { /* autoplay blocked — poster stays */ });
      }
    }
    start();
    // retry once the loop is closer to the viewport / on first interaction
    if (btn) {
      btn.addEventListener('click', function () {
        if (video.paused) { started = false; start(); btn.innerHTML = ICON.pause + '<span>Pause ambient loop</span>'; }
        else { video.pause(); btn.innerHTML = ICON.play + '<span>Play ambient loop</span>'; }
      });
    }
    video.addEventListener('playing', function () { video.classList.add('playing'); poster.classList.add('hide'); });
    var vis = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting && !video.paused) { video.pause(); if (btn) btn.innerHTML = ICON.play + '<span>Play ambient loop</span>'; }
      });
    }, { threshold: 0.05 });
    vis.observe(stage);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && !video.paused) { video.pause(); if (btn) btn.innerHTML = ICON.play + '<span>Play ambient loop</span>'; }
    });
  }

  /* ---------------- progress bar ---------------- */
  var progressEl = null, ticking = false;
  function onScroll() {
    if (!progressEl) return;
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var p = h > 0 ? Math.min(1, window.scrollY / h) : 0;
      progressEl.style.width = (p * 100).toFixed(2) + '%';
      ticking = false;
    });
  }

  /* ==========================================================================
     PREVIEWS
     ========================================================================== */
  var SECTION_NOTE = {
    interior: ['Statement of intent', 'Selected rooms', 'Material & light study', 'Process in three steps'],
    bridal: ['The approach', 'Bridal portrait series', 'Preparation still life', 'What to expect'],
    couture: ['The atelier note', 'Textile & embroidery', 'Object study', 'Made-to-order outline'],
    cake: ['The kitchen note', 'Cake studies', 'Flavour direction', 'Ordering outline'],
    film: ['The reel note', 'Film stills', 'Approach & pacing', 'Coverage outline'],
    local: ['What we do', 'How it works', 'Practical details', 'Common questions']
  };

  function blockList(lead) {
    return lead.blocks.map(function (b, i) {
      return '<div class="block reveal" style="--delay:' + (i * 70) + 'ms">' +
        '<h3>' + esc(b.title) + '</h3><p>' + esc(b.copy) + '</p></div>';
    }).join('');
  }

  function secHead(eyebrow, title, sub) {
    return '<div class="sec-head reveal"><p class="eyebrow">' + esc(eyebrow) + '</p>' +
      '<h2>' + title + '</h2>' + (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>';
  }

  function ctaRow(lead, cls) {
    return '<div class="pv-btnrow ' + (cls || '') + '">' +
      '<button class="btn" type="button" data-act="copy" data-slug="' + esc(lead.slug) + '">' + ICON.link + ' Copy link</button>' +
      '<a class="btn wa" href="' + esc(waHref(lead)) + '" target="_blank" rel="noopener noreferrer">' + ICON.wa + ' WhatsApp enquiry</a>' +
      '<a class="btn ghost" href="./" data-act="back">' + ICON.arrowL + ' All 100 demos</a>' +
      '</div>';
  }

  function demoBar(lead) {
    return '<div class="pv-bar">' +
      '<a class="back" href="./" data-act="back">' + ICON.arrowL + '<span>Directory</span></a>' +
      '<div class="actions">' +
      '<span class="badge">Concept demo · ' + esc(lead.system) + '</span>' +
      '<button class="iconbtn" type="button" data-act="copy" data-slug="' + esc(lead.slug) + '" aria-label="Copy share link">' + ICON.link + '<span class="txt">Copy link</span></button>' +
      '<a class="iconbtn wa" href="' + esc(waHref(lead)) + '" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp enquiry">' + ICON.wa + '<span class="txt">WhatsApp</span></a>' +
      '</div></div>';
  }

  function footerBlock(lead) {
    var url = demoUrl(lead);
    return '<footer class="pv-foot"><div class="wrap">' +
      '<div class="two-col">' +
      '<div class="reveal">' +
      '<p class="label" style="margin-bottom:.7rem">Share this concept</p>' +
      '<h2 style="font-family:var(--head);font-weight:var(--head-weight);font-size:clamp(1.5rem,1.1rem+2vw,2.3rem);line-height:1.08;letter-spacing:-.02em;margin:0 0 .7rem">' +
      'One link, opens on its own.</h2>' +
      '<p style="font-size:.88rem;color:var(--muted);max-width:44ch;line-height:1.6">Send this demo without exposing the rest of the deck. The URL carries the business slug, so it always opens this exact preview — on desktop or on a phone.</p>' +
      '<div class="sharekit">' +
      '<div class="row">' +
      '<label class="sr" for="share-url">Share link</label>' +
      '<input id="share-url" type="text" readonly value="' + esc(url) + '">' +
      '</div>' +
      '<div class="row">' +
      '<button class="btn sm" type="button" data-act="copy" data-slug="' + esc(lead.slug) + '">' + ICON.link + ' Copy link</button>' +
      '<a class="btn sm wa" href="' + esc(waHref(lead)) + '" target="_blank" rel="noopener noreferrer">' + ICON.wa + ' WhatsApp enquiry</a>' +
      (navigator.share ? '<button class="btn sm ghost" type="button" data-act="share" data-slug="' + esc(lead.slug) + '">' + ICON.share + ' Share…</button>' : '') +
      '</div></div></div>' +
      '<div class="reveal" style="--delay:90ms">' +
      '<p class="label" style="margin-bottom:.7rem">Contact</p>' +
      '<p style="font-family:var(--head);font-size:1.25rem;line-height:1.3;margin:0 0 .6rem">' + esc(lead.name) + '</p>' +
      '<p style="font-size:.84rem;color:var(--muted);line-height:1.65">Contact details are intentionally not shown in a concept demo. No phone number, address, email or social handle has been guessed or published here. The WhatsApp action opens a blank chat picker with a prefilled message so you choose the recipient yourself.</p>' +
      '</div></div>' +
      '<p class="legal"><b>' + esc(LONG) + '</b> ' + esc(SHORT) + '. This page was prepared independently as a design proposal. Business names are used only to identify the prospect; all copy, section labels and imagery are illustrative. Nothing here asserts reviews, ratings, prices, availability, qualifications, awards, years in business, client work or official affiliation.</p>' +
      '</div></footer>';
  }

  function dock(lead) {
    return '<div class="dock" aria-label="Quick actions">' +
      '<button class="btn" type="button" data-act="copy" data-slug="' + esc(lead.slug) + '">' + ICON.link + ' Copy link</button>' +
      '<a class="btn wa" href="' + esc(waHref(lead)) + '" target="_blank" rel="noopener noreferrer">' + ICON.wa + ' WhatsApp</a>' +
      '</div>';
  }

  /* ---------- hero + body per system ---------- */

  function heroAperture(lead) {
    return '<header class="pv-head"><div class="wrap">' +
      '<div class="apl-hero">' +
      '<div class="apl-name">' +
      '<div class="pv-kicker reveal"><span class="cat">' + esc(lead.categoryLabel) + '</span><span class="sep"></span>' +
      '<span class="system">' + esc(lead.system) + ' system</span><span class="sep"></span>' +
      '<span class="label">Concept ' + pad(lead.id) + ' / 100</span></div>' +
      '<h1 class="pv-name reveal" style="--delay:60ms">' + esc(lead.name) + '</h1>' +
      '<p class="pv-deck reveal" style="--delay:120ms">' + esc(lead.positioning) + '</p>' +
      '<div class="pv-meta reveal" style="--delay:180ms"><span>Mumbai</span><span>Interior design</span><span>Concept layout</span></div>' +
      ctaRow(lead) +
      '</div>' +
      '<figure class="apl-figure reveal" style="--delay:150ms">' +
      '<div class="frame r4-5">' + pic('interior-1', '(min-width:900px) 44vw, 92vw', true) + '</div>' +
      '<div class="apl-caption-card"><p class="label">Aperture 01</p><p>Illustrative light study — not a photograph of this studio’s work.</p></div>' +
      '</figure>' +
      '</div>' +
      '<div class="apl-index reveal" style="--delay:220ms">' +
      '<div><p class="k">System</p><p class="v">Aperture</p></div>' +
      '<div><p class="k">Discipline</p><p class="v">Interiors</p></div>' +
      '<div><p class="k">City</p><p class="v">Mumbai</p></div>' +
      '<div><p class="k">Status</p><p class="v">Concept draft</p></div>' +
      '</div>' +
      '</div></header>';
  }

  function bodyAperture(lead) {
    return '<section class="pv-sec"><div class="wrap">' +
      secHead('01 — Selected rooms', 'Rooms held in <em>daylight</em>', 'A proposed editorial treatment: one image leads, one supports, captions stay short. Replace with the studio’s own photography.') +
      '<div class="apl-rooms">' +
      '<div class="apl-wide reveal">' + figureImg('interior-1', 'r3-2', 'Living room study — arched light, cane, low seating.', 1, '(min-width:760px) 56vw, 92vw') + '</div>' +
      '<div class="reveal" style="--delay:90ms">' + figureImg('interior-2', 'r4-5', 'Material study — plaster, raking light, one shadow.', 2) + '</div>' +
      '<div class="reveal sticky-col" style="--delay:140ms">' +
      '<p class="label" style="margin-bottom:.6rem">Materials &amp; finishes</p>' +
      '<ul class="apl-materials">' +
      '<li><span>Lime plaster</span><span>to confirm</span></li>' +
      '<li><span>Cane &amp; teak</span><span>to confirm</span></li>' +
      '<li><span>Handloom dhurrie</span><span>to confirm</span></li>' +
      '<li><span>Aged brass</span><span>to confirm</span></li>' +
      '</ul>' +
      '<p style="font-size:.78rem;color:var(--muted);line-height:1.6;margin-top:.9rem">A text-only starting point. Nothing here is a claim about suppliers, availability or specifications.</p>' +
      '</div></div></div></section>' +
      '<section class="pv-sec"><div class="wrap">' +
      secHead('02 — Approach', 'Process, in <em>three</em> steps', 'Section copy is illustrative; final wording, timelines and scope must come from the studio.') +
      '<div class="blocks">' + blockList(lead) + '</div></div></section>';
  }

  function heroVeil(lead) {
    return '<header class="pv-head"><div class="wrap">' +
      '<div class="pv-kicker reveal"><span class="cat">' + esc(lead.categoryLabel) + '</span><span class="sep"></span>' +
      '<span class="system">' + esc(lead.system) + ' system</span><span class="sep"></span>' +
      '<span class="label">Concept ' + pad(lead.id) + ' / 100</span></div>' +
      '<h1 class="pv-name reveal" style="--delay:60ms">' + esc(lead.name) + '</h1>' +
      '<p class="pv-deck reveal" style="--delay:120ms">' + esc(lead.positioning) + '</p>' +
      '<div class="pv-meta reveal" style="--delay:170ms"><span>Mumbai</span><span>Bridal makeup</span><span>Concept layout</span></div>' +
      ctaRow(lead) +
      '<div class="veil-arch reveal" style="--delay:180ms">' +
      '<div class="frame">' + pic('bridal-1', '(min-width:900px) 560px, 92vw', true) + '</div>' +
      '</div>' +
      '<div class="veil-note reveal" style="--delay:240ms">' +
      '<p class="label">Illustrative portrait</p>' +
      '<p>“Imagery is a generated stand-in for the layout — not this artist’s work.”</p>' +
      '</div>' +
      '</div></header>';
  }

  function bodyVeil(lead) {
    return '<section class="pv-sec"><div class="wrap">' +
      secHead('01 — Portraiture', 'Window light, <em>not flash</em>', 'Two frames, generous space, captions of one line. Swap in the artist’s own images before any client sees a final version.') +
      '<div class="veil-gallery">' +
      '<div class="reveal">' + figureImg('bridal-1', 'r3-4', 'Portrait study — sheer veil, soft gold, lowered gaze.', 1) + '</div>' +
      '<div class="reveal" style="--delay:100ms"><div class="veil-double">' +
      '<div class="frame r4-5">' + pic('bridal-2', '(min-width:900px) 42vw, 92vw') + '</div></div>' +
      '<figcaption><span class="n">02</span><span>Preparation still life — palette, brushes, petals. <span class="illus">· illustrative image</span></span></figcaption>' +
      '</div></div></div></section>' +
      '<section class="pv-sec"><div class="wrap"><div class="two-col">' +
      '<div class="reveal">' + secHead('02 — The approach', 'Unhurried <em>preparation</em>', 'Placeholder sequencing written for layout only.') +
      '<ul class="veil-list">' +
      '<li><span class="n">i</span><span class="t"><b>Skin first</b>Prep-led, product-agnostic language — confirm with the artist.</span></li>' +
      '<li><span class="n">ii</span><span class="t"><b>Light-aware finish</b>Descriptive only; no claims about wear time or suitability.</span></li>' +
      '<li><span class="n">iii</span><span class="t"><b>Room for a second look</b>Wording to be confirmed before publishing.</span></li>' +
      '</ul></div>' +
      '<div class="reveal sticky-col" style="--delay:120ms">' +
      '<div class="frame r1-1" style="border:1px solid var(--pv-rule)">' + pic('bridal-2', '(min-width:820px) 44vw, 92vw') + '</div>' +
      '<p style="font-size:.78rem;color:var(--muted);line-height:1.6;margin-top:.8rem">Illustrative still life. Not a product endorsement, price list or availability statement.</p>' +
      '</div></div></div></section>' +
      '<section class="pv-sec"><div class="wrap">' +
      secHead('03 — Consultation', 'What the page <em>asks</em> for', 'One clear next step instead of a wall of options. No pricing appears in a concept demo.') +
      '<div class="blocks">' + blockList(lead) + '</div></div></section>';
  }

  function heroLoom(lead) {
    return '<header class="pv-head"><div class="wrap"><div class="loom-hero">' +
      '<div class="loom-text reveal">' +
      '<div class="pv-kicker"><span class="cat">' + esc(lead.categoryLabel) + '</span><span class="sep"></span>' +
      '<span class="system">' + esc(lead.system) + ' system</span></div>' +
      '<h1 class="pv-name">' + esc(lead.name) + '</h1>' +
      '<p class="pv-deck">' + esc(lead.positioning) + '</p>' +
      '<div class="loom-facts"><span>Mumbai</span><span>Concept ' + pad(lead.id) + '</span><span>Illustrative</span></div>' +
      ctaRow(lead) +
      '</div>' +
      '<div class="loom-plinth reveal" style="--delay:140ms">' +
      '<div class="frame r4-5">' + pic('couture-1', '(min-width:880px) 48vw, 92vw', true) + '</div>' +
      '</div></div></div></header>';
  }

  function bodyLoom(lead) {
    return '<section class="pv-sec"><div class="wrap">' +
      secHead('01 — Textile', 'The cloth sets the <em>temperature</em>', 'A full-width band for fabric and hand-work. Illustrative textile, not the studio’s stock.') +
      '<div class="loom-textile reveal">' +
      '<div class="frame r21-9">' + pic('couture-1', '(min-width:1180px) 1100px, 94vw') + '</div>' +
      '<figcaption><span class="n">01</span><span>Raw silk, zari and mirror-work detail. <span class="illus">· illustrative image</span></span></figcaption>' +
      '</div></div></section>' +
      '<section class="pv-sec"><div class="wrap">' +
      secHead('02 — Object study', 'Pieces treated as <em>objects</em>', 'Jewellery on velvet, one swatch panel, one note. No SKUs, carats, weights or prices are stated.') +
      '<div class="loom-objects reveal">' +
      '<div class="cell"><div class="frame r1-1">' + pic('couture-2', '(min-width:700px) 30vw, 92vw') + '</div>' +
      '<p class="n">Object 01</p><p>Polki &amp; pearl study on plum velvet. Illustrative.</p></div>' +
      '<div class="cell"><div class="loom-swatch" aria-hidden="true"></div>' +
      '<p class="n">Swatch 02</p><p>CSS colour and texture study — no material claim is made.</p></div>' +
      '<div class="cell" style="justify-content:center"><p class="n">Note 03</p>' +
      '<p style="font-family:var(--head);font-size:1.05rem;line-height:1.4;color:var(--fg)">A calm inventory page, written to be replaced with the atelier’s own photographed pieces.</p>' +
      '<p style="font-size:.76rem">This block is intentionally copy-led so no catalogue facts are invented.</p></div>' +
      '</div></div></section>' +
      '<section class="pv-sec"><div class="wrap"><div class="two-col">' +
      '<div class="reveal">' + secHead('03 — Made to order', 'A process, <em>outlined</em>', 'Sequencing only — timings and terms to be supplied by the atelier.') +
      '<ol class="loom-process">' +
      '<li><div class="t"><b>Conversation</b><span>Brief, references, questions — wording to be confirmed.</span></div></li>' +
      '<li><div class="t"><b>Direction</b><span>Textile, palette and silhouette — descriptive placeholder.</span></div></li>' +
      '<li><div class="t"><b>Hand-work</b><span>Illustrative process note; no timelines asserted.</span></div></li>' +
      '</ol></div>' +
      '<div class="reveal sticky-col">' + blockList(lead) + '</div></div></div></section>';
  }

  function heroCrumb(lead) {
    return '<header class="pv-head"><div class="wrap"><div class="crumb-hero">' +
      '<div class="reveal">' +
      '<div class="pv-kicker"><span class="cat">' + esc(lead.categoryLabel) + '</span><span class="sep"></span>' +
      '<span class="system">' + esc(lead.system) + ' system</span><span class="sep"></span>' +
      '<span class="label">Concept ' + pad(lead.id) + ' / 100</span></div>' +
      '<h1 class="pv-name">' + esc(lead.name) + '</h1>' +
      '<p class="pv-deck">' + esc(lead.positioning) + '</p>' +
      '<div class="pv-meta"><span>Mumbai</span><span>Custom cakes</span><span>Concept layout</span></div>' +
      '<div class="crumb-chips"><span>buttercream texture</span><span>dried florals</span><span>muted palette</span><span>single tier</span></div>' +
      ctaRow(lead) +
      '</div>' +
      '<div class="crumb-plate reveal" style="--delay:140ms">' +
      '<div class="frame"><div style="position:absolute;inset:0">' + pic('cake-1', '(min-width:860px) 44vw, 86vw', true) + '</div></div>' +
      '<div class="stamp">Illustrative<br>cake study</div>' +
      '</div>' +
      '</div></div></header>';
  }

  function bodyCrumb(lead) {
    var pal = META.categories.cake.palette;
    return '<section class="pv-sec"><div class="wrap">' +
      secHead('01 — Studies', 'Three ways to <em>look</em> at a cake', 'One styled frame, one detail, one palette. Suggested treatment only — imagery is generated.') +
      '<div class="crumb-cards">' +
      '<article class="crumb-card reveal"><div class="frame r4-3">' + pic('cake-1', '(min-width:960px) 30vw, 92vw') + '</div>' +
      '<p class="t">Styled study</p><p>Sage buttercream, single tier, hard afternoon shadow. Illustrative.</p></article>' +
      '<article class="crumb-card reveal" style="--delay:80ms"><div class="frame r4-3">' + pic('cake-2', '(min-width:960px) 30vw, 92vw') + '</div>' +
      '<p class="t">Detail study</p><p>Slice, fork, petals — a quiet flat lay. Illustrative.</p></article>' +
      '<article class="crumb-card reveal" style="--delay:160ms">' +
      '<div class="crumb-palette" aria-hidden="true">' + pal.map(function (c) { return '<i style="background:' + c[0] + '"></i>'; }).join('') + '</div>' +
      '<p class="t">Palette study</p><p>' + pal.map(function (c) { return c[1]; }).join(' · ') + '. Drawn from the system, not from the bakery.</p></article>' +
      '</div></div></section>' +
      '<section class="pv-sec"><div class="wrap"><div class="two-col">' +
      '<div class="reveal">' + secHead('02 — Kitchen note', 'Warm, <em>plain-spoken</em>', 'Tone reference rather than a claim about methods, ingredients or allergens.') +
      '<ul class="crumb-steps">' +
      '<li><span class="n">01</span><b>Enquire</b><span>Placeholder wording — to be confirmed.</span></li>' +
      '<li><span class="n">02</span><b>Design</b><span>Placeholder wording — to be confirmed.</span></li>' +
      '<li><span class="n">03</span><b>Collect</b><span>Placeholder wording — to be confirmed.</span></li>' +
      '</ul></div>' +
      '<div class="reveal sticky-col" style="--delay:100ms">' +
      '<p style="font-size:.78rem;color:var(--muted);line-height:1.6;margin-bottom:1rem">No prices, portion counts, dietary claims or delivery promises appear in this concept. Those are commercial facts that belong to the bakery.</p>' +
      '<div class="blocks">' + blockList(lead) + '</div></div>' +
      '</div></div></section>';
  }

  function heroFilm(lead) {
    return '<header class="pv-head"><div class="wrap">' +
      '<div class="pv-kicker reveal"><span class="cat">' + esc(lead.categoryLabel) + '</span><span class="sep"></span>' +
      '<span class="system">' + esc(lead.system) + ' system</span><span class="sep"></span>' +
      '<span class="label">Concept ' + pad(lead.id) + ' / 100</span></div>' +
      '<h1 class="pv-name reveal" style="font-size:clamp(2.2rem,1.5rem+4.4vw,4.4rem)">' + esc(lead.name) + '</h1>' +
      '<p class="pv-deck reveal" style="--delay:100ms;max-width:52ch">' + esc(lead.positioning) + '</p>' +
      '<div class="pv-meta reveal" style="--delay:150ms"><span>Mumbai</span><span>' + esc(lead.subLabel || 'Film & events') + '</span><span>Concept layout</span></div>' +
      '<div class="reel-stage reveal" style="--delay:180ms">' +
      '<div class="media">' +
      '<div class="poster" style="background-image:url(assets/img/cinema-poster.jpg)" role="img" aria-label="Illustrative ambient frame: warm ceremony bokeh"></div>' +
      '<video class="reel-video" muted loop playsinline preload="none" poster="assets/img/cinema-poster.jpg" aria-hidden="true" tabindex="-1">' +
      '<source src="assets/video/cinema-loop.mp4" type="video/mp4"></video>' +
      '<div class="scrim"></div>' +
      '<div class="overlay">' +
      '<p class="kicker">' + ICON.film + ' Ambient loop · muted</p>' +
      '<h2>Available light, unhurried pacing.</h2>' +
      '<p>Illustrative background motion generated for this layout — not footage of the studio’s work.</p>' +
      '</div>' +
      '<button class="ambient-note" type="button" aria-label="Toggle ambient background loop">' + ICON.pause + '<span>Pause ambient loop</span></button>' +
      '</div>' +
      '<div class="bar-bottom"><span>Poster fallback active on reduced motion &amp; slow connections</span><span class="reel-filmloop">Illustrative · 8s loop</span></div>' +
      '</div>' +
      ctaRow(lead) +
      '</div></header>';
  }

  function bodyFilm(lead) {
    return '<section class="pv-sec" style="padding-top:clamp(1.4rem,3vw,2rem)"><div class="wrap">' +
      secHead('01 — Stills', 'Frames, <em>not photographs</em>', 'Two cinematic crops with index lines. Every image here is generated illustration — no real event, couple or client is depicted.') +
      '<div class="reel-stills reveal">' +
      '<figure><div class="frame">' + pic('film-1', '(min-width:720px) 48vw, 92vw') + '</div>' +
      '<figcaption><b>Still 01</b><span>Ceremony detail · illustrative</span></figcaption></figure>' +
      '<figure><div class="frame">' + pic('film-2', '(min-width:720px) 48vw, 92vw') + '</div>' +
      '<figcaption><b>Still 02</b><span>Golden hour · illustrative</span></figcaption></figure>' +
      '</div></div></section>' +
      '<section class="pv-sec"><div class="wrap">' +
      secHead('02 — Approach', 'Documentary instinct, <em>cinematic grade</em>', 'A tone-of-voice reference for the studio’s own description of its approach.') +
      '<div class="reel-approach reveal">' +
      '<div class="cell"><p class="n">i</p><b>Observe</b><p>Copy placeholder — to be written with the studio.</p></div>' +
      '<div class="cell"><p class="n">ii</p><b>Follow the light</b><p>Copy placeholder — to be written with the studio.</p></div>' +
      '<div class="cell"><p class="n">iii</p><b>Edit slowly</b><p>Copy placeholder — to be written with the studio.</p></div>' +
      '</div></div></section>' +
      '<section class="pv-sec"><div class="wrap"><div class="two-col">' +
      '<div class="reveal">' + secHead('03 — Coverage', 'What the page <em>would say</em>', 'Section labels only. Nothing about dates, packages, crew size or turnaround is asserted.') +
      '<div class="blocks">' + blockList(lead) + '</div></div>' +
      '<div class="reveal sticky-col">' +
      '<div class="frame r16-9" style="border:1px solid var(--pv-rule)">' + pic('film-2', '(min-width:820px) 44vw, 92vw') + '</div>' +
      '<p style="font-size:.76rem;color:#8B968F;line-height:1.6;margin-top:.7rem">Illustrative still. Any real film would live behind a player — this concept deliberately shows none, so nothing is misrepresented as a portfolio.</p>' +
      '</div></div></div></section>';
  }

  var LOCAL_SERVICES = {
    dental: [
      ['Consultation enquiries', 'A calm first step block — final wording to be confirmed with the clinic.'],
      ['Treatment information', 'Space for plain-language explanations, written by the clinic.'],
      ['Clinic visits', 'Location and hours placeholders only; no address is invented.'],
      ['Aftercare guidance', 'Structure for post-visit notes. Content to be supplied.']
    ],
    fitness: [
      ['Training enquiries', 'A simple enquiry block — wording to be confirmed.'],
      ['Session information', 'Structure only; no programmes or outcomes claimed.'],
      ['Progress check-ins', 'Placeholder for how updates are shared.'],
      ['Booking', 'A single clear action; no schedule or pricing shown.']
    ],
    auto: [
      ['Detailing enquiries', 'One clear next step — wording to be confirmed.'],
      ['Vehicle assessment', 'Space for how a car is reviewed; no process invented.'],
      ['Service options', 'Menu placeholder; no packages, prices or timings asserted.'],
      ['Booking', 'Contact handling only — no number published here.']
    ],
    realestate: [
      ['Buyer enquiries', 'A quiet, low-pressure enquiry block — wording to be confirmed.'],
      ['Listing walkthroughs', 'Structure for property notes; no listings invented.'],
      ['Site visits', 'Scheduling placeholder; no locations stated.'],
      ['Advisory', 'Space for how guidance is offered; credentials deliberately omitted.']
    ]
  };
  var LOCAL_FAQ = [
    ['Is this the business’s real website?', 'No. This is an independent concept demo created to start a design conversation. It is not affiliated with, approved by, or published by the business named above.'],
    ['Where are the prices, reviews and credentials?', 'Deliberately absent. A concept demo must not invent commercial facts. Those sections would be filled only with information supplied and verified by the business.'],
    ['How do I reach them?', 'Use the WhatsApp action, which opens a blank chat picker with a prefilled message — you choose the recipient. No phone number, email or address has been guessed or published here.']
  ];

  function heroLedger(lead) {
    var sub = lead.sub || 'dental';
    var svc = LOCAL_SERVICES[sub] || LOCAL_SERVICES.dental;
    return '<header class="pv-head ledger-hero-wrap"><div class="wrap"><div class="ledger-hero">' +
      '<div class="reveal">' +
      '<div class="pv-kicker"><span class="cat">' + esc(lead.categoryLabel) + '</span><span class="sep"></span>' +
      '<span class="system">' + esc(lead.system) + ' system</span><span class="sep"></span>' +
      '<span class="label">Concept ' + pad(lead.id) + ' / 100</span></div>' +
      '<h1 class="pv-name">' + esc(lead.name) + '</h1>' +
      '<p class="pv-deck" style="font-weight:400">' + esc(lead.positioning) + '</p>' +
      '<div class="pv-meta"><span>Mumbai</span><span>' + esc(lead.subLabel || 'Local services') + '</span><span>Concept layout</span></div>' +
      ctaRow(lead) +
      '</div>' +
      '<div class="reveal" style="--delay:120ms">' +
      '<div class="ledger-art"><div class="grid-lines"></div>' +
      '<div class="mark">' + (SUB_ICON[sub] || SUB_ICON.dental) + '</div>' +
      '<div class="tagline"><span>' + esc(lead.system) + ' system</span><span>No photography · CSS &amp; SVG only</span></div>' +
      '</div>' +
      '<div class="ledger-panel" style="margin-top:1rem">' +
      '<div class="hd"><span class="t">Page summary</span><span class="pill">Concept draft</span></div>' +
      '<ul class="ledger-rows">' +
      '<li><span class="k">Services</span><span class="v tbc">to be confirmed</span></li>' +
      '<li><span class="k">Location</span><span class="v tbc">not published</span></li>' +
      '<li><span class="k">Hours</span><span class="v tbc">to be confirmed</span></li>' +
      '<li><span class="k">Pricing</span><span class="v tbc">omitted by design</span></li>' +
      '</ul></div></div>' +
      '</div></div></header>';
  }

  function bodyLedger(lead) {
    var sub = lead.sub || 'dental';
    var svc = LOCAL_SERVICES[sub] || LOCAL_SERVICES.dental;
    return '<section class="pv-sec"><div class="wrap">' +
      secHead('01 — Services', 'Sections a visitor <em>actually</em> needs', 'Labels are layout placeholders. They are not a list of what this business offers.') +
      '<ul class="ledger-services">' +
      svc.map(function (s, i) {
        return '<li class="reveal" style="--delay:' + (i * 60) + 'ms"><span class="ic">' + (SUB_ICON[sub] || SUB_ICON.dental) + '</span>' +
          '<div><span class="n">0' + (i + 1) + '</span><b>' + esc(s[0]) + '</b><p>' + esc(s[1]) + '</p></div></li>';
      }).join('') +
      '</ul>' +
      '<p style="font-size:.76rem;color:var(--muted);line-height:1.6;margin-top:.9rem;max-width:64ch">Note: no service claim, qualification, affiliation or outcome is made anywhere on this page. All four labels above are placeholders written to demonstrate structure.</p>' +
      '</div></section>' +
      '<section class="pv-sec"><div class="wrap"><div class="two-col">' +
      '<div class="reveal">' + secHead('02 — How it works', 'Three steps, <em>plainly</em> put', 'Structure only — the business writes the content.') +
      '<ul class="crumb-steps">' +
      '<li><span class="n">01</span><b>Get in touch</b><span>Placeholder — to be confirmed.</span></li>' +
      '<li><span class="n">02</span><b>Ask questions</b><span>Placeholder — to be confirmed.</span></li>' +
      '<li><span class="n">03</span><b>Book a time</b><span>Placeholder — no hours or slots stated.</span></li>' +
      '</ul></div>' +
      '<div class="reveal sticky-col" style="--delay:100ms">' +
      '<p class="label" style="margin-bottom:.6rem">03 — Common questions</p>' +
      '<div class="ledger-faq">' + LOCAL_FAQ.map(function (f) {
        return '<details><summary>' + esc(f[0]) + '</summary><p>' + esc(f[1]) + '</p></details>';
      }).join('') + '</div></div>' +
      '</div></div></section>';
  }

  /* ---------- assemble ---------- */
  var HERO = { interior: heroAperture, bridal: heroVeil, couture: heroLoom, cake: heroCrumb, film: heroFilm, local: heroLedger };
  var BODY = { interior: bodyAperture, bridal: bodyVeil, couture: bodyLoom, cake: bodyCrumb, film: bodyFilm, local: bodyLedger };

  function renderPreview(lead) {
    var cat = lead.category;
    var host = $('#preview');
    document.title = lead.name + ' — concept demo · Mumbai Studio Showcase';
    host.setAttribute('data-sys', cat);
    host.className = 'pv';
    host.innerHTML = ribbon() +
      '<div class="pv-progress" aria-hidden="true"><i></i></div>' +
      demoBar(lead) +
      HERO[cat](lead) +
      '<main>' + BODY[cat](lead) + honestyBlock() + '</main>' +
      footerBlock(lead) +
      dock(lead);
    host.hidden = false;
    $('#directory').hidden = true;
    $('.masthead').hidden = true;

    progressEl = $('.pv-progress i', host);
    window.scrollTo(0, 0);
    observeReveals(host);
    initAmbient(host);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    var h1 = $('.pv-name', host);
    if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
  }

  function showDirectory() {
    var host = $('#preview');
    host.hidden = true;
    host.innerHTML = '';
    host.removeAttribute('data-sys');
    $('#directory').hidden = false;
    $('.masthead').hidden = false;
    document.title = 'Mumbai Studio Showcase — 100 concept demos';
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    progressEl = null;
    observeReveals($('#directory'));
    window.scrollTo(0, 0);
  }

  /* ==========================================================================
     DIRECTORY
     ========================================================================== */
  var state = { q: '', cat: 'all', sort: 'index' };

  function catCount(cat) {
    return ENTRY_COUNT[cat] || 0;
  }
  var ENTRY_COUNT = {};
  LEADS.forEach(function (l) { ENTRY_COUNT[l.category] = (ENTRY_COUNT[l.category] || 0) + 1; });

  function buildChips() {
    var host = $('#chips');
    var cats = META.categories;
    var html = '<button class="chip" type="button" data-cat="all" aria-pressed="true">All <span class="c">100</span></button>';
    Object.keys(cats).forEach(function (k) {
      html += '<button class="chip" type="button" data-cat="' + k + '" aria-pressed="false">' +
        '<span class="sw" style="background:' + SYS_COLOR[k] + '"></span>' +
        esc(cats[k].label) + ' <span class="c">' + ENTRY_COUNT[k] + '</span></button>';
    });
    host.innerHTML = html;
    host.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      state.cat = b.getAttribute('data-cat');
      $$('.chip', host).forEach(function (c) {
        c.setAttribute('aria-pressed', String(c === b));
      });
      var url = new URL(location.href);
      if (state.cat === 'all') url.searchParams.delete('cat');
      else url.searchParams.set('cat', state.cat);
      url.searchParams.delete('b');
      history.replaceState(null, '', url);
      renderGrid();
    });
  }

  function matches(l) {
    if (state.cat !== 'all' && l.category !== state.cat) return false;
    if (!state.q) return true;
    var q = state.q.toLowerCase();
    var hay = (l.name + ' ' + l.categoryLabel + ' ' + l.system + ' ' + (l.subLabel || '') + ' ' + l.positioning).toLowerCase();
    return q.split(/\s+/).every(function (t) { return hay.indexOf(t) > -1; });
  }

  function sortLeads(list) {
    var l = list.slice();
    if (state.sort === 'name') l.sort(function (a, b) { return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }); });
    else if (state.sort === 'category') l.sort(function (a, b) {
      return a.category === b.category ? a.id - b.id : a.category.localeCompare(b.category);
    });
    return l;
  }

  function card(l) {
    var sys = l.system;
    return '<article class="card reveal" style="--sw:' + SYS_COLOR[l.category] + '">' +
      '<div class="top"><span class="cat"><span class="sw"></span>' + esc(l.categoryLabel) + '</span></div>' +
      '<h3><a href="?b=' + encodeURIComponent(l.slug) + '" data-act="open" data-slug="' + esc(l.slug) + '">' + esc(l.name) + '</a></h3>' +
      (l.subLabel ? '<p class="tag">' + esc(l.subLabel) + '</p>' : '') +
      '<p class="line">' + esc(l.positioning) + '</p>' +
      '<p class="go">Open concept demo ' + ICON.arrowUR + '</p>' +
      '<span class="sys">' + esc(sys) + '</span>' +
      '</article>';
  }

  function renderGrid() {
    var list = sortLeads(LEADS.filter(matches));
    var grid = $('#grid');
    if (!list.length) {
      grid.innerHTML = '<div class="empty"><h3>No match in the deck</h3>' +
        '<p>Nothing here matches “' + esc(state.q) + '”. Try a shorter word, a designer’s name, or a category like “cakes”.</p>' +
        '<button class="btn ghost" type="button" id="reset">Clear filters</button></div>';
      var r = $('#reset');
      if (r) r.addEventListener('click', resetFilters);
    } else {
      grid.innerHTML = list.map(card).join('');
    }
    var c = $('#count');
    c.innerHTML = (list.length === LEADS.length)
      ? '<b>100</b> concept demos · six design systems'
      : '<b>' + list.length + '</b> of 100 concept demos' +
      (state.cat !== 'all' ? ' · ' + esc(META.categories[state.cat].label) : '');
    observeReveals(grid);
  }

  function resetFilters() {
    state.q = ''; state.cat = 'all';
    var input = $('#q');
    input.value = '';
    $('#searchbox').classList.remove('has-value');
    $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-cat') === 'all')); });
    history.replaceState(null, '', location.pathname);
    renderGrid();
    input.focus();
  }

  function openLead(slug, push) {
    var lead = LEADS.filter(function (l) { return l.slug === slug; })[0];
    if (!lead) { showDirectory(); return; }
    if (push !== false) {
      try { history.pushState({ b: slug }, '', '?b=' + encodeURIComponent(slug)); }
      catch (e) { /* file:// */ }
    }
    renderPreview(lead);
  }

  function route() {
    var p = new URLSearchParams(location.search);
    var b = p.get('b');
    if (b) openLead(b, false);
    else {
      var cat = p.get('cat');
      if (cat && META.categories[cat]) {
        state.cat = cat;
        $$('.chip').forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-cat') === cat)); });
      }
      showDirectory();
      renderGrid();
    }
  }

  /* ---------------- global events ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var copyBtn = t.closest('[data-act="copy"]');
    if (copyBtn) {
      e.preventDefault();
      var l1 = LEADS.filter(function (l) { return l.slug === copyBtn.getAttribute('data-slug'); })[0];
      if (l1) copyLink(l1, copyBtn);
      return;
    }
    var shareBtn = t.closest('[data-act="share"]');
    if (shareBtn) {
      e.preventDefault();
      var l2 = LEADS.filter(function (l) { return l.slug === shareBtn.getAttribute('data-slug'); })[0];
      if (l2 && navigator.share) {
        navigator.share({ title: l2.name + ' — concept demo', text: LONG, url: demoUrl(l2) }).catch(function () {});
      }
      return;
    }
    var openLink = t.closest('[data-act="open"]');
    if (openLink) {
      e.preventDefault();
      openLead(openLink.getAttribute('data-slug'), true);
      return;
    }
    var back = t.closest('[data-act="back"]');
    if (back) {
      e.preventDefault();
      if (history.state && history.state.b) history.back();
      else { try { history.pushState(null, '', location.pathname); } catch (err) {} showDirectory(); }
      return;
    }
    var input = t.closest('#share-url');
    if (input) input.select();
  });

  window.addEventListener('popstate', route);

  document.addEventListener('load', function (e) {
    if (e.target && e.target.tagName === 'IMG') e.target.classList.add('loaded');
  }, true);

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== $('#q')) {
      if (!$('#directory').hidden) { e.preventDefault(); $('#q').focus(); }
    }
    if (e.key === 'Escape' && document.activeElement === $('#q')) {
      $('#q').value = ''; state.q = '';
      $('#searchbox').classList.remove('has-value');
      renderGrid();
    }
  });

  function initDirectoryEvents() {
    var input = $('#q');
    var timer;
    input.addEventListener('input', function () {
      $('#searchbox').classList.toggle('has-value', input.value.length > 0);
      clearTimeout(timer);
      timer = setTimeout(function () { state.q = input.value.trim(); renderGrid(); }, 110);
    });
    $('#clear').addEventListener('click', function () {
      input.value = ''; state.q = '';
      $('#searchbox').classList.remove('has-value');
      renderGrid(); input.focus();
    });
    $('#sort').addEventListener('change', function (e) { state.sort = e.target.value; renderGrid(); });
    $('#random').addEventListener('click', function () {
      var l = LEADS[Math.floor(Math.random() * LEADS.length)];
      openLead(l.slug, true);
    });
    $('#nav-demo').addEventListener('click', function (e) {
      e.preventDefault();
      var l = LEADS[Math.floor(Math.random() * LEADS.length)];
      openLead(l.slug, true);
    });
    $$('.masthead nav a[href^="#"]:not(#nav-demo)').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        var target = $(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth', block: 'start' }); }
      });
    });
  }

  /* ---------------- boot ---------------- */
  buildChips();
  initDirectoryEvents();
  route();
  observeReveals(document);

  window.__showcase = { LEADS: LEADS, openLead: openLead, state: state };
})();
