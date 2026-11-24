const getinge = 'https://www.getinge.com/uk/products-and-solutions/operating-room/or-equipment/?cat35471=35469';
const draeger = 'https://www.draeger.com/ro_ro/Products/Vista-300-S';

const medicalConcepts = [
  ['ultrasound-cart', 'imaging', 'รถเข็นอัลตราซาวนด์', 'Ultrasound cart', 'https://www.documents.philips.com/assets/20250507/2f2a82833fe24c4985a2b2d6012af27d.pdf'],
  ['mobile-c-arm', 'imaging', 'เครื่องเอกซเรย์แบบซีอาร์ม', 'Mobile C-arm', 'https://www.gehealthcare.com/en-gb/products/surgical-imaging/oec-one-cfd'],
  ['mobile-x-ray', 'imaging', 'เครื่องเอกซเรย์เคลื่อนที่', 'Mobile X-ray unit', 'https://www.documents.philips.com/assets/20170523/707e16ce0e8c47619a54a77c014ad392.pdf'],
  ['surgical-light', 'surgery', 'โคมไฟผ่าตัด', 'Surgical light', getinge],
  ['operating-table', 'surgery', 'เตียงผ่าตัด', 'Operating table', getinge],
  ['anesthesia-station', 'surgery', 'เครื่องดมยาสลบ', 'Anesthesia workstation', 'https://www.gehealthcare.com/en-us/products/anesthesia-delivery/carestation-750'],
  ['patient-monitor', 'critical', 'เครื่องติดตามสัญญาณชีพ', 'Patient monitor', draeger],
  ['icu-ventilator', 'critical', 'เครื่องช่วยหายใจ ICU', 'ICU ventilator', draeger],
  ['infusion-stack', 'critical', 'ชุดเครื่องควบคุมการให้สารละลาย', 'Infusion pump station', 'https://www.bbraun.com/en/products-and-solutions/therapies/infusion-therapy/automated-infusion-pumps-spaceplus.html'],
  ['neonatal-incubator', 'support', 'ตู้อบทารกแรกเกิด', 'Neonatal incubator', 'https://www.draeger.com/en-us_ca/Products/draeger-babyleo-tn500'],
  ['defibrillator', 'support', 'เครื่องกระตุกหัวใจพร้อมจอ', 'Monitor and defibrillator', 'https://www.zoll.com/en-us/products/emergency-care/monitors-and-defibrillators/r-series-plus'],
  ['steam-sterilizer', 'support', 'เครื่องนึ่งฆ่าเชื้อ', 'Steam sterilizer', 'https://www.steris.com/healthcare/products/steam-sterilizers'],
];

const medicalTitles = [
  ['รายละเอียดข้อต่อและแขนกล', 'Surgical arm detail'],
  ['หุ่นยนต์ผ่าตัดใน Blender', 'Surgical robot in Blender'],
  ['Wireframe ชุดควบคุม', 'Control console wireframe'],
  ['รถเข็นอุปกรณ์ใน Blender', 'Equipment cart in Blender'],
  ['ภาพรวมชุดอุปกรณ์', 'Medical equipment overview'],
  ['ภาพนำเสนอหุ่นยนต์ผ่าตัด', 'Surgical robot presentation'],
];

const categories = {
  all: ['ทุกประเภท', 'All categories'],
  modeling: ['ผลงานโมเดล', 'Modeling work'],
  concept: ['ภาพแนวคิด AI ทั้งหมด', 'All AI concepts'],
  imaging: ['เครื่องถ่ายภาพ', 'Imaging'],
  surgery: ['ห้องผ่าตัด', 'Operating room'],
  critical: ['หอผู้ป่วยวิกฤต', 'Critical care'],
  support: ['อุปกรณ์สนับสนุน', 'Clinical support'],
  film: ['ภาพจากงานวิดีโอ', 'Film stills'],
};

const collectionCategories = {
  medical: ['all', 'modeling', 'concept', 'imaging', 'surgery', 'critical', 'support'],
  drones: ['all'],
  other: ['all', 'modeling', 'film', 'concept'],
};

