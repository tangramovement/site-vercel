(function () {
  const h = window.h || (window.React && window.React.createElement);
  if (!window.CMS || !h) return;

  const PREVIEW_URL = '/?tangram-preview=1';
  const FIELD_PATHS = [
    { path: 'seo.title', labels: ['SEO', 'Titulo'] },
    { path: 'seo.description', labels: ['SEO', 'Descricao'] },
    { path: 'seo.socialImage', labels: ['SEO', 'Imagem social'] },
    { path: 'links.instagram', labels: ['Links globais', 'Instagram'], matchAll: true },
    { path: 'links.whatsappPhone', labels: ['Telefone WhatsApp'] },
    { path: 'links.whatsappBio', labels: ['Link WhatsApp bio'] },
    { path: 'links.email', labels: ['Links globais', 'Email'], matchAll: true },
    { path: 'agenda.events', labels: ['Link do ingresso'] },
    { path: 'founders.presskitUrl', labels: ['Link presskit'] },
    { path: 'founders.presskitLabel', labels: ['Botao Presskit'] },
    { path: 'whatsappMessages', labels: ['Mensagens WhatsApp'] },
    { path: 'links', labels: ['Links globais'] },
    { path: 'menu', labels: ['Menu'] },
    { path: 'hero', labels: ['Hero'] },
    { path: 'agenda', labels: ['Agenda'] },
    { path: 'highlights', labels: ['Highlights'] },
    { path: 'about', labels: ['Quem Somos'] },
    { path: 'experienceCards', labels: ['Cards de experiencia'] },
    { path: 'founders', labels: ['Fundadores'] },
    { path: 'movement', labels: ['Movimento Vivo'] },
    { path: 'partners', labels: ['Parceiros'] },
    { path: 'purpose', labels: ['Proposito'] },
    { path: 'faq', labels: ['FAQ'] },
    { path: 'footer', labels: ['Rodape'] }
  ];

  let latestContent = null;
  let activePath = '';
  let syncTimer = 0;

  function entryToContent(entry) {
    const data = entry && entry.get && entry.get('data');
    if (!data) return {};
    return typeof data.toJS === 'function' ? data.toJS() : data;
  }

  function normalize(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function getTextNearTarget(target) {
    const parts = [
      target.getAttribute && target.getAttribute('name'),
      target.getAttribute && target.getAttribute('id'),
      target.getAttribute && target.getAttribute('aria-label'),
      target.getAttribute && target.getAttribute('placeholder')
    ];

    let node = target;
    for (let depth = 0; node && depth < 6; depth += 1) {
      if (node.innerText) parts.push(node.innerText.slice(0, 900));
      if (node.previousElementSibling && node.previousElementSibling.innerText) {
        parts.push(node.previousElementSibling.innerText.slice(0, 400));
      }
      node = node.parentElement;
    }

    return normalize(parts.filter(Boolean).join(' '));
  }

  function pathFromTarget(target) {
    const text = getTextNearTarget(target);
    if (!text) return activePath;

    const direct = FIELD_PATHS.find((item) => {
      const labels = item.labels.map(normalize);
      return item.matchAll
        ? labels.every((label) => text.includes(label))
        : labels.some((label) => text.includes(label));
    });
    return direct ? direct.path : activePath;
  }

  function scheduleSync() {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(sendPreviewState, 80);
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
    if (!target || !/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)) return;
    activePath = pathFromTarget(target);
    scheduleSync();
  }

  function handleEditorInput(event) {
    const target = event.target;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) {
      activePath = pathFromTarget(target);
      scheduleSync();
    }
  }

  function setupEditorBridge() {
    if (window.__tangramEditorBridgeReady) return;
    window.__tangramEditorBridgeReady = true;
    document.addEventListener('focusin', handleEditorFocus, true);
    document.addEventListener('input', handleEditorInput, true);
    document.addEventListener('change', handleEditorInput, true);
    document.addEventListener('click', handleEditorFocus, true);
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      if (event.data && event.data.type === 'tangram:preview-ready') sendPreviewState();
    });
  }

  function SitePreview({ entry }) {
    latestContent = entryToContent(entry);
    setupEditorBridge();
    window.setTimeout(sendPreviewState, 0);

    return h('div', { className: 'tangram-live-preview' },
      h('div', { className: 'tangram-live-preview__bar' },
        h('div', null,
          h('strong', null, 'Preview do site real'),
          h('span', null, 'Rascunho aplicado somente nesta visualizacao')
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
