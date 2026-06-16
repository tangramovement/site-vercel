(function () {
  const CONTENT_URL = '/content/site.json';
  const LANGUAGE_STORAGE_KEY = 'tangram-language';
  const APPLY_DELAY = 120;

  let content = null;
  let applying = false;
  let applyTimer = 0;

  window.__tangramTriggerApply = scheduleApply;

  function applyAll() {
    const activeContent = window.__tangramContent || content;
    if (!activeContent || applying || !window.TangramBindings) return;
    applying = true;
    try {
      const result = window.TangramBindings.applyAll(document, activeContent, { mode: 'public' });
      document.documentElement.dataset.tangramContent = 'ready';
      if (result.missing && result.missing.length) {
        console.info('[Tangram content] bindings without visual target', result.missing);
      }
    } catch (error) {
      console.warn('[Tangram content]', error);
    } finally {
      applying = false;
    }
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
      const response = await fetch(`${CONTENT_URL}?v=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Content load failed: ${response.status}`);
      content = await response.json();
      applyAll();
      setupObservers();
      window.setTimeout(applyAll, 500);
      window.setTimeout(applyAll, 1500);
      window.setTimeout(applyAll, 3000);
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
