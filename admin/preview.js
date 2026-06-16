(function () {
  const h = window.h || (window.React && window.React.createElement);
  if (!window.CMS || !h) return;

  const PREVIEW_URL = '/?tangram-preview=1';

  const FIELD_RULES = [
    rule('menu.about', 'Menu', ['Quem Somos']),
    rule('menu.events', 'Menu', ['Eventos']),
    rule('menu.partners', 'Menu', ['Parceiros']),
    rule('menu.instagram', 'Menu', ['Instagram']),
    rule('menu.contact', 'Menu', ['Fale conosco']),

    rule('hero.title', 'Hero', ['Titulo']),
    rule('hero.tickets', 'Hero', ['Tickets']),
    rule('hero.loading', 'Hero', ['Loading']),

    rule('agenda.introLabel', 'Agenda', ['Chamada']),
    rule('agenda.introTitle', 'Agenda', ['Titulo']),
    rule('agenda.events', 'Agenda', ['Eventos', 'Local', 'Headliner', 'Lineup', 'Label do ingresso', 'Link do ingresso']),

    rule('highlights.title', 'Highlights', ['Titulo']),
    rule('highlights.images', 'Highlights', ['Textos alternativos das imagens', 'Alt']),

    rule('about.eyebrow', 'Quem Somos', ['Eyebrow']),
    rule('about.title', 'Quem Somos', ['Titulo']),
    rule('about.text', 'Quem Somos', ['Texto']),

    rule('experienceCards', 'Cards de experiencia', ['Titulo', 'Texto']),
    rule('tags', 'Tags', ['Tags']),
    rule('founders', 'Fundadores', ['Nome', 'Bio', 'Botao', 'Link presskit']),

    rule('movement.title', 'Movimento Vivo', ['Titulo']),
    rule('movement.text', 'Movimento Vivo', ['Texto']),
    rule('movement.contactTitle', 'Movimento Vivo', ['Titulo contato']),
    rule('movement.contactText', 'Movimento Vivo', ['Texto contato']),
    rule('movement.supportText', 'Movimento Vivo', ['Texto apoio']),
    rule('movement.form', 'Movimento Vivo', ['Formulario', 'Nome', 'Email', 'Telefone', 'Local', 'Selecione', 'Botao']),

    rule('partners.eyebrow', 'Parceiros', ['Eyebrow']),
    rule('partners.title', 'Parceiros', ['Titulo']),
    rule('partners.text', 'Parceiros', ['Texto']),
    rule('partners.cta', 'Parceiros', ['CTA']),

    rule('purpose.eyebrow', 'Proposito', ['Eyebrow']),
    rule('purpose.title', 'Proposito', ['Titulo']),
    rule('purpose.text', 'Proposito', ['Texto']),
    rule('purpose.pillars', 'Proposito', ['Pilares', 'Titulo', 'Texto']),

    rule('faq.eyebrow', 'FAQ', ['Eyebrow']),
    rule('faq.title', 'FAQ', ['Titulo']),
    rule('faq.intro', 'FAQ', ['Intro']),
    rule('faq.ctaLines', 'FAQ', ['CTA']),
    rule('faq.items', 'FAQ', ['Perguntas', 'Pergunta', 'Resposta']),

    rule('footer.headline', 'Rodape', ['Frase']),
    rule('footer.cta', 'Rodape', ['CTA']),
    rule('footer.location', 'Rodape', ['Local']),
    rule('footer.copyright', 'Rodape', ['Copyright']),

    rule('links.instagram', 'Links globais', ['Instagram']),
    rule('links.whatsappPhone', 'Links globais', ['Telefone WhatsApp']),
    rule('links.whatsappBio', 'Links globais', ['Link WhatsApp bio']),
    rule('links.email', 'Links globais', ['Email']),
    rule('whatsappMessages', 'Mensagens WhatsApp', ['Fale conosco', 'Parceiros', 'Iniciar Movimento', 'Last Night', 'FAQ']),

    rule('seo.title', 'SEO', ['Titulo']),
    rule('seo.description', 'SEO', ['Descricao']),
    rule('seo.socialImage', 'SEO', ['Imagem social'])
  ];

  const KNOWN_PATHS = FIELD_RULES.map((item) => item.path);
  const SECTION_ORDER = [
    'menu',
    'hero',
    'agenda',
    'highlights',
    'about',
    'experienceCards',
    'tags',
    'founders',
    'movement',
    'partners',
    'purpose',
    'faq',
    'footer',
    'links',
    'whatsappMessages',
    'seo'
  ];

  let latestContent = null;
  let activePath = '';
  let syncTimer = 0;
  let scrollTimer = 0;
  let scrollSyncReady = false;
  let latestValueIndex = [];

  function rule(path, section, labels) {
    return {
      path,
      section,
      sectionText: normalize(section),
      labels: labels.map(normalize)
    };
  }

  function entryToContent(entry) {
    const data = entry && entry.get && entry.get('data');
    if (!data) return {};
    return typeof data.toJS === 'function' ? data.toJS() : data;
  }

  function indexContentValues(source) {
    const rows = [];

    function add(path, value) {
      if (value === undefined || value === null || value === '') return;
      rows.push({
        path: normalizeContentPath(path),
        raw: String(value),
        normalized: normalize(value),
        compacted: compact(value)
      });
    }

    function walk(value, path) {
      if (value === undefined || value === null) return;

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        add(path, value);
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item, index) => walk(item, `${path}.${index}`));
        return;
      }

      if (typeof value === 'object') {
        const keys = Object.keys(value);
        const localizedKeys = keys.filter((key) => key === 'pt' || key === 'en');
        if (localizedKeys.length) {
          localizedKeys.forEach((key) => add(path, value[key]));
        }
        keys.forEach((key) => {
          if (key !== 'pt' && key !== 'en') walk(value[key], path ? `${path}.${key}` : key);
        });
      }
    }

    walk(source, '');
    return rows.filter((row) => row.path);
  }

  function normalizeContentPath(path) {
    return String(path || '')
      .replace(/\.(pt|en)$/i, '')
      .replace(/^\./, '');
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function compact(value) {
    return normalize(value).replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '');
  }

  function pathVariants(path) {
    const dot = path.toLowerCase();
    return [
      dot,
      dot.replace(/\./g, '-'),
      dot.replace(/\./g, '_'),
      dot.replace(/\./g, ' ')
    ];
  }

  function pathFromValue(target) {
    if (!target || !latestValueIndex.length) return '';
    if (!/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return '';
    if (target.type === 'checkbox' || target.type === 'radio') return '';

    const rawValue = target.value || target.getAttribute('value') || '';
    const normalizedValue = normalize(rawValue);
    const compactedValue = compact(rawValue);
    if (!normalizedValue && !compactedValue) return '';

    const nearbyText = getTextNearTarget(target);
    const matches = latestValueIndex
      .filter((row) => {
        if (!row.normalized && !row.compacted) return false;
        if (row.normalized && row.normalized === normalizedValue) return true;
        if (row.compacted && row.compacted === compactedValue) return true;
        return normalizedValue.length > 10 && row.normalized.length > 10
          && (row.normalized.includes(normalizedValue) || normalizedValue.includes(row.normalized));
      })
      .map((row) => ({ row, score: scoreValuePath(row.path, nearbyText, normalizedValue) }))
      .sort((a, b) => b.score - a.score);

    return matches[0]?.row.path || '';
  }

  function scoreValuePath(path, nearbyText, normalizedValue) {
    let score = 0;
    const section = path.split('.')[0];
    const leaf = path.split('.').filter((part) => Number.isNaN(Number(part))).pop() || '';
    const baseRule = FIELD_RULES.find((item) => path === item.path || path.startsWith(`${item.path}.`) || item.path.startsWith(`${path}.`));

    if (baseRule) score += scoreRule(baseRule, nearbyText) + 100;
    if (section && nearbyText.includes(normalize(section))) score += 40;
    if (leaf && nearbyText.includes(normalize(leaf))) score += 30;
    if (/^https?:|^mailto:/.test(normalizedValue) && /url|link|instagram|whatsapp|email|presskit|ingresso/.test(nearbyText)) score += 80;
    if (path.includes('.ticketUrl') && /ingresso|ticket|link/.test(nearbyText)) score += 80;
    if (path.includes('.presskitUrl') && /presskit|link/.test(nearbyText)) score += 80;
    if (path.startsWith('links.') && /links globais|instagram|whatsapp|email/.test(nearbyText)) score += 60;
    if (path.startsWith('seo.') && /seo|titulo|descricao|imagem social/.test(nearbyText)) score += 60;

    const orderIndex = SECTION_ORDER.indexOf(section);
    if (orderIndex >= 0) score += SECTION_ORDER.length - orderIndex;
    return score;
  }

  function getTargetAttributes(target) {
    const attrs = [];
    if (!target || !target.getAttribute) return '';
    ['name', 'id', 'for', 'aria-label', 'placeholder', 'data-testid', 'data-field-name'].forEach((attr) => {
      const value = target.getAttribute(attr);
      if (value) attrs.push(value);
    });
    return attrs.join(' ');
  }

  function pathFromAttributes(target) {
    let node = target;
    const attrs = [];
    for (let depth = 0; node && depth < 6; depth += 1) {
      attrs.push(getTargetAttributes(node));
      node = node.parentElement;
    }

    const raw = attrs.join(' ');
    const normalized = normalize(raw);
    const compacted = compact(raw);

    const direct = KNOWN_PATHS
      .slice()
      .sort((a, b) => b.length - a.length)
      .find((path) => pathVariants(path).some((variant) => normalized.includes(variant) || compacted.includes(variant)));

    return direct || '';
  }

  function getTextNearTarget(target) {
    const parts = [getTargetAttributes(target)];
    let node = target;
    for (let depth = 0; node && depth < 8; depth += 1) {
      if (node.innerText) parts.push(node.innerText.slice(0, depth < 3 ? 800 : 1600));
      if (node.previousElementSibling && node.previousElementSibling.innerText) {
        parts.push(node.previousElementSibling.innerText.slice(0, 500));
      }
      node = node.parentElement;
    }
    return normalize(parts.filter(Boolean).join(' '));
  }

  function scoreRule(ruleItem, text) {
    if (!text) return 0;
    let score = 0;
    if (text.includes(ruleItem.sectionText)) score += 80;
    ruleItem.labels.forEach((label) => {
      if (text.includes(label)) score += 28;
    });
    if (text.includes(compact(ruleItem.path).replace(/\./g, ' '))) score += 120;
    if (score && SECTION_ORDER.includes(ruleItem.path.split('.')[0])) {
      score += SECTION_ORDER.length - SECTION_ORDER.indexOf(ruleItem.path.split('.')[0]);
    }
    return score;
  }

  function pathFromText(target) {
    const text = getTextNearTarget(target);
    const scored = FIELD_RULES
      .map((item) => ({ item, score: scoreRule(item, text) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);
    return scored[0]?.item.path || '';
  }

  function pathFromTarget(target) {
    return pathFromValue(target) || pathFromAttributes(target) || pathFromText(target) || activePath;
  }

  function scheduleSync() {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(sendPreviewState, 80);
  }

  function setActivePath(path) {
    if (!path || path === activePath) {
      scheduleSync();
      return;
    }
    activePath = path;
    scheduleSync();
  }

  function sendPreviewState() {
    if (!latestContent) return;
    document.querySelectorAll('.tangram-live-preview__frame').forEach((frame) => {
      if (!frame.contentWindow) return;
      frame.contentWindow.postMessage({
        type: 'tangram:preview-content',
        content: latestContent,
        activePath
      }, window.location.origin);
    });
  }

  function handleEditorFocus(event) {
    const target = event.target;
    if (!target || !/^(INPUT|TEXTAREA|SELECT|BUTTON|LABEL|SUMMARY)$/.test(target.tagName)) return;
    setActivePath(pathFromTarget(target));
  }

  function handleEditorInput(event) {
    const target = event.target;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) {
      setActivePath(pathFromTarget(target));
    }
  }

  function handleEditorScroll() {
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(() => {
      const pane = findEditorPane();
      if (!pane) return;
      const target = findNearestEditableField(pane);
      const path = pathFromTarget(target);
      if (path) setActivePath(path);
    }, 120);
  }

  function findNearestEditableField(pane) {
    const paneRect = pane.getBoundingClientRect();
    const centerY = paneRect.top + paneRect.height * 0.42;
    const fields = Array.from(pane.querySelectorAll('input, textarea, select, button, label, summary')).filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 8
        && rect.height > 8
        && rect.bottom >= paneRect.top
        && rect.top <= paneRect.bottom
        && rect.left >= paneRect.left - 20
        && rect.right <= paneRect.right + 20;
    });

    return fields
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { element, distance: Math.abs((rect.top + rect.bottom) / 2 - centerY) };
      })
      .sort((a, b) => a.distance - b.distance)[0]?.element || pane;
  }

  function findEditorPane() {
    const preview = document.querySelector('.tangram-live-preview');
    const previewRect = preview?.getBoundingClientRect();
    const maxRight = previewRect ? previewRect.left + 12 : window.innerWidth * 0.62;

    const candidates = Array.from(document.querySelectorAll('body *')).filter((element) => {
      const rect = element.getBoundingClientRect();
      return element.scrollHeight > element.clientHeight + 120
        && rect.width > 280
        && rect.height > 300
        && rect.left < maxRight
        && rect.right <= maxRight + 80;
    });

    return candidates.sort((a, b) => (b.clientHeight * b.clientWidth) - (a.clientHeight * a.clientWidth))[0] || null;
  }

  function setupScrollSync() {
    if (scrollSyncReady) return;
    const pane = findEditorPane();
    if (!pane) return;
    scrollSyncReady = true;
    pane.addEventListener('scroll', handleEditorScroll, { passive: true });
    window.addEventListener('scroll', handleEditorScroll, { passive: true });
  }

  function setupEditorBridge() {
    if (window.__tangramEditorBridgeReady) return;
    window.__tangramEditorBridgeReady = true;
    document.addEventListener('focusin', handleEditorFocus, true);
    document.addEventListener('input', handleEditorInput, true);
    document.addEventListener('change', handleEditorInput, true);
    document.addEventListener('click', handleEditorFocus, true);
    document.addEventListener('scroll', handleEditorScroll, true);
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'tangram:preview-ready') sendPreviewState();
    });
    window.setTimeout(setupScrollSync, 700);
    window.setTimeout(setupScrollSync, 1800);
    window.setTimeout(setupScrollSync, 3200);
  }

  function SitePreview({ entry }) {
    latestContent = entryToContent(entry);
    latestValueIndex = indexContentValues(latestContent);
    setupEditorBridge();
    window.setTimeout(sendPreviewState, 0);
    window.setTimeout(setupScrollSync, 0);

    return h('div', { className: 'tangram-live-preview' },
      h('div', { className: 'tangram-live-preview__bar' },
        h('div', null,
          h('strong', null, 'Preview do site real'),
          h('span', null, activePath ? `Campo ativo: ${activePath}` : 'Selecione um campo para destacar no site')
        ),
        h('div', { className: 'tangram-live-preview__status' }, 'Estrutura travada')
      ),
      h('iframe', {
        className: 'tangram-live-preview__frame',
        title: 'Preview visual do site Tangram',
        src: PREVIEW_URL,
        onLoad: sendPreviewState
      })
    );
  }

  window.CMS.registerPreviewStyle('/admin/admin.css');
  window.CMS.registerPreviewTemplate('site', SitePreview);
})();
