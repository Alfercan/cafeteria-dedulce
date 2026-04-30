/* ============================================================
   Granada De Dulce — Scroll Animations + Video Scrub
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────
   LOADER
────────────────────────────────────────────── */
function initLoader() {
  const loader = document.getElementById('loader');

  setTimeout(() => {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete() {
        loader.style.display = 'none';
        document.body.classList.remove('loading');
        animateHeroIn();
      }
    });
  }, 1800);
}

/* ──────────────────────────────────────────────
   HERO ENTRANCE
────────────────────────────────────────────── */
function animateHeroIn() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-location', { opacity: 1, y: 0, duration: 0.9 })
    .to('.hero-line',      { opacity: 1, y: 0, duration: 1, stagger: 0.14 }, '-=0.5')
    .to('.hero-sub',       { opacity: 1, y: 0, duration: 0.9 }, '-=0.6')
    .to('.hero-btn',       { opacity: 1, y: 0, duration: 0.8 }, '-=0.6');
}

/* ──────────────────────────────────────────────
   NAVBAR
────────────────────────────────────────────── */
function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const burger  = document.getElementById('burger');
  const navMenu = document.getElementById('nav-links');

  ScrollTrigger.create({
    start: 'top -60',
    onUpdate(self) {
      navbar.classList.toggle('scrolled', self.scroll() > 60);
    }
  });

  burger.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ──────────────────────────────────────────────
   VIDEO SCRUB (Apple-style hero)
   Coloca assets/hero.mp4 y el efecto se activa
   automáticamente: la sección queda anclada y el
   vídeo avanza fotograma a fotograma con el scroll.
────────────────────────────────────────────── */
function initVideoScrub() {
  const canvas   = document.getElementById('hero-canvas');
  const fallback = document.getElementById('hero-fallback');
  const ctx      = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  const video = document.createElement('video');
  video.muted      = true;
  video.playsInline = true;
  video.preload    = 'auto';

  let ready = false;

  video.addEventListener('loadedmetadata', () => {
    resize();
    fallback.style.display = 'none';
    canvas.style.display   = 'block';
    ready = true;
    video.currentTime = 0;

    /* Pin hero + avanzar vídeo con scroll */
    ScrollTrigger.create({
      trigger : '#hero',
      start   : 'top top',
      end     : '+=250%',
      pin     : true,
      scrub   : 1.2,
      onUpdate(self) {
        if (video.duration) {
          const t = self.progress * video.duration;
          if (Math.abs(video.currentTime - t) > 0.033) {
            video.currentTime = t;
          }
        }
      }
    });
  });

  /* Dibuja el frame cada vez que el vídeo seekea */
  video.addEventListener('seeked', () => {
    if (ready) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  });

  /* Sin vídeo → mantener fallback animado, sin pin */
  video.addEventListener('error', () => {
    canvas.style.display   = 'none';
    fallback.style.display = 'block';
  });

  video.src = 'assets/hero.mp4';

  window.addEventListener('resize', () => {
    resize();
    if (ready) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  });
}

