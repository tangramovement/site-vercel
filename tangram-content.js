(function () {
  const CONTENT_URL = '/content/site.json';
  const LANGUAGE_STORAGE_KEY = 'tangram-language';
  const TARGET_LANGUAGE = 'en';
  const TEXT_SELECTOR = 'p,h1,h2,h3,h4,h5,h6,span,a,button,label,summary,option,div';
  const APPLY_DELAY = 120;
  const PREVIEW_PARAM = 'tangram-preview';

  let content = null;
  let applying = false;
  let applyTimer = 0;
  let previewMode = false;
  let activePreviewPath = '';
  let previewMarker = null;

  const previewTargetSelectors = {
    'links.instagram': 'a[href*="instagram.com"]',
    'links.whatsappPhone': 'a[href*="api.whatsapp.com"], a[href*="wa.me"]',
    'links.whatsappBio': '[data-tangram-link-key^="agenda.events"], a[href*="wa.me"]',
    'links.email': 'a[href^="mailto:"]',
    whatsappMessages: 'a[href*="api.whatsapp.com"], a[href*="wa.me"]',
    seo: 'html',
    'seo.title': 'html',
    'seo.description': 'html',
    'seo.socialImage': 'html'
  };

  const textBindings = [
    ['menu.about', ['Quem Somos', 'Who We Are']],
    ['menu.events', ['Eventos', 'Events']],
    ['menu.partners', ['Parceiros', 'Partners']],
    ['menu.instagram', ['Instagram']],
    ['menu.contact', ['Fale conosco', 'Contact us']],
    ['hero.title', ['NEXT MOVES', 'NEXT MOVES 👾']],
    ['hero.tickets', ['Tickets']],
    ['hero.loading', ['loading...', 'Loading...']],
    ['highlights.title', ['HIGHLITS', 'HIGHLIGHTS']],
    ['about.eyebrow', ['Ativações', 'Ativacoes', 'Activations']],
    ['about.title', ['QUEM SOMOS', 'WHO WE ARE', 'NEXT MOVES']],
    ['about.text', ['A partir do conceito do Puzzle chinês o Tangram nasce com a proposta transformação, modularidade e co-criação', 'Inspired by the Chinese Tangram puzzle']],
    ['movement.title', ['Movimento Vivo', 'Living Movement']],
    ['movement.text', ['Acreditamos que toda experiência verdadeira reverbera além de si mesma', 'We believe every true experience reverberates beyond itself']],
    ['movement.contactTitle', ['Tangram na sua cidade', 'Tangram in your city']],
    ['movement.contactText', ['Preencha o formulário ao lado e vamos co-criar juntos o próximo movimento', 'Fill out the form and let’s co-create the next movement together']],
    ['movement.supportText', ['Tangram se molda, se encaixa, se transforma', 'Tangram molds itself, fits together and transforms']],
    ['partners.eyebrow', ['Reviews']],
    ['partners.title', ['Parceiros', 'Partners', 'NEXT MOVES']],
    ['partners.text', ['Nossos parceiros são extensões vivas da experiência', 'Our partners are living extensions of the experience']],
    ['partners.cta', ['Quero ser um parceiro', 'I want to be a partner']],
    ['purpose.eyebrow', ['Ativações', 'Ativacoes', 'Activations']],
    ['purpose.title', ['Propósito', 'Proposito', 'Purpose']],
    ['purpose.text', ['Celebrar a beleza da fragmentação', 'Celebrating the beauty of fragmentation']],
    ['faq.eyebrow', ['Tire suas dúvidas', 'Tire suas duvidas', 'Ask your questions']],
    ['faq.title', ['FAQ']],
    ['faq.intro', ['Tudo o que você precisa saber para viver', 'Everything you need to know to live']],
    ['footer.headline', ['É no movimento que a forma encontra sentido.', 'E no movimento que a forma encontra sentido.', 'It is in movement that form finds meaning.']],
    ['footer.cta', ['Iniciar Movimento', 'Start Movement']],
    ['footer.location', ['RIO DE JANEIRO - BRAZIL']],
    ['footer.copyright', ['All rights reserved, ©2025', 'All rights reserved, Â©2025']]
  ];

  const cardAliases = [
    {
      title: ['Música', 'Musica', 'Music'],
      text: ['O som é a peça principal do Tangram', 'Sound is Tangram']
    },
    {
      title: ['Moda', 'Fashion'],
      text: ['No Tangram, o corpo é linguagem', 'At Tangram, the body is language']
    },
    {
      title: ['Exposições Artísticas', 'Exposicoes Artisticas', 'Art Exhibitions'],
      text: ['A arte no Tangram é presença viva', 'Art at Tangram is a living presence']
    },
    {
      title: ['Visual e Projeções', 'Visual e Projecoes', 'Visuals and Projections'],
      text: ['Luz em movimento. As projeções no Tangram', 'Light in motion. Tangram']
    }
  ];

  const founderAliases = [
    {
      name: ['Ber Fontoura'],
      bio: ['Ber Fontoura é nascido em uma familia imersa musicalmente', 'Ber Fontoura was born into a deeply musical family']
    },
    {
      name: ['Marian Flow'],
      bio: ['Formada em Marketing e com passagem pela School of Visual Arts', 'With a background in Marketing']
    },
    {
      name: ['Clari Ann'],
      bio: ['Clari Ann já se apresentou em clubes e festivais prestigiados', 'Clari Ann has performed at renowned clubs']
    }
  ];

  const purposeAliases = [
    {
      title: ['Pertencimento', 'Belonging'],
      text: ['A presença de cada pessoa é parte essencial', 'Each person']
    },
    {
      title: ['Modularidade', 'Modularity'],
      text: ['Cada peça', 'Each piece']
    },
    {
      title: ['Transmutação', 'Transmutation'],
      text: ['A mudança é o que nos mantém vivos', 'Change is what keeps us alive']
    },
    {
      title: ['Sensorialidade', 'Sensoriality'],
      text: ['A linguagem é a experiência', 'Language is the experience']
    },
    {
      title: ['Mistério', 'Misterio', 'Mystery'],
      text: ['Espaço para o enigma', 'Space for enigma']
    }
  ];

  const faqAliases = [
    {
      question: ['O que é o Tangram?', 'O que e o Tangram?', 'What is Tangram?'],
      answer: ['Tangram é um movimento de experiências modulares', 'Tangram is a movement of modular']
    },
    {
      question: ['O Tangram tem um formato fixo?', 'Does Tangram have a fixed format?'],
      answer: ['Não. Tangram é fluidez', 'No. Tangram is fluidity']
    },
    {
      question: ['Quem participa dos eventos do Tangram?', 'Who takes part in Tangram events?'],
      answer: ['Djs, Artistas, Marcas', 'DJs, artists, brands']
    },
    {
      question: ['Posso contratar o Tangram para um evento específico?', 'Can I hire Tangram for a specific event?'],
      answer: ['Sim. Atuamos como criadores', 'Yes. We create tailor-made']
    },
    {
      question: ['Quais são os elementos que vocês usam nas experiências?', 'What elements do you use in the experiences?'],
      answer: ['Trabalhamos com música', 'We work with music']
    },
    {
      question: ['Como posso participar ou colaborar com o Tangram?', 'How can I participate or collaborate with Tangram?'],
      answer: ['Você pode vir como público', 'You can join as audience']
    }
  ];

  function fold(value) {
    return repairMojibake(String(value || ''))
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function repairMojibake(value) {
    if (!/[ÃÂâð]/.test(value)) return value;
    try {
      return decodeURIComponent(escape(value));
    } catch (_error) {
      return value;
    }
  }

  function getPath(source, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), source);
  }

  function isPreviewRequest() {
    return new URLSearchParams(window.location.search).get(PREVIEW_PARAM) === '1';
  }

  function localize(value) {
    const language = localStorage.getItem(LANGUAGE_STORAGE_KEY) === TARGET_LANGUAGE ? 'en' : 'pt';
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[language] || value.pt || value.en || '';
  }

  function isLeafTextElement(element) {
    if (!element || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT'].includes(element.tagName)) return false;
    if (element.children.length === 0) return true;
    return element.matches('a,button,label,summary') && element.querySelectorAll('p,h1,h2,h3,h4,h5,h6,span,div').length === 0;
  }

  function setText(element, value) {
    if (!value || !element) return;
    if (element.textContent !== value) element.textContent = value;
  }

  function findTextElements(key, aliases) {
    const foldedAliases = new Set(aliases.map(fold));
    return Array.from(document.querySelectorAll(TEXT_SELECTOR)).filter((element) => {
      if (!isLeafTextElement(element)) return false;
      if (element.dataset.tangramContentKey) {
        if (element.dataset.tangramContentKey === key) return true;
        if (shouldRebindHeading(element, key)) return true;
        return false;
      }
      const text = fold(element.textContent);
      if (!text) return false;
      for (const alias of foldedAliases) {
        if (text === alias) return true;
        if (alias.length > 8 && (text.startsWith(alias) || alias.startsWith(text))) return true;
      }
      return false;
    });
  }

  function shouldRebindHeading(element, key) {
    const currentKey = element.dataset.tangramContentKey || '';
    if (!/^(H1|H2|H3)$/.test(element.tagName)) return false;
    if (currentKey.startsWith('menu.') && !key.startsWith('menu.')) return true;
    return currentKey === 'hero.title'
      && ((key === 'about.title' && followsSectionEyebrow(element, 'about.eyebrow'))
        || (key === 'partners.title' && followsSectionEyebrow(element, 'partners.eyebrow')));
  }

  function followsSectionEyebrow(element, eyebrowKey) {
    const top = element.getBoundingClientRect().top + window.scrollY;
    return Array.from(document.querySelectorAll(`[data-tangram-content-key="${eyebrowKey}"]`)).some((eyebrow) => {
      const eyebrowTop = eyebrow.getBoundingClientRect().top + window.scrollY;
      return top > eyebrowTop && top - eyebrowTop < 420;
    });
  }

  function bindText(path, aliases) {
    const value = localize(getPath(content, path));
    if (!value) return;
    findTextElements(path, aliases.concat(value)).forEach((element) => {
      element.dataset.tangramContentKey = path;
      setText(element, value);
    });
  }

  function bindArrayItem(basePath, index, field, aliases) {
    const path = `${basePath}.${index}.${field}`;
    const value = localize(getPath(content, path));
    if (!value) return;
    findTextElements(path, aliases.concat(value)).forEach((element) => {
      element.dataset.tangramContentKey = path;
      setText(element, value);
    });
  }

  function applySeo() {
    const title = localize(content.seo?.title);
    const description = localize(content.seo?.description);
    const socialImage = content.seo?.socialImage;
    if (title) document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (socialImage) {
      setMeta('property', 'og:image', socialImage);
      setMeta('name', 'twitter:image', socialImage);
    }
  }

  function setMeta(attr, key, value) {
    if (!value) return;
    const element = document.querySelector(`meta[${attr}="${key}"]`);
    if (element) element.setAttribute('content', value);
  }

  function applyText() {
    textBindings.forEach(([path, aliases]) => bindText(path, aliases));

    (content.experienceCards || []).forEach((_, index) => {
      const aliases = cardAliases[index];
      if (!aliases) return;
      bindArrayItem('experienceCards', index, 'title', aliases.title);
      bindArrayItem('experienceCards', index, 'text', aliases.text);
    });

    (content.founders || []).forEach((_, index) => {
      const aliases = founderAliases[index];
      if (!aliases) return;
      bindArrayItem('founders', index, 'name', aliases.name);
      bindArrayItem('founders', index, 'bio', aliases.bio);
    });

    (content.purpose?.pillars || []).forEach((_, index) => {
      const aliases = purposeAliases[index];
      if (!aliases) return;
      bindArrayItem('purpose.pillars', index, 'title', aliases.title);
      bindArrayItem('purpose.pillars', index, 'text', aliases.text);
    });

    (content.faq?.items || []).forEach((_, index) => {
      const aliases = faqAliases[index];
      if (!aliases) return;
      bindArrayItem('faq.items', index, 'question', aliases.question);
      bindArrayItem('faq.items', index, 'answer', aliases.answer);
    });

    (content.tags || []).forEach((tag, index) => {
      const value = localize(tag);
      if (!value) return;
      const defaults = ['Presença', 'Mistério', 'Luz', 'Música', 'Moda', 'Experiência', 'Corpo', 'House', 'Fragmento', 'Frequência'];
      bindText(`tags.${index}`, [defaults[index], value].filter(Boolean));
    });

    (content.faq?.ctaLines || []).forEach((line, index) => {
      const defaults = ['Você é', 'a peça', 'que faltava'];
      bindText(`faq.ctaLines.${index}`, [defaults[index], valueOrEmpty(line)].filter(Boolean));
    });
  }

  function valueOrEmpty(value) {
    return localize(value) || '';
  }

  function applyAgenda() {
    const events = (content.agenda?.events || []).filter((event) => event.active !== false);
    document.querySelectorAll('.tangram-next-moves-links').forEach((wrapper) => {
      wrapper.innerHTML = '';
      events.forEach((event, index) => {
        const link = document.createElement('a');
        link.className = `tangram-ticket-link${index === events.length - 1 ? ' tangram-ticket-link--loading' : ''}`;
        link.href = event.ticketUrl || content.links?.whatsappBio || '#';
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = localize(event.ticketLabel) || [event.date, localize(event.place), localize(event.title)].filter(Boolean).join(' | ');
        link.dataset.tangramContentKey = `agenda.events.${index}.ticketLabel`;
        link.dataset.tangramLinkKey = `agenda.events.${index}.ticketUrl`;
        wrapper.appendChild(link);
      });
    });

    const fallback = document.querySelector('.tangram-tablet-next-moves__loading');
    if (fallback) {
      const event = events[events.length - 1] || events[0];
      fallback.href = event?.ticketUrl || content.links?.whatsappBio || fallback.href;
      fallback.textContent = localize(content.hero?.loading) || fallback.textContent;
      fallback.dataset.tangramContentKey = 'hero.loading';
      fallback.dataset.tangramLinkKey = 'agenda.events.ticketUrl';
    }
  }

  function applyLinks() {
    if (content.links?.instagram) {
      document.querySelectorAll('a[href*="instagram.com"]').forEach((anchor) => {
        anchor.href = content.links.instagram;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.dataset.tangramContentKey = 'links.instagram';
        anchor.dataset.tangramLinkKey = 'links.instagram';
      });
    }

    document.querySelectorAll('a[href^="mailto:"]').forEach((anchor) => {
      if (!content.links?.email) return;
      anchor.href = `mailto:${content.links.email}`;
      anchor.textContent = content.links.email;
      anchor.dataset.tangramContentKey = 'links.email';
      anchor.dataset.tangramLinkKey = 'links.email';
    });

    (content.founders || []).forEach((founder, index) => {
      const name = localize(founder.name);
      if (!name) return;
      const card = Array.from(document.querySelectorAll('div,article,section')).find((element) => fold(element.textContent).includes(fold(name)));
      const presskit = Array.from(card?.querySelectorAll('a,button') || []).find((element) => fold(element.textContent).includes('presskit'));
      if (presskit) {
        presskit.textContent = localize(founder.presskitLabel) || 'Presskit';
        if (founder.presskitUrl) {
          presskit.href = founder.presskitUrl;
          presskit.target = '_blank';
          presskit.rel = 'noopener noreferrer';
        }
        presskit.dataset.tangramContentKey = `founders.${index}.presskitLabel`;
        presskit.dataset.tangramLinkKey = `founders.${index}.presskitUrl`;
      }
    });
  }

  function applyWhatsapp() {
    const phone = content.links?.whatsappPhone;
    if (!phone) return;
    const language = localStorage.getItem(LANGUAGE_STORAGE_KEY) === TARGET_LANGUAGE ? 'en' : 'pt';
    document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]').forEach((anchor) => {
      const context = getWhatsappContext(anchor);
      if (!context) return;
      const message = content.whatsappMessages?.[context]?.[language] || content.whatsappMessages?.contact?.[language] || '';
      const url = new URL('https://api.whatsapp.com/send/');
      url.searchParams.set('phone', phone);
      url.searchParams.set('text', message);
      anchor.href = url.toString();
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.dataset.tangramLinkKey = `whatsappMessages.${context}`;
      if (!anchor.dataset.tangramContentKey) anchor.dataset.tangramContentKey = `whatsappMessages.${context}`;
    });
  }

  function getWhatsappContext(anchor) {
    const text = fold(anchor.textContent);
    const href = anchor.getAttribute('href') || '';
    if (text.includes('last night') || text.includes('loofy') || href.includes('A2ZXZZRCLLZTP1')) return 'lastNight';
    if (text.includes('parceiro') || text.includes('partner')) return 'partner';
    if (text.includes('iniciar') || text.includes('start movement')) return 'start';
    if (text.includes('voce e') || text.includes('you are') || text.includes('peca')) return 'faq';
    return 'contact';
  }

  function applyFormLabels() {
    const form = content.movement?.form || {};
    const labels = [
      ['name', ['Nome', 'Name']],
      ['email', ['Email']],
      ['phone', ['Telefone', 'Phone', 'Contato', 'Contact']],
      ['location', ['Local', 'Location']],
      ['select', ['Selecione', 'Select']],
      ['submit', ['Enviar', 'Submit']]
    ];
    labels.forEach(([key, aliases]) => bindText(`movement.form.${key}`, aliases));

    const placeholderMap = [
      ['name', ['nome', 'name']],
      ['email', ['email']],
      ['phone', ['telefone', 'phone', 'contato', 'contact']],
      ['location', ['local', 'location']]
    ];
    placeholderMap.forEach(([key, aliases]) => {
      const value = localize(form[key]);
      if (!value) return;
      document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach((field) => {
        const current = fold(field.getAttribute('placeholder'));
        if (aliases.some((alias) => current.includes(alias))) field.setAttribute('placeholder', value);
      });
    });
  }

  function applyImageAlts() {
    (content.highlights?.images || []).forEach((image) => {
      if (!image.srcContains) return;
      document.querySelectorAll(`img[src*="${CSS.escape(image.srcContains)}"], img[srcset*="${CSS.escape(image.srcContains)}"]`).forEach((element) => {
        element.alt = localize(image.alt);
      });
    });
  }

  function applyAll() {
    if (!content || applying) return;
    applying = true;
    try {
      applySeo();
      applyText();
      applyAgenda();
      applyLinks();
      applyWhatsapp();
      applyFormLabels();
      applyImageAlts();
      applyPreviewLinkHints();
      document.documentElement.dataset.tangramContent = 'ready';
      if (previewMode) {
        document.documentElement.dataset.tangramPreviewMode = 'true';
        if (activePreviewPath) window.setTimeout(() => highlightPreviewPath(activePreviewPath), 80);
      }
    } finally {
      applying = false;
    }
  }

  function setupPreviewMode() {
    previewMode = isPreviewRequest();
    if (!previewMode) return;

    document.documentElement.dataset.tangramPreviewMode = 'true';
    injectPreviewStyles();

    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      if (!event.data || event.data.type !== 'tangram:preview-content') return;
      if (event.data.content && typeof event.data.content === 'object') {
        content = event.data.content;
        activePreviewPath = event.data.activePath || activePreviewPath;
        applyAll();
        highlightPreviewPath(activePreviewPath);
      }
    });

    window.addEventListener('scroll', () => positionPreviewMarker(), { passive: true });
    window.addEventListener('resize', () => positionPreviewMarker(), { passive: true });

    window.parent.postMessage({ type: 'tangram:preview-ready' }, window.location.origin);
    window.setTimeout(() => window.parent.postMessage({ type: 'tangram:preview-ready' }, window.location.origin), 800);
  }

  function injectPreviewStyles() {
    if (document.getElementById('tangram-preview-styles')) return;
    const style = document.createElement('style');
    style.id = 'tangram-preview-styles';
    style.textContent = `
      html[data-tangram-preview-mode="true"] [data-tangram-content-key] {
        outline: 1px dashed rgba(157, 255, 188, 0.38);
        outline-offset: 3px;
      }

      html[data-tangram-preview-mode="true"] a[data-tangram-preview-href] {
        outline-color: rgba(120, 190, 255, 0.66);
      }

      html[data-tangram-preview-mode="true"] [data-tangram-preview-active="true"] {
        background: rgba(157, 255, 188, 0.12) !important;
        box-shadow: 0 0 0 2px rgba(157, 255, 188, 0.94), 0 0 24px rgba(157, 255, 188, 0.24) !important;
        outline: 0 !important;
      }

      .tangram-preview-marker {
        background: #9dffbc;
        border-radius: 999px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.34);
        color: #050505;
        font: 700 11px/1 Inter, Arial, sans-serif;
        left: 16px;
        letter-spacing: 0.02em;
        max-width: calc(100vw - 32px);
        opacity: 0;
        padding: 8px 10px;
        pointer-events: none;
        position: fixed;
        text-transform: uppercase;
        top: 16px;
        transform: translateY(-8px);
        transition: opacity 160ms ease, transform 160ms ease;
        z-index: 2147483647;
      }

      .tangram-preview-marker.is-visible {
        opacity: 1;
        transform: translateY(0);
      }

      .tangram-preview-marker span {
        display: block;
        font-size: 10px;
        font-weight: 600;
        line-height: 1.25;
        margin-top: 5px;
        max-width: min(360px, calc(100vw - 40px));
        overflow: hidden;
        text-overflow: ellipsis;
        text-transform: none;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
  }

  function highlightPreviewPath(path) {
    if (!previewMode) return;
    activePreviewPath = path || activePreviewPath || '';
    document.querySelectorAll('[data-tangram-preview-active]').forEach((element) => {
      delete element.dataset.tangramPreviewActive;
    });

    if (!activePreviewPath) {
      hidePreviewMarker();
      return;
    }

    const target = findPreviewTarget(activePreviewPath);
    if (!target) {
      hidePreviewMarker();
      return;
    }

    target.dataset.tangramPreviewActive = 'true';
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    window.setTimeout(() => showPreviewMarker(target, activePreviewPath), 250);
  }

  function findPreviewTarget(path) {
    const candidates = Array.from(document.querySelectorAll('[data-tangram-content-key]'));
    const normalizedPath = String(path || '');
    const section = normalizedPath.split('.')[0];
    const exact = choosePreviewCandidate(candidates.filter((element) => element.dataset.tangramContentKey === normalizedPath), normalizedPath);
    if (exact) return exact;

    const partial = choosePreviewCandidate(candidates.filter((element) => {
      const key = element.dataset.tangramContentKey || '';
      return normalizedPath && (key.startsWith(`${normalizedPath}.`) || normalizedPath.startsWith(`${key}.`));
    }), normalizedPath);
    if (partial) return partial;

    const selectorTarget = findPreviewSelectorTarget(normalizedPath);
    if (selectorTarget) return selectorTarget;

    return choosePreviewCandidate(candidates.filter((element) => (element.dataset.tangramContentKey || '').split('.')[0] === section), normalizedPath)
      || candidates[0]
      || null;
  }

  function findPreviewSelectorTarget(path) {
    const section = path.split('.')[0];
    const selector = previewTargetSelectors[path] || previewTargetSelectors[section];
    if (!selector) return null;
    return choosePreviewCandidate(Array.from(document.querySelectorAll(selector)), path);
  }

  function choosePreviewCandidate(candidates, path) {
    if (!candidates.length) return null;
    return candidates
      .map((element) => ({ element, score: scorePreviewCandidate(element, path) }))
      .sort((a, b) => b.score - a.score)[0].element;
  }

  function scorePreviewCandidate(element, path) {
    const rect = element.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    let score = Math.max(0, 100000 - top);
    if (/\.title$|\.headline$/.test(path) && /^(H1|H2|H3|H4)$/.test(element.tagName)) score += 500000;
    if (/links|Url|whatsappMessages/.test(path) && element.tagName === 'A') score += 500000;
    if (path.startsWith('menu.') && top < 500) score += 250000;
    if (path.startsWith('footer.') && top > document.body.scrollHeight * 0.7) score += 250000;
    if (element.offsetParent === null && element !== document.documentElement) score -= 1000000;
    return score;
  }

  function ensurePreviewMarker() {
    if (previewMarker) return previewMarker;
    previewMarker = document.createElement('div');
    previewMarker.className = 'tangram-preview-marker';
    document.body.appendChild(previewMarker);
    return previewMarker;
  }

  function showPreviewMarker(target, path) {
    const marker = ensurePreviewMarker();
    const href = previewLinkValue(target);
    marker.textContent = previewLabel(path);
    if (href) {
      const link = document.createElement('span');
      link.textContent = href;
      marker.appendChild(link);
    }
    positionPreviewMarker(target);
    marker.classList.add('is-visible');
  }

  function applyPreviewLinkHints() {
    if (!previewMode) return;
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href') || '';
      if (!href || href === '#') return;
      anchor.dataset.tangramPreviewHref = href;
      anchor.title = `Link editavel: ${href}`;
    });
  }

  function previewLinkValue(target) {
    const link = target && target.closest && target.closest('a[href]');
    if (!link) return '';
    return link.dataset.tangramPreviewHref || link.getAttribute('href') || '';
  }

  function positionPreviewMarker(target) {
    if (!previewMarker) return;
    const active = target || document.querySelector('[data-tangram-preview-active="true"]');
    if (!active) return;
    const rect = active.getBoundingClientRect();
    previewMarker.style.top = `${Math.max(12, rect.top - 36)}px`;
    previewMarker.style.left = `${Math.max(12, Math.min(rect.left, window.innerWidth - 180))}px`;
  }

  function hidePreviewMarker() {
    if (previewMarker) previewMarker.classList.remove('is-visible');
  }

  function previewLabel(path) {
    const section = String(path || '').split('.')[0];
    const labels = {
      seo: 'SEO',
      'seo.title': 'SEO titulo',
      'seo.description': 'SEO descricao',
      'seo.socialImage': 'Imagem social',
      links: 'Links globais',
      'links.instagram': 'Instagram',
      'links.whatsappPhone': 'Telefone WhatsApp',
      'links.whatsappBio': 'Link WhatsApp bio',
      'links.email': 'Email',
      menu: 'Menu',
      hero: 'Hero',
      agenda: 'Agenda',
      highlights: 'Highlights',
      about: 'Quem Somos',
      experienceCards: 'Cards de experiencia',
      founders: 'Fundadores',
      movement: 'Movimento Vivo',
      partners: 'Parceiros',
      purpose: 'Proposito',
      faq: 'FAQ',
      footer: 'Rodape',
      whatsappMessages: 'WhatsApp'
    };
    return `${labels[path] || labels[section] || 'Campo editavel'} em edicao`;
  }

  function scheduleApply() {
    if (applying) return;
    window.clearTimeout(applyTimer);
    applyTimer = window.setTimeout(applyAll, APPLY_DELAY);
  }

  function setupObservers() {
    const observer = new MutationObserver(scheduleApply);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    document.addEventListener('click', scheduleApply, true);
    document.addEventListener('change', scheduleApply, true);
    window.addEventListener('resize', scheduleApply, { passive: true });
    window.addEventListener('storage', (event) => {
      if (event.key === LANGUAGE_STORAGE_KEY) scheduleApply();
    });
  }

  async function init() {
    try {
      setupPreviewMode();
      const response = await fetch(`${CONTENT_URL}?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Content load failed: ${response.status}`);
      content = await response.json();
      applyAll();
      setupObservers();
      window.setTimeout(applyAll, 500);
      window.setTimeout(applyAll, 1500);
    } catch (error) {
      console.warn('[Tangram content]', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
