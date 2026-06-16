(function (root) {
  const LANGUAGE_STORAGE_KEY = 'tangram-language';
  const TARGET_LANGUAGE = 'en';
  const TEXT_SELECTOR = 'p,h1,h2,h3,h4,h5,h6,span,a,button,label,summary,option';

  const bindings = [];

  const groups = {
    menu: 'Menu',
    hero: 'Hero',
    agenda: 'Agenda',
    highlights: 'Highlights',
    about: 'Quem Somos',
    experienceCards: 'Cards de experiencia',
    founders: 'Fundadores',
    tags: 'Tags',
    movement: 'Movimento Vivo',
    partners: 'Parceiros',
    purpose: 'Proposito',
    faq: 'FAQ',
    footer: 'Rodape',
    links: 'Links globais',
    seo: 'Configuracoes tecnicas',
    whatsappMessages: 'Configuracoes tecnicas'
  };

  function add(path, label, options) {
    const rootKey = path.split('.')[0];
    bindings.push(Object.assign({
      path,
      label,
      group: groups[rootKey] || rootKey,
      type: 'text',
      apply: 'text',
      preview: true,
      locator: { kind: 'text' }
    }, options || {}));
  }

  function addI18n(path, label, options) {
    add(path, label, Object.assign({ type: 'i18n_string' }, options || {}));
  }

  function addI18nText(path, label, options) {
    add(path, label, Object.assign({ type: 'i18n_text' }, options || {}));
  }

  function addUrl(path, label, selector, options) {
    add(path, label, Object.assign({
      type: 'url',
      apply: 'href',
      locator: { kind: 'href', selector }
    }, options || {}));
  }

  function addPlaceholder(path, label, selector) {
    add(path, label, {
      type: 'i18n_string',
      apply: 'placeholder',
      locator: { kind: 'selector', selector }
    });
  }

  [
    ['menu.about', 'Quem Somos'],
    ['menu.events', 'Eventos'],
    ['menu.partners', 'Parceiros'],
    ['menu.instagram', 'Instagram'],
    ['menu.contact', 'Fale conosco']
  ].forEach(([path, label]) => addI18n(path, label, { locator: { kind: 'menu' } }));

  addI18n('hero.title', 'Titulo', { locator: { kind: 'selector', selector: '.tangram-next-moves-title, .tangram-tablet-next-moves__title' } });
  addI18n('hero.tickets', 'Texto Tickets');
  addI18n('hero.loading', 'Texto loading', {
    apply: 'none',
    preview: false
  });

  addI18n('agenda.introLabel', 'Chamada', { preview: false });
  addI18n('agenda.introTitle', 'Titulo', { preview: false });
  for (let index = 0; index < 3; index += 1) {
    add(`agenda.events.${index}.active`, `Evento ${index + 1}: ativo`, {
      type: 'boolean',
      apply: 'none',
      preview: false,
      locator: { kind: 'none' }
    });
    add(`agenda.events.${index}.date`, `Evento ${index + 1}: data`, {
      type: 'string',
      apply: 'none',
      preview: false,
      locator: { kind: 'none' }
    });
    addI18n(`agenda.events.${index}.place`, `Evento ${index + 1}: local`, {
      apply: 'none',
      preview: false,
      locator: { kind: 'none' }
    });
    addI18n(`agenda.events.${index}.title`, `Evento ${index + 1}: artista`, {
      apply: 'none',
      preview: false,
      locator: { kind: 'none' }
    });
    addI18n(`agenda.events.${index}.lineup`, `Evento ${index + 1}: lineup`, {
      apply: 'none',
      preview: false,
      locator: { kind: 'none' }
    });
    addI18n(`agenda.events.${index}.ticketLabel`, `Evento ${index + 1}: texto do botao`, {
      apply: 'agenda',
      locator: { kind: 'agenda-event', index }
    });
    addUrl(`agenda.events.${index}.ticketUrl`, `Evento ${index + 1}: link do ingresso`, null, {
      apply: 'agenda-href',
      locator: { kind: 'agenda-event', index }
    });
  }

  addI18n('highlights.title', 'Titulo', { aliases: ['HIGHLIGHTS', 'HIGHLITS'] });
  addI18n('about.eyebrow', 'Eyebrow');
  addI18n('about.title', 'Titulo');
  addI18nText('about.text', 'Texto');

  ['Musica', 'Moda', 'Exposicoes Artisticas', 'Visual e Projecoes'].forEach((label, index) => {
    addI18n(`experienceCards.${index}.title`, `${label}: titulo`);
    addI18nText(`experienceCards.${index}.text`, `${label}: texto`);
  });

  ['Ber Fontoura', 'Marian Flow', 'Clari Ann'].forEach((label, index) => {
    addI18n(`founders.${index}.name`, `${label}: nome`);
    addI18nText(`founders.${index}.bio`, `${label}: bio`);
    addI18n(`founders.${index}.presskitLabel`, `${label}: texto do botao`);
    addUrl(`founders.${index}.presskitUrl`, `${label}: link do Presskit`, null, {
      preview: index !== 2,
      locator: { kind: 'founder-link', index }
    });
  });

  for (let index = 0; index < 10; index += 1) {
    addI18n(`tags.${index}`, `Tag ${index + 1}`);
  }

  addI18n('movement.title', 'Titulo');
  addI18nText('movement.text', 'Texto');
  addI18n('movement.contactTitle', 'Titulo contato');
  addI18nText('movement.contactText', 'Texto contato');
  addI18nText('movement.supportText', 'Texto apoio');
  addPlaceholder('movement.form.name', 'Formulario: nome', 'input[name="name"], input[placeholder*="Nome"], input[placeholder*="Name"]');
  addPlaceholder('movement.form.email', 'Formulario: email', 'input[name="email"], input[type="email"]');
  addPlaceholder('movement.form.phone', 'Formulario: telefone', 'input[name="phone"], input[placeholder*="Telefone"], input[placeholder*="Phone"]');
  addPlaceholder('movement.form.location', 'Formulario: local', 'input[name="location"], input[placeholder*="Local"], input[placeholder*="Location"]');
  addI18n('movement.form.select', 'Formulario: select', {
    apply: 'form-select',
    locator: { kind: 'selector', selector: 'select, .framer-form-select-wrapper select' }
  });
  addI18n('movement.form.submit', 'Formulario: botao', {
    locator: { kind: 'form-submit' }
  });

  addI18n('partners.eyebrow', 'Eyebrow');
  addI18n('partners.title', 'Titulo');
  addI18nText('partners.text', 'Texto');
  addI18n('partners.cta', 'Botao');

  addI18n('purpose.eyebrow', 'Eyebrow');
  addI18n('purpose.title', 'Titulo');
  addI18nText('purpose.text', 'Texto');
  for (let index = 0; index < 5; index += 1) {
    addI18n(`purpose.pillars.${index}.title`, `Pilar ${index + 1}: titulo`);
    addI18nText(`purpose.pillars.${index}.text`, `Pilar ${index + 1}: texto`);
  }

  addI18n('faq.eyebrow', 'Eyebrow');
  addI18n('faq.title', 'Titulo');
  addI18nText('faq.intro', 'Intro');
  for (let index = 0; index < 3; index += 1) {
    addI18n(`faq.ctaLines.${index}`, `CTA linha ${index + 1}`);
  }
  for (let index = 0; index < 6; index += 1) {
    addI18n(`faq.items.${index}.question`, `Pergunta ${index + 1}`, {
      previewLocator: { kind: 'faq-item', index }
    });
    addI18nText(`faq.items.${index}.answer`, `Resposta ${index + 1}`, {
      previewLocator: { kind: 'faq-item', index }
    });
  }

  addI18n('footer.headline', 'Frase');
  addI18n('footer.cta', 'Botao');
  addI18n('footer.location', 'Local');
  addI18n('footer.copyright', 'Copyright', { aliases: ['All rights reserved, ©2025', 'All rights reserved, ©2026'] });

  addUrl('links.instagram', 'Instagram', 'a[href*="instagram.com"]');
  add('links.whatsappPhone', 'Telefone WhatsApp', {
    type: 'phone',
    apply: 'whatsapp',
    preview: false,
    locator: { kind: 'none' }
  });
  addUrl('links.whatsappBio', 'Link WhatsApp bio', 'a[href*="wa.me"], a[href*="whatsapp"]', {
    apply: 'whatsapp'
  });
  add('links.email', 'Email', {
    type: 'email',
    apply: 'email',
    locator: { kind: 'selector', selector: 'a[href^="mailto:"]' }
  });

  addI18n('seo.title', 'SEO: titulo', { apply: 'meta', preview: false });
  addI18nText('seo.description', 'SEO: descricao', { apply: 'meta', preview: false });
  add('seo.socialImage', 'SEO: imagem social', { type: 'url', apply: 'meta', preview: false });

  ['contact', 'partner', 'start', 'lastNight', 'faq'].forEach((key) => {
    addI18nText(`whatsappMessages.${key}`, `WhatsApp: ${key}`, {
      apply: 'whatsapp',
      preview: false,
      locator: { kind: 'none' }
    });
  });

  function repairMojibake(value) {
    const text = String(value || '');
    if (!/[ÃƒÃ‚Ã¢Ã°]/.test(text)) return text;
    try {
      return decodeURIComponent(escape(text));
    } catch (_error) {
      return text;
    }
  }

  function normalize(value) {
    return repairMojibake(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function visible(element) {
    if (!element || !element.ownerDocument || !element.getBoundingClientRect) return false;
    const style = element.ownerDocument.defaultView.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none'
      && style.visibility !== 'hidden'
      && Number(style.opacity) !== 0
      && rect.width > 0
      && rect.height > 0;
  }

  function isLeafTextElement(element) {
    if (!element || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT'].includes(element.tagName)) return false;
    if (element.children.length === 0) return true;
    return element.matches('a,button,label,summary,option') && element.querySelectorAll('p,h1,h2,h3,h4,h5,h6,span,div').length === 0;
  }

  function getPath(source, path) {
    return String(path || '').split('.').reduce((acc, key) => {
      if (acc === undefined || acc === null || key === '') return undefined;
      return acc[key];
    }, source);
  }

  function setPath(source, path, value) {
    const parts = String(path || '').split('.');
    let cursor = source;
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        cursor[part] = value;
        return;
      }
      if (!cursor[part] || typeof cursor[part] !== 'object') cursor[part] = /^\d+$/.test(parts[index + 1]) ? [] : {};
      cursor = cursor[part];
    });
    return source;
  }

  function currentLanguage(doc) {
    const storage = root.localStorage;
    const documentElement = doc && doc.documentElement;
    const htmlLang = documentElement && String(documentElement.lang || '').toLowerCase();
    if (storage && storage.getItem(LANGUAGE_STORAGE_KEY) === TARGET_LANGUAGE) return 'en';
    if (htmlLang && htmlLang.startsWith('en')) return 'en';
    return 'pt';
  }

  function localize(value, language) {
    if (value === undefined || value === null) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (value[language]) return String(value[language]);
    if (value.pt) return String(value.pt);
    if (value.en) return String(value.en);
    return '';
  }

  function valueFor(content, path, language) {
    return localize(getPath(content, path), language);
  }

  function getBinding(path) {
    return bindings.find((binding) => binding.path === path) || null;
  }

  function findTextTarget(doc, value, path, aliases, options) {
    const wantedValues = [value].concat(aliases || []).map(normalize).filter(Boolean);
    if (!wantedValues.length) return null;

    const exactKey = doc.querySelector(`[data-tangram-content-key="${cssEscape(path)}"]`);
    if (exactKey && (options?.allowHidden || visible(exactKey))) {
      const current = normalize(exactKey.textContent);
      const stillMatches = wantedValues.some((wanted) => current === wanted || (wanted.length >= 14 && current.includes(wanted)));
      if (stillMatches) return exactKey;
    }

    const candidates = Array.from(doc.querySelectorAll(TEXT_SELECTOR)).filter((element) => {
      if (!isLeafTextElement(element)) return false;
      if (!options?.allowHidden && !visible(element)) return false;
      if (options?.multiline && /^(H1|H2|H3|H4|H5|H6)$/.test(element.tagName)) return false;
      const text = normalize(element.textContent);
      if (!text) return false;
      const linkAncestor = element.closest('a[href]');
      const linkAllowed = path.startsWith('menu.')
        || path.startsWith('footer.')
        || path.includes('cta')
        || path.includes('ctaLines')
        || path.includes('presskitLabel')
        || path.includes('ticketLabel');
      if (linkAncestor && !linkAllowed) return false;
      if (wantedValues.some((wanted) => wanted.length < 14)) {
        return wantedValues.some((wanted) => text === wanted);
      }
      if (element.matches('a[href]') && !path.startsWith('menu.') && !path.includes('cta') && !path.includes('ctaLines') && !path.includes('presskitLabel') && !path.includes('ticketLabel') && !path.startsWith('footer.')) {
        return wantedValues.some((wanted) => text === wanted);
      }
      return wantedValues.some((wanted) => text === wanted || (wanted.length >= 14 && text.includes(wanted)));
    });

    return candidates
      .map((element) => {
        const text = normalize(element.textContent);
        const rect = element.getBoundingClientRect();
        let score = wantedValues.includes(text) ? 1000 : 100;
        if (/^(H1|H2|H3)$/.test(element.tagName)) score += 60;
        if (element.matches('a,button,summary,label')) score += 20;
        score -= Math.max(0, rect.top) / 80;
        return { element, score };
      })
      .sort((a, b) => b.score - a.score)[0]?.element || null;
  }

  function findMenuTarget(doc, value) {
    const wanted = normalize(value);
    if (!wanted) return null;

    const selectors = [
      '.framer-11n6lfm-container a',
      '.framer-11n6lfm-container button',
      'header a',
      'header button',
      'nav a',
      'nav button'
    ];

    return Array.from(doc.querySelectorAll(selectors.join(',')))
      .filter((element) => visible(element) && normalize(element.textContent) === wanted)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)[0] || null;
  }

  function findAgendaTarget(doc, index) {
    // 1st priority: ticket links stamped by applyAgenda with data attribute
    const byKey = Array.from(doc.querySelectorAll(`[data-tangram-content-key="agenda.events.${index}.ticketLabel"]`))
      .filter(visible);
    if (byKey.length) return byKey[0];

    // 2nd priority: ticket links inside the generated wrapper
    const directLinks = Array.from(doc.querySelectorAll('.tangram-next-moves-links .tangram-ticket-link, .tangram-next-moves-links a'))
      .filter(visible);
    if (directLinks.length) return directLinks[index] || directLinks[0] || null;

    // 3rd priority: standalone ticket links outside nav/header
    const standaloneLinks = Array.from(doc.querySelectorAll('.tangram-ticket-link'))
      .filter((anchor) => visible(anchor) && !anchor.closest('header, nav, .framer-11n6lfm-container'));
    if (standaloneLinks.length) return standaloneLinks[index] || standaloneLinks[0] || null;

    return null;
  }

  function findFounderLink(doc, index) {
    const links = Array.from(doc.querySelectorAll('a[href*="drive.google.com"], a'))
      .filter((anchor) => visible(anchor) && normalize(anchor.textContent).includes('presskit'));
    return links[index] || null;
  }

  function findFaqItem(doc, index) {
    const summaries = Array.from(doc.querySelectorAll('summary, [role="button"], h3, h4, p'))
      .filter((element) => visible(element) && /^o |^como |^quais |^quem |^posso |^does |^what |^who |^can /i.test(normalize(element.textContent)));
    return summaries[index] || null;
  }

  function findFormSubmit(doc) {
    return Array.from(doc.querySelectorAll('button, input[type="submit"], a'))
      .filter(visible)
      .find((element) => /enviar|submit/.test(normalize(element.textContent || element.value))) || null;
  }

  function findTarget(doc, bindingOrPath, content, options) {
    const binding = typeof bindingOrPath === 'string' ? getBinding(bindingOrPath) : bindingOrPath;
    if (!doc || !binding) return null;

    const locator = options?.mode === 'preview' && binding.previewLocator ? binding.previewLocator : binding.locator;
    const language = currentLanguage(doc);
    const contentValue = content ? valueFor(content, binding.path, language) : '';

    if (locator?.kind === 'none') return null;
    if (locator?.kind === 'menu') return findMenuTarget(doc, contentValue);
    if (locator?.kind === 'agenda-event') return findAgendaTarget(doc, locator.index);
    if (locator?.kind === 'founder-link') return findFounderLink(doc, locator.index);
    if (locator?.kind === 'faq-item') return findFaqItem(doc, locator.index);
    if (locator?.kind === 'form-submit') return findFormSubmit(doc);

    if (locator?.selector) {
      const bySelector = doc.querySelector(locator.selector);
      if (bySelector && (options?.mode === 'apply' || visible(bySelector))) return bySelector;
    }

    if (binding.apply === 'href' || locator?.kind === 'href') {
      const href = contentValue || getPath(root.__tangramContent || {}, binding.path);
      if (href) {
        const byHref = Array.from(doc.querySelectorAll('a[href]')).find((anchor) => anchor.getAttribute('href') === href);
        if (byHref && visible(byHref)) return byHref;
      }
      if (binding.path.includes('instagram')) return doc.querySelector('a[href*="instagram.com"]');
    }

    if (binding.apply === 'placeholder') {
      const byPlaceholder = Array.from(doc.querySelectorAll('input[placeholder], textarea[placeholder]'))
        .find((field) => normalize(field.getAttribute('placeholder')) === normalize(contentValue));
      if (byPlaceholder) return byPlaceholder;
    }

    return findTextTarget(doc, contentValue, binding.path, binding.aliases, {
      allowHidden: options?.mode === 'apply',
      multiline: binding.type === 'i18n_text'
    });
  }

  function setText(element, value, path) {
    if (!element || !value) return;
    element.dataset.tangramContentKey = path;
    if (element.textContent !== value) element.textContent = value;
  }

  function applyAgenda(doc, content) {
    const language = currentLanguage(doc);
    const events = (getPath(content, 'agenda.events') || []).filter((event) => event && event.active !== false);
    doc.querySelectorAll('.tangram-next-moves-links').forEach((wrapper) => {
      wrapper.innerHTML = '';
      events.forEach((event, index) => {
        const link = doc.createElement('a');
        link.className = `tangram-ticket-link${index === events.length - 1 ? ' tangram-ticket-link--loading' : ''}`;
        link.href = event.ticketUrl || getPath(content, 'links.whatsappBio') || '#';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.dataset.tangramContentKey = `agenda.events.${index}.ticketLabel`;
        link.textContent = localize(event.ticketLabel, language) || [event.date, localize(event.place, language), localize(event.title, language)].filter(Boolean).join(' | ');
        wrapper.appendChild(link);
      });
    });

    const fallback = doc.querySelector('.tangram-tablet-next-moves__loading');
    if (fallback) {
      const event = events[events.length - 1] || events[0];
      fallback.href = event?.ticketUrl || getPath(content, 'links.whatsappBio') || fallback.href;
      fallback.textContent = localize(getPath(content, 'hero.loading'), language) || fallback.textContent;
      fallback.dataset.tangramContentKey = 'hero.loading';
    }
  }

  function setMeta(doc, attr, key, value) {
    if (!value) return;
    const element = doc.querySelector(`meta[${attr}="${key}"]`);
    if (element) element.setAttribute('content', value);
  }

  function applySeo(doc, content) {
    const language = currentLanguage(doc);
    const title = valueFor(content, 'seo.title', language);
    const description = valueFor(content, 'seo.description', language);
    const socialImage = getPath(content, 'seo.socialImage');
    if (title) doc.title = title;
    setMeta(doc, 'name', 'description', description);
    setMeta(doc, 'property', 'og:title', title);
    setMeta(doc, 'property', 'og:description', description);
    setMeta(doc, 'name', 'twitter:title', title);
    setMeta(doc, 'name', 'twitter:description', description);
    if (socialImage) {
      setMeta(doc, 'property', 'og:image', socialImage);
      setMeta(doc, 'name', 'twitter:image', socialImage);
    }
  }

  function whatsappUrl(content, context) {
    const phone = getPath(content, 'links.whatsappPhone');
    if (!phone) return '';
    const language = currentLanguage(root.document || document);
    const message = getPath(content, `whatsappMessages.${context}.${language}`)
      || getPath(content, `whatsappMessages.contact.${language}`)
      || '';
    const url = new URL('https://api.whatsapp.com/send/');
    url.searchParams.set('phone', phone);
    url.searchParams.set('text', message);
    return url.toString();
  }

  function whatsappContext(anchor) {
    const text = normalize(anchor.textContent);
    const href = anchor.getAttribute('href') || '';
    if (text.includes('last night') || text.includes('loofy') || href.includes('A2ZXZZRCLLZTP1')) return 'lastNight';
    if (text.includes('parceiro') || text.includes('partner')) return 'partner';
    if (text.includes('iniciar') || text.includes('start movement')) return 'start';
    if (text.includes('voce e') || text.includes('you are') || text.includes('peca')) return 'faq';
    return 'contact';
  }

  function applyLinks(doc, content) {
    const instagram = getPath(content, 'links.instagram');
    if (instagram) {
      doc.querySelectorAll('a[href*="instagram.com"]').forEach((anchor) => {
        anchor.href = instagram;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
      });
    }

    const email = getPath(content, 'links.email');
    if (email) {
      doc.querySelectorAll('a[href^="mailto:"]').forEach((anchor) => {
        anchor.href = `mailto:${email}`;
        anchor.textContent = email;
        anchor.dataset.tangramContentKey = 'links.email';
      });
    }

    doc.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]').forEach((anchor) => {
      const url = whatsappUrl(content, whatsappContext(anchor));
      if (!url) return;
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    });
  }

  function applyBinding(doc, content, binding) {
    const language = currentLanguage(doc);
    const value = valueFor(content, binding.path, language);
    if (binding.apply === 'none' || binding.apply === 'agenda' || binding.apply === 'agenda-href' || binding.apply === 'meta' || binding.apply === 'whatsapp') return true;
    if (!value) return false;

    const target = findTarget(doc, binding, content, { mode: 'apply' });
    if (!target) return false;

    if (binding.apply === 'href') {
      target.setAttribute('href', value);
      target.dataset.tangramContentKey = binding.path;
      return true;
    }

    if (binding.apply === 'email') {
      target.setAttribute('href', `mailto:${value}`);
      setText(target, value, binding.path);
      return true;
    }

    if (binding.apply === 'placeholder') {
      target.setAttribute('placeholder', value);
      target.dataset.tangramContentKey = binding.path;
      return true;
    }

    if (binding.apply === 'form-select') {
      const option = target.querySelector('option[disabled], option[value=""], option:first-child') || target;
      option.textContent = value;
      option.dataset.tangramContentKey = binding.path;
      return true;
    }

    setText(target, value, binding.path);
    return true;
  }

  function applyAll(doc, content, options) {
    if (!doc || !content) return { applied: 0, missing: [] };
    root.__tangramContent = content;
    if (doc && doc.defaultView) {
      doc.defaultView.__tangramContent = content;
      if (typeof doc.defaultView.__tangramTriggerApply === 'function') {
        doc.defaultView.__tangramTriggerApply();
      }
    }
    let applied = 0;
    const missing = [];

    if (options?.mode === 'preview') {
      doc.documentElement.dataset.tangramContent = 'ready';
      return { applied, missing };
    }

    applySeo(doc, content);
    applyAgenda(doc, content);
    applyLinks(doc, content);

    bindings.forEach((binding) => {
      const ok = applyBinding(doc, content, binding);
      if (ok) applied += 1;
      if (!ok && binding.preview !== false && binding.apply !== 'none') missing.push(binding.path);
    });

    doc.documentElement.dataset.tangramContent = 'ready';
    return { applied, missing };
  }

  function cssEscape(value) {
    if (root.CSS && root.CSS.escape) return root.CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
  }

  root.TangramBindings = {
    bindings,
    groups,
    getBinding,
    getPath,
    setPath,
    localize,
    normalize,
    repairMojibake,
    currentLanguage,
    valueFor,
    findTarget,
    applyAll,
    applyBinding
  };
})(window);
