import type { Lang } from './utils';

/**
 * Structured translations for the interactive AI Playground.
 *
 * Kept separate from `ui.ts` (which holds flat `t()`-style chrome strings) because
 * the React demos need a nested, typed object they can receive as a single prop —
 * the same pattern as `Navigation.tsx`'s `labels` prop, scaled to the demo tree.
 *
 * The `.astro` page picks the object by lang and passes it to `<PlaygroundApp t={...} />`,
 * which forwards the relevant slice to each demo. React never reads Astro i18n hooks.
 *
 * Technical terms and proper nouns are intentionally NOT translated (RAG, WebGPU,
 * Whisper, DistilBERT, model ids, etc.).
 */

export interface PlaygroundStrings {
  // Device badges (PlaygroundApp)
  device: {
    webgpu: string;
    wasm: string;
    webgpuSuffix: string;
    mobileAll: string;
    mobileOptimized: string;
    mobileLimited: string;
  };
  // Demo cards (PlaygroundApp)
  demos: {
    sentiment: { title: string; shortTitle: string; description: string };
    summary: { title: string; shortTitle: string; description: string };
    image: { title: string; shortTitle: string; description: string };
    rag: { title: string; shortTitle: string; description: string };
    whisper: { title: string; shortTitle: string; description: string };
  };
  // DemoShell chrome
  shell: {
    howItWorks: string;
    modelLabel: string;
    downloading: string; // "Downloading model..."
    loadingDefault: string;
    fallbackPrefix: string; // "Showing pre-computed results — "
    fallbackDefaultReason: string;
    fallbackHint: string;
  };
  // Per-demo strings
  sentiment: {
    howItWorks: string;
    fallbackReason: string;
    tryExample: string;
    placeholder: string;
    analyzing: string;
    analyze: string;
    result: string;
    confidence: string;
    labels: { positive: string; negative: string; neutral: string };
  };
  summary: {
    howItWorks: string;
    loadingText: string;
    fallbackReason: string;
    tryExample: string;
    placeholder: string;
    words: string; // "words"
    needAtLeast: string; // "— need at least 15"
    summarizing: string;
    summarize: string;
    summary: string;
    couldNotGenerate: string;
    errorGenerating: string;
  };
  image: {
    howItWorks: string;
    fallbackReason: string;
    mustBeUnder: string; // alert
    takePhoto: string;
    chooseGallery: string;
    fileHint: string; // "JPG, PNG, WebP — max 10MB"
    dropPrompt: string;
    classifying: string;
    topPredictions: string;
  };
  rag: {
    howItWorks: string;
    loadingText: string;
    fallbackReason: string;
    tryQuery: string;
    placeholder: string;
    searching: string;
    search: string;
    computing: string;
    embeddingPreview: string; // "Query embedding (first 20 of 384 dimensions):"
    topChunks: string;
    queryPrefix: string; // "Query: "
    similarity: string; // "similarity:"
  };
  whisper: {
    howItWorks: string;
    howItWorksIOS: string;
    fallbackReasonIOS: string;
    loadingText: string;
    exampleLabel: string; // "Example: "
    tryExample: string; // "Try example: JFK speech clip"
    record: string;
    stopRecording: string;
    recordingMobile: (s: number) => string;
    recordingDesktop: string;
    transcribing: string;
    transcript: string;
    noSpeech: string;
    errorTranscribing: string;
    couldNotTranscribe: string;
    errorTranscribingShort: string;
    errors: {
      interrupted: string;
      micDenied: string;
      micNotFound: string;
      micGeneric: string;
      noAudio: string;
    };
  };
}