/* ──────────────────────────────────────────────
   SCROLL ANIMATIONS
────────────────────────────────────────────── */
function initScrollAnimations() {

  /* Estados iniciales gestionados por GSAP
     (si GSAP no carga, los elementos quedan visibles por defecto) */
  gsap.set('.producto',                          { opacity: 0, y: 40 });
  gsap.set('.filosofia-label',                   { opacity: 0, y: 16 });
  gsap.set('.filosofia-quote span',              { opacity: 0, y: 28 });
  gsap.set('.filosofia-text',                    { opacity: 0, y: 24 });
  gsap.set('.catering-text h2',                  { opacity: 0, x: -40 });
  gsap.set('.catering-text > p',                 { opacity: 0, x: -40 });
  gsap.set('.catering-list li',                  { opacity: 0, x: -20 });
  gsap.set('.catering-visual',                   { opacity: 0, x: 40 });
  gsap.set('.galeria-item',                      { opacity: 0, scale: 0.96 });
  gsap.set('.galeria-footer',                    { opacity: 0, y: 20 });
  gsap.set('.contacto-card, .contacto-social',   { opacity: 0, y: 40 });

  /* Helper para simplificar triggers repetidos */
  function reveal(target, vars, triggerEl) {
    return gsap.to(target, {
      scrollTrigger: {
        trigger : triggerEl || target,
        start   : 'top 86%'
      },
      ...vars
    });
  }

  /* ── Filosofía ── */
  reveal('.filosofia-label', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });

  document.querySelectorAll('.filosofia-quote span').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity  : 1,
      y        : 0,
      duration : 1,
      delay    : i * 0.16,
      ease     : 'power3.out'
    });
  });

  reveal('.filosofia-text', { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: 'power3.out' });

  /* ── Section heads ── */
  document.querySelectorAll('.section-head').forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 87%' },
      opacity : 0,
      y       : 30,
      duration: 0.9,
      ease    : 'power3.out'
    });
  });

  /* ── Productos ── */
  document.querySelectorAll('.producto').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%' },
      opacity  : 1,
      y        : 0,
      duration : 0.85,
      delay    : (i % 3) * 0.1,
      ease     : 'power3.out'
    });
  });

  /* ── Catering ── */
  gsap.to('.catering-text h2', {
    scrollTrigger: { trigger: '.catering-text', start: 'top 80%' },
    opacity: 1, x: 0, duration: 1, ease: 'power3.out'
  });

  gsap.to('.catering-text > p', {
    scrollTrigger: { trigger: '.catering-text', start: 'top 80%' },
    opacity: 1, x: 0, duration: 1, delay: 0.15, ease: 'power3.out'
  });

  document.querySelectorAll('.catering-list li').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: '.catering-list', start: 'top 82%' },
      opacity  : 1,
      x        : 0,
      duration : 0.75,
      delay    : 0.3 + i * 0.1,
      ease     : 'power3.out'
    });
  });

  gsap.to('.catering-visual', {
    scrollTrigger: { trigger: '.catering-visual', start: 'top 82%' },
    opacity: 1, x: 0, duration: 1.2, ease: 'power3.out'
  });

  /* Parallax en el fondo del catering */
  gsap.to('.catering-bg', {
    scrollTrigger: {
      trigger : '#catering',
      start   : 'top bottom',
      end     : 'bottom top',
      scrub   : 1.5
    },
    yPercent : 18,
    ease     : 'none'
  });

  /* ── Galería ── */
  document.querySelectorAll('.galeria-item').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: '.galeria-grid', start: 'top 85%' },
      opacity  : 1,
      scale    : 1,
      duration : 0.9,
      delay    : i * 0.07,
      ease     : 'power3.out'
    });
  });

  gsap.to('.galeria-footer', {
    scrollTrigger: { trigger: '.galeria-footer', start: 'top 92%' },
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
  });

  /* ── Instagram ── */
  gsap.to('.insta-header', {
    scrollTrigger: { trigger: '#instagram', start: 'top 85%' },
    opacity: 1, y: 0, duration: 0.9, ease: 'power3.out'
  });
  gsap.fromTo('.insta-item',
    { opacity: 0, scale: 0.92 },
    { opacity: 1, scale: 1, duration: 0.6, stagger: 0.06, ease: 'power3.out',
      scrollTrigger: { trigger: '.insta-grid', start: 'top 88%' } }
  );
  gsap.to('.insta-footer', {
    scrollTrigger: { trigger: '.insta-footer', start: 'top 92%' },
    opacity: 1, y: 0, duration: 0.8, ease: 'power3.out'
  });

  /* ── Nuestra Cafetería ── */
  gsap.to('.cafe-map', {
    scrollTrigger: { trigger: '.cafe-map', start: 'top 85%' },
    opacity: 1, y: 0, duration: 1, ease: 'power3.out'
  });

  /* ── Contacto ── */
  document.querySelectorAll('.contacto-card, .contacto-social').forEach((el, i) => {
    gsap.to(el, {
      scrollTrigger: { trigger: '#contacto', start: 'top 82%' },
      opacity  : 1,
      y        : 0,
      duration : 0.85,
      delay    : i * 0.13,
      ease     : 'power3.out'
    });
  });
}

