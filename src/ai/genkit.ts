
/**
 * @fileoverview This file initializes and configures the Genkit AI framework
 * with the Google AI plugin, setting it up for use across the application.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// Initialize Genkit with the Google AI plugin.
// This requires the GEMINI_API_KEY environment variable to be set.
export const ai = genkit({
  plugins: [
    googleAI({
      // Explicitly providing the API key from environment variables
      // is a good practice for clarity and security.
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
  // We disable telemetry to respect user privacy in this context.
  enableTracing: false,
});