const quickCategories = {
  medical: ['all', 'modeling', 'concept'],
  drones: [],
  other: ['all', 'modeling', 'film', 'concept'],
};

const quickLabels = {
  all: ['ทั้งหมด', 'All images'],
  modeling: ['ภาพโมเดล', 'Modeling work'],
  film: ['ภาพจากวิดีโอ', 'Film stills'],
  concept: ['ภาพแนวคิด AI', 'AI concepts'],
};

const searchExamples = {
  medical: ['เช่น ซีอาร์ม', 'e.g. C-arm'],
  drones: ['เช่น Nazgul', 'e.g. Nazgul'],
  other: ['เช่น ลำโพง', 'e.g. Speaker'],
};

const kindLabels = {
  modeling: ['ผลงานโมเดล', 'Modeling work'],
  study: ['งานศึกษา Blender', 'Blender study'],
  target: ['ภาพเรนเดอร์อ้างอิงที่สร้างใหม่', 'Independently modeled target render'],
  film: ['ภาพจากงานวิดีโอ', 'Film still'],
  credit: ['เครดิตผลงานทีม', 'Studio team credit'],
  recreated: ['ปรับภาพต้นฉบับด้วย AI', 'AI rework of original photo'],
  concept: ['ภาพแนวคิดจาก AI', 'AI-generated concept'],
};

function imagesFrom(selector) {
  const source = document.querySelector(selector);
  return source?.dataset.images?.split(',').map(url => url.trim()) ?? [];
}

function entries(selector, titles, kind, category) {
  return imagesFrom(selector).map((url, index) => ({
    url,
    title: titles[index],
    kind,
    category,
  }));
}

function buildCollections() {
  const medical = entries('#medical-modeling', medicalTitles, 'modeling', 'modeling').concat(
    medicalConcepts.map(([key, category, th, en, reference]) => ({
      url: '/work-gallery/medical/' + key + '.webp',
      title: [th, en],
      kind: 'concept',
      category,
      reference,
    }))
  );
  medical.unshift({
    url: '/work-gallery/medical/da-vinci-xi-target.webp',
    title: ['da Vinci Xi · ภาพเรนเดอร์อ้างอิง', 'da Vinci Xi · Target render'],
    kind: 'target',
    category: 'surgery',
    reference: 'https://www.intuitive.com/en-us/products-and-services/da-vinci/xi',
  });

  const drones = imagesFrom('#hard-surface').map(url => {
    const label = decodeURIComponent(url.split('/').at(-1))
      .replace(/\.jpe?g$/i, '')
      .replace(/^\d+_/, '')
      .replaceAll('_', ' ');
    return { url, title: [label, label], kind: 'modeling', category: 'modeling' };
  });

  const speaker = entries('#speaker-study', [
    ['ลำโพง · ภาพเรนเดอร์', 'Speaker · Blender render'],
    ['ลำโพง · แยกชิ้นส่วน', 'Speaker · Exploded view'],
    ['ลำโพง · ภาพ Clay', 'Speaker · Clay render'],
  ], 'study', 'modeling');

  const lokson = entries('#lokson-wat-wiang', [
    ['โลกซ้อน · ปกวัดเวียง', 'LOKSON · Wat Wiang cover'],
    ['โลกซ้อน · เฟรมจากวัดเวียง', 'LOKSON · Wat Wiang short frame'],
  ], 'film', 'film');

  const film = imagesFrom('#ai-work .project-card').map((url, index) => ({
    url,
    title: ['ภาพศึกษางานวิดีโอ AI ' + (index + 1), 'AI film production still ' + (index + 1)],
    kind: 'film',
    category: 'film',
  }));

  const strokeImageTitles = [
    ['ภาพเดี่ยวถือถ้วย', 'Solo trophy portrait'],
    ['เซลฟี่ฉลองรางวัล', 'Award celebration selfie'],
    ['ภาพเครดิตภาพยนตร์', 'Film credits'],
    ['ประกาศรายชื่อผู้เข้ารอบ', 'Finalist announcement'],
  ];
  const stroke = [
    {
      url: '/portfolio_pdf_assets/aifilm_poster.jpg',
      title: ['The Stroke of Night · โปสเตอร์', 'The Stroke of Night · Poster'],
      kind: 'credit',
      category: 'film',
    },
    ...imagesFrom('#ai-video').map((url, index) => ({
      url,
      title: strokeImageTitles[index].map(title => 'The Stroke of Night · ' + title),
      kind: index < 2 ? 'recreated' : 'credit',
      category: 'film',
    })),
  ];
  const concepts = [...document.querySelectorAll('#concepts figure')].map(figure => ({
    url: figure.querySelector('img').getAttribute('src'),
    title: ['th', 'en'].map(lang => figure.querySelector('h3 .lang-' + lang).textContent),
    kind: 'concept',
    category: 'concept',
  }));

  return { medical, drones, other: [...speaker, ...stroke, ...lokson, ...film, ...concepts] };
}