const en: PlaygroundStrings = {
  device: {
    webgpu: '⚡ WebGPU accelerated',
    wasm: '🔧 Running on WASM (CPU)',
    webgpuSuffix: '— GPU-powered inference',
    mobileAll: '📱 all demos',
    mobileOptimized: '📱 optimized for mobile',
    mobileLimited: '📱 limited demos',
  },
  demos: {
    sentiment: {
      title: 'Sentiment Analysis',
      shortTitle: 'Sentiment',
      description: 'Detects if a text is positive, negative, or neutral',
    },
    summary: {
      title: 'Text Summary',
      shortTitle: 'Summary',
      description: 'Condenses a paragraph into a short summary',
    },
    image: {
      title: 'Image Classification',
      shortTitle: 'Image',
      description: "Identifies what's in a photo",
    },
    rag: {
      title: 'RAG Explorer',
      shortTitle: 'RAG',
      description: 'Semantic search with embeddings and cosine similarity',
    },
    whisper: {
      title: 'Speech-to-Text',
      shortTitle: 'Speech',
      description: 'Transcribe audio from your microphone with Whisper',
    },
  },
  shell: {
    howItWorks: 'How it works:',
    modelLabel: 'Model:',
    downloading: 'Downloading model...',
    loadingDefault: 'Loading model... (first time takes ~10s)',
    fallbackPrefix: 'Showing pre-computed results — ',
    fallbackDefaultReason:
      'this model requires more memory than your device can provide',
    fallbackHint: 'Try on a desktop device for the full interactive experience.',
  },
  sentiment: {
    howItWorks:
      'A DistilBERT model analyzes your text and classifies its emotional tone as positive, negative, or neutral. Everything runs in your browser via WebAssembly.',
    fallbackReason: 'This model (67MB) is too large for your device',
    tryExample: 'Try an example:',
    placeholder: 'Type or paste any text to analyze...',
    analyzing: 'Analyzing...',
    analyze: 'Analyze Sentiment',
    result: 'Result',
    confidence: 'Confidence',
    labels: { positive: 'Positive', negative: 'Negative', neutral: 'Neutral' },
  },
  summary: {
    howItWorks:
      'A DistilBART model reads your text and generates a concise summary capturing the key points. Requires at least 15 words of input. Runs entirely in your browser.',
    loadingText: 'Loading summarization model... (first time takes ~15s)',
    fallbackReason: 'This model (305MB) is too large for your device',
    tryExample: 'Try example: AI impact on software development',
    placeholder: 'Paste a paragraph (at least 15 words) to summarize...',
    words: 'words',
    needAtLeast: '— need at least 15',
    summarizing: 'Summarizing...',
    summarize: 'Summarize',
    summary: 'Summary',
    couldNotGenerate: 'Could not generate summary.',
    errorGenerating: 'Error generating summary. Try a longer text.',
  },
  image: {
    howItWorks:
      'A Vision Transformer (ViT) model analyzes your image and identifies what it contains, with confidence scores for the top 5 predictions. Runs entirely in your browser.',
    fallbackReason: 'This model (88MB) is too large for your device',
    mustBeUnder: 'Image must be under 10MB',
    takePhoto: 'Take Photo',
    chooseGallery: 'Choose from Gallery',
    fileHint: 'JPG, PNG, WebP — max 10MB',
    dropPrompt: 'Drop an image here or click to upload',
    classifying: 'Classifying image...',
    topPredictions: 'Top predictions',
  },
  rag: {
    howItWorks:
      'Your query is converted to a vector embedding, then compared against pre-embedded portfolio chunks using cosine similarity. The most relevant chunks surface as results. Everything runs in your browser — no server involved.',
    loadingText:
      'Loading embedding model + indexing portfolio... (first time takes ~10s)',
    fallbackReason: 'This model (23MB) is too large for your device',
    tryQuery: 'Try a query:',
    placeholder: "Ask anything about Cesar's portfolio...",
    searching: 'Searching...',
    search: 'Search',
    computing: 'Computing embeddings and searching...',
    embeddingPreview: 'Query embedding (first 20 of 384 dimensions):',
    topChunks: 'Top matching chunks (by cosine similarity)',
    queryPrefix: 'Query: ',
    similarity: 'similarity:',
  },
  whisper: {
    howItWorks:
      "OpenAI's Whisper model runs entirely in your browser. Record from your microphone or try an example — audio is transcribed locally without sending data to any server.",
    howItWorksIOS:
      "OpenAI's Whisper model runs entirely in your browser. On iOS, we show a pre-computed example due to Safari memory limitations with autoregressive models.",
    fallbackReasonIOS:
      "Whisper's autoregressive decoder exceeds iOS Safari memory limits",
    loadingText: 'Loading Whisper model... (first time takes ~15s, ~40MB download)',
    exampleLabel: 'Example:',
    tryExample: 'Try example: JFK speech clip',
    record: 'Record',
    stopRecording: 'Stop Recording',
    recordingMobile: (s) => `Recording... ${s}s / 30s`,
    recordingDesktop: 'Recording... (click Stop when done)',
    transcribing: 'Transcribing audio...',
    transcript: 'Transcript',
    noSpeech:
      'No speech detected. Try speaking louder or closer to the microphone.',
    errorTranscribing: 'Error transcribing audio. Try again with a clearer recording.',
    couldNotTranscribe: 'Could not transcribe audio.',
    errorTranscribingShort: 'Error transcribing. Try again.',
    errors: {
      interrupted: 'Audio interrupted. Recording stopped — processing available audio.',
      micDenied:
        'Microphone access denied. Please allow microphone permissions and try again.',
      micNotFound: 'No microphone found. Please connect a microphone.',
      micGeneric:
        'Could not access microphone. Please check your browser permissions.',
      noAudio: 'No audio recorded. Try holding the Record button longer.',
    },
  },
};