/* ──────────────────────────────────────────────
   DATOS DE PRODUCTOS
────────────────────────────────────────────── */
const PRODUCTS = {
  /* TRADICIONALES */
  'trad-1': { name:'Barquillo',           cat:'Postres Tradicionales', desc:'Hojaldre crujiente relleno de deliciosa crema pastelera artesanal.' },
  'trad-2': { name:'Manta de Coco',        cat:'Postres Tradicionales', desc:'Bizcocho esponjoso con delicada crema de coco y acabado artesanal.' },
  'trad-3': { name:'Milhoja Blanca',       cat:'Postres Tradicionales', desc:'Hojaldre crujiente con crema pastelera y baño de fondant blanco.' },
  'trad-4': { name:'Milhoja Canela',       cat:'Postres Tradicionales', desc:'Hojaldre dorado con crema de canela. Un clásico de temporada.' },
  'trad-5': { name:'Milhoja Chocolate',    cat:'Postres Tradicionales', desc:'Capas de hojaldre crujiente con crema de chocolate puro.' },
  'trad-6': { name:'Petisú Blanco',        cat:'Postres Tradicionales', desc:'Choux relleno de crema pastelera y bañado en fondant blanco. Ligero y delicioso.' },
  'trad-7': { name:'Petisú Chocolate',     cat:'Postres Tradicionales', desc:'Choux relleno de crema y cubierto con chocolate negro artesanal.' },
  'trad-8': { name:'Pionono',              cat:'Postres Tradicionales', desc:'El dulce típico de Granada: bizcocho enrollado con crema y su inconfundible toque tostado.' },
  'trad-9': { name:'Pionono Chocolate',    cat:'Postres Tradicionales', desc:'La deliciosa versión con chocolate del icónico pionono granadino.' },
  'trad-10':{ name:'Rosco de Nata',        cat:'Postres Tradicionales', desc:'Rosco esponjoso relleno de nata montada fresca. Suave y cremoso.' },
  'trad-11':{ name:'Royal',               cat:'Postres Tradicionales', desc:'Pastel clásico de capas de bizcocho con crema y acabado artesanal.' },
  /* SEMIFRÍOS */
  'sf-1':  { name:'Fantasía de Avellana',                  cat:'Postres Semifríos', desc:'Postre semifrío de cremosa textura con intenso sabor a avellana tostada.' },
  'sf-2':  { name:'Geometría Bombón',                      cat:'Postres Semifríos', desc:'Semifrío de diseño geométrico con bombón de chocolate negro.' },
  'sf-3':  { name:'Geometría Bombón de Oro',               cat:'Postres Semifríos', desc:'Versión dorada del semifrío geométrico. Elegante y sofisticado.' },
  'sf-4':  { name:'Geometría Choco Mango',                 cat:'Postres Semifríos', desc:'Semifrío geométrico de chocolate con mousse de mango tropical.' },
  'sf-5':  { name:'Geometría Frambuesa',                   cat:'Postres Semifríos', desc:'Semifrío geométrico de mousse de frambuesa fresca y ácida.' },
  'sf-6':  { name:'Geometría Queso y Arándanos',           cat:'Postres Semifríos', desc:'Semifrío geométrico de queso fresco con coulis de arándanos.' },
  'sf-7':  { name:'Geometría Yogur Kéfir y Limón',         cat:'Postres Semifríos', desc:'Yogur kéfir con toque refrescante de limón en diseño geométrico.' },
  'sf-8':  { name:'Imperial Mandarina',                    cat:'Postres Semifríos', desc:'Postre semifrío con cítrico sabor a mandarina. Ligero y refrescante.' },
  'sf-9':  { name:'Lingote Bombón',                        cat:'Postres Semifríos', desc:'Lingote de chocolate con bombón y griottines (cerezas al kirsch).' },
  'sf-10': { name:'Lingote Choco Blanco y Frambuesa',      cat:'Postres Semifríos', desc:'Lingote de chocolate blanco con mousse de frambuesa.' },
  'sf-11': { name:'Lingote Choco Blanco y Mango',          cat:'Postres Semifríos', desc:'Lingote de chocolate blanco con mousse de mango tropical.' },
  'sf-12': { name:'Lingote de Cocoa',                      cat:'Postres Semifríos', desc:'Lingote de intensa crema de cocoa artesanal.' },
  'sf-13': { name:'Tarta Pionono',                         cat:'Postres Semifríos', desc:'Porción de tarta pionono semifría, el postre típico granadino en formato frío.' },
  'sf-14': { name:'Rosa de Pasión',                        cat:'Postres Semifríos', desc:'Rosa semifría de mousse de fruta de la pasión. Visual y deliciosa.' },
  'sf-15': { name:'Rosa Nevada',                           cat:'Postres Semifríos', desc:'Rosa semifría de aspecto nevado con mousse de crema y vainilla.' },
  'sf-16': { name:'Semiesfera Cava y Limón',               cat:'Postres Semifríos', desc:'Semiesfera de cava con toque de limón. Ligera y refrescante.' },
  'sf-17': { name:'Semiesfera Choco Blanco y Frambuesa',   cat:'Postres Semifríos', desc:'Semiesfera de chocolate blanco con mousse de frambuesa.' },
  'sf-18': { name:'Semiesfera Choco Blanco y Mango',       cat:'Postres Semifríos', desc:'Semiesfera de chocolate blanco con mousse de mango tropical.' },
  'sf-19': { name:'Semiesfera Coulant Chocolate',          cat:'Postres Semifríos', desc:'Corazón caliente de chocolate negro dentro de una semiesfera fría.' },
  'sf-20': { name:'Semiesfera Mango y Chirimoya',          cat:'Postres Semifríos', desc:'Sabores tropicales de Granada: mango y chirimoya en semiesfera.' },
  'sf-21': { name:'Semiesfera Rocher',                     cat:'Postres Semifríos', desc:'Semiesfera Rocher de avellana y chocolate crujiente.' },
  'sf-22': { name:'Semiesfera Turrón Toffee',              cat:'Postres Semifríos', desc:'Semiesfera de turrón con base de toffee caramelizado.' },
  'sf-23': { name:'Soufflé',                               cat:'Postres Semifríos', desc:'Soufflé cremoso de turrón o mandarina. Ligero y esponjoso.' },
  'sf-24': { name:'Timbal Café Irlandés',                  cat:'Postres Semifríos', desc:'Timbal semifrío de crema de café irlandés. Sofisticado y cremoso.' },
  'sf-25': { name:'Timbal de Yogur',                       cat:'Postres Semifríos', desc:'Timbal de yogur natural fresco con base crujiente.' },
  'sf-26': { name:'Timbal Mousse de Limón',                cat:'Postres Semifríos', desc:'Timbal de mousse de limón. Refrescante, suave y sin excesos.' },
  'sf-27': { name:'Timbal Queso con Frambuesa',            cat:'Postres Semifríos', desc:'Timbal de queso fresco con coulis de frambuesa.' },
  'sf-28': { name:'Timbal San Marcos',                     cat:'Postres Semifríos', desc:'Nata, yema tostada y bizcocho borracho. El clásico San Marcos en timbal.' },
  'sf-29': { name:'Timbal Tiramisú',                       cat:'Postres Semifríos', desc:'Timbal cremoso de tiramisú con mascarpone y café.' },
  'sf-30': { name:'Timbal Tres Chocolates',                cat:'Postres Semifríos', desc:'Tres capas de chocolate: negro, con leche y blanco.' },
  'sf-31': { name:'Timbal Turrón',                         cat:'Postres Semifríos', desc:'Timbal semifrío de turrón de Jijona. Sabor navideño todo el año.' },
  /* PLANCHAS */
  'pl-1':  { name:'Plancha Crema Catalana',   cat:'Planchas Catering', desc:'Plancha de crema catalana con crujiente capa de azúcar tostada.' },
  'pl-2':  { name:'Plancha Nata y Galleta',   cat:'Planchas Catering', desc:'Plancha de nata montada con base de galleta crujiente.' },
  'pl-3':  { name:'Plancha Queso y Arándanos',cat:'Planchas Catering', desc:'Plancha de mousse de queso fresco con cobertura de arándanos.' },
  'pl-4':  { name:'Plancha Tiramisú',         cat:'Planchas Catering', desc:'Plancha de tiramisú con mascarpone, café y cacao. Formato catering.' },
  'pl-5':  { name:'Plancha Trufa',            cat:'Planchas Catering', desc:'Plancha de trufa de chocolate negro artesanal.' },
  'pl-6':  { name:'Plancha Turrón',           cat:'Planchas Catering', desc:'Plancha de turrón artesanal. Ideal para celebraciones navideñas.' },
  'pl-7':  { name:'Plancha San Marcos',       cat:'Planchas Catering', desc:'Nata, yema tostada y bizcocho borracho en formato plancha.' },
  'pl-8':  { name:'Plancha Selva Negra',      cat:'Planchas Catering', desc:'Plancha Selva Negra con nata, cerezas y chocolate.' },
  'pl-9':  { name:'Plancha Tres Chocolates',  cat:'Planchas Catering', desc:'Tres capas de chocolate negro, con leche y blanco en plancha.' },
  /* BANDEJAS */
  'bj-1':  { name:'Bandeja Mini Piononos',         cat:'Bandejas Surtidas', desc:'Bandeja de mini piononos artesanales. El dulce típico de Granada en formato mini.' },
  'bj-2':  { name:'Bandeja Pastelitos Surtidos',   cat:'Bandejas Surtidas', desc:'Selección de nuestros pastelitos artesanales en bandeja.' },
  'bj-3':  { name:'Bandeja Repostería Surtida',    cat:'Bandejas Surtidas', desc:'Surtido variado de nuestra repostería artesanal. Perfecto para eventos.' },
  'bj-4':  { name:'Bandeja Surtido de Semifríos',  cat:'Bandejas Surtidas', desc:'Surtido de semifríos artesanales en bandeja para celebraciones.' },
  /* VASITOS */
  'vs-1':  { name:'Vasito Choco Blanco y Frambuesa', cat:'Postres en Vasitos', desc:'Postre individual de chocolate blanco con mousse de frambuesa.' },
  'vs-2':  { name:'Vasito Choco Blanco y Mango',     cat:'Postres en Vasitos', desc:'Postre individual de chocolate blanco con mousse de mango tropical.' },
  'vs-3':  { name:'Vasito de Bombón',                cat:'Postres en Vasitos', desc:'Vasito individual de bombón de chocolate artesanal.' },
  'vs-4':  { name:'Vasito de Turrón',                cat:'Postres en Vasitos', desc:'Vasito individual de turrón artesanal. Perfecto para eventos.' },
  'vs-5':  { name:'Vasito Queso y Arándanos',        cat:'Postres en Vasitos', desc:'Vasito de queso fresco con coulis de arándanos naturales.' },
  'vs-6':  { name:'Vasito Selva Negra',              cat:'Postres en Vasitos', desc:'Nata, cerezas y chocolate en formato vasito individual.' },
  'vs-7':  { name:'Vasito Tres Chocolates',          cat:'Postres en Vasitos', desc:'Tres capas de chocolate negro, con leche y blanco en vasito.' },
  'vs-8':  { name:'Vasito Yogur con Pionono',        cat:'Postres en Vasitos', desc:'Yogur natural con pionono granadino desmenuzado.' },
  /* TARTAS HELADAS */
  'th-1':  { name:'Tarta Helada de Avellana',             cat:'Tartas Heladas', desc:'Tarta helada artesanal con intensa crema de avellana tostada.' },
  'th-2':  { name:'Tarta Helada de Whisky',               cat:'Tartas Heladas', desc:'Tarta helada de whisky. Cremosa, suave e irresistible.' },
  'th-3':  { name:'Tarta Helada Leche Merengada',         cat:'Tartas Heladas', desc:'Tarta helada de leche merengada con toque de canela y limón.' },
  'th-4':  { name:'Tarta Helada Nougat Higos y Nueces',   cat:'Tartas Heladas', desc:'Tarta helada de nougat artesanal con higos y nueces.' },
  /* TARTAS PORCIONADAS */
  'tp-1':  { name:'Tarta Americana',        cat:'Tartas Porcionadas', desc:'Mousse de chocolate, bizcocho y brownie. Un clásico americano irresistible.' },
  'tp-2':  { name:'Tarta Caramelo',         cat:'Tartas Porcionadas', desc:'Tarta porcionada con deliciosa crema de caramelo artesanal.' },
  'tp-3':  { name:'Tarta Crema Catalana',   cat:'Tartas Porcionadas', desc:'Tarta porcionada de crema catalana con su toque de yema tostada.' },
  'tp-4':  { name:'Tarta de Manzana',       cat:'Tartas Porcionadas', desc:'Crema pastelera sobre tartaleta de pasta brisa. Un clásico atemporal.' },
  'tp-5':  { name:'Tarta de Turrón',        cat:'Tartas Porcionadas', desc:'Tarta porcionada de turrón artesanal. El sabor navideño en cualquier época.' },
  'tp-6':  { name:'Tarta Galletas María',   cat:'Tartas Porcionadas', desc:'Galletas María bañadas en crema natillas y caramelo.' },
  'tp-7':  { name:'Tarta Kinder',           cat:'Tartas Porcionadas', desc:'Tarta porcionada de Kinder. Favorita entre los más pequeños.' },
  'tp-8':  { name:'Tarta Kit Kat',          cat:'Tartas Porcionadas', desc:'Tarta porcionada de Kit Kat con chocolate y crema.' },
  'tp-9':  { name:'Tarta Muerte por Chocolate', cat:'Tartas Porcionadas', desc:'La muerte por chocolate: intensa, oscura y adictiva.' },
  'tp-10': { name:'Tarta Oreo',             cat:'Tartas Porcionadas', desc:'Tarta Oreo porcionada con crema de galleta y nata.' },
  'tp-11': { name:'Tarta Piononos',         cat:'Tartas Porcionadas', desc:'Tarta porcionada de pionono granadino. El sabor de Granada en tarta.' },
  'tp-12': { name:'Tarta Queso y Arándanos',cat:'Tartas Porcionadas', desc:'Tarta porcionada de queso fresco con arándanos naturales.' },
  'tp-13': { name:'Tarta Red Velvet',       cat:'Tartas Porcionadas', desc:'Crema de queso y bizcocho decorado con chocolate blanco.' },
  'tp-14': { name:'Tarta Sacher',           cat:'Tartas Porcionadas', desc:'La clásica tarta vienesa de chocolate con mermelada de albaricoque.' },
  'tp-15': { name:'Tarta Tiramisú',         cat:'Tartas Porcionadas', desc:'Tarta porcionada de tiramisú con mascarpone y café.' },
  'tp-16': { name:'Tarta Tres Chocolates',  cat:'Tartas Porcionadas', desc:'Tres capas de chocolate negro, con leche y blanco. Para los chocoadictos.' },
  'tp-17': { name:'Tarta Zanahoria',        cat:'Tartas Porcionadas', desc:'Tarta porcionada de zanahoria con crema de queso y nueces.' },
  /* CARNAVAL */
  'carn-1':{ name:'Cuajada Carnaval Familiar',  cat:'Dulces de Carnaval', desc:'Cuajada familiar en cuenco de cerámica granadina: mantecado de almendra, bizcocho calado, crema pastelera, cabello de ángel y canela. Edición limitada.' },
  'carn-2':{ name:'Cuajada Carnaval Individual',cat:'Dulces de Carnaval', desc:'El dulce típico granadino de Carnaval en presentación individual artesanal.' },
  /* SEMANA SANTA */
  'ss-1':  { name:'Buñuelos Chocolate',        cat:'Dulces de Semana Santa', desc:'Buñuelos esponjosos rellenos con suave crema de chocolate. Tradición de Semana Santa.' },
  'ss-2':  { name:'Buñuelos Crema',            cat:'Dulces de Semana Santa', desc:'Buñuelos rellenos de crema pastelera artesanal.' },
  'ss-3':  { name:'Buñuelos Nata',             cat:'Dulces de Semana Santa', desc:'Buñuelos esponjosos rellenos de nata montada fresca.' },
  'ss-4':  { name:'Galletas Chocolate',        cat:'Dulces de Semana Santa', desc:'Galletas artesanales con baño de chocolate negro.' },
  'ss-5':  { name:'Galletas Chocolate Blanco', cat:'Dulces de Semana Santa', desc:'Galletas artesanales con baño de chocolate blanco.' },
  'ss-6':  { name:'Galletas con Azúcar',       cat:'Dulces de Semana Santa', desc:'Galletas espolvoradas con azúcar. Receta tradicional artesanal.' },
  'ss-7':  { name:'Galletas de Coco',          cat:'Dulces de Semana Santa', desc:'Galletas artesanales con coco rallado.' },
  'ss-8':  { name:'Leche Frita',               cat:'Dulces de Semana Santa', desc:'Postre frito tradicional de Semana Santa. Cremoso, dorado y crujiente.' },
  'ss-9':  { name:'Mini Pestiños con Azúcar',  cat:'Dulces de Semana Santa', desc:'Mini pestiños de Semana Santa con cobertura de azúcar.' },
  'ss-10': { name:'Mini Pestiños Melados',     cat:'Dulces de Semana Santa', desc:'Mini pestiños bañados en miel. Dulce tradición andaluza.' },
  'ss-11': { name:'Pestiños con Azúcar',       cat:'Dulces de Semana Santa', desc:'Pestiños tradicionales con cobertura de azúcar.' },
  'ss-12': { name:'Roscos Fritos',             cat:'Dulces de Semana Santa', desc:'Roscos fritos artesanales. Receta tradicional granadina.' },
  'ss-13': { name:'Torrijas',                  cat:'Dulces de Semana Santa', desc:'Exquisitas torrijas de Semana Santa elaboradas artesanalmente.' },
};

