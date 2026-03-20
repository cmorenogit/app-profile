export interface PrerecordedResult {
  input: { type: "text" | "audio" | "image" | "query"; label: string; value?: string }
  output: Record<string, any>
  modelName: string
  modelSizeMB: number
}

export const PRERECORDED_RESULTS: Record<string, PrerecordedResult[]> = {
  sentiment: [
    {
      input: {
        type: "text",
        label: "Positive review",
        value: "This product is absolutely amazing! Best purchase I've made all year.",
      },
      output: {
        label: "POSITIVE",
        score: 0.9998,
      },
      modelName: "distilbert-base-uncased-finetuned-sst-2-english",
      modelSizeMB: 67,
    },
    {
      input: {
        type: "text",
        label: "Negative review",
        value: "Terrible experience. The app crashes constantly and support never responds.",
      },
      output: {
        label: "NEGATIVE",
        score: 0.9994,
      },
      modelName: "distilbert-base-uncased-finetuned-sst-2-english",
      modelSizeMB: 67,
    },
    {
      input: {
        type: "text",
        label: "Neutral statement",
        value: "The meeting is scheduled for 3pm in the main conference room.",
      },
      output: {
        label: "POSITIVE",
        score: 0.6827,
      },
      modelName: "distilbert-base-uncased-finetuned-sst-2-english",
      modelSizeMB: 67,
    },
  ],

  summary: [
    {
      input: {
        type: "text",
        label: "AI news article",
        value:
          "Artificial intelligence has transformed the way businesses operate across " +
          "every industry. From automated customer service chatbots to predictive " +
          "analytics in healthcare, AI tools are now embedded in daily workflows. " +
          "Companies that have adopted AI report significant improvements in " +
          "efficiency, with some seeing up to 40% reduction in operational costs. " +
          "However, experts warn that the rapid adoption also brings challenges " +
          "around data privacy, algorithmic bias, and workforce displacement that " +
          "must be addressed through thoughtful regulation and corporate responsibility.",
      },
      output: {
        summary_text:
          "AI tools are now embedded across industries, from chatbots to healthcare " +
          "analytics. Companies report up to 40% cost reduction, but experts warn " +
          "of challenges around privacy, bias, and workforce displacement.",
      },
      modelName: "distilbart-cnn-6-6",
      modelSizeMB: 305,
    },
  ],

  image: [
    {
      input: {
        type: "image",
        label: "Golden retriever in a park",
      },
      output: {
        label: "golden retriever",
        score: 0.9312,
        topResults: [
          { label: "golden retriever", score: 0.9312 },
          { label: "Labrador retriever", score: 0.0234 },
          { label: "cocker spaniel", score: 0.0089 },
        ],
      },
      modelName: "vit-base-patch16-224",
      modelSizeMB: 88,
    },
    {
      input: {
        type: "image",
        label: "Cup of coffee on a wooden table",
      },
      output: {
        label: "espresso",
        score: 0.8745,
        topResults: [
          { label: "espresso", score: 0.8745 },
          { label: "coffee mug", score: 0.0612 },
          { label: "cup", score: 0.0298 },
        ],
      },
      modelName: "vit-base-patch16-224",
      modelSizeMB: 88,
    },
  ],

  rag: [
    {
      input: {
        type: "query",
        label: "Machine learning search",
        value: "How do neural networks learn?",
      },
      output: {
        results: [
          {
            text: "Neural networks learn through backpropagation, adjusting weights based on error gradients.",
            score: 0.8923,
          },
          {
            text: "Deep learning models are trained on large datasets using gradient descent optimization.",
            score: 0.8456,
          },
          {
            text: "The training process involves forward passes, loss computation, and weight updates.",
            score: 0.7891,
          },
        ],
      },
      modelName: "all-MiniLM-L6-v2",
      modelSizeMB: 23,
    },
    {
      input: {
        type: "query",
        label: "Web development search",
        value: "What is server-side rendering?",
      },
      output: {
        results: [
          {
            text: "Server-side rendering generates HTML on the server for each request, improving initial load time and SEO.",
            score: 0.9134,
          },
          {
            text: "SSR frameworks like Next.js render React components on the server before sending them to the client.",
            score: 0.8567,
          },
          {
            text: "Client-side rendering uses JavaScript to build the page in the browser after the initial HTML loads.",
            score: 0.7234,
          },
        ],
      },
      modelName: "all-MiniLM-L6-v2",
      modelSizeMB: 23,
    },
  ],

  whisper: [
    {
      input: {
        type: "audio",
        label: "JFK inaugural address (1961)",
        value: "10-second clip from the inaugural speech",
      },
      output: {
        text: "And so my fellow Americans, ask not what your country can do for you, ask what you can do for your country.",
      },
      modelName: "whisper-tiny.en",
      modelSizeMB: 40,
    },
  ],
}