const es: PlaygroundStrings = {
  device: {
    webgpu: '⚡ Acelerado con WebGPU',
    wasm: '🔧 Ejecutándose en WASM (CPU)',
    webgpuSuffix: '— inferencia con GPU',
    mobileAll: '📱 todos los demos',
    mobileOptimized: '📱 optimizado para móvil',
    mobileLimited: '📱 demos limitados',
  },
  demos: {
    sentiment: {
      title: 'Análisis de sentimiento',
      shortTitle: 'Sentimiento',
      description: 'Detecta si un texto es positivo, negativo o neutral',
    },
    summary: {
      title: 'Resumen de texto',
      shortTitle: 'Resumen',
      description: 'Condensa un párrafo en un resumen breve',
    },
    image: {
      title: 'Clasificación de imágenes',
      shortTitle: 'Imagen',
      description: 'Identifica qué hay en una foto',
    },
    rag: {
      title: 'RAG Explorer',
      shortTitle: 'RAG',
      description: 'Búsqueda semántica con embeddings y similitud de coseno',
    },
    whisper: {
      title: 'Voz a texto',
      shortTitle: 'Voz',
      description: 'Transcribe audio desde tu micrófono con Whisper',
    },
  },
  shell: {
    howItWorks: 'Cómo funciona:',
    modelLabel: 'Modelo:',
    downloading: 'Descargando modelo...',
    loadingDefault: 'Cargando modelo... (la primera vez tarda ~10s)',
    fallbackPrefix: 'Mostrando resultados precalculados — ',
    fallbackDefaultReason:
      'este modelo requiere más memoria de la que tu dispositivo puede ofrecer',
    fallbackHint:
      'Pruébalo en una computadora de escritorio para la experiencia interactiva completa.',
  },
  sentiment: {
    howItWorks:
      'Un modelo DistilBERT analiza tu texto y clasifica su tono emocional como positivo, negativo o neutral. Todo se ejecuta en tu navegador con WebAssembly.',
    fallbackReason: 'Este modelo (67MB) es demasiado grande para tu dispositivo',
    tryExample: 'Prueba un ejemplo:',
    placeholder: 'Escribe o pega cualquier texto para analizar...',
    analyzing: 'Analizando...',
    analyze: 'Analizar sentimiento',
    result: 'Resultado',
    confidence: 'Confianza',
    labels: { positive: 'Positivo', negative: 'Negativo', neutral: 'Neutral' },
  },
  summary: {
    howItWorks:
      'Un modelo DistilBART lee tu texto y genera un resumen conciso con los puntos clave. Requiere al menos 15 palabras. Se ejecuta por completo en tu navegador.',
    loadingText: 'Cargando modelo de resumen... (la primera vez tarda ~15s)',
    fallbackReason: 'Este modelo (305MB) es demasiado grande para tu dispositivo',
    tryExample: 'Prueba un ejemplo: el impacto de la IA en el desarrollo de software',
    placeholder: 'Pega un párrafo (al menos 15 palabras) para resumir...',
    words: 'palabras',
    needAtLeast: '— se necesitan al menos 15',
    summarizing: 'Resumiendo...',
    summarize: 'Resumir',
    summary: 'Resumen',
    couldNotGenerate: 'No se pudo generar el resumen.',
    errorGenerating: 'Error al generar el resumen. Prueba con un texto más largo.',
  },
  image: {
    howItWorks:
      'Un modelo Vision Transformer (ViT) analiza tu imagen e identifica qué contiene, con puntajes de confianza para las 5 predicciones principales. Se ejecuta por completo en tu navegador.',
    fallbackReason: 'Este modelo (88MB) es demasiado grande para tu dispositivo',
    mustBeUnder: 'La imagen debe pesar menos de 10MB',
    takePhoto: 'Tomar foto',
    chooseGallery: 'Elegir de la galería',
    fileHint: 'JPG, PNG, WebP — máx. 10MB',
    dropPrompt: 'Arrastra una imagen aquí o haz clic para subir',
    classifying: 'Clasificando imagen...',
    topPredictions: 'Predicciones principales',
  },
  rag: {
    howItWorks:
      'Tu consulta se convierte en un vector embedding y luego se compara con fragmentos del portafolio ya embebidos usando similitud de coseno. Los fragmentos más relevantes aparecen como resultados. Todo se ejecuta en tu navegador, sin servidor.',
    loadingText:
      'Cargando modelo de embeddings e indexando el portafolio... (la primera vez tarda ~10s)',
    fallbackReason: 'Este modelo (23MB) es demasiado grande para tu dispositivo',
    tryQuery: 'Prueba una consulta:',
    placeholder: 'Pregunta lo que quieras sobre el portafolio de Cesar...',
    searching: 'Buscando...',
    search: 'Buscar',
    computing: 'Calculando embeddings y buscando...',
    embeddingPreview: 'Embedding de la consulta (primeras 20 de 384 dimensiones):',
    topChunks: 'Fragmentos más relevantes (por similitud de coseno)',
    queryPrefix: 'Consulta: ',
    similarity: 'similitud:',
  },
  whisper: {
    howItWorks:
      'El modelo Whisper de OpenAI se ejecuta por completo en tu navegador. Graba desde tu micrófono o prueba un ejemplo: el audio se transcribe localmente, sin enviar datos a ningún servidor.',
    howItWorksIOS:
      'El modelo Whisper de OpenAI se ejecuta por completo en tu navegador. En iOS mostramos un ejemplo precalculado por las limitaciones de memoria de Safari con modelos autorregresivos.',
    fallbackReasonIOS:
      'El decodificador autorregresivo de Whisper supera los límites de memoria de Safari en iOS',
    loadingText:
      'Cargando modelo Whisper... (la primera vez tarda ~15s, descarga de ~40MB)',
    exampleLabel: 'Ejemplo:',
    tryExample: 'Prueba un ejemplo: fragmento de un discurso de JFK',
    record: 'Grabar',
    stopRecording: 'Detener grabación',
    recordingMobile: (s) => `Grabando... ${s}s / 30s`,
    recordingDesktop: 'Grabando... (haz clic en Detener cuando termines)',
    transcribing: 'Transcribiendo audio...',
    transcript: 'Transcripción',
    noSpeech:
      'No se detectó voz. Intenta hablar más fuerte o más cerca del micrófono.',
    errorTranscribing:
      'Error al transcribir el audio. Inténtalo de nuevo con una grabación más clara.',
    couldNotTranscribe: 'No se pudo transcribir el audio.',
    errorTranscribingShort: 'Error al transcribir. Inténtalo de nuevo.',
    errors: {
      interrupted:
        'Audio interrumpido. La grabación se detuvo; procesando el audio disponible.',
      micDenied:
        'Acceso al micrófono denegado. Permite el acceso al micrófono e inténtalo de nuevo.',
      micNotFound: 'No se encontró un micrófono. Conecta un micrófono.',
      micGeneric:
        'No se pudo acceder al micrófono. Revisa los permisos de tu navegador.',
      noAudio:
        'No se grabó audio. Intenta mantener presionado el botón Grabar por más tiempo.',
    },
  },
};

export const playgroundStrings: Record<Lang, PlaygroundStrings> = { en, es };
