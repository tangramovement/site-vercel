(function () {
  const LANGUAGE_STORAGE_KEY = 'tangram-language';
  const SOURCE_LANGUAGE = 'pt';
  const TARGET_LANGUAGE = 'en';
  const SIDE_MARQUEE_TEXT = 'TANGRAM MOVEMENT | TANGRAM MOVEMENT | TANGRAM MOVEMENT | TANGRAM MOVEMENT | TANGRAM MOVEMENT | TANGRAM MOVEMENT | TANGRAM MOVEMENT | TANGRAM MOVEMENT | TANGRAM MOVEMENT | TANGRAM MOVEMENT | TANGRAM MOVEMENT | TANGRAM MOVEMENT |';

  const translations = new Map(Object.entries({
    'Quem Somos': 'Who We Are',
    'QUEM SOMOS': 'WHO WE ARE',
    'Eventos': 'Events',
    'Parceiros': 'Partners',
    'Fale conosco': 'Contact us',
    'Select Language': 'Select Language',
    'Portuguese': 'Portuguese',
    'NEXT MOVES': 'NEXT MOVES',
    'Tickets': 'Tickets',
    'loading...': 'loading...',
    'Loading...': 'Loading...',
    'HIGHLITS': 'HIGHLIGHTS',
    'HIGHLIGHTS': 'HIGHLIGHTS',
    'Ativações': 'Activations',
    'A partir do conceito do Puzzle chinês o Tangram nasce com a proposta transformação, modularidade e co-criaçao produzindo diversos tipos de experiências sensoriais únicas que se adaptam ao espaço e ao tempo, propondo atmosferas vivas de pertencimento e conexão.': 'Inspired by the Chinese Tangram puzzle, Tangram was born from transformation, modularity and co-creation, producing unique sensory experiences that adapt to space and time while proposing living atmospheres of belonging and connection.',
    'Música': 'Music',
    'O som é a peça principal do Tangram, é a partir dela que moldamos o espaço e movimentamos os corpos. Da escuta ao transe, a música conduz a experiência.': 'Sound is Tangram’s main piece. Through it, we shape the space and move bodies. From listening to trance, music leads the experience.',
    'Moda': 'Fashion',
    'No Tangram, o corpo é linguagem — e a roupa, um veículo de expressão. Vestir é ativar. Cada peça é gesto, manifesto e código. O estilo aqui é pulsação estética em movimento.': 'At Tangram, the body is language, and clothing is a vehicle for expression. To dress is to activate. Each piece is gesture, manifesto and code. Style here is aesthetic pulse in motion.',
    'Exposições Artísticas': 'Art Exhibitions',
    'A arte no Tangram é presença viva. Instalações, pinturas, objetos e performance de dança, emergem como extensões do espaço e da intenção. Cada peça propõe um diálogo entre forma e sentimento.': 'Art at Tangram is a living presence. Installations, paintings, objects and dance performances emerge as extensions of space and intention. Each piece opens a dialogue between form and feeling.',
    'Visual e Projeções': 'Visuals and Projections',
    'Luz em movimento. As projeções no Tangram criam atmosferas imersivas, por meio de narrativas visuais e experimentações geométricas, dissolvemos a arquitetura e revelamos portais. Cada parede, cada superfície, torna-se um campo energético vibracional.': 'Light in motion. Tangram’s projections create immersive atmospheres. Through visual narratives and geometric experimentation, we dissolve architecture and reveal portals. Every wall, every surface becomes a vibrational energy field.',
    'Presença': 'Presence',
    'Mistério': 'Mystery',
    'Luz': 'Light',
    'Experiência': 'Experience',
    'Corpo': 'Body',
    'House': 'House',
    'Fragmento': 'Fragment',
    'Frequência': 'Frequency',
    'Fundadores': 'Founders',
    'Ber Fontoura': 'Ber Fontoura',
    'Ber Fontoura é nascido em uma familia imersa musicalmente, trazendo beats minimalistas e percussionados, guiados por uma bagagem musical que flui da musica latina ao rnb, soul, rock e jazz, trazendo suas nuances de formas sutis misturadas a linhas de baixo envolventes, criando uma sonoridade única que conecta passado e presente de forma cativante e carregada de nostalgia. Suas tracks sao tocadas por grandes nomes, sendo alguns deles o Seth Troxler e Paco Osuna. Ber ja passou por grandes palcos e clubs internacionais, como: D.Edge SP e RJ, Casa Tisoc, Love Sessions, Deep Please, Bloco Ame e Mau-Festa': 'Ber Fontoura was born into a deeply musical family, bringing minimalist and percussive beats guided by a musical background that flows from Latin music to R&B, soul, rock and jazz. His subtle nuances blend with enveloping basslines, creating a unique sound that connects past and present with a captivating and nostalgic energy. His tracks have been played by major names, including Seth Troxler and Paco Osuna. Ber has performed on major international stages and clubs, including D.Edge SP and RJ, Casa Tisoc, Love Sessions, Deep Please, Bloco Ame and Mau-Festa.',
    'Presskit': 'Presskit',
    'Marian Flow': 'Marian Flow',
    'Formada em Marketing e com passagem pela School of Visual Arts, em Nova York, onde estudou Graphic Design. É fundadora da gravadora Music is Magic, voltada para música de cura e conexões ancestrais, e idealizadora do projeto Tangram, Marian Flow conta com mais de 20 anos de carreira e turnes pelos 4 cantos do globo.': 'With a background in Marketing and studies in Graphic Design at the School of Visual Arts in New York, Marian Flow is the founder of Music is Magic, a label focused on healing music and ancestral connections, and the creator of the Tangram project. Marian Flow has over 20 years of career and tours across the globe.',
    'Tomorrowland, Rock in Rio, Love Parade, Watergate Berlim, Universo Paralelo, Ame, Laroc, Surreal Park e Xxxperience são só alguns dos palcos que já sentiram as vibrações únicas de Marian.': 'Tomorrowland, Rock in Rio, Love Parade, Watergate Berlin, Universo Paralelo, Ame, Laroc, Surreal Park and Xxxperience are just some of the stages that have felt Marian’s unique vibrations.',
    'Sua principal característica é passar por vertentes do House Music de forma hipnótica, com técnica apurada e carisma único. Com lançamentos por selos de peso como Universal Music, Nervous Records, Get Physical e Great Stuff, Marian já deixou sua marca na cena global.': 'Her signature is moving through different shades of House Music in a hypnotic way, with refined technique and unique charisma. With releases on major labels such as Universal Music, Nervous Records, Get Physical and Great Stuff, Marian has already left her mark on the global scene.',
    'Clari Ann': 'Clari Ann',
    'Clari Ann já se apresentou em clubes e festivais prestigiados na Suíça, incluindo o Hive Club, Club Bellevue, Street Parade e Zurich Open Air.': 'Clari Ann has performed at renowned clubs and festivals in Switzerland, including Hive Club, Club Bellevue, Street Parade and Zurich Open Air.',
    'Sua energia eletrizante já alcançou palcos internacionais, passando pelo Brasil, Tailândia, Espanha, Austrália, Alemanha, Reino Unido, Holanda e Chile.': 'Her electrifying energy has reached international stages across Brazil, Thailand, Spain, Australia, Germany, the United Kingdom, the Netherlands and Chile.',
    'Movimento Vivo': 'Living Movement',
    'Acreditamos que toda experiência verdadeira reverbera além de si mesma. Por isso, destinamos 10% dos lucros dos sócios fundadores a causas ambientais e sociais.': 'We believe every true experience reverberates beyond itself. That is why we allocate 10% of the founding partners’ profits to environmental and social causes.',
    'Ative o próximo movimento.': 'Activate the next movement.',
    'Tangram na sua cidade': 'Tangram in your city',
    'Preencha o formulário ao lado e vamos co-criar juntos o próximo movimento. Tangram é uma frequência que atravessa fronteiras.': 'Fill out the form and let’s co-create the next movement together. Tangram is a frequency that crosses borders.',
    'Tangram se molda, se encaixa, se transforma — criando experiências únicas onde cada pessoa, cada batida, e cada respiração se tornam parte do todo.': 'Tangram molds itself, fits together and transforms, creating unique experiences where each person, each beat and each breath becomes part of the whole.',
    'Nome': 'Name',
    'Email': 'Email',
    'Telefone': 'Phone',
    'Local': 'Location',
    'Selecione': 'Select',
    'Brazil': 'Brazil',
    'América': 'America',
    'Europa': 'Europe',
    'Asia': 'Asia',
    'Enviar': 'Submit',
    'Reviews': 'Reviews',
    'Nossos parceiros são extensões vivas da experiência: artistas, coletivos e projetos que compartilham visão, presença e potência simbólica. Juntos, criamos atmosferas que não se fazem sozinhas.': 'Our partners are living extensions of the experience: artists, collectives and projects that share vision, presence and symbolic power. Together, we create atmospheres that cannot exist alone.',
    'Quero ser um parceiro': 'I want to be a partner',
    'Propósito': 'Purpose',
    'Celebrar a beleza da fragmentação. Criar experiências onde cada pessoa, batida e respiração compõem algo maior.': 'Celebrating the beauty of fragmentation. Creating experiences where each person, beat and breath becomes part of something greater.',
    'Pertencimento': 'Belonging',
    'A presença de cada pessoa é parte essencial da experiência. Nada se completa sozinho.': 'Each person’s presence is an essential part of the experience. Nothing is complete alone.',
    'Modularidade': 'Modularity',
    'Cada peça — evento, pessoa, imagem ou som — se conecta de forma única. Tudo pode se reconfigurar.': 'Each piece, event, person, image or sound connects in a unique way. Everything can be reconfigured.',
    'Transmutação': 'Transmutation',
    'A mudança é o que nos mantém vivos.': 'Change is what keeps us alive.',
    'Sensorialidade': 'Sensoriality',
    'A linguagem é a experiência: não é sobre o que se vê, mas sobre o que se sente.': 'Language is the experience: it is not about what you see, but what you feel.',
    'Espaço para o enigma, o silêncio, a respiração. A magia também está no que não se explica.': 'Space for enigma, silence and breath. Magic also lives in what cannot be explained.',
    'Tire suas dúvidas': 'Ask your questions',
    'FAQ': 'FAQ',
    'Tudo o que você precisa saber para viver, criar ou ativar junto com o Tangram.': 'Everything you need to know to live, create or activate with Tangram.',
    'Você é': 'You are',
    'a peça': 'the piece',
    'que faltava': 'that was missing',
    'O que é o Tangram?': 'What is Tangram?',
    'Tangram é um movimento de experiências modulares e sensoriais. Cada projeto é único, vivo e adaptável — um encontro entre música, arte, moda e movimento.': 'Tangram is a movement of modular and sensory experiences. Each project is unique, alive and adaptable, a meeting point between music, art, fashion and movement.',
    'O Tangram tem um formato fixo?': 'Does Tangram have a fixed format?',
    'Não. Tangram é fluidez. Cada evento tem uma nova forma. Trabalhamos com peças modulares que podem ser combinadas de formas diferentes para criar atmosferas singulares. Para criar atmosferas vibracionais imersivas.': 'No. Tangram is fluidity. Each event takes a new form. We work with modular pieces that can be combined in different ways to create singular atmospheres and immersive vibrational environments.',
    'Quem participa dos eventos do Tangram?': 'Who takes part in Tangram events?',
    'Djs, Artistas, Marcas e peças criativas, sensíveis e despertos. Pessoas que querem sentir, contemplar, se mover e pertencer a algo maior.': 'DJs, artists, brands and creative, sensitive, awake pieces. People who want to feel, contemplate, move and belong to something greater.',
    'Posso contratar o Tangram para um evento específico?': 'Can I hire Tangram for a specific event?',
    'Sim. Atuamos como criadores de experiências sob medida. Você nos conta o propósito, o espaço e o público — nós desenhamos a composição com base nas peças Tangram.': 'Yes. We create tailor-made experiences. You tell us the purpose, the space and the audience, and we design the composition based on the Tangram pieces.',
    'Quais são os elementos que vocês usam nas experiências?': 'What elements do you use in the experiences?',
    'Trabalhamos com música, projeções, instalações artísticas, performances de moda e ativações sensoriais.': 'We work with music, projections, art installations, fashion performances and sensory activations.',
    'Como posso participar ou colaborar com o Tangram?': 'How can I participate or collaborate with Tangram?',
    'Você pode vir como público, como artista, como espaço, como marca. Nos escreva, nos chame. Tangram acontece no encontro — e você pode ser a peça que ativa o próximo.': 'You can join as audience, artist, venue or brand. Write to us, call us. Tangram happens through encounter, and you can be the piece that activates the next one.',
    'É no movimento que a forma encontra sentido.': 'It is in movement that form finds meaning.',
    'Iniciar Movimento': 'Start Movement',
    'RIO DE JANEIRO - BRAZIL': 'RIO DE JANEIRO - BRAZIL',
    'All rights reserved, ©2025': 'All rights reserved, ©2025',
    'Agenda atual': 'Current schedule',
    'Próximos movimentos Tangram': 'Upcoming Tangram moves',
    'Edifício Touring RJ': 'Touring Building RJ',
    '01.08 | Edifício Touring RJ | Last Night': '01.08 | Touring Building RJ | Last Night'
  }));

  const attributeTranslations = new Map(Object.entries({
    'Seu Nome': 'Your Name',
    'exemplo@email.com': 'example@email.com',
    'Contato': 'Contact'
  }));

  const MARIAN_PRESSKIT_URL = 'https://drive.google.com/drive/folders/15F-EL6K-J7O3NcqZHYV7GNp6hIG8OEx_';
  const WHATSAPP_PHONE = '5521975409180';
  const whatsappMessages = {
    contact: {
      pt: '[Site Tangram | Fale conosco] Oi! Vim pelo site do Tangram e queria falar com vcs.',
      en: '[Tangram Website | Contact] Hi! I came from Tangram website and would like to talk to you.'
    },
    partner: {
      pt: '[Site Tangram | Parceiros] Oi! Vim pelo site do Tangram e queria conversar sobre parceria.',
      en: '[Tangram Website | Partners] Hi! I came from Tangram website and would like to talk about a partnership.'
    },
    start: {
      pt: '[Site Tangram | Iniciar Movimento] Oi! Vim pelo site do Tangram e queria iniciar um movimento com vcs.',
      en: '[Tangram Website | Start Movement] Hi! I came from Tangram website and would like to start a movement with you.'
    },
    lastNight: {
      pt: '[Site Tangram | Last Night RJ] Oi! Vim pelo site do Tangram e quero receber infos sobre o Last Night no Edifício Touring em 01.08.',
      en: '[Tangram Website | Last Night RJ] Hi! I came from Tangram website and would like to receive info about Last Night at Edifício Touring on 01.08.'
    },
    faq: {
      pt: '[Site Tangram | FAQ] Oi! Vim pelo site do Tangram e queria entender melhor como participar.',
      en: '[Tangram Website | FAQ] Hi! I came from Tangram website and would like to understand how to participate.'
    }
  };

  const reverseTranslations = new Map([...translations.entries()].map(([pt, en]) => [normalize(en), pt]));
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let currentLanguage = safeGetLanguage();
  let applying = false;
  let loaderInitialized = false;
  let layoutRefreshTimer;
  let observer;
  let mobileHeroSymbolPlacement;

  function isReloadNavigation() {
    const navigation = performance.getEntriesByType?.('navigation')?.[0];
    return navigation?.type === 'reload'
      || performance.navigation?.type === 1;
  }

  function setupInitialScrollReset() {
    try {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    } catch (_error) {
      // Some embedded browsers block scrollRestoration access.
    }

    const shouldReset = !window.location.hash || isReloadNavigation();
    if (!shouldReset) return;

    if (window.location.hash && isReloadNavigation()) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    const scrollTop = () => window.scrollTo(0, 0);
    scrollTop();
    window.requestAnimationFrame(scrollTop);
    window.setTimeout(scrollTop, 80);
    window.setTimeout(scrollTop, 360);
    window.addEventListener('pageshow', (event) => {
      if (!window.location.hash || event.persisted || isReloadNavigation()) scrollTop();
    }, { once: true });
  }

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function comparableText(value) {
    return normalize(value)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function safeGetLanguage() {
    try {
      return localStorage.getItem(LANGUAGE_STORAGE_KEY) === TARGET_LANGUAGE ? TARGET_LANGUAGE : SOURCE_LANGUAGE;
    } catch (_error) {
      return SOURCE_LANGUAGE;
    }
  }

  function safeSetLanguage(language) {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch (_error) {
      // localStorage can be blocked in some privacy modes.
    }
  }

  function findLanguageSelect() {
    return Array.from(document.querySelectorAll('select')).find((select) => {
      const options = Array.from(select.options).map((option) => normalize(option.text));
      return options.includes('Portuguese') || options.includes('Português') || select.dataset.tangramLanguageSelect === 'true';
    });
  }

  function ensureLanguageSelect() {
    const select = findLanguageSelect();
    if (!select) return null;

    select.dataset.tangramLanguageSelect = 'true';
    select.setAttribute('aria-label', 'Select Language');

    const hasEnglish = Array.from(select.options).some((option) => option.value === TARGET_LANGUAGE);
    if (!hasEnglish) {
      const english = document.createElement('option');
      english.value = TARGET_LANGUAGE;
      english.text = 'English';
      select.appendChild(english);
    }

    if (select.options[0]) {
      select.options[0].value = SOURCE_LANGUAGE;
      select.options[0].text = 'Portuguese';
    }

    select.value = currentLanguage;
    if (!select.dataset.tangramLanguageReady) {
      select.dataset.tangramLanguageReady = 'true';
      select.addEventListener('change', () => {
        currentLanguage = select.value === TARGET_LANGUAGE ? TARGET_LANGUAGE : SOURCE_LANGUAGE;
        safeSetLanguage(currentLanguage);
        applyLanguage();
      });
    }

    return select;
  }

  function syncLanguagePickerTitle() {
    const select = findLanguageSelect();
    if (!select) return;

    const picker = select.closest('.framer-locale-picker');
    const title = picker?.querySelector('.input .title');
    if (title) {
      title.textContent = currentLanguage === TARGET_LANGUAGE ? 'English' : 'Portuguese';
    }

    const customButton = picker?.querySelector('.tangram-language-trigger');
    if (customButton) {
      customButton.querySelector('span').textContent = currentLanguage === TARGET_LANGUAGE ? 'English' : 'Portuguese';
      customButton.setAttribute('aria-expanded', picker.classList.contains('is-open') ? 'true' : 'false');
    }

    picker?.querySelectorAll('.tangram-language-option').forEach((option) => {
      const isActive = option.dataset.language === currentLanguage;
      option.classList.toggle('is-active', isActive);
      option.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function setupCustomLanguagePicker() {
    const select = findLanguageSelect();
    const picker = select?.closest('.framer-locale-picker');
    if (!select || !picker || picker.dataset.tangramCustomReady === 'true') return;

    picker.dataset.tangramCustomReady = 'true';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'tangram-language-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<span>Portuguese</span><i aria-hidden="true"></i>';

    const menu = document.createElement('div');
    menu.className = 'tangram-language-menu';
    menu.setAttribute('role', 'listbox');
    menu.innerHTML = `
      <button type="button" class="tangram-language-option" data-language="${SOURCE_LANGUAGE}" role="option">Portuguese</button>
      <button type="button" class="tangram-language-option" data-language="${TARGET_LANGUAGE}" role="option">English</button>
    `;

    picker.append(trigger);
    document.body.append(menu);
    document.querySelectorAll('.tangram-language-menu').forEach((existingMenu) => {
      if (existingMenu !== menu) existingMenu.remove();
    });

    const positionMenu = () => {
      const rect = trigger.getBoundingClientRect();
      menu.style.position = 'fixed';
      menu.style.top = `${Math.round(rect.bottom + 6)}px`;
      menu.style.left = `${Math.round(rect.left)}px`;
      menu.style.width = `${Math.round(rect.width)}px`;
      menu.style.zIndex = '2147483647';
    };

    const close = () => {
      picker.classList.remove('is-open');
      menu.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    };

    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      picker.classList.toggle('is-open');
      const isOpen = picker.classList.contains('is-open');
      menu.classList.toggle('is-open', isOpen);
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) positionMenu();
    });

    window.addEventListener('scroll', () => {
      if (picker.classList.contains('is-open')) positionMenu();
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (picker.classList.contains('is-open')) positionMenu();
    });

    menu.addEventListener('click', (event) => {
      const option = event.target.closest('.tangram-language-option');
      if (!option) return;
      currentLanguage = option.dataset.language === TARGET_LANGUAGE ? TARGET_LANGUAGE : SOURCE_LANGUAGE;
      select.value = currentLanguage;
      safeSetLanguage(currentLanguage);
      close();
      applyLanguage();
    });

    document.addEventListener('click', (event) => {
      if (!picker.contains(event.target) && !menu.contains(event.target)) close();
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') close();
    });

    syncLanguagePickerTitle();
  }

  function shouldSkipNode(node) {
    const element = node.parentElement;
    if (!element) return true;
    return Boolean(element.closest('script, style, noscript, svg'));
  }

  function translateTextNode(node) {
    if (shouldSkipNode(node)) return;
    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
    }

    const source = originalText.get(node);
    const trimmed = normalize(source);
    if (!trimmed) return;

    if (trimmed === 'HIGHLITS') {
      node.nodeValue = `${source.match(/^\s*/)?.[0] || ''}HIGHLIGHTS${source.match(/\s*$/)?.[0] || ''}`;
      return;
    }

    if (currentLanguage === SOURCE_LANGUAGE) {
      node.nodeValue = source;
      return;
    }

    const translated = translations.get(trimmed) || translations.get(reverseTranslations.get(trimmed));
    if (!translated) return;

    const leading = source.match(/^\s*/)?.[0] || '';
    const trailing = source.match(/\s*$/)?.[0] || '';
    node.nodeValue = `${leading}${translated}${trailing}`;
  }

  function rememberAttributes(element) {
    if (!originalAttributes.has(element)) {
      originalAttributes.set(element, {
        placeholder: element.getAttribute('placeholder'),
        ariaLabel: element.getAttribute('aria-label'),
        title: element.getAttribute('title')
      });
    }
  }

  function translateAttributes(element) {
    rememberAttributes(element);
    const originals = originalAttributes.get(element);
    ['placeholder', 'ariaLabel', 'title'].forEach((key) => {
      const attrName = key === 'ariaLabel' ? 'aria-label' : key;
      const original = originals[key];
      if (!original) return;
      if (currentLanguage === SOURCE_LANGUAGE) {
        element.setAttribute(attrName, original);
        return;
      }
      const translated = attributeTranslations.get(normalize(original)) || translations.get(normalize(original));
      if (translated) element.setAttribute(attrName, translated);
    });
  }

  function translateOptions() {
    const selects = Array.from(document.querySelectorAll('select'));
    selects.forEach((select) => {
      Array.from(select.options).forEach((option) => {
        if (!option.dataset.tangramOriginalText) {
          option.dataset.tangramOriginalText = option.text;
        }
        const original = option.dataset.tangramOriginalText;
        if (select.dataset.tangramLanguageSelect === 'true') {
          if (option.value === SOURCE_LANGUAGE) option.text = 'Portuguese';
          if (option.value === TARGET_LANGUAGE) option.text = 'English';
          return;
        }
        option.text = currentLanguage === SOURCE_LANGUAGE
          ? original
          : (translations.get(normalize(original)) || original);
      });
    });
  }

  function setupMarianPresskit() {
    const marianTitle = Array.from(document.querySelectorAll('p, h1, h2, h3, div'))
      .find((element) => normalize(element.textContent) === 'Marian Flow');
    const card = marianTitle?.closest('[class*="framer-"]')?.parentElement?.parentElement || marianTitle?.parentElement;
    const presskitButton = Array.from(card?.querySelectorAll('button') || [])
      .find((button) => normalize(button.textContent) === 'Presskit');
    if (!presskitButton || presskitButton.dataset.tangramPresskitReady === 'true') return;

    presskitButton.dataset.tangramPresskitReady = 'true';
    presskitButton.type = 'button';
    presskitButton.setAttribute('aria-label', 'Open Marian Flow presskit');
    presskitButton.addEventListener('click', (event) => {
      event.preventDefault();
      window.open(MARIAN_PRESSKIT_URL, '_blank', 'noopener');
    });
  }

  function setupFounderCardOrdering() {
    const cards = Array.from(document.querySelectorAll('div'))
      .filter((element) => {
        const text = comparableText(element.textContent);
        const children = Array.from(element.children);
        return (text.startsWith('marian flowformada em marketing')
          || text.startsWith('marian flowwith a background')
          || text.startsWith('ber fontouraber fontoura')
          || text.startsWith('ber fontoura e nascido')
          || text.startsWith('ber fontoura was born'))
          && children.some((child) => child.querySelector('img'))
          && children.some((child) => {
            const childText = comparableText(child.textContent);
            return childText.startsWith('marian flow') || childText.startsWith('ber fontoura');
          });
      });

    cards.forEach((card) => {
      const text = comparableText(card.textContent);
      const isMarian = text.startsWith('marian flow');
      const isBer = text.startsWith('ber fontoura');
      if (!isMarian && !isBer) return;

      const imageChild = Array.from(card.children).find((child) => child.querySelector('img'));
      const contentChild = Array.from(card.children)
        .find((child) => {
          const childText = comparableText(child.textContent);
          return isMarian ? childText.startsWith('marian flow') : childText.startsWith('ber fontoura');
        });
      if (!imageChild || !contentChild) return;

      card.classList.add('tangram-founder-card');
      card.classList.toggle('tangram-founder-card-marian', isMarian);
      card.classList.toggle('tangram-founder-card-ber', isBer);
      imageChild.classList.add('tangram-founder-card__image');
      contentChild.classList.add('tangram-founder-card__content');
      if (isMarian) {
        imageChild.classList.add('tangram-founder-card-marian__image');
        contentChild.classList.add('tangram-founder-card-marian__content');
      }
    });
  }

  function setupContentLayoutTweaks() {
    const highlightsTitle = Array.from(document.querySelectorAll('div, p, h1, h2, h3'))
      .find((element) => normalize(element.textContent) === 'HIGHLIGHTS');
    if (highlightsTitle) highlightsTitle.classList.add('tangram-highlights-title');

    const visualCard = Array.from(document.querySelectorAll('div'))
      .find((element) => {
        const text = comparableText(element.textContent);
        return text.startsWith('visual e projecoesluz em movimento.')
          || text.startsWith('visuals and projectionslight in motion.');
      });
    if (visualCard) {

    const cardShell = visualCard.closest('[class*="container"]') || visualCard.parentElement;
    cardShell?.classList.add('tangram-visual-projections-card');
    visualCard.classList.add('tangram-visual-projections-card__inner');
    Array.from(visualCard.querySelectorAll('div')).forEach((child) => {
      const text = comparableText(child.textContent);
      if (text.startsWith('visual e projecoes')
        || text.startsWith('visuals and projections')
        || text.startsWith('luz em movimento.')
        || text.startsWith('light in motion.')) {
        child.classList.add('tangram-visual-projections-card__content');
      }
    });
    }

    Array.from(document.querySelectorAll('div, p, h1, h2, h3'))
      .filter((element) => {
        const text = comparableText(element.textContent);
        return text === 'proposito' || text === 'purpose';
      })
      .forEach((element) => {
        element.classList.add('tangram-purpose-title');
        const section = element.closest('section');
        section?.classList.add('tangram-purpose-section');
      });

    Array.from(document.querySelectorAll('a, button'))
      .filter((element) => {
        const text = comparableText(element.textContent);
        return text.includes('quero ser um parceiro') || text.includes('i want to be a partner');
      })
      .forEach((element) => element.classList.add('tangram-partner-cta'));

    Array.from(document.querySelectorAll('div, p, h1, h2, h3'))
      .filter((element) => {
        const text = comparableText(element.textContent);
        return text === 'movimento vivo' || text === 'living movement';
      })
      .forEach((element) => {
        element.classList.add('tangram-movement-title');
        element.closest('section')?.classList.add('tangram-movement-section');
      });

    const faqPieces = Array.from(document.querySelectorAll('a, button'))
      .filter((element) => {
        const text = comparableText(element.textContent);
        return ['voce e', 'a peca', 'que faltava', 'you are', 'the piece', 'that was missing'].includes(text);
      });
    faqPieces.forEach((element) => element.classList.add('tangram-faq-piece'));
    const faqRow = faqPieces[0]?.parentElement;
    if (faqRow && faqPieces.every((element) => element.parentElement === faqRow)) {
      faqRow.classList.add('tangram-faq-piece-row');
    } else {
      const commonRow = faqPieces[0]?.parentElement?.parentElement;
      if (commonRow && faqPieces.every((element) => element.parentElement?.parentElement === commonRow)) {
        commonRow.classList.add('tangram-faq-piece-row');
      }
    }

    document
      .querySelectorAll('footer, [role="contentinfo"]')
      .forEach((footer) => footer.classList.add('tangram-site-footer'));
  }

  function setupImageLoadingPerformance() {
    const threshold = window.innerHeight * 1.45;
    document.querySelectorAll('img').forEach((image) => {
      image.decoding = 'async';
      const rect = image.getBoundingClientRect();
      const isHeaderImage = Boolean(image.closest('header'));
      const isHeroSymbol = image.src.includes('mJLl0evtfHxya9YBFapUjtMO8HY.svg');
      if (!isHeaderImage && !isHeroSymbol && rect.top > threshold) {
        image.loading = 'lazy';
      }
    });
  }

  function getWhatsappContext(anchor) {
    const label = normalize(anchor.textContent).toLowerCase();
    const href = anchor.getAttribute('href') || '';

    if (label.includes('last night') || label.includes('loading')) return 'lastNight';
    if (label.includes('quero ser') || label.includes('partner')) return 'partner';
    if (label.includes('iniciar movimento') || label.includes('start movement')) return 'start';
    if (label.includes('fale conosco') || label.includes('contact')) return 'contact';

    const faqLabels = new Set([
      'você é',
      'vocÃª Ã©',
      'voce e',
      'a peça',
      'a peÃ§a',
      'a peca',
      'que faltava',
      'you are',
      'the piece',
      'that was missing'
    ]);
    if (faqLabels.has(label)) return 'faq';

    return /wa\.me\/message|api\.whatsapp\.com/i.test(href) ? 'contact' : null;
  }

  function setupWhatsappMessages() {
    const languageKey = currentLanguage === TARGET_LANGUAGE ? 'en' : 'pt';
    Array.from(document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]')).forEach((anchor) => {
      const context = getWhatsappContext(anchor);
      if (!context) return;
      const message = whatsappMessages[context]?.[languageKey];
      if (!message) return;

      const url = new URL('https://api.whatsapp.com/send/');
      url.searchParams.set('phone', WHATSAPP_PHONE);
      url.searchParams.set('text', message);
      anchor.href = url.toString();
      anchor.rel = 'noopener noreferrer';
      anchor.target = '_blank';
    });
  }

  function setupContactForm() {
    const forms = Array.from(document.querySelectorAll('form[name="tangram-contact"], form.framer-ud8hvz'));
    forms.forEach((form) => {
      form.classList.add('tangram-contact-form');
      form.setAttribute('name', 'tangram-contact');
      form.setAttribute('method', 'POST');

      const fields = Array.from(form.querySelectorAll('input, select, textarea'));
      const visibleFields = fields.filter((field) => field.type !== 'hidden' && field.name !== 'bot-field');
      const nameField = visibleFields.find((field) => normalize(field.getAttribute('placeholder')).toLowerCase().includes('nome')
        || normalize(field.getAttribute('placeholder')).toLowerCase().includes('name'));
      const emailField = visibleFields.find((field) => field.type === 'email'
        || normalize(field.getAttribute('placeholder')).toLowerCase().includes('email'));
      const phone = fields.find((field) => normalize(field.getAttribute('placeholder')) === 'Contato' || normalize(field.getAttribute('placeholder')) === 'Contact');
      const locationField = visibleFields.find((field) => normalize(field.getAttribute('placeholder')).toLowerCase().includes('local')
        || normalize(field.getAttribute('placeholder')).toLowerCase().includes('location'));
      const regionField = visibleFields.find((field) => field.tagName === 'SELECT');
      if (nameField) nameField.setAttribute('name', 'Name');
      if (emailField) emailField.setAttribute('name', 'Email');
      if (phone) {
        phone.setAttribute('type', 'tel');
        phone.setAttribute('name', 'Phone');
      }
      if (locationField) locationField.setAttribute('name', 'Location');
      if (regionField) regionField.setAttribute('name', 'Region');

      if (!form.querySelector('input[name="form-name"]')) {
        const formName = document.createElement('input');
        formName.type = 'hidden';
        formName.name = 'form-name';
        formName.value = 'tangram-contact';
        form.prepend(formName);
      }

      if (!form.querySelector('[name="bot-field"]')) {
        const honeypot = document.createElement('p');
        honeypot.style.display = 'none';
        honeypot.innerHTML = '<label>Não preencher: <input name="bot-field"></label>';
        form.prepend(honeypot);
      }

      if (!form.querySelector('.tangram-form-status')) {
        const status = document.createElement('p');
        status.className = 'tangram-form-status';
        status.setAttribute('aria-live', 'polite');
        form.append(status);
      }

      if (form.dataset.tangramSubmitReady !== 'true') {
        form.dataset.tangramSubmitReady = 'true';
        form.addEventListener('submit', async (event) => {
          event.preventDefault();
          const status = form.querySelector('.tangram-form-status');
          const submitButton = form.querySelector('[type="submit"], button');
          const formData = new FormData(form);
          formData.set('form-name', 'tangram-contact');
          const isLocalPreview = /^(localhost|127\.0\.0\.1)$/i.test(window.location.hostname) || window.location.protocol === 'file:';

          if (status) status.textContent = currentLanguage === TARGET_LANGUAGE ? 'Sending...' : 'Enviando...';
          if (submitButton) submitButton.setAttribute('disabled', 'disabled');

          if (isLocalPreview) {
            if (status) status.textContent = currentLanguage === TARGET_LANGUAGE
              ? 'Form ready. Test submissions are available after deployment.'
              : 'Formulário pronto. Os envios de teste ficam disponíveis depois do deploy.';
            if (submitButton) submitButton.removeAttribute('disabled');
            return;
          }

          try {
            const response = await fetch('/api/contact', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(Object.fromEntries(formData.entries()))
            });
            if (!response.ok) throw new Error('Contact form submission failed');
            form.reset();
            if (status) status.textContent = currentLanguage === TARGET_LANGUAGE
              ? 'Sent. We will get back to you soon.'
              : 'Enviado. Vamos retornar em breve.';
          } catch (_error) {
            if (status) status.textContent = currentLanguage === TARGET_LANGUAGE
              ? 'Could not send. Please try again or contact us on WhatsApp.'
              : 'Não foi possível enviar. Tente de novo ou chame no WhatsApp.';
          } finally {
            if (submitButton) submitButton.removeAttribute('disabled');
          }
        });
      }
    });
  }

  const legacyEventPattern = /BRAS[IÍ]LIA|FLORIPA|Line-UP|HOOPER|EMP[ÓO]RIO ZINGARO|VJ REYSEK|VERANO|TERRAZA MUSIC PARK/i;

  function ticketDownIconMarkup() {
    return `
      <span class="tangram-tablet-ticket-icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="rgb(255, 255, 255)">
          <g color="rgb(255, 255, 255)" weight="duotone">
            <path d="M224,128a96,96,0,1,1-96-96A96,96,0,0,1,224,128Z" opacity="0.2"></path>
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm37.66-85.66a8,8,0,0,1,0,11.32l-32,32a8,8,0,0,1-11.32,0l-32-32a8,8,0,0,1,11.32-11.32L120,148.69V88a8,8,0,0,1,16,0v60.69l18.34-18.35A8,8,0,0,1,165.66,130.34Z"></path>
          </g>
        </svg>
      </span>`;
  }

  function getHeroTitle() {
    if (window.TangramBindings && window.__tangramContent) {
      const lang = window.TangramBindings.currentLanguage(document);
      const val = window.TangramBindings.valueFor(window.__tangramContent, 'hero.title', lang);
      if (val) return val;
    }
    return 'NEXT MOVES 👾';
  }

  function hideLegacyEventSections() {
    Array.from(document.querySelectorAll('section, [id*="evento"], [id*="about-me"], h2, h3, p, div')).forEach((element) => {
      const text = normalize(element.textContent);
      if (!legacyEventPattern.test(text)) return;
      if (/NEXT MOVES|Tickets/i.test(text)) return;
      const section = element.closest('section');
      const target = section && !/NEXT MOVES|Tickets/i.test(normalize(section.textContent))
        ? section
        : element;
      if (target === section && window.innerWidth >= 810 && window.innerWidth <= 1100) {
        target.classList.remove('tangram-hidden-legacy-events');
        target.classList.add('tangram-tablet-next-moves-section');
        target.removeAttribute('aria-hidden');
        if (target.dataset.tangramLegacyNextMoves !== 'true') {
          target.dataset.tangramLegacyNextMoves = 'true';
          target.innerHTML = `
            <div class="tangram-tablet-next-moves">
              <div class="tangram-tablet-next-moves__title">${getHeroTitle()}</div>
              <div class="tangram-tablet-next-moves__tickets">Tickets ${ticketDownIconMarkup()}</div>
              <a class="tangram-tablet-next-moves__loading" href="https://wa.me/message/A2ZXZZRCLLZTP1">loading...</a>
            </div>
          `;
        }
        return;
      }
      target.classList.add('tangram-hidden-legacy-events');
      target.setAttribute('aria-hidden', 'true');
    });
  }

  function cleanupNextMovesEnhancements() {
    document.querySelectorAll('.tangram-next-moves-spacer-target').forEach((element) => {
      element.classList.remove('tangram-next-moves-spacer-target');
    });
  }

  function setupTabletNextMovesFallback() {
    if (document.querySelector('.tangram-tablet-next-moves-fallback')) {
      document.documentElement.classList.add('tangram-has-responsive-fallback');
      return;
    }
    const legacySection = Array.from(document.querySelectorAll('section'))
      .find((section) => legacyEventPattern.test(normalize(section.textContent)));
    if (!legacySection) return;

    const fallback = document.createElement('section');
    fallback.className = 'tangram-tablet-next-moves-fallback';
    fallback.innerHTML = `
      <div class="tangram-tablet-next-moves">
        <div class="tangram-tablet-next-moves__title">${getHeroTitle()}</div>
        <div class="tangram-tablet-next-moves__tickets">Tickets ${ticketDownIconMarkup()}</div>
        <a class="tangram-tablet-next-moves__loading" href="https://wa.me/message/A2ZXZZRCLLZTP1">loading...</a>
      </div>
    `;
    legacySection.insertAdjacentElement('beforebegin', fallback);
    document.documentElement.classList.add('tangram-has-responsive-fallback');
  }

  function setupMobileHeroSymbolOrder() {
    const symbol = document.querySelector('#about-me .tangram-hero-symbol-frame');
    if (!symbol) return;

    if (window.innerWidth > 809) {
      if (mobileHeroSymbolPlacement?.parent) {
        mobileHeroSymbolPlacement.parent.insertBefore(symbol, mobileHeroSymbolPlacement.nextSibling);
      }
      symbol.classList.remove('tangram-mobile-hero-symbol');
      mobileHeroSymbolPlacement = null;
      return;
    }

    const fallback = document.querySelector('.tangram-tablet-next-moves-fallback');
    const nextMoves = fallback?.querySelector('.tangram-tablet-next-moves');
    if (!fallback || !nextMoves) return;

    if (!mobileHeroSymbolPlacement) {
      mobileHeroSymbolPlacement = {
        parent: symbol.parentElement,
        nextSibling: symbol.nextSibling
      };
    }
    symbol.classList.add('tangram-mobile-hero-symbol');
    if (symbol.parentElement !== fallback || symbol.nextElementSibling !== nextMoves) {
      fallback.insertBefore(symbol, nextMoves);
    }
  }

  function getNextMovesLabels() {
    return Array.from(document.querySelectorAll('p, div'))
      .filter((element) => {
        const text = normalize(element.textContent);
        return text === 'NEXT MOVES' || text === 'NEXT MOVES 👾' || text === getHeroTitle().toLowerCase();
      });
  }

  function setupAllNextMovesSections() {
    hideLegacyEventSections();
    setupTabletNextMovesFallback();
    setupMobileHeroSymbolOrder();
    cleanupNextMovesEnhancements();

    let nextMovesLabels = getNextMovesLabels();
    if (window.innerWidth <= 1100) {
      const fallbackLabels = nextMovesLabels.filter((element) => element.closest('.tangram-tablet-next-moves-fallback'));
      if (fallbackLabels.length) nextMovesLabels = fallbackLabels;
    }

    nextMovesLabels.forEach((nextMovesLabel) => {
      const section = nextMovesLabel.closest('section');
      if (!section || section.classList.contains('tangram-hidden-legacy-events')) return;

      const ticketsLabel = Array.from(section.querySelectorAll('p, div'))
        .find((element) => normalize(element.textContent) === 'Tickets' || normalize(element.textContent).startsWith('Tickets '));
      if (!ticketsLabel) return;

      const nextMovesNode = nextMovesLabel.closest('.tangram-tablet-next-moves__title') || nextMovesLabel.closest('[class*="framer-"]') || nextMovesLabel;
      const ticketsNode = ticketsLabel.closest('.tangram-tablet-next-moves__tickets') || ticketsLabel.closest('[class*="framer-"]') || ticketsLabel;
      const loadingBlock = Array.from(section.querySelectorAll('a, div'))
        .find((element) => normalize(element.textContent).toLowerCase() === 'loading...');
      const ticketButtonNode = loadingBlock?.closest('a') || loadingBlock?.closest('.tangram-tablet-next-moves__loading') || loadingBlock?.closest('[class*="framer-"]') || loadingBlock;
      const fallbackHref = ticketButtonNode?.href || loadingBlock?.querySelector?.('a')?.href || 'https://wa.me/message/A2ZXZZRCLLZTP1';

      const info = document.createElement('div');
      info.className = 'tangram-next-moves-info';
      info.innerHTML = `
        <div class="tangram-next-moves-info__item">
          <span>12.06 | D-EDGE SP</span>
          <strong>Nick Curly <em>(DE)</em></strong> + Bhaskar + Marian Flow
        </div>
        <div class="tangram-next-moves-info__item">
          <span>19.06 | D-EDGE RJ</span>
          <strong>Magdalena <em>(DE)</em></strong> + Marian Flow + Rod B + Ber Fontoura + Ryferr e Gadas
        </div>
        <div class="tangram-next-moves-info__item">
          <span>01.08 | Edifício Touring RJ | Last Night</span>
          <strong>Loofy</strong>
        </div>
      `;
      nextMovesNode.style.overflow = 'visible';
      info.remove();
      
      const titleVal = getHeroTitle();
      if (nextMovesLabel.textContent !== titleVal) {
        nextMovesLabel.textContent = titleVal;
      }
      nextMovesNode.classList.add('tangram-next-moves-title');

      const links = ticketsNode.querySelector(':scope > .tangram-next-moves-links') || document.createElement('div');
      const isNewLinks = !links.isConnected;
      links.className = 'tangram-next-moves-links';
      if (isNewLinks) {
      links.innerHTML = `
        <a class="tangram-ticket-link" href="https://ingresse.com/freak120626/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleASQCrRleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAadhGybMkmfb1PFA7sPk8_ZNEUTN1rGp8FLxC5rv9fLGIuxFBRX3zVBT6T_9iA_aem_41Prp33zzC5zUI4SnerfPQ&utm_id=97760_v0_s00_e0_tv3" target="_blank" rel="noopener noreferrer">D-EDGE SP | 12.06</a>
        <a class="tangram-ticket-link" href="https://www.ingresse.com/d-edge-rio-apresenta-tangram/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleASQCqFleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAadIM9mr9KYjuuO-l1trr9WfxTr3rZKg76wkEkW835XFWcEfAX4juRE61-ZksQ_aem_vkUHPKYt2CzGSpCdKwGqDg&utm_id=97760_v0_s00_e0_tv3" target="_blank" rel="noopener noreferrer">D-EDGE RJ | 19.06</a>
        <a class="tangram-ticket-link tangram-ticket-link--loading" href="${fallbackHref}" target="_blank" rel="noopener noreferrer">Edifício Touring RJ | Last Night | 01.08 | Loading...</a>
      `;

      const ticketLabels = [
        '12.06 | D-EDGE SP | NICK CURLY + BHASKAR',
        '19.06 | D-EDGE RJ | MAGDALENA',
        '01.08 | LAST NIGHT | LOOFY'
      ];
      links.querySelectorAll('.tangram-ticket-link').forEach((link, index) => {
        link.textContent = ticketLabels[index] || link.textContent;
      });
      // Ticket content is owned by content/site.json and populated by TangramBindings.
      links.replaceChildren();
      }

      ticketsNode.style.overflow = 'visible';
      ticketsNode.classList.add('tangram-next-moves-ticket-anchor');
      if (ticketButtonNode) {
        ticketButtonNode.style.display = 'none';
        ticketButtonNode.setAttribute('aria-hidden', 'true');
      }
      ticketsNode.appendChild(links);
      let ticketsSectionChild = ticketsNode;
      while (ticketsSectionChild.parentElement && ticketsSectionChild.parentElement !== section) {
        ticketsSectionChild = ticketsSectionChild.parentElement;
      }
      if (ticketsSectionChild.parentElement === section) {
        let sibling = ticketsSectionChild.nextElementSibling;
        while (sibling) {
          if (!sibling.classList.contains('tangram-next-moves-spacer-target') && getComputedStyle(sibling).position !== 'absolute') {
            sibling.classList.add('tangram-next-moves-spacer-target');
          }
          sibling = sibling.nextElementSibling;
        }
      }
    });
    reconcileResponsiveNextMovesTitles();
    window.__tangramTriggerApply?.();
  }

  function isElementVisible(element) {
    if (!element) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  }

  function reconcileResponsiveNextMovesTitles() {
    const fallbackTitle = document.querySelector('.tangram-tablet-next-moves-fallback .tangram-tablet-next-moves__title');
    const fallbackVisible = window.innerWidth <= 1100 && isElementVisible(fallbackTitle);
    document.querySelectorAll('.tangram-next-moves-title:not(.tangram-tablet-next-moves__title)').forEach((element) => {
      if (fallbackVisible) {
        element.style.display = 'none';
        element.style.visibility = 'hidden';
      } else {
        element.style.removeProperty('display');
        element.style.removeProperty('visibility');
      }
    });
  }

  function setupNextMovesEvents() {
    setupAllNextMovesSections();
    return;

    const nextMovesLabel = Array.from(document.querySelectorAll('p, div'))
      .find((element) => normalize(element.textContent) === 'NEXT MOVES');
    const section = nextMovesLabel?.closest('section');
    if (!section) return;

    const ticketsLabel = Array.from(section.querySelectorAll('p, div'))
      .find((element) => normalize(element.textContent) === 'Tickets');
    if (!ticketsLabel) return;

    const nextMovesNode = nextMovesLabel.closest('[class*="framer-"]') || nextMovesLabel;
    const ticketsNode = ticketsLabel.closest('[class*="framer-"]') || ticketsLabel;
    const currentTicketButton = Array.from(section.querySelectorAll('a, div'))
      .find((element) => normalize(element.textContent) === 'loading...' || element.querySelector?.('.tangram-next-moves-inline'));
    const ticketButtonNode = currentTicketButton?.closest('a') || currentTicketButton?.closest('[class*="framer-"]') || currentTicketButton;
    const fallbackHref = ticketButtonNode?.href || currentTicketButton?.querySelector?.('a')?.href || 'https://wa.me/message/A2ZXZZRCLLZTP1';

    const info = document.createElement('div');
    info.className = 'tangram-next-moves-info';
    info.innerHTML = `
      <div class="tangram-next-moves-info__item">
        <span>12.06 | D-EDGE SP</span>
        <strong>Nick Curly <em>(DE)</em></strong> + Bhaskar + Marian Flow
      </div>
      <div class="tangram-next-moves-info__item">
        <span>19.06 | D-EDGE RJ</span>
        <strong>Magdalena <em>(DE)</em></strong> + Marian Flow + Rod B + Ber Fontoura + Ryferr e Gadas
      </div>
      <div class="tangram-next-moves-info__item">
        <span>01.08 | Edifício Touring RJ | Last Night</span>
        <strong>Loofy</strong>
      </div>
    `;
    nextMovesNode.insertAdjacentElement('afterend', info);

    const links = document.createElement('div');
    links.className = 'tangram-next-moves-links';
    links.innerHTML = `
      <a class="tangram-ticket-link" href="https://ingresse.com/freak120626/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleASQCrRleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAadhGybMkmfb1PFA7sPk8_ZNEUTN1rGp8FLxC5rv9fLGIuxFBRX3zVBT6T_9iA_aem_41Prp33zzC5zUI4SnerfPQ&utm_id=97760_v0_s00_e0_tv3" target="_blank" rel="noopener noreferrer">D-EDGE SP | 12.06</a>
      <a class="tangram-ticket-link" href="https://www.ingresse.com/d-edge-rio-apresenta-tangram/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAdGRleASQCqFleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAadIM9mr9KYjuuO-l1trr9WfxTr3rZKg76wkEkW835XFWcEfAX4juRE61-ZksQ_aem_vkUHPKYt2CzGSpCdKwGqDg&utm_id=97760_v0_s00_e0_tv3" target="_blank" rel="noopener noreferrer">D-EDGE RJ | 19.06</a>
      <a class="tangram-ticket-link tangram-ticket-link--loading" href="${fallbackHref}" target="_blank" rel="noopener noreferrer">Edifício Touring RJ | Last Night | 01.08 | Loading...</a>
    `;

    if (ticketButtonNode) {
      ticketButtonNode.replaceWith(links);
    } else {
      ticketsNode.insertAdjacentElement('afterend', links);
    }
    return;

    const loadingBlock = Array.from(section.querySelectorAll('div'))
      .find((element) => normalize(element.textContent) === 'loading...');
    if (!loadingBlock) return;

    loadingBlock.classList.add('tangram-next-moves-loaded');
    loadingBlock.innerHTML = `
      <div class="tangram-next-moves-inline">
        <div class="tangram-next-move">
          <span class="tangram-next-move__meta">12.06 | D-EDGE SP</span>
          <span class="tangram-next-move__artists"><strong>Nick Curly <em>(DE)</em></strong> + Bhaskar + Marian Flow</span>
        </div>
        <div class="tangram-next-move">
          <span class="tangram-next-move__meta">19.06 | D-EDGE RJ</span>
          <span class="tangram-next-move__artists"><strong>Magdalena <em>(DE)</em></strong> + Marian Flow + Rod B + Ber Fontoura + Ryferr e Gadas</span>
        </div>
        <div class="tangram-next-move">
          <span class="tangram-next-move__meta">01.08 | Edifício Touring RJ | Last Night</span>
          <span class="tangram-next-move__artists"><strong>Loofy</strong></span>
        </div>
      </div>
    `;
    return;

    const anchor = loadingBlock?.closest('[class*="framer-"]') || loadingBlock || nextMovesLabel.closest('[class*="framer-"]');
    if (!anchor) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'tangram-next-events';
    wrapper.innerHTML = `
      <div class="tangram-next-events__intro">
        <span>Agenda atual</span>
        <p>Próximos movimentos Tangram</p>
      </div>
      <div class="tangram-next-events__grid">
        <article class="tangram-event-card">
          <div class="tangram-event-card__date">
            <strong>12.06</strong>
            <span>D-EDGE SP</span>
          </div>
          <div class="tangram-event-card__body">
            <p class="tangram-event-card__headliner">Nick Curly <em>(DE)</em></p>
            <p>Bhaskar</p>
            <p>Marian Flow</p>
          </div>
        </article>
        <article class="tangram-event-card">
          <div class="tangram-event-card__date">
            <strong>19.06</strong>
            <span>D-EDGE RJ</span>
          </div>
          <div class="tangram-event-card__body">
            <p class="tangram-event-card__headliner">Magdalena <em>(DE)</em></p>
            <p>Marian Flow + Rod B</p>
            <p>Ber Fontoura + Ryferr e Gadas</p>
          </div>
        </article>
        <article class="tangram-event-card tangram-event-card--feature">
          <div class="tangram-event-card__date">
            <strong>01.08</strong>
            <span>Edifício Touring RJ | Last Night</span>
          </div>
          <div class="tangram-event-card__body">
            <p class="tangram-event-card__headliner">Loofy</p>
          </div>
        </article>
      </div>
    `;

    anchor.insertAdjacentElement('afterend', wrapper);
    alignNextMovesEvents();
  }

  function alignNextMovesEvents() {
    const legacyWrapper = document.querySelector('.tangram-next-events');
    if (legacyWrapper) {
      legacyWrapper.style.setProperty('--tangram-next-events-shift', '0px');
      const rect = legacyWrapper.getBoundingClientRect();
      const targetX = (window.innerWidth - rect.width) / 2;
      const shift = Math.round(targetX - rect.left);
      legacyWrapper.style.setProperty('--tangram-next-events-shift', `${shift}px`);
    }

    document.querySelectorAll('.tangram-next-moves-info, .tangram-next-moves-links').forEach((wrapper) => {
      wrapper.style.setProperty('--tangram-next-moves-shift', '0px');
      if (window.innerWidth < 810) return;
      const rect = wrapper.getBoundingClientRect();
      const targetX = (window.innerWidth - rect.width) / 2;
      const shift = Math.round(targetX - rect.left);
      wrapper.style.setProperty('--tangram-next-moves-shift', `${shift}px`);
    });
  }

  function setupTangramMotionDetails() {
    if (!loaderInitialized && !document.querySelector('.tangram-loader')) {
      loaderInitialized = true;
      const loader = document.createElement('div');
      loader.className = 'tangram-loader';
      loader.setAttribute('aria-hidden', 'true');
      loader.innerHTML = `
        <svg class="tangram-loader-symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 810 810" focusable="false">
          <defs>
            <clipPath id="tangram-loader-clip-a"><path d="M125.367 81H685v648H125.367Zm0 0"/></clipPath>
            <clipPath id="tangram-loader-clip-b"><path d="M125.367 239.914 406.497 81l265.878 461.477-192.477-418.684 204.743 116.121V569.98l-528.7-3.035 437.008 51.953L405.215 729 125.473 569.84l259.629-458.281-259.735 348.406Zm0 0"/></clipPath>
          </defs>
          <g clip-path="url(#tangram-loader-clip-a)">
            <g clip-path="url(#tangram-loader-clip-b)">
              <path fill="currentColor" d="M125.367 81h558.68v648h-558.68Zm0 0"/>
            </g>
          </g>
        </svg>
        <div class="tangram-loader-word">TANGRAM</div>
      `;
      document.body.appendChild(loader);
      window.setTimeout(() => loader.classList.add('is-done'), 1450);
      window.setTimeout(() => loader.remove(), 2350);
    }

    document
      .querySelectorAll('.tangram-side-marquee:not(.tangram-side-marquee--left):not(.tangram-side-marquee--right)')
      .forEach((marquee) => marquee.remove());

    ['left', 'right'].forEach((side) => {
      if (document.querySelector(`.tangram-side-marquee--${side}`)) return;
      const marquee = document.createElement('div');
      marquee.className = `tangram-side-marquee tangram-side-marquee--${side}`;
      marquee.setAttribute('aria-hidden', 'true');
      marquee.innerHTML = `<span>${SIDE_MARQUEE_TEXT}</span>`;
      document.body.appendChild(marquee);
    });
  }

  function setupHeroSymbolMotion() {
    document
      .querySelectorAll('.tangram-side-marquee span')
      .forEach((marqueeText) => {
        marqueeText.textContent = SIDE_MARQUEE_TEXT;
      });

    const heroSymbol = Array.from(document.querySelectorAll('img[src*="mJLl0evtfHxya9YBFapUjtMO8HY.svg"]'))
      .find((image) => {
        const rect = image.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.9 && rect.width > 140 && rect.height > 100;
      });
    if (!heroSymbol) return;

    heroSymbol.classList.add('tangram-hero-symbol-spin');
    const wrapper = heroSymbol.closest('[class*="framer-"]');
    if (wrapper) wrapper.classList.add('tangram-hero-symbol-frame');
  }

  function setupEventsAnchor() {
    const target = document.querySelector('.tangram-next-moves-title');
    if (!target) return;
    target.id = 'eventos';

    const scrollToEvents = () => {
      const liveTarget = document.querySelector('.tangram-next-moves-title');
      if (!liveTarget) return;
      const offset = window.innerWidth < 810 ? 92 : 110;
      const top = liveTarget.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo(0, top);
      history.replaceState(null, '', '#eventos');
    };

    Array.from(document.querySelectorAll('a')).forEach((link) => {
      const label = normalize(link.textContent).toLowerCase();
      if (!['eventos', 'events'].includes(label)) return;

      link.setAttribute('href', '#eventos');
      link.onclick = (event) => {
        event.preventDefault();
        scrollToEvents();
        return false;
      };
      if (link.dataset.tangramEventsBound === 'true') return;
      link.dataset.tangramEventsBound = 'true';
      link.addEventListener('click', (event) => {
        event.preventDefault();
        scrollToEvents();
      });
    });

    if (document.documentElement.dataset.tangramEventsCapture === 'true') return;
    document.documentElement.dataset.tangramEventsCapture = 'true';
    document.addEventListener('click', (event) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!link) return;
      const label = normalize(link.textContent).toLowerCase();
      if (!['eventos', 'events'].includes(label)) return;

      event.preventDefault();
      event.stopPropagation();
      scrollToEvents();
    }, true);
  }

  function setupBackToTopButton() {
    let button = document.querySelector('.tangram-back-top');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'tangram-back-top';
      button.innerHTML = '<span aria-hidden="true">↑</span>';
      document.body.appendChild(button);
      button.addEventListener('click', () => window.scrollTo(0, 0));
      window.addEventListener('scroll', () => {
        button.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.7);
      }, { passive: true });
    }
    button.setAttribute('aria-label', currentLanguage === TARGET_LANGUAGE ? 'Back to top' : 'Voltar ao topo');
  }

  function refreshResponsiveLayout() {
    setupNextMovesEvents();
    alignNextMovesEvents();
    setupFounderCardOrdering();
    setupContentLayoutTweaks();
    setupEventsAnchor();
    setupHeroSymbolMotion();
    setupBackToTopButton();
  }

  function scheduleResponsiveLayoutRefresh() {
    window.clearTimeout(layoutRefreshTimer);
    window.requestAnimationFrame(refreshResponsiveLayout);
    layoutRefreshTimer = window.setTimeout(refreshResponsiveLayout, 220);
    window.setTimeout(refreshResponsiveLayout, 620);
  }

  function walkTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(translateTextNode);
  }

  function applyLanguage() {
    if (applying) return;
    applying = true;
    if (observer) observer.disconnect();

    document.documentElement.lang = currentLanguage === TARGET_LANGUAGE ? 'en' : 'pt-BR';
    ensureLanguageSelect();
    setupCustomLanguagePicker();
    setupNextMovesEvents();
    alignNextMovesEvents();
    walkTextNodes(document.body);
    Array.from(document.querySelectorAll('[placeholder], [aria-label], [title]')).forEach(translateAttributes);
    translateOptions();
    syncLanguagePickerTitle();
    setupMarianPresskit();
    setupFounderCardOrdering();
    setupContentLayoutTweaks();
    setupContactForm();
    setupWhatsappMessages();
    setupTangramMotionDetails();
    setupHeroSymbolMotion();
    setupEventsAnchor();
    setupBackToTopButton();

    if (observer) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    applying = false;
  }

  function setupLanguageObserver() {
    observer = new MutationObserver(() => {
      if (applying) return;
      window.requestAnimationFrame(applyLanguage);
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function setupCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (document.querySelector('.tangram-cursor')) return;

    const cursor = document.createElement('div');
    cursor.className = 'tangram-cursor';
    document.body.appendChild(cursor);

    const move = (event) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`;
      cursor.style.opacity = '1';
      cursor.classList.add('is-visible');
    };

    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseenter', () => cursor.classList.add('is-visible'));
    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
      cursor.classList.remove('is-visible');
    });
    document.addEventListener('mousedown', () => cursor.classList.add('is-active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('is-active'));

    document.addEventListener('mouseover', (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a, button, select, input, textarea, [role="button"]')) {
        cursor.classList.add('is-hovering');
      }
    });
    document.addEventListener('mouseout', (event) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a, button, select, input, textarea, [role="button"]')) {
        cursor.classList.remove('is-hovering');
      }
    });
  }

  function boot() {
    setupInitialScrollReset();
    ensureLanguageSelect();
    setupCustomLanguagePicker();
    setupNextMovesEvents();
    alignNextMovesEvents();
    setupTangramMotionDetails();
    setupHeroSymbolMotion();
    setupEventsAnchor();
    setupBackToTopButton();
    setupWhatsappMessages();
    setupFounderCardOrdering();
    setupContentLayoutTweaks();
    setupImageLoadingPerformance();
    applyLanguage();
    setupLanguageObserver();
    setupCursor();
    window.addEventListener('tangram:content-ready', scheduleResponsiveLayoutRefresh);
    window.setTimeout(applyLanguage, 600);
    window.setTimeout(applyLanguage, 1600);
    window.addEventListener('resize', scheduleResponsiveLayoutRefresh, { passive: true });
    window.addEventListener('orientationchange', scheduleResponsiveLayoutRefresh, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
