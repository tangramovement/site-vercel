(function () {
  const CMS = window.CMS;
  const h = window.h;
  const bindings = window.TangramBindings;
  if (!CMS || !h || !bindings) return;

  let lastExplicitAnnounce = 0;

  function asJs(value, fallback) {
    if (value === undefined || value === null) return fallback;
    return typeof value.toJS === 'function' ? value.toJS() : value;
  }

  function fieldGet(field, key, fallback) {
    if (!field) return fallback;
    if (typeof field.get === 'function') return field.get(key) ?? fallback;
    return field[key] ?? fallback;
  }

  function announce(path, options) {
    if (!path) return;
    if (options?.fromScroll) {
      const focusedPath = document.activeElement?.closest?.('[data-tangram-editor-path]')?.getAttribute('data-tangram-editor-path');
      if (focusedPath) return;
      if (Date.now() - lastExplicitAnnounce < 6000) return;
    }
    if (!options?.fromScroll) lastExplicitAnnounce = Date.now();
    const message = { type: 'tangram:field-active', path };
    window.dispatchEvent(new CustomEvent('tangram:field-active', { detail: { path } }));
    window.postMessage(message, window.location.origin);
    Array.from(document.querySelectorAll('iframe')).forEach((frame) => {
      try {
        frame.contentWindow?.postMessage(message, window.location.origin);
      } catch (_error) {
        // Cross-frame preview delivery is best-effort inside Decap.
      }
    });
  }

  function eventProps(path) {
    return {
      onFocus: () => announce(path),
      onMouseDown: () => announce(path)
    };
  }

  function setAt(object, keys, value) {
    const clone = Array.isArray(object) ? object.slice() : Object.assign({}, object || {});
    let cursor = clone;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        cursor[key] = value;
        return;
      }
      const nextIsArray = /^\d+$/.test(keys[index + 1]);
      const next = cursor[key] === undefined || cursor[key] === null
        ? (nextIsArray ? [] : {})
        : (Array.isArray(cursor[key]) ? cursor[key].slice() : Object.assign({}, cursor[key]));
      cursor[key] = next;
      cursor = next;
    });
    return clone;
  }

  function updateArrayItem(arrayValue, index, keys, value) {
    const rows = asJs(arrayValue, []);
    const next = rows.slice();
    next[index] = keys.length ? setAt(next[index] || {}, keys, value) : value;
    return next;
  }

  function label(text, path) {
    return h('label', {
      className: 'tangram-widget__label',
      'data-tangram-editor-path': path,
      onMouseDown: () => announce(path)
    }, text);
  }

  function textInput(value, onChange, path, options) {
    const multiline = options && options.multiline;
    const props = Object.assign({
      className: 'tangram-widget__input',
      'data-tangram-editor-path': path,
      value: value || '',
      placeholder: options?.placeholder || '',
      onChange: (event) => {
        announce(path);
        onChange(event.target.value);
      }
    }, eventProps(path));
    return multiline
      ? h('textarea', Object.assign({}, props, { rows: options?.rows || 4 }))
      : h('input', Object.assign({}, props, { type: options?.type || 'text' }));
  }

  function i18nEditor(value, onChange, path, options) {
    const current = asJs(value, { pt: '', en: '' }) || {};
    const multiline = Boolean(options?.multiline);
    return h('div', { className: 'tangram-widget tangram-widget--i18n' },
      h('div', { className: 'tangram-widget__field' },
        label('PT', path),
        textInput(current.pt || '', (next) => onChange(Object.assign({}, current, { pt: next })), path, { multiline, rows: options?.rows || 4 })
      ),
      h('div', { className: 'tangram-widget__field' },
        label('EN', path),
        textInput(current.en || '', (next) => onChange(Object.assign({}, current, { en: next })), path, { multiline, rows: options?.rows || 4 })
      )
    );
  }

  function I18nStringControl(props) {
    return i18nEditor(props.value, props.onChange, fieldGet(props.field, 'tangram_path', ''), { multiline: false });
  }

  function I18nTextControl(props) {
    return i18nEditor(props.value, props.onChange, fieldGet(props.field, 'tangram_path', ''), { multiline: true, rows: 5 });
  }

  function StringControl(props) {
    const path = fieldGet(props.field, 'tangram_path', '');
    return h('div', { className: 'tangram-widget' },
      textInput(props.value || '', props.onChange, path, { type: fieldGet(props.field, 'type', 'text') })
    );
  }

  function BooleanControl(props) {
    const path = fieldGet(props.field, 'tangram_path', '');
    const value = Boolean(props.value);
    return h('label', Object.assign({
      className: 'tangram-widget tangram-widget__toggle',
      'data-tangram-editor-path': path
    }, eventProps(path)),
          h('input', {
            'data-tangram-editor-path': path,
            type: 'checkbox',
            checked: value,
            onChange: (event) => {
          announce(path);
          props.onChange(event.target.checked);
        }
      }),
      h('span', null, value ? 'Ativo' : 'Inativo')
    );
  }

  function PreserveControl() {
    return null;
  }

  function card(title, children, path) {
    return h('div', {
      className: 'tangram-list-card',
      'data-tangram-editor-path': path,
      onMouseDown: (event) => {
        const childPath = event.target?.closest?.('[data-tangram-editor-path]')?.getAttribute('data-tangram-editor-path');
        if (childPath && childPath !== path) return;
        if (!bindings.getBinding || bindings.getBinding(path)) announce(path);
      }
    },
      h('div', { className: 'tangram-list-card__title' }, title),
      children
    );
  }

  function i18nRow(item, onChange, path, labelText, key, multiline) {
    return h('div', { className: 'tangram-widget__field' },
      label(labelText, path),
      i18nEditor(item?.[key] || { pt: '', en: '' }, (next) => onChange([key], next), path, { multiline, rows: multiline ? 4 : 2 })
    );
  }

  function plainRow(item, onChange, path, labelText, key, options) {
    return h('div', { className: 'tangram-widget__field' },
      label(labelText, path),
      textInput(item?.[key] || '', (next) => onChange([key], next), path, options)
    );
  }

  function fixedList(value, onChange, rows) {
    const current = asJs(value, []);
    return h('div', { className: 'tangram-list-widget' }, rows(current, (index, keys, nextValue) => {
      onChange(updateArrayItem(current, index, keys, nextValue));
    }));
  }

  function EventsControl(props) {
    return fixedList(props.value, props.onChange, (items, update) => items.map((item, index) => {
      const base = `agenda.events.${index}`;
      const set = (keys, next) => update(index, keys, next);
      return card(`Botao ${index + 1}`, [
        i18nRow(item, set, `${base}.ticketLabel`, 'Texto do botao', 'ticketLabel'),
        plainRow(item, set, `${base}.ticketUrl`, 'Link do ingresso', 'ticketUrl', { type: 'url' })
      ], `${base}.ticketLabel`);
    }));
  }

  function ExperienceCardsControl(props) {
    return fixedList(props.value, props.onChange, (items, update) => items.map((item, index) => {
      const base = `experienceCards.${index}`;
      const set = (keys, next) => update(index, keys, next);
      return card(`Card ${index + 1}`, [
        i18nRow(item, set, `${base}.title`, 'Titulo', 'title'),
        i18nRow(item, set, `${base}.text`, 'Texto', 'text', true)
      ], `${base}.title`);
    }));
  }

  function FoundersControl(props) {
    return fixedList(props.value, props.onChange, (items, update) => items.map((item, index) => {
      const base = `founders.${index}`;
      const set = (keys, next) => update(index, keys, next);
      return card(item?.name?.pt || `Fundador ${index + 1}`, [
        i18nRow(item, set, `${base}.name`, 'Nome', 'name'),
        i18nRow(item, set, `${base}.bio`, 'Bio', 'bio', true),
        i18nRow(item, set, `${base}.presskitLabel`, 'Texto do botao', 'presskitLabel'),
        index === 2
          ? null
          : plainRow(item, set, `${base}.presskitUrl`, 'Link do Presskit', 'presskitUrl', { type: 'url' })
      ], `${base}.name`);
    }));
  }

  function TagsControl(props) {
    return fixedList(props.value, props.onChange, (items, update) => items.map((item, index) => {
      const path = `tags.${index}`;
      return card(`Tag ${index + 1}`, [
        i18nEditor(item || { pt: '', en: '' }, (next) => update(index, [], next), path)
      ], path);
    }));
  }

  function PillarsControl(props) {
    return fixedList(props.value, props.onChange, (items, update) => items.map((item, index) => {
      const base = `purpose.pillars.${index}`;
      const set = (keys, next) => update(index, keys, next);
      return card(`Pilar ${index + 1}`, [
        i18nRow(item, set, `${base}.title`, 'Titulo', 'title'),
        i18nRow(item, set, `${base}.text`, 'Texto', 'text', true)
      ], `${base}.title`);
    }));
  }

  function FaqCtaControl(props) {
    return fixedList(props.value, props.onChange, (items, update) => items.map((item, index) => {
      const path = `faq.ctaLines.${index}`;
      return card(`Linha ${index + 1}`, [
        i18nEditor(item || { pt: '', en: '' }, (next) => update(index, [], next), path)
      ], path);
    }));
  }

  function FaqItemsControl(props) {
    return fixedList(props.value, props.onChange, (items, update) => items.map((item, index) => {
      const base = `faq.items.${index}`;
      const set = (keys, next) => update(index, keys, next);
      return card(`Pergunta ${index + 1}`, [
        i18nRow(item, set, `${base}.question`, 'Pergunta', 'question'),
        i18nRow(item, set, `${base}.answer`, 'Resposta', 'answer', true)
      ], `${base}.question`);
    }));
  }

  function setupScrollSync() {
    if (window.__tangramWidgetScrollSyncReady) return;
    window.__tangramWidgetScrollSyncReady = true;
    let timer = 0;
    document.addEventListener('scroll', () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const fields = Array.from(document.querySelectorAll('[data-tangram-editor-path]'));
        const visible = fields
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { element, rect, distance: Math.abs(rect.top - 170) };
          })
          .filter((item) => item.rect.bottom > 64 && item.rect.top < window.innerHeight && item.rect.width > 10 && item.rect.height > 10)
          .sort((a, b) => a.distance - b.distance)[0];
        const path = visible?.element?.getAttribute('data-tangram-editor-path');
        if (path) announce(path, { fromScroll: true });
      }, 120);
    }, true);
  }

  CMS.registerWidget('tangram_i18n_string', I18nStringControl);
  CMS.registerWidget('tangram_i18n_text', I18nTextControl);
  CMS.registerWidget('tangram_string', StringControl);
  CMS.registerWidget('tangram_url', StringControl);
  CMS.registerWidget('tangram_email', StringControl);
  CMS.registerWidget('tangram_phone', StringControl);
  CMS.registerWidget('tangram_boolean', BooleanControl);
  CMS.registerWidget('tangram_preserve', PreserveControl);
  CMS.registerWidget('tangram_events', EventsControl);
  CMS.registerWidget('tangram_experience_cards', ExperienceCardsControl);
  CMS.registerWidget('tangram_founders', FoundersControl);
  CMS.registerWidget('tangram_tags', TagsControl);
  CMS.registerWidget('tangram_pillars', PillarsControl);
  CMS.registerWidget('tangram_faq_cta', FaqCtaControl);
  CMS.registerWidget('tangram_faq_items', FaqItemsControl);

  setupScrollSync();
})();
