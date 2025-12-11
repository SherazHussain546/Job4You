
/**
 * @fileOverview This file configures a singleton `ai` instance for use throughout the application.
 * It uses the Genkit library and the Google AI plugin.
 *
 * By centralizing the AI client configuration, we can ensure consistent behavior and easy management
 * of the generative AI models used in the app.
 */
import { gemini15Flash, googleAI } from '@genkit-ai/googleai';
import { genkit } from 'genkit';
import { config } from 'dotenv';
config();


export const ai = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});
