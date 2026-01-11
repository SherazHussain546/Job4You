'use server';

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

// 1. Initialize API Clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// DeepSeek is compatible with the OpenAI SDK
const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
});


// Helper type to check for quota errors
const isQuotaError = (error: any): boolean => {
  if (error instanceof OpenAI.APIError && error.status === 429) {
    return true;
  }
  if (error instanceof Anthropic.APIError && error.status === 429) {
    return true;
  }
  return false;
};

// 2. Define the provider functions
const callOpenAI = async (prompt: string): Promise<string> => {
  console.log('Attempting to call OpenAI...');
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-0125',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });
  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('OpenAI returned an empty response.');
  }
  console.log('OpenAI call successful.');
  return content;
};

const callAnthropic = async (prompt: string): Promise<string> => {
  console.log('Attempting to call Anthropic...');
  const response = await anthropic.messages.create({
    model: 'claude-3-haiku-20240307',
    max_tokens: 4096,
    messages: [{ role: 'user', content: `${prompt}\n\nReturn ONLY the JSON object.` }],
  });
  
  // Find the JSON content block
  const jsonContent = response.content.find(block => block.type === 'text' && block.text.includes('{'));
  if (!jsonContent || jsonContent.type !== 'text') {
      throw new Error('Anthropic did not return valid JSON content.');
  }

  // Extract the JSON string itself
  const jsonString = jsonContent.text.substring(
    jsonContent.text.indexOf('{'),
    jsonContent.text.lastIndexOf('}') + 1
  );

  if (!jsonString) {
    throw new Error('Could not extract JSON from Anthropic response.');
  }
  console.log('Anthropic call successful.');
  return jsonString;
};

const callDeepSeek = async (prompt: string): Promise<string> => {
    console.log('Attempting to call DeepSeek...');
    const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
    });
    const content = response.choices[0].message.content;
    if (!content) {
        throw new Error('DeepSeek returned an empty response.');
    }
    console.log('DeepSeek call successful.');
    return content;
};


// 3. Create the main failover function
type AIProvider = (prompt: string) => Promise<string>;

const providers: AIProvider[] = [
  callOpenAI,
  callAnthropic,
  callDeepSeek,
];

export async function callGenerativeAI(prompt: string): Promise<string> {
  let lastError: any = null;

  for (const provider of providers) {
    try {
      // If an API key is not set, skip this provider
      if (provider === callOpenAI && !process.env.OPENAI_API_KEY) {
          console.log('Skipping OpenAI: API key not set.');
          continue;
      }
      if (provider === callAnthropic && !process.env.ANTHROPIC_API_KEY) {
          console.log('Skipping Anthropic: API key not set.');
          continue;
      }
      if (provider === callDeepSeek && !process.env.DEEPSEEK_API_KEY) {
          console.log('Skipping DeepSeek: API key not set.');
          continue;
      }
        
      const result = await provider(prompt);
      return result; // If successful, return the result immediately
    } catch (error: any) {
      lastError = error;
      console.warn(`Provider ${provider.name} failed. Reason:`, error.message);
      // If it's a quota error, we continue to the next provider
      if (isQuotaError(error)) {
        continue;
      }
      // If it's another type of error, we fail fast
      break;
    }
  }

  // If all providers failed, throw the last error we received
  throw new Error(`All AI providers failed. Last error: ${lastError?.message || 'Unknown error'}`);
}
