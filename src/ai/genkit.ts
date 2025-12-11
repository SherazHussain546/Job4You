
import { config } from 'dotenv';
config();

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({
      models: {
          'gemini-1.5-flash': {
              default: true,
          }
      },
      apiVersion: 'v1beta'
  })],
  flowStateStore: 'firebase',
  traceStore: 'firebase',
});