/* ──────────────────────────────────────────────
   MODAL DE PRODUCTO
────────────────────────────────────────────── */
function initModal() {
  const modal    = document.getElementById('product-modal');
  const backdrop = modal.querySelector('.pmodal-backdrop');
  const closeBtn = modal.querySelector('.pmodal-close');
  const imgEl    = document.getElementById('pmodal-img');
  const catEl    = document.getElementById('pmodal-cat');
  const nameEl   = document.getElementById('pmodal-name');
  const descEl   = document.getElementById('pmodal-desc');

  function openModal(pid, imgSrc) {
    const data = PRODUCTS[pid] || { name: '', cat: '', desc: '' };
    imgEl.src  = imgSrc;
    imgEl.alt  = data.name;
    catEl.textContent  = data.cat;
    nameEl.textContent = data.name;
    descEl.textContent = data.desc;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* Abrir al hacer clic en cualquier producto */
  document.addEventListener('click', e => {
    const article = e.target.closest('.producto');
    if (!article) return;
    const img = article.querySelector('img');
    if (!img) return;
    const pid = img.src.match(/productos\/([^.]+)\.jpg/)?.[1] || '';
    openModal(pid, img.src);
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ──────────────────────────────────────────────
   ACORDEÓN SUBCATEGORÍAS
────────────────────────────────────────────── */
function initAccordions() {
  /* Inicializar paneles cerrados con GSAP */
  document.querySelectorAll('.subcat-panel:not(.open)').forEach(p => {
    gsap.set(p, { height: 0, overflow: 'hidden' });
  });

  document.querySelectorAll('.subcat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panelId = 'subcat-' + btn.dataset.subcat;
      const panel   = document.getElementById(panelId);
      const isOpen  = panel.classList.contains('open');

      if (isOpen) {
        /* Cerrar */
        gsap.to(panel, {
          height: 0, duration: 0.35, ease: 'power2.inOut',
          onComplete() { panel.classList.remove('open'); }
        });
        btn.classList.remove('active');
      } else {
        /* Abrir */
        panel.classList.add('open');
        btn.classList.add('active');
        const h = panel.scrollHeight;
        gsap.fromTo(panel,
          { height: 0, overflow: 'hidden' },
          { height: h, duration: 0.45, ease: 'power2.out',
            onComplete() { panel.style.height = 'auto'; panel.style.overflow = ''; }
          }
        );
        gsap.fromTo(panel.querySelectorAll('.producto'),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.04, delay: 0.15, ease: 'power3.out' }
        );
      }
    });
  });
}

/* ──────────────────────────────────────────────
   TABS
────────────────────────────────────────────── */
function initTabs() {
  const btns   = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  function animatePanel(panel) {
    const items = panel.querySelectorAll('.producto');
    gsap.fromTo(items,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: 'power3.out' }
    );
  }

  /* Animar productos de la pestaña inicial */
  const activePanel = document.querySelector('.tab-panel.active');
  if (activePanel) {
    setTimeout(() => animatePanel(activePanel), 200);
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;

      /* Botones */
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      /* Paneles */
      const current = document.querySelector('.tab-panel.active');
      const next    = document.getElementById('tab-' + btn.dataset.tab);

      gsap.to(current, {
        opacity: 0, y: 10, duration: 0.18,
        onComplete() {
          current.classList.remove('active');
          gsap.set(current, { opacity: 1, y: 0 });
          next.classList.add('active');
          animatePanel(next);
        }
      });
    });
  });
}

/* ──────────────────────────────────────────────
   SMOOTH ANCHOR SCROLL
────────────────────────────────────────────── */
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop, behavior: 'smooth' });
    });
  });
}

/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initVideoScrub();
  initScrollAnimations();
  initTabs();
  initAccordions();
  initModal();
  initSmoothLinks();
});
