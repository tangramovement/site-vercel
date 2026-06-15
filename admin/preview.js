(function () {
  const h = window.h || (window.React && window.React.createElement);
  if (!window.CMS || !h) return;

  const read = (entry, path, fallback = '') => {
    const value = entry.getIn(['data'].concat(path.split('.')));
    return value && typeof value.toJS === 'function' ? value.toJS() : (value || fallback);
  };

  const pick = (value, lang = 'pt') => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value[lang] || value.pt || value.en || '';
  };

  const SitePreview = ({ entry }) => {
    const about = read(entry, 'about', {});
    const agenda = read(entry, 'agenda.events', []);
    const cards = read(entry, 'experienceCards', []);
    const faq = read(entry, 'faq.items', []);
    const footer = read(entry, 'footer', {});

    return h('div', { className: 'tangram-preview' },
      h('div', { className: 'tangram-preview__topbar' },
        h('div', { className: 'tangram-preview__brand' }, 'Editor Tangram'),
        h('div', { className: 'tangram-preview__status' }, 'Conteudo editavel | Estrutura travada')
      ),
      h('div', { className: 'tangram-preview__grid' },
        h('section', { className: 'tangram-preview__card tangram-preview__editable' },
          h('div', { className: 'tangram-preview__label' }, 'Preview do site'),
          h('h1', null, pick(read(entry, 'highlights.title'))),
          h('p', null, pick(about.text)),
          agenda.filter((event) => event && event.active !== false).map((event, index) =>
            h('div', { className: 'tangram-preview__event', key: `event-${index}` },
              h('strong', null, `${event.date || ''} | ${pick(event.place)}`),
              h('p', null, `${pick(event.title)} ${pick(event.lineup)}`)
            )
          )
        ),
        h('section', { className: 'tangram-preview__card' },
          h('div', { className: 'tangram-preview__label' }, 'Campos de conteudo'),
          h('h2', null, pick(about.title)),
          cards.slice(0, 4).map((card, index) =>
            h('span', { className: 'tangram-preview__pill', key: `card-${index}` }, pick(card.title))
          ),
          faq.slice(0, 3).map((item, index) =>
            h('div', { className: 'tangram-preview__event', key: `faq-${index}` },
              h('strong', null, pick(item.question)),
              h('p', null, pick(item.answer))
            )
          ),
          h('div', { className: 'tangram-preview__event' },
            h('strong', null, pick(footer.headline)),
            h('p', null, pick(footer.location))
          )
        )
      )
    );
  };

  window.CMS.registerPreviewStyle('/admin/admin.css');
  window.CMS.registerPreviewTemplate('site', SitePreview);
})();