function normalize(value) {
  return value.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{S}]+/gu, ' ').trim();
}

export function initImageLibrary(openPreview) {
  const root = document.getElementById('asset-library');
  const heading = document.getElementById('library-title');
  const collections = buildCollections();
  const tabs = [...root.querySelectorAll('[data-library-collection]')];
  const search = document.getElementById('library-search');
  const categoryField = document.getElementById('library-category-field');
  const group = document.getElementById('library-category');
  const status = document.getElementById('library-status');
  const quickFilters = document.getElementById('library-quick-filters');
  const clearFilters = document.getElementById('library-clear');
  const results = document.getElementById('library-results');
  const pagination = document.getElementById('library-pagination');
  const pageLabel = document.getElementById('library-page');
  const pageSize = 12;
  let collection = 'medical';
  let page = 0;

  function languageIndex() {
    return document.documentElement.lang === 'th' ? 0 : 1;
  }

  function updateControls() {
    const lang = languageIndex();
    const current = group.value || 'all';
    const options = collectionCategories[collection];
    group.replaceChildren(...options.map(key => new Option(categories[key][lang], key)));
    group.value = options.includes(current) ? current : 'all';
    categoryField.hidden = options.length === 1;
    for (const tab of tabs) {
      tab.setAttribute('aria-pressed', String(tab.dataset.libraryCollection === collection));
    }
    const shortcuts = quickCategories[collection];
    quickFilters.hidden = shortcuts.length === 0;
    quickFilters.replaceChildren(...shortcuts.map(key => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.libraryQuick = key;
      button.setAttribute('aria-controls', 'library-results');
      button.textContent = quickLabels[key][lang];
      return button;
    }));
    search.placeholder = searchExamples[collection][lang];
    pagination.setAttribute('aria-label', lang === 0 ? 'หน้าคลังภาพ' : 'Image library pages');
  }

  function makeCard(item, lang, onOpen) {
    const card = document.createElement('li');
    card.className = 'library-card';
    card.dataset.kind = item.kind;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'library-preview';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'lightbox');
    const img = document.createElement('img');
    img.src = item.url;
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    const picture = document.createElement('span');
    picture.className = 'library-picture';
    const zoom = document.createElement('span');
    zoom.className = 'library-zoom';
    zoom.setAttribute('aria-hidden', 'true');
    zoom.textContent = '⤢';
    picture.append(img, zoom);
    const title = document.createElement('strong');
    title.textContent = item.title[lang];
    const label = document.createElement('small');
    label.textContent = kindLabels[item.kind][lang];
    button.append(picture, title, label);
    button.addEventListener('click', () => onOpen(button));
    card.append(button);

    if (item.reference) {
      const link = document.createElement('a');
      link.href = item.reference;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = lang === 0 ? 'อ้างอิงรูปทรง ↗' : 'Visual reference ↗';
      link.setAttribute('aria-label', link.textContent + ' · ' + item.title[lang]);
      card.append(link);
    }
    return card;
  }

  function render() {
    const lang = languageIndex();
    const query = normalize(search.value).split(/\s+/).filter(Boolean);
    const chosen = group.value;
    clearFilters.hidden = !search.value && chosen === 'all';
    for (const button of quickFilters.querySelectorAll('button')) {
      button.setAttribute('aria-pressed', String(button.dataset.libraryQuick === chosen));
    }
    const matches = collections[collection].filter(item => {
      const categoryMatches = chosen === 'all' || chosen === item.category
        || (chosen === 'concept' && item.kind === 'concept');
      const terms = normalize([...item.title, ...kindLabels[item.kind], ...categories[item.category]].join(' ')).split(/\s+/);
      return categoryMatches && query.every(part => terms.some(term => part.length === 1 ? term === part : term.includes(part)));
    });
    const totalPages = Math.max(1, Math.ceil(matches.length / pageSize));
    page = Math.min(page, totalPages - 1);
    const start = page * pageSize;
    const end = Math.min(start + pageSize, matches.length);
    results.replaceChildren(...matches.slice(start, end).map((item, index) => (
      makeCard(item, lang, button => openPreview(matches.map(entry => ({
        url: entry.url,
        label: entry.title[lang] + ' · ' + kindLabels[entry.kind][lang],
      })), start + index, button))
    )));
    status.textContent = matches.length
      ? (lang === 0 ? 'แสดง ' + (start + 1) + '–' + end + ' จาก ' + matches.length + ' ภาพ'
        : 'Showing ' + (start + 1) + '–' + end + ' of ' + matches.length + (matches.length === 1 ? ' image' : ' images'))
      : (lang === 0 ? 'ไม่พบภาพ ลองใช้คำค้นอื่น' : 'No images match. Try another search.');
    pagination.hidden = totalPages === 1;
    pagination.querySelector('[data-library-step="-1"]').disabled = page === 0;
    pagination.querySelector('[data-library-step="1"]').disabled = page >= totalPages - 1;
    pageLabel.textContent = (lang === 0 ? 'หน้า ' : 'Page ') + (page + 1) + ' / ' + totalPages;
  }

  function selectCollection(next, query = '', fromProject = false) {
    if (collection === next && !fromProject) return;
    collection = next;
    search.value = query;
    group.value = 'all';
    page = 0;
    updateControls();
    render();
  }

  tabs.forEach(tab => {
    const badge = document.createElement('small');
    badge.className = 'library-tab-count';
    badge.textContent = collections[tab.dataset.libraryCollection].length;
    tab.append(badge);
    tab.addEventListener('click', () => selectCollection(tab.dataset.libraryCollection));
  });
  quickFilters.addEventListener('click', event => {
    const button = event.target.closest('[data-library-quick]');
    if (!button) return;
    group.value = button.dataset.libraryQuick;
    page = 0;
    render();
  });
  clearFilters.addEventListener('click', () => {
    search.value = '';
    group.value = 'all';
    page = 0;
    render();
    search.focus();
  });
  const projectLinks = [...document.querySelectorAll('[data-open-library]')];
  function enterProjectLibrary(focus = false) {
    const link = projectLinks.find(candidate => candidate.hash === location.hash);
    if (!link) return;
    selectCollection(link.dataset.openLibrary, link.dataset.libraryQuery ?? '', true);
    if (focus) heading.focus({ preventScroll: true });
  }
  projectLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (link.hash === location.hash) enterProjectLibrary(true);
    });
  });
  window.addEventListener('hashchange', () => enterProjectLibrary(true));
  [search, group].forEach(field => field.addEventListener('input', () => {
    page = 0;
    render();
  }));
  pagination.querySelectorAll('[data-library-step]').forEach(button => {
    button.addEventListener('click', () => {
      page += Number(button.dataset.libraryStep);
      render();
      results.scrollIntoView({ block: 'start' });
      results.querySelector('button')?.focus({ preventScroll: true });
    });
  });

  new MutationObserver(() => {
    updateControls();
    render();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  updateControls();
  render();
  enterProjectLibrary();
}
