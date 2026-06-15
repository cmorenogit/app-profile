export const languages = {
  en: 'EN',
  es: 'ES',
} as const;

export const defaultLang = 'en';

export const ui = {
  en: {
    // Meta
    'meta.title': 'Cesar Moreno | Principal Engineer · AI Systems & Product',
    'meta.description':
      'Principal Engineer · AI Systems & Product. I build the right product with AI — and ship it to production fast. 13 years shipping production systems.',
    'meta.projects.title': 'Projects — Cesar Moreno',
    'meta.projects.description':
      "Things I've built — AI tooling, developer tools and production systems.",

    // Sidebar
    'sidebar.badge': 'Building AI products, end to end',
    'sidebar.role': 'Principal Engineer · AI Systems & Product',
    'sidebar.tagline':
      'I build the right product with AI — and ship it to production fast',
    'sidebar.description':
      '13 years of senior engineering. I pair real product judgment with applied AI to build what actually moves your business — and ship it fast.',
    'lang.switch.aria': 'Language',

    // Navigation
    'nav.approach': 'Approach',
    'nav.work': 'Work',
    'nav.built': 'Built with AI',
    'nav.experience': 'Experience',
    'nav.contact': 'Contact',

    // Approach
    'approach.heading.pre': 'I build ',
    'approach.heading.highlight': 'AI products',
    'approach.heading.post':
      ' that move your business — not AI that just looks impressive.',
    'approach.body.pre': 'Most engineers can use AI. Few know ',
    'approach.body.highlight': 'which',
    'approach.body.mid':
      ' product to build with it. I question the requirement with real usage data, build the scope that actually matters, and ship it in ',
    'approach.body.emph': 'weeks, not months',
    'approach.body.post': '.',
    'approach.pillar1.title': 'Product judgment first',
    'approach.pillar1.body':
      "I don't build what you asked — I build what moves your metric.",
    'approach.pillar2.title': 'Real AI, not hype',
    'approach.pillar2.body':
      'Multi-agent systems and LLM orchestration in production. I build the tooling, not just call an API.',
    'approach.pillar3.title': 'Shipped, not prototyped',
    'approach.pillar3.body':
      'The right scope for where you are, designed to scale.',
    'approach.signature':
      '// the right scope for where you are — built to grow',

    // Selected work
    'work.heading': 'Selected work',
    'work.subtitle': 'Real projects, shipped end to end.',
    'work.ubero.badge': 'design → production · 1 week',
    'work.ubero.body':
      'A custom mini-CMS so the client manages their own product catalog. Zero maintenance cost to start, designed to scale as they grow. From design to production in a single week — and it could have gone faster.',

    // Built with AI
    'built.heading': 'Built with AI',
    'built.subtitle':
      'Proof I know AI deeply — I build the tooling, not just use it.',
    'built.agentes.body':
      'A multi-agent system that automates code review — security, performance, quality and architecture agents running in parallel, across Claude, OpenAI and Gemini.',
    'built.contextforge.body':
      'An MCP server giving AI coding assistants persistent semantic memory — hybrid keyword + vector search, code intelligence across 50+ languages, in a single Rust binary.',
    'built.statusline.body':
      'A real-time statusline for the Claude Code CLI — context usage, rate limits and git state, rendered in under 50ms. Published on npm.',
    'built.playground.title': 'Try the AI Playground — live in your browser',
    'built.playground.body.pre':
      'Sentiment, RAG, summarization, speech-to-text and image models running client-side. ',
    'built.playground.body.highlight':
      'The chat button in the corner is one of them.',
    'built.playground.body.post':
      ' The kind of AI-product feature I drop into real products.',
    'built.playground.cta': 'Try the playground →',
    'built.seeAll': 'See all projects →',

    // Experience
    'experience.heading': 'Experience',
    'experience.p1.pre':
      "13 years shipping software to production taught me the bottleneck isn't the code — it's deciding ",
    'experience.p1.highlight': 'what',
    'experience.p1.post':
      ' to build. That was my evolution: from writing software to building with product judgment, using AI to deliver in a fraction of the time.',
    'experience.p2.pre': 'Today, as ',
    'experience.p2.highlight': 'Principal Engineer at Apprecio',
    'experience.p2.post':
      ", I'm the technical reference for a rewards platform across 6 LATAM countries. Before that — leading product and data on a B2B platform — I learned to measure what matters: the seed of seeing software through the business.",

    // Contact
    'contact.heading': 'Have something in mind?',
    'contact.body':
      "If you're building something with AI — or want to — send me an email and tell me about it.",
    'contact.subtext':
      'Just exploring? The chat button in the corner answers anything about my work.',
    'contact.cta': 'Send me an email →',
    'contact.byline': 'Designed & built by Cesar Moreno',

    // Projects page
    'projects.back': '← Back to home',
    'projects.heading': 'Projects',
    'projects.subtitle':
      "Things I've built — AI tooling, developer tools and production systems.",
  },
  es: {
    // Meta
    'meta.title': 'Cesar Moreno | Ingeniero Principal · IA y Producto',
    'meta.description':
      'Ingeniero Principal · IA y Producto. Construyo el producto correcto con IA — y lo llevo a producción rápido. 13 años llevando sistemas a producción.',
    'meta.projects.title': 'Proyectos — Cesar Moreno',
    'meta.projects.description':
      'Cosas que construí — tooling de IA, herramientas para devs y sistemas en producción.',

    // Sidebar
    'sidebar.badge': 'Construyo productos con IA, de punta a punta',
    'sidebar.role': 'Ingeniero Principal · IA y Producto',
    'sidebar.tagline':
      'Construyo el producto correcto con IA — y lo llevo a producción rápido',
    'sidebar.description':
      '13 años de ingeniería senior. Combino criterio de producto real con IA aplicada para construir lo que de verdad mueve tu negocio — y lo entrego rápido.',
    'lang.switch.aria': 'Idioma',

    // Navigation
    'nav.approach': 'Enfoque',
    'nav.work': 'Trabajo',
    'nav.built': 'Construido con IA',
    'nav.experience': 'Experiencia',
    'nav.contact': 'Contacto',

    // Approach
    'approach.heading.pre': 'Construyo ',
    'approach.heading.highlight': 'productos con IA',
    'approach.heading.post':
      ' que mueven tu negocio — no IA que solo impresiona.',
    'approach.body.pre': 'Casi todos pueden usar IA. Pocos saben ',
    'approach.body.highlight': 'QUÉ',
    'approach.body.mid':
      ' producto construir con ella. Cuestiono el requerimiento con datos de uso real, construyo el scope que de verdad importa, y lo entrego en ',
    'approach.body.emph': 'semanas, no meses',
    'approach.body.post': '.',
    'approach.pillar1.title': 'Criterio de producto primero',
    'approach.pillar1.body':
      'No construyo lo que pediste — construyo lo que mueve tu métrica.',
    'approach.pillar2.title': 'IA de verdad, no hype',
    'approach.pillar2.body':
      'Sistemas multi-agente y orquestación de LLMs en producción. Construyo las herramientas, no solo llamo a una API.',
    'approach.pillar3.title': 'Entregado, no prototipado',
    'approach.pillar3.body':
      'El scope justo para tu etapa, diseñado para escalar.',
    'approach.signature':
      '// el scope justo para tu etapa — diseñado para crecer',

    // Selected work
    'work.heading': 'Trabajo seleccionado',
    'work.subtitle': 'Proyectos reales, entregados de punta a punta.',
    'work.ubero.badge': 'diseño → producción · 1 semana',
    'work.ubero.body':
      'Un mini-CMS a medida para que el cliente gestione su propio catálogo de productos. Costo de mantenimiento cero al inicio, diseñado para escalar a medida que crece. De diseño a producción en una sola semana — y pudo ser más rápido.',

    // Built with AI
    'built.heading': 'Construido con IA',
    'built.subtitle':
      'Prueba de que domino IA en serio — construyo las herramientas, no solo las uso.',
    'built.agentes.body':
      'Un sistema multi-agente que automatiza el code review — agentes de seguridad, performance, calidad y arquitectura corriendo en paralelo, sobre Claude, OpenAI y Gemini.',
    'built.contextforge.body':
      'Un servidor MCP que da memoria semántica persistente a los asistentes de IA de código — búsqueda híbrida (keyword + vectorial), inteligencia de código en 50+ lenguajes, en un único binario Rust.',
    'built.statusline.body':
      'Una statusline en tiempo real para el CLI de Claude Code — uso de contexto, rate limits y estado de git, renderizado en menos de 50ms. Publicada en npm.',
    'built.playground.title': 'Probá el AI Playground — en vivo en tu navegador',
    'built.playground.body.pre':
      'Sentiment, RAG, summarización, speech-to-text y modelos de imagen corriendo del lado del cliente. ',
    'built.playground.body.highlight':
      'El botón de chat de la esquina es uno de ellos.',
    'built.playground.body.post':
      ' El tipo de feature de IA-producto que integro en productos reales.',
    'built.playground.cta': 'Probá el playground →',
    'built.seeAll': 'Ver todos los proyectos →',

    // Experience
    'experience.heading': 'Experiencia',
    'experience.p1.pre':
      '13 años llevando software a producción me enseñaron que el código no es el cuello de botella: lo es decidir ',
    'experience.p1.highlight': 'QUÉ',
    'experience.p1.post':
      ' construir. Mi evolución fue esa — de escribir software a construir con criterio de producto, usando la IA para entregar en una fracción del tiempo.',
    'experience.p2.pre': 'Hoy, como ',
    'experience.p2.highlight': 'Ingeniero Principal en Apprecio',
    'experience.p2.post':
      ', soy referente técnico de una plataforma de rewards en 6 países de LATAM. Antes, liderando producto y datos en una plataforma B2B, aprendí a medir lo que importa: el germen de mirar el software desde el negocio.',

    // Contact
    'contact.heading': '¿Tenés algo en mente?',
    'contact.body':
      'Si estás construyendo algo con IA — o querés hacerlo — escribime un email y contame.',
    'contact.subtext':
      '¿Solo explorando? El chat de la esquina responde lo que sea sobre mi trabajo.',
    'contact.cta': 'Escribime un email →',
    'contact.byline': 'Diseñado y construido por Cesar Moreno',

    // Projects page
    'projects.back': '← Volver al inicio',
    'projects.heading': 'Proyectos',
    'projects.subtitle':
      'Cosas que construí — tooling de IA, herramientas para devs y sistemas en producción.',
  },
} as const;
