(function () {
  const h = window.h || (window.React && window.React.createElement);
  const CMS = window.CMS;
  const Tangram = window.TangramBindings;
  if (!CMS || !h || !Tangram) return;

  const PREVIEW_URL = '/?tangram_admin_preview=1';
  let latestContent = {};
  let activePath = '';
  let latestFrame = null;
  let syncTimer = 0;

  function entryToContent(entry) {
    const data = entry && entry.get && entry.get('data');
    if (!data) return {};
    return typeof data.toJS === 'function' ? data.toJS() : data;
  }

  function bindingLabel(path) {
    const binding = Tangram.getBinding(path);
    if (!binding) return path || 'Nenhum campo ativo';
    return `${binding.group}: ${binding.label}`;
  }

  function setActivePath(path) {
    if (!path) return;
    activePath = path;
    updateHeader();
    scheduleSync();
  }

  function updateHeader() {
    const label = document.getElementById('tangram-preview-active-label');
    if (label) label.textContent = activePath ? `Campo ativo: ${activePath}` : 'Selecione um campo para destacar no site';
    const title = document.getElementById('tangram-preview-active-title');
    if (title) title.textContent = activePath ? bindingLabel(activePath) : 'Preview do site real';
  }

  function scheduleSync() {
    window.clearTimeout(syncTimer);
    syncTimer = window.setTimeout(syncPreview, 80);
  }

  function syncPreview() {
    const frame = latestFrame || document.querySelector('.tangram-live-preview__frame');
    if (!frame || !frame.contentDocument) return;
    const doc = frame.contentDocument;
    ensurePreviewUi(doc);
    Tangram.applyAll(doc, latestContent);
    highlightPath(doc, activePath);
  }

  function ensurePreviewUi(doc) {
    if (!doc.getElementById('tangram-admin-preview-style')) {
      const style = doc.createElement('style');
      style.id = 'tangram-admin-preview-style';
      style.textContent = `
        [data-tangram-admin-preview-active="true"] {
          outline: 3px solid #a970ff !important;
          outline-offset: 7px !important;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, .16), 0 0 34px rgba(169, 112, 255, .88) !important;
          position: relative !important;
          z-index: 2147483000 !important;
        }
        #tangram-admin-preview-marker {
          background: #a970ff;
          border: 1px solid rgba(255, 255, 255, .28);
          border-radius: 10px;
          box-shadow: 0 14px 40px rgba(0, 0, 0, .38);
          color: #070707;
          display: none;
          font: 700 12px/1.25 Arial, sans-serif;
          left: 12px;
          max-width: min(380px, calc(100vw - 24px));
          padding: 8px 10px;
          pointer-events: none;
          position: fixed;
          top: 12px;
          z-index: 2147483647;
        }
        #tangram-admin-preview-marker.is-visible {
          display: block;
        }
        #tangram-admin-preview-marker span {
          display: block;
          font-weight: 500;
          margin-top: 3px;
          opacity: .78;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `;
      doc.head.appendChild(style);
    }

    if (!doc.getElementById('tangram-admin-preview-marker')) {
      const marker = doc.createElement('div');
      marker.id = 'tangram-admin-preview-marker';
      doc.body.appendChild(marker);
    }

    if (!doc.defaultView.__tangramPreviewRepositionReady) {
      doc.defaultView.__tangramPreviewRepositionReady = true;
      doc.defaultView.addEventListener('scroll', () => {
        const active = doc.querySelector('[data-tangram-admin-preview-active="true"]');
        if (active && active.__tangramPreviewPath) positionMarker(doc, active, active.__tangramPreviewPath);
      }, { passive: true });
    }
  }

  function clearHighlight(doc) {
    doc.querySelectorAll('[data-tangram-admin-preview-active="true"]').forEach((element) => {
      element.removeAttribute('data-tangram-admin-preview-active');
      delete element.__tangramPreviewPath;
    });
  }

  function highlightPath(doc, path) {
    clearHighlight(doc);
    const marker = doc.getElementById('tangram-admin-preview-marker');
    if (!path) {
      if (marker) marker.classList.remove('is-visible');
      return;
    }

    const target = Tangram.findTarget(doc, path, latestContent, { mode: 'preview' });
    if (!target) {
      if (marker) {
        marker.textContent = `Campo sem alvo visual: ${path}`;
        marker.style.top = '12px';
        marker.style.left = '12px';
        marker.classList.add('is-visible');
      }
      return;
    }

    target.__tangramPreviewPath = path;
    target.setAttribute('data-tangram-admin-preview-active', 'true');
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    window.setTimeout(() => positionMarker(doc, target, path), 120);
    window.setTimeout(() => positionMarker(doc, target, path), 520);
  }

  function positionMarker(doc, target, path) {
    const marker = doc.getElementById('tangram-admin-preview-marker');
    if (!marker || !target) return;
    const rect = target.getBoundingClientRect();
    const href = target.closest && target.closest('a[href]')?.getAttribute('href');
    marker.textContent = bindingLabel(path);
    if (href) {
      const span = doc.createElement('span');
      span.textContent = href;
      marker.appendChild(span);
    }
    marker.style.top = `${Math.max(12, rect.top - 42)}px`;
    marker.style.left = `${Math.max(12, Math.min(rect.left, doc.defaultView.innerWidth - 390))}px`;
    marker.classList.add('is-visible');
  }

  function setupBridge() {
    if (window.__tangramPreviewBridgeReady) return;
    window.__tangramPreviewBridgeReady = true;

    window.addEventListener('tangram:field-active', (event) => {
      setActivePath(event.detail && event.detail.path);
    });

    document.addEventListener('focusin', (event) => {
      const path = event.target?.closest?.('[data-tangram-editor-path]')?.getAttribute('data-tangram-editor-path');
      if (path) setActivePath(path);
    }, true);

    document.addEventListener('mousedown', (event) => {
      const path = event.target?.closest?.('[data-tangram-editor-path]')?.getAttribute('data-tangram-editor-path');
      if (path) setActivePath(path);
    }, true);
  }

  function SitePreview({ entry }) {
    latestContent = entryToContent(entry);
    setupBridge();
    window.setTimeout(scheduleSync, 0);

    return h('div', { className: 'tangram-live-preview' },
      h('div', { className: 'tangram-live-preview__bar' },
        h('div', null,
          h('strong', { id: 'tangram-preview-active-title' }, activePath ? bindingLabel(activePath) : 'Preview do site real'),
          h('span', { id: 'tangram-preview-active-label' }, activePath ? `Campo ativo: ${activePath}` : 'Selecione um campo para destacar no site')
        ),
        h('div', { className: 'tangram-live-preview__status' }, 'Estrutura travada')
      ),
      h('iframe', {
        className: 'tangram-live-preview__frame',
        title: 'Preview visual do site Tangram',
        src: PREVIEW_URL,
        onLoad: (event) => {
          latestFrame = event.currentTarget;
          scheduleSync();
        }
      })
    );
  }

  CMS.registerPreviewStyle('/admin/admin.css');
  CMS.registerPreviewTemplate('site', SitePreview);
})();
