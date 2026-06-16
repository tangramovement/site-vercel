(function () {
  const h = window.h || (window.React && window.React.createElement);
  if (!window.CMS || !h) return;

  const PREVIEW_URL = '/';

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
    rule('about.eyebrow', 'Quem Somos', ['Eyebrow']),
    rule('about.title', 'Quem Somos', ['Titulo']),
    rule('about.text', 'Quem Somos', ['Texto']),

    rule('tags', 'Tags', ['Tags']),

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
    rule('links.email', 'Links globais', ['Email'])
  ];

  const KNOWN_PATHS = FIELD_RULES.map((item) => item.path);
  const SECTION_ORDER = [
    'menu',
    'hero',
    'agenda',
    'highlights',
    'about',
    'tags',
    'movement',
    'partners',
    'purpose',
    'faq',
    'footer',
    'links'
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
      highlightFramePath(frame, activePath);
    });
  }

  function highlightFramePath(frame, path) {
    const doc = frame && frame.contentDocument;
    if (!doc || !path) return;
    ensureFrameHighlightUi(doc);
    clearFrameHighlight(doc);

    const target = findFrameTarget(doc, path);
    const marker = doc.getElementById('tangram-admin-preview-marker');
    if (!target || !marker) {
      if (marker) marker.classList.remove('is-visible');
      return;
    }

    target.setAttribute('data-tangram-admin-preview-active', 'true');
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    window.setTimeout(() => positionFrameMarker(doc, target, path), 220);
    window.setTimeout(() => positionFrameMarker(doc, target, path), 720);
  }

  function ensureFrameHighlightUi(doc) {
    if (!doc.getElementById('tangram-admin-preview-style')) {
      const style = doc.createElement('style');
      style.id = 'tangram-admin-preview-style';
      style.textContent = `
        [data-tangram-admin-preview-active="true"] {
          outline: 3px solid #a970ff !important;
          outline-offset: 6px !important;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, .18), 0 0 28px rgba(169, 112, 255, .9) !important;
          position: relative !important;
          z-index: 2147483000 !important;
        }
        #tangram-admin-preview-marker {
          position: fixed;
          z-index: 2147483647;
          display: none;
          max-width: 360px;
          padding: 8px 10px;
          border-radius: 10px;
          background: #a970ff;
          color: #080808;
          font: 700 12px/1.25 Arial, sans-serif;
          box-shadow: 0 14px 40px rgba(0, 0, 0, .35);
          pointer-events: none;
        }
        #tangram-admin-preview-marker.is-visible {
          display: block;
        }
        #tangram-admin-preview-marker span {
          display: block;
          margin-top: 3px;
          max-width: 340px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 500;
          opacity: .82;
        }
      `;
      doc.head.appendChild(style);
    }

    if (!doc.getElementById('tangram-admin-preview-marker')) {
      const marker = doc.createElement('div');
      marker.id = 'tangram-admin-preview-marker';
      doc.body.appendChild(marker);
    }

    if (!doc.defaultView.__tangramAdminPreviewScrollReady) {
      doc.defaultView.__tangramAdminPreviewScrollReady = true;
      doc.defaultView.addEventListener('scroll', () => {
        const active = doc.querySelector('[data-tangram-admin-preview-active="true"]');
        if (active && active.__tangramAdminPreviewPath) {
          positionFrameMarker(doc, active, active.__tangramAdminPreviewPath);
        }
      }, { passive: true });
    }
  }

  function clearFrameHighlight(doc) {
    doc.querySelectorAll('[data-tangram-admin-preview-active]').forEach((element) => {
      element.removeAttribute('data-tangram-admin-preview-active');
    });
  }

  function positionFrameMarker(doc, target, path) {
    const marker = doc.getElementById('tangram-admin-preview-marker');
    if (!marker || !target) return;
    target.__tangramAdminPreviewPath = path;
    const rect = target.getBoundingClientRect();
    const href = target.closest && target.closest('a[href]')?.getAttribute('href');
    marker.textContent = labelForPath(path);
    if (href) {
      const link = doc.createElement('span');
      link.textContent = href;
      marker.appendChild(link);
    }
    marker.style.top = `${Math.max(12, rect.top - 38)}px`;
    marker.style.left = `${Math.max(12, Math.min(rect.left, doc.defaultView.innerWidth - 380))}px`;
    marker.classList.add('is-visible');
  }

  function labelForPath(path) {
    const ruleItem = FIELD_RULES.find((item) => path === item.path || path.startsWith(`${item.path}.`) || item.path.startsWith(`${path}.`));
    return ruleItem ? `${ruleItem.section}: ${path}` : `Campo editavel: ${path}`;
  }

  function findFrameTarget(doc, path) {
    const value = valueForPath(path);
    const normalizedValue = normalize(value);
    const stringValue = String(value || '').trim();

    if (path.startsWith('agenda.events.')) {
      const index = Number(path.split('.')[2]);
      const links = Array.from(doc.querySelectorAll('.tangram-ticket-link, a[href*="ingresse"], a[href*="wa.me"]'));
      if (links[index]) return links[index];
    }

    if (path === 'links.instagram') {
      return doc.querySelector('a[href*="instagram.com"]');
    }

    if (path === 'links.email') {
      return doc.querySelector('a[href^="mailto:"]') || findTextTarget(doc, normalizedValue);
    }

    if (path.startsWith('movement.form.')) {
      return findFormTarget(doc, stringValue, normalizedValue);
    }

    if (/Url$|url$|links\.whatsapp|links\.instagram/.test(path) && stringValue) {
      const byHref = Array.from(doc.querySelectorAll('a[href]')).find((anchor) => anchor.getAttribute('href') === stringValue);
      if (byHref) return byHref;
    }

    return findTextTarget(doc, normalizedValue) || findSectionFallback(doc, path);
  }

  function valueForPath(path) {
    const direct = getPath(latestContent, path);
    if (direct !== undefined && direct !== null && direct !== '') return pick(direct);
    const parts = path.split('.');
    while (parts.length > 1) {
      parts.pop();
      const parent = getPath(latestContent, parts.join('.'));
      const value = firstTextValue(parent);
      if (value) return value;
    }
    return '';
  }

  function getPath(source, path) {
    return String(path || '').split('.').reduce((acc, key) => {
      if (acc === undefined || acc === null) return undefined;
      return acc[key];
    }, source);
  }

  function pick(value) {
    if (value === undefined || value === null) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (value.pt || value.en) return value.pt || value.en || '';
    return firstTextValue(value);
  }

  function firstTextValue(value) {
    if (value === undefined || value === null) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (Array.isArray(value)) {
      for (const item of value) {
        const found = firstTextValue(item);
        if (found) return found;
      }
      return '';
    }
    if (typeof value === 'object') {
      if (value.pt || value.en) return value.pt || value.en || '';
      for (const key of Object.keys(value)) {
        const found = firstTextValue(value[key]);
        if (found) return found;
      }
    }
    return '';
  }

  function findFormTarget(doc, stringValue, normalizedValue) {
    const fields = Array.from(doc.querySelectorAll('input, textarea, select, button, label'));
    return fields.find((field) => {
      const text = normalize([
        field.getAttribute('placeholder'),
        field.getAttribute('aria-label'),
        field.textContent,
        field.value
      ].filter(Boolean).join(' '));
      return normalizedValue && text.includes(normalizedValue);
    }) || fields[0] || null;
  }

  function findTextTarget(doc, normalizedValue) {
    if (!normalizedValue) return null;
    const candidates = Array.from(doc.querySelectorAll('p,h1,h2,h3,h4,h5,h6,span,a,button,label,summary')).filter((element) => {
      if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) return false;
      if (element.children.length > 0 && !element.matches('a,button,label,summary')) return false;
      const text = normalize(element.textContent);
      return text && (text === normalizedValue || text.includes(normalizedValue) || normalizedValue.includes(text));
    });
    return candidates
      .map((element) => ({ element, score: scoreFrameCandidate(element, normalizedValue) }))
      .sort((a, b) => b.score - a.score)[0]?.element || null;
  }

  function scoreFrameCandidate(element, normalizedValue) {
    const text = normalize(element.textContent);
    const rect = element.getBoundingClientRect();
    let score = text === normalizedValue ? 1000 : 200;
    if (element.offsetParent === null && element !== element.ownerDocument.documentElement) score -= 1000;
    if (/^(H1|H2|H3)$/.test(element.tagName)) score += 100;
    score -= Math.max(0, rect.top) / 10;
    return score;
  }

  function findSectionFallback(doc, path) {
    const section = String(path || '').split('.')[0];
    const selectorMap = {
      menu: 'nav, header',
      hero: '#hero, [id*="hero"]',
      agenda: '#eventos, .tangram-next-moves-links',
      highlights: 'section',
      about: '#quem-somos',
      movement: 'form, input, textarea',
      partners: '#parceiros',
      purpose: 'section',
      faq: 'details, summary',
      footer: 'footer'
    };
    return doc.querySelector(selectorMap[section] || 'body');
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
